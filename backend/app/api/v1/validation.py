from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.analytics_service import AnalyticsService

router = APIRouter()

@router.get("/summary")
def get_validation_summary(db: Session = Depends(get_db)):
    analytics_service = AnalyticsService(db)
    return analytics_service.get_validation_summary()
