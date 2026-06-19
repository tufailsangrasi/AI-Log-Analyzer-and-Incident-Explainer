from sqlalchemy.orm import Session
from app.repositories import rule_repo
from typing import Dict, List
from app.models.iso_rule import IsoRule

class RuleEngine:
    def __init__(self, db: Session):
        self.db = db
        # Cache rules by MTI to avoid hitting DB for every transaction
        self._cache: Dict[str, List[IsoRule]] = {}

    def get_rules_for_mti(self, mti: str) -> List[IsoRule]:
        if mti not in self._cache:
            rules = rule_repo.get_rules_by_mti(self.db, mti)
            self._cache[mti] = rules
        return self._cache[mti]
