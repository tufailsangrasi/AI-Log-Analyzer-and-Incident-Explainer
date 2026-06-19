from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class TimeSeriesPoint(BaseModel):
    timestamp: str
    label: str
    value: int
    successCount: Optional[int] = None
    errorCount: Optional[int] = None

class ResponseCodeEntry(BaseModel):
    code: str
    label: str
    count: int
    percentage: float
    color: Optional[str] = None

class DashboardMetrics(BaseModel):
    totalTransactions: int
    successRate: float
    errorCount: int
    avgResponseTime: int
    transactionsOverTime: List[TimeSeriesPoint]
    responseCodeDistribution: List[ResponseCodeEntry]
    recentTransactions: List[Dict[str, Any]]
