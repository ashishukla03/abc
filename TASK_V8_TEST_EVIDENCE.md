# GRAMIN POCKETLAB — TASK V8 TEST EVIDENCE & VERIFICATION LOG
## Comprehensive Audit Trail Across Unit, Integration, AST, and Browser Suites

**Date:** November 2026  
**Test Harness Environment:**
- Node.js: v22.14.0
- Python: 3.12.8
- Headless Browser: Google Chrome 134.0.6998.89 (Official Build) via Chrome DevTools Protocol (CDP)
- Operating System: Windows 11 Enterprise (10.0.26100)

---

### 1. SUMMARY TEST MATRIX

| Category | Suite / Tool | Test Count | Passed | Failed | Status |
|---|---|---|---|---|---|
| Unit / Integration | `test_store_and_router.mjs` | 12 | 12 | 0 | **PASS** |
| Unit / Integration | `test_content_and_i18n.mjs` | 8 | 8 | 0 | **PASS** |
| Unit / Integration | `test_physics_module.mjs` | 6 | 6 | 0 | **PASS** |
| Unit / Integration | `test_learning_runner.mjs` | 9 | 9 | 0 | **PASS** |
| Unit / Integration | `test_service_worker_contract.mjs` | 6 | 6 | 0 | **PASS** |
| Unit / Integration | `test_math_module.mjs` | 8 | 8 | 0 | **PASS** |
| Unit / Integration | `test_biology_module.mjs` | 5 | 5 | 0 | **PASS** |
| Unit / Integration | `test_chemistry_module.mjs` | 6 | 6 | 0 | **PASS** |
| Unit / Integration | `test_learning_runner_failure_paths.mjs` | 6 | 6 | 0 | **PASS** |
| Unit / Integration | `test_offline_status.mjs` | 6 | 6 | 0 | **PASS** |
| AST & Schema | `TASK_V6_AST_VALIDATOR.py` | 15 | 15 | 0 | **PASS** |
| Catalog Integrity | `validate_question_world_catalog.py` | 29 rows | 29 | 0 | **PASS** |
| Real Browser CDP | `run_real_browser_validation.mjs` | 8 checks | 8 | 0 | **PASS** |
| Static Gatekeeper | `TASK_V6_STATIC_VALIDATION.py` | 7 sections | 6 pass, 1 expected fail | **EXPECTED GATE** |

**Total Automated Test Assertions:** 101 checks passed, 0 unexpected failures.

---

### 2. DETAILED TEST EXECUTION LOGS

#### 2.1 Unified Unit Test Suite (`node tests/run_all_tests.mjs`)
**Execution Command:** `node tests/run_all_tests.mjs`  
**Exit Code:** `0`

```text
======================================================================
GRAMIN POCKETLAB — COMPLETE AUTOMATED TEST SUITE RUNNER
======================================================================
[PASS] Store and Router (test_store_and_router.mjs): 12 tests passed, 0 failed
[PASS] Content and Internationalization (test_content_and_i18n.mjs): 8 tests passed, 0 failed
[PASS] Physics Module Flagship (test_physics_module.mjs): 6 tests passed, 0 failed
[PASS] Learning Runner 7-Step Cycle (test_learning_runner.mjs): 9 tests passed, 0 failed
[PASS] Service Worker Contract (test_service_worker_contract.mjs): 6 tests passed, 0 failed
[PASS] Mathematics Module (Water Share) (test_math_module.mjs): 8 tests passed, 0 failed
[PASS] Biology Module (Food Web) (test_biology_module.mjs): 5 tests passed, 0 failed
[PASS] Chemistry Module (pH Color Lab) (test_chemistry_module.mjs): 6 tests passed, 0 failed
[PASS] Learning Runner Failure Paths & Invariants (test_learning_runner_failure_paths.mjs): 6 tests passed, 0 failed
[PASS] Truthful Offline Telemetry (test_offline_status.mjs): 6 tests passed, 0 failed
======================================================================
SUMMARY: 72 passed, 0 failed across 10 suites.
Baseline 41 tests status: ALL PRESERVED WITH ZERO REGRESSION
======================================================================
```

#### 2.2 AST Validator (`python TASK_V6_AST_VALIDATOR.py`)
**Execution Command:** `python TASK_V6_AST_VALIDATOR.py`  
**Exit Code:** `0`

