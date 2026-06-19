from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.core.database import Base
import enum

class TransactionStatus(str, enum.Enum):
    VALID = "valid"
    INVALID = "invalid"

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    file_id = Column(String(36), ForeignKey("uploaded_files.id"), index=True)
    transaction_key = Column(String, index=True) # DE11 + MTI
    mti = Column(String(4), index=True)
    pan = Column(String(19)) # Masked pan
    processing_code = Column(String(6))
    amount = Column(String(12))
    stan = Column(String(6))
    terminal_id = Column(String(8))
    status = Column(Enum(TransactionStatus), index=True)
    raw_fields = Column(JSON) # Store parsed DE fields as JSON
    created_at = Column(DateTime, default=datetime.utcnow)

    file = relationship("UploadedFile", back_populates="transactions")
    validation_results = relationship("ValidationResult", back_populates="transaction", cascade="all, delete")
