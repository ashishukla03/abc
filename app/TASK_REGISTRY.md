# GRAMIN POCKETLAB — TASK REGISTRY & FILE OWNERSHIP DIRECTORY

**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Lead Architect:** Agent 0 (Integration Lead)  
**Date:** November 9, 2026  
**Status:** Phase 1 Implementation Active  

---

## 1. File Ownership Directory

Every file in the `app/` implementation has a single strictly designated owner. No agent may modify files outside their designated assignment without explicit Lead Architect approval.

| File Path | Designated Owner | Core Responsibilities |
| :--- | :--- | :--- |
| `app/index.html` | Agent 1 (Foundation) & Agent 4 (UI/UX) | Main PWA HTML5 shell, semantic mount point, skip-links, navigation headers. |
| `app/css/tokens.css` | Agent 4 (UI/UX & A11y) | CSS custom properties, color palette (AAA/AA), typography, spacing grid. |
| `app/css/main.css` | Agent 4 (UI/UX & A11y) | Base styles, responsive layouts, components, button states, focus rings, reduced motion. |
| `app/js/store.js` | Agent 1 (Foundation) | Central reactive state store, `localStorage` synchronization, event pub/sub. |
| `app/js/router.js` | Agent 1 (Foundation) | Client-side routing, screen transitions (S0 through S6), navigation guards. |
| `app/js/app.js` | Agent 1 (Foundation) | Main application bootstrap, service worker registration, global error boundary. |
| `app/content/i18n.js` | Agent 3 (Learning Engine) | English primary dictionary + verified/draft translations, localization lookup helper. |
| `app/content/missions_data.js` | Agent 3 (Learning Engine) | Canonical mission definitions, questions, answer keys, feedback scripts, badge metadata. |
| `app/engine/learning_runner.js` | Agent 3 (Learning Engine) | 7-step POE cycle controller: S0 -> S1 -> S2 -> S3 -> S4 -> S5 -> S6. |
| `app/modules/physics.js` | Agent 2 (Physics Lead) | Sound Detective: Web Audio oscillator, frequency/amplitude controls, oscilloscope canvas plotting. |
| `app/modules/math_stub.js` | Agent 0 (Lead Architect) | Mathematics module interface definition & exploration placeholder for Phase 2. |
| `app/modules/biology_stub.js` | Agent 0 (Lead Architect) | Biology module interface definition & exploration placeholder for Phase 2. |
| `app/modules/chemistry_stub.js` | Agent 0 (Lead Architect) | Chemistry module interface definition & exploration placeholder for Phase 2. |
| `app/sw.js` | Agent 1 (Foundation) | Cache-first Service Worker, asset pre-caching, offline fallback handler. |
| `tests/` | Agent 5 (QA Engineer) | Independent automated test runner, DOM/unit tests, acoustic verification. |
| `audit/IMPLEMENTATION_AUDIT_REPORT.md`| Agent 6 (Auditor) | Requirements traceability matrix, scientific verification, compliance verdict. |

---

## 2. Quality Gates Matrix

* **GATE A — Specification Approval:** Verified. Reconciled specs in `specs/`, `learning_flow/`, `modules_deep_dive/`.
* **GATE B — Interface & Contract Approval:** Verified. Defined in `specs/04_shared_module_schema.md` and `architecture_plan/MODULE_INTERFACE_CONTRACT.md`.
* **GATE C — Individual Implementation Verification:** Each specialized agent verifies their own code and confirms contract adherence.
* **GATE D — Independent QA Review:** Agent 5 runs automated test suites and behavioral checks.
* **GATE E — Integration & Regression Testing:** Full end-to-end user journeys (S0 to S6), keyboard accessibility, and offline cache tests executed.
* **GATE F — Final Acceptance Review:** Agent 6 signs off on traceability matrix; Lead Architect packages final build.

