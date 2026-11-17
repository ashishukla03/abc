# GRAMIN POCKETLAB — WORKING DRAFT SPECIFICATION SOURCE OF TRUTH

**Document ID:** AUDIT-SOURCE-OF-TRUTH-V1  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Audience:** Development Team, QA, Judging Panel, Antigravity Implementation Engine  
**Date:** November 9, 2026  
**Status:** Draft baseline — correction pass incomplete  

---

## 1. Product Identity & Architectural Tenets

### 1.1 Core Mission
**Gramin PocketLab** is an ultra-lightweight ($<2\text{ MB}$ target), client-only Progressive Web Application (PWA) designed to bring experiential science and mathematics inquiry to middle-school learners (Grades 6–8) in rural Indian government schools lacking functional physical laboratories.

### 1.2 Pedagogical Core: The Unified 7-Step POE Engine
All four subjects execute through one shared, standardized 7-step pedagogical cycle rooted in the Predict-Observe-Explain (POE) active learning framework (White & Gunstone, 1992; Freeman et al., 2014):

```
[ S0: Mission Map ]
       │
       ▼
[ S1: Mission Brief ] ──────── Curricular context & real-world relatable challenge
       │
       ▼
[ S2: Predict ] ────────────── Formative prediction (0 points; activates prior mental models)
       │
       ▼
[ S3: 2D Micro-Lab ] ──────── Active experimentation, variable isolation & real-time canvas feedback
       │
       ▼
[ S4: Explain ] ────────────── Multimodal conceptual explanation & side-by-side prediction comparison
       │
       ▼
[ S5: Formative Retry ] ────── Scaffolded retry targeting specific identified misconceptions
       │
       ▼
[ S6: Exit Check ] ─────────── 2 transfer questions evaluating deep conceptual mastery (Mastery = 2/2)
```

---

## 2. Four-Subject Content Specifications

### 2.1 Mathematics — Water Share Challenge (Ratios & Proportions)
* **Curricular Alignment:** NCERT Class 6 Mathematics (Chapter 12: Ratio & Proportion) and Class 7 (Chapter 8: Comparing Quantities) — curriculum-aligned working draft.
* **Storyline:** Allocating community irrigation water across three crop plots (Plot A: 1 part, Plot B: 2 parts, Plot C: 3 parts; total ratio $1 : 2 : 3$).
* **Interactive Lab Invariants & Bounds:**
  * User adjusts steppers ($[-]$ and $[+]$) for Plots A, B, and C.
  * Inputs are strictly non-negative integers bounded dynamically by current capacity: $alloc \in [0, T]$.
  * State 1 (Canonical): Total $T = 12$ units $\implies A = 2, B = 4, C = 6$.
  * State 2 (Scaled): Total $T = 24$ units $\implies A = 4, B = 8, C = 12$.
  * Invariant Banner: Real-time sum validation (`"Allocated: Current / Total"`). Verification button strictly checks BOTH the sum invariant ($\sum alloc = T$) and the target ratio ($A : B : C = 1 : 2 : 3$).
  * Non-proportional sum check: For $T = 12$, an allocation of $2, 4, 6$ is valid; an allocation of $1, 5, 6$ sums to 12 but must fail the ratio check with targeted feedback that Plot B must be twice Plot A and Plot C must be three times Plot A.
* **Exit Check Questions:**
  * **Question 1 (Neutral Transfer):** A school art workshop mixes 30 liters of clay slurry using powdered clay and water in the ratio $1 : 5$. How many liters of powdered clay are needed? (Answer: $30 \div 6 = 5\text{ L}$).
  * **Question 2 (Generalization):** Three students share 24 notebooks in the ratio $1 : 2 : 3$. How many notebooks does the student with the middle share receive? (Answer: $24 \div 6 \times 2 = 8\text{ notebooks}$).
* **Mastery Criteria:** 2 out of 2 (100%) correct for full mastery; 1 out of 2 (50%) for partial progress.

---

