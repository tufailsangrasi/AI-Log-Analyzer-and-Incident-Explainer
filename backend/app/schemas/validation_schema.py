from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ValidationResultBase(BaseModel):
    field_number: int
    field_name: str
    error_type: str
    expected: Optional[str] = None
    actual: Optional[str] = None
    message: str

class ValidationResultCreate(ValidationResultBase):
    transaction_id: str

class ValidationResultResponse(ValidationResultBase):
    id: str

    class Config:
        from_attributes = True

class UploadResponse(BaseModel):
    success: bool
    fileName: str
    fileSize: int
    transactionsParsed: int
    errorsFound: int
    uploadId: str
    timestamp: datetime

class UploadEntryResponse(BaseModel):
    id: str
    fileName: str
    fileSize: int
    uploadedAt: datetime
    status: str
    transactionsParsed: int
    errorsFound: int
