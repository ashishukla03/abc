# Gramin PocketLab Design System v1.0
## Cross-Age Inclusive UI/UX, Subject Theming & QuestionWorld Motion Standard

**Product:** Gramin PocketLab (Classes 5–12 All-Subject Offline-First Ecosystem)  
**Author:** Principal Product Architect & Creative UI Director  
**Date:** November 2026  
**Status:** COMPLETE / GOVERNANCE APPROVED  

---

## 1. Design Vision & Guiding Principles

Gramin PocketLab bridges educational disparities across India by delivering a world-class, responsive, and tactile learning interface that functions flawlessly on entry-level Android hardware without network connectivity. 

### Core Tenets:
1. **Hardware Equity:** High visual fidelity with zero runtime weight. Animations must run at 60 fps on 2 GB RAM Android Go devices through compositor-driven CSS properties (`transform`, `opacity`).
2. **Pedagogical Progression:** The visual language scales developmentally across four age bands—from concrete, playful tactile models in Class 5 to dense, analytical scientific workspaces in Classes 11–12.
3. **Indic Linguistic Integrity:** Typography and layout natively accommodate Indian multilingual requirements, script ascenders/descenders, and complex ligatures without clipping.
4. **Cognitive Clarity:** High-contrast color hierarchy ($\ge 4.5:1$), unambiguous affordances, and zero sensory overload.

---

## 2. Four Internal Product Design Bands

To respect developmental stages aligned with India's National Education Policy (NEP 2020), the interface adapts across four distinct bands:

```
+---------------------------------------------------------------------------------------------------+
| BAND 1: PREPARATORY (Class 5)         | BAND 2: MIDDLE (Classes 6-8)                              |
| - Min touch target: 56px              | - Min touch target: 48px                                  |
| - Tactile, chunky cards & pill radius | - Balanced structure, transitional card elevations        |
| - Visual icons accompanying all text  | - Progressive disclosure of technical terminology         |
| - Playful bounce celebrations         | - Direct manipulation simulations with numeric feedback   |
+---------------------------------------+-----------------------------------------------------------+
| BAND 3: SECONDARY I (Classes 9-10)     | BAND 4: SECONDARY II (Classes 11-12)                      |
| - Min touch target: 48px              | - Min touch target: 48px / Dense desktop-ready grid       |
| - Rigorous board notation (CBSE/ICSE) | - Competitive exam rigor (JEE/NEET/CUET/State Boards)     |
| - Standardized laboratory apparatus   | - Split-view workspace (Notebook / Calculation / Graph)   |
| - Formal data tables & formula cards  | - Multi-variable coordinate plotting & tensor/matrix data |
+---------------------------------------------------------------------------------------------------+
```

### Detailed Band Profiles:

#### Band 1: Class 5 (Preparatory Stage — Ages 10–11)
* **Goal:** Demystify learning, spark curiosity, and build foundational confidence.
* **Component Geometry:** Large rounded corners (`border-radius: 16px` to `24px`), bold outlines (`2px solid`), extra-large touch targets ($\ge 56\text{px} \times 56\text{px}$).
* **Language & Content:** Conversational, story-driven microcopy; every concept paired with an illustrative SVG icon.
* **Feedback:** Tactile spring micro-animations (`cubic-bezier(0.34, 1.56, 0.64, 1.0)`), warm haptic clicks, auditory pitch chirps.

#### Band 2: Classes 6–8 (Middle Stage — Ages 11–14)
* **Goal:** Transition from intuitive play to structured scientific method and logical reasoning.
* **Component Geometry:** Standard rounded corners (`border-radius: 12px`), minimum touch targets ($\ge 48\text{px} \times 48\text{px}$).
* **Language & Content:** Introduction of formal scientific terminology (e.g., distinguishing "volume" from "loudness", "acidity" from "sourness") with instant inline glossaries.
* **Feedback:** Clean decelerated slide transitions (`cubic-bezier(0.0, 0.0, 0.2, 1.0)`), dual visual meters (dial + numeric readout).

#### Band 3: Classes 9–10 (Secondary Phase 1 — Ages 14–16)
* **Goal:** Mastery of board curriculum standards (CBSE, ICSE, State Boards) and board exam preparation.
* **Component Geometry:** Crisp, structured layouts (`border-radius: 8px`), high data density, clear visual hierarchy.
* **Language & Content:** Standardized board notation, balanced chemical equations ($2\text{H}_2 + \text{O}_2 \rightarrow 2\text{H}_2\text{O}$), SI units, ray diagrams, and formal theorem structures.
* **Feedback:** Subtle 180ms state changes, non-distracting progress telemetry.