### 2.2 Biology — Food Web Explorer (Ecosystem Trophic Cascades)
* **Curricular Alignment:** NCERT Class 7 & 8 Science (Our Environment / Living Organisms) — curriculum-aligned working draft.
* **Storyline:** A rural agricultural ecosystem comprising Crops/Paddy (Producers), Grasshoppers & Field Mice (Primary Consumers), Frogs & Owls (Secondary Consumers), and Snakes (Tertiary Predators).
* **Interactive Lab Invariants:**
  * Rendered as a crisp, semantic SVG node graph with explicit arrowheads indicating energy transfer (`Food -> Consumer`).
  * Interactive Controls: `[ Drought Mode ]`, `[ Remove Snakes ]`, `[ Restore Balance ]`.
  * Deterministic Trophic Cascade: In this simplified qualitative ecological model, toggling `[ Remove Snakes ]` immediately triggers an overpopulation surge in frogs and a subsequent sharp decline in grasshoppers due to predatory pressure.
* **Accessibility Guarantee:** A semantic HTML data table directly mirrors every node status and relationship for screen readers.
* **Exit Check Questions:**
  * **Question 1:** In a pond ecosystem (Algae $\rightarrow$ Water Fleas $\rightarrow$ Small Fish $\rightarrow$ Kingfisher birds), if overfishing removes all small fish, what happens to the algae population? (Answer: Algae decreases because water fleas multiply and consume more algae).
  * **Question 2:** In any food web diagram, what do the directional arrows represent? (Answer: The direction in which energy flows from food to consumer).
* **Mastery Criteria:** 2 out of 2 (100%).

---

### 2.3 Chemistry — pH Color Lab (Acids, Bases & Indicators)
* **Curricular Alignment:** NCERT Class 7 Science (Chapter 5: Acids, Bases and Salts) — curriculum-aligned working draft (pending edition check against rationalised NCERT editions).
* **Storyline:** Testing everyday village substances: Lemon Juice (illustrative $\text{pH} \approx 2.2$), Distilled Water (pH 7.0 Reference), Baking Soda Solution (illustrative $\text{pH} \approx 8.5$), and Laundry Soap Solution (illustrative $\text{pH} \approx 10.0$).
* **Interactive Lab Invariants:**
  * Test Solutions (4 Beakers): Lemon Juice, Distilled Water (pH 7.0 Reference), Baking Soda Solution, Laundry Soap Solution.
  * Indicator selection: Natural Turmeric Paper Strip or Universal Indicator Paper.
  * Dipping action: User triggers indicator immersion; the virtual strip transitions colors dynamically via CSS properties (Turmeric: Yellow in acid/neutral $\rightarrow$ Deep Reddish-Brown in alkaline; Universal Indicator: Red in acid $\rightarrow$ Green at neutral $\rightarrow$ Blue/Purple in alkaline).
  * pH Scale Slider: Interactive bar updates from 0 to 14 with explicit labels ($0-6$ Acidic, $7$ Neutral, $8-14$ Basic / Alkaline).
  * **Chemical Accuracy Rule:** Solutions with $\text{pH} > 7$ (including pH 8.5, 10.0, and 11) are officially designated as **"basic / alkaline solutions"** (avoiding unverified "strong base" categorizations for introductory curriculum).
  * **Mandatory Water Safety Banner:** Permanently visible alert banner: *"Notice: Educational simulation. A pH test does not detect pathogens (bacteria, viruses, or protozoa) or toxic dissolved chemicals, and a reading of pH 7.0 does not establish water potability or biological safety."*
* **Exit Check Questions:**
  * **Question 1:** "A clear water sample (such as well or pond water) tests neutral at pH 7.0. Does this pH result alone guarantee the water is safe to drink?" (Options: Yes total purity guaranteed | No pH cannot determine pathogen or chemical safety [CORRECT] | Yes only if clear and cold. Rationale: A pH reading only measures chemical hydrogen ion activity; it does not test for biological pathogens or dissolved toxins and does not establish water potability).
  * **Question 2:** "Which of these pH values represents a basic / alkaline solution?" (Options: pH 2, pH 7, pH 11; Correct: pH 11).
