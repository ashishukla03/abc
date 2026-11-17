# GRAMIN POCKETLAB — P0 & HIGH-PRIORITY CORRECTIONS LOG

**Document ID:** AUDIT-P0-CORRECTIONS-LOG-V1  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Date:** October 24, 2026  
**Auditor:** Antigravity Pair Programming Assistant  
**Status:** Executed & Reconciled Across Workspace  

---

## 1. Executive Summary

Following a comprehensive audit of all 80 project files in the workspace (66 Markdown, 11 CSV, 3 other files), multiple factual claims, mathematical formulas, licensing assertions, and specification conflicts were identified. This document records all P0 (Critical) and High-priority corrections applied across the repository.

**Core Boundary Integrity:**  
* This pass is strictly a **documentation and specification correction pass**.  
* **Zero application code** has been authored in `app/` (preserving the empty runtime shell: `app/manifest.json` and `app/assets/icon.svg` only).  
* **No acceptance tests or Lighthouse benchmarks are claimed as passed** prior to physical device execution during the hackathon build window.

---

## 2. P0 (Critical) Corrections

### 2.1 Audio Safety & Gain Clamping (Correction ID: CORR-P0-01)
* **Previous Flawed Claim:** Several documents asserted that programmatically clamping Web Audio gain to $-3\text{ dBFS}$ ($0.70$ linear scale) "prevents hearing damage," "protects child hearing," or "prevents speaker damage."
* **Factual Reality:** Digital signal level (dBFS) is an internal numerical ratio relative to full scale, not physical Sound Pressure Level (SPL in dBA) reaching the listener's eardrum. Physical sound pressure depends on digital-to-analog conversion, phone amplifier circuits, device master volume, speaker impedance, and earphone acoustic sensitivity. Digital gain clamping prevents digital clipping distortion on phone DACs, but cannot guarantee biological hearing safety or prevent physical speaker damage at elevated device master volumes.
* **Correction Applied:**
  * Removed all claims that $-3\text{ dBFS}$ prevents biological hearing damage or guarantees prevention of physical speaker damage.
  * Preserved digital gain clamping ($0.70$ linear scale / $-3\text{ dBFS}$) strictly as a software headroom ceiling to prevent digital clipping distortion on budget hardware.
  * Added mandatory behavioral audio safeguards and practical testing:
    1. Low default initial volume setting ($20\%–30\%$).
    2. Zero autoplay: audio strictly requires an explicit, intentional user tap to initialize (`AudioContext.resume()`).
    3. Prominent, persistent global mute/stop controls always accessible in the navigation bar.
    4. Practical actual-device audio playback test plan across representative test handsets (testing reliable playback, user-controlled volume, immediate stop/mute responsiveness, and absence of distortion; without claiming calibrated SPL or guaranteed hearing safety).
* **Files Corrected:** `architecture_plan/ARCHITECTURE_PROPOSAL.md`, `architecture_plan/ARCHITECTURE_DECISION_RECORD.md`, `architecture_plan/OFFLINE_AND_PRIVACY_PLAN.md`, `audit/DECISION_REGISTER.md`, `audit/REQUIREMENT_TRACEABILITY.csv`, `audit/SPEC_GAP_AUDIT.md`, `content_design/SUBJECT_CONTENT_REVIEW_CHECKLIST.md`, `modules_deep_dive/PHYSICS_SOUND_DETECTIVE_SPEC.md`, `modules_deep_dive/PHYSICS_SOUND_DETECTIVE_ACCEPTANCE_TESTS.csv`, `modules_deep_dive/README.md`, `specs/06_architecture_and_offline_engine.md`, `synthesis/FINAL_RISK_REGISTER.md`, `team_coordination/BUILD_WINDOW_PLAN.md`, `team_coordination/TEAM_OWNERSHIP.md`.

---

