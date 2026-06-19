import re

def is_numeric(value: str) -> bool:
    """Check if string contains only digits"""
    return bool(re.match(r'^\d+$', value))

def is_alpha(value: str) -> bool:
    """Check if string contains only alphabetic characters"""
    return bool(re.match(r'^[A-Za-z]+$', value))

def is_alphanumeric(value: str) -> bool:
    """Check if string contains only alphanumeric characters"""
    return bool(re.match(r'^[A-Za-z0-9]+$', value))

def check_length(value: str, min_len: int, max_len: int) -> bool:
    """Check if string length is within bounds"""
    return min_len <= len(value) <= max_len