* **Mastery Criteria:** 2 out of 2 (100%).

---

### 2.4 Physics (Flagship) — Sound Detective (Acoustics & Waveforms)
* **Curricular Alignment:** NCERT Class 8 Science (Chapter 13: Sound).
* **Role in Hackathon:** Primary live deep-dive demonstration for judging panels.
* **Synthesizer & Oscilloscope Invariants:**
  * Web Audio API tone generator using pure native `OscillatorNode` (`type: 'sine'`).
  * Snap Presets: `[ Play 220 Hz (Low) ]` and `[ Play 440 Hz (High) ]`. Continuous frequency slider ($100–1000\text{ Hz}$).
  * Amplitude Slider: $10\%–100\%$.
  * Real-Time Oscilloscope Canvas ($600 \times 240\text{ px}$ responsive):
    * Plots pure mathematical sine wave at 60 FPS: $y(t) = A \cdot \sin(2\pi f t)$.
    * Mathematical cycle count across $10\text{ ms}$ window: $2.2$ cycles at 220 Hz; $4.4$ cycles at 440 Hz.
    * Labeled as a normalized, illustrative educational oscilloscope demonstrating that doubling frequency compresses horizontal wavelength by exactly $2\times$ while leaving vertical wave amplitude unchanged.
* **Audio Safety & Hardware Safeguards:**
  * **Digital Gain Headroom Ceiling:** Web Audio `GainNode` strictly clamped to maximum $0.70$ ($-3\text{ dBFS}$) as a software ceiling to prevent digital clipping distortion on phone DACs. (Note: digital clamping does not guarantee physical biological hearing safety or prevent physical speaker damage at elevated device master volumes).
  * **Low Starting Volume:** Initial volume slider defaults conservatively to $20\%–30\%$.
  * **Zero Autoplay:** Audio remains suspended until explicit, synchronous user touch/click (`AudioContext.resume()`).
  * **Global Mute / Stop:** Persistent master stop/mute controls always accessible on the screen.
  * **Actual-Device Audio Testing:** Practical playback verification plan on representative physical Android handsets (verifying reliable playback start, user volume control, immediate stop/mute responsiveness, and absence of audio distortion; without asserting calibrated SPL or guaranteed hearing safety).
* **Microphone Mode (Progressive Enhancement):**
  * `[ 🎙 Listen to External Sound ]`: Optional progressive enhancement. If permission is denied or mic is unavailable, interface gracefully falls back to synthetic tone generation with zero blocking modal. All audio processed strictly in volatile memory; zero audio stored or uploaded.
* **Exit Check Questions:**
  * **Question 1:** If a musician increases the vibration frequency of a string from 220 Hz to 440 Hz without changing volume, what difference do you hear? (Answer: The pitch sounds higher / one octave up).
  * **Question 2:** If you strike a drum harder, increasing the sound's amplitude, what changes on the oscilloscope display? (Answer: The wave height / crests get taller, while the width between peaks stays identical).
* **Mastery Criteria:** 2 out of 2 (100%).

---

## 3. Technology Stack & Architectural Decisions

| Layer | Technical Decision | Rationale |
| :--- | :--- | :--- |
| **Runtime Language** | Vanilla ES6+ JavaScript (ES Modules) | Zero compilation overhead; zero bundler breakages; instant edit-and-refresh. |
| **Markup & DOM** | Semantic HTML5 | Native accessibility (`role`, `aria-*`, `<button>`, `<input>`); zero virtual DOM overhead. |
| **Styling** | Vanilla CSS with Custom Properties | Dynamic theme switching, zero CSS-in-JS runtime bloat, $<15\text{ KB}$ total style footprint. |
| **Audio Generation** | W3C Web Audio API (`AudioContext`) | Pure mathematical tone synthesis; zero downloaded MP3 audio files. |
| **Visual Rendering** | HTML5 Canvas 2D & Inline SVG | Hardware-accelerated 60 FPS rendering target without heavy WebGL or 3D engine overhead. |
| **Storage & Persistence** | `localStorage` with in-memory fallback | Simple single-user key-value progress persistence; factual data-handling choices (zero PII collected; formal legal compliance under DPDP Act 2023 not assessed). |
| **Offline Architecture** | Cache-First Service Worker | Downloads $<2\text{ MB}$ shell target on first connection; operates offline from Service Worker cache (cache eviction or manual clearing requires network reconnection). |
| **Server Backend** | Strictly Zero Server (Client-Only PWA) | Complete resilience against hackathon venue Wi-Fi crashes and cloud latency. |

