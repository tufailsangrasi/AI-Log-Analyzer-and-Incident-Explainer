from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.segregation_service import SegregationService

router = APIRouter()

@router.get("/missing-elements")
def get_missing_elements(db: Session = Depends(get_db)):
    seg_service = SegregationService(db)
    return seg_service.get_missing_elements_report()
