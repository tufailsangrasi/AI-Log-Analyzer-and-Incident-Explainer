import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "ISO 8583 AI Log Analyzer API"

    # Database - PostgreSQL preferred, SQLite fallback
    DATABASE_URL: str = "sqlite:///./iso8583_analyzer.db"

    # File Upload
    UPLOAD_DIR: str = "uploads/"
    MAX_UPLOAD_SIZE: int = 50_000_000  # 50MB

    # OpenAI-compatible API (optional, for AI explanations)
    OPENAI_API_KEY: str = ""
    OPENAI_BASE_URL: str = "https://api.openai.com/v1"
    OPENAI_MODEL: str = "gpt-3.5-turbo"

    class Config:
        env_file = ".env"


settings = Settings()

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
