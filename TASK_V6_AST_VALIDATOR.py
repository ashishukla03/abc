#!/usr/bin/env python3
"""
TASK_V6_AST_VALIDATOR.py
Gramin PocketLab — Pre-Event Architectural Specification Test Harness

CRITICAL ARCHITECTURAL BOUNDARY:
This file is a standalone specification test harness and reference evaluator.
It is NOT a production application runtime or client-side engine.
Its purpose is to formally validate the canonical Declarative AST schema,
verify strict schema constraints, and execute the reference evaluation algorithm
against test fixtures in TASK_V6_AST_FIXTURES.json.

FAIL-CLOSED BEHAVIOR:
Any schema violation, unexpected field, undeclared variable, non-finite number,
or resource limit breach (depth > 8, nodes > 64, ops > 128) MUST immediately
raise a validation or evaluation error and terminate with a non-zero exit code.
"""

import sys
import json
import math
from typing import Any, Dict, List, Tuple, Set

CANONICAL_SCHEMA_VERSION = "1.0.0"
MAX_AST_DEPTH = 8
MAX_AST_NODES = 64
MAX_EVAL_OPERATIONS = 128

LOGICAL_OPERATORS = {"AND", "OR", "NOT"}
COMPARISON_OPERATORS = {"EQ", "NEQ", "LT", "LTE", "GT", "GTE", "IN", "BETWEEN"}
NODE_TYPES = {"logical", "comparison", "variable", "literal"}
VALUE_TYPES = {"number", "string", "boolean"}

ALLOWED_KEYS_LOGICAL = {"nodeType", "operator", "children"}
ALLOWED_KEYS_COMPARISON = {"nodeType", "operator", "left", "right"}
ALLOWED_KEYS_VARIABLE = {"nodeType", "path"}
ALLOWED_KEYS_LITERAL = {"nodeType", "valueType", "value"}


class ASTValidationError(Exception):
    def __init__(self, code: str, message: str):
        super().__init__(f"[{code}] {message}")
        self.code = code
        self.message = message


class ASTEvaluationError(Exception):
    def __init__(self, code: str, message: str):
        super().__init__(f"[{code}] {message}")
        self.code = code
        self.message = message


