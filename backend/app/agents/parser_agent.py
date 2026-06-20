"""
ISO Parser Agent
Parses ISO 8583 messages, identifies MTI, bitmap, and extracts raw DE fields.
"""

import re
from dataclasses import dataclass, field


@dataclass
class ParseResult:
    mti: str
    bitmap: str
    raw_fields: dict[str, str]
    parse_errors: list[str]
    is_parsed: bool


class ParserAgent:
    """Agent 2: Parses ISO 8583 log content into structured field data."""

    def run(self, file_content: str) -> ParseResult:
        """Parse ISO 8583 message from log file content."""
        raw_fields: dict[str, str] = {}
        parse_errors: list[str] = []
        mti = ""
        bitmap = ""

        lines = file_content.strip().split("\n")

        for line in lines:
            line = line.strip()
            if not line or line.startswith("#") or line.startswith("//"):
                continue

            # Skip separator lines
            if line.startswith("---") or line.startswith("==="):
                continue

            parsed = self._parse_line(line)
            if parsed:
                key, value = parsed
                upper_key = key.upper().strip()

                if upper_key == "MTI":
                    mti = value
                elif upper_key == "BITMAP":
                    bitmap = value
                else:
                    # Normalize DE field key: "DE2", "DE-2", "DE 2", "FIELD 2" → "DE2"
                    normalized = self._normalize_de_key(upper_key)
                    if normalized:
                        raw_fields[normalized] = value
                    else:
                        # Store non-DE fields under original key
                        raw_fields[upper_key] = value
            else:
                if line and ":" not in line and "=" not in line:
                    parse_errors.append(f"Could not parse line: {line[:80]}")

        is_parsed = bool(mti or raw_fields)
        if not is_parsed:
            parse_errors.append("No valid ISO 8583 fields could be extracted")

        return ParseResult(
            mti=mti,
            bitmap=bitmap,
            raw_fields=raw_fields,
            parse_errors=parse_errors,
            is_parsed=is_parsed,
        )

    def _parse_line(self, line: str) -> tuple[str, str] | None:
        """Parse a single line into (key, value) pair."""
        # Match patterns like: "DE2: 4532...", "DE-11 = 123456", "MTI: 0200"
        patterns = [
            r"^([A-Za-z0-9_\-\s]+?)\s*[:=]\s*(.+)$",
        ]
        for pattern in patterns:
            match = re.match(pattern, line)
            if match:
                key, value = match.groups()
                return key.strip(), value.strip()
        return None

    def _normalize_de_key(self, key: str) -> str | None:
        """
        Normalize various DE field key formats to 'DEnn'.
        Examples: 'DE2', 'DE-2', 'DE 2', 'FIELD 2', 'FIELD-2' → 'DE2'
        """
        # Pattern: DE followed by optional separator and digits
        match = re.match(r"^DE\s*[-_]?\s*(\d+)$", key)
        if match:
            return f"DE{match.group(1)}"

        # Pattern: FIELD followed by digits
        match = re.match(r"^FIELD\s*[-_]?\s*(\d+)$", key)
        if match:
            return f"DE{match.group(1)}"

        return None
