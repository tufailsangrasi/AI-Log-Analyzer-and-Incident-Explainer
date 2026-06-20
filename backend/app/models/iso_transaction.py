"""
ISO 8583 Transaction Model
Stores parsed ISO 8583 transaction data with individual DE field columns and presence flags.
"""

from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text
from datetime import datetime, timezone
import uuid

from app.database.session import Base


class Iso8583Transaction(Base):
    __tablename__ = "iso8583_transactions"

    # Core fields
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    uploaded_file_name = Column(String(255), nullable=False, index=True)
    file_size = Column(Integer, nullable=True)
    mti = Column(String(4), nullable=True)
    transaction_type = Column(String(50), nullable=True, index=True)
    response_code = Column(String(4), nullable=True, index=True)
    analysis_summary = Column(Text, nullable=True)
    raw_log = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # ── DE Value Columns (nullable strings) ──
    de2_value = Column(String(19), nullable=True)    # PAN
    de3_value = Column(String(6), nullable=True)     # Processing Code
    de4_value = Column(String(12), nullable=True)    # Transaction Amount
    de5_value = Column(String(12), nullable=True)    # Settlement Amount
    de6_value = Column(String(12), nullable=True)    # Cardholder Billing Amount
    de7_value = Column(String(14), nullable=True)    # Transmission Date & Time
    de9_value = Column(String(8), nullable=True)     # Settlement Conversion Rate
    de10_value = Column(String(8), nullable=True)    # Cardholder Billing Conv Rate
    de11_value = Column(String(6), nullable=True)    # STAN
    de12_value = Column(String(6), nullable=True)    # Local Transaction Time
    de13_value = Column(String(4), nullable=True)    # Local Transaction Date
    de14_value = Column(String(4), nullable=True)    # Expiration Date
    de15_value = Column(String(4), nullable=True)    # Settlement Date
    de18_value = Column(String(4), nullable=True)    # Merchant Category Code
    de22_value = Column(String(3), nullable=True)    # POS Entry Mode
    de23_value = Column(String(3), nullable=True)    # Card Sequence Number
    de25_value = Column(String(2), nullable=True)    # POS Condition Code
    de26_value = Column(String(2), nullable=True)    # POS Capture Code
    de28_value = Column(String(9), nullable=True)    # Transaction Fee Amount
    de30_value = Column(String(24), nullable=True)   # Original Amount
    de32_value = Column(String(11), nullable=True)   # Acquiring Institution ID
    de33_value = Column(String(11), nullable=True)   # Forwarding Institution ID
    de35_value = Column(String(37), nullable=True)   # Track 2 Data
    de37_value = Column(String(12), nullable=True)   # RRN
    de38_value = Column(String(6), nullable=True)    # Authorization ID Response
    de39_value = Column(String(2), nullable=True)    # Response Code
    de41_value = Column(String(8), nullable=True)    # Terminal ID
    de42_value = Column(String(15), nullable=True)   # Card Acceptor ID
    de43_value = Column(String(40), nullable=True)   # Card Acceptor Name/Location
    de48_value = Column(Text, nullable=True)          # Additional Data - Private
    de49_value = Column(String(3), nullable=True)    # Transaction Currency Code
    de50_value = Column(String(3), nullable=True)    # Settlement Currency Code
    de51_value = Column(String(3), nullable=True)    # Cardholder Billing Currency
    de52_value = Column(String(16), nullable=True)   # PIN Data
    de54_value = Column(Text, nullable=True)          # Additional Amounts
    de55_value = Column(Text, nullable=True)          # ICC Data (EMV)
    de56_value = Column(Text, nullable=True)          # Original Data Elements
    de60_value = Column(Text, nullable=True)          # Reserved (Private)
    de61_value = Column(Text, nullable=True)          # Reserved (Private)
    de62_value = Column(Text, nullable=True)          # Reserved (Private)
    de63_value = Column(Text, nullable=True)          # Reserved (Private)
    de90_value = Column(String(42), nullable=True)   # Original Data Elements
    de95_value = Column(String(42), nullable=True)   # Replacement Amounts
    de100_value = Column(String(11), nullable=True)  # Receiving Institution ID
    de102_value = Column(String(28), nullable=True)  # Account ID 1
    de103_value = Column(String(28), nullable=True)  # Account ID 2
    de120_value = Column(Text, nullable=True)         # Reserved (Private)
    de123_value = Column(Text, nullable=True)         # Reserved (Private)
    de124_value = Column(Text, nullable=True)         # Reserved (Private)
    de125_value = Column(Text, nullable=True)         # Reserved (Private)
    de126_value = Column(Text, nullable=True)         # Reserved (Private)
    de127_value = Column(Text, nullable=True)         # Reserved (Private)
    de128_value = Column(String(16), nullable=True)  # MAC

    # ── DE Presence Flags (boolean, default False) ──
    de2_present = Column(Boolean, default=False)
    de3_present = Column(Boolean, default=False)
    de4_present = Column(Boolean, default=False)
    de5_present = Column(Boolean, default=False)
    de6_present = Column(Boolean, default=False)
    de7_present = Column(Boolean, default=False)
    de9_present = Column(Boolean, default=False)
    de10_present = Column(Boolean, default=False)
    de11_present = Column(Boolean, default=False)
    de12_present = Column(Boolean, default=False)
    de13_present = Column(Boolean, default=False)
    de14_present = Column(Boolean, default=False)
    de15_present = Column(Boolean, default=False)
    de18_present = Column(Boolean, default=False)
    de22_present = Column(Boolean, default=False)
    de23_present = Column(Boolean, default=False)
    de25_present = Column(Boolean, default=False)
    de26_present = Column(Boolean, default=False)
    de28_present = Column(Boolean, default=False)
    de30_present = Column(Boolean, default=False)
    de32_present = Column(Boolean, default=False)
    de33_present = Column(Boolean, default=False)
    de35_present = Column(Boolean, default=False)
    de37_present = Column(Boolean, default=False)
    de38_present = Column(Boolean, default=False)
    de39_present = Column(Boolean, default=False)
    de41_present = Column(Boolean, default=False)
    de42_present = Column(Boolean, default=False)
    de43_present = Column(Boolean, default=False)
    de48_present = Column(Boolean, default=False)
    de49_present = Column(Boolean, default=False)
    de50_present = Column(Boolean, default=False)
    de51_present = Column(Boolean, default=False)
    de52_present = Column(Boolean, default=False)
    de54_present = Column(Boolean, default=False)
    de55_present = Column(Boolean, default=False)
    de56_present = Column(Boolean, default=False)
    de60_present = Column(Boolean, default=False)
    de61_present = Column(Boolean, default=False)
    de62_present = Column(Boolean, default=False)
    de63_present = Column(Boolean, default=False)
    de90_present = Column(Boolean, default=False)
    de95_present = Column(Boolean, default=False)
    de100_present = Column(Boolean, default=False)
    de102_present = Column(Boolean, default=False)
    de103_present = Column(Boolean, default=False)
    de120_present = Column(Boolean, default=False)
    de123_present = Column(Boolean, default=False)
    de124_present = Column(Boolean, default=False)
    de125_present = Column(Boolean, default=False)
    de126_present = Column(Boolean, default=False)
    de127_present = Column(Boolean, default=False)
    de128_present = Column(Boolean, default=False)

    def to_dict(self) -> dict:
        """Convert model to dictionary for API responses."""
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
