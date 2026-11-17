# Gramin PocketLab — QA & Acceptance Test Plan Index

**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Event:** STEM for Impact 2026 (Presidency University, Bengaluru)  
**Role:** Independent QA Engineer & Accessibility Tester  
**Testing Policy:** Real hardware execution. Zero unrun test passes claimed.  

---

## QA & Acceptance Deliverables Directory

1. **[ACCEPTANCE_TEST_MATRIX.csv](./ACCEPTANCE_TEST_MATRIX.csv)**
   * Master testing matrix containing 37 distinct test cases across General Navigation, Mathematics, Biology, Chemistry, Physics, Responsive Design, Accessibility, and Resilience.
   * Every row defines a Test ID, Subject, Precondition, Action, Observable Expected Result, Severity, and an open `ActualResult` column (to be populated during physical execution).

2. **[MANUAL_TEST_RUNBOOK.md](./MANUAL_TEST_RUNBOOK.md)**
   * Step-by-step manual test execution procedures covering:
     * Canonical ratio division ($12 \implies 2, 4, 6$) and boundary checks.
     * Food web trophic cascades and screen-reader accessibility tables.
     * pH color shifts, non-color cues, and mandatory drinking water safety disclaimers.
     * Physics Web Audio tone playback ($220\text{ Hz}$ vs. $440\text{ Hz}$), amplitude decoupling, autoplay unblocking, and microphone denial graceful fallbacks.

3. **[ACCESSIBILITY_AUDIT_CHECKLIST.md](./ACCESSIBILITY_AUDIT_CHECKLIST.md)**
   * W3C WCAG 2.1 AA/AAA compliance audit matrix covering color contrast ($\ge 13.8:1$ body, $\ge 4.5:1$ buttons), non-color dependence, visible keyboard focus rings, $\ge 44\times 44\text{ px}$ touch targets, semantic headings, and reduced-motion handling.
   * Multi-viewport layout verification matrix across 5 reference widths ($360\text{ px}$ to $1440\text{ px}$).

4. **[FAILURE_STATE_MATRIX.md](./FAILURE_STATE_MATRIX.md)**
   * Engineering failure mode analysis detailing deterministic graceful degradations for 10 hardware and environment failure scenarios:
     * First visit offline limitation.
     * Mobile Web Audio autoplay suspension.
     * Microphone permission denial, hardware absence, and ambient noise.
     * LocalStorage quota failure / private browsing in-memory fallback.
     * Accidental browser pull-to-refresh recovery.

5. **[DEMO_SMOKE_TEST.md](./DEMO_SMOKE_TEST.md)**
   * A choreographed 180-second live demonstration script for judging panels.
   * Chronological breakdown showing the Airplane Mode offline indicator, Physics flagship live audio synthesis ($220 \rightarrow 440\text{ Hz}$), Chemistry turmeric reaction, and emergency backup protocols.
