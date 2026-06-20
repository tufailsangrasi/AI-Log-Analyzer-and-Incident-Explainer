from pydantic import BaseModel
from typing import List, Optional


class ApprovalBreakdown(BaseModel):
    tran_type: str
    rate: float


class ApprovalRateData(BaseModel):
    rate: float
    change: float
    breakdown: List[ApprovalBreakdown]


class FailureCategory(BaseModel):
    category: str
    count: int
    pct: float


class FailureAnalysisData(BaseModel):
    total: int
    change: float
    top_category: str
    top_category_pct: float
    categories: List[FailureCategory]


class RcEntry(BaseModel):
    rc: str
    count: int
    pct: float


class RcDistributionData(BaseModel):
    top_rc: str
    top_rc_pct: float
    entries: List[RcEntry]


class LatencyData(BaseModel):
    p50: int
    p95: int
    avg: int
    change: float
    sla_ok: bool


class ApprovalTrendPoint(BaseModel):
    timestamp: str
    approval_pct: float
    decline_pct: float
    total: int


class DashboardAnalytics(BaseModel):
    approval_rate: ApprovalRateData
    failure_analysis: FailureAnalysisData
    rc_distribution: RcDistributionData
    latency: LatencyData
    approval_trend: List[ApprovalTrendPoint]
