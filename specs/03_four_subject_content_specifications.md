# Four Subject Content Specifications — Gramin PocketLab

**Document ID:** SPEC-CONTENT-V2  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Status:** Pre-Event Specification  

---

## 1. Subject 1: Mathematics — Water Share Challenge (Ratios & Proportions)

### 1.1 Curricular & Cognitive Foundations
* **Target Grade:** Grades 6–7 (NCERT Mathematics Chapter 12: Ratio & Proportion).
* **Core Concept:** A ratio represents relative proportional parts of a whole, not absolute quantities. Dividing a total $T$ in ratio $a:b:c$ requires finding the unit part $U = \frac{T}{a+b+c}$ and allocating $a \times U, b \times U, c \times U$.
* **Context & Storyline:** Three farming plots (Plot A: Small Vegetable Bed, Plot B: Millet Field, Plot C: Fruit Orchard) share a 12,000-liter community storage tank (represented as 12 units). Their water requirements follow a strict ratio of $1 : 2 : 3$.

### 1.2 Step-by-Step Content & Assessment Keys

* **Prediction Question:**
  * *Prompt:* "If the total water is 12 units and the ratio needed is 1 : 2 : 3, how many units of water should Plot C (the fruit orchard) receive?"
  * *Option 1:* 3 units
  * *Option 2:* 6 units [CORRECT]
  * *Option 3:* 4 units
  * *Explanation:* Plot C has 3 parts out of $1+2+3=6$ total parts. Half the total water goes to Plot C ($12 \times \frac{3}{6} = 6$).

* **Interactive Lab Invariants & Bounds:**
  * Variable Inputs: `allocA` ($0-T$, integer), `allocB` ($0-T$, integer), `allocC` ($0-T$, integer), bounded by the active capacity ($T = 12$ in State 1; $T = 24$ in State 2).
  * System Invariants: Total sum = $allocA + allocB + allocC$. Target = $T$ units.
  * Correct Configuration (State 1): $allocA = 2$, $allocB = 4$, $allocC = 6$.

* **Misconceptions & Targeted Feedback:**
  * *Misconception A (Additive Equipartition):* Learner allocates $4, 4, 4$.  
    *Feedback:* "You divided the water equally (4 each), but Plot B needs twice as much as Plot A, and Plot C needs three times as much!"
  * *Misconception B (Raw Ratio Numbers):* Learner allocates $1, 2, 3$ (summing to 6, leaving 6 units unused).  
    *Feedback:* "1 + 2 + 3 uses only 6 units! The full 12 units must be shared. Multiply each part by 2."
  * *Misconception C (Arbitrary Sum / Incomplete Ratio):* Learner allocates $1, 5, 6$ or $3, 4, 5$ (summing to 12).  
    *Feedback:* "The sum is 12, but the ratio does not match 1 : 2 : 3! Both conditions must be met: sum = 12 AND Plot B = 2 × Plot A, Plot C = 3 × Plot A. For allocation 1, 5, 6: Plot B (5) is not double Plot A (1)."

* **Retry Question:**
  * *Prompt:* "A fresh 18-unit tank must be split among Plots A and B in ratio 1 : 2. How much does Plot B get?"
  * *Options:* A) 6 units | B) 12 units [CORRECT] | C) 9 units.

* **Exit Check (Transfer Problem):**
  * *Prompt:* "A school prepares 15 liters of herbal fertiliser by mixing water and cow dung extract in a ratio of 4 : 1. How many liters of water are used?"
  * *Options:* A) 10 L | B) 12 L [CORRECT] | C) 3 L.
  * *Answer Key:* Total parts = $4 + 1 = 5$. Each part = $15 \div 5 = 3\text{ L}$. Water = $4 \times 3\text{ L} = 12\text{ L}$.

---

## 2. Subject 2: Biology — Food Web Explorer (Ecosystem Relationships)

### 2.1 Curricular & Cognitive Foundations
* **Target Grade:** Grades 7–8 (NCERT Science Chapter: Our Environment / Living Organisms).
* **Core Concept:** Food chains connect into complex webs. Organisms depend on each other directly (predator-prey) and indirectly through trophic cascades. Arrows in food webs indicate the direction of energy transfer from organism eaten to the consumer.
* **Context & Storyline:** A village agricultural ecosystem comprising Crops/Grass (Producers), Grasshoppers and Field Mice (Primary Consumers), Frogs and Owls (Secondary Consumers), and Snakes (Tertiary Predators).

### 2.2 Step-by-Step Content & Assessment Keys

