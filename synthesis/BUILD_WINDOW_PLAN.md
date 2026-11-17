# CONSERVATIVE 21-HOUR BUILD WINDOW EXECUTION PLAN

**Document ID:** SYNTHESIS-BUILD-PLAN-V2  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Event:** STEM for Impact 2026, Presidency University, Bengaluru  
**Role:** Independent Synthesis Lead & Technical Project Manager  
**Planning Assumption:** Conservative 21-hour effective build window (accounting for 3 hours of opening ceremonies, meal logistics, registration bottlenecks, and submission deadlines).  

---

## 1. 21-Hour Phased Execution Timeline

```
+---------------------------------------------------------------------------------------------------+
| PHASE 1: SCAFFOLDING & DESIGN SYSTEM TOKENS               | TIMELINE: Hours 00:00 - 02:30        |
+---------------------------------------------------------------------------------------------------+
| Goal: Complete project environment setup, CSS custom property tokens, and navigation shell.       |
| - Dev 1 (Lead): Initialize repo, index.html skeleton, app.js event bus, and store.js.            |
| - Dev 4 (UI/UX): Implement DESIGN_TOKENS.md (colors, radii, spacing, 48px touch targets).        |
| - Dev 5 (QA/Content): Validate content/i18n.json schema against ANSWER_KEY_AND_FEEDBACK.csv.      |
| Gate 1 Checkpoint: Blank shell loads with high-contrast tokens and navigation header.             |
+---------------------------------------------------------------------------------------------------+

+---------------------------------------------------------------------------------------------------+
| PHASE 2: FLAGSHIP VERTICAL SLICE (PHYSICS - SOUND LAB)     | TIMELINE: Hours 02:30 - 06:30        |
+---------------------------------------------------------------------------------------------------+
| Goal: Build a complete, functional end-to-end mission for Physics (Sound Detective).              |
| - Dev 1: Wire 7-step inquiry lifecycle state machine (Intro -> Predict -> Explore -> Exit).       |
| - Dev 2 (Physics): Implement Web Audio tone generator (220 Hz vs. 440 Hz) and 60 FPS canvas.     |
| - Dev 2: Wire synchronous mobile audio unlock gesture and optional non-blocking mic listener.     |
| - Dev 5: Test on real physical Android smartphone (verify audio output and canvas scaling).       |
| Gate 2 Checkpoint: Complete working demo of Physics mission ready by Hour 6:30!                  |
+---------------------------------------------------------------------------------------------------+

+---------------------------------------------------------------------------------------------------+
| PHASE 3: PARALLEL SUBJECT MODULE IMPLEMENTATION           | TIMELINE: Hours 06:30 - 12:00        |
+---------------------------------------------------------------------------------------------------+
| Goal: Implement the remaining three interactive modules concurrently using strict interfaces.     |
| - Dev 2 (Chemistry): Build pH Color Lab (beakers, turmeric reactions, permanent safety banner).   |
| - Dev 3 (Math): Build Water Share Challenge (steppers, sum invariant 12, ratio validation 2,4,6).|
| - Dev 3 (Biology): Build Food Web Explorer (6-node SVG graph, trophic cascade toggles, text list).|
| - Dev 1: Implement Cache-First Service Worker and anonymous local profile persistence.            |
| - Dev 4: Responsive stress testing at 360px and 768px viewports; mobile sticky action bar offsets.|
| Gate 3 Checkpoint: All 4 subject micro-labs interactive and integrated into the shell.            |
+---------------------------------------------------------------------------------------------------+

+---------------------------------------------------------------------------------------------------+
| PHASE 4: SYSTEM INTEGRATION & FORMATIVE ASSESSMENTS       | TIMELINE: Hours 12:00 - 16:30        |
+---------------------------------------------------------------------------------------------------+
| Goal: Wire all 16 prediction, explanation, targeted retry, and exit check questions.              |
| - Dev 1 & Dev 5: Hook up misconception feedback scripts (misconception map) and retry branching.  |
| - Dev 4: Perform WCAG 2.1 contrast and keyboard focus outline audit across all screens.           |
| - Dev 3 & Dev 2: Polish visual feedback animations and non-color text status indicators.          |
| Gate 4 Checkpoint: Full end-to-end 7-step learning journey executable across all 4 subjects.      |
+---------------------------------------------------------------------------------------------------+

+---------------------------------------------------------------------------------------------------+
| PHASE 5: HARDWARE VERIFICATION & AIRPLANE MODE TESTING    | TIMELINE: Hours 16:30 - 19:00        |
+---------------------------------------------------------------------------------------------------+
| Goal: Run all 37 tests from ACCEPTANCE_TEST_MATRIX.csv on physical budget Android hardware.      |
| - Dev 5 (QA): Execute TC-GEN-01 through TC-RES-05; record results.                                |
| - Whole Team: Test complete application in Airplane Mode (offline cache verification).            |
| - Dev 1: Resolve any detected edge cases (storage quota fallback, audio suspension glitches).     |
| Gate 5 Checkpoint: Zero critical bugs; verified offline pass after initial cache installation on physical test devices. |
+---------------------------------------------------------------------------------------------------+

+---------------------------------------------------------------------------------------------------+
| PHASE 6: CODE FREEZE, DOCUMENTATION & PRESENTATION REHEARSAL | TIMELINE: Hours 19:00 - 21:00     |
+---------------------------------------------------------------------------------------------------+
| Goal: Absolute code freeze. Prepare submission artifacts and rehearse 3-minute judging pitch.    |
| - Whole Team: Hard code freeze (zero git commits to core application).                            |
| - Dev 1 & Team Captain: Finalize submission README, open-source disclosures, and video recording. |
| - Team Captain: Rehearse 3-minute judging smoke test (DEMO_SMOKE_TEST.md) using Airplane Mode.    |
| Final Checkpoint: Submission submitted 30 minutes before official deadline!                       |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Unresolved Pre-Event Questions & Organizer Actions

1. **Rule Confirmation at Registration:**  
   * *Action:* Team Captain will ask the event organizers at registration: *"Our submission tackles Physics (Sound Detective) as our core flagship demonstration, supported by a modular platform demonstrating Math, Biology, and Chemistry. Does this satisfy the single-subject focus rule?"*  
   * *Fallback:* If organizers strictly insist on a single subject, the platform can easily hide the subject selection menu and present Sound Detective as a standalone experience.
2. **Kannada Translation Review:**  
   * *Action:* Dev 5 will have a native Kannada-speaking volunteer or educator review the draft strings in `content/i18n.json` prior to Hour 12.
