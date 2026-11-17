# UI SCREEN CONTRACTS & INTERACTION STATES

**Document ID:** UI-SCREEN-CONTRACTS-V2  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Role:** Senior Product Designer & Design Systems Architect  
**Principle:** One clear primary action per screen. Zero decorative clutter. Predictable backward and forward navigation.  

---

## 1. Global Navigation & Persistent Shell

* **Top App Bar (Fixed $64\text{ px}$ height, background `#FFFFFF`, border-bottom $1\text{ px}$ solid `#D9E0EB`):**
  * Left: App Wordmark (`"Gramin PocketLab"`) + Offline Status Indicator Badge (Green dot: `"Cached Offline"`).
  * Center: Subject Discipline Pill (`Math` / `Biology` / `Chemistry` / `Physics`) + Stepper Tracker (`Step X of 6`).
  * Right: Audio Master Mute (`[ 🔊 / 🔇 ]`) + Language Selector (`[ EN | KN* ]`) + Reset Button (`[ ↺ Reset ]`).
* **Mobile Sticky Bottom Action Bar ($68\text{ px}$ height, fixed at bottom on viewports $<640\text{ px}$):**
  * Left: Secondary `[ ← Back ]` button (width: $44\text{ px}$ icon or text).
  * Right: Single primary action CTA button (width: flex-grow, min-height $48\text{ px}$).

---

## 2. Screen Contracts (S0 to S6)

### S0: Home / Mission Map
* **Core Contract:** Explains the product in exactly one sentence. Displays four subject cards. No empty routes or "coming soon" placeholders.
* **Header Copy:**
  * Title: `"Gramin PocketLab"`
  * One-Sentence Description: *"Explore real-world science and mathematics through four interactive field investigations designed for rural schools."*
* **Layout:**
  * Desktop ($\ge 768\text{ px}$): 2-column grid (`grid-template-columns: repeat(2, 1fr)`), $24\text{ px}$ gap.
  * Mobile ($< 768\text{ px}$): Single-column vertical stack, $16\text{ px}$ gap.
* **Card Specifications (4 Active Cards):**
  1. **Mathematics:**
     * Subject Tag: `Mathematics (NCERT Class 6–7)`
     * Mission Title: `"Water Share Challenge"`
     * One-Sentence Scope: *"Divide community irrigation water proportionally using ratios and parts."*
     * Action CTA: `[ Start Investigation → ]` (Border accent: `#275DDB`)
  2. **Biology:**
     * Subject Tag: `Biology (NCERT Class 7–8)`
     * Mission Title: `"Food Web Explorer"`
     * One-Sentence Scope: *"Discover how energy flows between farm species and observe what happens when predators vanish."*
     * Action CTA: `[ Start Investigation → ]` (Border accent: `#267343`)
  3. **Chemistry:**
     * Subject Tag: `Chemistry (NCERT Class 7)`
     * Mission Title: `"pH Color Lab"`
     * One-Sentence Scope: *"Test common household liquids using natural indicators to classify acids, neutrals, and bases."*
     * Action CTA: `[ Start Investigation → ]` (Border accent: `#9B5C00`)
  4. **Physics:**
     * Subject Tag: `Physics (NCERT Class 8) — Flagship Investigation`
     * Mission Title: `"Sound Detective"`
     * One-Sentence Scope: *"See and hear sound waves to discover the difference between frequency, pitch, and loudness."*
     * Action CTA: `[ Start Investigation → ]` (Border accent: `#087E79`)

---

### S1: Mission Introduction
* **Core Contract:** Communicates context, learning goals, and estimated time. Zero permission prompts on this screen.
* **Components:**
  * Scenario Card: 2–3 sentence relatable rural context (e.g. Village irrigation tank / Farm ecosystem / Water testing camp / Festival flute and drum).
  * Learning Objective Box: Highlighted container with one measurable goal.
  * Metadata Bar: `Duration: ~5–7 mins` | `Curriculum: NCERT Standards` | `Offline Ready`.
* **Primary Action:** `[ Make a Prediction → ]` (Enables advance to S2).

---

### S2: Prediction Question
* **Core Contract:** Low-stakes formative hypothesis before touching the lab. Preserves learner's answer on backward navigation.
* **Components:**
  * Context Banner: `"Make your prediction before entering the lab. There is no penalty for an incorrect guess!"`
  * Question Heading: Clear scenario prompt.
  * Options: 3 radio cards (vertical stack, min height $48\text{ px}$, $12\text{ px}$ padding, radio circle on left).
  * Inclusion: An optional `"Not sure yet"` option is supported where appropriate to reduce student anxiety.
* **State Behavior:**
  * Initial State: Primary CTA `[ Submit Prediction ]` is disabled (`aria-disabled="true"`).
  * Selection State: Radio border changes to subject accent; radio button fills. Primary CTA enabled.
  * On Click: Records choice to local state; reveals non-judgmental prompt: `"Hypothesis recorded! Let's test it in the lab."` Transitions to S3.

---

### S3: Interactive Exploration (The Micro-Lab)
* **Core Contract:** Subject-specific laboratory stage with deterministic variables, clear units, and non-color text equivalents.
* **Shared Panel Rules:**
  * Container: `#FFFFFF` surface, `24px` radius, $1\text{ px}$ solid `#D9E0EB` border.
  * Header: Stage title + Reset button `[ ↺ Reset Lab ]` to return sliders to defaults without losing mission progress.
