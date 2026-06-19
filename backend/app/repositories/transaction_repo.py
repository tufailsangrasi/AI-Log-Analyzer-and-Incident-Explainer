from sqlalchemy.orm import Session
from app.models.transaction import Transaction
from typing import List, Optional

def create_transaction(db: Session, transaction: Transaction) -> Transaction:
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction

def get_transaction_by_id(db: Session, transaction_id: str) -> Optional[Transaction]:
    return db.query(Transaction).filter(Transaction.id == transaction_id).first()

def get_transactions(db: Session, skip: int = 0, limit: int = 100) -> List[Transaction]:
    return db.query(Transaction).offset(skip).limit(limit).all()

def get_transactions_count(db: Session) -> int:
    return db.query(Transaction).count()
