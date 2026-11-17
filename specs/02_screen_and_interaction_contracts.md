# Screen & Interaction Contracts — Gramin PocketLab

**Document ID:** SPEC-SCREEN-CONTRACTS-V2  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Status:** Pre-Event Specification  

---

## 1. Global Navigation & Viewport Contract

### 1.1 Persistent Shell Layout
* **Top Navigation Bar:**
  * Left: App Brand (`"Gramin PocketLab"`) + Local Offline Indicator icon (Online / Offline Cached).
  * Center: Current Subject Badge (`Math` / `Bio` / `Chem` / `Physics`) + Mission Step Indicator (`Step X of 7`).
  * Right: Single Anonymous Session Badge (`"Local Session"`; multi-profile switcher UI deferred to post-MVP) + Sound/Audio Mute Toggle (`🔊 / 🔇`) + Reset Activity Button (`↺`).
* **Step Navigation Bar (Bottom Sticky on Mobile):**
  * `[ Back ]` Button (disabled on Step 1; navigates to Step $N-1$ without wiping previous valid inputs).
  * Progress Dots / Pills (7 dots showing visited/completed steps).
  * `[ Next / Check Answer / Continue ]` Primary Action Button (state-dependent).

---

## 2. Screen-by-Screen State Contracts

### Screen 1: Home & Subject Selection
* **UI Components:**
  * Welcome Banner: Friendly rural STEM illustration + Local session status (`"Single local learner session"`).
  * Four Subject Cards:
    1. *Mathematics:* Water Share Challenge (Icon: Water Droplet / Tank; Subtitle: "Solve fair irrigation sharing").
    2. *Biology:* Food Web Explorer (Icon: Leaf & Frog; Subtitle: "Discover who eats whom on the farm").
    3. *Chemistry:* pH Color Lab (Icon: Test Tube & Turmeric; Subtitle: "Test acids, bases & water safety").
    4. *Physics:* Sound Detective (Icon: Tuning Fork / Soundwave; Subtitle: "Hear and see sound frequency").
  * Global Progress Counter: `"Completed: X / 4 Missions"`.
* **Interaction Contract:**
  * Clicking any card sets `activeSubject = id` and transitions to `Screen 2: Mission Introduction` at Step 1.

---

### Screen 2: Mission Introduction (Step 1 of 7)
* **Contract:**
  * Displays: Subject Title, Real-world Rural Context Paragraph, Learning Goals (2 bullet points), Estimated Time (`~5-8 mins`).
  * CTA Button: `[ Start Mission (Predict) ]`.
  * Keyboard: `Enter` or `Space` on CTA triggers Step 2.

---

### Screen 3: Prediction Question (Step 2 of 7)
* **Contract:**
  * Header: `"Make Your Prediction (No wrong guesses!)"`.
  * Context Prompt: Scenario question.
  * Options: 3 mutually exclusive radio cards.
  * State:
    * Before selection: CTA `[ Submit Prediction ]` is disabled (`aria-disabled="true"`).
    * Upon selection: Selected radio highlights in accent color. CTA is enabled.
  * Submission:
    * Records prediction in local state `session.prediction = selectedOptionId`.
    * Reveals non-judgmental prompt: `"Hypothesis recorded! Let's test it in the lab."`
    * Auto-advances or activates CTA `[ Enter Lab -> ]`.

---

