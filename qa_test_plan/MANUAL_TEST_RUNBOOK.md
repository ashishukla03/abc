# MANUAL TEST RUNBOOK — GRAMIN POCKETLAB

**Document ID:** QA-RUNBOOK-MANUAL-V2  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Event:** STEM for Impact 2026, Presidency University, Bengaluru  
**Role:** Independent QA Engineer & Accessibility Tester  
**Testing Policy:** Real hardware execution. Every test step has an observable expected behavior. Actual results remain blank until physical run.  

---

## 1. Test Setup & Equipment Requirements

* **Primary Test Devices:**
  * Device 1: Physical Budget Android Smartphone (e.g. Redmi 9A / Realme C-series, 2GB–3GB RAM, Chrome for Android).
  * Device 2: Standard Android / iOS Smartphone (390px viewport).
  * Device 3: Laptop running Chrome DevTools (for responsive emulation, network throttling, and console inspection).
* **Network Environments:**
  1. Venue Wi-Fi / Hotspot (Initial Load & Cache Storage).
  2. Complete Airplane Mode (Offline verification).
* **Audio Setup:** Device speaker and external wired 3.5mm/USB-C earphones (to test software gain clamping, volume attenuation, user-initiated audio, and physical speaker output).
  * *Important Safety Note:* Software gain clamping to -3 dBFS (0.70 linear scale) acts as a digital headroom ceiling to avoid digital clipping distortion on phone DACs. It does NOT guarantee biological hearing safety or prevent physical speaker damage at elevated device master volumes. Conservative default volume (20%–30%), explicit user-initiated playback, persistent stop/mute controls, and a practical actual-device audio playback test plan (testing playback start, user-controlled volume, stop/mute controls, and absence of distortion; without asserting calibrated SPL or guaranteed hearing safety) are mandatory.

---

## 2. Subject-by-Subject Manual Test Procedures

### 2.1 Mathematics — Water Share Challenge

#### Run Procedure MTH-01: Canonical Water Division (12 Units, 1:2:3)
1. **Preconditions:** Navigate to S0 and click `[ Start Investigation ]` on the Mathematics card.
2. **Step S1:** Read scenario. Click `[ Make a Prediction ]`.
3. **Step S2:** Select `6 units` radio. Click `[ Enter Lab ]`.
4. **Step S3:**
   * Observe initial tank: `Allocated: 0 / 12 units`.
   * Tap `[ + ]` on Plot A until `Plot A = 2`.
   * Tap `[ + ]` on Plot B until `Plot B = 4`.
   * Tap `[ + ]` on Plot C until `Plot C = 6`.
   * Observe tank readout: `Allocated: 12 / 12 units`.
   * Click `[ Check Distribution ]`.
5. **Expected Observable Result:**
   * Water level bars fill proportionally (A: 16.7%, B: 33.3%, C: 50.0%).
   * Verification button succeeds; reveals green confirmation: *"Valid distribution! Plot B is double Plot A, and Plot C is triple Plot A."*
   * Action button `[ I Have Observed the Result → ]` enables and advances to S4.
6. **Pass/Fail Criteria:** Pass if allocation $2, 4, 6$ is accepted and transitions to S4 without console errors.

#### Run Procedure MTH-02: Boundary & Misconception Handling (Sum Invariant vs. Ratio Check)
1. **Step S3 (Equal Distribution Check):** Set Plot A = 4, Plot B = 4, Plot C = 4 (sum = 12).
2. **Action:** Click `[ Check Distribution ]`.
3. **Expected Observable Result:** System blocks completion; displays amber diagnostic banner: *"You divided the water equally (4 each). That is a 1 : 1 : 1 ratio. But Plot B needs twice as much as Plot A!"*
4. **Step S3 (Sum Matches Total, Ratio Fails Check):** Set Plot A = 1, Plot B = 5, Plot C = 6 (sum = 12).
5. **Action:** Click `[ Check Distribution ]`.
6. **Expected Observable Result:** System blocks completion; displays amber diagnostic banner: *"Total allocated is 12 units, but the ratio does not match 1 : 2 : 3! Plot B must be twice Plot A (should be 2), and Plot C must be three times Plot A (should be 3). Your distribution: 1, 5, 6."*
7. **Step S3 (Zero/Negative Check):** Tap `[ - ]` on Plot A when it is at 0.
8. **Expected Observable Result:** Plot A remains at 0; value does not decrement to negative numbers.

---

### 2.2 Biology — Food Web Explorer

#### Run Procedure BIO-01: Trophic Cascade Verification
1. **Preconditions:** Navigate to S0 and start Biology mission.
2. **Step S1 & S2:** Complete Intro and Prediction (predicting grasshoppers decrease).
3. **Step S3 (Micro-Lab):**
   * Inspect SVG graph: Verify all arrows point from prey to predator (`Paddy Grass ---> Grasshopper ---> Frog ---> Rat Snake ---> Barn Owl`).
   * Verify legend: `[ Legend: Arrows indicate direction of energy flow ]`.
   * Tap toggle button: `[ Remove Snakes ]`.
4. **Expected Observable Result:**
   * Snake node grays out with tag `[ Absent ]`.
   * Frog node badge pulses and updates to `[ Status: Surging / Overpopulated ]`.
   * Grasshopper node badge updates to `[ Status: Declining ]`.
   * Dynamic observation box reads: *"Notice the chain reaction: without snakes, frog numbers increase, putting intense feeding pressure on grasshoppers."*
   * App displays **no unsupported exact population numbers** (e.g. no fake claims like "exactly 42 frogs left").
