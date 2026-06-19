from sqlalchemy import Column, String, Integer, ForeignKey, Enum
from sqlalchemy.orm import relationship
import uuid
from app.core.database import Base
import enum

class ErrorType(str, enum.Enum):
    MISSING = "missing"
    FORMAT = "format"
    LENGTH = "length"

class ValidationResult(Base):
    __tablename__ = "validation_results"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    transaction_id = Column(String(36), ForeignKey("transactions.id"), index=True)
    field_number = Column(Integer)
    field_name = Column(String)
    error_type = Column(Enum(ErrorType))
    expected = Column(String, nullable=True)
    actual = Column(String, nullable=True)
    message = Column(String)

    transaction = relationship("Transaction", back_populates="validation_results")