```text
==================================================
GRAMIN POCKETLAB — TASK V6 CANONICAL AST VALIDATION
==================================================
Loading fixtures from: TASK_V6_AST_FIXTURES.json
Declared State Schema: 7 fields registered.

--- Testing 4 Valid Test Cases ---
  [PASS] valid_comparison_simple: Valid scalar comparison checking plot1 == 2 (nodes=3, result=True)
  [PASS] valid_nested_logical: Valid nested AND expression for canal water sharing (nodes=13, result=True)
  [PASS] valid_between_and_not: Valid BETWEEN operator with NOT condition (nodes=9, result=True)
  [PASS] valid_in_array_operator: Valid IN operator checking string indicator in allowable set (nodes=5, result=True)

--- Testing 11 Invalid / Fail-Closed Test Cases ---
  [PASS] invalid_unknown_operator: Caught expected error 'UNKNOWN_OPERATOR' as required (Fail-Closed)
  [PASS] invalid_missing_operand: Caught expected error 'MISSING_OPERAND' as required (Fail-Closed)
  [PASS] invalid_undeclared_variable: Caught expected error 'UNDECLARED_VARIABLE' as required (Fail-Closed)
  [PASS] invalid_wrong_variable_type: Caught expected error 'TYPE_MISMATCH' as required (Fail-Closed)
  [PASS] invalid_unexpected_extra_field: Caught expected error 'UNEXPECTED_EXTRA_FIELD' as required (Fail-Closed)
  [PASS] invalid_empty_logical_child_list: Caught expected error 'EMPTY_LOGICAL_CHILD_LIST' as required (Fail-Closed)
  [PASS] invalid_excessive_depth: Caught expected error 'EXCESSIVE_DEPTH' as required (Fail-Closed)
  [PASS] invalid_excessive_node_count: Caught expected error 'EXCESSIVE_NODE_COUNT' as required (Fail-Closed)
  [PASS] invalid_non_finite_number: Caught expected error 'NON_FINITE_NUMBER' as required (Fail-Closed)
  [PASS] invalid_unknown_schema_version: Caught expected error 'UNKNOWN_SCHEMA_VERSION' as required (Fail-Closed)
  [PASS] invalid_missing_state_value: Caught expected error 'MISSING_STATE_VALUE' as required (Fail-Closed)

--- Summary ---
Valid Test Cases Passed:   4 / 4
Invalid Test Cases Caught: 11 / 11
ALL CANONICAL AST VALIDATION CHECKS PASSED: 0 errors.
```

#### 2.3 Question World Catalog Validator (`python validate_question_world_catalog.py`)
**Execution Command:** `python validate_question_world_catalog.py`  
**Exit Code:** `0`

```text
Validating QuestionWorld catalog: QUESTION_WORLD_SAMPLE_CATALOG.csv
Loaded 29 data rows.

--- Validation Summary ---
Zero warnings.

ALL VALIDATION CHECKS PASSED: 0 errors.
```

#### 2.4 Real Browser CDP Validation (`node tests/run_real_browser_validation.mjs`)
**Execution Command:** `node tests/run_real_browser_validation.mjs`  
**Exit Code:** `0`

```text
=== Gramin PocketLab Real-Browser & Offline Validation ===

Starting local static HTTP server on port 8000...
1. Checking Initial Application Load & Console Errors...
   Title: "Gramin PocketLab — STEM Missions" | Console Errors: 0
2. Checking Mission Map & Navigation to Physics...
   Cards: 4 | Navigated to: #/physics/s1_intro
3. Navigating Physics S1 Brief -> S2 Prediction -> S3 Micro-Lab...
   Hash: #/physics/s3_explore | Canvas Mounted: true
4. Testing Physics Audio Engine & Controls...
   Play 220Hz: true | 440Hz Cycles: "4.4 cycles / 10 ms" | Stopped: true
5. Completing S3 Lab -> S4 Concept -> S5 Diagnostic -> S6 Exit...
   Badge & Completion Saved to LocalStorage: true
6. Testing Refresh Persistence...
   State Preserved After Page Reload: true
7. Testing Mobile Viewport Usability (360x640)...
   Horizontal Overflow (>360px): false (scrollWidth: 360)
8. Testing Service Worker & Offline Caching...
   ServiceWorker Controller Active: true | Cached Assets in Cache: 16
   Emulating Offline Network Mode in Chrome...
   Reloaded While Offline: true (Title: "Gramin PocketLab — STEM Missions")

Detailed verification results written to: C:\Users\priya\Downloads\STEM\audit\BROWSER_VERIFICATION_EVIDENCE.json
```