* **Subject Specifics:**
  * **Mathematics (Water Allocator):**
    * Display: 3 labeled vertical container bars (Plot A, Plot B, Plot C) and 1 Master Tank.
    * Controls: Large $[-]$ and $[+]$ buttons ($48 \times 48\text{ px}$) per plot. Keyboard step supported via arrow keys.
    * Real-time Text Status: `"Allocated: [X] / 12 units"` (Displays exact difference if $<12$ or $>12$).
    * Verification Action: `[ Check Distribution ]`. Disabled if total $\ne 12$.
  * **Biology (Food Web Explorer):**
    * Display: SVG node graph with explicitly directed arrows (`Energy flows to --->`).
    * Controls: Predefined scenario buttons: `[ Balanced State ]`, `[ Remove Snakes ]`, `[ Drought Scenario ]`.
    * Text List Equivalent: Collapsible `<details>` element listing all predator-prey relationships.
    * Feedback Display: Cautious qualitative observation panel: `"Observed tendency: Frogs likely surge due to lack of predators; Grasshoppers face higher predation."`
  * **Chemistry (pH Color Lab):**
    * Display: 4 beakers (Lemon Juice [pH 2.2], Distilled Water [pH 7.0 reference], Baking Soda Solution [pH 8.5], Soap Solution [pH 10.0]).
    * Interaction: Click `[ Dip Natural Turmeric Paper ]` or `[ Dip Universal Indicator Paper ]`.
    * Output: Indicator strip animates into liquid and updates color (Turmeric turns reddish-brown in alkaline solutions; Universal indicator displays continuous standard scale).
    * Supporting Scale: Numerical pH gradient bar ($0$ to $14$) with text marker pointing to value and text category: `[ pH 2.2: Acidic ]`, `[ pH 7.0: Neutral ]`, `[ pH 8.5 / 10.0: Basic ]`.
    * Permanent Safety Notice: Visible warning box: *"Notice: Educational simulation. A neutral pH of 7 only measures hydrogen ion activity and does NOT prove water is biologically sterile or free from toxic dissolved chemicals."*
  * **Physics (Sound Detective):**
    * Display: Oscilloscope canvas rendering 60 FPS sine wave with labeled time axis ($t = 0$ to $10\text{ ms}$) and amplitude axis ($-1.0$ to $+1.0$).
    * Controls:
      * Tone Presets: `[ Play 220 Hz (Low) ]` and `[ Play 440 Hz (High) ]`.
      * Frequency slider: $100\text{ Hz} - 800\text{ Hz}$ with unit label `Hz`.
      * Amplitude slider: $10\% - 100\%$ with unit label `%`.
      * Master sound toggle: `[ 🔊 Play Tone ]` / `[ ⏹ Stop ]`.
      * Optional Microphone Toggle: `[ 🎙 Optional: Test Mic ]` (Try/catch wrapped; displays friendly notification on denial; never blocks lesson).
* **Primary Action:** `[ I Have Observed the Result → ]` (Advances to S4).

---

### S4: Concept Understanding
* **Core Contract:** Synthesizes the core scientific principle directly connected to what the learner manipulated in S3.
* **Components:**
  * Observation Recap Box: `"In the lab, you observed that..."`
  * Scientific Explanation Card: 2 short paragraphs with clear diagrams/equations (e.g. $12 \div 6 = 2$ units per part; $440\text{ Hz} = 2 \times 220\text{ Hz}$).
  * Key Rule Callout: Highlighted field-notebook box summarizing the governing rule.
* **Primary Action:** `[ Check My Understanding → ]` (Advances to S5).

---

### S5: Formative Feedback & Targeted Retry
* **Core Contract:** Diagnoses the learner's understanding using an immediate application question. Provides actionable misconception feedback and an alternative retry question.
* **Components:**
  * Formative Question: Multiple-choice scenario targeting known misconceptions.
  * If Correct on First Try: Displays Green confirmation banner with reinforcement of the underlying reason, and CTA `[ Proceed to Final Check → ]`.
  * If Incorrect: Displays Amber scaffolding panel explaining *why* the intuition failed (e.g., explaining why $4, 4, 4$ violates the $1:2:3$ inequality) and reveals a **changed retry question** (e.g. dividing 18 units in ratio $1:2$).
* **Primary Action:** `[ Continue to Exit Check → ]`.

---

### S6: Exit Check & Mission Summary
* **Core Contract:** Summative transfer assessment. Real score calculation. No exaggerated claims of long-term learning gains from one short session.
* **Components:**
  * Two Exit Check Questions: Transfer problems applying concepts to new scenarios (e.g. mixing craft clay slurry in ratio, forest food webs, well water bacterial disclaimer, bat vs. lion frequencies).
  * Immediate Feedback: Shows correct answer and detailed mathematical/scientific explanation upon submission.
  * Session Summary Card:
    * `"Mission Complete: [ Subject Title ]"`
    * Score: `"Exit Check: [ X / 2 Correct ]"`
    * Concept Recap: 2-bullet takeaway list.
* **Actions:**
  * `[ ↺ Replay Investigation ]` (Resets lab for free play).
  * `[ Return to Mission Map → ]` (Navigates back to S0).
