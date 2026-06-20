"""
Validation Agent
Validates uploaded file type, structure, and encoding.
"""

import re
from dataclasses import dataclass


@dataclass
class ValidationResult:
    is_valid: bool
    file_type: str
    encoding: str
    has_iso_fields: bool
    line_count: int
    errors: list[str]


class ValidationAgent:
    """Agent 1: Validates the uploaded log file before parsing."""

    SUPPORTED_ENCODINGS = ["utf-8", "ascii", "latin-1"]

    def run(self, file_content: str, file_name: str) -> ValidationResult:
        """Validate the uploaded file content."""
        errors: list[str] = []

        # Check file extension
        file_type = self._detect_file_type(file_name)
        if file_type not in ("txt", "log", "csv", "iso"):
            errors.append(f"Unsupported file type: .{file_type}. Expected .txt, .log, .csv, or .iso")

        # Check encoding
        encoding = self._detect_encoding(file_content)

        # Check if content is empty
        if not file_content or not file_content.strip():
            errors.append("File is empty or contains only whitespace")

        # Check for ISO 8583 field patterns
        has_iso_fields = self._check_iso_fields(file_content)
        if not has_iso_fields:
            errors.append("No ISO 8583 field patterns detected (expected DE/MTI fields)")

        line_count = len(file_content.strip().split("\n"))

        return ValidationResult(
            is_valid=len(errors) == 0,
            file_type=file_type,
            encoding=encoding,
            has_iso_fields=has_iso_fields,
            line_count=line_count,
            errors=errors,
        )

    def _detect_file_type(self, file_name: str) -> str:
        """Extract file extension."""
        if "." in file_name:
            return file_name.rsplit(".", 1)[-1].lower()
        return "unknown"

    def _detect_encoding(self, content: str) -> str:
        """Detect encoding (content is already decoded str)."""
        try:
            content.encode("ascii")
            return "ascii"
        except UnicodeEncodeError:
            return "utf-8"

    def _check_iso_fields(self, content: str) -> bool:
        """Check if content contains ISO 8583 field patterns."""
        patterns = [
            r"(?i)MTI\s*[:=]",
            r"(?i)DE\s*-?\s*\d+\s*[:=]",
            r"(?i)FIELD\s*-?\s*\d+\s*[:=]",
            r"(?i)STAN\s*[:=]",
            r"(?i)RRN\s*[:=]",
            r"(?i)PAN\s*[:=]",
        ]
        for pattern in patterns:
            if re.search(pattern, content):
                return True
        return False
