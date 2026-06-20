"""
Transaction Identification Agent
Determines transaction type from ISO 8583 fields.
"""

from dataclasses import dataclass
from app.utils.field_map import identify_transaction_type


@dataclass
class IdentificationResult:
    transaction_type: str
    confidence: str          # "high", "medium", "low"
    identification_method: str  # How the type was determined
    details: dict[str, str]


class IdentificationAgent:
    """Agent 4: Identifies the transaction type from parsed ISO fields."""

    # Known IBFT patterns
    IBFT_INDICATORS = {
        "processing_codes": {"40", "26"},
        "account_fields": {"DE102", "DE103"},
    }

    def run(self, raw_fields: dict[str, str], mti: str) -> IdentificationResult:
        """Identify the transaction type."""
        processing_code = raw_fields.get("DE3", "")
        de102 = raw_fields.get("DE102", "")
        de103 = raw_fields.get("DE103", "")
        response_code = raw_fields.get("DE39", "")

        # Strategy 1: Check for IBFT (both DE102 and DE103 present)
        if de102 and de103:
            return IdentificationResult(
                transaction_type="IBFT",
                confidence="high",
                identification_method="Account fields DE-102 and DE-103 both present",
                details={
                    "source_account": de102,
                    "destination_account": de103,
                    "response_code": response_code,
                },
            )

        # Strategy 2: Check for Fund Transfer via processing code prefix
        if processing_code:
            prefix = processing_code[:2]

            if prefix == "40":
                txn_type = "Fund Transfer"
                if de102 or de103:
                    txn_type = "IBFT"
                return IdentificationResult(
                    transaction_type=txn_type,
                    confidence="high",
                    identification_method=f"Processing code {processing_code} prefix 40",
                    details={"processing_code": processing_code, "response_code": response_code},
                )

            if prefix == "01":
                return IdentificationResult(
                    transaction_type="Cash Withdrawal",
                    confidence="high",
                    identification_method=f"Processing code {processing_code} prefix 01",
                    details={"processing_code": processing_code, "response_code": response_code},
                )

            if prefix == "00":
                return IdentificationResult(
                    transaction_type="Purchase",
                    confidence="high",
                    identification_method=f"Processing code {processing_code} prefix 00",
                    details={"processing_code": processing_code, "response_code": response_code},
                )

            if prefix in ("30", "31"):
                return IdentificationResult(
                    transaction_type="Balance Inquiry",
                    confidence="high",
                    identification_method=f"Processing code {processing_code} prefix {prefix}",
                    details={"processing_code": processing_code, "response_code": response_code},
                )

            if prefix == "38":
                return IdentificationResult(
                    transaction_type="Mini Statement",
                    confidence="high",
                    identification_method=f"Processing code {processing_code} prefix 38",
                    details={"processing_code": processing_code, "response_code": response_code},
                )

            if prefix == "20":
                return IdentificationResult(
                    transaction_type="Refund",
                    confidence="high",
                    identification_method=f"Processing code {processing_code} prefix 20",
                    details={"processing_code": processing_code, "response_code": response_code},
                )

        # Strategy 3: Check MTI for reversal
        if mti in ("0400", "0420"):
            return IdentificationResult(
                transaction_type="Reversal",
                confidence="high",
                identification_method=f"MTI {mti} indicates reversal",
                details={"mti": mti, "response_code": response_code},
            )

        # Strategy 4: General identification from MTI
        txn_type = identify_transaction_type(processing_code, mti)

        return IdentificationResult(
            transaction_type=txn_type,
            confidence="medium" if txn_type != "Unknown Transaction" else "low",
            identification_method="MTI-based fallback identification",
            details={
                "mti": mti,
                "processing_code": processing_code,
                "response_code": response_code,
            },
        )
