# FOUR-SUBJECT MICRO-LAB CONTENT SPECIFICATION

**Document ID:** CONTENT-SPEC-FOUR-MODULES-V1  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Event:** STEM for Impact 2026, Presidency University, Bengaluru  
**Role:** STEM Curriculum Designer & Formative Assessment Specialist  
**Status:** Implementation-Ready Content Specification (Draft vs. Verified Claims Clearly Distinguished)  

---

## Pedagogical Design Standard & Verification Notice
* **Curriculum Alignment:** Verified against National Council of Educational Research and Training (NCERT) textbooks for Grades 6–8 (Science and Mathematics) and the National Curriculum Framework for School Education (NCF-SE 2023).
* **Research Disclaimer:** *None of these modules have been tested or validated with human students.* Claims regarding pedagogical efficacy are informed hypotheses derived from established cognitive science literature (e.g. Dunlosky et al., 2013; Wisniewski et al., 2020), not empirical validation of this specific application.
* **Localization Notice:** English strings are primary and verified. Kannada translations are marked **[PENDING HUMAN LANGUAGE REVIEW]** until verified by a native Kannada-speaking educator.

---

# Module A — Mathematics: Water Share Challenge

### 1. Grade Band & Prerequisites
* **Grade Band:** Grades 6–7.
* **Curriculum Reference:** NCERT Class 6 Mathematics Chapter 12 (Ratio and Proportion); NCERT Class 7 Mathematics Chapter 8 (Comparing Quantities) (Curriculum-aligned working draft; pending edition verification against current NCERT Rationalised textbooks).
* **Prerequisites:** Basic integer addition, multiplication facts up to 100, and dividing a two-digit integer by a single-digit integer.

### 2. Measurable Learning Objective
* *Objective:* Given a fixed integer total $T$ and a three-part ratio $a : b : c$, the learner will calculate and allocate the proportional shares $a \times U, b \times U, c \times U$ (where $U = \frac{T}{a+b+c}$) such that the sum of the shares exactly equals $T$ and each share satisfies the proportional relationship, answering both (2 out of 2, 100%) exit-check transfer problems correctly.

### 3. Relatable Scenario
* *Context:* A community water storage tank in a village supplies three different crop plots:
  * Plot A (Kitchen Herb Garden) requires 1 part of water.
  * Plot B (Groundnut Patch) requires 2 parts of water.
  * Plot C (Fruit Orchard) requires 3 parts of water.
* *Scenario Disclaimer:* This is a stylized classroom mathematical scenario designed to teach ratio arithmetic, not real-world agronomic irrigation guidance.

### 4. Pre-Activity Prediction Question
* *Prompt Key:* `math.pred.prompt`
  * **English:** "A storage tank holds 12 units of water to be shared among three plots in the ratio 1 : 2 : 3. How many units should the largest plot (Plot C) receive?"
  * **Kannada [PENDING HUMAN LANGUAGE REVIEW]:** "ಒಂದು ನೀರಿನ ತೊಟ್ಟಿಯಲ್ಲಿ 12 ಯೂನಿಟ್ ನೀರಿದ್ದು, ಮೂರು ಜಮೀನುಗಳಿಗೆ 1 : 2 : 3 ಅನುಪಾತದಲ್ಲಿ ಹಂಚಬೇಕಾಗಿದೆ. ಅತಿ ದೊಡ್ಡ ಜಮೀನು (Plot C) ಎಷ್ಟು ಯೂನಿಟ್ ನೀರನ್ನು ಪಡೆಯಬೇಕು?"
* *Options:*
  * A) 3 units [Misconception: Takes raw ratio number]
  * B) 4 units [Misconception: Divides 12 equally by 3]
  * C) 6 units [CORRECT]
* *Explanation:* "Plot C has 3 parts out of $1 + 2 + 3 = 6$ total parts. Since 3 parts is half of the 6 total parts, Plot C gets half of all the water: $12 \div 2 = 6$ units!"

### 5. Interaction States & Target Model
* **Interaction State 1 (Default / Canonical):**
  * Total Capacity $T = 12$ units. Target Ratio = $1 : 2 : 3$.
  * Target Allocation: Plot A = $2$, Plot B = $4$, Plot C = $6$.
* **Interaction State 2 (Scaled / Generalization):**
  * Total Capacity $T = 24$ units. Target Ratio = $1 : 2 : 3$.
  * Target Allocation: Plot A = $4$, Plot B = $8$, Plot C = $12$.
