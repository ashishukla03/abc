# UI COMPONENT SPECIFICATIONS & ACCESSIBILITY PATTERNS

**Document ID:** UI-COMPONENT-SPEC-V2  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Role:** Senior Front-End Design Systems Architect  
**Conformance:** WAI-ARIA 1.2, WCAG 2.1 AA, Mobile-First Web Components  

---

## 1. Atomic Component Hierarchy

```
Components
├── Navigation & Shell
│   ├── TopAppBar (Brand, OfflineBadge, StepIndicator, MuteButton)
│   └── BottomActionBar (BackAction, PrimaryAction)
│
├── Content & Formative Cards
│   ├── MissionCard (Subject Tag, Title, One-line summary, Action)
│   ├── StepHeader (Title, Context narrative, Objective callout)
│   ├── QuestionRadioGroup (Aria-radiogroup, RadioCard options)
│   ├── FeedbackBanner (Success, Misconception scaffold, Warning)
│   └── SafetyNoticeBox (Mandatory chemical & acoustic disclaimers)
│
└── Interactive Micro-Lab Widgets
    ├── WaterShareStepperWidget (Math)
    ├── FoodWebSvgGraphWidget (Biology)
    ├── PhScaleIndicatorWidget (Chemistry)
    └── AudioOscilloscopeWidget (Physics)
```

---

## 2. Component Specifications

### 2.1 Component: `TopAppBar`
* **Semantic Tag:** `<header role="banner">`
* **Visual Properties:** Height: $64\text{ px}$, background: `--color-surface`, border-bottom: `1px solid var(--color-border)`.
* **Sub-elements:**
  * App Title: `font-size: 18px`, `font-weight: 700`, text: `"Gramin PocketLab"`.
  * Offline Badge: Inline pill (`display: inline-flex`, padding: `4px 8px`, background: `rgba(24, 121, 78, 0.1)`, text: `#18794E`, icon: `12px SVG circle`).
  * Step Indicator: Text: `"Step X of 6"`, `font-size: 14px`, `color: var(--color-text-secondary)`.
  * Controls: Audio mute icon button ($44 \times 44\text{ px}$), Reset button ($44 \times 44\text{ px}$).

### 2.2 Component: `PrimaryActionButton`
* **Semantic Tag:** `<button type="button">`
* **Dimensions:** Minimum width: $140\text{ px}$ (desktop), full-width flex (mobile sticky bar). Height: **$48\text{ px}$** (exceeds $44\text{ px}$ touch target).
* **Styles:**
  * Background: `var(--color-primary-action)`. Text: `#FFFFFF`.
  * Font: `16px`, `font-weight: 600`.
  * Border radius: `var(--radius-btn)` ($8\text{ px}$).
  * State:
    * Hover: `background: var(--color-primary-hover)`.
    * Focus-visible: `outline: 3px solid var(--color-focus-ring); outline-offset: 2px;`.
    * Disabled: `background: #D9E0EB; color: #596579; cursor: not-allowed; opacity: 0.8;`.

### 2.3 Component: `QuestionRadioGroup`
* **Semantic Tag:** `<fieldset role="radiogroup" aria-labelledby="legend-id">`
* **Child Tag:** `<label class="radio-card">` wrapping `<input type="radio">`.
* **Dimensions:** Min-height: $48\text{ px}$, padding: $12\text{ px} \times 16\text{ px}$, margin-bottom: $12\text{ px}$.
* **Accessibility:**
  * Radio input styled with custom CSS indicator while retaining native keyboard arrow key focus traversal.
  * Focus ring visible around active card on tab/arrow navigation.

### 2.4 Component: `WaterShareStepperWidget` (Mathematics)
* **Structure:**
  * 3 rows (one per Plot: A, B, C).
  * Each row contains:
    * Plot Label: `Plot A (Ratio: 1)` / `Plot B (Ratio: 2)` / `Plot C (Ratio: 3)`.
    * Stepper Controls:
      * Decrement Button: `[ - ]` (Size: $48 \times 48\text{ px}$, `aria-label="Decrease Plot A water"`).
      * Numeric Display: `<span role="status" aria-live="polite">` (Font: $20\text{ px}$ bold).
      * Increment Button: `[ + ]` (Size: $48 \times 48\text{ px}$, `aria-label="Increase Plot A water"`).
  * Invariant Bar: Horizontal progress bar representing 12 units. Red hash if $>12$; gray empty if $<12$.

### 2.5 Component: `FoodWebSvgGraphWidget` (Biology)
* **Structure:**
  * SVG canvas (`viewBox="0 0 600 400"`, `width="100%"`).
  * Nodes: `<g class="organism-node" role="button" tabindex="0">` containing `<circle>` and `<text>`.
  * Connectors: `<path marker-end="url(#arrowhead)">` explicitly oriented from food to consumer.
  * Accessibility Complement: Semantic table `<table class="sr-only-or-collapsible">` detailing connections for screen readers.

### 2.6 Component: `PhScaleIndicatorWidget` (Chemistry)
* **Structure:**
  * 4 Beaker Buttons: Horizontally scrollable or grid container.
  * Indicator Strip: CSS animated container showing dipped state and background-color shift.
  * pH Number Line: `<div class="ph-scale-track">` marked $0$ through $14$. Sliding indicator pointer positioned via `left: calc((pH / 14) * 100%)`.
  * Text Badge: `<div class="ph-status-badge">` showing `pH Value` + `Category` (Acidic / Neutral / Basic).

### 2.7 Component: `AudioOscilloscopeWidget` (Physics)
* **Structure:**
  * Canvas: `<canvas id="oscilloscope" width="600" height="240" role="img" aria-label="Acoustic waveform display">`.
  * Axis Markings: Labeled X-axis (`Time: 0 to 10 ms`) and Y-axis (`Amplitude: -1.0 to +1.0`).
  * Preset Controls: Buttons for `[ 220 Hz ]` and `[ 440 Hz ]` ($48\text{ px}$ height).
  * Range Sliders: `<input type="range">` with touch-friendly thumb ($24 \times 24\text{ px}$) and minimum track height ($8\text{ px}$).

---

## 3. Accessibility & State Error Handling Patterns

| State | Visual Treatment | Accessibility Announcement (`aria-live`) | Keyboard / Focus Contract |
| :--- | :--- | :--- | :--- |
| **Sum Mismatch (Math)** | Amber outline on container; status text: `"Allocated 10/12 units"`. | `aria-live="polite"` announces: `"Current allocation is 10 units. Add 2 more units to match total 12."` | Tab focus stays on steppers; verify button disabled. |
| **Audio Blocked** | Friendly modal toast: `"Sound paused. Tap to enable audio."` | `aria-live="assertive"` announces audio unlock prompt. | Primary action button receives immediate focus. |
| **Mic Denied** | Informational toast banner: `"Microphone optional. Generator active."` | `aria-live="polite"` announces non-blocking status. | Focus remains on frequency controls; no modal blocking. |
| **Reduced Motion** | Disables continuous sine wave canvas clearing loop. | N/A (Static pre-drawn wave rendered). | Standard keyboard traversal unchanged. |
