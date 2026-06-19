from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.dashboard_schema import DashboardMetrics
from app.services.analytics_service import AnalyticsService

router = APIRouter()

@router.get("/", response_model=DashboardMetrics)
def get_dashboard_data(db: Session = Depends(get_db)):
    analytics_service = AnalyticsService(db)
    return analytics_service.get_dashboard_summary()
