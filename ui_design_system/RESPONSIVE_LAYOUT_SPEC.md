# RESPONSIVE LAYOUT SPECIFICATION & VIEWPORT MATRIX

**Document ID:** UI-RESPONSIVE-SPEC-V2  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Role:** Senior Front-End Design Systems Architect  
**Conformance:** Multi-Viewport Stress Testing (360px to 1440px)  

---

## 1. Reference Viewports & Responsive Breakdown

The application is architected to render deterministically across five standard viewport configurations representing the spectrum from low-end rural Android smartphones to high-resolution desktop presentation displays:

| Viewport Category | Exact Dimensions | Target Hardware / User Scenario | Structural Layout Adaptation | Padding / Inset |
| :--- | :--- | :--- | :--- | :---: |
| **Ultra-Budget Mobile** | **$360 \times 800\text{ px}$** | Sub-$100 Android (e.g. Realme C-series, Redmi 9A; 720p scaled). | 100% single column; sticky bottom action bar ($68\text{ px}$); controls stacked. | `$16\text{ px}$` horizontal |
| **Standard Mobile** | **$390 \times 844\text{ px}$** | Modern standard Android / iPhone viewport. | Single column; comfortable card margins; sticky bottom action bar. | `$16\text{ px}$` horizontal |
| **Tablet / Narrow Laptop** | **$768 \times 1024\text{ px}$** | Classroom shared tablet or low-cost Chromebook. | Transition point: S0 cards switch to 2-column grid; bottom bar inlines into content. | `$24\text{ px}$` horizontal |
| **Standard Laptop** | **$1280 \times 800\text{ px}$** | Standard school computer lab monitor / evaluation laptop. | Centered container (max $1200\text{ px}$); S3 lab uses 2-column split (Stage + Controls). | `$32\text{ px}$` horizontal |
| **Desktop Presentation** | **$1440 \times 900\text{ px}$** | Projector / external judging display screen. | Generous white space; centered max-width container; high legibility. | `$32\text{ px}$` horizontal |

---

## 2. Layout Rules Across the Breakpoints

### 2.1 Screen S0: Home & Mission Selection
* **Desktop ($\ge 768\text{ px}$):**
  * Container max-width: $1200\text{ px}$, auto margins.
  * Grid: 2 columns (`grid-template-columns: repeat(2, 1fr)`), row/col gap: $24\text{ px}$.
  * Card internal layout: Icon + Subject badge on top row, Title ($24\text{ px}$), Scope sentence ($16\text{ px}$), Action button aligned at bottom right.
* **Mobile ($< 768\text{ px}$):**
  * Container width: $100\%$, padding: $16\text{ px}$.
  * Stack: Single column (`grid-template-columns: 1fr`), gap: $16\text{ px}$.
  * Card internal layout: Full-width stacked action button (min height $48\text{ px}$).

---

### 2.2 Screen S3: Interactive Micro-Lab Layout
* **Desktop Split Stage ($\ge 768\text{ px}$):**
  * Two-column split grid (`display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 32px;`).
  * Left Column: Interactive visual simulation stage (Oscilloscope Canvas / SVG Food Web / Beakers & pH scale / Water tank bars).
  * Right Column: Control panel (Sliders, Stepper buttons, Invariant status badges, Scientific safety notice banner, `[ Check / Advance ]` CTA).
* **Mobile Vertical Stream ($< 768\text{ px}$):**
  * Top Container: Visual simulation stage (fixed aspect ratio $16:9$ or $4:3$, width: $100\%$).
  * Bottom Scrollable Container: Control inputs with touch targets $\ge 48 \times 48\text{ px}$.
  * Sticky Footer Bar: Contains single primary advance button (`height: 48px; width: 100%;`).

---

## 3. Viewport Stress-Testing Audit Checklist

### Audit at $360 \times 800\text{ px}$ (Ultra-Budget Mobile)
* [x] **No Horizontal Scroll:** `body { overflow-x: hidden; }` enforced; canvas scales via `width: 100%; max-width: 100%;`.
* [x] **Text Wrapping:** Heading `--text-h1` adjusts to $28\text{ px}$ with line-height $34\text{ px}$; wraps cleanly over max 2 lines.
* [x] **Math Stepper Touch Ergonomics:** Decrement/Increment buttons ($48 \times 48\text{ px}$) have $8\text{ px}$ separation; preventing accidental double-taps.
* [x] **Physics Canvas Legibility:** Oscilloscope canvas scales to $328\text{ px}$ width; axis labels render at $12\text{ px}$ bold; legible on 720p screens.
* [x] **Sticky Action Bar Offset:** Main content container has `padding-bottom: 84px` ensuring bottom content is not obscured by the sticky footer.

### Audit at $768\text{ px}$ (Tablet)
* [x] **Card Grid Balance:** S0 cards render comfortably at $\sim 340\text{ px}$ column width.
* [x] **Inline Navigation:** Top bar accommodates brand, subject badge, step counter, and reset button without text truncation.

### Audit at $1280\text{ px}$ & $1440\text{ px}$ (Desktop / Projector)
* [x] **Line Length Constraint:** Body reading passages are clamped to max-width $680\text{ px}$ (`ch` unit clamping) to preserve readability (avoiding excessively long lines of text).
* [x] **Split Viewport Alignment:** Canvas stage and control panels align to equal height with comfortable vertical breathing room.
