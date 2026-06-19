from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development. In production, use specific origins like "http://localhost:3000"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.v1 import upload, dashboard, transactions, validation, reports

app.include_router(upload.router, prefix=f"{settings.API_V1_STR}/upload", tags=["Upload"])
app.include_router(dashboard.router, prefix=f"{settings.API_V1_STR}/dashboard", tags=["Dashboard"])
app.include_router(transactions.router, prefix=f"{settings.API_V1_STR}/transactions", tags=["Transactions"])
app.include_router(validation.router, prefix=f"{settings.API_V1_STR}/validations", tags=["Validation"])
app.include_router(reports.router, prefix=f"{settings.API_V1_STR}/reports", tags=["Reports"])

@app.get("/")
def root():
    return {"message": "Welcome to the ISO 8583 Log Analyzer API"}