5. **Step S3 (Screen Reader Table Check):** Expand `<details>` element below SVG graph.
6. **Expected Observable Result:** Displays clean HTML table listing all 6 species and their trophic roles.

---

### 2.3 Chemistry — pH Color Lab

#### Run Procedure CHM-01: Indicator Reactions & Water Safety Disclaimer
1. **Preconditions:** Navigate to S0 and start Chemistry mission.
2. **Step S1 & S2:** Complete Intro and Prediction (predicting turmeric turns reddish-brown in base).
3. **Step S3 (Micro-Lab):**
   * Inspect screen for permanent safety notice:
     * *Must read:* `"Notice: Educational simulation. A pH test does not detect pathogens (bacteria, viruses, or protozoa) or toxic dissolved chemicals, and a reading of pH 7.0 does not establish water potability or biological safety."`
   * **Universal Indicator Paper Tests (4 combinations):**
     * Select Lemon Juice beaker. Click [ Dip Universal Indicator Paper ].
       * *Observe:* Strip turns Red/Orange; numerical scale highlights illustrative pH 2.2: Acidic; non-color badge displays Acidic (pH 2.2).
     * Select Distilled Water (pH 7.0 Reference) beaker. Click [ Dip Universal Indicator Paper ].
       * *Observe:* Strip turns Green; numerical scale highlights illustrative pH 7.0: Neutral; non-color badge displays Neutral (pH 7.0).
     * Select Baking Soda Solution beaker. Click [ Dip Universal Indicator Paper ].
       * *Observe:* Strip turns Blue-Green; numerical scale highlights illustrative pH 8.5: Basic / Alkaline; non-color badge displays Basic / Alkaline (pH 8.5).
     * Select Soap Solution beaker. Click [ Dip Universal Indicator Paper ].
       * *Observe:* Strip turns Purple/Dark Blue; numerical scale highlights illustrative pH 10.0: Basic / Alkaline; non-color badge displays Basic / Alkaline (pH 10.0).
   * **Natural Turmeric Paper Tests (4 combinations):**
     * Select Lemon Juice beaker. Click [ Dip Natural Turmeric Paper ].
       * *Observe:* Strip remains Yellow (no color change in acidic conditions); non-color badge displays Acidic (No reaction / Yellow).
     * Select Distilled Water (pH 7.0 Reference) beaker. Click [ Dip Natural Turmeric Paper ].
       * *Observe:* Strip remains Yellow (no color change in neutral conditions); non-color badge displays Neutral (No reaction / Yellow).
     * Select Baking Soda Solution beaker. Click [ Dip Natural Turmeric Paper ].
       * *Observe:* Strip turns Reddish-Brown (reacts with weak base); non-color badge displays Basic / Alkaline (Reddish-Brown).
     * Select Soap Solution beaker. Click [ Dip Natural Turmeric Paper ].
       * *Observe:* Strip turns Deep Reddish-Brown (reacts with base); non-color badge displays Basic / Alkaline (Deep Reddish-Brown).
4. **Pass/Fail Criteria:** Pass if all eight indicator/beaker combinations match expected colors and non-color text badges, Baking Soda is consistently calibrated at pH 8.5, and the safety notice disclaimer is permanently visible.

---

### 2.4 Physics — Sound Detective (Flagship Audio)

#### Run Procedure PHY-01: Frequency, Pitch & Autoplay Verification
1. **Preconditions:** Fresh page launch; navigate to Physics mission S3.
2. **Autoplay Check:** Prior to clicking any audio button, verify zero sound is produced by the device speaker (`AudioContext` remains suspended).
3. **Step S3 (Tone Comparison & Waveform Cycle Count):**
   * Tap `[ Play 220 Hz (Low) ]`.
     * *Observe:* Deep, audible tone plays smoothly at initial conservative volume (20%–30%); oscilloscope canvas animates displaying exactly 2.2 complete wave cycles across the 10 ms time axis ($\text{Period } T = 4.545\text{ ms} \implies 10 / 4.545 = 2.2\text{ cycles}$).
   * Tap `[ Play 440 Hz (High) ]`.
     * *Observe:* Pitch audibly rises by exactly one musical octave; oscilloscope canvas visibly compresses horizontally by exactly $2\times$, displaying 4.4 complete wave cycles across the identical 10 ms window ($\text{Period } T = 2.273\text{ ms} \implies 10 / 2.273 = 4.4\text{ cycles}$).
4. **Amplitude Decoupling Check:**
   * Keep frequency at $440\text{ Hz}$.
   * Move amplitude slider from $20\%$ to $90\%$.
   * *Observe:* Sound volume increases; wave height expands vertically; horizontal wave peak spacing remains strictly constant.
5. **Stop Control Check:** Tap `[ ⏹ Stop Tone ]`.
   * *Observe:* Audio ceases instantly; canvas halts live animation.
6. **Optional Microphone Denial Check:**
   * Tap `[ 🎙 Test Microphone ]`.
   * When browser prompts for permission, tap **"Block"** or **"Deny"**.
   * *Observe:* Non-blocking toast appears: *"Microphone optional. Generator active."* The screen does not freeze, no uncaught error appears in the console, and the student can proceed through the entire lesson.