* **Interaction State 3 (Novel Ratio Transfer):**
  * Total Capacity $T = 20$ units. Target Ratio = $1 : 1 : 2$ ($4$ parts; each part $= 5$).
  * Target Allocation: Plot A = $5$, Plot B = $5$, Plot C = $10$.

### 6. Learner Actions & Visual Display Model
* **Learner Changes:** The learner adjusts integer stepper buttons ($[-]$ and $[+]$) or sliders for Plot A, Plot B, and Plot C.
* **Model Displays:**
  * Three vertical or horizontal water level bars that animate proportionally.
  * Real-time Total Water Counter: `"Allocated: [ Current Sum ] / [ Target Total ] units"`.
  * Status Warning Banner:
    * If `Current Sum < Target Total`: `"Tank still has [Difference] units remaining."`
    * If `Current Sum > Target Total`: `"Tank exceeded by [Difference] units! Total must equal [Target]."`
    * If `Current Sum == Target Total` but ratio incorrect: `"Tank is full ([Target Total] units), but the proportions do not match 1 : 2 : 3! Both conditions must be met: sum = [Target Total] AND Plot B = 2 × Plot A, Plot C = 3 × Plot A."`
    * If both sum and ratio match: `"Perfect match! Plot B has double Plot A, and Plot C has triple Plot A."`
* **Boundary Rules for Inputs:**
  * Dynamic bounds: Stepper inputs for each plot are strictly non-negative integers bounded dynamically by the active capacity: $0 \le \text{alloc} \le T$ (e.g. $T = 12$ in State 1; $T = 24$ in State 2).
  * Integer-only: Inputs are restricted to whole integer units ($1, 2, 3...$).
  * Invariant validation: Exploration allows free adjustment, but verification strictly validates BOTH the sum invariant ($\sum alloc = T$) and the proportional relationship ($allocB = 2 \times allocA \land allocC = 3 \times allocA$). For $T = 12$, an allocation of $2, 4, 6$ passes both checks, whereas $1, 5, 6$ sums to 12 but fails the ratio check.

### 7. Concept Explanation
* "A ratio like $1 : 2 : 3$ does not mean 1 liter, 2 liters, and 3 liters. It means the water is divided into $1 + 2 + 3 = 6$ equal slices or parts. To find what one slice is worth, divide total water (12) by total slices (6), which gives 2 units per slice. Plot A gets 1 slice ($1 \times 2 = 2$), Plot B gets 2 slices ($2 \times 2 = 4$), and Plot C gets 3 slices ($3 \times 2 = 6$)."

### 8. Likely Misconceptions
* **M1 (Raw Ratio Confusion):** Believing the numbers in the ratio represent the absolute physical amounts (e.g. allocating 1, 2, 3 and stopping, leaving half the tank empty).
* **M2 (Additive Equipartition):** Assuming any sharing problem means dividing into equal amounts ($12 \div 3 = 4, 4, 4$).
* **M3 (Arbitrary Sum / Incomplete Ratio):** Picking any numbers that add up to 12 (e.g. 1, 5, 6 or 3, 4, 5) without satisfying the target multiplicative ratio.

### 9. Targeted Misconception Feedback
* *Feedback for M1:* "1 + 2 + 3 uses only 6 units in total. Look at the water tank—there are still 6 units left! We must share the whole tank proportionally."
* *Feedback for M2:* "You gave 4 units to each plot. That would be a 1 : 1 : 1 ratio. But Plot B needs twice as much as Plot A, and Plot C needs three times as much!"
* *Feedback for M3:* "Your water adds up to 12 units, but look closely: 5 is not double of 1, and 6 is not triple of 1! In a 1 : 2 : 3 ratio, Plot B must be exactly twice Plot A (should be 2), and Plot C must be three times Plot A (should be 3)."

### 10. Retry Question
* *Prompt Key:* `math.retry.prompt`
  * **English:** "A new tank holds 18 units of water. If you divide it in the ratio 1 : 2 among two plots (Plot X and Plot Y), how many units does Plot Y receive?"
  * **Kannada [PENDING HUMAN LANGUAGE REVIEW]:** "ಹೊಸ ತೊಟ್ಟಿಯಲ್ಲಿ 18 ಯೂನಿಟ್ ನೀರಿದೆ. ಅದನ್ನು ಎರಡು ಜಮೀನುಗಳಿಗೆ 1 : 2 ಅನುಪಾತದಲ್ಲಿ ಹಂಚಿದರೆ, Plot Y ಗೆ ಎಷ್ಟು ಯೂನಿಟ್ ನೀರು ಸಿಗುತ್ತದೆ?"
