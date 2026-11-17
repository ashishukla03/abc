# Gramin PocketLab: Next-Stage Milestone Roadmap

**Product:** Gramin PocketLab (Classes 5–12 All-Subject Learning Ecosystem)  
**Author:** Principal Product Architect & Lead Orchestrator  
**Date:** November 2026 (Reconciled for Task v8 Build Sprint 1)  
**Status:** ACTIVE RECONCILED ROADMAP  

---

## 1. Executive Roadmap Overview & Hackathon Scope Lock

This roadmap defines the implementation sequence for Gramin PocketLab following Antigravity Task v7 and Task v8 Build Sprint 1. 

### Scope Lock & Product Boundary:
* **Long-Term Vision:** Classes 5–12 all-subject, multi-board Indian school learning platform (CBSE, CISCE/ICSE, NCERT, State Boards) featuring interactive QuestionWorlds, My School & Study Hub, personalized Bayesian knowledge tracing, and offline-first peer sync.
* **Hackathon MVP Anchor (Current Build):** A disciplined, high-fidelity four-subject demonstration mapped to Middle Stage (Classes 6–8) NCERT curricula, built on a zero-dependency Vanilla HTML5/CSS/ES-module PWA foundation:
  1. **Mathematics:** Water Share Challenge (Class 6 Ch 12 — 12 irrigation units divided in 1:2:3 ratio $\rightarrow$ 2, 4, 6 units).
  2. **Biology:** Food Web Explorer (Class 7 Ch 10 — Directional energy flow arrows, qualitative trophic cascade tendencies).
  3. **Chemistry:** pH Color Lab (Class 7 Ch 5 — Four illustrative samples tested with Universal and Natural Turmeric papers; permanent water-potability disclaimer that pH 7 does not establish pathogen/chemical drinking safety).
  4. **Physics:** Sound Detective (Class 8 Ch 13 Flagship — 220 Hz vs 440 Hz Web Audio synthesis, 2.2 vs 4.4 cycles in 10 ms window, software gain headroom vs physical hearing protection distinction).
* **Current Implementation State:** Physics is the full flagship vertical slice; Mathematics, Biology, and Chemistry are fully interactive, strictly gated micro-labs for the hackathon MVP.
* **Intentionally Deferred Long-Term Features:** Multi-child profile switching, cloud sync, automated curriculum ingestion, AI companion, and hardware-level acoustic calibration are planned for post-hackathon releases.

---

## 2. Sequenced Milestones (M1 through M8)

```
+---------------------------------------------------------------------------------------------------+
|  M1: Design System & Visual Foundation Sign-off                                                   |
|  M2: Multi-Agent Swarm Worktree Provisioning & Automation Tooling                                 |
|  M3: Core Application Shell & State Engine Hardening                                              |
|  M4: Four-Subject Interactive Hardening (Sound Detective, Water Share, Food Web, pH Color Lab)     |
|  M5: School & Study Hub — Phase 1 (Offline Timetable, 40/30/20/10 Prep-Plan Engine)               |
|  M6: Child Privacy & Local Cryptographic Security Implementation                                 |
|  M7: Multi-Board Curriculum Catalog Ingestion & Pedagogical Mapping                               |
|  M8: End-to-End Visual Regression, Hardware Benchmarking & Release Gate                          |
+---------------------------------------------------------------------------------------------------+
```

---

### Milestone 1: Design System & Visual Foundation Sign-off
* **Lead Roles:** Creative Director (AGT-03), Motion Systems Engineer (AGT-05), A11y Engineer (AGT-10)
* **Objective:** Formalize tokens, typography, and responsive styles across the 4 age bands, focusing immediately on Middle Stage (Classes 6–8) for the hackathon demo.
* **Deliverables:**
  - `app/css/tokens.css` (Colors, spacing, typography, radii, touch targets)
  - `app/css/main.css` (Responsive layouts, component cards, focus rings, reduced motion)
  - Responsive shell verified across 5 target viewports (360px, 390px, 768px, 1024px, 1440px).
* **Exit Criteria:** 100% WCAG 2.2 AA contrast compliance; zero layout shift ($CLS < 0.05$).

---

### Milestone 2: Multi-Agent Swarm Provisioning & Automated Tooling
* **Lead Roles:** Lead Orchestrator (AGT-01), QA Verifier (AGT-12)
* **Objective:** Maintain isolated Git branches, worktrees, pre-commit validation hooks, and ownership enforcement scripts.
* **Deliverables:**
  - Pre-commit ownership enforcement mapping in `AGENT_FILE_OWNERSHIP_MATRIX.csv`
  - Reusable role prompts in `AGENT_ROLE_PROMPTS/`
  - Clean git baseline tracking in `task_v8_pre_change_hashes.csv`.
* **Exit Criteria:** Verified file ownership boundaries; zero cross-agent collisions.

---

### Milestone 3: Core Application Shell & State Engine Hardening
* **Lead Roles:** Frontend Core Engineer (AGT-04), Learner Profile Engineer (AGT-08)
* **Objective:** Harden offline application shell, client-side routing, and local state persistence.
* **Deliverables:**
  - `app/js/store.js` with reactive pub/sub and defensive storage fallback
  - `app/js/router.js` with hash routing and navigation guards (S0 through S6)
  - `app/sw.js` Service Worker with verified precache manifest and truthful offline status badge in `app/js/app.js`.