class CanonicalASTReferenceEvaluator:
    """
    Reference evaluator implementation adhering strictly to the canonical
    Gramin PocketLab QuestionWorld AST Specification v1.0.0.
    """

    def __init__(self, declared_schema: Dict[str, str]):
        self.declared_schema = declared_schema
        self.op_counter = 0

    def validate_schema(self, node: Any, depth: int = 1) -> int:
        """
        Statically validates the structure, types, allowed keys, and boundaries of an AST node.
        Returns total node count of the subtree.
        """
        if not isinstance(node, dict):
            raise ASTValidationError("INVALID_NODE_STRUCTURE", f"Node must be a dict, got {type(node).__name__}")

        if depth > MAX_AST_DEPTH:
            raise ASTValidationError("EXCESSIVE_DEPTH", f"AST depth {depth} exceeds maximum allowable depth of {MAX_AST_DEPTH}")

        node_type = node.get("nodeType")
        if node_type not in NODE_TYPES:
            raise ASTValidationError("INVALID_NODE_TYPE", f"Unknown nodeType: {node_type}")

        node_count = 1

        if node_type == "logical":
            extra_keys = set(node.keys()) - ALLOWED_KEYS_LOGICAL
            if extra_keys:
                raise ASTValidationError("UNEXPECTED_EXTRA_FIELD", f"Extra fields in logical node: {extra_keys}")

            op = node.get("operator")
            if op not in LOGICAL_OPERATORS:
                raise ASTValidationError("UNKNOWN_OPERATOR", f"Unknown logical operator: {op}")

            children = node.get("children")
            if not isinstance(children, list):
                raise ASTValidationError("INVALID_LOGICAL_CHILDREN", "Logical node 'children' must be an array")

            if op in ("AND", "OR") and len(children) < 2:
                raise ASTValidationError("EMPTY_LOGICAL_CHILD_LIST", f"Operator '{op}' requires at least 2 children, got {len(children)}")

            if op == "NOT" and len(children) != 1:
                raise ASTValidationError("INVALID_LOGICAL_CHILDREN", f"Operator 'NOT' requires exactly 1 child, got {len(children)}")

            for child in children:
                child_count = self.validate_schema(child, depth + 1)
                node_count += child_count

        elif node_type == "comparison":
            extra_keys = set(node.keys()) - ALLOWED_KEYS_COMPARISON
            if extra_keys:
                raise ASTValidationError("UNEXPECTED_EXTRA_FIELD", f"Extra fields in comparison node: {extra_keys}")

            op = node.get("operator")
            if op not in COMPARISON_OPERATORS:
                raise ASTValidationError("UNKNOWN_OPERATOR", f"Unknown comparison operator: {op}")

            if "left" not in node or "right" not in node:
                raise ASTValidationError("MISSING_OPERAND", "Comparison node requires both 'left' and 'right' operands")

            left = node["left"]
            node_count += self.validate_value_node(left, depth + 1)

            right = node["right"]
            if op in ("IN", "BETWEEN"):
                if not isinstance(right, list):
                    raise ASTValidationError("INVALID_OPERAND_SHAPE", f"Operator '{op}' requires array right operand")
                if op == "BETWEEN" and len(right) != 2:
                    raise ASTValidationError("INVALID_OPERAND_SHAPE", f"Operator 'BETWEEN' requires exactly 2 bounds [min, max]")
                if op == "IN" and len(right) < 1:
                    raise ASTValidationError("INVALID_OPERAND_SHAPE", "Operator 'IN' requires at least 1 element in candidate array")
                for item in right:
                    node_count += self.validate_value_node(item, depth + 1)
            else:
                if isinstance(right, list):
                    raise ASTValidationError("INVALID_OPERAND_SHAPE", f"Scalar operator '{op}' cannot take array right operand")
                node_count += self.validate_value_node(right, depth + 1)

        else:
            raise ASTValidationError("INVALID_ROOT_CONDITION", f"Top-level condition node must be 'logical' or 'comparison', got '{node_type}'")

        if node_count > MAX_AST_NODES:
            raise ASTValidationError("EXCESSIVE_NODE_COUNT", f"Total node count {node_count} exceeds maximum of {MAX_AST_NODES}")

        return node_count

    def validate_value_node(self, node: Any, depth: int) -> int:
        """Validates a variable or literal value node."""
        if not isinstance(node, dict):
            raise ASTValidationError("INVALID_VALUE_NODE", f"Value node must be a dict, got {type(node).__name__}")

        if depth > MAX_AST_DEPTH:
            raise ASTValidationError("EXCESSIVE_DEPTH", f"Value node depth {depth} exceeds max depth {MAX_AST_DEPTH}")

        node_type = node.get("nodeType")
        if node_type not in ("variable", "literal"):
            raise ASTValidationError("INVALID_VALUE_NODE_TYPE", f"Value nodeType must be 'variable' or 'literal', got '{node_type}'")

        if node_type == "variable":
            extra_keys = set(node.keys()) - ALLOWED_KEYS_VARIABLE
            if extra_keys:
                raise ASTValidationError("UNEXPECTED_EXTRA_FIELD", f"Extra fields in variable node: {extra_keys}")
            path = node.get("path")
            if not isinstance(path, str) or not path.strip():
                raise ASTValidationError("INVALID_VARIABLE_PATH", "Variable node requires non-empty string 'path'")
            if path not in self.declared_schema:
                raise ASTValidationError("UNDECLARED_VARIABLE", f"Variable '{path}' is not declared in state schema")

        elif node_type == "literal":
            extra_keys = set(node.keys()) - ALLOWED_KEYS_LITERAL
            if extra_keys:
                raise ASTValidationError("UNEXPECTED_EXTRA_FIELD", f"Extra fields in literal node: {extra_keys}")
            vtype = node.get("valueType")
            if vtype not in VALUE_TYPES:
                raise ASTValidationError("INVALID_LITERAL_TYPE", f"Unknown literal valueType: '{vtype}'")
            val = node.get("value")
            if vtype == "number":
                if not isinstance(val, (int, float)) or isinstance(val, bool) or not math.isfinite(val):
                    raise ASTValidationError("NON_FINITE_NUMBER", f"Literal number must be finite, got: {val}")
            elif vtype == "string":
                if not isinstance(val, str):
                    raise ASTValidationError("TYPE_MISMATCH", f"Expected string literal, got {type(val).__name__}")
            elif vtype == "boolean":
                if not isinstance(val, bool):
                    raise ASTValidationError("TYPE_MISMATCH", f"Expected boolean literal, got {type(val).__name__}")

        return 1

    def resolve_value(self, node: Dict[str, Any], state: Dict[str, Any]) -> Tuple[str, Any]:
        """Resolves a variable or literal to (type, raw_value)."""
        ntype = node["nodeType"]
        if ntype == "literal":
            return (node["valueType"], node["value"])
        elif ntype == "variable":
            path = node["path"]
            if path not in state:
                raise ASTEvaluationError("MISSING_STATE_VALUE", f"State is missing declared variable: '{path}'")
            val = state[path]
            expected_type = self.declared_schema[path]

            # Validate runtime type against declared schema
            if expected_type == "number":
                if not isinstance(val, (int, float)) or isinstance(val, bool) or not math.isfinite(val):
                    raise ASTEvaluationError("TYPE_MISMATCH", f"Variable '{path}' expected finite number, got {val}")
                return ("number", float(val))
            elif expected_type == "string":
                if not isinstance(val, str):
                    raise ASTEvaluationError("TYPE_MISMATCH", f"Variable '{path}' expected string, got {type(val).__name__}")
                return ("string", val)
            elif expected_type == "boolean":
                if not isinstance(val, bool):
                    raise ASTEvaluationError("TYPE_MISMATCH", f"Variable '{path}' expected boolean, got {type(val).__name__}")
                return ("boolean", val)
            else:
                raise ASTEvaluationError("TYPE_MISMATCH", f"Unsupported schema type: {expected_type}")
        else:
            raise ASTEvaluationError("INVALID_VALUE_NODE", f"Cannot resolve value for nodeType: {ntype}")

    def evaluate(self, node: Dict[str, Any], state: Dict[str, Any]) -> bool:
        """
        Recursively evaluates an AST condition against state.
        Fails closed on any error, returning false or raising ASTEvaluationError.
        """
        self.op_counter += 1
        if self.op_counter > MAX_EVAL_OPERATIONS:
            raise ASTEvaluationError("OPERATION_QUOTA_EXCEEDED", f"Exceeded maximum operation budget ({MAX_EVAL_OPERATIONS})")

        ntype = node["nodeType"]

        if ntype == "logical":
            op = node["operator"]
            children = node["children"]
            if op == "AND":
                for child in children:
                    if not self.evaluate(child, state):
                        return False
                return True
            elif op == "OR":
                for child in children:
                    if self.evaluate(child, state):
                        return True
                return False
            elif op == "NOT":
                return not self.evaluate(children[0], state)
            else:
                raise ASTEvaluationError("UNKNOWN_OPERATOR", f"Unknown logical operator: {op}")

        elif ntype == "comparison":
            op = node["operator"]
            left_type, left_val = self.resolve_value(node["left"], state)

            if op in ("IN", "BETWEEN"):
                rights = [self.resolve_value(r, state) for r in node["right"]]
                if op == "BETWEEN":
                    min_type, min_val = rights[0]
                    max_type, max_val = rights[1]
                    if left_type != "number" or min_type != "number" or max_type != "number":
                        raise ASTEvaluationError("TYPE_MISMATCH", "BETWEEN operator requires numeric operands")
                    return min_val <= left_val <= max_val
                elif op == "IN":
                    for r_type, r_val in rights:
                        if left_type == r_type and left_val == r_val:
                            return True
                    return False

            else:
                right_type, right_val = self.resolve_value(node["right"], state)
                if left_type != right_type:
                    raise ASTEvaluationError("TYPE_MISMATCH", f"Cannot compare {left_type} with {right_type} using {op}")

                if op == "EQ":
                    return left_val == right_val
                elif op == "NEQ":
                    return left_val != right_val
                elif op == "LT":
                    return left_val < right_val
                elif op == "LTE":
                    return left_val <= right_val
                elif op == "GT":
                    return left_val > right_val
                elif op == "GTE":
                    return left_val >= right_val
                else:
                    raise ASTEvaluationError("UNKNOWN_OPERATOR", f"Unknown comparison operator: {op}")

        else:
            raise ASTEvaluationError("INVALID_CONDITION_NODE", f"Cannot evaluate condition nodeType: {ntype}")


