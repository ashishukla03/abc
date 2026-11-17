# AGE-ADAPTIVE DESIGN SYSTEM SPECIFICATION
**Document ID:** GPL-SPEC-DS-V1  
**Project:** Gramin PocketLab — K–12 Multi-Board Learning Ecosystem  
**Target Audience:** Product Designers, UI/UX Engineers, Pedagogical Leads  
**Status:** Draft — Task v6 Security, Validation & Evidence Reconciliation Completed
**Classification:** Design System Guidelines, Tokens & Interaction Architecture  

---

## 1. System Vision & The Pedagogical Continuum

Educational user interfaces too often swing between two flawed extremes: either treating high-schoolers like primary-school children with cartoon badges, or confronting middle-schoolers with dense, intimidating college portals.

**Gramin PocketLab implements an Age-Adaptive Design System organized into four product design bands inspired by the developmental principles of the National Curriculum Framework for School Education (NCF-SE 2023):**
1. **Design Band 1: Class 5 (Preparatory Stage — Final Year)**
2. **Design Band 2: Classes 6–8 (Middle Stage)**
3. **Design Band 3: Classes 9–10 (Secondary Stage — Phase 1)**
4. **Design Band 4: Classes 11–12 (Secondary Stage — Phase 2 / Senior Secondary)**

> [!NOTE]
> **Clarification of Product Design Bands vs. Official NCF Stages:**
> In NCF-SE 2023, Classes 9 through 12 are unified within the **Secondary Stage** (divided into Phase 1: Classes 9–10 and Phase 2: Classes 11–12). The four UI tiers above are internal Gramin PocketLab user experience design bands tailored to cognitive complexity and interface density, rather than four distinct official NCF developmental stages. Furthermore, fixed chronological age assumptions based solely on class grade are avoided, acknowledging variable school entry ages across rural learning environments.

When a learner selects their class, the interface fundamentally transforms: typography, color saturation, layout density, interaction physics, feedback language, and conceptual representations adapt to their developmental and cognitive maturity.

---

## 2. Comprehensive Four-Tier Age-Adaptive Design Matrix

```
+---------------------------------------------------------------------------------------------------------+
|                                    GRAMIN POCKETLAB DESIGN CONTINUUM                                    |
+-------------------+-------------------+-----------------------------------+-----------------------------+
| Class 5           | Classes 6–8       | Classes 9–10                      | Classes 11–12               |
| Preparatory Stage | Middle Stage      | Secondary Stage                   | Senior Secondary Stage      |
| Concrete / Story  | Guided Discovery  | Formal Rigor & Board Prep         | Academic & Analytical Focus |
| Tactile Blocks    | Micro-Labs & POE  | Data Charts & Multi-Step Logic    | Parametric Models & Tensors |
| Playful & Warm    | Curious & Modern  | Focused, Structured, Professional | Clean, Minimalist, Research |
+-------------------+-------------------+-----------------------------------+-----------------------------+
```

### 2.1 Detailed Stage Comparison

| Design Dimension | Tier 1: Class 5 (Preparatory) | Tier 2: Classes 6–8 (Middle) | Tier 3: Classes 9–10 (Secondary) | Tier 4: Classes 11–12 (Senior Secondary) |
| :--- | :--- | :--- | :--- | :--- |
| **Pedagogical Archetype** | **Storybook Workbench** | **Exploratory Laboratory** | **Academic Studio** | **Research Workbench** |
| **Visual Tone** | Warm, friendly, tactile, reassuring. Story-grounded characters. | Crisp, inquisitive, dynamic. Modular scientific lab tools. | Structured, clear, focused, exam-ready, uncluttered. | Mature, minimalist, sophisticated, analytical, zero-gamification. |
| **Color Palette Tone** | Saturated earth & sunny tones: Soft Honey `#F9A825`, Grass `#2E7D32`, Sky `#1565C0`. | Modern vibrant science: Cobalt `#275DDB`, Emerald `#267343`, Amber `#9B5C00`. | Deep academic accents: Navy `#1A365D`, Slate `#334155`, Crimson `#991B1B`. | Monochromatic slate with laser accents: Carbon `#0F172A`, Electric Teal `#0D9488`, Violet `#6366F1`. |
| **Typography Scale** | Large, high-legibility sans: Base $18\text{ px}$, headings $24–32\text{ px}$. Generous line height ($1.65$). | Clean readable grotesque: Base $16\text{ px}$, headings $20–28\text{ px}$. Line height $1.55$. | Dense academic sans: Base $15–16\text{ px}$, headings $18–24\text{ px}$. Technical mono for formulas. | Fluid analytical: Base $15–16\text{ px}$ fluid, headings $18–24\text{ px}$. KaTeX LaTeX display math. Zoomable to $200\%$. |
| **Illustrative Style** | Friendly 2D vector characters, relatable domestic/farm objects. | Clear schematic 2D models, cutaway diagrams, dynamic SVG state graphs. | Accurate scientific schematics, circuit diagrams, geometric proofs, ray traces. | Precision engineering plots, vector fields, reaction coordinates, phase diagrams. |
| **Control Mechanics** | Chunky touch tiles, physical sliders with big knobs, oversized steppers ($\ge 56\text{ px}$). | Standard steppers ($\ge 48\text{ px}$), dual-handle range sliders, toggle switches. | Multi-variable inputs, numeric entry keypads, formula selection chips ($\ge 44\text{ px}$). | Parametric input fields, coordinate matrices, split-pane data tables ($\ge 44\text{ px}$). |
| **Scaffolding & Hints** | Step-by-step visual demonstration with animated character companion. | 3-tier progressive hints; predictive hypothesis prompt before action. | Strategic conceptual cues; diagnostic misconception analysis; marking rubrics. | Derivation hints; boundary condition checks; dimensional analysis checks. |
| **Feedback Tone** | Celebratory, encouraging, non-judgmental: *"Let's explore what happened!"* | Inquisitive, cause-and-effect focused: *"Notice how changing X doubled Y?"* | Precise, diagnostic, rubric-aligned: *"In standard evaluation schemes, state the governing principle before calculation."* | Direct, analytical, rigorous: *"Violates conservation of energy at boundary condition $t=0$."* |
| **Gamification Policy** | Playful discovery stamps, exploration stars (low-stakes). | Concept mastery badges, mission completion flags. | Syllabus coverage checklists, revision mastery milestones. | Strictly zero childish gamification; focus on concept clarity and exam progress. |

