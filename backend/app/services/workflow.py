"""
Workflow Orchestrator
Runs the 6-agent pipeline sequentially and collects results.
"""

from dataclasses import dataclass, field, asdict
from sqlalchemy.orm import Session

from app.agents.validation_agent import ValidationAgent, ValidationResult
from app.agents.parser_agent import ParserAgent, ParseResult
from app.agents.extraction_agent import ExtractionAgent, ExtractionResult
from app.agents.identification_agent import IdentificationAgent, IdentificationResult
from app.agents.explanation_agent import ExplanationAgent, ExplanationResult
from app.agents.storage_agent import StorageAgent, StorageResult


@dataclass
class AgentStatus:
    name: str
    status: str = "pending"  # pending, running, completed, failed
    error: str = ""


@dataclass
class WorkflowResult:
    agents: list[dict]
    validation: dict | None = None
    parse: dict | None = None
    extraction: dict | None = None
    identification: dict | None = None
    explanation: dict | None = None
    storage: dict | None = None
    success: bool = False
    error: str = ""


class WorkflowOrchestrator:
    """Orchestrates the 6-agent pipeline for ISO 8583 log analysis."""

    def __init__(self, db: Session):
        self.db = db
        self.agents: list[AgentStatus] = [
            AgentStatus(name="Validation Agent"),
            AgentStatus(name="ISO Parser Agent"),
            AgentStatus(name="Field Extraction Agent"),
            AgentStatus(name="Transaction Identification Agent"),
            AgentStatus(name="Explanation Agent"),
            AgentStatus(name="Database Storage Agent"),
        ]

    def run(self, file_content: str, file_name: str, file_size: int) -> WorkflowResult:
        """Execute the complete analysis pipeline."""
        result = WorkflowResult(agents=[asdict(a) for a in self.agents])

        # ── Agent 1: Validation ──
        self.agents[0].status = "running"
        try:
            validation_agent = ValidationAgent()
            validation_result = validation_agent.run(file_content, file_name)
            self.agents[0].status = "completed"

            result.validation = {
                "is_valid": validation_result.is_valid,
                "file_type": validation_result.file_type,
                "encoding": validation_result.encoding,
                "has_iso_fields": validation_result.has_iso_fields,
                "line_count": validation_result.line_count,
                "errors": validation_result.errors,
            }

            if not validation_result.is_valid:
                self.agents[0].status = "failed"
                self.agents[0].error = "; ".join(validation_result.errors)
                # Mark remaining agents as failed
                for i in range(1, 6):
                    self.agents[i].status = "failed"
                    self.agents[i].error = "Skipped due to validation failure"
                result.agents = [asdict(a) for a in self.agents]
                result.error = "Validation failed: " + "; ".join(validation_result.errors)
                return result

        except Exception as e:
            self.agents[0].status = "failed"
            self.agents[0].error = str(e)
            for i in range(1, 6):
                self.agents[i].status = "failed"
            result.agents = [asdict(a) for a in self.agents]
            result.error = f"Validation agent error: {str(e)}"
            return result

        # ── Agent 2: ISO Parser ──
        self.agents[1].status = "running"
        try:
            parser_agent = ParserAgent()
            parse_result = parser_agent.run(file_content)
            self.agents[1].status = "completed"

            result.parse = {
                "mti": parse_result.mti,
                "bitmap": parse_result.bitmap,
                "field_count": len(parse_result.raw_fields),
                "parse_errors": parse_result.parse_errors,
                "is_parsed": parse_result.is_parsed,
            }

            if not parse_result.is_parsed:
                self.agents[1].status = "failed"
                for i in range(2, 6):
                    self.agents[i].status = "failed"
                result.agents = [asdict(a) for a in self.agents]
                result.error = "Parse failed: no valid ISO 8583 fields found"
                return result

        except Exception as e:
            self.agents[1].status = "failed"
            self.agents[1].error = str(e)
            for i in range(2, 6):
                self.agents[i].status = "failed"
            result.agents = [asdict(a) for a in self.agents]
            result.error = f"Parser agent error: {str(e)}"
            return result

        # ── Agent 3: Field Extraction ──
        self.agents[2].status = "running"
        try:
            extraction_agent = ExtractionAgent()
            extraction_result = extraction_agent.run(parse_result.raw_fields)
            self.agents[2].status = "completed"

            result.extraction = {
                "fields": [
                    {
                        "field_number": f.field_number,
                        "field_name": f.field_name,
                        "value": f.value,
                        "present": f.present,
                    }
                    for f in extraction_result.fields
                ],
                "field_count": extraction_result.field_count,
                "errors": extraction_result.errors,
            }

        except Exception as e:
            self.agents[2].status = "failed"
            self.agents[2].error = str(e)
            for i in range(3, 6):
                self.agents[i].status = "failed"
            result.agents = [asdict(a) for a in self.agents]
            result.error = f"Extraction agent error: {str(e)}"
            return result

        # ── Agent 4: Transaction Identification ──
        self.agents[3].status = "running"
        try:
            identification_agent = IdentificationAgent()
            identification_result = identification_agent.run(
                parse_result.raw_fields, parse_result.mti
            )
            self.agents[3].status = "completed"

            result.identification = {
                "transaction_type": identification_result.transaction_type,
                "confidence": identification_result.confidence,
                "identification_method": identification_result.identification_method,
                "details": identification_result.details,
            }

        except Exception as e:
            self.agents[3].status = "failed"
            self.agents[3].error = str(e)
            for i in range(4, 6):
                self.agents[i].status = "failed"
            result.agents = [asdict(a) for a in self.agents]
            result.error = f"Identification agent error: {str(e)}"
            return result

        # ── Agent 5: Explanation ──
        self.agents[4].status = "running"
        try:
            explanation_agent = ExplanationAgent()
            explanation_result = explanation_agent.run(
                transaction_type=identification_result.transaction_type,
                raw_fields=parse_result.raw_fields,
                mti=parse_result.mti,
                field_count=extraction_result.field_count,
            )
            self.agents[4].status = "completed"

            result.explanation = {
                "transaction_type": explanation_result.transaction_type,
                "response_code": explanation_result.response_code,
                "response_meaning": explanation_result.response_meaning,
                "status": explanation_result.status,
                "stan": explanation_result.stan,
                "rrn": explanation_result.rrn,
                "explanation_text": explanation_result.explanation_text,
            }

        except Exception as e:
            self.agents[4].status = "failed"
            self.agents[4].error = str(e)
            self.agents[5].status = "failed"
            result.agents = [asdict(a) for a in self.agents]
            result.error = f"Explanation agent error: {str(e)}"
            return result

        # ── Agent 6: Database Storage ──
        self.agents[5].status = "running"
        try:
            storage_agent = StorageAgent()
            storage_result = storage_agent.run(
                db=self.db,
                file_name=file_name,
                file_size=file_size,
                mti=parse_result.mti,
                transaction_type=identification_result.transaction_type,
                response_code=explanation_result.response_code,
                analysis_summary=explanation_result.explanation_text,
                raw_log=file_content,
                raw_fields=parse_result.raw_fields,
            )
            self.agents[5].status = "completed" if storage_result.is_stored else "failed"

            result.storage = {
                "record_id": storage_result.record_id,
                "fields_stored": storage_result.fields_stored,
                "storage_timestamp": storage_result.storage_timestamp,
                "database_status": storage_result.database_status,
                "is_stored": storage_result.is_stored,
                "errors": storage_result.errors,
            }

        except Exception as e:
            self.agents[5].status = "failed"
            self.agents[5].error = str(e)
            result.agents = [asdict(a) for a in self.agents]
            result.error = f"Storage agent error: {str(e)}"
            return result

        result.agents = [asdict(a) for a in self.agents]
        result.success = True
        return result