---

## 4. UI Design System & Accessibility Contracts

### 4.1 Color Palette & Contrast Tokens

```css
:root {
  /* Surfaces & Backgrounds */
  --color-bg-app: #F5F7FB;          /* Soft cool slate */
  --color-surface: #FFFFFF;         /* Crisp card surface */
  --color-border: #D9E0EB;          /* Structural dividers only (1.38:1 on white) */
  --color-border-control: #6B7280;  /* Essential control borders (4.83:1 on white, 4.51:1 on #F5F7FB; design target, rendered UI testing required) */

  /* Typography */
  --color-text-main: #162033;       /* High-contrast deep navy (13.84:1 on white, WCAG AAA) */
  --color-text-secondary: #596579;  /* Supporting copy (5.32:1 on white, WCAG AA) */

  /* Subject Identity Accents (All pass WCAG AA >= 4.5:1 with white text) */
  --color-math: #275DDB;            /* Mathematics Cobalt (4.68:1) */
  --color-bio: #18794E;             /* Biology Forest Green (4.82:1) */
  --color-chem: #8B3E98;            /* Chemistry Plum Purple (4.62:1) */
  --color-phys: #087E79;            /* Physics Teal (4.74:1) */

  /* Feedback Accents */
  --color-correct: #18794E;
  --color-incorrect: #C5221F;
  --color-focus: #275DDB;           /* 3px solid focus ring outline */
}
```

### 4.2 Accessibility & Usability Contracts
* **Touch Targets:** Minimum $48 \times 48\text{ px}$ interactive touch boundary on all mobile buttons and range slider thumbs.
* **Dual Affordances:** Interactive controls must never rely solely on border color; controls feature solid background contrast, clear typography, and an unmissable $3\text{ px}$ focus ring (`#275DDB`).
* **Motion Preferences:** `@media (prefers-reduced-motion: reduce)` disables decorative CSS animations and continuous oscilloscope sweeping.
* **Screen Reader Parity:** All dynamic charts and graphs provide hidden or collapsible `<table class="sr-only">` elements or equivalent `aria-live` status regions.

---

## 5. Localization Policy

1. **English:** The primary baseline and 100% complete fallback for all system labels, questions, options, explanations, and error toasts.
2. **Kannada:** Pre-event draft translation strings are provided in the specification and flagged as `[PENDING HUMAN REVIEW]`. To be verified by a native Kannada speaker before exposure in production UI.
3. **Hindi:** Explicitly deferred outside the initial MVP scope to avoid runtime key mismatches during the event.

---

## 6. Pre-Event Boundary & Integrity Enforcements

* **Zero Pre-Authored Core App Code:** The `app/` directory contains strictly `app/manifest.json` and `app/assets/icon.svg`. `index.html`, `index.css`, `main.js`, and module files will be authored entirely during the official hackathon build window.
* **Licensing of Original Code:** Proposed MIT License (pending explicit team approval).
* **No Premature Test Pass Claims:** Acceptance tests in `qa_test_plan/` represent post-build verification runbooks, not pre-event claims.
* **Honest Metrics:** All references to "sub-2MB footprint," "60 FPS performance," and "offline reliability" represent **engineering design targets and acceptance criteria**, to be verified upon physical completion of the build.
