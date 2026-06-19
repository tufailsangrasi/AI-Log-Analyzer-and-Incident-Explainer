from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.transaction import Transaction, TransactionStatus
from app.models.validation_result import ValidationResult, ErrorType
from typing import Dict, Any, List

class SegregationService:
    def __init__(self, db: Session):
        self.db = db

    def get_missing_elements_report(self) -> Dict[str, Any]:
        """Generate the missing elements report for the dashboard"""
        # Find transactions with missing elements
        missing_results = self.db.query(
            ValidationResult.field_number,
            ValidationResult.field_name,
            func.count(ValidationResult.id).label('occurrences')
        ).filter(
            ValidationResult.error_type == ErrorType.MISSING
        ).group_by(
            ValidationResult.field_number,
            ValidationResult.field_name
        ).order_by(
            func.count(ValidationResult.id).desc()
        ).all()

        missing_elements = []
        for r in missing_results:
            severity = "high" if r.occurrences > 10 else "medium" # Simple logic
            missing_elements.append({
                "fieldNumber": r.field_number,
                "fieldName": r.field_name,
                "description": f"Mandatory field {r.field_name} missing",
                "occurrences": r.occurrences,
                "severity": severity
            })

        # Find error patterns
        error_results = self.db.query(
            ValidationResult.error_type,
            func.count(ValidationResult.id).label('count'),
            func.count(func.distinct(ValidationResult.transaction_id)).label('affected')
        ).group_by(
            ValidationResult.error_type
        ).all()

        patterns = []
        for r in error_results:
            severity = "critical" if r.error_type == ErrorType.MISSING else "high"
            patterns.append({
                "pattern": f"{r.error_type.value.capitalize()} Validation Failures",
                "count": r.count,
                "affectedTransactions": r.affected,
                "severity": severity
            })

        # Field frequency (mocked for now based on db size)
        total_txns = self.db.query(Transaction).count()
        field_frequency = []
        if total_txns > 0:
            for field_num, name in [(2, "PAN"), (3, "Processing Code"), (4, "Amount"), (11, "STAN"), (41, "Terminal ID")]:
                # Count how many txns have this field (approximate by total - missing)
                missing_count = self.db.query(ValidationResult).filter(
                    ValidationResult.field_number == field_num,
                    ValidationResult.error_type == ErrorType.MISSING
                ).count()
                presence = ((total_txns - missing_count) / total_txns) * 100
                field_frequency.append({
                    "fieldName": f"DE{field_num} - {name}",
                    "presencePercentage": round(presence, 1)
                })

        return {
            "totalTransactionsAnalyzed": total_txns,
            "missingElements": missing_elements,
            "errorPatterns": patterns,
            "fieldFrequency": field_frequency
        }
