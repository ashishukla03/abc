# Gramin PocketLab — UI Design System Index

**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Event:** STEM for Impact 2026 (Presidency University, Bengaluru)  
**Role:** Senior Product Designer & Front-End Design Systems Architect  
**Design Standard:** Modern Scientific Field Notebook — Precise, durable, restrained, and accessible.  

---

## Design System Deliverables Directory

1. **[DESIGN_TOKENS.md](./DESIGN_TOKENS.md)**
   * Complete color tokens, system typography scale (zero external font downloads), 8pt spatial grid, corner radii, and minimum $44 \times 44\text{ px}$ touch target dimensions.
   * Full mathematical **WCAG 2.1 Contrast Audit**: primary copy `#162033` on `#FFFFFF` measures **13.84:1** (Passes AAA); all subject accent buttons pass AA ($\ge 4.5:1$).
   * CSS custom properties stylesheet implementation.

2. **[UI_SCREEN_CONTRACTS.md](./UI_SCREEN_CONTRACTS.md)**
   * Rigorous contracts for Screens S0 through S6:
     * **S0 (Mission Map):** One-sentence product description, 4 active cards, 2-column desktop grid / mobile vertical stack.
     * **S1 (Intro):** Context, objective, duration; zero permissions requested.
     * **S2 (Predict):** Low-stakes question, accessible radios, backward state preservation.
     * **S3 (Explore):** Micro-lab interactions for Math (steppers/invariants), Biology (directed SVG web), Chemistry (beaker dips/disclaimer banner), and Physics (synthetic tone generator/oscilloscope).
     * **S4 (Understand):** Direct connection to learner's interaction state.
     * **S5 (Feedback/Retry):** Actionable misconception feedback and changed retry challenge.
     * **S6 (Exit Check):** True score calculation and concept recap (no exaggerated claims).

3. **[COMPONENT_SPEC.md](./COMPONENT_SPEC.md)**
   * Atomic component hierarchy, HTML semantic tags, WAI-ARIA roles, and accessibility patterns for top app bars, primary action buttons, radio groups, and the four subject interactive lab widgets.

4. **[RESPONSIVE_LAYOUT_SPEC.md](./RESPONSIVE_LAYOUT_SPEC.md)**
   * Multi-viewport responsive specifications and stress-testing audit covering 5 key viewports: $360 \times 800$, $390 \times 844$, $768\text{ px}$, $1280 \times 800$, and $1440 \times 900$.
   * Mobile sticky bottom action bar rules and desktop split-stage alignments.

5. **[UI_ACCEPTANCE_CHECKLIST.md](./UI_ACCEPTANCE_CHECKLIST.md)**
   * Observable pass/fail verification checklist covering contrast, mobile touch ergonomics, state determinism, backward navigation, keyboard navigation, and reduced-motion handling.
