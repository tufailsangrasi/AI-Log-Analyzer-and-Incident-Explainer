import re
from typing import List, Dict, Any

def parse_iso_log_file(file_content: str) -> List[Dict[str, Any]]:
    """
    Parses a text file containing ISO 8583 fields separated by '---'
    Expected format:
    MTI: 0200
    DE2: 4532XXXXXXXX8901
    ...
    ---
    """
    transactions = []
    blocks = file_content.split('---')

    for block in blocks:
        block = block.strip()
        if not block:
            continue
            
        txn_data = {}
        lines = block.split('\n')
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Match "Field: Value" or "DE#: Value"
            match = re.match(r'^([A-Z0-9]+):\s*(.*)$', line)
            if match:
                key, value = match.groups()
                txn_data[key] = value.strip()
                
        if txn_data:
            transactions.append(txn_data)
            
    return transactions

def extract_core_fields(txn_data: Dict[str, str]) -> Dict[str, Any]:
    """Extract core fields like MTI, PAN, Amount from the raw dictionary"""
    mti = txn_data.get('MTI', '')
    stan = txn_data.get('DE11', '')
    
    return {
        'mti': mti,
        'pan': txn_data.get('DE2', ''),
        'processing_code': txn_data.get('DE3', ''),
        'amount': txn_data.get('DE4', ''),
        'stan': stan,
        'terminal_id': txn_data.get('DE41', ''),
        'transaction_key': f"{stan}_{mti}" if stan and mti else "",
        'raw_fields': txn_data
    }