* *Options:* A) 6 units | B) 12 units [CORRECT] | C) 9 units.
* *Explanation:* "Total parts = $1 + 2 = 3$. Each part = $18 \div 3 = 6$ units. Plot Y gets 2 parts: $2 \times 6 = 12$ units."

### 11. Exit Check Questions
* **Exit Check 1:**
  * *Prompt:* "A school craft workshop mixes 30 liters of clay slurry using powdered clay and water in the ratio 1 : 5. How many liters of powdered clay are needed?"
  * *Options:* A) 5 L [CORRECT] | B) 6 L | C) 10 L.
  * *Explanation:* "Total parts = $1 + 5 = 6$. Each part = $30 \div 6 = 5\text{ L}$. Powdered clay is 1 part = $5\text{ L}$."
* **Exit Check 2:**
  * *Prompt:* "Three students share 24 notebooks in the ratio 1 : 2 : 3. How many notebooks does the student with the middle share receive?"
  * *Options:* A) 4 notebooks | B) 8 notebooks [CORRECT] | C) 12 notebooks.
  * *Explanation:* "Total parts = $1 + 2 + 3 = 6$. Each part = $24 \div 6 = 4$. The middle share is 2 parts: $2 \times 4 = 8$ notebooks."

### 12. Scoring Rules & Reset Behavior
* Prediction: Formative only (0 points; always advances).
* Interactive Lab: Completion tracked (binary pass upon matching ratio).
* Exit Checks: 1 point each (total 2 points).
* Reset Behavior: Resets steppers to $A=0, B=0, C=0$ and displays target total without clearing earned badges.

### 13. Text Equivalent for Visual Diagrams
* *Visual:* Water tank bar divided into three colored segments labeled A (Blue), B (Green), and C (Orange).
* *Text Equivalent:* `"Tank Capacity: 12 Units. Plot A: 2 units (16.7%). Plot B: 4 units (33.3%). Plot C: 6 units (50.0%). Sum: 12 / 12 units. Ratio satisfied: 1 to 2 to 3."`

---

# Module B — Biology: Food Web Explorer

### 1. Grade Band & Prerequisites
* **Grade Band:** Grades 7–8.
* **Curriculum Reference:** NCERT Class 7 Science Chapter: Forests: Our Lifeline; NCERT Class 8 Science Chapter: Conservation of Plants and Animals (Curriculum-aligned working draft; pending edition verification against current NCERT Rationalised textbooks).
* **Prerequisites:** Understanding that green plants make their own food via photosynthesis (producers) and animals eat plants or other animals (consumers).

### 2. Measurable Learning Objective
* *Objective:* Given a visual or textual model of a 6-organism rural farm food web, the learner will correctly trace the direction of energy flow and predict the qualitative indirect ecological consequences (trophic cascade) of removing a top predator or primary producer, answering both (2 out of 2, 100%) exit-check transfer questions correctly.

### 3. Relatable Scenario
* *Context:* A rural agricultural field ecosystem in Karnataka:
  * **Paddy Crops & Grass** (Producers).
  * **Grasshoppers** & **Field Rats** (Herbivores / Primary Consumers).
  * **Frogs** (Insectivores / Secondary Consumers).
  * **Rat Snakes** (Carnivores / Secondary & Tertiary Consumers).
  * **Barn Owls** (Apex Predators).
* *Scenario Disclaimer:* Ecological systems in nature are governed by complex multi-variable dynamics. The model presents qualitative directional tendencies, not exact mathematical population numbers.

### 4. Pre-Activity Prediction Question
* *Prompt Key:* `bio.pred.prompt`
  * **English:** "In our farm ecosystem, what is most likely to happen to the grasshopper population if farmers remove all the rat snakes from the fields?"
  * **Kannada [PENDING HUMAN LANGUAGE REVIEW]:** "ನಮ್ಮ ಹೊಲದ ಪರಿಸರ ವ್ಯವಸ್ಥೆಯಲ್ಲಿ, ರೈತರು ಎಲ್ಲಾ ಹಾವುಗಳನ್ನು ಹೊಲದಿಂದ ತೆಗೆದುಹಾಕಿದರೆ ಮಿಡತೆಗಳ (grasshoppers) ಸಂಖ್ಯೆಗೆ ಏನಾಗಬಹುದು?"
* *Options:*
  * A) Grasshopper population decreases [CORRECT]
  * B) Grasshopper population increases
  * C) Grasshopper population remains exactly unchanged
* *Explanation:* "When snakes are removed, fewer frogs are eaten, so frog numbers increase. More frogs will eat more grasshoppers, causing grasshoppers to decrease!"

