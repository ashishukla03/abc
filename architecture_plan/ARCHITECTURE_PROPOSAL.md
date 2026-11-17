# TECHNICAL ARCHITECTURE PROPOSAL — GRAMIN POCKETLAB

**Document ID:** ARCH-PROPOSAL-V2  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Event:** STEM for Impact 2026, Presidency University, Bengaluru  
**Role:** Senior Front-End Architect & Open-Source Compliance Reviewer  
**Status:** Pre-Event Architecture Proposal (Zero Runtime Code Authored)  

---

## 1. Existing Workspace Stack Inspection

Prior to proposing the system architecture, the local workspace environment was rigorously inspected:
* **Workspace Path:** `c:\Users\priya\Downloads\STEM`
* **Current Workspace Contents:** 
  * `STEM Education Hackathon_ Research & Strategy.pdf` (Strategy brief).
  * `research_workspace/` (Dossiers 01–05).
  * `specs/` (System specifications 01–07).
  * `audit/` (Specification Gap Audit & Decision Register).
  * `content_design/` (Module content specs, CSV keys, misconception map).
  * `ui_design_system/` (Design tokens, component specs, responsive layouts).
* **Package Manager & Framework Presence:**
  * There are **zero `package.json` files, zero build tools (no Vite/Webpack), zero node_modules, and zero active runtime frameworks** in the current workspace directory.
* **Architecture Recommendation:**
  * Rather than introducing heavy framework build overheads that can fail during a 21-hour hackathon, we recommend **Modern Vanilla JavaScript (ES6 Modules) + HTML5 + CSS Custom Properties**, with an optional drop-in of **Vite + TypeScript** only if the team agrees on a standard Node 20+ build pipeline.
  * For maximum resilience on budget hardware, zero-dependency native browser APIs are prioritized.

---

## 2. Core Architectural Principles & System Decomposition

Gramin PocketLab is architected as **one unified Progressive Web App (PWA)** with a shared core learning engine, strictly decoupling the domain-specific interactive models from the global learning state machine:

```
+-----------------------------------------------------------------------------------------+
|                                    APPLICATION SHELL                                    |
|   +---------------------------------------------------------------------------------+   |
|   |  TopAppBar: Brand | Offline Status Pill | Subject Selector | Step Stepper | Mute|   |
|   +---------------------------------------------------------------------------------+   |
|                                                                                         |
|   +---------------------------------------------------------------------------------+   |
|   |                       SHARED LEARNING FLOW ENGINE (StateMachine)                |   |
|   |   S0 (Map) -> S1 (Intro) -> S2 (Predict) -> S3 (Explore) ->                     |   |
|   |   S4 (Understand) -> S5 (Feedback/Retry) -> S6 (Exit Check/Result)              |   |
|   +---------------------------------------------------------------------------------+   |
|                                            |                                            |
|                  +-------------------------+-------------------------+                  |
|                  |                         |                         |                  |
|                  v                         v                         v                  |
|   +--------------------------+  +--------------------------+  +---------------------+   |
|   | MathWaterAllocator       |  | BioFoodWebExplorer       |  | ChemPhColorLab      |   |
|   | - Proportional Steppers  |  | - Directed SVG Graph     |  | - Virtual Beakers   |   |
|   | - Invariant Sum Validator|  | - Trophic Cascade Rules  |  | - Indicator Strips  |   |
|   +--------------------------+  +--------------------------+  +---------------------+   |
|                  |                                                           |          |
|                  +-----------------------------------------------------------+          |
|                                            |                                            |
|                                            v                                            |
|                               +--------------------------+                              |
|                               | PhysSoundDetective       |                              |
|                               | - Web Audio Synthesizer  |                              |
|                               | - 60 FPS Oscilloscope    |                              |
|                               | - Optional Mic Listener  |                              |
|                               +--------------------------+                              |
|                                            |                                            |
|   +---------------------------------------------------------------------------------+   |
|   |                             LOCAL INFRASTRUCTURE                                |   |
|   |  [ LocalStorage Manager ]      [ Web Audio Context ]      [ Service Worker Cache]   |   |
|   |  - Single Anonymous Session    - Clamped GainNode         - Cache-First (PWA)       |   |
|   |  - Step State Persistence      - Master Mute              - Fallback Offline Shell  |   |
|   +---------------------------------------------------------------------------------+   |
+-----------------------------------------------------------------------------------------+
```

