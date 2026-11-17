# CONSERVATIVE 21-HOUR BUILD WINDOW PLAN — EXECUTION SCHEDULE

**Document ID:** TEAM-BUILD-PLAN-V2  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Event:** STEM for Impact 2026, Presidency University, Bengaluru  
**Role:** Integration Coordinator & Technical Delivery Lead  
**Planning Horizon:** Conservative 21-hour effective build window (buffer-safe against venue logistics and registration delays).  

---

## 1. Sequential Priority Hierarchy

To guarantee a winning, flawless submission, the team executes strictly in the following priority order:
1. **Priority 1 (Hours 00:00–02:30):** Shared working journey & application shell.
2. **Priority 2 (Hours 02:30–06:30):** Flagship vertical slice (Physics: Sound Detective) fully operational on mobile hardware.
3. **Priority 3 (Hours 06:30–12:00):** One real, meaningful interaction for each remaining subject (Math, Biology, Chemistry).
4. **Priority 4 (Hours 12:00–16:30):** Correct formative feedback, misconception scaffolding, and exit checks across all subjects.
5. **Priority 5 (Hours 16:30–19:00):** Real device hardware testing, Service Worker caching, and Airplane Mode verification.
6. **Priority 6 (Hours 19:00–21:00):** Hard code freeze, submission documentation, and 3-minute pitch rehearsal.

---

## 2. Chronological Hour-by-Hour Execution Grid

| Elapsed Window | Phase | Primary Objectives & Activities | Checkpoint / Gate Deliverable |
| :---: | :--- | :--- | :--- |
| **00:00 - 01:00** | Environment Setup | Initialize git repository; establish `index.html`, `index.css`, `app.js` skeletons; verify local HTTP server. | Git repo initialized; branch protection active. |
| **01:00 - 02:30** | Shell & Tokens | Implement design tokens (colors, $48\text{ px}$ targets); render S0 Home Map with 4 subject cards. | **Checkpoint 1:** S0 renders 4 cards cleanly; transitions to S1. |
| **02:30 - 04:30** | Audio Flagship Lab | Implement Web Audio synthesizer ($220\text{ Hz}$ / $440\text{ Hz}$); build 60 FPS oscilloscope canvas; clamp gain to $-3\text{ dBFS}$. | Audio plays on tap; canvas compresses wave $2\times$ at $440\text{ Hz}$. |
| **04:30 - 06:30** | Physics 7-Step Wire | Connect Physics prediction, explanation, and exit check questions into shared 7-step state machine. | **Checkpoint 2:** Full Physics flagship mission complete and verified on mobile. |
| **06:30 - 09:30** | Math & Bio Parallel | Dev 3 builds Math water steppers ($0–12$, sum invariant); Dev 4 builds Biology SVG food web (trophic toggles). | Math validates $2, 4, 6$; Biology toggles cascade states. |
| **09:30 - 12:00** | Chem Lab & Storage | Dev 4 builds Chemistry pH lab (beakers, turmeric dip, safety disclaimer); Dev 1 wires `localStorage` profile store. | **Checkpoint 3:** All 4 micro-labs merged and interactive in master. |
| **12:00 - 14:30** | Formative Feedback | Wire targeted misconception feedback scripts and changed retry problems from `ANSWER_KEY_AND_FEEDBACK.csv`. | Formative diagnostic checks operational across all 4 subjects. |
| **14:30 - 16:30** | Offline ServiceWorker | Dev 1 implements Cache-First Service Worker; caches static bundle ($<2\text{ MB}$); Dev 5 audits Kannada text. | **Checkpoint 4:** Complete bundle cached; app runs in Airplane Mode. |
| **16:30 - 18:00** | Multi-Device QA | Run all 37 acceptance tests on physical budget Android hardware; test touch ergonomics at $360\text{ px}$. | Zero critical bugs; all 37 test rows executed. |
| **18:00 - 19:00** | Bug Fixes & Polish | Address minor layout glitches, focus rings, or contrast edge cases; verify zero console warnings. | Clean console pass; zero unhandled errors. |
| **19:00 - 20:00** | **Hard Code Freeze** | **ZERO CODE COMMITS.** Finalize submission README, open-source disclosures, and architecture documentation. | Codebase locked on master branch; submission drafted. |
| **20:00 - 21:00** | Pitch Rehearsal | Team Captain rehearses 3-minute judging smoke test (`DEMO_SMOKE_TEST.md`) in Airplane Mode; final submission. | Project submitted 30 minutes before official deadline. |

