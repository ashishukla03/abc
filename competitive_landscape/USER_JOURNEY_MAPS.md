# USER JOURNEY MAPS — FIVE KEY BENCHMARK PRODUCTS

**Document ID:** COMP-JOURNEY-MAPS-V2  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Role:** Educational Product Analyst  
**Objective:** Deconstruct the exact end-to-end user journeys of the five most relevant educational platforms to identify friction points and pedagogical drop-offs.  

---

## 1. Journey Map 1: PhET Interactive Simulations (University of Colorado)

```
[ Step 1: Discovery ]
Learner or teacher searches simulation catalog (e.g. "Wave on a String" or "pH Scale").
         │
         ▼
[ Step 2: Open Sandbox ]
Launches single-page HTML5 simulation. Zero instructions or context displayed.
         │
         ▼
[ Step 3: Free Manipulation (The "Fiddle" State) ]
Learner moves sliders, changes frequency, drops probes, adds water.
*Pedagogical Breakpoint:* 70%+ unguided learners play aimlessly without discovering the governing formula.
         │
         ▼
[ Step 4: External Assessment (External Dependent) ]
Learner must switch to a physical printed paper worksheet provided by a teacher.
         │
         ▼
[ Step 5: Termination ]
Learner closes browser tab. Zero progress recorded, zero automated feedback provided.
```
* **Key Learning for Gramin PocketLab:** Keep the dynamic visual model, but **embed it inside a self-scaffolding 7-step sequence** so the student is never left unguided.

---

## 2. Journey Map 2: Khan Academy

```
[ Step 1: Course Selection ]
Learner selects "Class 8 Science" and navigates hierarchical topic tree to "Sound".
         │
         ▼
[ Step 2: Passive Video Streaming ]
Watches 8-minute recorded lecture video of instructor drawing on black canvas.
*Friction Point:* Video buffers, freezes, or fails completely on 2G/3G rural networks.
         │
         ▼
[ Step 3: Practice Exercises ]
Answers 4 multiple-choice or numeric text-entry questions.
         │
         ▼
[ Step 4: Feedback / Hint ]
If wrong, learner can click "Show Hint" to read the worked solution.
         │
         ▼
[ Step 5: Mastery Score ]
Earns energy points and mastery badge. System logs progress to cloud account.
```
* **Key Learning for Gramin PocketLab:** Eliminate the 8-minute streaming video bottleneck. Replace passive watching with an immediate **interactive 2D micro-lab** that runs with zero network latency.

---

## 3. Journey Map 3: Oppia Web Platform

```
[ Step 1: Lesson Selection ]
Learner opens lesson (e.g. "Fractions in Real Life").
         │
         ▼
[ Step 2: Conversational Dialogue ]
Animated tutor asks a question in text dialogue format with voice narration.
         │
         ▼
[ Step 3: Learner Response ]
Learner types an answer or selects a multiple-choice option.
         │
         ▼
[ Step 4: Misconception-Driven Branching Feedback ]
*The Gold Standard:* System evaluates the specific wrong answer. If learner made a common mistake
(e.g. adding numerators and denominators directly), tutor explains why that specific premise failed.
         │
         ▼
[ Step 5: Remedial Micro-Step ]
Tutor provides an altered, simpler problem to re-check understanding before moving forward.
```
* **Key Learning for Gramin PocketLab:** Borrow Oppia’s **branching misconception feedback**, but upgrade their text-heavy dialogue into **hands-on visual/audio interactive manipulations**.

---

## 4. Journey Map 4: DIKSHA (Ministry of Education, India)

```
[ Step 1: Physical Textbook QR Scan ]
Rural student or teacher points phone camera at QR code in physical NCERT science textbook.
         │
         ▼
[ Step 2: DIKSHA Portal Launch ]
App opens digital resource page linked to Chapter 13: Sound.
         │
         ▼
[ Step 3: Resource Consumption ]
Displays a 15-page scanned PDF document or streams an uploaded MP4 classroom recording.
*Friction Point:* Low cognitive engagement; PDF is hard to read on a 5-inch phone screen; video consumes mobile data.
         │
         ▼
[ Step 4: Summative Assessment ]
Student completes a 5-question end-of-chapter quiz with standard multiple-choice radios.
         │
         ▼
[ Step 5: Certificate / Completion ]
Displays static score (e.g. "3/5"). Zero targeted remediation for incorrect answers.
```
* **Key Learning for Gramin PocketLab:** DIKSHA owns universal distribution, but lacks interactive engagement. Gramin PocketLab acts as the missing **interactive experiential lab** that DIKSHA's static PDF/video platform fails to provide.

---

## 5. Journey Map 5: Kolibri (Learning Equality)

```
[ Step 1: Connect to Local Server ]
Student in an off-grid village school connects their tablet to the local classroom Wi-Fi hub.
         │
         ▼
[ Step 2: Profile Selection ]
Student selects their local profile or logs in anonymously.
         │
         ▼
[ Step 3: Offline Content Exploration ]
Browses pre-downloaded offline content channels (Khan Academy, PhET, localized books).
         │
         ▼
[ Step 4: Activity Completion ]
Completes offline quiz or simulation. Progress is saved locally to SQLite database.
         │
         ▼
[ Step 5: Local Peer-to-Peer Sync ]
When school server connects to an internet hotspot weekly, teacher syncs class progress.
```
* **Key Learning for Gramin PocketLab:** Adopt Kolibri's anonymous local session approach; multi-student local profile partitioning (`profile_1`, `profile_2`) is planned for the post-MVP roadmap to ensure the core single-session (`pocketlab_progress`) remains bulletproof.
