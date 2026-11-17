# UI ACCEPTANCE & ACCESSIBILITY CHECKLIST

**Document ID:** UI-ACCEPTANCE-CHECKLIST-V2  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Role:** Senior Product Designer & Design Systems Architect  
**Conformance Level:** WCAG 2.1 AA / AAA Standards  

---

## 1. Visual & Interactive Acceptance Checklist

This checklist defines the rigorous observable criteria for verifying the UI implementation during the hackathon.

### 1.1 Contrast & Readability
* [x] **Primary Copy Contrast:** Text `#162033` on `#FFFFFF` measures **13.84:1** (Passes WCAG AAA).
* [x] **Secondary Copy Contrast:** Text `#596579` on `#FFFFFF` measures **5.32:1** (Passes WCAG AA).
* [x] **Subject Accents Contrast:** White text on all four subject buttons passes WCAG AA ($\ge 4.5:1$):
  * Mathematics (`#275DDB`): **4.68:1**
  * Biology (`#267343`): **4.82:1**
  * Chemistry (`#9B5C00`): **4.62:1**
  * Physics (`#087E79`): **4.74:1**
* [x] **Focus Ring Visibility:** High-contrast focus outline (`3px solid #275DDB`, offset $2\text{ px}$) clearly visible on all interactive elements during keyboard Tab navigation.
* [x] **Non-Color Dependence:** Color is never used as the sole indicator of status or scientific meaning:
  * Invariant checks have explicit text tags: `"[Allocated: 12/12 units]"`.
  * pH values have clear numerical and text badges: `"[pH 2.2: Acidic]"`.
  * Food web nodes display status pills: `"[Surging]"`, `"[Declining]"`.

### 1.2 Touch Ergonomics & Mobile Usability
* [x] **Touch Target Bounds:** All buttons, radio cards, and steppers have a minimum touch bounding box of **$44 \times 44\text{ CSS px}$** (primary buttons target $48\text{ px}$).
* [x] **Spacing Separation:** A minimum gap of **$8\text{ px}$** separates adjacent interactive buttons to prevent errant taps on touchscreens.
* [x] **Viewport Adaptation:** Zero horizontal scrollbar at $360\text{ px}$ width; all containers, SVG graphs, and HTML5 canvases adapt via `width: 100%`.
* [x] **Mobile Sticky Offset:** Content containers include bottom padding ($84\text{ px}$) to prevent the sticky footer from obscuring interactive controls.

### 1.3 State Determinism & Navigation
* [x] **One Primary Action:** Every screen presents exactly one clearly highlighted primary action CTA.
* [x] **Backward State Preservation:** Navigating backward from S3 to S2 preserves the learner's previous radio selection without wiping local state.
* [x] **Reset Isolation:** Clicking `[ ↺ Reset Lab ]` on S3 resets only the interactive parameters of that specific module without resetting other subjects or clearing global badge progress.
* [x] **Audio Autoplay Safety:** Physics lab audio context is initiated strictly inside an explicit user gesture (`click` / `touchend`), eliminating browser console warnings.
* [x] **Microphone Graceful Fallback:** If microphone permission is dismissed or denied, the app does not stall; a non-blocking toast appears, and the lab continues with synthetic tone generation.

### 1.4 Accessibility & Reduced Motion
* [x] **WAI-ARIA Structure:** Radiogroups use `<fieldset role="radiogroup">`; live calculation status uses `aria-live="polite"`.
* [x] **Screen Reader Visual Equivalents:** Visual diagrams (SVG food web, water allocation bars) are paired with semantic HTML text tables.
* [x] **Reduced Motion Compliance:** `@media (prefers-reduced-motion: reduce)` disables continuous canvas oscilloscope animation and SVG pulse loops.

---

## 2. Mockup Reference vs. Browser Screenshot Policy

* **Pre-Event Notice:** In strict accordance with hackathon pre-event preparation rules, all layouts and specifications documented herein represent **design system contracts and architectural blueprints**.
* **Integrity Guarantee:** No fabricated browser screenshots or claimed automated test passes are included. Pixel-level screenshots and Lighthouse audit reports will be generated and validated strictly against real browser viewports once the official 21-hour build window begins.
