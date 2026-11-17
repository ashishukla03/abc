# Product Requirements Document (PRD) — Gramin PocketLab

**Document ID:** SPEC-PRD-V2  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Event:** STEM for Impact 2026 (Presidency University, Bengaluru)  
**Status:** Pre-Event Specification (Locked for Review; Zero Code Implementation)  
**Supersedes:** Older Single-Subject Sound Detective Specifications  

---

## 1. Executive Summary & Vision

Gramin PocketLab is a unified, browser-based, offline-first STEM micro-learning application specifically architected for middle school learners (Grades 6–8) in rural and underserved Indian government schools. 

Rather than deploying four disjointed applications, Gramin PocketLab delivers **one coherent learning experience** spanning four foundational STEM disciplines:
1. **Mathematics:** Water Share Challenge (Ratios and Proportional Division)
2. **Biology:** Food Web Explorer (Ecological Trophic Relationships & Trophic Cascades)
3. **Chemistry:** pH Color Lab (Acids, Bases, Indicators & Safe Water Testing Boundaries)
4. **Physics:** Sound Detective (Acoustics: Frequency, Pitch, and Amplitude Differentiation)

The product is purpose-built to operate seamlessly on budget Android smartphones (2GB RAM, Android 8+), require **zero continuous internet connectivity** after initial caching, feature zero server-side/cloud API dependencies, collect zero personally identifiable information (PII), and align directly with India's National Education Policy (NEP 2020) and NCERT curricular standards.

---

## 2. Target Learner & Context Profile

* **Target Cohort:** School students aged 11–14 (Grades 6–8).
* **Language & Cognitive Level:** First-generation or bilingual digital learners. Proficient in simple regional languages (Hindi, Kannada, etc.) and introductory English. Concepts must be communicated with visual, interactive models and bite-sized text rather than abstract formulas.
* **Device Access Reality:** 
  * Primary hardware: Entry-level Android smartphones (e.g., Redmi 9A/Realme C-series, 2GB–3RAM, 720p display).
  * Time availability: 30–45 minutes in the evening when parents return home from work; frequent device sharing among siblings.
* **Connectivity Reality:** 2G / fluctuating 3G cellular network; frequent dropouts; zero school campus Wi-Fi.

---

## 3. Pedagogical Architecture: The Canonical Mission Flow

To establish cognitive predictability across diverse subjects, all four missions adhere strictly to the **7-Step Experiential Inquiry Lifecycle**:

```
[ Step 1: Mission Intro ]
            │
            ▼
[ Step 2: Prediction ]  ---> Formative Hypothesis (No penalty for incorrect guesses)
            │
            ▼
[ Step 3: Interactive Explore ]  ---> Manipulate Variables & Observe System Dynamics
            │
            ▼
[ Step 4: Concept Explanation ] ---> Structured Synthesis & Misconception Clarification
            │
            ▼
[ Step 5: Feedback & Retry ] ---> Targeted Diagnostic Challenge on Errors
            │
            ▼
[ Step 6: Exit Check ] ---> Summative Transfer Assessment
            │
            ▼
[ Step 7: Mission Result ] ---> Local Mastery Badge & Transparent Summary
```

1. **Mission Intro:** Ground the topic in a familiar rural scenario (e.g. dividing village irrigation water, owl-grain field ecology, well-water turmeric testing, bird-call acoustics).
2. **Predict:** Present a low-stakes, multiple-choice hypothesis question before any interaction. Builds active retrieval anticipation.
3. **Explore:** A hands-on, touch-friendly interactive micro-lab with dynamic visual/audio feedback.
4. **Explain:** Concise, age-appropriate conceptual synthesis bridging the learner's observation to scientific principles.
5. **Feedback & Retry:** Targeted feedback addressing common cognitive misconceptions; allows immediate re-attempt if the hypothesis or interim check was incorrect.
6. **Exit Check:** A final application/transfer question testing whether the learner can apply the concept to a new scenario.
7. **Mission Result:** Transparent breakdown of completed steps, earned local badge, and option to review or select another mission.

---

## 4. End-to-End Learner Journey (By Subject)

