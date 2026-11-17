# ARCHITECTURE DECISION RECORDS (ADR) — GRAMIN POCKETLAB

**Document ID:** ARCH-ADR-V2  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Event:** STEM for Impact 2026, Presidency University, Bengaluru  
**Role:** Senior Front-End Architect  
**Status:** Architecture Decisions Finalized  

---

## ADR-01: Adoption of Zero-Build Native Web Stack (Vanilla ES6 Modules)

* **Context:** The hackathon provides a conservative 21-hour effective build window. Introducing complex bundlers (Webpack, Parcel) or heavy framework toolchains creates potential points of failure (e.g. node version mismatches, dependency resolution conflicts on teammate laptops, broken Vite build scripts).
* **Decision:** We adopt **Modern Vanilla JavaScript (ES6 Modules) + Native HTML5 + Vanilla CSS Custom Properties**.
* **Consequences:**
  * *Positive:* Zero npm installation delays; zero build compilation steps; app launches immediately by serving static files via any local HTTP server (Python `http.server` or VS Code Live Server); ultra-lean bundle size ($< 2\text{ MB}$).
  * *Negative:* No compile-time TypeScript type checking; requires manual adherence to interface contracts documented in `MODULE_INTERFACE_CONTRACT.md`.
* **Status:** **APPROVED**.

---

## ADR-02: Client-Only Architecture with Zero Cloud / Server Dependencies

* **Context:** Hackathon venue Wi-Fi networks in university auditoriums frequently suffer severe packet loss, bandwidth throttling, or complete outages. Products relying on cloud databases (Firebase, Supabase) or external AI APIs (OpenAI, Gemini) risk crashing during judge evaluations.
* **Decision:** Gramin PocketLab operates as a **100% Client-Side Application**. All state, evaluation logic, and asset caching live locally on the device.
* **Consequences:**
  * *Positive:* Resilient against venue Wi-Fi congestion and backend outages; instant response times; zero cloud hosting or token costs; zero child PII data risk. (Note: software operates robustly client-side, though absolute 100% operational uptime against local browser crashes cannot be promised).
  * *Negative:* Progress does not synchronize across separate physical devices.
* **Status:** **APPROVED**.

---

## ADR-03: Web Audio API for Safe Acoustic Synthesis

* **Context:** The Physics flagship mission ("Sound Detective") requires comparing $220\text{ Hz}$ and $440\text{ Hz}$ tones. Relying on pre-recorded MP3/WAV audio files inflates bundle size, introduces audio compression artifacts, and prevents smooth real-time frequency sliding.
* **Decision:** Use the native browser **W3C Web Audio API** with a synthetic `OscillatorNode` (`type: 'sine'`) routed through a software-clamped `GainNode` (max $0.70$ linear scale / $-3\text{ dBFS}$) and `AnalyserNode`. Pair with low default volume ($20\%–30\%$), strict user gesture unblock, prominent mute controls, and pre-judging physical handset sound level calibration.
* **Consequences:**
  * *Positive:* Zero audio asset download weight; mathematically precise frequency output; live waveform data buffer directly available for canvas plotting; software gain clamping mitigates digital DAC clipping distortion (though physical biological hearing safety and physical speaker protection cannot be guaranteed by software alone).
  * *Negative:* Requires explicit user gesture (`click`/`touchend`) to initialize/resume `AudioContext` on mobile browsers. Digital dBFS gain clamping does not guarantee physical biological hearing safety or prevent hardware speaker defects, making physical device volume checks necessary.
* **Status:** **APPROVED**.

---

## ADR-04: Progressive Microphone Enhancement with Reliable Fallback

* **Context:** Live microphone input on budget Android phones is prone to ambient noise, hardware clipping, and permission rejections by students or parents.
* **Decision:** Microphone input is treated strictly as an **optional progressive enhancement**. The mission defaults to and is designed to be fully completable using the synthetic tone generator. If mic permission is denied or dismissed, the application gracefully continues without blocking.
* **Consequences:**
  * *Positive:* High demo resilience against audio permission blocks or venue noise; protects student privacy; adheres to non-blocking UX principles.
  * *Negative:* Real-world acoustic capture is supplementary rather than mandatory.
* **Status:** **APPROVED**.

---

## ADR-05: Strict Avoidance of Monolithic / GPL-3.0 Codebases

* **Context:** PhET Interactive Simulations and Phyphox are prominent open-source benchmarks, but PhET's SceneryStack build system is too complex to compile in 21 hours, and Phyphox source code is GPL-3.0 with strictly protected trademarks.
* **Decision:** We strictly **avoid cloning or compiling PhET or Phyphox repositories**. We take pedagogical inspiration from their experiments but author our own lightweight HTML5 Canvas micro-labs and Web Sensor listeners under MIT-compatible terms.
* **Consequences:**
  * *Positive:* Minimizes copyright and copyleft licensing risks; total ownership of codebase; clean compliance with hackathon originality rules.
  * *Negative:* Team authors the 2D visual models fresh during the event window.
* **Status:** **APPROVED**.
