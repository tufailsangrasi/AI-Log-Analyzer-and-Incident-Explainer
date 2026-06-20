"""
ISO 8583 Field Name Mapping
Complete mapping of Data Element numbers to human-readable field names.
"""

ISO_FIELD_MAP: dict[str, str] = {
    "DE2": "Primary Account Number (PAN)",
    "DE3": "Processing Code",
    "DE4": "Transaction Amount",
    "DE5": "Settlement Amount",
    "DE6": "Cardholder Billing Amount",
    "DE7": "Transmission Date & Time",
    "DE9": "Settlement Conversion Rate",
    "DE10": "Cardholder Billing Conversion Rate",
    "DE11": "System Trace Audit Number (STAN)",
    "DE12": "Local Transaction Time",
    "DE13": "Local Transaction Date",
    "DE14": "Expiration Date",
    "DE15": "Settlement Date",
    "DE16": "Currency Conversion Date",
    "DE18": "Merchant Category Code",
    "DE22": "Point of Service Entry Mode",
    "DE23": "Card Sequence Number",
    "DE25": "Point of Service Condition Code",
    "DE26": "Point of Service Capture Code",
    "DE28": "Transaction Fee Amount",
    "DE30": "Original Amount",
    "DE32": "Acquiring Institution ID",
    "DE33": "Forwarding Institution ID",
    "DE35": "Track 2 Data",
    "DE37": "Retrieval Reference Number (RRN)",
    "DE38": "Authorization ID Response",
    "DE39": "Response Code",
    "DE41": "Card Acceptor Terminal ID",
    "DE42": "Card Acceptor ID Code",
    "DE43": "Card Acceptor Name/Location",
    "DE44": "Additional Response Data",
    "DE48": "Additional Data - Private",
    "DE49": "Transaction Currency Code",
    "DE50": "Settlement Currency Code",
    "DE51": "Cardholder Billing Currency Code",
    "DE52": "PIN Data",
    "DE54": "Additional Amounts",
    "DE55": "ICC Data (EMV)",
    "DE56": "Original Data Elements",
    "DE58": "Authorizing Agent Institution ID",
    "DE59": "Transport Data",
    "DE60": "Reserved (Private)",
    "DE61": "Reserved (Private)",
    "DE62": "Reserved (Private)",
    "DE63": "Reserved (Private)",
    "DE70": "Network Management Information Code",
    "DE90": "Original Data Elements",
    "DE95": "Replacement Amounts",
    "DE100": "Receiving Institution ID",
    "DE102": "Account Identification 1",
    "DE103": "Account Identification 2",
    "DE120": "Reserved (Private)",
    "DE123": "Reserved (Private)",
    "DE124": "Reserved (Private)",
    "DE125": "Reserved (Private)",
    "DE126": "Reserved (Private)",
    "DE127": "Reserved (Private)",
    "DE128": "Message Authentication Code",
}

# Response code meanings for human-readable explanations
RESPONSE_CODE_MAP: dict[str, str] = {
    "00": "Approved",
    "01": "Refer to Card Issuer",
    "03": "Invalid Merchant",
    "04": "Pick Up Card",
    "05": "Do Not Honor",
    "06": "Error",
    "07": "Pick Up Card, Special Condition",
    "08": "Honor with Identification",
    "10": "Partial Approval",
    "12": "Invalid Transaction",
    "13": "Invalid Amount",
    "14": "Invalid Card Number",
    "19": "Re-enter Transaction",
    "25": "Unable to Locate Record",
    "28": "File Temporarily Not Available",
    "30": "Format Error",
    "41": "Lost Card - Pick Up",
    "43": "Stolen Card - Pick Up",
    "51": "Insufficient Funds",
    "54": "Expired Card",
    "55": "Incorrect PIN",
    "56": "No Card Record",
    "57": "Transaction Not Permitted to Cardholder",
    "58": "Transaction Not Permitted to Terminal",
    "61": "Exceeds Withdrawal Limit",
    "62": "Restricted Card",
    "63": "Security Violation",
    "65": "Exceeds Withdrawal Frequency Limit",
    "68": "Response Received Too Late",
    "75": "PIN Tries Exceeded",
    "76": "Key Synchronization Error",
    "77": "Inconsistent Data",
    "78": "No Account",
    "80": "Invalid Date",
    "81": "Cryptographic Error",
    "82": "Incorrect CVV",
    "83": "Unable to Verify PIN",
    "84": "Invalid Authorization Life Cycle",
    "85": "No Reason to Decline",
    "86": "Cannot Verify PIN",
    "87": "Purchase Amount Only, No Cashback",
    "88": "Cryptographic Failure",
    "89": "Unacceptable PIN - Transaction Declined",
    "91": "Issuer or Switch Inoperative",
    "92": "Financial Institution Not Found",
    "93": "Transaction Cannot Be Completed",
    "94": "Duplicate Transaction",
    "96": "System Malfunction",
}

# Processing code to transaction type mapping
PROCESSING_CODE_MAP: dict[str, str] = {
    "00": "Purchase",
    "01": "Cash Withdrawal",
    "09": "Purchase with Cashback",
    "20": "Refund",
    "30": "Balance Inquiry",
    "31": "Balance Inquiry",
    "38": "Mini Statement",
    "40": "Fund Transfer",
}


def get_field_name(field_key: str) -> str:
    """Get human-readable name for an ISO 8583 field."""
    normalized = field_key.upper().replace("-", "").replace("_", "").replace(" ", "")
    if not normalized.startswith("DE"):
        normalized = f"DE{normalized}"
    return ISO_FIELD_MAP.get(normalized, f"Data Element {normalized[2:]}")


def get_response_meaning(code: str) -> str:
    """Get human-readable meaning for a response code."""
    return RESPONSE_CODE_MAP.get(code, f"Unknown Response Code ({code})")


def identify_transaction_type(processing_code: str, mti: str = "") -> str:
    """Identify transaction type from processing code and MTI."""
    if processing_code:
        prefix = processing_code[:2]
        base_type = PROCESSING_CODE_MAP.get(prefix, "")
        if base_type:
            return base_type

    # Fallback based on MTI
    mti_map = {
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
    return mti_map.get(mti, "Unknown Transaction")
