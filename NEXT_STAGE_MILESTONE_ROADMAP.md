# Gramin PocketLab: Next-Stage Milestone Roadmap

**Product:** Gramin PocketLab (Classes 5–12 All-Subject Learning Ecosystem)  
**Author:** Principal Product Architect & Lead Orchestrator  
**Date:** November 2026  
**Status:** COMPLETE / GOVERNANCE APPROVED  

---

## 1. Executive Roadmap Overview

This roadmap defines the post-Task v7 implementation sequence for Gramin PocketLab. Having established reconciled specifications, vetted tooling, an age-adaptive design system, and a governed multi-agent swarm framework, the project transitions into coordinated multi-stage implementation.

Every milestone is gated: entry requires verified outputs from prior stages, and exit requires 100% sign-off from the Independent QA Verifier.

---

## 2. Sequenced Milestones (M1 through M8)

```
+---------------------------------------------------------------------------------------------------+
|  M1: Design System & Visual Foundation Sign-off                                                   |
|  M2: Multi-Agent Swarm Worktree Provisioning & Automation Tooling                                 |
|  M3: Core Application Shell & State Engine Hardening                                              |
|  M4: QuestionWorlds Expansion Phase 1 (Physics, Chemistry, Biology, Math)                         |
|  M5: School & Study Hub Phase 1 (Timetable, Prep-Plan Engine, Exam Countdown)                     |
|  M6: Child Privacy & Local Cryptographic Security Implementation                                 |
|  M7: Multi-Board Curriculum Catalog Ingestion & Pedagogical Mapping                               |
|  M8: End-to-End Visual Regression, Hardware Benchmarking & Release Gate                          |
+---------------------------------------------------------------------------------------------------+
```

---

### Milestone 1: Design System & Visual Foundation Sign-off
* **Lead Roles:** Creative Director (AGT-03), Motion Systems Engineer (AGT-05), A11y Engineer (AGT-10)
* **Objective:** Formalize tokens, typography, and responsive styles across all 4 age bands.
* **Entrance Criteria:** Approved `GRAMIN_POCKETLAB_DESIGN_SYSTEM_V1.md` and `VISUAL_QUALITY_GATE.md`.
* **Deliverables:**
  - `app/styles/tokens.css` (Colors, spacing, typography, radii)
  - `app/styles/motion.css` (CSS transitions, `@keyframes`, reduced-motion rules)
  - Responsive layout shell tested across the 5 required viewports (360px to 1440px).
* **Exit Criteria:** 100% WCAG 2.2 AA contrast compliance; zero layout shift ($CLS < 0.05$).

---

### Milestone 2: Multi-Agent Swarm Provisioning & Automated Tooling
* **Lead Roles:** Lead Orchestrator (AGT-01), QA Verifier (AGT-12)
* **Objective:** Provision isolated Git branches, worktrees, pre-commit validation hooks, and ownership enforcement scripts.
* **Entrance Criteria:** Approved `AGENT_FILE_OWNERSHIP_MATRIX.csv` and `AGENT_HANDOFF_AND_DECISION_PROTOCOL.md`.
* **Deliverables:**
  - Automated worktree initialization scripts (`scripts/init_swarm.ps1`, `scripts/init_swarm.sh`)
  - Pre-commit ownership enforcement hook (blocking edits outside owned paths)
  - Shared interface RFIC registry in `architecture_plan/rfic/`.
* **Exit Criteria:** Simulated 12-agent concurrent commit test passes with zero merge collisions.

---

### Milestone 3: Core Application Shell & State Engine Hardening
* **Lead Roles:** Frontend Core Engineer (AGT-04), Learner Profile Engineer (AGT-08)
* **Objective:** Harden offline application shell, client-side routing, and local IndexedDB state persistence.
* **Entrance Criteria:** Milestone 1 tokens and Milestone 2 worktree setup complete.
* **Deliverables:**
  - `app/src/store.js` with reactive pub/sub and local storage adapters
  - `app/src/router.js` with deep-linking and browser history support
  - `app/sw.js` Service Worker with precaching for 100% offline cold boot.