### 5. Interaction States & Target Model
* **State 1 (Baseline Equilibrium):**
  * All species present in balanced numbers. Status: All nodes `"Balanced"`.
* **State 2 (Predator Removal - "No Snakes"):**
  * Rat Snakes removed.
  * Direct effect: Frog population increases (`"Surging / Overpopulated"`).
  * Indirect effect: Grasshopper population decreases (`"Declining"`).
  * Paddy crop recovers from grasshopper grazing (`"Thriving"`).
* **State 3 (Producer Drought - "Drought / Low Crop Yield"):**
  * Crops decline (`"Severe Deficit"`).
  * Both grasshoppers and field rats decline due to lack of food.
  * Frogs and owls experience food scarcity.

### 6. Learner Actions & Visual Display Model
* **Learner Changes:** The learner toggles scenario buttons: `[ Normal Balance ]`, `[ Remove Snakes ]`, `[ Simulate Drought ]`, `[ Remove Grasshoppers ]`.
* **Model Displays:**
  * An SVG node graph where arrows point in the direction of energy flow (`Organism Eaten ---> Eater`).
  * Organism badges show qualitative status tags: `[ Balanced ]`, `[ Overpopulated ]`, `[ Declining ]`.
  * Dynamic Narrative Panel: Explains step-by-step what is happening in the ecosystem.

### 7. Concept Explanation
* "In a food web, arrows show where energy travels—from the organism that is eaten to the animal that eats it. Living things are connected in a web, not just a straight line. Changing one species causes ripple effects (trophic cascades) across the whole community, even affecting animals that don't directly interact!"

### 8. Likely Misconceptions
* **M1 (Arrow Reversal):** Thinking arrows point to what an animal eats (e.g., drawing arrow from Frog to Grasshopper instead of Grasshopper to Frog).
* **M2 (Direct-Only Thinking):** Assuming that removing snakes can only affect animals snakes eat directly, ignoring indirect effects on grasshoppers or crops.
* **M3 (Producer Disregard):** Believing predators are the most important organisms, failing to recognize that all energy originates with green plants.

### 9. Targeted Misconception Feedback
* *Feedback for M1:* "In science food webs, arrows show where the food and energy go. When a frog eats a grasshopper, energy moves from the grasshopper into the frog: Grasshopper $\rightarrow$ Frog."
* *Feedback for M2:* "Look beyond direct neighbors! When snakes disappear, frogs multiply. Who do all those extra frogs eat? The grasshoppers!"
* *Feedback for M3:* "Without sunlight and green paddy plants, no energy enters the web at all. If producers die, every animal above them starves."

### 10. Retry Question
* *Prompt Key:* `bio.retry.prompt`
  * **English:** "If field mice numbers suddenly drop because of disease, which animal will face a direct food shortage?"
  * **Kannada [PENDING HUMAN LANGUAGE REVIEW]:** "ರೋಗದಿಂದಾಗಿ ಹೊಲದ ಇಲಿಗಳ ಸಂಖ್ಯೆ ಕಡಿಮೆಯಾದರೆ, ಯಾವ ಪ್ರಾಣಿಗೆ ನೇರ ಆಹಾರದ ಕೊರತೆ ಉಂಟಾಗುತ್ತದೆ?"
* *Options:* A) Grasshoppers | B) Barn Owls [CORRECT] | C) Frogs.
* *Explanation:* "Barn owls prey directly on field mice. If field mice drop, owls immediately lose a primary food source."

### 11. Exit Check Questions
* **Exit Check 1:**
  * *Prompt:* "In a forest food web: Tree Leaves $\rightarrow$ Caterpillars $\rightarrow$ Small Birds $\rightarrow$ Hawks. Which organism is the producer?"
  * *Options:* A) Tree Leaves [CORRECT] | B) Caterpillars | C) Small Birds.
  * *Explanation:* "Green plant leaves produce their own food through photosynthesis using sunlight; animals cannot produce food."
* **Exit Check 2:**
  * *Prompt:* "In a pond: Water Weeds $\rightarrow$ Tadpoles $\rightarrow$ Large Beetles. What does the arrow between Tadpoles and Large Beetles represent?"
  * *Options:* 
    * A) Tadpoles hunt large beetles
    * B) Energy transfers from tadpoles to large beetles [CORRECT]
    * C) Beetles give energy to tadpoles
  * *Explanation:* "The arrow points from prey to predator, representing the flow of biological energy."

### 12. Scoring Rules & Reset Behavior
* Prediction: Formative (0 points).
* Interactive Exploration: Tracked by toggle triggers.
* Exit Checks: 1 point each (total 2 points).
* Reset: Restores all species to `"Balanced"` baseline.