### 4.1 Mathematics — Water Share Challenge (Ratios & Proportions)
* **Curricular Link:** NCERT Class 6 Chapter 12 & Class 7 Chapter 8 (Ratio and Proportion).
* **Narrative:** Three community farming plots share a limited water tank (12,000 liters or 12 units). How do we divide water fairly when plots have different crop needs in a ratio of $1:2:3$?
* **User Journey:**
  1. *Intro:* Tank capacity is 12 units. Farmers A, B, and C need water in ratio $1:2:3$.
  2. *Predict:* "If Farmer A gets 2 units, how many units should Farmer C get?" (Predict options: 4 units, 6 units, 3 units).
  3. *Explore:* Slider or stepper controls allowing the learner to allocate units. Real-time visual water bars fill up. An invariant check dynamically warns: `"Allocated: X / 12 units"`. The system enforces or guides allocation to match parts ($1+2+3 = 6$ total parts; $12 / 6 = 2$ units per part $\rightarrow$ $2, 4, 6$).
  4. *Explain:* Ratio means proportional parts. A ratio of $1:2:3$ means total parts = 6. Each part = $12 \div 6 = 2$. Therefore, shares are $1 \times 2 = 2$, $2 \times 2 = 4$, and $3 \times 2 = 6$.
  5. *Feedback/Retry:* If learner allocated $3:4:5$ (adding to 12 but not matching ratio), system explains: `"3:4:5 equals 12, but Farmer B does not have twice as much as Farmer A."`
  6. *Exit Check:* "Divide 20 liters among two goats in ratio $1:3$. How much does the second goat get?" (Options: 5 L, 10 L, 15 L). Correct: 15 L.
  7. *Result:* Mastery badge: *Jal Mitr (Water Guardian)*.

### 4.2 Biology — Food Web Explorer (Ecosystem Relationships)
* **Curricular Link:** NCERT Class 7 Chapter 18 & Class 8 Science (Conservation of Plants and Animals).
* **Narrative:** In a village farmland ecosystem: Grass $\rightarrow$ Grasshoppers $\rightarrow$ Frogs $\rightarrow$ Snakes $\rightarrow$ Hawks. Owls also eat field mice that eat grain.
* **User Journey:**
  1. *Intro:* Discover who eats whom in our farm ecosystem. Energy flows from plants to herbivores to predators.
  2. *Predict:* "What happens to the grasshopper population if snakes are removed from the farm?" (Options: Grasshoppers increase, Grasshoppers decrease, No change).
  3. *Explore:* An interactive 2D node-link graph with explicit arrow directions (labeled `"Energy flows to"` or `"Eaten by"`). Includes a full text equivalent for accessibility. The learner can toggle the presence of a species (e.g. "Simulate Drought" or "Remove Predator"). Nodes visually pulse or show qualitative indicators: `"Thriving"`, `"Declining"`, or `"Overpopulated"`.
  4. *Explain:* Removal of apex predators creates trophic cascades: without snakes, frog populations surge, causing grasshopper numbers to drop drastically, which then allows grass to recover.
  5. *Feedback/Retry:* Explains indirect effects vs. direct effects.
  6. *Exit Check:* "If grain production increases by 50%, which animal population is likely to expand first?" (Options: Field Mice, Hawks, Snakes). Correct: Field Mice.
  7. *Result:* Mastery badge: *Prakriti Rakshak (Eco Guardian)*.

### 4.3 Chemistry — pH Color Lab (Acids, Bases & Indicators)
* **Curricular Link:** NCERT Class 7 Science Chapter 5 (Acids, Bases and Salts — curriculum-aligned working draft; pending edition check).
* **Narrative:** Test household substances (Lemon Juice [pH ~2.2], Distilled Water [pH 7.0 reference], Baking Soda Solution [pH ~8.5], Laundry Soap Solution [pH ~10.0]) using natural turmeric paper and Universal Indicator paper.
* **User Journey:**
  1. *Intro:* Understand the pH spectrum: acidic ($<7$), neutral ($=7.0$ under standard room conditions), and basic / alkaline ($>7$).
  2. *Predict:* "Turmeric is a natural yellow indicator. When you rub yellow turmeric paste onto basic laundry soap, what color does it turn?" (Options: Bright Blue, Reddish-Brown [CORRECT], Remains Yellow).
  3. *Explore:* Interactive virtual beakers with 4 liquids (Lemon Juice, Distilled Water, Baking Soda, Soap). Learner dips virtual indicator paper (`[ Natural Turmeric Paper ]` or `[ Universal Indicator Paper ]`). Visual indicator strip updates color dynamically (Turmeric turns reddish-brown in basic solutions and stays yellow in acid/neutral; Universal Indicator displays corresponding multi-color scale). A clear numerical pH scale ($0$ to $14$) highlights: pH 2.2 (Acidic), pH 7.0 (Neutral), pH 8.5 (Mild Basic), pH 10.0 (Basic).
  4. *Explain:* Acids have excess hydrogen ions ($H^+$); bases have excess hydroxide ions ($OH^-$). Indicators are chemical detectors that change color at specific thresholds.
  5. *Scientific Boundary Caveat:* The UI displays an explicit permanent disclaimer: *"Notice: Educational simulation. A pH test does not detect pathogens (bacteria, viruses, or protozoa) or toxic dissolved chemicals, and a reading of pH 7.0 does NOT prove water is biologically safe to drink."*
  6. *Feedback/Retry:* Formative diagnosis on acidity/alkalinity and water safety misconceptions, offering retry on acidic threshold (vinegar at pH 3).
  7. *Exit Check:* Exit checks test water testing boundaries (pH 7 does not guarantee safety from pathogens or dissolved toxins) and identification of alkaline values (pH 11 is basic).
  8. *Result:* Mastery badge: *Rasayan Parikshak (Chemistry Scout)*.

