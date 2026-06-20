"""
Field Extraction Agent
Extracts all present DE fields and normalizes values.
"""

import re
from dataclasses import dataclass
from app.utils.field_map import get_field_name


@dataclass
class ExtractedField:
    field_number: str      # e.g., "DE-2"
    field_name: str        # e.g., "Primary Account Number (PAN)"
    value: str             # Normalized value (PAN masked)
    present: bool          # Always True for extracted fields
    raw_value: str         # Original raw value


@dataclass
class ExtractionResult:
    fields: list[ExtractedField]
    field_count: int
    errors: list[str]


class ExtractionAgent:
    """Agent 3: Extracts and normalizes all present DE fields."""

    # Fields that contain sensitive data requiring masking
    SENSITIVE_FIELDS = {"DE2", "DE35", "DE52"}

    def run(self, raw_fields: dict[str, str]) -> ExtractionResult:
        """Extract and normalize all DE fields."""
        extracted: list[ExtractedField] = []
        errors: list[str] = []

        for key, value in sorted(raw_fields.items(), key=self._sort_de_key):
            try:
                field_name = get_field_name(key)
                normalized = self._normalize_value(key, value)

                extracted.append(ExtractedField(
                    field_number=self._format_field_number(key),
                    field_name=field_name,
                    value=normalized,
                    present=True,
                    raw_value=value,
                ))
            except Exception as e:
                errors.append(f"Error extracting {key}: {str(e)}")

        return ExtractionResult(
            fields=extracted,
            field_count=len(extracted),
            errors=errors,
        )

    def _normalize_value(self, key: str, value: str) -> str:
        """Normalize and optionally mask field values."""
        upper_key = key.upper().replace("-", "").replace("_", "").replace(" ", "")

        if upper_key in self.SENSITIVE_FIELDS:
            return self._mask_sensitive(value)

        return value.strip()

    def _mask_sensitive(self, value: str) -> str:
        """Mask sensitive data like PAN: show first 6 and last 4."""
        digits = re.sub(r"\D", "", value)
        if len(digits) >= 13:
            return digits[:6] + "x" * (len(digits) - 10) + digits[-4:]
        return "x" * len(value)

    def _format_field_number(self, key: str) -> str:
        """Format key into 'DE-nn' display format."""
        clean = key.upper().replace("-", "").replace("_", "").replace(" ", "")
        match = re.match(r"DE(\d+)", clean)
        if match:
            return f"DE-{match.group(1)}"
        return key

    def _sort_de_key(self, item: tuple[str, str]) -> int:
        """Sort key for DE fields by numeric value."""
        key = item[0]
        match = re.search(r"\d+", key)
        return int(match.group()) if match else 999