---

## 3. Global Design Tokens (Cross-Platform CSS/Design System)

### 3.1 Color Palette & Accessible Subject Semantics

Every subject maintains an invariant accessible identity with a guaranteed minimum contrast ratio of **4.5:1 (WCAG AA)** on dark backgrounds and **7.0:1 (WCAG AAA)** on neutral text.

```css
:root {
  /* Surface Tokens */
  --surface-canvas: #F8FAFC;
  --surface-card: #FFFFFF;
  --surface-raised: #F1F5F9;
  --surface-overlay: rgba(15, 23, 42, 0.75);

  /* Text Contrast Tokens */
  --text-primary: #0F172A;     /* Contrast against #FFFFFF: 15.4:1 (AAA) */
  --text-secondary: #475569;   /* Contrast against #FFFFFF: 6.8:1 (AA) */
  --text-muted: #64748B;       /* Contrast against #FFFFFF: 4.6:1 (AA) */
  --text-inverse: #FFFFFF;

  /* Border & Focus Tokens */
  --border-subtle: #E2E8F0;
  --border-control: #64748B;   /* Contrast against #FFFFFF: 4.6:1 (Non-text AA) */
  --focus-ring: #275DDB;       /* 3px solid focus indicator */

  /* Subject Semantic Colors (Middle & Secondary Baseline) */
  --subject-math-accent: #D97706;     /* Amber Ochre */
  --subject-math-bg: #FFFBEB;
  --subject-biology-accent: #15803D;  /* Forest Green */
  --subject-biology-bg: #F0FDF4;
  --subject-chemistry-accent: #0284C7;/* Science Blue */
  --subject-chemistry-bg: #F0F9FF;
  --subject-physics-accent: #7C3AED;  /* Deep Violet */
  --subject-physics-bg: #F5F3FF;
  --subject-social-accent: #B45309;   /* Terracotta */
  --subject-social-bg: #FFFBEB;
  --subject-commerce-accent: #0F766E; /* Deep Teal */
  --subject-commerce-bg: #F0FDFA;
  --subject-cs-accent: #4338CA;       /* Indigo */
  --subject-cs-bg: #EEF2FF;
  --subject-languages-accent: #BE123C;/* Carmine Rose */
  --subject-languages-bg: #FFF1F2;
}
```

### 3.2 Age-Differentiated CSS Override Layers with Fluid Typography

> [!IMPORTANT]
> **Fluid Typography Standard:**
> Typography scales fluidly based on viewport width while honoring user zoom preferences up to $200\%$. The base font size for Classes 11–12 defaults to a comfortable $15–16\text{ px}$ with fluid clamps, avoiding eye strain on mobile displays.

