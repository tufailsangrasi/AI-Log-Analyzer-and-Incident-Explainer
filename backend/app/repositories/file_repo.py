from sqlalchemy.orm import Session
from app.models.uploaded_file import UploadedFile
from typing import List, Optional

def create_uploaded_file(db: Session, file: UploadedFile) -> UploadedFile:
    db.add(file)
    db.commit()
    db.refresh(file)
    return file

def get_uploaded_file(db: Session, file_id: str) -> Optional[UploadedFile]:
    return db.query(UploadedFile).filter(UploadedFile.id == file_id).first()

def get_all_uploaded_files(db: Session) -> List[UploadedFile]:
    return db.query(UploadedFile).order_by(UploadedFile.uploaded_at.desc()).all()

def update_uploaded_file(db: Session, file: UploadedFile) -> UploadedFile:
    db.commit()
    db.refresh(file)
    return file
