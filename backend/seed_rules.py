from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.iso_rule import IsoRule, DataType
import app.models.transaction # Import models so they are registered with Base
import app.models.validation_result
import app.models.uploaded_file

def seed_rules(db: Session):
    rules = [
        # MTI 0200
        {"mti": "0200", "field_number": 2, "field_name": "Primary Account Number", "data_type": DataType.NUMERIC, "min_length": 13, "max_length": 19, "is_variable": True, "mandatory": True},
        {"mti": "0200", "field_number": 3, "field_name": "Processing Code", "data_type": DataType.NUMERIC, "max_length": 6, "is_variable": False, "mandatory": True},
        {"mti": "0200", "field_number": 4, "field_name": "Amount", "data_type": DataType.NUMERIC, "max_length": 12, "is_variable": False, "mandatory": True},
        {"mti": "0200", "field_number": 11, "field_name": "Systems Trace Audit Number", "data_type": DataType.NUMERIC, "max_length": 6, "is_variable": False, "mandatory": True},
        {"mti": "0200", "field_number": 41, "field_name": "Card Acceptor Terminal ID", "data_type": DataType.ALPHANUMERIC, "max_length": 8, "is_variable": False, "mandatory": True},
        # MTI 0400
        {"mti": "0400", "field_number": 2, "field_name": "Primary Account Number", "data_type": DataType.NUMERIC, "min_length": 13, "max_length": 19, "is_variable": True, "mandatory": True},
        {"mti": "0400", "field_number": 3, "field_name": "Processing Code", "data_type": DataType.NUMERIC, "max_length": 6, "is_variable": False, "mandatory": True},
        {"mti": "0400", "field_number": 4, "field_name": "Amount", "data_type": DataType.NUMERIC, "max_length": 12, "is_variable": False, "mandatory": True},
        {"mti": "0400", "field_number": 11, "field_name": "Systems Trace Audit Number", "data_type": DataType.NUMERIC, "max_length": 6, "is_variable": False, "mandatory": True},
        {"mti": "0400", "field_number": 37, "field_name": "Retrieval Reference Number", "data_type": DataType.ALPHANUMERIC, "max_length": 12, "is_variable": False, "mandatory": True},
        {"mti": "0400", "field_number": 41, "field_name": "Card Acceptor Terminal ID", "data_type": DataType.ALPHANUMERIC, "max_length": 8, "is_variable": False, "mandatory": True},
    ]

    for rule_data in rules:
        existing = db.query(IsoRule).filter(
            IsoRule.mti == rule_data["mti"],
            IsoRule.field_number == rule_data["field_number"]
        ).first()
        
        if not existing:
            rule = IsoRule(**rule_data)
            db.add(rule)
            
    db.commit()
    print("Seeded ISO 8583 rules successfully!")

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_rules(db)
    finally:
        db.close()
