"""
Analyze API Endpoint
Single endpoint for uploading and analyzing ISO 8583 log files.
"""

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services.workflow import WorkflowOrchestrator
from app.core.config import settings

router = APIRouter()


@router.post("/analyze")
async def analyze_log(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Upload and analyze a single ISO 8583 log file.
    Runs through the 6-agent pipeline and returns complete analysis.
    """
    # Validate file size
    content_bytes = await file.read()
    if len(content_bytes) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {settings.MAX_UPLOAD_SIZE // 1_000_000}MB",
        )

    # Decode file content
    try:
        file_content = content_bytes.decode("utf-8")
    except UnicodeDecodeError:
        try:
            file_content = content_bytes.decode("latin-1")
        except Exception:
            raise HTTPException(
                status_code=400,
                detail="Unable to decode file. Supported encodings: UTF-8, Latin-1",
            )

    file_name = file.filename or "unknown.log"
    file_size = len(content_bytes)

    # Run the workflow
    orchestrator = WorkflowOrchestrator(db=db)
    result = orchestrator.run(
        file_content=file_content,
        file_name=file_name,
        file_size=file_size,
    )

    return {
        "success": result.success,
        "error": result.error,
        "file_info": {
            "name": file_name,
            "size": file_size,
            "size_display": _format_file_size(file_size),
        },
        "agents": result.agents,
        "validation": result.validation,
        "parse": result.parse,
        "extraction": result.extraction,
        "identification": result.identification,
        "explanation": result.explanation,
        "storage": result.storage,
        "raw_log": file_content,
    }


@router.get("/health")
async def health_check(db: Session = Depends(get_db)):
    """Check API and database health."""
    try:
        db.execute("SELECT 1")
        db_status = "connected"
    except Exception:
        db_status = "disconnected"

    return {
        "status": "healthy",
        "database": db_status,
    }


def _format_file_size(size_bytes: int) -> str:
    """Format bytes into human-readable string."""
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} KB"
    else:
        return f"{size_bytes / (1024 * 1024):.1f} MB"
