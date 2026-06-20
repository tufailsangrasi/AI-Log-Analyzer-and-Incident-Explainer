"""
Explanation Agent
Generates business-readable explanations for parsed ISO 8583 transactions.
Uses template-based explanations (LLM integration optional).
"""

from dataclasses import dataclass
from app.utils.field_map import get_response_meaning, get_field_name


@dataclass
class ExplanationResult:
    transaction_type: str
    response_code: str
    response_meaning: str
    status: str
    stan: str
    rrn: str
    explanation_text: str


class ExplanationAgent:
    """Agent 5: Generates human-readable explanations for transactions."""

    def run(
        self,
        transaction_type: str,
        raw_fields: dict[str, str],
        mti: str,
        field_count: int,
    ) -> ExplanationResult:
        """Generate a comprehensive explanation."""
        response_code = raw_fields.get("DE39", "")
        stan = raw_fields.get("DE11", "")
        rrn = raw_fields.get("DE37", "")
        response_meaning = get_response_meaning(response_code) if response_code else "N/A"

        # Determine status
        if response_code == "00":
            status = "Success"
        elif response_code:
            status = "Declined"
        else:
            status = "Unknown"

        # Build explanation text
        explanation_text = self._build_explanation(
            transaction_type=transaction_type,
            mti=mti,
            response_code=response_code,
            response_meaning=response_meaning,
            status=status,
            stan=stan,
            rrn=rrn,
            raw_fields=raw_fields,
            field_count=field_count,
        )

        return ExplanationResult(
            transaction_type=transaction_type,
            response_code=response_code,
            response_meaning=response_meaning,
            status=status,
            stan=stan,
            rrn=rrn,
            explanation_text=explanation_text,
        )

    def _build_explanation(
        self,
        transaction_type: str,
        mti: str,
        response_code: str,
        response_meaning: str,
        status: str,
        stan: str,
        rrn: str,
        raw_fields: dict[str, str],
        field_count: int,
    ) -> str:
        """Build a detailed natural language explanation."""
        lines: list[str] = []

        # Transaction identification
        lines.append(f"This transaction has been identified as {self._article(transaction_type)} {transaction_type}.")

        # MTI interpretation
        if mti:
            mti_desc = self._describe_mti(mti)
            lines.append(f"The ISO message type is {mti} ({mti_desc}).")

        # Parse success
        lines.append(f"The ISO message was parsed successfully. {field_count} data elements were extracted.")

        # Key field extractions
        if stan:
            lines.append(f"DE-11 (STAN) was extracted as {stan}.")
        if rrn:
            lines.append(f"DE-37 (RRN) was extracted as {rrn}.")

        # Amount if present
        amount = raw_fields.get("DE4", "")
        if amount:
            lines.append(f"DE-4 (Transaction Amount) is {amount}.")

        # Currency if present
        currency = raw_fields.get("DE49", "")
        if currency:
            lines.append(f"DE-49 (Currency Code) is {currency}.")

        # Terminal
        terminal = raw_fields.get("DE41", "")
        if terminal:
            lines.append(f"DE-41 (Terminal ID) is {terminal}.")

        # Response code interpretation
        if response_code:
            if response_code == "00":
                lines.append(f"Response Code {response_code} indicates successful approval.")
            else:
                lines.append(f"Response Code {response_code} indicates: {response_meaning}.")

        # Account fields for IBFT
        de102 = raw_fields.get("DE102", "")
        de103 = raw_fields.get("DE103", "")
        if de102:
            lines.append(f"DE-102 (Source Account) is {de102}.")
        if de103:
            lines.append(f"DE-103 (Destination Account) is {de103}.")

        # Final assessment
        if status == "Success":
            lines.append("No anomalies were detected.")
        elif status == "Declined":
            lines.append(f"The transaction was declined. Reason: {response_meaning}.")

        return "\n\n".join(lines)

    def _article(self, word: str) -> str:
        """Return 'an' or 'a' based on word."""
        if word and word[0].upper() in "AEIOU":
            return "an"
        return "a"

    def _describe_mti(self, mti: str) -> str:
        """Describe an MTI code."""
        descriptions = {
            "0100": "Authorization Request",
            "0110": "Authorization Response",
            "0200": "Financial Transaction Request",
            "0210": "Financial Transaction Response",
            "0220": "Financial Transaction Advice",
            "0230": "Financial Transaction Advice Response",
            "0400": "Reversal Request",
            "0410": "Reversal Response",
            "0420": "Reversal Advice",
            "0430": "Reversal Advice Response",
            "0800": "Network Management Request",
            "0810": "Network Management Response",
        }
        return descriptions.get(mti, "Unknown Message Type")
