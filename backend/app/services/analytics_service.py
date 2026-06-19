from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.transaction import Transaction, TransactionStatus
from app.models.validation_result import ValidationResult
from typing import Dict, Any, List
from datetime import datetime, timedelta

class AnalyticsService:
    def __init__(self, db: Session):
        self.db = db

    def get_dashboard_summary(self) -> Dict[str, Any]:
        total_txns = self.db.query(Transaction).count()
        valid_count = self.db.query(Transaction).filter(Transaction.status == TransactionStatus.VALID).count()
        invalid_count = total_txns - valid_count
        
        success_rate = (valid_count / total_txns * 100) if total_txns > 0 else 0.0

        # Mocks for charts
        time_series = []
        now = datetime.now()
        for i in range(10):
            d = now - timedelta(days=9-i)
            time_series.append({
                "time": d.strftime("%b %d"),
                "volume": int(total_txns / 10) + (i * 10),
                "errors": int(invalid_count / 10) + i
            })

        response_codes = [
            {"code": "00", "description": "Approved", "count": valid_count},
            {"code": "05", "description": "Do Not Honor", "count": int(invalid_count * 0.3)},
            {"code": "51", "description": "Insufficient Funds", "count": int(invalid_count * 0.4)},
            {"code": "14", "description": "Invalid Card", "count": int(invalid_count * 0.3)}
        ]

        recent = self.db.query(Transaction).order_by(Transaction.created_at.desc()).limit(5).all()
        recent_list = []
        for r in recent:
            recent_list.append({
                "id": r.id,
                "timestamp": r.created_at.isoformat() + "Z",
                "mti": r.mti,
                "pan": r.pan,
                "amount": r.amount,
                "status": r.status.value,
                "terminal_id": r.terminal_id
            })

        return {
            "summary": {
                "totalTransactions": total_txns,
                "validCount": valid_count,
                "invalidCount": invalid_count,
                "successRate": round(success_rate, 1),
                "errorCount": {"value": invalid_count, "change": -2.4},
                "avgResponseTime": {"value": 142, "change": -5.1}
            },
            "timeSeriesData": time_series,
            "responseCodes": response_codes,
            "recentTransactions": recent_list
        }

    def get_validation_summary(self) -> Dict[str, Any]:
        total_fields_checked = self.db.query(ValidationResult).count() * 10 # Approx
        failures = self.db.query(ValidationResult).count()
        
        pass_rate = 100.0
        if total_fields_checked > 0:
            pass_rate = ((total_fields_checked - failures) / total_fields_checked) * 100

        results = self.db.query(ValidationResult).limit(50).all()
        result_list = []
        for r in results:
            result_list.append({
                "fieldNumber": r.field_number,
                "fieldName": r.field_name,
                "value": r.actual or "",
                "message": r.message,
                "status": r.error_type.value,
                "rule": f"Rule for DE{r.field_number}"
            })

        return {
            "totalFieldsChecked": total_fields_checked,
            "passRate": round(pass_rate, 1),
            "failCount": failures,
            "warningCount": int(failures * 0.2), # Mock warnings
            "results": result_list
        }
