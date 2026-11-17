# UI Design System & Component Hierarchy — Gramin PocketLab

**Document ID:** SPEC-UI-SYSTEM-V2  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Status:** Pre-Event Specification  

---

## 1. Visual Token Specification

Gramin PocketLab utilizes a high-contrast, accessible design token system optimized for outdoors and budget smartphone screens (TN/IPS panels with lower nit brightness).

### 1.1 Color Tokens (Curated Palette & Subject Identity)

```css
:root {
  /* Brand Core */
  --color-primary: #15803d;        /* Lush Crop Green (Pantone 361 C equivalent) */
  --color-primary-hover: #166534;
  --color-primary-light: #dcfce7;
  
  --color-bg-base: #f8fafc;        /* Soft Paper White (Reduces eye strain) */
  --color-bg-surface: #ffffff;     /* Elevated Card Surface */
  --color-bg-subtle: #f1f5f9;
  
  --color-text-main: #0f172a;      /* High-contrast Slate (WCAG AAA on white) */
  --color-text-muted: #475569;
  --color-border: #cbd5e1;
  
  /* Four Subject Accent Tokens */
  --color-math-accent: #0284c7;    /* Water Blue (#0284c7) - Ratios & Hydrology */
  --color-math-light: #e0f2fe;
  
  --color-bio-accent: #16a34a;     /* Canopy Green (#16a34a) - Food Webs */
  --color-bio-light: #dcfce7;
  
  --color-chem-accent: #d97706;    /* Turmeric Amber (#d97706) - pH & Chemistry */
  --color-chem-light: #fef3c7;
  
  --color-phys-accent: #7c3aed;    /* Acoustic Violet (#7c3aed) - Soundwaves */
  --color-phys-light: #ede9fe;
  
  /* Formative Feedback Tokens */
  --color-feedback-success: #15803d;
  --color-feedback-warning: #b45309;
  --color-feedback-error: #b91c1c;
}
```

### 1.2 Typography Tokens
* **Primary System Stack:** `system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", sans-serif`.
* *Rationale:* Uses native system fonts already present on Android, Windows, and iOS. Zero external Google Font network latency or multi-megabyte TTF file downloads.
* **Type Scale:**
  * Header 1 (App Title): `24px` / `1.3` line-height / `font-weight: 700`
  * Header 2 (Subject Title): `20px` / `1.3` line-height / `font-weight: 600`
  * Subheading (Step Prompt): `18px` / `1.4` line-height / `font-weight: 600`
  * Body Text (Instructions & Story): `16px` / `1.5` line-height / `font-weight: 400`
  * Micro-copy (Labels & Disclaimers): `13px` / `1.4` line-height / `font-weight: 500`

### 1.3 Spacing, Radii & Touch Targets
* **Touch Target Invariant:** All interactive tap areas (buttons, radio cards, sliders) must have a minimum dimension of **$48 \times 48\text{ px}$** with at least $8\text{ px}$ padding between adjacent targets.
* **Radii Tokens:**
  * Small: `4px` (input controls, badges)
  * Medium: `8px` (cards, dialog boxes)
  * Large: `16px` (modal sheets, hero banners)
  * Pill: `9999px` (status tags, progress dots)

---

## 2. Component Hierarchy & Atomic Architecture

```
AppContainer
├── TopNavigationHeader
│   ├── BrandLogoWithOfflineStatus
│   ├── SubjectSelectorDropdown
│   ├── StepProgressBar (7 dots)
│   ├── ProfileSwitcherButton (Student 1 / Student 2)
│   └── AudioMuteToggle
│
├── MainLearningStage (Responsive Viewport Container)
│   ├── MissionIntroCard (Step 1)
│   ├── PredictionCard (Step 2)
│   │   ├── ScenarioContextPrompt
│   │   └── RadioSelectionGroup (3 options)
│   │
│   ├── InteractiveLabStage (Step 3)
│   │   ├── MathWaterAllocatorComponent
│   │   ├── BioFoodWebGraphComponent
│   │   ├── ChemPHIndicatorComponent
│   │   └── PhysSoundSynthComponent
│   │
│   ├── ConceptExplanationCard (Step 4)
│   ├── FormativeFeedbackRetryModal (Step 5)
│   ├── ExitTransferCheckCard (Step 6)
│   └── MissionCompleteBadgeCard (Step 7)
│
└── StickyFooterActionBar
    ├── BackStepButton
    ├── StepCounterText ("Step X of 7")
    └── PrimaryActionButton ("Submit Hypothesis", "Check Solution", "Next Step")
```

---

## 3. Responsive Layout Contracts & Breakpoints

* **Mobile Layout ($< 640\text{ px}$ — Target Standard):**
  * Single-column vertical stream.
  * Sticky top header ($56\text{ px}$) and sticky bottom action bar ($64\text{ px}$).
  * Interactive canvas renders at `100%` container width with a fixed aspect ratio of $4:3$ or $16:9$.
  * Controls use large thumb-friendly slider tracks and $+/-$ buttons.
* **Tablet / Desktop Layout ($\ge 640\text{ px}$):**
  * Two-column split layout on Step 3 (Interactive Lab):
    * Left Column ($55\%$): Interactive canvas / physical model.
    * Right Column ($45\%$): Real-time parameter controls, data readouts, and scientific boundary notes.

---

## 4. Accessibility, High-Contrast & Reduced Motion Contracts

1. **Reduced Motion (`prefers-reduced-motion: reduce`):**
   * Disables continuous oscillating sine-wave animations and pulsing SVG circles.
   * Renders static, pre-drawn wave snapshots or simplified state transitions.
2. **Screen Reader Semantic Tree:**
   * Food web graph backed by an invisible or collapsible table (`<table aria-label="Ecosystem Predator Prey Relationships">`).
   * Color shifts in Chemistry are accompanied by explicit text badges: `"[Turmeric Paper: Turns Reddish-Brown, indicating Basic solution]"` rather than relying solely on visual color perception (supporting deuteranopia/protanopia color-blindness).
3. **Keyboard Navigability:**
   * Full focus indicator visible (`outline: 3px solid var(--color-primary); outline-offset: 2px`).
   * Tab key navigates cleanly between sliders, stepper buttons, and next steps; `Space` activates toggles; `Arrow` keys adjust sliders.