#### Band 4: Classes 11–12 (Secondary Phase 2 — Ages 16–18)
* **Goal:** High-stakes board mastery and pre-university entrance preparation (JEE Main/Advanced, NEET-UG, CUET).
* **Component Geometry:** Compact high-density interface (`border-radius: 6px`), multi-column split views, advanced toolbars.
* **Language & Content:** Vector calculus notations, organic reaction mechanisms with stereochemistry, multi-step derivation cards, timed mock exam HUDs.
* **Feedback:** Minimalist 100ms micro-indicators, precision crosshairs, zero gamified clutter.

---

## 3. Color Architecture & Subject Theming

The color palette is built on CSS custom properties, providing accessible light and dark themes with distinct domain hues.

### 3.1. Surface & Neutral Tokens

| Token Name | Light Theme Value | Dark Theme Value | Contrast Role |
|---|---|---|---|
| `--color-surface-bg` | `#F8FAFC` (Slate 50) | `#0F172A` (Slate 900) | Root canvas background |
| `--color-surface-card` | `#FFFFFF` | `#1E293B` (Slate 800) | Elevating interactive cards |
| `--color-surface-sunken` | `#F1F5F9` (Slate 100) | `#020617` (Slate 950) | Input fields, simulation well |
| `--color-text-primary` | `#0F172A` (Slate 900) | `#F8FAFC` (Slate 50) | $\ge 12:1$ contrast against surface |
| `--color-text-secondary`| `#475569` (Slate 600) | `#94A3B8` (Slate 400) | $\ge 5.2:1$ contrast against surface |
| `--color-border-subtle` | `#E2E8F0` (Slate 200) | `#334155` (Slate 700) | Card boundaries |
| `--color-border-focus` | `#2563EB` (Blue 600) | `#60A5FA` (Blue 400) | 3px high-visibility focus ring |

### 3.2. Subject Domain Palettes

Every academic subject has a dedicated primary color and secondary accent to anchor student mental models:

```css
/* Subject Domain Theming */
:root {
  /* Physics (Electromagnetism, Optics, Mechanics) */
  --subject-physics-primary:   #1E3A8A; /* Deep Royal Navy */
  --subject-physics-accent:    #06B6D4; /* Electric Cyan */
  --subject-physics-light:     #E0F2FE;

  /* Chemistry (Molecular structures, Solutions, Reactions) */
  --subject-chemistry-primary: #065F46; /* Deep Emerald */
  --subject-chemistry-accent:  #10B981; /* Vibrant Teal */
  --subject-chemistry-light:   #D1FAE5;

  /* Biology (Living systems, Ecology, Physiology) */
  --subject-biology-primary:   #166534; /* Forest Botanical */
  --subject-biology-accent:    #F97316; /* Warm Flora Coral */
  --subject-biology-light:     #DCFCE7;

  /* Mathematics (Geometry, Calculus, Algebra) */
  --subject-math-primary:      #5B21B6; /* Deep Axiom Violet */
  --subject-math-accent:       #F59E0B; /* Golden Amber */
  --subject-math-light:        #EDE9FE;

  /* Social Sciences (History, Geography, Political Science) */
  --subject-social-primary:    #9A3412; /* Terracotta Sienna */
  --subject-social-accent:     #D97706; /* Heritage Gold */
  --subject-social-light:      #FFEDD5;

  /* Languages & Literature (English, Hindi, Regional Languages) */
  --subject-lang-primary:      #1E40AF; /* Scribe Sapphire */
  --subject-lang-accent:       #E11D48; /* Narrative Rose */
  --subject-lang-light:        #FFE4E6;
}
```

---

## 4. Typography & Indic Language System

Gramin PocketLab utilizes a zero-network-latency system font stack optimized for rapid rendering and full Indic script glyph support:

```css
:root {
  --font-family-base: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
                      Roboto, "Noto Sans", "Noto Sans Devanagari", "Noto Sans Tamil",
                      "Noto Sans Telugu", "Noto Sans Kannada", "Noto Sans Bengali",
                      sans-serif;
  --font-family-mono: ui-monospace, "SF Mono", "Cascadia Code", "Roboto Mono",
                      "Courier New", monospace;
}
```

### Type Scale (Modular Ratio 1.25 — Major Third):
* **Display (Hero/Stage):** `32px` / line-height `40px` (Weight: 700)
* **Title (Screen/Module):** `24px` / line-height `32px` (Weight: 700)
* **Heading (Card/Section):** `20px` / line-height `28px` (Weight: 600)
* **Subheading (Question):** `18px` / line-height `26px` (Weight: 600)
* **Body Regular (Reading):** `16px` / line-height `24px` (Weight: 400)
* **Body Dense (Data/HUD):** `14px` / line-height `20px` (Weight: 400)
* **Caption / Meta:** `12px` / line-height `16px` (Weight: 500)

---

## 5. Spacing, Geometry & Responsive Breakpoints

An 8-point baseline grid governs all spacing and component dimensions:

