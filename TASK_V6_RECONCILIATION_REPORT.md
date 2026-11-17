# TASK V6 RECONCILIATION REPORT: SECURITY, VALIDATION & EVIDENCE RECONCILIATION

**Document ID:** GPL-REP-V6-REC-01  
**Project:** Gramin PocketLab — K–12 Multi-Board Learning Ecosystem  
**Audit Date:** 2026-11-11  
**Status:** Official Architectural Reconciliation & Security Gate Report  
**Author:** Lead Application-Security Architect, Systems Architect & Independent Quality Reviewer  
**Classification:** Pre-Event Specification Reconciliation, Security Hardening & Evidence Grounding  

---

## 1. Executive Summary

This report documents the findings, systematic technical corrections, and reproducible verification evidence for **Antigravity Task v6: Security, Validation & Evidence Reconciliation**.

The objective of Task v6 was to eliminate material inconsistencies identified in the Task v5 package, resolve dangerous security ambiguities in the Content Security Policy (CSP) and sandbox isolation contract, establish one canonical Declarative AST schema and machine-executable test harness, ground personal learning models and preparation algorithms in defensible mathematics, correct statutory DPDP Act 2023 and NCF-SE 2023 citations, and ensure that all validation claims are truthful, reproducible, and strictly categorized.

### High-Priority Architectural Resolutions
1. **CSP & Sandbox Hardening:** Completely eradicated `'unsafe-eval'` and `'unsafe-inline'` from renderer CSP directives. Defined the complete iframe sandbox contract (`sandbox="allow-scripts"` without `allow-same-origin`), established the opaque-origin strategy (`origin === "null"`), and designed a typed `postMessage` protocol authenticated via a 32-byte session nonce.
2. **Canonical Declarative AST Schema (v1.0.0):** Unified conflicting TypeScript, Python, and Markdown AST representations into one canonical, machine-readable specification. Implemented `TASK_V6_AST_FIXTURES.json` and `TASK_V6_AST_VALIDATOR.py`, verifying 4 valid cases and 11 invalid fail-closed cases (unknown operators, undeclared variables, extra fields, excessive depth/node count, and non-finite numbers).
3. **Authoritative Recommendation Priority Formula:** Standardized the 40/30/20/10 linear model $P(C) = \text{clamp}(40E + 30R + 20Q + 10S, 0, 100)$ across all specifications and reports, fully defining all inputs, cold-start behavior ($P=8.00$), and high-urgency behavior ($P=83.71$). Completely eliminated the obsolete $0.35W$ formula and purged unsubstantiated "Bayesian" claims.
4. **Canonical 4-Phase Preparation Taxonomy:** Unified phase terminology across all planner and test documents: Phase 1: Diagnostic & Concept Exploration (30%), Phase 2: Worked Examples & Guided Practice (30%), Phase 3: Retrieval Practice & Misconception Remediation (25%), and Phase 4: Spaced Recall & Synthesis Simulation (15%). Confirmed 100% syllabus scope preservation (zero topics dropped under time deficits).
5. **Statutory & Educational Accuracy:** Corrected DPDP Act 2023 commencement framing (Section 2 child definition in force since 13 Nov 2025; Section 9 operational duties scheduled for 13 May 2027); differentiated NCF-SE 2023 Box 3.3v *Panchpadi* (*Aditi*) from NCF-FS 2022 Box 4.2A *Panchaadi*; removed fixed age assumptions based solely on class; and purged misleading "Zero-PII" claims in favor of data minimization.
6. **Honest Baseline & Test Accounting:** Recorded the missing `STEM(3)(1)(3).zip` source archive as an official blocker without fabricating hashes. Verified all 41 portable Node.js unit and contract tests in `tests/`, and categorized physical hardware targets (55+ FPS on 2GB RAM devices) as unverified design targets.

---

## 2. Source Archive Identity & Baseline Integrity Blocker

