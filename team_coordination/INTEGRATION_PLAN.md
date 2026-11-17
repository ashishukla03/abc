# INTEGRATION PLAN & GIT REPOSITORY STRATEGY

**Document ID:** TEAM-INTEGRATION-PLAN-V2  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Event:** STEM for Impact 2026, Presidency University, Bengaluru  
**Role:** Integration Coordinator & Lead Architect  
**Objective:** Establish deterministic git branching, code review standards, and five sequential integration checkpoints for the 21-hour hackathon.  

---

## 1. Git Repository & Branching Strategy

To guarantee that broken experimental code never blocks the working demo, the team adheres strictly to a **Trunk-Based Feature Branch Model**:

```
[ master ]  <--- LOCKED: Only working, verified vertical slices merged here by Member 1
    │
    ├── [ feat/shell-tokens ]    ---> Member 1 & Member 5 (Hour 00:00 - 02:00)
    │
    ├── [ feat/flagship-physics ]---> Member 2 (Hour 02:00 - 06:00)
    │
    ├── [ feat/math-allocator ]  ---> Member 3 (Hour 06:00 - 10:00)
    │
    ├── [ feat/bio-foodweb ]     ---> Member 4 (Hour 06:00 - 10:00)
    │
    ├── [ feat/chem-ph-lab ]     ---> Member 4 (Hour 10:00 - 13:00)
    │
    └── [ feat/offline-pwa ]     ---> Member 1 (Hour 12:00 - 15:00)
```

### Git Rules & PR Governance
1. **Direct Pushes to `master` are Strictly Prohibited:** Every change must originate on a feature branch (`feat/<subject>-<feature>`).
2. **Mandatory Single Reviewer Sign-Off:** Member 1 (Integration Lead) must review and merge all PRs into `master`.
3. **The "Clean Console" Pre-Merge Invariant:** A PR will be rejected immediately if loading the branch produces any unhandled exceptions, failed network calls, or audio autoplay warnings in the browser console.

---

## 2. Five Sequential Integration Checkpoints

```
+---------------------------------------------------------------------------------------------------+
| CHECKPOINT 1: SHELL & TOKENS VALIDATION                   | DEADLINE: Hour 02:30                  |
+---------------------------------------------------------------------------------------------------+
| Scope: Master branch boots index.html, loads index.css design tokens, and displays S0 Mission Map.|
| Verification: S0 renders 4 subject cards cleanly; step navigation transitions from S0 to S1.       |
| Sign-off: Member 1 & Member 5.                                                                    |
+---------------------------------------------------------------------------------------------------+

+---------------------------------------------------------------------------------------------------+
| CHECKPOINT 2: FLAGSHIP VERTICAL SLICE (PHYSICS SOUND LAB) | DEADLINE: Hour 06:30                  |
+---------------------------------------------------------------------------------------------------+
| Scope: Full end-to-end 7-step learning journey executable for Physics (Sound Detective).          |
| Verification: 220 Hz and 440 Hz tones play on user tap; canvas renders 60 FPS sine waves; mic    |
| denial is non-blocking; prediction, explanation, and exit check questions evaluate accurately.   |
| Hardware Test: Verified on physical Android smartphone.                                           |
| Sign-off: Member 1 & Member 2.                                                                    |
+---------------------------------------------------------------------------------------------------+

+---------------------------------------------------------------------------------------------------+
| CHECKPOINT 3: PARALLEL MODULE INTEGRATION (MATH, BIO, CHEM)| DEADLINE: Hour 12:00                 |
+---------------------------------------------------------------------------------------------------+
| Scope: Math, Biology, and Chemistry modules merged into master via clean interface contracts.     |
| Verification: Math steppers clamp 0-12 and validate 2,4,6; Biology toggles trophic cascade;       |
| Chemistry changes turmeric color and displays permanent water safety disclaimer.                 |
| Sign-off: Member 1, Member 3 & Member 4.                                                          |
+---------------------------------------------------------------------------------------------------+

+---------------------------------------------------------------------------------------------------+
| CHECKPOINT 4: OFFLINE PWA & AIRPLANE MODE VERIFICATION    | DEADLINE: Hour 16:30                  |
+---------------------------------------------------------------------------------------------------+
| Scope: Service Worker registered; static bundle cached; single anonymous session operational.      |
| Verification: Demo phone placed in complete Airplane Mode; page refreshed; all 4 missions fully   |
| operational offline from cache; progress stores deterministically in localStorage.                |
| Sign-off: Member 1 & Member 5.                                                                    |
+---------------------------------------------------------------------------------------------------+

+---------------------------------------------------------------------------------------------------+
| CHECKPOINT 5: CODE FREEZE & DEMO REHEARSAL               | DEADLINE: Hour 19:00                  |
+---------------------------------------------------------------------------------------------------+
| Scope: Git repository frozen (zero code commits). 3-minute judging smoke test rehearsed.          |
| Verification: Team Captain executes DEMO_SMOKE_TEST.md in under 180 seconds with zero glitches.   |
| Sign-off: All 5 Team Members.                                                                     |
+---------------------------------------------------------------------------------------------------+
```

---

## 3. What Can Be Parallelized Safely

The architecture is explicitly decoupled to allow massive parallel development between Hours 06:30 and 12:00:
* **Completely Independent Workstreams:**
  * Member 2 focuses purely on Web Audio oscillator refinement and frequency slider responsiveness in `modules/physics.js`.
  * Member 3 focuses purely on stepper math and array ratio validation ($a:b:c$) in `modules/math.js`.
  * Member 4 focuses purely on SVG DOM nodes and trophic state toggle tables in `modules/biology.js` and `modules/chemistry.js`.
  * Member 5 focuses purely on writing localized Kannada strings and drafting acceptance test result sheets.
  * Member 1 works on the Cache-First Service Worker and single anonymous local session engine in `store.js` (multi-profile deferred to post-MVP).
* **Zero Collision Guarantee:** Because all module developers interact solely through the `SubjectInteractionHandler` contract, nobody modifies another developer's files.

