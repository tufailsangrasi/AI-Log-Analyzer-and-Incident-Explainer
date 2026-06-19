def format_currency(amount_str: str) -> str:
    """Format ISO 8583 amount (e.g., 000000012500 -> 125.00)"""
    if not amount_str or not amount_str.isdigit():
        return amount_str
        
    try:
        # Assuming last 2 digits are decimals
        val = int(amount_str)
        return f"{val / 100:.2f}"
    except ValueError:
        return amount_str

def mask_pan(pan: str) -> str:
    """Mask Primary Account Number (e.g. 4532123456788901 -> 4532********8901)"""
    if not pan or len(pan) < 10:
        return pan
        
    return f"{pan[:4]}********{pan[-4:]}"
