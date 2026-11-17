# GRAMIN POCKETLAB — TASK REGISTRY & FILE OWNERSHIP DIRECTORY

**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Lead Architect:** Principal Engineer & Orchestrator  
**Date:** November 2026  
**Status:** Task v8 Build Sprint 1 Active (Four-Subject MVP Hardening)  

---

## 1. File Ownership Directory

Every file in the `app/` implementation has a single strictly designated owner. No agent may modify files outside their designated assignment without explicit Lead Architect approval.

| File Path | Designated Owner | Core Responsibilities |
| :--- | :--- | :--- |
| `app/index.html` | Frontend Foundation & UI/UX | Main PWA HTML5 shell, semantic mount point, skip-links, navigation headers. |
| `app/css/tokens.css` | Creative Director / UI & A11y | CSS custom properties, color palette (AAA/AA), typography, spacing grid. |
| `app/css/main.css` | Creative Director / UI & A11y | Base styles, responsive layouts, components, button states, focus rings, reduced motion. |
| `app/js/store.js` | Frontend Foundation | Central reactive state store, `localStorage` synchronization, event pub/sub. |
| `app/js/router.js` | Frontend Foundation | Client-side routing, screen transitions (S0 through S6), navigation guards. |
| `app/js/app.js` | Frontend Foundation | Main application bootstrap, service worker registration, truthful offline/online telemetry. |
| `app/content/i18n.js` | Learning Experience Engine | English primary dictionary + verified/draft translations, localization lookup helper. |
| `app/content/missions_data.js` | Learning Experience Engine | Canonical mission definitions, questions, answer keys, feedback scripts, badge metadata. |
| `app/engine/learning_runner.js` | Learning Experience Engine | 7-step POE cycle controller: S0 -> S1 -> S2 -> S3 -> S4 -> S5 -> S6; fail-closed module error handling. |
| `app/modules/physics.js` | Physics Module Lead | Sound Detective: Web Audio oscillator, frequency/amplitude controls, oscilloscope canvas plotting. |
| `app/modules/math_stub.js` | Mathematics Module Lead | Water Share Challenge: 12 units in 1:2:3 ratio (2, 4, 6), sum invariant, non-negative inputs. |
| `app/modules/biology_stub.js` | Biology Module Lead | Food Web Explorer: Directional energy flow (&rarr;), 3 ecological disturbance scenarios, qualitative tendencies. |
| `app/modules/chemistry_stub.js` | Chemistry Module Lead | pH Color Lab: 4 beakers, Turmeric & Universal indicators, strict interaction gating, permanent safety boundary. |
| `app/sw.js` | Frontend Foundation | Cache-first Service Worker, asset pre-caching (16 assets), offline fallback handler. |
| `tests/` | Independent QA Verifier | Independent automated test runners, unit/contract suites, browser CDP verification. |
| `audit/` | Independent Auditor | Requirements traceability matrix, scientific verification, compliance verdict. |

---

## 2. Quality Gates Matrix (Task v8 Build Sprint 1)

* **GATE A — Specification Approval:** Verified. Reconciled specs in `specs/`, `NEXT_STAGE_MILESTONE_ROADMAP.md`.
* **GATE B — Interaction Gating:** Chemistry interaction gating separated from initial mount; fail-closed module error path in `learning_runner.js`.
* **GATE C — Scientific Invariants:** Math (2, 4, 6 ratio & sum 12), Biology (directional arrows & qualitative tendencies), Chemistry (pH 7 != potability), Physics (220/440 Hz, 2.2/4.4 cycles, software gain headroom vs physical hearing distinction).
* **GATE D — Automated Test Integrity:** Baseline Node suites (41 tests) pass without regression; new module and error-path suites pass with exit code 0.
* **GATE E — Truthful Offline Telemetry:** Distinct status states (Offline Cached vs Uncached vs Online Caching vs Offline Ready) tied to actual Service Worker controller state.
* **GATE F — Final Release Packaging:** `STEM_TASK_V8.zip` generated with verified SHA-256 manifest.