### 4.4 Physics — Sound Detective (Acoustics: Frequency vs. Amplitude)
* **Curricular Link:** NCERT Class 8 Science Chapter 13 (Sound).
* **Narrative:** Explore the nature of sound by generating and analyzing acoustic waves. Flagship interactive demonstration.
* **User Journey:**
  1. *Intro:* Discover what makes sounds high-pitched like a flute or deep like a dholak drum, and what makes sounds loud or quiet.
  2. *Predict:* "If we double the frequency of a tone from 220 Hz to 440 Hz, what changes?" (Options: Pitch gets higher, Sound gets louder, Sound travels faster).
  3. *Explore:* 
     * Interactive Frequency Slider ($100\text{ Hz} - 1000\text{ Hz}$) with presets: $220\text{ Hz}$ and $440\text{ Hz}$.
     * Interactive Amplitude Slider ($0\% - 100\%$).
     * Real-time Canvas Waveform: Visualizes sine wave. Adjusting frequency changes wave compression (wavelength); adjusting amplitude changes peak-to-trough wave height.
     * Web Audio Tone Generator: Plays clean, synthetic sine wave upon user button press.
     * Optional Permission-Gated Mic Input: If granted, displays real-time live input audio waveform or pitch estimate. If denied or unprompted, fallback audio generator works 100% identically.
  4. *Explain:* Frequency (Hz) determines **Pitch** (how shrill or deep). Amplitude determines **Loudness** (volume). They are completely independent physical properties!
  5. *Feedback/Retry:* Addresses the common misconception that louder sounds have higher frequency.
  6. *Exit Check:* "A mosquito's buzz has a higher pitch than a lion's roar, but the roar is louder. Which sound has higher amplitude?" (Options: Lion's roar, Mosquito's buzz, Both are equal). Correct: Lion's roar.
  7. *Result:* Mastery badge: *Dhwani Shikari (Sound Detective)*.

---

## 5. Scope Boundaries: MVP Inclusions vs. Exclusions

### 5.1 Strictly INCLUDED in MVP
* Single-page Progressive Web App (PWA) container loading all four subject missions.
* Shared navigation bar, subject switcher, and mission progress stepper.
* Full 7-step pedagogical cycle implemented for all four subjects.
* Synthetic Web Audio tone generation ($220\text{ Hz}$, $440\text{ Hz}$, and variable range).
* Interactive 2D Canvas visualizations for all four micro-labs.
* Offline execution capability via ServiceWorker and CacheStorage after successful initial load and asset caching on the device.
* Local state management via `localStorage` supporting a single anonymous learner session under `pocketlab_progress` (multi-child profile switcher UI deferred to post-MVP).
* Full keyboard navigability, WCAG 2.1 AA color contrast, and reduced-motion mode toggle.
* Explicit scientific safety boundary notes on pH testing and sound calibration.

### 5.2 Strictly EXCLUDED from MVP (Non-Goals)
* ❌ Native ARCore, WebXR, or 3D WebGL scenes (prevents thermal throttling and crashes on budget devices).
* ❌ Backend databases, cloud synchronization, or student user account logins.
* ❌ External AI APIs (OpenAI, Gemini, Bhashini cloud calls) during runtime.
* ❌ Collection or transmission of student PII (names, emails, phone numbers, GPS coordinates).
* ❌ Audio recording storage or audio file transmission to servers.
* ❌ Video streaming or heavy uncompressed asset bundles (> 10MB total).
* ❌ Arbitrary competitive public leaderboards.

---

## 6. Acceptance Criteria & Definition of Done (DoD)

### Definition of Done:
1. **Zero External Runtime Requests:** App functions identically when device is set to Airplane Mode after first load.
2. **Deterministic State Transitions:** Learner can navigate back, reset an experiment, or jump between subjects without unhandled exceptions or state leaks.
3. **Verified Mathematical & Scientific Invariants:** Total water allocation never displays inconsistent arithmetic; pH scale accurately maps acid/neutral/base; acoustic waveforms visually match generated frequencies.
4. **Accessible Fallbacks:** Screen reader tags, text transcripts for food webs, and touch-target minimums ($48 \times 48\text{ px}$) are 100% met.
5. **Clean Lighthouse Audit:** Performance score $\ge 90$, Accessibility score $\ge 95$ on simulated Moto G4 / low-tier mobile profiles.
