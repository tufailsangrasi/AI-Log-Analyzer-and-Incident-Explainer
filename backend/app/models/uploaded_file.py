from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Enum, Text, JSON
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.core.database import Base
import enum

class UploadStatus(str, enum.Enum):
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class UploadedFile(Base):
    __tablename__ = "uploaded_files"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    filename = Column(String, index=True)
    file_path = Column(String)
    file_size = Column(Integer)
    total_transactions = Column(Integer, default=0)
    valid_count = Column(Integer, default=0)
    invalid_count = Column(Integer, default=0)
    status = Column(Enum(UploadStatus), default=UploadStatus.PROCESSING)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    transactions = relationship("Transaction", back_populates="file", cascade="all, delete")
