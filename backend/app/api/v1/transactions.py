from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.core.database import get_db
from app.schemas.transaction_schema import PaginatedTransactionResponse, TransactionResponse
from app.models.transaction import Transaction
from typing import Optional

router = APIRouter()

@router.get("/", response_model=PaginatedTransactionResponse)
def get_transactions(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=100),
    status: Optional[str] = None,
    mti: Optional[str] = None
):
    query = db.query(Transaction)
    
    if status and status != 'all':
        query = query.filter(Transaction.status == status)
    if mti and mti != 'all':
        query = query.filter(Transaction.mti == mti)
        
    total = query.count()
    total_pages = (total + pageSize - 1) // pageSize
    
    transactions = query.order_by(desc(Transaction.created_at)).offset((page - 1) * pageSize).limit(pageSize).all()
    
    result_data = []
    for t in transactions:
        result_data.append({
            "id": t.id,
            "timestamp": t.created_at.isoformat() + "Z",
            "mti": t.mti,
            "pan": t.pan,
            "amount": t.amount,
            "currency_code": "840",
            "response_code": "00",
            "response_description": "Approved" if t.status == 'valid' else "Declined",
            "processing_code": t.processing_code,
            "stan": t.stan,
            "rrn": t.transaction_key,
            "terminal_id": t.terminal_id,
            "merchant_id": "M123456",
            "acquirer_code": "A123",
            "status": t.status.value,
            "fields": t.raw_fields
        })
        
    return {
        "data": result_data,
        "total": total,
        "page": page,
        "pageSize": pageSize,
        "totalPages": total_pages
    }

@router.get("/{id}", response_model=TransactionResponse)
def get_transaction(id: str, db: Session = Depends(get_db)):
    t = db.query(Transaction).filter(Transaction.id == id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Transaction not found")
        
    return {
            "id": t.id,
            "timestamp": t.created_at.isoformat() + "Z",
            "mti": t.mti,
            "pan": t.pan,
            "amount": t.amount,
            "currency_code": "840",
            "response_code": "00",
            "response_description": "Approved" if t.status == 'valid' else "Declined",
            "processing_code": t.processing_code,
            "stan": t.stan,
            "rrn": t.transaction_key,
            "terminal_id": t.terminal_id,
            "merchant_id": "M123456",
            "acquirer_code": "A123",
            "status": t.status.value,
            "fields": t.raw_fields
        }