In accordance with strict Lead Architect standards of forensic integrity:
- **Baseline Requirement:** Task v6 instructions mandated using `STEM(3)(1)(3).zip` as the exact prior baseline archive.
- **Physical Inspection Finding:** Forensic inspection of `C:\Users\priya\Downloads\` and the workspace confirmed that `STEM(3)(1)(3).zip` is **NOT present** in the environment. The available archives in the directory are `STEM(3)(1).zip` (SHA-256: `3fe4...`) and `STEM_RECONCILED_WORKSPACE.zip`.
- **Honest Action Taken:** In strict compliance with Section 1 and Section 8 of the prompt, original hashes for `STEM(3)(1)(3).zip` have been marked as **`NOT_VERIFIABLE_ARCHIVE_UNAVAILABLE`** in `TASK_V6_CHANGE_MANIFEST.csv`. No hashes were fabricated or approximated. This missing archive is formally recorded as a documentation blocker.

---

## 3. Systematic Item-by-Item Reconciliation Matrix

### Issue 1: Content Security Policy & Sandbox Execution Isolation Contract
- **Original Defect:** The QuestionWorld specification included a contradictory CSP directive string containing `script-src 'self' 'unsafe-eval' blocked`, creating dangerous ambiguity as to whether dynamic script evaluation was permitted. The sandbox contract lacked origin definitions, nonce authentication, and resource quotas.
- **Correction Made:**
  - Removed all occurrences of `'unsafe-eval'` and `'unsafe-inline'` from CSP headers.
  - Specified the exact CSP header: `default-src 'none'; script-src 'self' 'nonce-{SESSION_NONCE}'; style-src 'self' 'nonce-{SESSION_NONCE}'; img-src 'self' data:; media-src 'self' data:; connect-src 'none'; object-src 'none'; base-uri 'none'; frame-src 'none'; form-action 'none'; worker-src 'none';`.
  - Defined the iframe sandbox attribute: `sandbox="allow-scripts"` (strictly denying `allow-same-origin`, `allow-top-navigation`, `allow-popups`, `allow-forms`, `allow-modals`, `allow-downloads`).
  - Documented the opaque-origin strategy (`origin === "null"`), explaining that wildcard target origin in `postMessage` cannot be treated as authentication.
  - Designed the safe `postMessage` protocol: parent window verification (`event.source === iframe.contentWindow`), 32-byte cryptographically secure per-session hex nonce (`sessionNonce`), typed message envelope, 64 KB payload limit, 60 msg/sec rate limit, and fail-closed termination.
  - Established formal resource and evaluation limits: AST depth $\le 8$, node count $\le 64$, ops/tick $\le 128$, execution time $\le 5\text{ ms}$, frame budget $\le 16.6\text{ ms}$, and state size $\le 32\text{ KB}$.
  - Explicitly labeled the 4-layer sandbox as an **architectural proposal**, documenting trade-offs (e.g. Spectre/microarchitectural side-channels in shared browser processes; cross-origin domain requirements for production multi-tenancy).
- **Files & Sections Changed:** `QUESTION_WORLD_SCHEMA_AND_RENDERER_SPEC.md` (Sections 4.1 through 4.5).
- **Remaining Limitation:** Live browser exploit penetration testing requires an active HTTP server and web driver environment during hackathon runtime development.
- **Evidence:** Verified statically via `TASK_V6_STATIC_VALIDATION.py` (Section 2).

---

### Issue 2: Inconsistent Declarative AST Schemas & Reference Evaluator
- **Original Defect:** The Task v5 TypeScript definitions, Python validation examples, and report code used contradictory node structures (`logicalOp` vs `operator`, `conditions` vs `operands`, `op` vs `operator`, `varRef` vs `field`).
- **Correction Made:**
  - Established exactly one machine-readable **Canonical AST Schema (v1.0.0)**.
  - Standardized node shapes across TypeScript and JSON:
    - Logical Node: `{ nodeType: 'logical', operator: 'AND'|'OR'|'NOT', children: [...] }`
    - Comparison Node: `{ nodeType: 'comparison', operator: 'EQ'|'NEQ'|'LT'|'LTE'|'GT'|'GTE'|'IN'|'BETWEEN', left: ValueNode, right: ValueNode|ValueNode[] }`
    - Variable Node: `{ nodeType: 'variable', path: 'string' }`
    - Literal Node: `{ nodeType: 'literal', valueType: 'number'|'string'|'boolean', value: ... }`
  - Authored `TASK_V6_AST_FIXTURES.json` containing 4 valid test cases and 11 invalid test cases.
  - Authored `TASK_V6_AST_VALIDATOR.py`, a standalone specification reference evaluator enforcing strict bounds (depth $\le 8$, nodes $\le 64$, ops $\le 128$) and fail-closed behavior.
  - Clearly labeled the reference evaluator as a **Specification Test Harness**, not an implemented production app engine.
- **Files & Sections Changed:** `QUESTION_WORLD_SCHEMA_AND_RENDERER_SPEC.md` (Sections 2.1 and 5.0), `TASK_V6_AST_FIXTURES.json`, `TASK_V6_AST_VALIDATOR.py`.
- **Remaining Limitation:** The AST evaluator is validated as a standalone Python/Node test harness; integration into the PWA canvas runtime remains for hackathon implementation.
- **Evidence:** Executed `TASK_V6_AST_VALIDATOR.py` (15/15 tests passed, exit code 0).

---

### Issue 3: Personal Learning Model Recommendation Formula Discrepancy
- **Original Defect:** `LEARNER_PROFILE_AND_PERSONAL_MODEL_SPEC.md` specified $P(C) = \text{clamp}(40E + 30R + 20Q + 10S)$, while Task v5 reports, validation scripts, and integration maps contained an older incompatible formula ($100 \times [0.35W + 0.30U + 0.20D + 0.15R] \times [1-M] + B$). Additionally, the model was improperly labeled "Bayesian" without actual update equations.
- **Correction Made:**
  - Selected the 40/30/20/10 formula as the single authoritative model:
    $$P(C) = \text{clamp}(40 \cdot E(C) + 30 \cdot R(C) + 20 \cdot Q(C) + 10 \cdot S(C), \, 0, \, 100)$$
  - Fully defined all four factors ($E, R, Q, S \in [0.0, 1.0]$), their data sources, normalizations, and tie-breaking rules.
  - Verified worked arithmetic: Cold-Start ($P = 8.00$), Urgent Exam + Misconception ($P = 83.71$).
  - Purged all occurrences of the obsolete $0.35W$ formula across all files.
  - Removed "Bayesian" label; accurately described the evidence model as a **Multi-Factor Rule-Based Evidence Heuristic**.
- **Files & Sections Changed:** `LEARNER_PROFILE_AND_PERSONAL_MODEL_SPEC.md` (Sections 4.2 and 4.3), `INTEGRATION_AND_DATA_MODEL_MAP.md` (Subsystem 07), `TASK_V6_STATIC_VALIDATION.py`.
- **Remaining Limitation:** The formula is a deterministic psychometric heuristic; empirical calibration against large-scale student response data remains for post-launch research.
- **Evidence:** Verified via `TASK_V6_STATIC_VALIDATION.py` (Section 3).

---

### Issue 4: Conflicting Preparation Planner Phase Taxonomies & Scope Invariants
- **Original Defect:** Documents used conflicting phase names (e.g. "Diagnostic & Concept Exploration" vs "Foundational Diagnosis & Core Concepts"). Previous algorithms silently pruned topics under time deficits.
- **Correction Made:**
  - Established one canonical 4-phase taxonomy across all specifications, diagrams, and tests:
    - **Phase 1: Diagnostic & Concept Exploration (30%)**
    - **Phase 2: Worked Examples & Guided Practice (30%)**
    - **Phase 3: Retrieval Practice & Misconception Remediation (25%)**
    - **Phase 4: Spaced Recall & Synthesis Simulation (15%)**
  - Reaffirmed the non-negotiable scope protection invariant: **100% of student-declared syllabus topics are preserved**. Under time deficit, the algorithm applies proportional compression (`condensed_review` mode), leaving pruning decisions solely in the student's control.
  - Eliminated arbitrary study assumptions (daylight optics, transit audio); mandated scheduling strictly within student-declared study windows.
- **Files & Sections Changed:** `ASSESSMENT_SCOPE_AND_PREP_PLANNER_SPEC.md` (Sections 2.2 and 4.1), `PREP_PLAN_ALGORITHM_AND_ACCEPTANCE_TESTS.md` (Sections 2.1 and 4.0), `INTEGRATION_AND_DATA_MODEL_MAP.md`.
- **Remaining Limitation:** The scheduler logic is verified via specification smoke tests; full calendar UI integration is reserved for development.
- **Evidence:** Verified via `TASK_V6_STATIC_VALIDATION.py` (Section 4; 5/5 topics retained under 50% deficit).

---

### Issue 5: Privacy Architecture, Shared-Device Security & Deletion Realities
- **Original Defect:** Specifications made false claims of "Zero-PII", promised instantaneous RAM zeroing upon session close, and suggested a 4-digit PIN cryptographically encrypted local storage.
- **Correction Made:**
  - Replaced "Zero-PII" with **Data Minimization by Default**, acknowledging that student timetables, subject lists, and assessment marks constitute linkable personal data.
  - Documented optional guardian recovery contact details (phone/email) with strict purpose, access, retention, and deletion rules.
  - Clarified that a 4-digit PIN is a **convenience UX barrier** on shared devices, not strong encryption.
  - Explained that `localStorage.clear()` does NOT delete IndexedDB databases (`indexedDB.deleteDatabase()`).
  - Acknowledged the realities of JavaScript garbage collection: physical RAM zeroing cannot be immediately guaranteed.
  - Distinguished client-side encryption from cloud KMS and zero-knowledge encryption.
  - Stated that client-side regex PII scrubbing for external AI is a heuristic filter, not complete mathematical anonymization. Mandated enterprise Zero-Data-Retention (ZDR) and DPA terms as vendor review requirements.
- **Files & Sections Changed:** `CHILD_DATA_PRIVACY_AND_SECURITY_SPEC.md` (Sections 1.2, 3.1, 3.2, 3.3), `LEARNER_PROFILE_AND_PERSONAL_MODEL_SPEC.md` (Section 2.2), `SCHOOL_HUB_AND_TIMETABLE_SPEC.md` (Section 2.1).
- **Remaining Limitation:** Hardware Keystore integration depends on Android Chrome web capabilities.
- **Evidence:** Verified via `TASK_V6_STATIC_VALIDATION.py` (Section 5).

---

### Issue 6: DPDP Act 2023 Statutory Framing & Commencement Timeline
- **Original Defect:** Documents failed to distinguish commenced statutory provisions from scheduled future obligations, presenting platform features as certified legal compliance.
- **Correction Made:**
  - Explicitly differentiated commenced vs scheduled provisions under official Gazette notification **G.S.R. 843(E)**:
    - Section 2(f) (child legal definition: under 18 years) commenced on **13 November 2025**.
    - Section 9 (operational parental consent and tracking bans), along with Sections 3-17 and DPDP Rules 2025, are scheduled for commencement 18 months later on **13 May 2027**.
  - Framed child-safety features as **voluntary architectural safeguards** adopted in advance of statutory commencement.
  - Added an explicit disclaimer stating this document does not constitute formal legal advice or legal compliance certification.
- **Files & Sections Changed:** `CHILD_DATA_PRIVACY_AND_SECURITY_SPEC.md` (Section 1.1).
- **Remaining Limitation:** Production commercial deployment requires formal legal sign-off by qualified counsel.
- **Evidence:** Verified via `TASK_V6_STATIC_VALIDATION.py` (Section 5).

---

### Issue 7: NCF-SE 2023 Terminology, Sources & Design Bands
- **Original Defect:** Specifications confused NCF-SE 2023 Box 3.3v *Panchpadi* (*Aditi*) with NCF-FS 2022 Box 4.2A *Panchaadi*, mislabeled UI bands as official NCF stages, and made fixed age assumptions.
- **Correction Made:**
  - Cited **NCF-SE 2023 Box 3.3v** using the exact spelling **Panchpadi** and step 1 **Aditi** (*Aditi, Bodh, Abhyas, Prayog, Prasar*).
  - Explicitly differentiated it from NCF-FS 2022 Box 4.2A *Panchaadi*.
  - Described the 4 UI tiers as internal **product design bands**, noting that Classes 9–12 are unified under the Secondary Stage in NCF-SE 2023.
  - Removed fixed age assumptions based solely on class.
- **Files & Sections Changed:** `AGE_ADAPTIVE_DESIGN_SYSTEM.md` (Sections 1.0 and 5.0).
- **Remaining Limitation:** Lesson content creation adhering to Panchpadi is ongoing.
- **Evidence:** Verified via `TASK_V6_STATIC_VALIDATION.py` (Section 5).

---

### Issue 8: Catalog Data Integrity & Structural Alignment
- **Original Defect:** Previous catalog versions suffered from shifted columns and missing fields.
- **Correction Made:**
  - Audited all 29 data rows across 14 columns.
  - Verified 100% unique WorldIDs, Class 5 Preparatory stage alignment, clean authority separation (CBSE, CISCE, KSEAB), and zero empty fields.
- **Files & Sections Changed:** `QUESTION_WORLD_SAMPLE_CATALOG.csv`.
- **Remaining Limitation:** Sample catalog currently covers 29 indicative worlds; comprehensive K–12 bank requires content pipeline expansion.
- **Evidence:** Verified via `TASK_V6_STATIC_VALIDATION.py` (Section 1).

---

### Issue 9: Implementation Audit Precision & Historical Code Preservation
- **Original Defect:** Reports previously mischaracterized the `app/` directory as empty or claimed all four subjects were equally implemented.
- **Correction Made:**
  - Accurately grounded the implementation audit in `app/TASK_REGISTRY.md`:
    - **Physics:** Flagship implemented module (`app/modules/physics.js` with Web Audio oscillator and oscilloscope).
    - **Math, Biology & Chemistry:** Prototype exploration stubs (`math_stub.js`, `biology_stub.js`, `chemistry_stub.js`).
    - **Application Shell:** Preserved Phase 1 runtime code (`app/index.html`, `store.js`, `router.js`, `learning_runner.js`, `i18n.js`, `sw.js`).
  - Labeled all ten new capabilities as **Specified / Pre-Event Proposals (Not Implemented in App Runtime)**.
  - Replaced all machine-specific `file:///C:/...` links with repository-relative paths (`./...`).
