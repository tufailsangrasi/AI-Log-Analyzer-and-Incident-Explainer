from sqlalchemy import Column, String, Integer, Boolean, Enum
from app.core.database import Base
import enum

class DataType(str, enum.Enum):
    NUMERIC = "n"
    ALPHA = "a"
    ALPHANUMERIC = "an"
    ALPHANUMERIC_SPECIAL = "ans"
    BINARY = "b"
    TRACK = "z"

class IsoRule(Base):
    __tablename__ = "iso_rules"

    id = Column(Integer, primary_key=True, autoincrement=True)
    mti = Column(String(4), index=True)
    field_number = Column(Integer)
    field_name = Column(String)
    data_type = Column(Enum(DataType))
    min_length = Column(Integer, default=0)
    max_length = Column(Integer)
    is_variable = Column(Boolean, default=False)
    mandatory = Column(Boolean, default=False)