* **Spacing Tokens:**
  * `--space-xxs`: `4px`
  * `--space-xs`:  `8px`
  * `--space-sm`:  `12px`
  * `--space-md`:  `16px`
  * `--space-lg`:  `24px`
  * `--space-xl`:  `32px`
  * `--space-xxl`: `48px`

### Responsive Breakpoints:
1. **Compact Mobile (360px – 390px):** Default target for low-cost Indian smartphones. Single-column vertical stack, bottom navigation bar, full-width touch targets.
2. **Standard Mobile (391px – 480px):** Modern tall screens (20:9 aspect ratio). Optimized thumb zone reachability.
3. **Tablet Portrait (481px – 768px):** Low-cost educational tablets (e.g., state school tablet distributions). 2-column card grids, persistent sidebar drawer.
4. **Tablet Landscape / Laptop (769px – 1024px):** Split-view workspace (Simulation on left 60%, Question/Notes on right 40%).
5. **Desktop / Smart Board (1025px – 1440px+):** Classroom projector / teacher smartboard mode. Scaled typography for whole-room legibility.

---

## 6. QuestionWorld 10-State Motion & Interaction Language

Interactive QuestionWorlds are the core experiential canvas. Every QuestionWorld follows this strictly defined 10-state motion lifecycle:

```
+-------------------------------------------------------------------------------------------------------+
|                               QUESTIONWORLD 10-STATE LIFECYCLE                                        |
+-------------------------------------------------------------------------------------------------------+
|  1. Entry / Spawn        -->  2. Idle / Ambient Attention  -->  3. Hover / Touch Focus                |
|  4. Active Manipulation  -->  5. Simulation State Update   -->  6. Milestone Progression              |
|  7. Correct Submission   -->  8. Diagnostic Correction     -->  9. Hint Reveal  --> 10. Stage Reset   |
+-------------------------------------------------------------------------------------------------------+
```

| State | Trigger | Motion / Visual Specification | Duration | Easing Curve | Reduced-Motion Fallback |
|---|---|---|---|---|---|
| **1. Entry / Spawn** | Stage load | Apparatus fades and scales from 96% to 100% | 280ms | `cubic-bezier(0.0, 0.0, 0.2, 1.0)` | Instant opacity cut |
| **2. Idle Attention** | Inactivity > 8s | Subtle luminance pulse on primary interactive tool | 1200ms | Sine ease-in-out (loop) | Static highlight ring |
| **3. Touch Focus** | Pointer down | Element scales to 102%, drops 4px soft shadow | 100ms | `cubic-bezier(0.2, 0.0, 0.0, 1.0)` | 2px solid border |
| **4. Active Drag** | Pointer move | Smooth 60fps coordinate tracking with zero lag | Realtime | Direct transform matrix | Direct coordinate snap |
| **5. Sim Update** | Param change | Waveform plots dynamically; fluid meniscus levels | 180ms | `cubic-bezier(0.2, 0.0, 0.0, 1.0)` | Immediate curve redraw |
| **6. Milestone** | Sub-step done | Checkmark icon scales with brief green shimmer | 240ms | `cubic-bezier(0.34, 1.56, 0.64, 1.0)` | Instant checkmark icon |
| **7. Correct** | Final answer OK | Subtle confetti pulse, green badge glow (`#10B981`) | 320ms | `cubic-bezier(0.0, 0.0, 0.2, 1.0)` | Green text & checkmark |
| **8. Diagnostic** | Incorrect try | Gentle 6px lateral shake (2 cycles), warm amber border | 220ms | `cubic-bezier(0.36, 0.07, 0.19, 0.97)`| Amber border + text |
| **9. Hint Reveal** | Student clicks ?| Accordion drawer expands vertically | 200ms | `cubic-bezier(0.0, 0.0, 0.2, 1.0)` | Instant block reveal |
| **10. Stage Reset** | Restart clicked | Elements cross-fade back to initial resting state | 200ms | `cubic-bezier(0.4, 0.0, 1.0, 1.0)` | Immediate canvas clear |

---

## 7. Accessibility & Safety Governance

1. **Vestibular Safety:** All 10 states strictly observe `@media (prefers-reduced-motion: reduce)` by reducing animation duration to `0.01ms`.
2. **Photosensitive Seizure Prevention:** Strictly zero visual flashing, strobing, or alternating luminance between 3 Hz and 50 Hz.
3. **Contrast Compliance:** All text and interactive controls maintain $\ge 4.5:1$ contrast against their immediate background; large text ($\ge 18\text{pt}$ or $24\text{px}$) maintains $\ge 3:1$.
4. **Touch Target Law:** No interactive element shall have a bounding touch target smaller than $48\text{px} \times 48\text{px}$ (and $56\text{px} \times 56\text{px}$ for Class 5).