#### 2.5 Static Validation & Integrity Gate (`python TASK_V6_STATIC_VALIDATION.py`)
**Execution Command:** `python TASK_V6_STATIC_VALIDATION.py`  
**Exit Code:** `1` *(Expected due to strict evidence gate)*

```text
======================================================================
GRAMIN POCKETLAB — ANTIGRAVITY TASK V6 STATIC & RUNTIME VALIDATION
======================================================================

======================================================================
1. STRUCTURAL CSV VALIDATION (QUESTION_WORLD_SAMPLE_CATALOG.csv)
======================================================================
[PASS] Validated 29 data rows across 14 columns.
       - All WorldIDs unique.
       - Class 5 aligned to Preparatory stage.
       - Clean authority separation (CBSE/KSEAB; zero NCERT boards).
       - Zero empty fields; uniform proposal status.

======================================================================
2. CSP & RENDERER ISOLATION STATIC CHECK
======================================================================
[PASS] Content-Security-Policy verified:
       - Zero 'unsafe-eval', zero 'unsafe-inline'.
       - All 9 required strict directives present (connect-src 'none', etc.).
       - iframe sandbox='allow-scripts' enforced.
       - sessionNonce authentication and opaque origin strategy defined.

======================================================================
3. RECOMMENDATION FORMULA NUMERICAL SMOKE TEST
======================================================================
[PASS] Authoritative 40/30/20/10 Priority Formula verified:
       - Cold-Start Scenario: P = 8.00 / 100
       - Urgent Exam + Misconception Scenario: P = 83.71 / 100
       - Zero occurrences of obsolete 0.35W formula in any of the 10 specifications.

======================================================================
4. CANONICAL PHASE TAXONOMY & SCOPE PROTECTION TEST
======================================================================
[PASS] Canonical Phase Taxonomy verified (30% + 30% + 25% + 15% = 100%):
       - Phase 1: Diagnostic & Concept Exploration (30%)
       - Phase 2: Worked Examples & Guided Practice (30%)
       - Phase 3: Retrieval Practice & Misconception Remediation (25%)
       - Phase 4: Spaced Recall & Synthesis Simulation (15%)
[PASS] Scope Protection Invariant verified:
       - Retained 5/5 topics under 50% time deficit.
       - Zero silent topic deletions.

======================================================================
5. PRIVACY, DPDP ACT & NCF TERMINOLOGY AUDIT
======================================================================
[PASS] Privacy and Statutory Terminology verified:
       - Zero occurrences of 'Zero-PII'.
       - Zero machine-specific file:/// links.
       - Zero duplicate canvasWidth fields.
       - DPDP Act 2023 commencement dates accurate (Sec 2: 13 Nov 2025; Sec 9: 13 May 2027).
       - NCF-SE 2023 Box 3.3v Panchpadi vs NCF-FS 2022 Box 4.2A Panchaadi accurately differentiated.

======================================================================
6. DOCUMENT STATUSES & SOURCE ARCHIVE AUDIT
======================================================================
[FAIL - EVIDENCE INCOMPLETE] Source baseline archive STEM(3)(1)(3).zip is missing from workspace.
                             Original member-level baseline hash verification CANNOT be completed.

======================================================================
7. RUNTIME AUTOMATED TESTS (PORTABLE NODE.JS SUITES)
======================================================================
  [PASS] tests/test_content_and_i18n.mjs: 8 passed, 0 failed (exit code 0)
  [PASS] tests/test_learning_runner.mjs: 9 passed, 0 failed (exit code 0)
  [PASS] tests/test_physics_module.mjs: 6 passed, 0 failed (exit code 0)
  [PASS] tests/test_service_worker_contract.mjs: 6 passed, 0 failed (exit code 0)
  [PASS] tests/test_store_and_router.mjs: 12 passed, 0 failed (exit code 0)

Total Portable Node.js Tests: 41 passed, 0 failed.

======================================================================
OVERALL TASK V6 STATIC VALIDATION RESULT: FAILED
======================================================================
```

*Note on Gate Exit Code:* The static validator correctly exited with code 1 due to Section 6. In previous unhardened versions, the script incorrectly swallowed the missing baseline file and printed a false positive `PASSED`. Task v8 repaired this validator logic to ensure fail-closed truthfulness.

