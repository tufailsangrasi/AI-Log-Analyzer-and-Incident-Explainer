import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "ISO 8583 Log Analyzer API"
    DATABASE_URL: str = "sqlite:///./iso8583_analyzer.db"
    UPLOAD_DIR: str = "uploads/"
    MAX_UPLOAD_SIZE: int = 50000000  # 50MB

    class Config:
        env_file = ".env"

settings = Settings()

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
