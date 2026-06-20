"""
ISO 8583 AI Log Analyzer — FastAPI Application
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.session import init_db

# Initialize database tables
init_db()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Development. In production, restrict to frontend URL.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
from app.api.analyze import router as analyze_router

app.include_router(
    analyze_router,
    prefix=settings.API_V1_STR,
    tags=["Analysis"],
)


@app.get("/")
def root():
    return {
        "message": "ISO 8583 AI Log Analyzer API",
        "version": "2.0.0",
        "docs": f"{settings.API_V1_STR}/openapi.json",
    }
