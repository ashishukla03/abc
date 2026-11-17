# Engineering Preparation, Team Division & Risk Register — Gramin PocketLab

**Document ID:** SPEC-ENG-PREP-V2  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Event:** STEM for Impact 2026 (Presidency University, Bengaluru)  
**Status:** Pre-Event Specification  

---

## 1. Acceptance Test Matrix

Every feature in the eventual MVP has an observable behavior and explicit test case:

| Test ID | Mission / Module | Input Condition / Action | Expected Observable Behavior | Pass/Fail Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **TEST-GEN-01** | Global Navigation | Click Subject Cards on Home Screen | Active mission changes; step reset to 1; banner updates to subject accent color. | Observable view transition; no unhandled JS errors. |
| **TEST-GEN-02** | Offline PWA | Load app once, toggle browser to Offline (or Airplane Mode), refresh page | App loads instantly from ServiceWorker cache; top bar displays "Running Offline" badge. | All 4 subject missions fully interactive without network requests. |
| **TEST-GEN-03** | Local Storage Persistence | Complete Math mission, refresh page or relaunch browser | Mission badge earned displays on Home screen; progress persists under pocketlab_progress key. | Anonymous state persisted cleanly across page reloads without PII. |
| **TEST-MTH-01** | Math Lab (Ratios) | Allocate 4, 4, 4 to plots A, B, C and click "Test Distribution" | UI blocks advance; displays feedback explaining Plot B needs double Plot A. | Sum verified; ratio non-equivalence flagged. |
| **TEST-MTH-02** | Math Lab (Ratios) | Allocate 2, 4, 6 to plots A, B, C | UI validates ratio 1:2:3 and sum 12; reveals celebratory animation and enables "Continue". | State advances to Step 4. |
| **TEST-BIO-01** | Biology (Food Web) | Click "Remove Snakes" toggle | Snake node dims; Frog node updates to "Overpopulated"; Grasshopper node updates to "Declining". | Visual graph and text status accurately reflect trophic cascade. |
| **TEST-CHM-01** | Chemistry (pH Lab) | Select Soap Solution and dip Natural Turmeric Paper | Virtual indicator strip shifts from yellow to deep reddish-brown; pH scale highlights illustrative pH 10.0 (Basic); non-color badge displays Basic / Deep Reddish-Brown. | Distinct color shift observed; text badge displays basic status. |
| **TEST-CHM-02** | Chemistry (Safety) | Observe Chemistry Lab screen | Permanent notice banner clearly visible: "A pH test does not detect pathogens (bacteria, viruses, or protozoa) or toxic dissolved chemicals, and a reading of pH 7.0 does not establish water potability or biological safety." | Explicit disclaimer rendered. |
| **TEST-PHY-01** | Physics (Acoustics) | Click "Play Tone" at 220 Hz, then switch to 440 Hz preset | Audible pitch rises by one octave; canvas waveform frequency visually doubles (peaks compress). | Sound generated; canvas reflects $2\times$ frequency. |
| **TEST-PHY-02** | Physics (Amplitude) | Move amplitude slider from 20% to 90% at constant 440 Hz | Sound volume increases; waveform peak height expands vertically; horizontal peak spacing constant. | Frequency and amplitude visually decoupled. |
| **TEST-PHY-03** | Physics (Mic Fallback) | Deny microphone permission when prompted | Friendly toast: "Mic optional; synthetic tone generator active"; lab remains 100% playable. | Zero blocking modal; zero exception crash. |

---

## 2. Dependency & Licence Risk Register

