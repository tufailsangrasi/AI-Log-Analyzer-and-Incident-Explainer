"""
Database Storage Agent
Stores parsed ISO 8583 transaction results into PostgreSQL.
"""

import re
from dataclasses import dataclass
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models.iso_transaction import Iso8583Transaction


@dataclass
class StorageResult:
    record_id: str
    fields_stored: int
    storage_timestamp: str
    database_status: str
    is_stored: bool
    errors: list[str]


class StorageAgent:
    """Agent 6: Stores parsed results in the database."""

    # All supported DE numbers for column mapping
    SUPPORTED_DE_NUMBERS = [
        2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 18,
        22, 23, 25, 26, 28, 30, 32, 33, 35, 37, 38, 39,
        41, 42, 43, 48, 49, 50, 51, 52, 54, 55, 56,
        60, 61, 62, 63, 90, 95, 100, 102, 103,
        120, 123, 124, 125, 126, 127, 128,
    ]

    def run(
        self,
        db: Session,
        file_name: str,
        file_size: int,
        mti: str,
        transaction_type: str,
        response_code: str,
        analysis_summary: str,
        raw_log: str,
        raw_fields: dict[str, str],
    ) -> StorageResult:
        """Store the transaction analysis in the database."""
        errors: list[str] = []
        now = datetime.now(timezone.utc)

        try:
            # Build the record
            record = Iso8583Transaction(
                uploaded_file_name=file_name,
                file_size=file_size,
                mti=mti,
                transaction_type=transaction_type,
                response_code=response_code,
                analysis_summary=analysis_summary,
                raw_log=raw_log,
                created_at=now,
            )

            # Set DE value and presence columns
            fields_stored = 0
            for de_num in self.SUPPORTED_DE_NUMBERS:
                de_key = f"DE{de_num}"
                value = raw_fields.get(de_key)

                value_col = f"de{de_num}_value"
                present_col = f"de{de_num}_present"

                if value is not None and value != "":
                    setattr(record, value_col, str(value))
                    setattr(record, present_col, True)
                    fields_stored += 1
                else:
                    setattr(record, value_col, None)
                    setattr(record, present_col, False)

            db.add(record)
            db.commit()
            db.refresh(record)

            return StorageResult(
                record_id=record.id,
                fields_stored=fields_stored,
                storage_timestamp=now.isoformat(),
                database_status="Connected",
                is_stored=True,
                errors=[],
            )

        except Exception as e:
            db.rollback()
            errors.append(f"Database storage failed: {str(e)}")
            return StorageResult(
                record_id="",
                fields_stored=0,
                storage_timestamp=now.isoformat(),
                database_status="Error",
                is_stored=False,
                errors=errors,
            )