---

## 3. Subsystem Breakdown & Boundary Isolation

### 3.1 The Shared Learning Flow Engine (`engine.js`)
* **Role:** Manages the sequential progression through the canonical 7-step lifecycle.
* **Decoupling Guarantee:** The engine does not know the internal mechanics of water math, food webs, chemical reactions, or audio waves. It only communicates with modules via the formal `StemMissionModule` contract (defined in `MODULE_INTERFACE_CONTRACT.md`).
* **State Preservation:** Navigating between steps (e.g. going from S3 back to S2) retains all learner answers in memory and `localStorage`.

### 3.2 Parallel Subject Modules (`modules/*.js`)
* Each subject is isolated in its own self-contained module directory:
  * `modules/math.js`
  * `modules/biology.js`
  * `modules/chemistry.js`
  * `modules/physics.js`
* **Independence Rule:** Four team developers can build and test their interactive widgets in parallel without touching the shared navigation or assessment runner.

### 3.3 Audio Subsystem Architecture (Physics Flagship)
* **Tone Generation Graph:**
  ```
  OscillatorNode (sine, 220Hz / 440Hz)
        │
        ▼
  GainNode (software clamped to max 0.70 / -3 dBFS to prevent digital clipping/distortion)
        │
        ▼
  AnalyserNode (fftSize: 2048, time-domain buffer export)
        │
        ▼
  AudioContext.destination (Device Speaker / Headphones)
  ```
* **User Gesture Contract:** `AudioContext` is created in `'suspended'` mode. It is resumed strictly within a synchronous click/touchend handler to comply with Android Chrome and iOS Safari autoplay restrictions.
* **Microphone Progressive Enhancement:**
  * Strictly optional and non-blocking.
  * If permission is granted: Streams mic input into the `AnalyserNode`.
  * If permission is denied or dismissed: Gracefully falls back to the synthetic oscillator without error modals or blocking lesson completion.
  * **Strict Privacy Rule:** Microphone input is processed strictly in volatile memory. No audio streams or audio files are recorded, serialized, or transmitted. When leaving the physics screen, `stream.getTracks().forEach(track => track.stop())` is called immediately.

---

## 4. Minimum Vertical Slice to Build First During Event

To guarantee a working submission within the conservative 21-hour window, the team must execute in strict dependency order:

```
[ Hour 00:00 - 03:00 ] ---> MINIMUM VERTICAL SLICE (Flagship Deliverable)
                             1. Setup App Shell & Design System Tokens.
                             2. Implement 7-step Learning State Machine.
                             3. Wire Physics Mission (Sound Detective):
                                - Web Audio tone generator (220 Hz vs. 440 Hz).
                                - 60 FPS Oscilloscope canvas.
                                - Prediction, Explanation, and Exit Check questions.
                             4. Verify on real Android hardware.
                             --> Outcome: A complete, fully functional standalone flagship product!

[ Hour 03:00 - 08:00 ] ---> PARALLEL MODULE EXPANSION
                             - Dev 2: Chemistry pH Color Lab (Beakers, turmeric reactions, safety disclaimers).
                             - Dev 3: Math Water Allocator (Steppers, sum checks) & Biology Food Web (SVG graph).
                             - Dev 1: Wire Service Worker offline caching & LocalStorage profile persistence.

[ Hour 08:00 - 14:00 ] ---> SYSTEM INTEGRATION & VERIFICATION
                             - Connect all 4 modules into the unified shell.
                             - Run the 11 Acceptance Tests in Airplane Mode.
```