| Dependency / Asset | Proposed Usage | Declared Licence | Potential Risk | Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **PhET Simulations** | Pedagogical inspiration only | CC BY-NC 4.0 (HTML sims) / GPL-3.0 & MIT (Source) | Commercial reuse restrictions; heavy SceneryStack dependency bloat. | **Do NOT bundle PhET source or HTML bundles**. Build 100% original lightweight 2D Canvas micro-simulations under MIT, treating PhET solely as inspiration. |
| **Phyphox Code / Name** | Sensor physics inspiration | GPL-3.0; Trademarks strictly reserved by RWTH Aachen. | Trademark infringement if "Phyphox" name/logo is used; GPL viral constraints. | **Do NOT use Phyphox code or branding**. Implement pure Web Audio API and standard W3C Web Sensor listeners independently under MIT. |
| **Mathigon Euclid.js** | 2D Geometry primitives | MIT License | Unnecessary bundle weight if full library is imported. | Keep geometry calculations minimal using native HTML5 Canvas trigonometry. |
| **Lucide / SVG Icons** | Navigation & Subject Icons | ISC / MIT License | Zero risk. | Bundle as inline SVG symbols inside `index.html`. Zero network overhead. |

---

## 3. Five-Person Team Responsibility Division (Proposed Ownership)

To maximize velocity during the 24-hour hackathon, file ownership is cleanly divided:

| Team Member | Role Title | Core Ownership & File Boundary | Primary Hackathon Window Responsibilities |
| :--- | :--- | :--- | :--- |
| **Developer 1 (Lead)** | System Architect & Engine Lead | `app.js`, `service-worker.js`, `store.js` | Core learning state machine, 7-step lifecycle runner, PWA offline caching, single-learner anonymous local persistence. |
| **Developer 2** | Physics & Chemistry Lab Lead | `modules/physics.js`, `modules/chemistry.js`, `audio.js` | Web Audio synthesizer, live sine-wave canvas, mic fallback, pH indicator color reactions & disclaimers. |
| **Developer 3** | Math & Biology Lead | `modules/math.js`, `modules/biology.js` | Water allocation steppers/sum invariants, interactive food web node graph & trophic cascade state engine. |
| **Developer 4** | UI/UX & Design System Lead | `index.html`, `index.css`, `components/` | Responsive layout, color tokens, accessibility contracts (ARIA labels, focus outlines), mobile touch ergonomics. |
| **Developer 5** | Content, QA & Pedagogy Lead | `content/missions.json`, `test/manual_test_suite.md` | Question copy, NCERT alignment, Kannada translation review, running acceptance tests across test devices. |

---

## 4. Conservative 21-Hour Hackathon Timeline (Buffer-Safe)

Although the hackathon is advertised as 24 hours, events experience registration delays, meals, and setup overhead. We plan strictly against a **conservative 21-hour effective window**:

```
[00:00 - 02:00] Phase 1: Environment Setup & Scaffolding
- Initialize project repository; establish index.html, index.css, and app.js skeletons.
- Implement token palette and shared 7-step layout container.

[02:00 - 07:00] Phase 2: Core Engine & Physics Flagship Lab
- Build Web Audio tone generator (220 Hz / 440 Hz) and real-time waveform canvas.
- Complete full 7-step flow for Physics (Sound Detective). Verify audio on Android devices.

[07:00 - 12:00] Phase 3: Parallel Micro-Labs Implementation
- Dev 2: Build Chemistry pH Color Lab (solutions, indicator dip, safety banners).
- Dev 3: Build Math Water Allocator (sum invariants) and Biology Food Web (trophic toggles).
- Dev 1: Wire local profile persistence and ServiceWorker offline cache.

[12:00 - 16:00] Phase 4: Integration & Assessment Scaffolding
- Integrate all 4 subjects into the shared learning engine.
- Wire prediction, explanation, targeted retry, and exit check questions from schema.

[16:00 - 19:00] Phase 5: Verification, Accessibility & Airplane Mode Testing
- Run all 11 Acceptance Tests on real budget Android hardware (Redmi/Realme).
- Verify 100% functionality in Airplane Mode (offline cache verification).
- Perform Lighthouse audit (target $\ge 90$ Performance, $\ge 95$ Accessibility).

[19:00 - 21:00] Phase 6: Code Freeze, Documentation & Presentation Rehearsal
- Freeze all code changes.
- Finalize submission README, component disclosure statement, and 3-minute pitch deck.
```
