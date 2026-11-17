# DECISION REGISTER — GRAMIN POCKETLAB

**Document ID:** AUDIT-DECISION-REGISTER-V1  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Event:** STEM for Impact 2026, Presidency University, Bengaluru  
**Date:** October 20, 2026  
**Status:** Pre-Event Review & Team Alignment  

---

## 1. Approved & Locked Strategic Decisions

The following foundational decisions are finalized and binding for the hackathon build:

| Decision ID | Decision Title | Approved Choice / Policy | Rationale & Trade-offs | Status |
| :--- | :--- | :--- | :--- | :---: |
| **DEC-01** | **Product Scope** | Unified Four-Subject Application (Math, Biology, Chemistry, Physics) sharing one 7-step learning engine. | Demonstrates platform scalability and curriculum breadth across NCERT disciplines, rather than an isolated toy app. Supersedes older single-subject draft. | **LOCKED** |
| **DEC-02** | **Flagship Presentation** | Physics (Sound Detective) will be our primary live deep-dive demonstration for judging panels. | Delivers immediate, visceral "wow" factor using real-time audio synthesis and live waveform canvas plotting. Math, Bio, and Chem serve as proof of multi-subject modularity. | **LOCKED** |
| **DEC-03** | **Zero-Server Architecture** | Strictly client-side Progressive Web App (PWA). Zero cloud backends, zero external database servers, zero runtime third-party API dependencies. | Eliminates runtime server failure risks during judging; avoids hackathon Wi-Fi congestion; achieves zero cloud hosting costs and near-instantaneous client-side response times. Note that no software can guarantee absolute 100% operational uptime against local browser or device crashes. | **LOCKED** |
| **DEC-04** | **Offline Capability Framing** | The app operates offline via Service Worker CacheStorage **after its initial successful load**. | Accurate engineering integrity: first-ever visit requires an initial network connection to download the ~2MB bundle and register the Service Worker cache. Subsequent launches on the cached device operate without internet connectivity. | **LOCKED** |
| **DEC-05** | **Audio API & Auditory Safeguards** | Pure Web Audio API (`AudioContext`, `OscillatorNode`, `GainNode`, `AnalyserNode`). Gain programmatically clamped to $-3\text{ dBFS}$ ($0.70$ linear scale) as a software ceiling to prevent DAC clipping distortion. Default volume set low ($20\%–30\%$), strict user-initiated playback (no autoplay), prominent mute/stop controls, and practical actual-device audio playback testing (verifying playback, volume controls, stop/mute controls, and absence of distortion; without claiming calibrated SPL or guaranteed hearing safety). | Digital clamping prevents digital clipping distortion on budget mobile hardware. Comprehensive behavioral safeguards protect student auditory experience. | **LOCKED** |
| **DEC-06** | **Microphone Integration Policy** | Progressive enhancement: microphone access is strictly optional, permission-gated, and never required to complete the mission. | If user clicks "Block" or phone mic is malfunctioning, the lab seamlessly uses synthetic tones. Zero audio recordings are stored or transmitted. | **LOCKED** |
| **DEC-07** | **Child Privacy & Profile Scope** | Zero collection of Personally Identifiable Information (PII); formal legal compliance under India's DPDP Act 2023 not assessed. MVP scoped to single anonymous local session in `localStorage` under `pocketlab_progress`. Multi-student profile switcher UI (`profile_1`, `profile_2`) is deferred to post-MVP. | Aligns with UI screen contracts; avoids interface clutter during the event while preserving zero-login, zero-PII data privacy. | **LOCKED** |
| **DEC-08** | **Licensing & Code Authenticity** | Zero reuse of PhET Scenery code or Phyphox GPL code/branding. All interactive canvases and logic will be authored fresh under proposed MIT terms (pending explicit team approval). PhET HTML simulations are recognized as CC BY-NC 4.0; used strictly as pedagogical inspiration. | Completely protects the team from intellectual property infringement, trademark violations, or hackathon pre-existing code disqualification. | **LOCKED** |
| **DEC-09** | **Scientific Safety Disclaimers** | Chemistry lab prominently features an unmissable disclaimer: *"Notice: Virtual indicator simulation only. A pH test does not detect pathogens (bacteria, viruses, or parasites) and a reading of pH 7 does not establish water potability or biological safety."* | Demonstrates scientific rigor and prevents false real-world assumptions about drinking water safety. | **LOCKED** |

---

## 2. Open Decisions Requiring Pre-Event Team Confirmation

The following operational decisions must be confirmed by the team before the hackathon build window begins:

| Decision ID | Topic | Options Under Consideration | Recommended Option | Trade-off / Impact | Owner |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **DEC-OPEN-01** | **Frontend Core Stack** | **Option A:** Vanilla HTML5 + ES6 Modules + Vanilla CSS.<br>**Option B:** Lightweight Preact + Vite. | **Option A (Vanilla JS)** | Vanilla JS requires zero build pipeline, zero node_modules compilation overhead, and yields an ultra-fast sub-2MB bundle with zero build break risks during the event. | Dev 1 (Lead Architect) |
| **DEC-OPEN-02** | **Language Scope & Verification** | **Option A:** English primary + Kannada draft pending human review (Hindi deferred).<br>**Option B:** English + Hindi + Kannada concurrent translations. | **Option A (English Primary + Kannada Review)** | English provides complete reliable fallback. Kannada provides local judging resonance if verified by a native speaker. Hindi is deferred outside MVP scope. | Dev 5 (Content Lead) |
| **DEC-OPEN-03** | **Interactive Biology Graph Rendering** | **Option A:** Hand-crafted clean SVG node graph with CSS state transitions.<br>**Option B:** Canvas 2D particle simulation. | **Option A (Clean SVG)** | SVG is dramatically faster to implement in 21 hours, natively supports DOM accessibility attributes (`aria-label`, screen reader tables), and scales crisply across all screen resolutions without canvas pixelation. | Dev 3 (Biology Lead) |
