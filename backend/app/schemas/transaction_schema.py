from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import datetime
from app.models.transaction import TransactionStatus

class TransactionBase(BaseModel):
    mti: str
    pan: str
    amount: str
    currency_code: str = "840" # Default, or can extract from fields
    response_code: str = "00" # Default or extract
    response_description: str = ""
    processing_code: str
    stan: str
    rrn: str = "" # Default or extract
    terminal_id: str
    merchant_id: str = "" # Default or extract
    acquirer_code: str = "" # Default or extract
    status: TransactionStatus
    fields: Dict[str, Any]

class TransactionCreate(TransactionBase):
    file_id: str
    transaction_key: str

class TransactionResponse(TransactionBase):
    id: str
    timestamp: datetime

    class Config:
        from_attributes = True

class PaginatedTransactionResponse(BaseModel):
    data: list[TransactionResponse]
    total: int
    page: int
    pageSize: int
    totalPages: int