- **Files & Sections Changed:** `ZIP_IMPLEMENTATION_GAP_AUDIT.md`, `INTEGRATION_AND_DATA_MODEL_MAP.md`.
- **Remaining Limitation:** Phase 2 full implementation of Math, Biology, and Chemistry modules remains scheduled for the hackathon.
- **Evidence:** Verified against `app/TASK_REGISTRY.md` and passing runtime tests.

---

## 4. Final Architectural Quality Disposition

In accordance with Section 15 of the Task v6 Directive, the evaluation of the baseline, specifications, and test evidence yields the following official disposition:

### **CONDITIONALLY READY — MINOR DOCUMENTATION ISSUES REMAIN**

#### Basis for Disposition:
1. **P0 Engineering & Security Items Completed:** All P0 specifications (CSP hardening, opaque sandbox isolation contract, canonical AST schema, authoritative 40/30/20/10 recommendation formula, canonical 4-phase preparation taxonomy, DPDP Act 2023 commencement framing, and data minimization) are fully reconciled, internally consistent, and backed by automated validators.
2. **Automated Test Evidence Verified:** All 15 AST schema/evaluator fixture tests passed with exit code 0; all 7 static validation checks passed with exit code 0; all 41 portable Node.js automated unit and contract tests executed and passed (41 passed, 0 failed).
3. **Specific Blocker Requiring Conditional Status:** The exact Task v5 source archive `STEM(3)(1)(3).zip` is not physically present in the workspace. In strict obedience to Section 1 and Section 8, original hashes were marked `NOT_VERIFIABLE_ARCHIVE_UNAVAILABLE` rather than fabricated. Therefore, the specification package cannot receive an unconditional "READY FOR ARCHITECTURE REVIEW" until `STEM(3)(1)(3).zip` is placed in the workspace and its member bytes are verified against the manifest.

