from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from app.models.uploaded_file import UploadedFile, UploadStatus
from app.models.transaction import Transaction, TransactionStatus
from app.services.validation_service import ValidationService
from app.utils.iso_parser import parse_iso_log_file, extract_core_fields
from app.utils.helpers import mask_pan
from app.repositories import transaction_repo, file_repo, validation_repo
import uuid

class ParserService:
    def __init__(self, db: Session, validation_service: ValidationService):
        self.db = db
        self.validation_service = validation_service

    def process_file(self, filename: str, content: str, file_size: int) -> UploadedFile:
        # Create file record
        file_record = UploadedFile(
            filename=filename,
            file_size=file_size,
            status=UploadStatus.PROCESSING
        )
        file_repo.create_uploaded_file(self.db, file_record)

        # Parse transactions
        raw_transactions = parse_iso_log_file(content)
        total_parsed = len(raw_transactions)
        
        valid_count = 0
        invalid_count = 0

        for raw_txn in raw_transactions:
            core_fields = extract_core_fields(raw_txn)
            txn_id = str(uuid.uuid4())
            
            # Validate
            is_valid, validation_results = self.validation_service.validate_transaction(raw_txn, txn_id)
            
            status = TransactionStatus.VALID if is_valid else TransactionStatus.INVALID
            if is_valid:
                valid_count += 1
            else:
                invalid_count += 1

            # Save transaction
            transaction = Transaction(
                id=txn_id,
                file_id=file_record.id,
                transaction_key=core_fields['transaction_key'],
                mti=core_fields['mti'],
                pan=mask_pan(core_fields['pan']),
                processing_code=core_fields['processing_code'],
                amount=core_fields['amount'],
                stan=core_fields['stan'],
                terminal_id=core_fields['terminal_id'],
                status=status,
                raw_fields=core_fields['raw_fields']
            )
            transaction_repo.create_transaction(self.db, transaction)

            # Save validation results
            for vr in validation_results:
                validation_repo.create_validation_result(self.db, vr)

        # Update file stats
        file_record.total_transactions = total_parsed
        file_record.valid_count = valid_count
        file_record.invalid_count = invalid_count
        file_record.status = UploadStatus.COMPLETED
        file_repo.update_uploaded_file(self.db, file_record)

        return file_record
