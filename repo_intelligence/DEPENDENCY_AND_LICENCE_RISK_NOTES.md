# DEPENDENCY & LICENCE RISK NOTES — GRAMIN POCKETLAB

**Document ID:** REPO-RISK-NOTES-V2  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Event:** STEM for Impact 2026, Presidency University, Bengaluru  
**Role:** Open-Source Compliance Officer & Lead Architect  
**Objective:** Detail exact licensing, intellectual property, and architectural risks for candidate dependencies.  

---

## 1. Primary Risk Analysis by Target Project

### 1.1 PhET Interactive Simulations (`phetsims`)
* **Exact Licenses:** GPL-3.0 (with select MIT packages) for simulation source code; Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) for regular published HTML simulation files; commercial licensing / separate terms required from CU Boulder for commercial redistribution or use of PhET trademarks.
* **Transitive Dependency Chain:** Compiling a simulation from source pulls in `chipper` (build tools), `scenery` (graphics/scene-graph), `sun` (UI controls), `axon` (event/property model), `dot` (math), `kite` (shape geometry), and `phet-core`.
* **Identified Risks:**
  1. *Build Failure Risk:* High risk of Grunt/Node compatibility breakages when compiling on diverse developer laptops during the 21-hour event.
  2. *Licensing Contamination:* Forking or directly including GPL-3.0 Scenery code forces the entire project under GPL-3.0.
* **Mitigation Policy:** **DO NOT REUSE PHET SOURCE CODE OR BUNDLES**. Take pure pedagogical inspiration from their visual designs (e.g. pH color gradients, sine wave representations) and author lightweight, native 2D HTML5 Canvas components independently under proposed MIT terms (pending explicit team approval).

### 1.2 Phyphox (`phyphox`)
* **Exact Licenses:** GNU GPL v3.0 for source code. **All names, logos, and trademarks are strictly reserved by RWTH Aachen University.**
* **Transitive Dependency Chain:** Android NDK, CMake, native sensor HAL filters, proprietary Bluetooth LE profiles.
* **Identified Risks:**
  1. *Trademark Infringement:* Using "Phyphox" or the Aachen logo in our application, pitch deck, or submission is an explicit trademark violation.
  2. *Platform Dependency:* Compiling native Android APKs eliminates browser PWA portability across iOS and Chromebooks.
* **Mitigation Policy:** **DO NOT REUSE PHYPHOX CODE OR BRANDING**. Use the W3C Web Audio API and W3C Device Orientation / Motion APIs natively in browser JavaScript. Pitch the product as "Gramin PocketLab" with 100% original identity.

### 1.3 Learning Equality / Kolibri (`learningequality/kolibri`)
* **Exact Licenses:** MIT License for platform codebase; individual CC licenses for content channels.
* **Identified Risks:**
  1. *Architectural Bloat:* Kolibri is an enterprise-scale offline server built on Python/Django. Running Kolibri requires a full desktop Python runtime, making it completely impossible to run as a client-only mobile PWA on a budget Android phone.
* **Mitigation Policy:** **INSPIRATION ONLY**. Borrow their client-side token sync queue concepts; reject the codebase.

### 1.4 Mathigon Euclid.js (`mathigon/euclid.js`)
* **Exact Licenses:** MIT License.
* **Identified Risks:**
  1. *Unnecessary Overhead:* While MIT-licensed and clean, importing a full geometric vector library is unnecessary when basic HTML5 Canvas coordinate trigonometry handles our 2D water bar and oscilloscope displays in $<30$ lines of code.
* **Mitigation Policy:** **OPTIONAL PERMISSIVE REUSE**. Allowed if complex geometric shapes are needed, but native JavaScript math (`Math.sin`, `Math.PI`) is preferred.

---

## 2. Permissive Core Stack Selected (Zero-Risk Architecture)

To guarantee zero licensing, trademark, or build risks during the hackathon, the final stack relies entirely on **Royalty-Free W3C Living Standards and Permissive Open Assets**:

| Subsystem | Technology Adopted | License / Status | Compliance & Risk Profile |
| :--- | :--- | :--- | :--- |
| **Acoustic Synthesizer** | W3C Web Audio API | W3C Royalty-Free Standard | Native browser runtime; zero dependencies; hardware accelerated. |
| **Visual Simulation** | HTML5 Canvas 2D & SVG | W3C Living Standard | Zero runtime weight; total rendering control; fully accessible. |
| **Offline Storage** | W3C Service Worker & LocalStorage | W3C Royalty-Free Standard | Native PWA offline execution; zero external database setup. |
| **Interface Icons** | Lucide Icons (inlined SVG) | ISC License (Permissive) | Inline SVG symbols; zero network requests; zero bundle bloat. |
| **Typography** | Native System Font Stack | Operating System Native | Zero font CDN dependencies; zero FOIT/FOUT latency. |
