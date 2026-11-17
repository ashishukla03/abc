# ACCESSIBILITY & MULTI-VIEWPORT AUDIT CHECKLIST

**Document ID:** QA-ACCESSIBILITY-AUDIT-V2  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Conformance Standard:** W3C Web Content Accessibility Guidelines (WCAG) 2.1 Level AA & Level AAA  

---

## 1. W3C WCAG 2.1 AA/AAA Audit Matrix

| Audit Dimension | Specific Observable Requirement | Evaluation Method | Standard | Pass / Fail Criteria |
| :--- | :--- | :--- | :---: | :--- |
| **Color Contrast: Text** | Body text (`#162033`) on White (`#FFFFFF`) measures **13.84:1**; Secondary text (`#596579`) measures **5.32:1**. | Chrome DevTools Color Inspector | AAA / AA | Measured ratio must be $\ge 7.0:1$ for AAA (Body) and $\ge 4.5:1$ for AA (Secondary). |
| **Color Contrast: Actions** | White text on all four subject buttons exceeds **4.5:1** (Math: 4.68:1, Bio: 4.82:1, Chem: 4.62:1, Phys: 4.74:1). | Contrast Ratio Algorithm | AA | Measured button text contrast must be $\ge 4.5:1$. |
| **Non-Color Dependence** | Color is never used as the sole conveyor of information (all statuses have text labels). | Greyscale simulation audit | A | Verify that in complete monochrome, all 4 micro-labs remain 100% understandable via text tags. |
| **Keyboard Focus Ring** | Visible focus outline (`3px solid #275DDB`, offset $2\text{ px}$) on every interactive element. | Tab key traversal | AA | Focus rectangle must be visible on all buttons, sliders, and radio cards. |
| **Touch Target Size** | All buttons, steppers, and radio targets have an interactive bounding box $\ge 44 \times 44\text{ CSS px}$. | Element bounding box audit | AA | Computed bounding box must measure $\ge 44\text{ px}$ on both axes. |
| **Touch Target Spacing** | Minimum $8\text{ px}$ spacing between adjacent touch buttons (e.g. stepper $[-]$ and $[+]$). | CSS margin/gap inspection | AA | Computed gap must be $\ge 8\text{ px}$. |
| **Heading Hierarchy** | Exactly one `<h1>` per view; logical progression through `<h2>` and `<h3>`; no skipped heading levels. | DOM heading tree outline | A | Zero missing or skipped heading tags. |
| **Screen Reader Semantics** | Formative questions use `<fieldset role="radiogroup">`; live status updates use `aria-live="polite"`. | VoiceOver / TalkBack inspection | AA | Screen reader announces options and dynamic calculation updates without user interruption. |
| **Reduced Motion** | `@media (prefers-reduced-motion: reduce)` halts continuous oscillating oscilloscope animation. | OS accessibility setting toggle | AAA | Oscilloscope canvas renders static wave snapshot when reduced motion is enabled. |
| **Language Hygiene** | Switching between English and Kannada does not expose raw translation keys (e.g. `math.pred.prompt`). | String inspection in UI | AA | Every visible UI element renders human-readable localized text. |

---

## 2. Multi-Viewport Responsive Matrix

Every screen must be inspected against five reference widths:

```
+---------------------------------------------------------------------------------------------------+
| VIEWPORT              | WIDTH x HEIGHT  | KEY STRUCTURAL ADAPTATIONS TO VERIFY                    |
+---------------------------------------------------------------------------------------------------+
| 1. Ultra-Budget Phone | 360 x 800 px    | - Single vertical stream; zero horizontal overflow.     |
|                       |                 | - Sticky bottom action bar (68px) with 84px content pad.|
|                       |                 | - Sliders and steppers span full width with 48px height.|
|                       |                 |                                                         |
| 2. Standard Mobile    | 390 x 844 px    | - Comfortable card margins (16px inset).                |
|                       |                 | - Oscilloscope canvas maintains 16:9 aspect ratio.      |
|                       |                 |                                                         |
| 3. Tablet / Laptop    | 768 x 1024 px   | - S0 cards switch from 1-column to 2-column grid.       |
|                       |                 | - Top bar accommodates brand, badge, and step stepper.  |
|                       |                 |                                                         |
| 4. Standard Desktop   | 1280 x 800 px   | - S3 micro-lab switches to 2-column split stage:        |
|                       |                 |   Left (55%): Interactive Canvas / SVG graph.           |
|                       |                 |   Right (45%): Steppers, sliders, and safety notices.   |
|                       |                 |                                                         |
| 5. Presentation Display| 1440 x 900 px  | - Maximum container width clamped to 1200px.            |
|                       |                 | - Text line length clamped to max 680px for readability.|
+---------------------------------------------------------------------------------------------------+
```
