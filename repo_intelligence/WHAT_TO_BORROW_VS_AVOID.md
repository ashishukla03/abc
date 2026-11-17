# WHAT TO BORROW VS. WHAT TO AVOID — STRATEGIC SUMMARY

**Document ID:** REPO-BORROW-VS-AVOID-V2  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Event:** STEM for Impact 2026, Presidency University, Bengaluru  
**Role:** Repository Intelligence Lead  

---

## 1. What to Borrow (Architectural Patterns & Open Standards)

1. **Kolibri (Learning Equality):**
   * *Borrow:* Asynchronous offline cache patterns and anonymous local progress storage; multi-student local profile partitioning (`profile_1`, `profile_2`) reserved for post-MVP.
2. **Oppia (Google / Oppia Foundation):**
   * *Borrow:* Misconception-driven formative feedback branching. When a student chooses an incorrect option, do not output a generic "Wrong"; branch to a specific hint that corrects the underlying cognitive misconception.
3. **PhET Interactive Simulations (CU Boulder):**
   * *Borrow:* The philosophy of visual modeling for invisible physical/chemical phenomena (e.g. visualizing sound wave compression for frequency, and sliding pH indicator bars).
4. **Phyphox (RWTH Aachen University):**
   * *Borrow:* The experimental workflow of transforming standard smartphone hardware into an active physics laboratory.
5. **W3C Open Web Standards:**
   * *Borrow / Use Directly:* Native `AudioContext` for tone synthesis, `CanvasRenderingContext2D` for 60 FPS waveforms, and `ServiceWorker` CacheStorage for 100% offline Airplane Mode execution.

---

## 2. What to Avoid (Dependencies & Minefields)

1. **AVOID PhET SceneryStack / Chipper Repositories:**
   * *Why:* Requires complex Grunt build tooling, pulling 10+ interdependent git submodules. Compiling from source during a 21-hour hackathon is a fatal time sink. Author custom 2D Canvas micro-labs instead.
2. **AVOID Phyphox Codebase & Trademarks:**
   * *Why:* Code is licensed under GPL-3.0 and all names/logos are strictly reserved registered trademarks of RWTH Aachen University. Using their branding risks immediate intellectual property disqualification.
3. **AVOID Monolithic Backends (Kolibri Django / Oppia Docker / Sunbird Kubernetes):**
   * *Why:* Setting up enterprise server containers burns critical hackathon hours and requires high-end server hosting that rural students cannot access.
4. **AVOID Native Mobile App Compilations (Android Studio / NDK / Xcode):**
   * *Why:* Native Android builds require large SDKs, gradle debugging, and APK installation friction on judge devices. A mobile-first PWA runs instantly in any mobile browser with zero install hurdles.
5. **AVOID Heavy 3D Graphics Engines (Three.js / Babylon.js / WebXR):**
   * *Why:* Photorealistic 3D assets require 50MB–200MB asset downloads and thermally throttle or crash budget 2GB RAM Android smartphones.
