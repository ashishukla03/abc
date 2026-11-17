# SCOPE-FREEZE RULES, FALLBACK PATHS & MITIGATION PROTOCOLS

**Document ID:** TEAM-SCOPE-FREEZE-FALLBACKS-V2  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Event:** STEM for Impact 2026, Presidency University, Bengaluru  
**Role:** Integration Coordinator & Risk Officer  
**Objective:** Define strict scope-freeze enforcement rules and pre-engineered fallback paths for delayed modules, hardware failures, and network outages.  

---

## 1. Scope-Freeze Enforcement Rules

During hackathons, late-stage feature additions ("scope creep") are the number one cause of broken submissions and disqualification. Gramin PocketLab enforces **three rigid scope-freeze rules**:

1. **The Hour-12 Module Freeze Rule:**  
   * By **Hour 12:00 (Checkpoint 3)**, all four subject interactive modules must have merged their baseline interactive models into `master`.
   * **Rule:** After Hour 12:00, **zero new interactive features or visual widgets may be added**. Any work on modules after Hour 12:00 is strictly limited to bug fixes and content copy polish.
2. **The "Non-Essential Feature Cut" Trigger:**  
   * If any module owner is behind schedule by more than 60 minutes at Hour 10:00, secondary non-essential features (e.g. custom slider animations, audio harmonic filters, or third test beakers) are **instantly cut**.
3. **The Hour-19 Absolute Code Freeze Rule:**  
   * At **Hour 19:00**, a hard code freeze is declared. Zero git commits to application code are permitted under any circumstances. The remaining 2 hours are reserved exclusively for pitch deck preparation, demo rehearsal, and submission form uploads.

---

## 2. Engineered Fallback Protocols

### 2.1 Fallback if a Subject Module Falls Behind Schedule
If a developer is blocked or delayed during module authoring, the team executes pre-engineered fallback downgrades:

| Module | Primary Scope (Target) | Fallback Downgrade (If Delayed at Hour 10:00) | Minimum Acceptable State |
| :--- | :--- | :--- | :--- |
| **Mathematics** | Dynamic animated water tank filling with 3 fluid container bars. | Downgrade to standard HTML numeric steppers and a static SVG progress bar showing $12\text{ units}$. | Steppers enforce $0–12$ bounds; verifies $2, 4, 6$; displays misconception feedback. |
| **Biology** | Dynamic multi-node SVG graph with animated pulsed energy arrows. | Downgrade to static 6-node SVG diagram with 3 scenario state radio buttons updating a clean text table. | Toggles update trophic status text (`Surging`/`Declining`); table accessible. |
| **Chemistry** | Draggable paper strips animating into virtual liquid beakers. | Downgrade to tap-to-select beaker buttons that immediately update the indicator strip color via CSS classes. | Color shifts between Red, Green, and Reddish-Brown; permanent safety disclaimer visible. |
| **Physics** | Continuous frequency slider with 60 FPS oscilloscope canvas + live microphone visualizer. | **Cut microphone mode completely**. Rely 100% on the two fixed tone buttons (`[ 220 Hz ]` and `[ 440 Hz ]`) and synthetic canvas plotting. | 220 Hz vs. 440 Hz tones play on tap; pitch jump audible; wave cycles visually double. |

---

### 2.2 Demonstration Fallback: Microphone Access Failure or Venue Noise
* **Failure Scenario:** The hackathon auditorium is extremely noisy, or the judge's smartphone blocks microphone permissions.
* **Pre-Engineered Protocol:**
  1. The presenter does not attempt live microphone capture.
  2. The presenter taps `[ Play 220 Hz ]` and `[ Play 440 Hz ]` on the synthetic tone generator.
  3. The presenter states clearly to judges: *"We engineered a progressive enhancement model: while live microphone capture is supported, our primary instruction uses synthetic tone generation so that rural students in noisy homes or with restricted devices never experience a blocked lesson."*
  4. **Outcome:** A potential failure mode is transformed into a highlighted architectural strength!

---

### 2.3 Demonstration Fallback: Venue Wi-Fi Outage or Cellular Throttling
* **Failure Scenario:** Presidency University Wi-Fi network crashes or bandwidth is throttled during judge evaluations.
* **Pre-Engineered Protocol:**
  1. All demonstration smartphones are loaded and verified on venue Wi-Fi during Hour 17:00, ensuring the Service Worker CacheStorage is fully populated.
  2. When approaching the judges' table, the presenter **visibly turns on Airplane Mode** on the phone.
  3. The presenter launches the app from the home screen shortcut or browser tab in Airplane Mode.
  4. The app boots in $<150\text{ ms}$ directly from CacheStorage, displaying the green `"Cached Offline"` status pill.
  5. The entire 4-subject demonstration is executed with zero active internet connectivity.
  6. **Outcome:** Total immunity to venue network crashes, proving genuine offline capability to judges.