```css
/* Tier 1: Class 5 Overrides (Preparatory Stage) */
[data-educational-tier="preparatory-class-5"] {
  --font-base: clamp(17px, 1.5vw + 14px, 19px);
  --font-line-height: 1.65;
  --radius-card: 20px;
  --radius-button: 16px;
  --min-touch-target: 56px;
  --card-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
}

/* Tier 2: Classes 6–8 Overrides (Middle Stage) */
[data-educational-tier="middle-classes-6-8"] {
  --font-base: clamp(15px, 1.2vw + 12px, 17px);
  --font-line-height: 1.55;
  --radius-card: 14px;
  --radius-button: 10px;
  --min-touch-target: 48px;
  --card-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
}

/* Tier 3: Classes 9–10 Overrides (Secondary Stage) */
[data-educational-tier="secondary-classes-9-10"] {
  --font-base: clamp(15px, 1.0vw + 12px, 16px);
  --font-line-height: 1.50;
  --radius-card: 10px;
  --radius-button: 6px;
  --min-touch-target: 44px;
  --card-shadow: 0 1px 4px rgba(15, 23, 42, 0.05);
}

/* Tier 4: Classes 11–12 Overrides (Senior Secondary Stage) */
[data-educational-tier="senior-secondary-classes-11-12"] {
  --font-base: clamp(15px, 0.8vw + 12px, 16px);
  --font-line-height: 1.48;
  --radius-card: 6px;
  --radius-button: 4px;
  --min-touch-target: 44px;
  --card-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}
```

---

## 4. User-Controlled Individual Accessibility Overrides

Learners within any single grade level possess diverse sensory, cognitive, and motor profiles. The design system exposes explicit user-controlled accessibility adjustments:

1. **Text Scaling Control:** User slider allows global font magnification from $100\%$ to $200\%$ in increments of $10\%$, without layout breakage or overlapping containers.
2. **Text Density Toggle:**
   - *Comfortable (Default):* Standard generous spacing ($1.55$ line height, $16\text{ px}$ padding).
   - *Compact:* Tighter information density for advanced learners on tablet/desktop displays ($1.40$ line height, $10\text{ px}$ padding).
3. **Contrast Modes:**
   - *Standard:* Meets WCAG 2.1 AA non-text ($3:1$) and text ($4.5:1$).
   - *High Contrast Mode:* Forces black-on-white text ($21:1$) with bright yellow/cyan accents and $3\text{ px}$ solid borders.
4. **Motion Preferences:** Full support for `prefers-reduced-motion: reduce`. Disables real-time oscillating sine waves, spring physics, and animated transitions; displays static annotated graphs.
5. **Screen Reader Reading Support:** Dynamic TTS reading support for narrative prompts and problem statements in regional languages.

---

## 5. Pedagogical Lesson Flow: The *Panchpadi* Instructional Cycle

> [!IMPORTANT]
> **Pedagogical Source Distinction (NCF-SE 2023 Box 3.3v vs. NCF-FS 2022 Box 4.2A):**
> Gramin PocketLab structures its digital lesson units on the traditional five-step Indian pedagogical cycle. For precise scholarship:
> - In the **National Curriculum Framework for School Education (NCF-SE 2023, August 2023, Box 3.3v)**, this sequence is formally designated as **Panchpadi**, comprising: **Aditi** (Introduction/Sensitization), **Bodh** (Conceptual Understanding), **Abhyas** (Practice), **Prayog** (Application), and **Prasar** (Expansion).
> - In the earlier **National Curriculum Framework for Foundational Stage (NCF-FS 2022, Box 4.2A)**, the sequence is referenced as **Panchaadi**.
> 
> Gramin PocketLab adopts the **NCF-SE 2023 Box 3.3v Panchpadi** framework as an internal digital instructional pattern. This adoption represents an architectural design alignment inspired by national curriculum guidance, and does not imply official endorsement or certification by NCERT or the Ministry of Education.

```
[ 1. Aditi (Introduction / Sensitization) ] ──▶ Relatable real-world context & initial scenario
            │
            ▼
[ 2. Bodh (Conceptual Understanding) ] ──▶ Socratic exploration & QuestionWorld manipulation
            │
            ▼
[ 3. Abhyas (Guided & Independent Practice) ] ──▶ Structured challenge problems with dynamic hints
            │
            ▼
[ 4. Prayog (Application & Inquiry) ] ──▶ Boundary testing & multi-variable experimentation
            │
            ▼
[ 5. Prasar (Expansion & Synthesis) ] ──▶ Synthesis, transfer, and real-world reflection
```

---

## 6. AI Study Companion Interface & Board-Neutral Phrasing

1. **Socratic Guidance Principle:** The companion provides conceptual scaffolding, hints, and analogies—never direct answers.
2. **Board-Adaptive Phrasing:** The companion's feedback adapts dynamically to the active `curriculumAuthorityId`:
   - For CBSE: *"In CBSE marking schemes, write the formula first and specify units in the final step."*
   - For CISCE (ICSE): *"In ICSE evaluations, provide the exact scientific definition before stating the observation."*
   - For State Boards (e.g. KSEAB): Adapts to the state-prescribed answer structure.
   - For Generic/Multi-Board: *"In standard evaluation schemes, state the governing principle before your calculation."*
3. **Actionable Socratic Chips:** Pre-built prompts like `[ Simplify this step ]`, `[ Give a real-world example ]`, `[ Where is my calculation error? ]`, `[ What is the prerequisite concept? ]`.
