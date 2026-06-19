from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.validation_schema import UploadResponse, UploadEntryResponse
from app.services.parser_service import ParserService
from app.services.validation_service import ValidationService
from app.services.rule_engine import RuleEngine
from app.repositories import file_repo
from typing import List

router = APIRouter()

@router.post("/", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.txt'):
        raise HTTPException(status_code=400, detail="Only .txt files are supported")

    content = await file.read()
    text_content = content.decode("utf-8")
    
    rule_engine = RuleEngine(db)
    validation_service = ValidationService(rule_engine)
    parser_service = ParserService(db, validation_service)
    
    file_record = parser_service.process_file(file.filename, text_content, len(content))
    
    return {
        "success": True,
        "fileName": file_record.filename,
        "fileSize": file_record.file_size,
        "transactionsParsed": file_record.total_transactions,
        "errorsFound": file_record.invalid_count,
        "uploadId": file_record.id,
        "timestamp": file_record.uploaded_at
    }

@router.get("/history", response_model=List[UploadEntryResponse])
def get_upload_history(db: Session = Depends(get_db)):
    files = file_repo.get_all_uploaded_files(db)
    result = []
    for f in files:
        result.append({
            "id": f.id,
            "fileName": f.filename,
            "fileSize": f.file_size,
            "uploadedAt": f.uploaded_at,
            "status": f.status.value,
            "transactionsParsed": f.total_transactions,
            "errorsFound": f.invalid_count
        })
    return result