def run_ast_validator(fixture_path: str = "TASK_V6_AST_FIXTURES.json") -> bool:
    print("==================================================")
    print("GRAMIN POCKETLAB — TASK V6 CANONICAL AST VALIDATION")
    print("==================================================")
    print(f"Loading fixtures from: {fixture_path}")

    try:
        with open(fixture_path, "r", encoding="utf-8") as fp:
            data = json.load(fp)
    except Exception as e:
        print(f"[FATAL] Failed to load fixture file: {e}")
        return False

    schema_version = data.get("schemaVersion")
    if schema_version != CANONICAL_SCHEMA_VERSION:
        print(f"[FATAL] Incompatible fixture schema version: '{schema_version}' (expected '{CANONICAL_SCHEMA_VERSION}')")
        return False

    declared_schema = data.get("declaredStateSchema", {})
    print(f"Declared State Schema: {len(declared_schema)} fields registered.")

    evaluator = CanonicalASTReferenceEvaluator(declared_schema)

    # 1. Run Valid Test Cases
    valid_cases = data.get("validTestCases", [])
    print(f"\n--- Testing {len(valid_cases)} Valid Test Cases ---")
    valid_passed = 0
    for case in valid_cases:
        cid = case["id"]
        desc = case["description"]
        state = case.get("state", {})
        ast = case["ast"]
        expected = case["expectedResult"]

        evaluator.op_counter = 0
        try:
            total_nodes = evaluator.validate_schema(ast)
            res = evaluator.evaluate(ast, state)
            assert res == expected, f"Result {res} != expected {expected}"
            print(f"  [PASS] {cid}: {desc} (nodes={total_nodes}, result={res})")
            valid_passed += 1
        except Exception as e:
            print(f"  [FAIL] {cid}: {e}")
            return False

    # 2. Run Invalid Test Cases
    invalid_cases = data.get("invalidTestCases", [])
    print(f"\n--- Testing {len(invalid_cases)} Invalid / Fail-Closed Test Cases ---")
    invalid_passed = 0
    for case in invalid_cases:
        cid = case["id"]
        desc = case["description"]
        expected_error = case["expectedError"]
        state = case.get("state", {})
        ast = case.get("ast")

        evaluator.op_counter = 0
        caught_error = None

        try:
            # Check for version error
            if case.get("schemaVersion") and case.get("schemaVersion") != CANONICAL_SCHEMA_VERSION:
                raise ASTValidationError("UNKNOWN_SCHEMA_VERSION", f"Unsupported version: {case.get('schemaVersion')}")

            total_nodes = evaluator.validate_schema(ast)
            # If static validation passed, run evaluation to trigger runtime error
            evaluator.evaluate(ast, state)
        except (ASTValidationError, ASTEvaluationError) as err:
            caught_error = err.code
        except Exception as generic_err:
            caught_error = type(generic_err).__name__

        if caught_error == expected_error:
            print(f"  [PASS] {cid}: Caught expected error '{caught_error}' as required (Fail-Closed)")
            invalid_passed += 1
        else:
            print(f"  [FAIL] {cid}: Expected error '{expected_error}', got '{caught_error}'")
            return False

    print("\n--- Summary ---")
    print(f"Valid Test Cases Passed:   {valid_passed} / {len(valid_cases)}")
    print(f"Invalid Test Cases Caught: {invalid_passed} / {len(invalid_cases)}")
    print("ALL CANONICAL AST VALIDATION CHECKS PASSED: 0 errors.")
    return True


if __name__ == "__main__":
    success = run_ast_validator()
    sys.exit(0 if success else 1)