* **Prediction Question:**
  * *Prompt:* "In our village field, what is most likely to happen to the grasshopper population if snakes are removed from the area?"
  * *Option 1:* Grasshopper population decreases [CORRECT]
  * *Option 2:* Grasshopper population increases
  * *Option 3:* Grasshopper population remains exactly unchanged
  * *Explanation:* When snakes are removed, frog numbers increase because nothing eats them. More frogs eat more grasshoppers, causing grasshoppers to decline!

* **Interactive Lab Invariants & Bounds:**
  * Qualitative States per Node: `Thriving`, `Normal`, `Declining`, `Absent`.
  * Actions: `[ Remove Snakes ]`, `[ Introduce Pesticide (Drops Grasshoppers) ]`, `[ Drought (Drops Producers) ]`, `[ Reset Ecosystem ]`.
  * Display: Explicit arrowheads labeled `"Energy flows to ->"`. Collapsible table providing full text accessibility for screen readers.

* **Misconceptions & Targeted Feedback:**
  * *Misconception A (Linear Thinking):* Believing removing snakes only affects animals directly eaten by snakes (frogs).  
    *Feedback:* "Notice the cascade! Without snakes, frogs multiply rapidly, which in turn reduces the grasshopper population even though snakes don't eat grasshoppers."
  * *Misconception B (Arrow Reversal):* Thinking arrows point to what is eaten.  
    *Feedback:* "In food webs, arrows always point in the direction of energy flow (from the food into the eater's stomach)."

* **Retry Question:**
  * *Prompt:* "If farmers spray pesticide that eliminates field mice, which animal will face a food shortage?"
  * *Options:* A) Grasshoppers | B) Owls [CORRECT] | C) Frogs.

* **Exit Check (Transfer Problem):**
  * *Prompt:* "In a pond ecosystem: Algae $\rightarrow$ Water Fleas $\rightarrow$ Small Fish $\rightarrow$ Kingfisher birds. If overfishing removes the small fish, what will happen to the algae?"
  * *Options:* A) Algae will decrease [CORRECT] | B) Algae will explode uncontrollably | C) Algae will be unaffected.
  * *Answer Key:* Removing small fish causes water fleas to multiply; more water fleas consume more algae, causing algae to decrease.

---

## 3. Subject 3: Chemistry — pH Color Lab (Acids, Bases & Indicators)

### 3.1 Curricular & Cognitive Foundations
* **Target Grade:** Grade 7 (NCERT Science Chapter 5: Acids, Bases and Salts — curriculum-aligned working draft; pending edition verification against current NCERT Rationalised textbooks).
* **Core Concept:** The pH scale measures hydrogen ion concentration from 0 (strongly acidic) to 14 (strongly basic), with 7 being neutral. Natural and synthetic indicators change color at distinct chemical thresholds.
* **Context & Storyline:** A village health and farm water-testing camp testing common substances: Lemon Juice (pH ~2.2), Distilled Water (pH 7.0 Reference), Baking Soda Solution (pH ~8.5), and Laundry Soap Solution (pH ~10.0).

### 3.2 Step-by-Step Content & Assessment Keys

* **Prediction Question:**
  * *Prompt:* "Turmeric is a natural yellow indicator. When fresh turmeric paste is rubbed onto a spot of laundry soap (a base), what color does it turn?"
  * *Option 1:* Remains bright yellow
  * *Option 2:* Turns reddish-brown [CORRECT]
  * *Option 3:* Turns dark green
  * *Explanation:* Turmeric contains curcumin, which remains yellow in acidic and neutral substances but reacts with basic substances (like alkaline soap) to turn reddish-brown.

* **Interactive Lab Invariants & Bounds:**
  * Test Solutions (4 Beakers): Lemon Juice (pH ~2.2), Distilled Water (pH 7.0 Reference), Baking Soda Solution (pH ~8.5), Soap Solution (pH ~10.0). All values are illustrative educational approximations.
  * Indicators: Natural Turmeric Paper Strip (turns reddish-brown in base; yellow in acid/neutral), Universal Indicator Paper (standard multi-color gradient across 0–14).
  * Visual Display: Scale sliding from 0 to 14 with explicit labels: $0-6$ Acidic, $7$ Neutral, $8-14$ Basic / Alkaline.
  * Mandatory Scientific Boundary Notice:  
    `"Notice: Educational simulation. A pH test does not detect pathogens (bacteria, viruses, or protozoa) or toxic dissolved chemicals, and a reading of pH 7.0 does NOT establish water potability or biological safety."`

* **Misconceptions & Targeted Feedback:**
  * *Misconception A (Neutral = Drinkable):* Believing pH 7 guarantees safety.  
    *Feedback:* "A pH reading only measures chemical hydrogen ion activity; it does not test for biological pathogens (bacteria, viruses, protozoa) or toxic dissolved chemicals. Testing for microbiological pathogens and chemical safety requires dedicated assays separate from pH; boiling disinfects pathogens but does not eliminate chemical or heavy metal contaminants. Never drink untreated water just because it tests neutral!"
  * *Misconception B (Acid Strength):* Thinking pH 6 is more acidic than pH 2.  
    *Feedback:* "Lower pH means stronger acid! A substance with pH 2 has 10,000 times more free hydrogen ions than one with pH 6."

