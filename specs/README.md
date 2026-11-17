# Gramin PocketLab — Master Specification Index

**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Event:** STEM for Impact 2026 (Presidency University, Bengaluru)  
**Status:** Pre-Event Specification Phase (Zero Application Code Authored)  
**Approved Direction:** Four Subjects (Math, Biology, Chemistry, Physics) sharing one unified learning engine and 7-step pedagogical lifecycle.

---

## Specification Documents Directory

1. **[01_product_requirements_prd.md](./01_product_requirements_prd.md)**
   * Target learner personas, rural context boundaries, 7-step pedagogical inquiry lifecycle, complete learner journeys for all four subjects, MVP scope boundaries (inclusions/exclusions), and Definition of Done.

2. **[02_screen_and_interaction_contracts.md](./02_screen_and_interaction_contracts.md)**
   * Viewport and persistent shell contracts, step-by-step state machines (Screens 1 through 8), subject-specific interactive stage contracts, and edge-case contracts (audio autoplay block, mic denial, invalid math allocation, offline transition).

3. **[03_four_subject_content_specifications.md](./03_four_subject_content_specifications.md)**
   * Comprehensive pedagogical content, NCERT curricular mappings, prediction items, interactive bounds, common cognitive misconceptions with targeted feedback scripts, retry questions, transfer exit checks, and explicit scientific boundary notices.

4. **[04_shared_module_schema.md](./04_shared_module_schema.md)**
   * Formal TypeScript interfaces and concrete JSON module schemas defining stable IDs, assessment structures, interactive parameters, and anonymous local profile persistence contracts.

5. **[05_ui_system_and_tokens.md](./05_ui_system_and_tokens.md)**
   * High-contrast visual design tokens (colors, subject identity accents, typography, $48 \times 48\text{ px}$ touch targets), atomic component hierarchy, responsive layouts ($<640\text{ px}$ mobile focus), and accessibility contracts (reduced-motion, screen readers).

6. **[06_architecture_and_offline_engine.md](./06_architecture_and_offline_engine.md)**
   * Client-only zero-server architecture proposal, Web Audio API tone synthesis graph, permission-gated non-blocking microphone progressive enhancement, Cache-First Service Worker specification, and child privacy boundaries (DPDP Act 2023).

7. **[07_engineering_preparation_and_risks.md](./07_engineering_preparation_and_risks.md)**
   * Observable 11-point acceptance test matrix, dependency & licensing risk register (PhET, Phyphox, Mathigon compliance), 5-person team responsibility division, and a conservative 21-hour hackathon execution timeline.

---

## Background Research Reference
* Background empirical research and open-source audits remain documented in [`research_workspace`](../research_workspace).