### 13. Text Equivalent for Visual Diagrams
* *Visual:* 6-node SVG graph with directional arrows.
* *Text Equivalent Table:*
  * `Paddy Grass (Producer) ---> Eaten by: Grasshopper, Field Rat`
  * `Grasshopper (Herbivore) ---> Eaten by: Frog`
  * `Field Rat (Herbivore) ---> Eaten by: Rat Snake, Barn Owl`
  * `Frog (Insectivore) ---> Eaten by: Rat Snake`
  * `Rat Snake (Carnivore) ---> Eaten by: Barn Owl`

---

# Module C — Chemistry: pH Color Lab

### 1. Grade Band & Prerequisites
* **Grade Band:** Grade 7.
* **Curriculum Reference:** NCERT Class 7 Science Chapter 5: Acids, Bases and Salts (Curriculum-aligned working draft; pending edition verification against current NCERT Rationalised textbooks).
* **Prerequisites:** Understanding that substances can be sour (acidic), bitter (basic), or neither, and that indicators change color in their presence.

### 2. Measurable Learning Objective
* *Objective:* Given common aqueous solutions and universal indicator / turmeric tests, the learner will correctly categorize substances as acidic ($\text{pH} < 7$), neutral ($\text{pH} = 7$), or basic ($\text{pH} > 7$) and articulate the safety boundary that a neutral pH alone does not verify drinking-water safety, answering both (2 out of 2, 100%) exit-check questions correctly.

### 3. Relatable Scenario
* *Context:* A village health and farm water-testing camp testing common liquids:
  * Lemon Juice (Sour household acid, illustrative $\text{pH} \approx 2.2$).
  * Distilled Water (pH 7.0 Reference) (Target neutral reference liquid, illustrative $\text{pH} = 7.0$).
  * Baking Soda Solution (Mild alkaline solution, illustrative $\text{pH} \approx 8.5$).
  * Laundry Soap Solution (Bitter, slippery household base, illustrative $\text{pH} \approx 10.0$).
* *Safety & Methodology Disclaimer:* Virtual indicator color changes represent ideal aqueous laboratory simulations. Real-world chemical validation requires calibrated digital instruments. **A pH test does not detect pathogens (bacteria, viruses, or protozoa) or toxic dissolved chemicals, and a reading of pH 7.0 does not establish water potability or biological safety.**

### 4. Pre-Activity Prediction Question
* *Prompt Key:* `chem.pred.prompt`
  * **English:** "Turmeric is a natural yellow indicator. When you rub yellow turmeric paste onto basic laundry soap, what color does it turn?"
  * **Kannada [PENDING HUMAN LANGUAGE REVIEW]:** "ಅರಿಶಿನವು ಒಂದು ನೈಸರ್ಗಿಕ ಹಳದಿ ಸೂಚಕವಾಗಿದೆ. ಪ್ರತ್ಯಾಮ್ಲೀಯವಾಗಿರುವ (basic) ಬಟ್ಟೆ ಸೋಪಿಗೆ ಅರಿಶಿನ ತಾಗಿಸಿದಾಗ ಅದು ಯಾವ ಬಣ್ಣಕ್ಕೆ ಬದಲಾಗುತ್ತದೆ?"
* *Options:*
  * A) Turns bright blue
  * B) Turns reddish-brown [CORRECT]
  * C) Remains yellow
* *Explanation:* "Curcumin in turmeric reacts with alkaline (basic) substances like soap to turn deep reddish-brown. In acids and neutral water, it stays yellow!"

### 5. Interaction States & Target Model
* All pH values are clearly labeled educational illustrative approximations for standard room temperature aqueous conditions ($25^\circ\text{C}$).
* **State 1 (Acidic Solution — Lemon Juice):**
  * Target Value: $\text{pH} \approx 2.2$ (Acidic).
  * Indicator Reactions: Universal Indicator turns Red; Natural Turmeric Paper remains Yellow.
  * Category: `"Acidic (pH < 7)"`.
* **State 2 (Neutral Reference — Distilled / Neutral Reference Water):**
  * Target Value: $\text{pH} = 7.0$ (Neutral reference).
  * Indicator Reactions: Universal Indicator turns Green; Natural Turmeric Paper remains Yellow.
  * Category: `"Neutral (pH = 7)"`.
* **State 3 (Mild Basic Solution — Baking Soda Solution):**
  * Target Value: $\text{pH} \approx 8.5$ (Mild basic/alkaline).
  * Indicator Reactions: Universal Indicator turns Blue-Green/Blue; Natural Turmeric Paper turns Reddish-Brown.
  * Category: `"Basic / Alkaline (pH > 7)"`.
