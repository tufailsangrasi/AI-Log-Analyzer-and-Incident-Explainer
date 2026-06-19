from typing import Dict, Any, List, Tuple
from app.models.validation_result import ValidationResult, ErrorType
from app.models.iso_rule import DataType
from app.services.rule_engine import RuleEngine
from app.utils import validators
import uuid

class ValidationService:
    def __init__(self, rule_engine: RuleEngine):
        self.rule_engine = rule_engine

    def validate_transaction(self, raw_data: Dict[str, Any], transaction_id: str) -> Tuple[bool, List[ValidationResult]]:
        mti = raw_data.get("MTI")
        if not mti:
            mti = raw_data.get("mti") # handle lower case too if it was pre-extracted
            
        if not mti:
             return False, [ValidationResult(
                transaction_id=transaction_id,
                field_number=0,
                field_name="MTI",
                error_type=ErrorType.MISSING,
                message="MTI is missing"
            )]

        rules = self.rule_engine.get_rules_for_mti(mti)
        results = []
        is_valid = True

        for rule in rules:
            field_key = f"DE{rule.field_number}"
            field_value = raw_data.get(field_key)

            # 1. Presence Validation
            if rule.mandatory and not field_value:
                is_valid = False
                results.append(ValidationResult(
                    transaction_id=transaction_id,
                    field_number=rule.field_number,
                    field_name=rule.field_name,
                    error_type=ErrorType.MISSING,
                    message=f"Mandatory field {field_key} is missing"
                ))
                continue
                
            if not field_value:
                continue # Optional field not present, it's ok

            # 2. Length Validation
            actual_len = len(field_value)
            if rule.is_variable:
                if actual_len > rule.max_length:
                    is_valid = False
                    results.append(ValidationResult(
                        transaction_id=transaction_id,
                        field_number=rule.field_number,
                        field_name=rule.field_name,
                        error_type=ErrorType.LENGTH,
                        expected=f"<= {rule.max_length}",
                        actual=str(actual_len),
                        message=f"Field {field_key} exceeds max length of {rule.max_length}"
                    ))
            else:
                # Fixed length
                if actual_len != rule.max_length:
                    is_valid = False
                    results.append(ValidationResult(
                        transaction_id=transaction_id,
                        field_number=rule.field_number,
                        field_name=rule.field_name,
                        error_type=ErrorType.LENGTH,
                        expected=str(rule.max_length),
                        actual=str(actual_len),
                        message=f"Field {field_key} length should be {rule.max_length}"
                    ))

            # 3. Format Validation
            if rule.data_type == DataType.NUMERIC and not validators.is_numeric(field_value):
                 is_valid = False
                 results.append(ValidationResult(
                    transaction_id=transaction_id,
                    field_number=rule.field_number,
                    field_name=rule.field_name,
                    error_type=ErrorType.FORMAT,
                    expected="numeric",
                    actual="contains non-digits",
                    message=f"Field {field_key} must be numeric"
                ))
            elif rule.data_type == DataType.ALPHA and not validators.is_alpha(field_value):
                 is_valid = False
                 results.append(ValidationResult(
                    transaction_id=transaction_id,
                    field_number=rule.field_number,
                    field_name=rule.field_name,
                    error_type=ErrorType.FORMAT,
                    expected="alpha",
                    actual="contains non-alpha",
                    message=f"Field {field_key} must be alpha"
                ))
            elif rule.data_type == DataType.ALPHANUMERIC and not validators.is_alphanumeric(field_value):
                is_valid = False
                results.append(ValidationResult(
                    transaction_id=transaction_id,
                    field_number=rule.field_number,
                    field_name=rule.field_name,
                    error_type=ErrorType.FORMAT,
                    expected="alphanumeric",
                    actual="contains special chars",
                    message=f"Field {field_key} must be alphanumeric"
                ))

        return is_valid, results