* **Exit Criteria:** Service Worker precaches all 16 assets; offline reload functions without network requests; 12 unit tests pass.

---

### Milestone 4: Four-Subject Interactive Hardening (Active Hackathon Scope)
* **Lead Roles:** Module Engineers (AGT-06, AGT-02, AGT-05)
* **Objective:** Harden the four accepted STEM interactive journeys in the core app.
* **Deliverables:**
  1. **Physics — Sound Detective (`app/modules/physics.js`):** 220 Hz vs 440 Hz Web Audio tone generator, 2.2 vs 4.4 wave cycles over labelled 10 ms window, user-gesture audio initiation, digital headroom clamped to $\le 0.70$ ($-3\text{ dBFS}$).
  2. **Chemistry — pH Color Lab (`app/modules/chemistry_stub.js`):** Four illustrative samples (Lemon Juice pH 2.2, Distilled Water pH 7.0, Baking Soda pH 8.5, Laundry Soap pH 10.0), Universal Indicator Paper and Natural Turmeric Paper. Explicit safety boundary: pH does not detect pathogens/toxic contaminants; neutral pH 7 does not establish potability. Strict interaction gating (no auto-completion on mount).
  3. **Mathematics — Water Share Challenge (`app/modules/math_stub.js`):** 12 irrigation units distributed across Plot A, B, C in 1:2:3 ratio (correct solution: 2, 4, 6 units). Validates both sum ($= 12$) and ratio ($A \times 2 = B$, $A \times 3 = C$); protects against negative allocations.
  4. **Biology — Food Web Explorer (`app/modules/biology_stub.js`):** Interactive farm food-web graph with directional energy flow arrows (prey $\rightarrow$ consumer), 3 disturbance scenarios (balanced, remove snakes, severe drought) with qualitative trophic cascade tendencies and full accessible table equivalent.
* **Exit Criteria:** All 4 modules correctly gated; fail-closed error recovery in `app/engine/learning_runner.js`; all module test suites pass.

---

### Milestone 5: School & Study Hub — Phase 1 (Post-Hackathon)
* **Lead Roles:** School Hub Engineer (AGT-07), Curriculum Architect (AGT-02)
* **Objective:** Build timetable management, revision schedule generator, and exam countdown HUD.
* **Deliverables:**
  - `app/js/hub/timetable.js` (Offline schedule storage)
  - `app/js/hub/prep_planner.js` (Authoritative 40/30/20/10 Priority formula & 30/30/25/15 canonical phases)
* **Exit Criteria:** Prep-plan algorithm passes all unit tests; offline state persists across app restart.

---

### Milestone 6: Child Privacy & Local Cryptographic Security (Post-Hackathon)
* **Lead Roles:** Security & Privacy Engineer (AGT-11), Learner Profile Engineer (AGT-08)
* **Objective:** Implement local on-device encryption, parent consent flow, and DPDP Act compliance.
* **Deliverables:**
  - `app/js/crypto/encryption.js` (Web Crypto API AES-GCM-256 for student profiles)
  - Verifiable parent consent gate UI modal (in alignment with Section 9 commencement scheduled for 13 May 2027)
  - CSP configuration blocking external analytics and ad tracking domains.
* **Exit Criteria:** Student profile stored encrypted in IndexedDB; zero network telemetry.

---

### Milestone 7: Multi-Board Curriculum Catalog Ingestion (Post-Hackathon)
* **Lead Roles:** Curriculum Architect (AGT-02), Backend Integration Engineer (AGT-09)
* **Objective:** Ingest curriculum data across Classes 5–12 for CBSE, ICSE, and initial State Boards.
* **Deliverables:**
  - Expanded question catalogues with Bloom's Revised Taxonomy tags
  - Offline searchable chapter and subject directory.
* **Exit Criteria:** 100% of questions contain verified answer keys and scientific rationales.

---

### Milestone 8: End-to-End Verification & Release Gate
* **Lead Roles:** Independent QA Verifier (AGT-12), A11y Engineer (AGT-10), Orchestrator (AGT-01)
* **Objective:** Multi-viewport visual regression, cold launch profiling, and final ZIP packaging.
* **Deliverables:**
  - Real browser automated validation across 5 viewports (360px, 390px, 768px, 1024px, 1440px)
  - Android device hardware benchmark report (MediaTek Helio A22 / 2 GB RAM profile)
  - Final signed release package (`STEM_TASK_V8.zip`) and SHA-256 manifest.
* **Exit Criteria:** All automated test tiers pass; cold launch $< 1.8\text{s}$; heap memory $< 80\text{MB}$.

---

## 3. Pending Open Items & Dependencies

The following external dependencies are explicitly kept marked as **PENDING / UNRESOLVED**:
1. **Organizer Rules Clarification:** Single-subject flagship (Physics) vs. 4-subject demonstration format; pitch duration (3 min vs 5 min); exact submission portal requirements.
2. **Kannada Language Human Review:** Native speaker review of draft Kannada strings in `app/content/i18n.js`.
3. **Physical Hardware Benchmarks:** Testing on physical 2 GB RAM Android hardware (Redmi 9A / JioPhone Next) rather than desktop viewport emulation.
4. **Formal Legal & Privacy Review:** Full statutory audit under DPDP Act 2023 rules once G.S.R. 843(E) Section 9 rules take effect.
5. **Educational Field Trials:** In-classroom pedagogical validation with rural students and teachers.