* **Exit Criteria:** Service Worker precaches core assets; offline reload functions without network requests; 12 unit tests pass.

---

### Milestone 4: QuestionWorlds Expansion — Phase 1
* **Lead Roles:** QuestionWorld Engineer (AGT-06), Curriculum Architect (AGT-02), Motion Engineer (AGT-05)
* **Objective:** Implement the four foundational interactive QuestionWorlds in sandboxed iframes.
* **Deliverables:**
  1. **Physics Sound Detective:** 220 Hz vs 440 Hz Web Audio tone generator, 2.2 vs 4.4 wave cycles over 10ms, canvas oscilloscope.
  2. **Chemistry Water Safety:** Four-beaker titration (Litmus, Phenolphthalein, Universal Indicator, Methyl Orange); explicit clarification that pH does not establish microbiological safety.
  3. **Biology Cellular Explorer:** Interactive plant vs. animal cell diagram with tactile organelle focus.
  4. **Mathematics Geometry Playground:** Dynamic Euclidean angle and triangle sum manipulatives.
* **Exit Criteria:** All 4 simulations run at 60 fps on 2 GB RAM mobile profiles; sandboxed `postMessage` contract verified.

---

### Milestone 5: School & Study Hub — Phase 1
* **Lead Roles:** School Hub Engineer (AGT-07), Curriculum Architect (AGT-02)
* **Objective:** Build timetable management, revision schedule generator, and exam countdown HUD.
* **Deliverables:**
  - `app/src/hub/timetable.js` (Offline schedule storage)
  - `app/src/hub/prep_planner.js` (Spaced repetition and revision interleaving algorithm)
  - Exam countdown component supporting CBSE/ICSE/State Board schedules.
* **Exit Criteria:** Prep-plan algorithm passes all 9 unit tests in $< 50\text{ms}$; offline state persists across app restart.

---

### Milestone 6: Child Privacy & Local Cryptographic Security
* **Lead Roles:** Security & Privacy Engineer (AGT-11), Learner Profile Engineer (AGT-08)
* **Objective:** Implement local on-device encryption, parent consent flow, and DPDP Act compliance.
* **Deliverables:**
  - `app/src/crypto/encryption.js` (Web Crypto API AES-GCM-256 for student profiles)
  - Verifiable parent consent gate UI modal
  - CSP configuration blocking external analytics and ad tracking domains.
* **Exit Criteria:** Automated security test confirms student profile is stored encrypted in IndexedDB; zero network leakage detected.

---

### Milestone 7: Multi-Board Curriculum Catalog Ingestion
* **Lead Roles:** Curriculum Architect (AGT-02), Backend Integration Engineer (AGT-09)
* **Objective:** Ingest curriculum data across Classes 5–12 for CBSE, ICSE, and initial State Boards.
* **Deliverables:**
  - Expanded `QUESTION_WORLD_SAMPLE_CATALOG.csv` with 200+ curated curriculum questions
  - Competency tag schemas mapped to Bloom's Revised Taxonomy
  - Offline searchable chapter and subject directory.
* **Exit Criteria:** Catalog passes static schema validation; 100% of questions contain verified answer keys and scientific rationales.

---

### Milestone 8: End-to-End Verification & Release Gate
* **Lead Roles:** Independent QA Verifier (AGT-12), A11y Engineer (AGT-10), Orchestrator (AGT-01)
* **Objective:** Complete multi-viewport visual regression, cold launch profiling, and final ZIP packaging.
* **Deliverables:**
  - Playwright visual regression suite across the 5 viewports (360px, 390px, 768px, 1024px, 1440px)
  - Android device hardware benchmark report (MediaTek Helio A22 / 2 GB RAM profile)
  - Final cryptographically signed release package (`STEM_PRODUCTION_RELEASE_V1.zip`) and SHA-256 manifest.
* **Exit Criteria:** All automated test tiers pass (0 failures); cold launch $< 1.8\text{s}$; heap memory $< 80\text{MB}$; QA Verifier issues Unconditional Pass.

