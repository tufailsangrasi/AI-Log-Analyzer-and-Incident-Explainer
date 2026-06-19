from sqlalchemy.orm import Session
from app.models.validation_result import ValidationResult
from typing import List

def create_validation_result(db: Session, result: ValidationResult) -> ValidationResult:
    db.add(result)
    db.commit()
    db.refresh(result)
    return result

def get_validation_results_by_transaction(db: Session, transaction_id: str) -> List[ValidationResult]:
    return db.query(ValidationResult).filter(ValidationResult.transaction_id == transaction_id).all()

def get_all_validation_results(db: Session) -> List[ValidationResult]:
    return db.query(ValidationResult).all()