### 2.2 PhET Licensing & Reuse Policy (Correction ID: CORR-P0-02)
* **Previous Flawed Claim:** Research documents repeatedly asserted that published PhET simulations are licensed under Creative Commons Attribution 4.0 International (CC BY 4.0).
* **Factual Reality:** According to the official University of Colorado Boulder PhET licensing terms ([https://phet.colorado.edu/en/licensing](https://phet.colorado.edu/en/licensing)), published HTML5 simulations are distributed under **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**, not CC BY 4.0. Individual software repositories under the PhET organization carry their own distinct licenses (including GPL-3.0, MIT, or custom terms depending on the specific repository and subpackage; blanket license assignments cannot be made without checking exact repository license files), and commercial reuse or trademark use requires an explicit negotiated agreement from CU Boulder.
* **Correction Applied:**
  * Corrected all licensing references: published HTML simulations are CC BY-NC 4.0; individual underlying source packages carry distinct repository licenses.
  * Established binding design policy: **Author 100% original, lightweight HTML5 Canvas micro-simulations** during the hackathon. Zero PhET source code or compiled packages will be bundled or embedded.
  * PhET is treated exclusively as pedagogical and visual inspiration. Any direct asset reuse is marked pending formal licensing verification.
* **Files Corrected:** `synthesis/RESEARCH_SYNTHESIS.md`, `synthesis/CLAIMS_TO_VERIFY.csv`, `specs/07_engineering_preparation_and_risks.md`, `research_workspace/02_open_source_ecosystem_audit.md`, `research_workspace/05_candidate_concepts_and_decision_framework.md`, `repo_intelligence/REPO_INTELLIGENCE_REPORT.md`, `repo_intelligence/RANKED_REPOSITORY_REGISTER.csv`, `repo_intelligence/DEPENDENCY_AND_LICENCE_RISK_NOTES.md`, `architecture_plan/DEPENDENCY_AND_LICENCE_REGISTER.csv`.

---

## 3. High-Priority Technical & Curricular Corrections

### 3.1 Waveform Cycle / Time-Axis Mathematics (Correction ID: CORR-HI-01)
* **Previous Flawed Claim:** Specifications stated that an oscilloscope time axis spanning $0–10\text{ ms}$ displays "exactly 2 complete wave cycles at 220 Hz and 4 complete cycles at 440 Hz."
* **Factual Reality:**
  $$\text{Period } T_{220} = \frac{1}{220\text{ s}^{-1}} \approx 4.545\text{ ms} \implies \frac{10\text{ ms}}{4.545\text{ ms}} = 2.2\text{ cycles}$$
  $$\text{Period } T_{440} = \frac{1}{440\text{ s}^{-1}} \approx 2.273\text{ ms} \implies \frac{10\text{ ms}}{2.273\text{ ms}} = 4.4\text{ cycles}$$
  A $10\text{ ms}$ window shows $2.2$ and $4.4$ cycles respectively. Exactly 2 and 4 integer cycles would require a time window of $\frac{1}{110}\text{ s} \approx 9.091\text{ ms}$. Alternatively, a $50\text{ ms}$ window contains $11$ and $22$ cycles.
* **Correction Applied:**
  * Updated technical specifications to clarify that a $10\text{ ms}$ time window mathematically contains $2.2$ cycles at 220 Hz and $4.4$ cycles at 440 Hz (preserving the $2\times$ frequency doubling and horizontal wavelength compression).
  * Explicitly designated the canvas rendering as an **illustrative, normalized educational oscilloscope**, where doubling frequency doubles the visible crests on screen.
  * Corrected acceptance test criteria (`TC-PHY-02`, `TC-PHY-10`) to check for the doubling of wave cycles ($2.2 \rightarrow 4.4$ or normalized schematic cycles) rather than claiming an incorrect integer count.
* **Files Corrected:** `modules_deep_dive/PHYSICS_SOUND_DETECTIVE_SPEC.md`, `modules_deep_dive/PHYSICS_SOUND_DETECTIVE_ACCEPTANCE_TESTS.csv`, `learning_flow/SHARED_LEARNING_FLOW_SPEC.md`, `ui_design_system/COMPONENT_SPEC.md`, `content_design/FOUR_MODULE_CONTENT_SPEC.md`, `qa_test_plan/ACCEPTANCE_TEST_MATRIX.csv`, `qa_test_plan/DEMO_SMOKE_TEST.md`.

---

### 3.2 National Education Statistics (UDISE+ Table 7.23 & ASER) (Correction ID: CORR-HI-02)
* **Previous Flawed Claim:**
  * Asserted that UDISE+ 2023–24 shows "50.2% of rural government secondary schools lack functional science labs" and "58.8% of rural schools lack internet."
  * Asserted that ASER 2023 shows "89% of households own a smartphone but only 57% use them for educational tasks."
* **Factual Reality:**
  * **UDISE+ 2024–25 Table 7.23:** The Department of School Education & Literacy ([UDISE+ 2024–25 Report](https://www.education.gov.in/sites/upload_files/mhrd/files/statistics-new/UDISE%2BReport%202024-25%20-%20Existing%20Structure.pdf)) publishes data on *reported facility availability*, not empirical *functional status*, equipment maintenance, or consumable availability. In Table 7.23 (Facilities available in schools with secondary sections, All India):
    * Across **All Managements**, an integrated science-lab facility was reported as available in **57.1%** of schools with secondary sections (leaving 42.9% without this facility).
    * Among **Government** management schools with secondary sections, an integrated science-lab facility was reported as available in **51.7%** (leaving 48.3% without this dedicated facility space).
    * Across government schools nationally, internet facility is available in **58.6%** (leaving 41.4% without internet). Neither table establishes the specific "rural-only" percentages claimed in earlier drafts. Untraceable subgroup claims must be labeled unverified.
  * **ASER 2023 ("Beyond Basics"):** Surveyed rural adolescents aged 14–18. **89.0%** of surveyed youth had a smartphone at home. Among the youth who stated they could use a smartphone, **66.1%** reported engaging in at least one educational activity (such as studying, watching educational videos, or solving doubts) during the reference week. The previous claim of "only 57% educational use" misquoted the denominator and distorted the finding.
* **Correction Applied:**
  * Replaced imprecise and conflated statistics with exact UDISE+ Table 7.23 and ASER 2023 data citations.
  * Clarified denominators: facility availability in schools with secondary sections (UDISE+ Table 7.23: 57.1% All Managements, 51.7% Government), and educational activities among smartphone-capable rural adolescents (ASER 2023).
  * Labeled untraceable subgroup percentages as unverified assumptions rather than authoritative national figures.
* **Files Corrected:** `synthesis/RESEARCH_SYNTHESIS.md`, `synthesis/CLAIMS_TO_VERIFY.csv`, `research_workspace/04_indian_educational_context.md`, `research_workspace/05_candidate_concepts_and_decision_framework.md`, `learning_science_review/LEARNING_SCIENCE_EVIDENCE_REVIEW.md`, `learning_science_review/LEARNING_SCIENCE_SOURCE_REGISTER.csv`, `india_context_research/INDIAN_EDUCATIONAL_CONTEXT_DOSSIER.md`, `india_context_research/PROBLEM_FRAMINGS_AND_EVIDENCE.csv`, `competitive_landscape/COMPETITIVE_GAPS_AND_UNMET_NEEDS.md`, `audit/SPEC_GAP_AUDIT.md`.

---

### 3.3 UI Control-Border Contrast & Accessibility (Correction ID: CORR-HI-03)
* **Previous Flawed Claim:** The design tokens specified `--color-border: #D9E0EB` for form controls, cards, and buttons, claiming the interface "passes WCAG AAA / AA contrast."
* **Factual Reality:** `#D9E0EB` against a white background (`#FFFFFF`) produces a contrast ratio of only **1.33:1 to 1.38:1**. W3C WCAG 2.1 Success Criterion 1.4.11 (Non-text Contrast) requires a minimum ratio of **3:1** against adjacent colors for visual boundaries of essential user interface components if the border is the primary visual cue.
* **Correction Applied:**
  * Defined a dedicated high-contrast control border token: `--color-border-control: #6B7280` (recalculated at **4.83:1** against `#FFFFFF` and **4.51:1** against `#F5F7FB`, comfortably exceeding the 3:1 WCAG AA non-text threshold). Retained `#D9E0EB` strictly for non-essential structural dividers.
  * Required that buttons and inputs utilize dual affordances (distinct solid background fills `#FFFFFF` or `#F5F7FB`, clear typographic labels, and prominent $3\text{ px}$ focus rings `#275DDB`), ensuring usability does not rely solely on border contrast.
  * Removed premature claims of WCAG certification; reclassified accessibility goals as **design targets** to be audited on rendered viewports with automated tooling (Lighthouse / axe-core) during the build.
* **Files Corrected:** `ui_design_system/DESIGN_TOKENS.md`, `ui_design_system/UI_SCREEN_CONTRACTS.md`, `ui_design_system/UI_ACCEPTANCE_CHECKLIST.md`, `ui_design_system/README.md`, `qa_test_plan/ACCESSIBILITY_AUDIT_CHECKLIST.md`, `qa_test_plan/ACCEPTANCE_TEST_MATRIX.csv`, `specs/05_ui_system_and_tokens.md`, `audit/STEM_AUDIT_REVIEW.md`, `audit/SOURCE_OF_TRUTH.md`.

---

### 3.4 Mathematics: Pesticide Context, Input Bounds & Ratio Validation (Correction ID: CORR-HI-04)
* **Previous Flawed Specification:**
  * Mathematics Exit Check 1 asked students to calculate mixing 30 liters of neem spray in a $1 : 5$ ratio for agricultural pest control. In rural communities, informal or incorrect pesticide/spray formulations can pose real-world chemical safety hazards.
  * Input boundaries were hard-clamped to a fixed maximum of $12$ (`$0 \le \text{alloc} \le 12$`), directly conflicting with State 2 exercises ($T = 24$) and Exit Check 2 (24 notebooks).
  * Specifications lacked explicit ratio validation separate from the total sum invariant, allowing non-proportional sums to pass.
* **Correction Applied:**
  * Replaced the agricultural pesticide spray question with a completely neutral, safe educational scenario: mixing 30 liters of clay slurry for a school craft workshop using powdered clay and water in a $1 : 5$ ratio ($30 \div 6 = 5\text{ L}$ clay powder).
  * Replaced the hardcoded $0–12$ clamp with dynamic input bounds $[0, T]$, where $T$ is the total capacity defined for the current exercise ($T = 12$ for State 1, $T = 24$ for State 2).
  * Enforced dual verification logic: the submission must satisfy BOTH the total sum ($\sum alloc = T$) AND the target ratio ($A : B : C = 1 : 2 : 3$). For $T = 12$, an allocation of $2, 4, 6$ is valid; an allocation of $1, 5, 6$ sums to 12 but must fail the ratio check with targeted feedback that Plot B must be twice Plot A and Plot C must be three times Plot A.
* **Files Corrected:** `content_design/FOUR_MODULE_CONTENT_SPEC.md`, `content_design/ANSWER_KEY_AND_FEEDBACK.csv`, `learning_flow/SHARED_LEARNING_FLOW_SPEC.md`, `ui_design_system/UI_SCREEN_CONTRACTS.md`, `audit/SPEC_GAP_AUDIT.md`, `specs/02_screen_and_interaction_contracts.md`, `specs/03_four_subject_content_specifications.md`, `specs/04_shared_module_schema.md`, `qa_test_plan/ACCEPTANCE_TEST_MATRIX.csv`, `qa_test_plan/MANUAL_TEST_RUNBOOK.md`.

---

### 3.5 Chemistry pH Terminology (Correction ID: CORR-HI-05)
* **Previous Flawed Claim:** Chemistry content and answer keys asserted that "pH 11 is a strong base."
* **Factual Reality:** In chemical science, whether a base is "strong" refers to its complete ionic dissociation in water (such as $\text{NaOH}$ or $\text{KOH}$), whereas pH is a logarithmic measure of hydrogen ion concentration. A concentrated solution of a weak base (such as aqueous ammonia) can produce an alkaline pH of 11 without being chemically classified as a strong base.
* **Correction Applied:**
  * Replaced all occurrences of "pH 11 is a strong base" with introductory middle-school curriculum phrasing: **"pH 11 represents a basic / alkaline solution."**
* **Files Corrected:** `content_design/FOUR_MODULE_CONTENT_SPEC.md`, `content_design/ANSWER_KEY_AND_FEEDBACK.csv`, `specs/03_four_subject_content_specifications.md`.

---

### 3.6 Assessment Threshold vs. Question Count (Correction ID: CORR-HI-06)
* **Previous Flawed Claim:** Learning objectives across all four modules stated that learners would achieve "$\ge 80\%$ accuracy on exit-check transfer problems," while the specifications provided exactly 2 binary questions per module.
* **Factual Reality:** Two binary questions produce discrete scores of $0\%$ ($0/2$), $50\%$ ($1/2$), or $100\%$ ($2/2$). An $80\%$ threshold is mathematically impossible with 2 questions.
* **Correction Applied:**
  * Updated the mastery threshold across all four module objectives to a clear **"two-out-of-two (100%)" transfer mastery criterion**, or 1-out-of-2 (50%) for partial progress.
* **Files Corrected:** `content_design/FOUR_MODULE_CONTENT_SPEC.md`, `modules_deep_dive/PHYSICS_SOUND_DETECTIVE_SPEC.md`.

---

### 3.7 Chemistry Indicator Terminology, Neutral Water Sample & Pathogen Disclaimer (Correction ID: CORR-HI-07)
* **Previous Flawed Claims:**
  * Called synthetic testing paper "Universal Litmus Strip" and asserted neutral turns green (litmus turns purple at neutral, not green; Universal Indicator paper turns green at pH 7).
  * Designated "Pure Well Water (pH 7)" as a baseline natural substance (real well water contains dissolved minerals and is rarely exactly pH 7.0).
  * Categorically stated that biological pathogens do not alter pH.
* **Correction Applied:**
  * Replaced "Universal Litmus Strip" with **"Universal Indicator Paper"** and an accurate, scientifically consistent color model (Red in acid $\rightarrow$ Green at neutral $\rightarrow$ Purple in alkaline; Turmeric: Yellow in acid/neutral $\rightarrow$ Deep Reddish-Brown in alkaline).
  * Replaced "Pure Well Water (pH 7)" with **"Distilled / Idealized Neutral Water (pH 7)"**.
  * Replaced categorical pathogen claims with the scientifically accurate statement: *"A pH test does not detect pathogens (bacteria, viruses, or parasites) and a reading of pH 7 does not establish water potability or biological safety."*
  * Preserved the permanently visible water-safety warning banner.
* **Files Corrected:** `content_design/FOUR_MODULE_CONTENT_SPEC.md`, `content_design/ANSWER_KEY_AND_FEEDBACK.csv`, `specs/02_screen_and_interaction_contracts.md`, `specs/03_four_subject_content_specifications.md`, `qa_test_plan/MANUAL_TEST_RUNBOOK.md`, `qa_test_plan/ACCEPTANCE_TEST_MATRIX.csv`, `audit/SOURCE_OF_TRUTH.md`, `india_context_research/INDIAN_EDUCATIONAL_CONTEXT_DOSSIER.md`.

---

## 4. Operational Inconsistencies Resolved

### 4.1 Language Scope Alignment (Correction ID: CORR-OPS-01)
* **Conflict:** Documents fluctuated between English+Hindi vs. English+Kannada vs. English+Hindi+Kannada.
* **Reconciled Decision:**
  * **English:** Primary language and 100% complete fallback for all copy.
  * **Kannada:** Included as draft localization strings in pre-event specifications, flagged as `[PENDING HUMAN REVIEW]`. To be verified by a native speaker before being exposed in production UI.
  * **Hindi:** Explicitly deferred outside the initial MVP scope to preserve developer velocity and prevent incomplete string keys during the hackathon.
* **Files Corrected:** `audit/DECISION_REGISTER.md`, `audit/BLOCKERS_BEFORE_EVENT.md`, `audit/SPEC_GAP_AUDIT.md`, `audit/REQUIREMENT_TRACEABILITY.csv`, `specs/07_engineering_preparation_and_risks.md`, `specs/01_product_requirements_prd.md`.

---

### 4.2 Multi-Student Profiles Deferral (Correction ID: CORR-OPS-02)
* **Conflict:** Architectural schemas introduced `profile_1` and `profile_2` switcher logic, while UI screen contracts and navigation bars omitted all profile-switching controls.
* **Reconciled Decision:**
  * **Deferred from MVP:** Profile switcher UI controls are deferred from the hackathon build window to keep the interface simple and focused.
  * **MVP Scope:** Single active local learner session stored anonymously in `localStorage` under a standard key prefix (`pocketlab_progress`).
  * The underlying data architecture remains extensible to multi-profile schemas in post-hackathon releases.
* **Files Corrected:** `audit/DECISION_REGISTER.md`, `audit/REQUIREMENT_TRACEABILITY.csv`, `specs/06_architecture_and_offline_engine.md`, `architecture_plan/OFFLINE_AND_PRIVACY_PLAN.md`, `architecture_plan/MODULE_INTERFACE_CONTRACT.md`, `synthesis/RESEARCH_SYNTHESIS.md`.

---

### 4.3 Accurate Competitor Framing (DIKSHA) (Correction ID: CORR-OPS-03)
* **Conflict:** Competitor landscape documents incorrectly portrayed the Government of India's DIKSHA platform as purely static, lacking offline access.
* **Reconciled Reality:** Official DIKSHA documentation confirms it provides guest access without mandatory login, offline download and playback on its mobile app, QR code integration in physical NCERT textbooks, and full multi-language support including Kannada.
* **Reconciled Decision:**
  * Anchored Gramin PocketLab's true competitive differentiator: an ultra-lean ($<2\text{ MB}$), interactive 7-step Predict-Observe-Explain (POE) guided inquiry loop featuring real-time 2D Canvas micro-simulations, synthetic audio exploration, and instantaneous misconception-targeted feedback—delivering active scientific cognition where video-based or static document platforms offer only passive consumption.
* **Files Corrected:** `competitive_landscape/COMPETITIVE_PRODUCT_MATRIX.md`, `competitive_landscape/USER_JOURNEY_MAPS.md`, `competitive_landscape/COMPETITIVE_GAPS_AND_UNMET_NEEDS.md`, `research_workspace/03_existing_products_landscape.md`, `synthesis/RESEARCH_SYNTHESIS.md`.

---

### 4.4 Heuristic Score & Performance Target Clarification (Correction ID: CORR-OPS-04)
* **Issue:** The $90.8/100$ score in synthesis documents conveyed false precision as if validated by third-party judging. In addition, metrics such as "sub-2MB footprint," "60 FPS," "zero latency," and "zero critical bugs" were stated as verified facts rather than unbuilt goals.
* **Correction Applied:**
  * Clarified that $90.8/100$ is an internal heuristic planning assessment derived from the team's preparation rubric, not an external validation or predictive guarantee.
  * Explicitly reclassified all technical benchmarks ($<2\text{ MB}$ bundle, 60 FPS animation, $<100\text{ ms}$ input response) as **engineering design targets and acceptance criteria**, to be verified strictly after implementation on physical hardware.
* **Files Corrected:** `synthesis/RESEARCH_SYNTHESIS.md`, `synthesis/README.md`, `audit/SPEC_GAP_AUDIT.md`.

---

### 4.5 Portable Relative Links (Correction ID: CORR-OPS-05)
* **Issue:** 57 absolute links formatted as `file:///c:/Users/priya/Downloads/STEM/...` were hardcoded across 15 README and audit files, breaking portability across developer workstations.
* **Correction Applied:**
  * Converted all 57 occurrences into portable relative markdown links (e.g. `(./SPEC_FILE.md)` or `(../specs/SPEC_FILE.md)`).
* **Files Corrected:** 15 files across `architecture_plan`, `audit`, `competitive_landscape`, `content_design`, `india_context_research`, `learning_flow`, `learning_science_review`, `modules_deep_dive`, `qa_test_plan`, `repo_intelligence`, `research_workspace`, `specs`, `synthesis`, `team_coordination`, `ui_design_system`.

---

### 4.6 Research Citation DOI Correction (Correction ID: CORR-OPS-06)
* **Issue:** The meta-analysis by Wisniewski, Zierer, & Hattie (2020) in *Frontiers in Psychology* was cited in earlier drafts with the typo DOI `10.3389/fpsyg.2019.03008` (and abbreviated journal citation `Front Psychol 10: 3008`).
* **Correction Applied:**
  * Corrected DOI to the official article record: **`10.3389/fpsyg.2019.03087`** across all four citation locations.
* **Files Corrected:** `synthesis/CLAIMS_TO_VERIFY.csv`, `research_workspace/05_candidate_concepts_and_decision_framework.md`, `research_workspace/01_learning_science_dossier.md`, `learning_science_review/LEARNING_SCIENCE_SOURCE_REGISTER.csv`.

---

### 4.7 Conservative 21-Hour Timeline & Organizer Check (Correction ID: CORR-OPS-07)
* **Context:** The public listing describes the hackathon as a 24-hour event, but publishes a schedule from 8:00 AM on November 17 to 5:00 AM on November 18 (21 elapsed hours).
* **Correction Applied:**
  * Locked team build planning to a conservative 21-hour window to protect against registration bottlenecks, logistics, and meal breaks.
  * Added mandatory check upon arrival: confirm exact submission deadline, judging presentation format, and multi-subject evaluation rules with organizers.
* **Files Corrected:** `team_coordination/BUILD_WINDOW_PLAN.md`, `synthesis/BUILD_WINDOW_PLAN.md`, `specs/07_engineering_preparation_and_risks.md`, `audit/BLOCKERS_BEFORE_EVENT.md`.

---

## 5. Verification Matrix Summary

| Correction Area | Priority | Target Status | Workspace Implementation |
| :--- | :---: | :---: | :---: |
| Audio Safety dBFS Claims | P0 | Completely Removed | Replaced with software gain ceiling + volume controls + physical testing |
| PhET Licensing Terms | P0 | Updated to CC BY-NC 4.0 | Adopted 100% original canvas visualisations policy (proposed MIT license) |
| Waveform Cycle Mathematics | High | Reconciled (2.2 & 4.4 cyc) | Labeled as illustrative/normalized canvas; updated acceptance tests |
| UDISE+ / ASER Statistics | High | Exact Citations Applied | Clarified denominators; marked unverified subgroups |
| UI Control-Border Contrast | High | Enhanced Token (>=3:1) | Defined `--color-border-control: #6B7280` (4.83:1 on white, 4.51:1 on #F5F7FB); testing required |
| Maths Ratio Validation & Bounds | High | Sum + Ratio ($1, 5, 6$ fails) | Neutral clay scenario; dynamic bounds $[0, T]$; dual sum and ratio check |
| Chemistry pH 11 Wording | High | Replaced with Basic/Alkaline | Chemically accurate for introductory curriculum |
| Chemistry Indicator & Safety | High | Universal Indicator + Banner | Idealized neutral water; accurate pathogen disclaimer & warning banner |
| Assessment 80% Threshold | High | Replaced with 2-out-of-2 | Mathematically consistent with 2-question exit checks |
| Language Reconciliation | High | English Primary + Kannada Draft | Hindi deferred outside MVP scope |
| Profile Switcher Deferral | Medium | Defer to Post-MVP | Scoped to single local session in `localStorage` under `pocketlab_progress` |
| Competitor (DIKSHA) Framing | Medium | Objectively Documented | Centered differentiation on 7-step POE cycle & interactive sims |
| Heuristic Score (90.8/100) | Medium | Labeled Heuristic Target | Performance metrics labeled engineering design targets |
| Machine-Specific Links | Medium | 100% Relative Links | All 57 `file:///` links converted to portable paths |
| Feedback Paper DOI | Low | Corrected typo 03008 to 03087 | Updated across all 4 reference files |
| Pre-Event Code Boundary | Invariant | Maintained (Zero Code) | `app/` contains strictly `app/manifest.json` and `app/assets/icon.svg` |