* **State 4 (Basic Solution — Laundry Soap Solution):**
  * Target Value: $\text{pH} \approx 10.0$ (Basic/alkaline).
  * Indicator Reactions: Universal Indicator turns Deep Blue/Purple; Natural Turmeric Paper turns Deep Reddish-Brown.
  * Category: `"Basic / Alkaline (pH > 7)"`.

### 6. Learner Actions & Visual Display Model
* **Learner Changes:** The learner selects from 4 test beakers (`[ Lemon Juice ]`, `[ Distilled Water (pH 7.0 Reference) ]`, `[ Baking Soda Solution ]`, `[ Soap Solution ]`) and dips an indicator strip (`[ Natural Turmeric Paper ]` or `[ Universal Indicator Paper ]`).
* **Model Displays:**
  * Animated indicator strip entering beaker and undergoing color shift (Turmeric turns reddish-brown in basic solutions and stays yellow in acid/neutral; Universal Indicator displays color gradient corresponding to numerical pH).
  * A labeled numerical pH scale bar ($0$ to $14$):
    * $0 - 6$: Acidic (Red to Yellow)
    * $7$: Neutral (Green)
    * $8 - 14$: Basic / Alkaline (Blue to Violet)
  * Prominent Warning Banner: `"Notice: Educational simulation. A pH test does not detect pathogens (bacteria, viruses, or parasites) or toxic dissolved chemicals, and a reading of pH 7.0 does not establish water potability or biological safety."`

### 7. Concept Explanation
* "The pH scale runs from 0 to 14. Substances with pH less than 7 are acids (like lemon juice). Substances with pH greater than 7 are bases / alkaline (like baking soda and soap). Pure neutral water has a pH of 7.0. Indicators are chemical detectors that change color depending on whether a solution has excess hydrogen ions (acidic) or hydroxide ions (basic)."

### 8. Likely Misconceptions
* **M1 (Neutral Means Safe to Drink):** Believing that if water tests at pH 7, it is 100% clean and free of diseases.
* **M2 (Inverted Scale Direction):** Thinking that higher pH numbers mean stronger acids (e.g. thinking pH 10 is an acid).
* **M3 (Indicator Magic):** Thinking indicators clean or neutralize the chemical, rather than just revealing its nature through color.

### 9. Targeted Misconception Feedback
* *Feedback for M1:* "Caution! Neutral pH only means acid and base levels are balanced ($H^+ \approx OH^-$). A pH reading does not test for biological pathogens (bacteria, viruses, protozoa) or dissolved chemical poisons. Testing for microbiological pathogens and chemical safety requires dedicated assays separate from pH; boiling disinfects pathogens but does not eliminate chemical or heavy metal contaminants. Never drink untreated water just because it tests neutral!"
* *Feedback for M2:* "Look at the scale! Lower numbers ($0-6$) are acids. Higher numbers ($8-14$) are bases. 7.0 is right in the neutral middle."
* *Feedback for M3:* "Indicators don't change or clean the solution; they are just chemical messengers that report whether a substance is acidic or basic."

### 10. Retry Question
* *Prompt Key:* `chem.retry.prompt`
  * **English:** "A sample of vinegar has a pH of 3. What category does vinegar belong to?"
  * **Kannada [PENDING HUMAN LANGUAGE REVIEW]:** "ವಿನೆಗರ್ ದ್ರಾವಣದ pH ಮೌಲ್ಯ 3 ಆಗಿದೆ. ವಿನೆಗರ್ ಯಾವ ಗುಂಪಿಗೆ ಸೇರುತ್ತದೆ?"
* *Options:* A) Acidic [CORRECT] | B) Neutral | C) Basic.
* *Explanation:* "Any substance with a pH below 7 is acidic. Since 3 is less than 7, vinegar is an acid."

### 11. Exit Check Questions
* **Exit Check 1:**
  * *Prompt:* "A health worker tests well water and finds a pH of 7.0. Does this test alone guarantee the water is safe from bacteria?"
  * *Options:*
    * A) Yes, pH 7 guarantees total water purity
    * B) No, a pH test cannot determine pathogen or chemical safety [CORRECT]
    * C) Yes, but only if the water is cold
  * *Explanation:* "A pH reading only measures chemical hydrogen ion activity (acidity or alkalinity); it does not test for biological pathogens (such as bacteria, viruses, or parasites) or toxic dissolved chemicals and does not establish water potability."
