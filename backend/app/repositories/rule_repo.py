from sqlalchemy.orm import Session
from app.models.iso_rule import IsoRule
from typing import List

def get_rules_by_mti(db: Session, mti: str) -> List[IsoRule]:
    return db.query(IsoRule).filter(IsoRule.mti == mti).all()

def get_all_rules(db: Session) -> List[IsoRule]:
    return db.query(IsoRule).all()
