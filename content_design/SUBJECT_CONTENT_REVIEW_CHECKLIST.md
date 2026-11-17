# SUBJECT CONTENT REVIEW CHECKLIST & PROVENANCE REGISTER

**Document ID:** CONTENT-REVIEW-CHECKLIST-V1  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Event:** STEM for Impact 2026, Presidency University, Bengaluru  
**Role:** STEM Curriculum Designer & Formative Assessment Specialist  
**Status:** Pre-Event Working Draft (Curriculum edition verification and Kannada language reviews pending)  

---

## 1. Provenance & Verification Classification

Every item in the content specification is formally categorized into distinct verification tiers:
1. **[VERIFIED - SCIENTIFIC STANDARD / MATHEMATICAL INVARIANT]:** Fundamental physical and mathematical constants/laws (e.g. speed of sound in air, frequency-octave doubling, mathematical ratio partitioning, indicator chemical reaction properties).
2. **[WORKING DRAFT - PENDING EDITION CHECK]:** Curriculum alignments to NCERT textbook chapters pending verification against current Rationalised editions (e.g. Class 6 *Ganita Prakash*).
3. **[PROPOSED - ILLUSTRATIVE LAB PRESET]:** Virtual laboratory preset values (e.g. Lemon Juice pH 2.2, Baking Soda pH 8.5, Soap Solution pH 10.0), which are educational illustrative approximations rather than universal invariant constants.
4. **[PROPOSED - DRAFT DESIGN / QUALITATIVE MODEL / SOFTWARE SAFEGUARD]:** UI ranges, qualitative trophic cascade directional models, and software audio gain limits.
5. **[PENDING HUMAN REVIEW]:** Non-English language translations (Kannada) requiring sign-off from a native-speaking educator.

---

## 2. Item-by-Item Review Checklist

### Module A — Mathematics (Water Share Challenge)
* [x] **[WORKING DRAFT - PENDING EDITION CHECK]** Ratio concept matches NCERT Class 6 Chapter 12 & Class 7 Chapter 8 standards in legacy syllabi; note that NCERT introduced the new *Ganita Prakash* curriculum for Class 6 (2024–2025 onwards) where chapter sequencing differs. Exact alignment pending physical edition check.
* [x] **[VERIFIED - MATHEMATICAL INVARIANT]** Canonical mathematical case: Total 12, ratio $1:2:3 \implies$ parts $2, 4, 6$.
* [x] **[VERIFIED - MATHEMATICAL INVARIANT]** Scaled mathematical case: Total 24, ratio $1:2:3 \implies$ parts $4, 8, 12$.
* [x] **[PROPOSED - DRAFT DESIGN]** Transfer case: Total 20, ratio $1:1:2 \implies$ parts $5, 5, 10$.
* [x] **[PROPOSED - DRAFT DESIGN]** Boundary handling: Negative inputs clamped to 0; non-integers blocked; sum $\ne T$ triggers informative warning.
* [x] **[PROPOSED - DRAFT DESIGN]** Scenario disclaimer: Clearly noted as stylized math instruction, not real irrigation guidance.
* [ ] **[PENDING HUMAN REVIEW]** Kannada translation strings (`math.pred.prompt`, `math.retry.prompt`) require native educator review.

### Module B — Biology (Food Web Explorer)
* [x] **[WORKING DRAFT - PENDING EDITION CHECK]** Ecosystem concepts match NCERT Class 7 Science (Forests) & Class 8 Science (Conservation).
* [x] **[VERIFIED - SCIENTIFIC STANDARD]** Arrow convention strictly adheres to biological standard: arrow indicates direction of energy flow (prey $\rightarrow$ predator).
* [x] **[PROPOSED - QUALITATIVE MODEL]** Trophic cascade logic: Removing apex predator (snakes) qualitatively models a tendency where meso-predators (frogs) surge and herbivores (grasshoppers) face increased predation pressure. Handled as qualitative tendencies rather than deterministic population numbers.
* [x] **[PROPOSED - DRAFT DESIGN]** 6-organism rural farm food web (Paddy Crops, Grasshoppers, Field Mice, Frogs, Rat Snakes, Barn Owls).
* [x] **[PROPOSED - DRAFT DESIGN]** Feedback uses cautious qualitative language ("likely tendency", "possible surge") rather than unscientific exact population predictions.
* [x] **[PROPOSED - DRAFT DESIGN]** Full text accessibility table provided for screen readers.
* [ ] **[PENDING HUMAN REVIEW]** Kannada translation strings (`bio.pred.prompt`, `bio.retry.prompt`) require native educator review.