* **Exit Check 2:**
  * *Prompt:* "Which of these pH values represents a basic / alkaline solution?"
  * *Options:* A) pH 2 | B) pH 7 | C) pH 11 [CORRECT].
  * *Explanation:* "Values above 7 (8 to 14) are basic/alkaline. Therefore, pH 11 represents a basic / alkaline solution."

### 12. Scoring Rules & Reset Behavior
* Prediction: Formative (0 points).
* Interactive Dip: Tracked by test attempts.
* Exit Checks: 1 point each (total 2 points).
* Reset: Resets dipped paper strips and returns scale marker to 7.

### 13. Text Equivalent for Visual Diagrams
* *Visual:* pH Scale horizontal gradient bar from 0 to 14.
* *Text Equivalent:* `"pH Scale: 0 to 6 is Acidic (Red to Yellow). 7 is Neutral (Green). 8 to 14 is Basic (Blue to Purple). Test Samples: Lemon Juice = illustrative pH 2.2 (Acidic); Distilled Water = illustrative pH 7.0 (Neutral); Baking Soda Solution = illustrative pH 8.5 (Weakly Basic); Soap Solution = illustrative pH 10.0 (Basic)."`

---

# Module D — Physics: Sound Detective

### 1. Grade Band & Prerequisites
* **Grade Band:** Grade 8.
* **Curriculum Reference:** NCERT Class 8 Science Chapter 13: Sound (Curriculum-aligned working draft; pending edition verification against current NCERT Rationalised textbooks).
* **Prerequisites:** Understanding that sound is produced by vibrating objects and travels as waves through air.

### 2. Measurable Learning Objective
* *Objective:* Given synthetic audio tones and visual waveforms at $220\text{ Hz}$ and $440\text{ Hz}$, the learner will distinguish frequency (pitch) from amplitude (loudness) by correctly predicting that doubling frequency doubles wave crests per second without changing wave height, answering both (2 out of 2, 100%) exit-check questions correctly.

### 3. Relatable Scenario
* *Context:* A village festival music workshop comparing traditional instruments:
  * A **bamboo flute** playing a high, shrill note ($440\text{ Hz}$, musical note A4).
  * A **large temple drum (dholak)** vibrating at a deep, low rumble ($220\text{ Hz}$, musical note A3).
* *Acoustic Measurement Disclaimer:* Generated frequencies ($220\text{ Hz}$, $440\text{ Hz}$) are exact software synthesis values. The app does not claim calibrated decibel SPL meters or lab-grade acoustic analysis. Live microphone input is optional and subject to ambient background noise.

### 4. Pre-Activity Prediction Question
* *Prompt Key:* `phys.pred.prompt`
  * **English:** "If a musician plays a tone at 440 Hz instead of 220 Hz, what difference will you hear?"
  * **Kannada [PENDING HUMAN LANGUAGE REVIEW]:** "ಒಬ್ಬ ಸಂಗೀತಗಾರನು 220 Hz ಬದಲು 440 Hz ನಲ್ಲಿ ಧ್ವನಿಯನ್ನು ನುಡಿಸಿದರೆ, ನೀವು ಕೇಳುವ ಧ್ವನಿಯಲ್ಲಿ ಏನು ವ್ಯತ್ಯಾಸವಾಗುತ್ತದೆ?"
* *Options:*
  * A) The pitch sounds higher (more shrill) [CORRECT]
  * B) The sound automatically becomes louder
  * C) The sound wave travels twice as fast across the room
* *Explanation:* "Frequency measures how many times the wave vibrates per second. Higher frequency means higher pitch! 440 Hz is exactly one musical octave higher than 220 Hz."

### 5. Interaction States & Target Model
* **State 1 (Low Pitch Reference — 220 Hz):**
  * Frequency $f = 220\text{ Hz}$. Default Amplitude $A = 50\%$.
  * Visual Waveform: Fewer wave crests across the screen window.
  * Audio: Deep, low humming tone.
* **State 2 (High Pitch Reference — 440 Hz):**
  * Frequency $f = 440\text{ Hz}$. Default Amplitude $A = 50\%$.
  * Visual Waveform: Exactly twice as many wave crests across the identical screen window.
  * Audio: Clear, high shrill tone.
* **State 3 (Amplitude Manipulation):**
  * Frequency fixed at $440\text{ Hz}$. Amplitude adjusted from $20\%$ to $90\%$.
  * Visual Waveform: Wave crests become vertically taller, but the number of waves across the screen remains constant.
  * Audio: Tone gets louder, but musical pitch remains unchanged.