### Screen 4: Interactive Activity / Micro-Lab (Step 3 of 7)
* **Contract by Subject:**
  * **Math (Water Share):**
    * Display: Visual water tank with capacity = 12 units. 3 farmer plot containers (A, B, C).
    * Controls: Plus/minus steppers or sliders for Plot A, Plot B, Plot C.
    * Real-time Invariant Display: `Total Allocated: Current / 12 units`. If `Current > 12`, displays amber warning: `"Tank exceeded by X units"`.
    * Target Indicator: `"Target Ratio: 1 : 2 : 3"`.
    * Verify Button: `[ Test My Distribution ]`. Checks both sum invariant (`sum == 12`) and ratio correctness ($A=2, B=4, C=6$). Any allocation that sums to 12 but violates the ratio (e.g. $A=1, B=5, C=6$) strictly fails validation with targeted feedback that Plot B must be twice Plot A and Plot C must be three times Plot A.
  * **Biology (Food Web):**
    * Display: 2D Canvas or SVG Node Graph. Organisms: Sun, Grass, Grasshopper, Frog, Snake, Hawk, Grain, Field Mouse, Owl.
    * Explicit Arrows: Labeled with energy flow direction (`->`).
    * Interactive Toggle Controls: `[ Drought Mode ]`, `[ Remove Snake ]`, `[ Restore Balance ]`.
    * Observation Panel: Dynamic textual status list (`"Frogs: Overpopulated (Snakes absent)"`, `"Grasshoppers: Declining (Eaten by frogs)"`).
    * Accessibility: Complete collapsible table listing all predator-prey relationships.
  * **Chemistry (pH Color Lab):**
    * Display: 4 labeled test beakers: Lemon Juice (illustrative pH ~2.2), Distilled Water (pH 7.0 Reference), Baking Soda Solution (illustrative pH ~8.5), Laundry Soap Solution (illustrative pH ~10.0).
    * Indicator Selector: Natural Turmeric Paper or Universal Indicator Paper.
    * Interactive Action: Drag-and-drop indicator strip into a beaker or click `[ Dip Indicator ]`.
    * Visual Output: Indicator strip undergoes realistic CSS color shift (Natural Turmeric Paper: Yellow in acid/neutral $\rightarrow$ Deep Reddish-Brown in base. Universal Indicator Paper: Red in acid $\rightarrow$ Green at neutral $\rightarrow$ Blue/Purple in base).
    * Metric Display: pH scale indicator bar slides to matching numerical value ($0-14$) with text category badges (`Acidic`, `Neutral`, `Basic / Alkaline`).
    * Mandatory Notice Banner: *"Notice: Educational simulation. A pH test does not detect pathogens (bacteria, viruses, or protozoa) or toxic dissolved chemicals, and a reading of pH 7.0 does not establish water potability or biological safety."*
  * **Physics (Sound Detective):**
    * Display: Real-time HTML5 Canvas showing 60 FPS sine wave target.
    * Controls:
      * Frequency Slider: $100\text{ Hz} - 1000\text{ Hz}$ (Snap presets for $220\text{ Hz}$ and $440\text{ Hz}$).
      * Amplitude Slider: $10\% - 100\%$ (Initial conservative default: 20%–30%).
      * Playback Button: `[ 🔊 Play Tone ]` / `[ ⏹ Stop ]`. Generates sine tone using Web Audio API `OscillatorNode` (strictly user-initiated; gain clamped to -3 dBFS as digital software headroom ceiling).
      * Optional Microphone Toggle: `[ 🎙 Listen to External Sound ]`. If user clicks, browser requests mic permission. If denied, gracefully falls back to `"Mic unavailable; use synthetic generator"`.
    * Visual Waveform Invariants: Increasing frequency visibly compresses horizontal wavelength (at 220 Hz displays 2.2 wave cycles over 10 ms; at 440 Hz displays 4.4 wave cycles, demonstrating exact 2x horizontal compression); increasing amplitude visibly increases vertical wave height.

---

### Screen 5: Concept Explanation (Step 4 of 7)
* **Contract:**
  * Displays a side-by-side comparison:
    * Left Box: `"What You Predicted"` vs. `"What Happened in the Lab"`.
  * Core Concept Cards: Two bite-sized cards explaining the governing scientific laws with clear diagrams.
  * Key Takeaway Bullet: Highlighted summary box.
  * Action CTA: `[ Check Understanding -> ]`.

---

### Screen 6: Feedback & Targeted Retry (Step 5 of 7)
* **Contract:**
  * Diagnostic Check Question: Evaluates the specific misconception identified in the research dossier.
  * Evaluation:
    * If Correct on First Try: Displays Green celebratory banner with positive reinforcement explaining *why* it is correct. Advances to Step 6.
    * If Incorrect: Displays Amber scaffolding panel with targeted hint (no negative penalty). Provides immediate `[ Try Again ]` button with a slightly altered numerical or situational challenge.

---

### Screen 7: Exit Check & Summative Transfer (Step 6 of 7)
* **Contract:**
  * Summative Transfer Problem: A new real-world scenario applying the same principle.
  * Options: 3 Multiple Choice Options.
  * State: Immutable once submitted; provides immediate explanatory answer key.
  * Action CTA: `[ View Mission Results ]`.

---

### Screen 8: Mission Result & Badge Earned (Step 7 of 7)
* **Contract:**
  * Visual Trophy / Badge: Vector badge illustration for the subject (e.g. *Dhwani Shikari* for Sound).
  * Summary Metrics: Steps completed ($7/7$), Predictions tested ($1/1$), Concept checks mastered.
  * Action Buttons:
    * `[ ↺ Replay Lab / Explore More ]` (resets interactive state for free exploration).
    * `[ Next Subject Mission -> ]` (navigates back to Subject Selection or auto-suggests next subject).

---

## 3. Failure, Reset & Edge-Case State Contracts

| State Scenario | Trigger Condition | System Behavior & User Contract |
| :--- | :--- | :--- |
| **AudioContext Autoplay Blocked** | Browser blocks audio before user interaction. | Display an explicit tap-to-play button: `"Tap anywhere to enable sound"`. Resume `AudioContext` only on direct user click/touch. |
| **Microphone Permission Denied** | User clicks "Block" on browser mic prompt. | Show friendly non-blocking toast: `"Microphone access declined. You can still explore sound completely using the built-in tone generator!"` Never disable or stall the mission. |
| **Invalid Math Allocation** | User allocates amounts summing to $\ne 12$. | Verification button displays informative toast: `"Current allocation equals X. Please adjust so the sum equals 12."` Prevents advancing until invariant is satisfied. |
| **Network Loss / Airplane Mode** | Device goes offline during session. | Top bar offline pill illuminates green: `"Running Offline (Cached)"`. Zero disruption to learning flow. |
| **Activity Hard Reset** | User clicks `[ ↺ Reset ]` in top bar. | Display confirmation modal: `"Reset current lab inputs to starting positions?"` On confirm, resets sliders/beakers to default without wiping previous completed subject badges. |
