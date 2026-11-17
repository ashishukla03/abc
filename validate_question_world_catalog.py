#!/usr/bin/env python3
"""
Validation script for Gramin PocketLab QuestionWorld Sample Catalog.
Ensures data integrity, schema compliance, and absence of malformed rows.
"""

import csv
import sys
import os

VALID_GRADE_BANDS = {'Preparatory', 'Middle', 'Secondary', 'Senior Secondary'}
VALID_CLASSES = set(range(5, 13))
VALID_STATUSES = {
    'Proposal pending board mapping',
    'Curriculum aligned working draft',
    'Specified — pending review'
}
VALID_AUTHORITIES = {'CBSE', 'CISCE', 'KSEAB', 'MSBSHSE', 'UPMSP', 'STATE_BOARD'}

EXPECTED_HEADER_COUNT = 14
EXPECTED_HEADERS = [
    'WorldID', 'Subject', 'GradeBand', 'Class', 'CurriculumAuthority',
    'Chapter', 'Topic', 'WorldTitle', 'EnvironmentType', 'NarrativeContext',
    'CoreInteractiveMechanic', 'PedagogicalTarget', 'MisconceptionAddressed', 'ProposalStatus'
]

def validate_catalog(file_path):
    print(f"Validating QuestionWorld catalog: {file_path}")
    if not os.path.exists(file_path):
        print(f"ERROR: File does not exist: {file_path}")
        return False

    with open(file_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        try:
            headers = next(reader)
        except StopIteration:
            print("ERROR: CSV file is empty.")
            return False

        errors = []
        warnings = []

        # 1. Header validation
        if len(headers) != EXPECTED_HEADER_COUNT:
            errors.append(f"Header column count mismatch: expected {EXPECTED_HEADER_COUNT}, got {len(headers)}")
        
        # Check header names
        for idx, (expected, actual) in enumerate(zip(EXPECTED_HEADERS, headers)):
            if actual.strip() != expected:
                warnings.append(f"Header column {idx+1} name note: expected '{expected}', got '{actual.strip()}'")

        rows = list(reader)
        # Strip trailing empty rows if any
        data_rows = [r for r in rows if any(cell.strip() for cell in r)]

        print(f"Loaded {len(data_rows)} data rows.")
        if len(data_rows) != 29:
            warnings.append(f"Record count is {len(data_rows)}, baseline catalog specifies 29 records.")

        seen_ids = set()

        for row_idx, row in enumerate(data_rows, start=1):
            # 2. Column count check per row
            if len(row) != EXPECTED_HEADER_COUNT:
                errors.append(f"Row {row_idx} column count error: expected {EXPECTED_HEADER_COUNT}, got {len(row)} (WorldID: {row[0] if row else 'EMPTY'})")
                continue

            world_id = row[0].strip()
            subject = row[1].strip()
            grade_band = row[2].strip()
            class_str = row[3].strip()
            authority = row[4].strip()
            chapter = row[5].strip()
            topic = row[6].strip()
            world_title = row[7].strip()
            env_type = row[8].strip()
            narrative = row[9].strip()
            mechanic = row[10].strip()
            ped_target = row[11].strip()
            misconception = row[12].strip()
            status = row[13].strip()

            # Unique ID check
            if not world_id:
                errors.append(f"Row {row_idx}: Missing WorldID.")
            elif world_id in seen_ids:
                errors.append(f"Row {row_idx}: Duplicate WorldID '{world_id}'.")
            else:
                seen_ids.add(world_id)

            # Class grade validation
            try:
                class_int = int(class_str)
                if class_int not in VALID_CLASSES:
                    errors.append(f"Row {row_idx} ({world_id}): Class {class_int} outside valid range 5-12.")
            except ValueError:
                errors.append(f"Row {row_idx} ({world_id}): Invalid integer for Class: '{class_str}'.")

            # Grade band validation
            if grade_band not in VALID_GRADE_BANDS:
                errors.append(f"Row {row_idx} ({world_id}): Invalid GradeBand '{grade_band}'. Must be one of {VALID_GRADE_BANDS}.")
            elif class_str == '5' and grade_band != 'Preparatory':
                errors.append(f"Row {row_idx} ({world_id}): Class 5 must be 'Preparatory' stage per NCF-SE 2023, got '{grade_band}'.")

            # Curriculum Authority check (NCERT must NOT be listed as authority)
            if authority == 'NCERT':
                errors.append(f"Row {row_idx} ({world_id}): NCERT listed as examination authority. NCERT is a textbook/curriculum framework resource, not an examining authority.")
            elif authority == 'KSEEB':
                warnings.append(f"Row {row_idx} ({world_id}): KSEEB should be updated to KSEAB (Karnataka School Examination and Assessment Board).")
            elif authority not in VALID_AUTHORITIES and not authority.startswith(('CBSE', 'CISCE', 'KSEAB')):
                warnings.append(f"Row {row_idx} ({world_id}): Unrecognized authority '{authority}'.")

            # Empty field checks
            for field_name, val in [
                ('Subject', subject), ('Chapter', chapter), ('Topic', topic),
                ('WorldTitle', world_title), ('EnvironmentType', env_type),
                ('NarrativeContext', narrative), ('CoreInteractiveMechanic', mechanic),
                ('PedagogicalTarget', ped_target), ('MisconceptionAddressed', misconception),
                ('ProposalStatus', status)
            ]:
                if not val:
                    errors.append(f"Row {row_idx} ({world_id}): Empty required field '{field_name}'.")

            # Status check
            if status not in VALID_STATUSES:
                errors.append(f"Row {row_idx} ({world_id}): Invalid Status '{status}'. Must be in {VALID_STATUSES}.")

        # Report results
        print("\n--- Validation Summary ---")
        if warnings:
            print(f"Warnings ({len(warnings)}):")
            for w in warnings:
                print(f"  [WARN] {w}")
        else:
            print("Zero warnings.")

        if errors:
            print(f"\nErrors found ({len(errors)}):")
            for e in errors:
                print(f"  [FAIL] {e}")
            return False
        else:
            print("\nALL VALIDATION CHECKS PASSED: 0 errors.")
            return True

if __name__ == '__main__':
    catalog_path = sys.argv[1] if len(sys.argv) > 1 else 'QUESTION_WORLD_SAMPLE_CATALOG.csv'
    success = validate_catalog(catalog_path)
    sys.exit(0 if success else 1)