### 6. Learner Actions & Visual Display Model
* **Learner Changes:**
  * Toggle buttons: `[ Play 220 Hz (Low) ]` and `[ Play 440 Hz (High) ]`.
  * Frequency Slider: $100\text{ Hz} - 800\text{ Hz}$.
  * Amplitude Slider: $10\% - 100\%$ (Controls volume).
  * Play/Stop audio button.
  * Optional Microphone toggle (non-essential).
* **Model Displays:**
  * Live HTML5 Canvas rendering mathematical sine wave: $y(t) = A \cdot \sin(2\pi f t)$.
  * Frequency readout: `"Frequency: [ X ] Hz (Vibrations per second)"`.
  * Amplitude readout: `"Amplitude: [ Y ] % (Wave Height)"`.

### 7. Concept Explanation
* "Frequency is the number of complete vibrations per second, measured in Hertz (Hz). Higher frequency creates a higher **pitch** (shrill sound). Amplitude is the height of the sound wave. Larger amplitude creates a louder sound (**loudness**). Pitch and loudness are completely independent!"

### 8. Likely Misconceptions
* **M1 (Loudness Equals Pitch):** Believing that turning up the volume increases the frequency.
* **M2 (Pitch Changes Travel Speed):** Believing that high-pitch sounds travel through the air faster than low-pitch sounds.
* **M3 (Wave Height Equals Frequency):** Believing that taller waves mean more vibrations per second.

### 9. Targeted Misconception Feedback
* *Feedback for M1:* "Listen carefully and look at the wave! When you increase amplitude, the sound gets louder and the wave gets taller, but the pitch does not change."
* *Feedback for M2:* "All sounds travel through air at the same speed (~340 meters per second), regardless of whether they are high flute notes or low drum beats."
* *Feedback for M3:* "Wave height shows amplitude (energy/loudness). Wave compression (how tightly packed the waves are horizontally) shows frequency!"

### 10. Retry Question
* *Prompt Key:* `phys.retry.prompt`
  * **English:** "Two sound waves have the same height, but Wave 2 has twice as many peaks per second as Wave 1. How does Wave 2 sound?"
  * **Kannada [PENDING HUMAN LANGUAGE REVIEW]:** "ಎರಡು ಧ್ವನಿ ತರಂಗಗಳು ಒಂದೇ ಎತ್ತರವನ್ನು ಹೊಂದಿವೆ, ಆದರೆ 2 ನೇ ತರಂಗವು 1 ನೇ ತರಂಗಕ್ಕಿಂತ ಪ್ರತಿ ಸೆಕೆಂಡಿಗೆ ಎರಡು ಪಟ್ಟು ಹೆಚ್ಚು ತರಂಗಗಳನ್ನು ಹೊಂದಿದೆ. 2 ನೇ ತರಂಗ ಹೇಗೆ ಕೇಳಿಸುತ್ತದೆ?"
* *Options:* A) It is louder | B) It has a higher pitch [CORRECT] | C) It travels faster.
* *Explanation:* "More peaks per second means higher frequency, which produces a higher pitch."

### 11. Exit Check Questions
* **Exit Check 1:**
  * *Prompt:* "A baby bird chirps with a high pitch, while a lion roars with a deep rumble. However, the lion's roar is much louder. Which sound wave has higher frequency?"
  * *Options:* A) The baby bird's chirp [CORRECT] | B) The lion's roar | C) Both have the same frequency.
  * *Explanation:* "Pitch is determined by frequency. Even though the bird chirp is quieter (smaller amplitude), its high pitch means it has a higher frequency."
* **Exit Check 2:**
  * *Prompt:* "What unit is used to measure the frequency of a sound wave?"
  * *Options:* A) Meters | B) Hertz (Hz) [CORRECT] | C) Kilograms.
  * *Explanation:* "Frequency is measured in Hertz (Hz), which counts the number of wave cycles per second."

### 12. Scoring Rules & Reset Behavior
* Prediction: Formative (0 points).
* Interactive Tone Comparison: Formative (tracked by playing both 220 Hz and 440 Hz).
* Exit Checks: 1 point each (total 2 points).
* Reset: Halts audio synthesizer and resets sliders to $220\text{ Hz}$ and $50\%$ amplitude.

### 13. Text Equivalent for Visual Diagrams
* *Visual:* Live Oscilloscope Canvas showing sine waves.
* *Text Equivalent:* `"Oscilloscope Display: At 220 Hz, illustrative educational waveform displays reference cycles across the screen with peak height 50%. At 440 Hz, wave cycles double across the identical window with identical 50% peak height (doubled frequency, unchanged amplitude)."`
