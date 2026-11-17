# Gramin PocketLab Visual Quality Gate & Responsive Audit Standard

**Product:** Gramin PocketLab (Classes 5–12 All-Subject Learning Ecosystem)  
**Author:** Principal Product Architect & Independent Quality Auditor  
**Date:** November 2026  
**Status:** COMPLETE / GOVERNANCE APPROVED  

---

## 1. Overview & Quality Mandate

To ensure that every Indian student experiences an intuitive, accessible, and glitch-free interface regardless of hardware limitations, Gramin PocketLab establishes an uncompromising **Visual Quality Gate**. 

Before any user interface component, QuestionWorld, or screen template is merged into the mainline application codebase, it must pass 100% of the automated and manual verification gates defined in this document.

---

## 2. Multi-Viewport Responsive Matrix

All application layouts must be verified across five target viewports representing the actual hardware landscape of Indian learners:

| Viewport Profile | Resolution | Form Factor & Typical Device | Layout Archetype | Maximum CLS | Minimum Touch Target |
|---|---|---|---|---|---|
| **VP-1: Compact Mobile** | **360 × 640** | JioPhone Next, Redmi 9A, Realme C-series | Single vertical column, bottom navigation bar | $< 0.05$ | $48 \times 48\text{px}$ ($56\text{px}$ Cl. 5) |
| **VP-2: Modern Mobile** | **390 × 844** | Samsung Galaxy M-series, Vivo, OnePlus Nord | Tall 20:9 viewport, floating action controls | $< 0.05$ | $48 \times 48\text{px}$ ($56\text{px}$ Cl. 5) |
| **VP-3: School Tablet Portrait** | **768 × 1024** | Government school tablet distributions (e.g. Lenovo/Acer) | 2-column card layout, persistent sidebar | $< 0.02$ | $48 \times 48\text{px}$ |
| **VP-4: Netbook / Tablet Landscape**| **1024 × 768** | School computer labs, low-cost Chromebooks/Laptops | Split-view: 60% simulation, 40% interaction | $< 0.02$ | $48 \times 48\text{px}$ |
| **VP-5: Smartboard / Desktop** | **1440 × 900** | Classroom digital smartboards & teacher PCs | Full dashboard, multi-panel workspace | $< 0.01$ | $44 \times 44\text{px}$ |

---

## 3. Seven Objective Quality Checklists

### 3.1. Typography & Indic Language Expansion Checklist
* [ ] **Zero Text Clipping:** Containers must use dynamic sizing (`min-height` instead of fixed `height`). Translations into Hindi, Tamil, Telugu, and Bengali expand text by 20%–35%; all translated text must render completely without truncation.
* [ ] **Ligature & Diacritic Integrity:** Full vertical line-height ($\ge 1.4\times$ font size) must be maintained to prevent clipping of vowel signs (matras) and conjunct consonants.
* [ ] **Font Fallback Grace:** If custom fonts fail to load offline, the system font stack must render without reflow or flash of unstyled text (FOUT).

### 3.2. Color Contrast & Outdoor Sunlight Readability Checklist
* [ ] **WCAG 2.2 Level AA Standard:**
  * Normal text ($< 18\text{pt}$ / $24\text{px}$): Contrast ratio $\ge 4.5:1$ against background.
  * Large text ($\ge 18\text{pt}$ or bold $\ge 14\text{pt}$): Contrast ratio $\ge 3.0:1$.
  * User interface components and graphical boundaries: Contrast ratio $\ge 3.0:1$.
* [ ] **High-Ambient-Light Outdoor Mode:** Under direct sunlight conditions common in rural schools, text contrast must exceed $7.0:1$ in High-Contrast Light Mode.
* [ ] **Color Independence:** Information is never conveyed by color alone. Every status color (success green, error red, warning amber) must be accompanied by an unambiguous text label or distinct icon shape.

### 3.3. Touch Targets & Ergonomic Thumb Zones
* [ ] **Physical Target Dimensions:**
  * Class 5 interfaces: Minimum touch bounding box of $56 \times 56\text{px}$.
  * Classes 6–12 interfaces: Minimum touch bounding box of $48 \times 48\text{px}$.
* [ ] **Target Separation:** A minimum gap of $\ge 8\text{px}$ must exist between adjacent tappable elements to prevent accidental miss-touches.
* [ ] **Thumb Zone Reachability:** Primary action buttons (e.g., "Submit Answer", "Check", "Next Step") must be located in the bottom 40% of the mobile screen.

### 3.4. Keyboard Navigation & Assistive Technology Focus
* [ ] **Unambiguous Focus Indicator:** Every interactive control must display a high-visibility focus ring ($3\text{px}$ solid `#2563EB` with $2\text{px}$ white offset) visible in both light and dark themes.
* [ ] **Focus Order:** Logical DOM tab sequence matching visual layout; no keyboard traps.
* [ ] **Assistive Screen-Reader Telemetry:**
  * Sliders must expose `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, and `aria-valuetext`.
  * Dynamic status changes (e.g., sound playing, pH indicator color shift) must announce via an `aria-live="polite"` region.

### 3.5. Motion & Vestibular Safety Checklist
* [ ] **Prefers-Reduced-Motion:** When system setting is active, all animations and transitions must collapse to $\le 0.01\text{ms}$. Elements must snap instantly to their final state.
* [ ] **Zero Harmful Strobing:** Absolutely no visual flashing between 3 Hz and 50 Hz, protecting students with photosensitive epilepsy.
* [ ] **Hardware Compositor Compliance:** 100% of animations must execute on compositor threads (`transform`, `opacity`). Never animate layout properties (`width`, `height`, `margin`, `padding`).

### 3.6. Layout Stability & Cumulative Layout Shift (CLS)
* [ ] **CLS Threshold:** Cumulative Layout Shift must remain $< 0.05$ across all responsive breakpoints during initial page load and user interaction.
* [ ] **Explicit Dimensions:** All images, icons, and SVG canvas wells must declare explicit width/height or aspect-ratio attributes to prevent layout shifts.

### 3.7. Offline State & Disconnected Resilience Checklist
* [ ] **Immediate Offline Confirmation:** When disconnected, an unobtrusive persistent offline indicator ("Offline Mode — All Content Available") must display.
* [ ] **Zero Broken Media:** Missing remote images or broken network placeholders are strictly forbidden. All core icons, apparatus graphics, and audio assets must reside in the local cache or service worker cache.

---

## 4. Automated Visual Regression Protocol

```
+-----------------------------------------------------------------------------------+
|                  AUTOMATED VISUAL REGRESSION PIPELINE (CI/CD)                    |
+-----------------------------------------------------------------------------------+
|  1. Spin up Headless Chromium via Playwright (Pixel 5 & 1024x768 viewports)       |
|  2. Load test URL with simulated offline Service Worker cache                     |
|  3. Trigger automated interaction sequence (Open QuestionWorld, submit answer)    |
|  4. Capture full-page screenshot into tests/visual/screenshots/                   |
|  5. Compare against golden baseline using pixelmatch (Threshold: 0.1% diff)       |
|  6. IF diff > 0.1% -> FAIL build, generate side-by-side visual diff artifact     |
|  7. IF diff <= 0.1% -> PASS visual regression gate                                |
+-----------------------------------------------------------------------------------+
```

### Escalation & Remediation Workflow:
* Any visual regression failure triggers an immediate blocker in the release pipeline.
* A human Creative Director or Design Systems Engineer must review the diff artifact.
* If the change is an intentional design enhancement, golden baselines must be regenerated with an accompanying git commit explaining the visual revision.