### Module C — Chemistry (pH Color Lab)
* [x] **[WORKING DRAFT - PENDING EDITION CHECK]** Acid, base, and salt definitions match NCERT Class 7 Science Chapter 5.
* [x] **[PROPOSED - ILLUSTRATIVE LAB PRESET]** pH scale illustrative presets: Lemon Juice $\approx \text{pH } 2.2$ (Acidic), Pure Distilled Water $= \text{pH } 7.0$ (Neutral reference at $25^\circ\text{C}$), Baking Soda Solution $\approx \text{pH } 8.5$ (Mild alkaline), Laundry Soap $\approx \text{pH } 10.0$ (Alkaline). These are designated as educational illustrative values rather than universal empirical invariants.
* [x] **[VERIFIED - SCIENTIFIC STANDARD]** Natural indicator response: Turmeric remains yellow in acid/neutral and turns reddish-brown in basic solutions.
* [x] **[VERIFIED - SAFETY BOUNDARY]** Explicit health boundary: Mandatory disclaimer that neutral pH 7 only measures hydrogen ion activity and does NOT establish drinking water potability (biological pathogens and toxic dissolved chemicals require separate testing; boiling disinfects pathogens but does not remove chemical contaminants).
* [x] **[PROPOSED - DRAFT DESIGN]** Virtual beaker dipping interaction and visual color transition animation.
* [ ] **[PENDING HUMAN REVIEW]** Kannada translation strings (`chem.pred.prompt`, `chem.retry.prompt`) require native educator review.

### Module D — Physics (Sound Detective)
* [x] **[WORKING DRAFT - PENDING EDITION CHECK]** Acoustic principles match NCERT Class 8 Science Chapter 13 (Sound).
* [x] **[VERIFIED - SCIENTIFIC STANDARD]** Frequency ($220\text{ Hz}$ vs. $440\text{ Hz}$) accurately demonstrates pitch difference of exactly one musical octave (A3 to A4).
* [x] **[VERIFIED - SCIENTIFIC STANDARD]** Speed of sound in ambient air is constant (~$340\text{ m/s}$); frequency does not alter travel velocity.
* [x] **[PROPOSED - DRAFT DESIGN]** Real-time sine wave canvas visually decoupling wave height (amplitude/loudness) from wave compression (frequency/pitch).
* [x] **[PROPOSED - SOFTWARE SAFEGUARD]** Audio safeguards: Web Audio gain clamped to $-3\text{ dBFS}$ ($0.70$ linear scale) to prevent software digital clipping; paired with low default volume ($20\%–30\%$), strict user-initiated playback (no autoplay), and persistent mute controls. Physical speaker protection cannot be guaranteed by software alone and depends on device hardware.
* [x] **[PROPOSED - DRAFT DESIGN]** Technical caveat: Microphone input is declared optional, noisy, and non-blocking for mission completion.
* [ ] **[PENDING HUMAN REVIEW]** Kannada translation strings (`phys.pred.prompt`, `phys.retry.prompt`) require native educator review.

---

## 3. Curricular & Licensing Provenance Register

| Content Element | Curricular Source / Standard | Licensing / Attribution Status | Verification Confidence |
| :--- | :--- | :--- | :---: |
| **Mathematics Ratios** | NCERT Class 6 Math Ch 12 (legacy) / *Ganita Prakash* (new 2024+); NCERT Class 7 Math Ch 8 | Public educational curriculum (NCERT, Government of India). | Medium (Pending edition check) |
| **Ecosystem Trophic Webs** | NCERT Class 7 & 8 Science; Odum's Fundamentals of Ecology | Public scientific principles; no copyright on biological food chain structures. | High |
| **pH Scale & Turmeric Test** | NCERT Class 7 Science Ch 5 (Acids, Bases and Salts) | Standard school chemistry curriculum; open public knowledge. | High |
| **Acoustic Wave Physics** | NCERT Class 8 Science Ch 13 (Sound); Halliday & Resnick Physics | Physical acoustics fundamentals; mathematically verifiable ($v = f\lambda$). | High |
| **Web Audio Oscillator** | W3C Web Audio API Specification | Open Web Standard (W3C / WHATWG). | High |
| **Kannada Translations** | Gramin PocketLab Localization Draft | **Pending Human Verification** (Draft authored for hackathon preparation). | Medium (Requires human check) |