* **Retry Question:**
  * *Prompt:* "A sample of vinegar has a pH of 3. Is vinegar an acid, neutral, or a base?"
  * *Options:* A) Acid [CORRECT] | B) Neutral | C) Base.

* **Exit Check Questions:**
  * *Question 1:* "A health worker finds well water has a pH of 7.0. Does this test alone guarantee the water is safe from bacteria?"
    * Options: A) Yes, total purity guaranteed | B) No, a pH test cannot determine pathogen or chemical safety [CORRECT] | C) Yes, only if cold.
    * Explanation: A pH reading only measures chemical hydrogen ion activity; it does not test for biological pathogens or dissolved toxins and does not establish water potability.
  * *Question 2:* "Which of these pH values represents a basic / alkaline solution?"
    * Options: A) pH 2 | B) pH 7 | C) pH 11 [CORRECT].
    * Explanation: Values above 7 are basic/alkaline. Therefore, pH 11 represents a basic / alkaline solution.

---

## 4. Subject 4: Physics — Sound Detective (Frequency, Pitch & Amplitude)

### 4.1 Curricular & Cognitive Foundations
* **Target Grade:** Grade 8 (NCERT Science Chapter 13: Sound).
* **Core Concept:** Sound waves have two primary, independent physical parameters: Frequency (measured in Hertz, determines perceived Pitch) and Amplitude (wave height, determines perceived Loudness). Doubling frequency doubles pitch (one octave higher) without changing loudness.
* **Context & Storyline:** Sound engineering station analyzing musical instruments: comparing the high shrill whistle of a bamboo flute with the deep rumble of a temple drum.

### 4.2 Step-by-Step Content & Assessment Keys

* **Prediction Question:**
  * *Prompt:* "If an instrument increases its vibration frequency from 220 Hz to 440 Hz, what happens to the sound you hear?"
  * *Option 1:* The pitch sounds higher (shrill) [CORRECT]
  * *Option 2:* The sound automatically becomes louder
  * *Option 3:* The sound travels through the air twice as fast
  * *Explanation:* Frequency governs Pitch. 440 Hz is exactly one musical octave higher than 220 Hz. Speed of sound in air is constant (~343 m/s), and loudness depends solely on wave amplitude.

* **Interactive Lab Invariants & Bounds:**
  * Tone Generator: Web Audio API `OscillatorNode` (`sine` waveform).
  * Frequency Slider: $100\text{ Hz} - 1000\text{ Hz}$ (Presets: $220\text{ Hz}$, $440\text{ Hz}$).
  * Amplitude Slider: $10\% - 100\%$ (controls `GainNode`).
  * Live Canvas Display: Dynamic sine wave rendering $y(x) = A \cdot \sin(2\pi \cdot f \cdot x + \phi)$.
  * Invariant: Adjusting frequency compresses horizontal wave peaks; adjusting amplitude stretches vertical peaks without altering horizontal spacing.
  * Optional Microphone Input: Uses `navigator.mediaDevices.getUserMedia({ audio: true })`. Visualizes real-time time-domain data via `AnalyserNode`. Strictly permission-gated; non-essential for lab completion.

* **Misconceptions & Targeted Feedback:**
  * *Misconception A (Loudness = Pitch):* Thinking a louder sound has higher frequency.  
    *Feedback:* "Notice the wave! Sliding amplitude makes the wave taller (louder), but the number of waves across the screen stays the same (frequency unchanged)."
  * *Misconception B (Pitch alters Speed):* Thinking high pitch travels faster.  
    *Feedback:* "All sounds travel through air at the same speed (~340 m/s). Frequency changes how fast the air vibrates, not how fast the wave moves forward!"

* **Retry Question:**
  * *Prompt:* "Two sound waves have the same height (amplitude), but Wave B has twice as many peaks per second as Wave A. How do they compare?"
  * *Options:* A) Wave B is louder | B) Wave B is higher pitch [CORRECT] | C) Wave B travels faster.

* **Exit Check (Transfer Problem):**
  * *Prompt:* "A bat emits an ultrasonic screech at 40,000 Hz, while a human vocalizes at 200 Hz. The human shout is much louder. Which wave has the larger amplitude?"
  * *Options:* A) The human shout [CORRECT] | B) The bat's screech | C) They have the same amplitude.
  * *Answer Key:* Loudness is dictated by amplitude; because the human shout is louder, its wave has a larger physical amplitude, despite having a much lower frequency.
