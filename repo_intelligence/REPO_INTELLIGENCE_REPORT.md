# OPEN SOURCE REPOSITORY INTELLIGENCE & REUSE FEASIBILITY REPORT

**Document ID:** REPO-INTELLIGENCE-REPORT-V2  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Event:** STEM for Impact 2026, Presidency University, Bengaluru  
**Role:** Repository Intelligence Lead & Open-Source Compliance Officer  
**Scope:** Rigorous investigation of educational platforms, assessment engines, STEM visualizations, PWA components, and offline storage libraries. **Zero application code authored; strict intellectual property analysis.**  

---

## 1. Executive Summary & Audit Methodology

During a fast-paced 21-hour hackathon, adopting external open-source software involves a critical trade-off between accelerated development and fatal technical friction. Integrating an oversized library can consume hours in dependency resolution, native build configuration, and bundle bloat, while violating open-source licenses or trademarks can lead to project disqualification.

### Audit Dimensions Evaluated
Every repository in this review was inspected against eight objective technical dimensions:
1. **Canonical Repository & Activity:** Default branch, commit frequency, and recent release history (2024–2026).
2. **Exact Licensing (SPDX):** Verified distinction between source code license, media/asset license, and trademark restrictions.
3. **Setup Friction & Build Cost:** Disk footprint, external language dependencies (Python, Docker, Java, C++), and time required to build.
4. **Architectural Weight & Dependencies:** Total bundle footprint and runtime memory impact on budget Android devices.
5. **Offline Capability:** Viability of running completely client-side without a persistent backend server.
6. **Accessibility & Localization:** Native ARIA semantics and multilingual support.
7. **Local Execution Verification:** Clearly stating whether the code has been executed locally or evaluated via documentation/repository audits.
8. **Hackathon Recommendation:** Classified as *Potentially Reusable After Review*, *Inspiration Only*, *Requires Clarification*, or *Blocked / Avoid for This Event*.

---

## 2. In-Depth Project Evaluations

### 2.1 Learning Equality / Kolibri (`learningequality/kolibri`)
* **Repository URL:** [https://github.com/learningequality/kolibri](https://github.com/learningequality/kolibri)
* **Verified License:** **MIT License** for core platform source code; distributed content channels carry separate, diverse Creative Commons licenses (CC BY, CC BY-NC-SA). "Kolibri" name and logo are protected trademarks of Foundation for Learning Equality.
* **Architecture & Stack:** Python 3, Django, Django REST Framework, Vue.js, SQLite / PostgreSQL.
* **Maintenance & Activity:** Highly active (regular commits and major releases in 2024–2026; widespread NGO deployment).
* **Setup Friction:** High. Setting up a local dev environment requires Git LFS, Python virtual environments, Node.js tooling, and compiling static assets. Build time typically requires 20–40 minutes.
* **Offline & Mobile Suitability:** Excellent for offline servers (e.g. Raspberry Pi classroom servers), but too monolithic to serve as a client-side micro-PWA.
* **Local Run Status:** Evaluated via repository audit and developer documentation; not run locally in this workspace.
* **Recommendation:** **INSPIRATION ONLY**.  
  * *Why:* Forking or embedding Kolibri during a 21-hour hackathon would consume excessive time on backend plumbing.  
  * *What to Borrow:* Adopt their architectural patterns for client-side offline sync queues, content indexing tokens, and anonymous local profile partitioning.

---

### 2.2 Oppia Web Platform (`oppia/oppia`)
* **Repository URL:** [https://github.com/oppia/oppia](https://github.com/oppia/oppia)
* **Verified License:** **Apache License 2.0** for source code. Educational lessons and exploratory content are licensed under **Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0)**.
* **Architecture & Stack:** Python, Angular, Google Cloud Datastore, Docker, Webpack.
* **Maintenance & Activity:** Very active; large open-source contributor community with continuous CI/CD integration.
* **Setup Friction:** Prohibitive. Installing Oppia locally requires Docker, 15GB–30GB of disk space, Google Cloud SDK emulation, and often takes 45–90 minutes to compile.
* **Local Run Status:** Evaluated via repository audit; not run locally.
* **Recommendation:** **INSPIRATION ONLY**.  
  * *What to Borrow:* Oppia’s pedagogical design of "feedback loops for common wrong answers." We borrow their concept of state-based feedback that specifically addresses student misconceptions before branching to retries.

---

### 2.3 PhET Interactive Simulations (`phetsims/*`)
* **Repository URL:** [https://github.com/phetsims](https://github.com/phetsims) (e.g. `phetsims/scenery`, `phetsims/axon`, individual sims like `phetsims/ph-scale-basics`).
* **Verified License:**
  * **Source Code:** Generally **GPL-3.0** or **MIT** across internal SceneryStack submodules.
  * **Published Simulations & Assets:** Licensed under **Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0)** for educational distribution. Commercial distribution or integration requires an explicit license agreement from CU Boulder.
* **Architecture & Stack:** TypeScript/JavaScript, SceneryStack (`scenery`, `axon`, `dot`, `kite`, `phet-core`), Grunt.
* **Maintenance & Activity:** Daily commits across over 100 repositories; world gold-standard for STEM simulations.
* **Setup Friction:** Extremely High for building from source. Compiling a simulation from raw GitHub sources requires cloning 10+ interdependent repositories, running specialized Grunt build pipelines, and debugging submodule linkages.
* **Offline & Mobile Suitability:** Standalone pre-compiled HTML5 single-file bundles run completely offline, but Scenery canvas elements can be heavy on budget mobile devices.
* **Local Run Status:** Evaluated via source audit; not compiled from source in this workspace.
* **Recommendation:** **AVOID BUILDING FROM SOURCE / INSPIRATION ONLY**.  
  * *Why:* Authoring our own lightweight HTML5 Canvas micro-labs from scratch takes $<150$ lines of vanilla JavaScript, avoiding multi-megabyte Scenery dependencies and GPL licensing complexities.

---

### 2.4 Phyphox (`phyphox/phyphox-android`, `phyphox-experiments`)
* **Repository URL:** [https://github.com/phyphox/phyphox-android](https://github.com/phyphox/phyphox-android)
* **Verified License:** **GNU General Public License v3.0 (GPL-3.0)**.  
  * *Critical Trademark Restriction:* The name "phyphox", the RWTH Aachen University logo, and related trademarks are **strictly registered and reserved**. They cannot be used in derivative application names, branding, or marketing.
* **Architecture & Stack:** Java/Kotlin, C++ / NDK native sensor filters, XML experiment definitions.
* **Maintenance & Activity:** Actively maintained by RWTH Aachen physics education department.
* **Setup Friction:** High. Requires Android Studio, Android NDK, CMake, and physical device sensor debugging.
* **Local Run Status:** Evaluated via repository and XML format inspection; not compiled locally.
* **Recommendation:** **AVOID CODEBASE / INSPIRATION ONLY**.  
  * *What to Borrow:* Phyphox’s brilliant concept of using standard smartphone sensors for physics experiments (pendulums, frequency resonance).  
  * *How We Execute:* Implement sensor and acoustic experiments independently using standard W3C Web APIs (`AudioContext`, `DeviceMotionEvent`) in pure browser JavaScript under our own MIT-compatible terms.

---

### 2.5 Sunbird-Ed / DIKSHA Ecosystem (`sunbird-ed/*`)
* **Repository URL:** [https://github.com/Sunbird-Ed](https://github.com/Sunbird-Ed)
* **Verified License:** **MIT License** across core repositories. Content hosted on the national DIKSHA platform is owned by NCERT and respective State Boards of Education under government copyright.
* **Architecture & Stack:** Node.js, Angular, Cordova / Capacitor for Android APK packaging, Cassandra / Elasticsearch for backend services.
* **Maintenance & Activity:** Highly maintained Indian national digital infrastructure.
* **Setup Friction:** Prohibitive for hackathons. Sunbird is an enterprise-scale national infrastructure requiring Kubernetes, Microservices, and massive backend setups.
* **Local Run Status:** Evaluated via architectural review.
* **Recommendation:** **INSPIRATION ONLY**.  
  * *What to Borrow:* Direct alignment with NCERT curriculum structures and QR-code textbook integration patterns.

---

### 2.6 H5P Core & Interactive Content (`h5p/h5p-php-library`, `h5p/h5p-editor-php-library`)
* **Repository URL:** [https://github.com/h5p](https://github.com/h5p)
* **Verified License:** **MIT License** for core library code; specific H5P content types (e.g. branching scenarios, interactive video) carry MIT, GPL, or CC licenses depending on the author.
* **Architecture & Stack:** PHP backend library paired with JavaScript frontend runtime.
* **Setup Friction:** High. Requires a PHP/WordPress/Moodle backend server to author and serve H5P content packages (`.h5p` zip bundles).
* **Offline Suitability:** Standalone client-side playback requires specialized JS runners (such as `h5p-standalone`).
* **Local Run Status:** Evaluated via documentation.
* **Recommendation:** **INSPIRATION ONLY**.  
  * *Why:* Embedding an H5P player introduces unnecessary iframe overhead and styling friction compared to lightweight native HTML5 components.

---

### 2.7 Mathigon Modular Libraries (`mathigon/euclid.js`, `mathigon/fermat.js`)
* **Repository URL:** [https://github.com/mathigon/euclid.js](https://github.com/mathigon/euclid.js)
* **Verified License:** **MIT License**.  
  * *Asset Notice:* The main Mathigon "Polypad" application was acquired by Amplify Education (2021) and is proprietary/closed-source. However, the foundational utility libraries on GitHub remain open-source MIT.
* **Architecture & Stack:** Pure TypeScript, zero external dependencies, mathematical geometry primitives.
* **Maintenance & Activity:** Low maintenance post-acquisition, but code is stable and feature-complete.
* **Setup Friction:** Very Low. Single file or clean ES module import.
* **Local Run Status:** Evaluated via source code inspection.
* **Recommendation:** **POTENTIALLY REUSABLE AFTER REVIEW**.  
  * *Assessment:* If complex geometric coordinate manipulation is required, `euclid.js` is a safe, permissive drop-in. For our current 2D water ratio bars, native HTML/Canvas is even lighter.

---

### 2.8 Local Storage & Offline Infrastructure: Dexie.js vs. Native LocalStorage
* **Dexie.js (`dexie/Dexie.js`):**
  * **License:** **Apache License 2.0**.
  * **Role:** Minimalistic wrapper around browser `IndexedDB`.
  * **Size:** $\sim 20\text{ KB}$ gzipped.
  * **Verdict:** *Potentially Reusable*. Excellent if storing large binary files or multi-megabyte datasets.
* **Native `localStorage`:**
  * **License:** W3C Living Standard (Built into all modern browsers).
  * **Size:** $0\text{ KB}$ bundle overhead.
  * **Verdict:** **RECOMMENDED CORE ENGINE**. Gramin PocketLab stores less than $50\text{ KB}$ of anonymous progress data, making native `localStorage` with an in-memory fallback the most resilient choice.

---

## 3. What to Borrow vs. What to Avoid (Strategic Decision Summary)

```
+---------------------------------------------------------------------------------------------------+
|               WHAT TO BORROW (Architectural Patterns & Open Standards)                            |
+---------------------------------------------------------------------------------------------------+
| 1. Kolibri: Asynchronous offline token synchronization and anonymous multi-child profile switching.|
| 2. Oppia: Misconception-driven branching feedback (targeting specific wrong student models).      |
| 3. PhET: Visual modeling of invisible science (sine waves, molecular/pH scales) using 2D canvas.  |
| 4. Phyphox: Smartphone acoustic tone generation and sensor inquiry workflows.                     |
| 5. W3C Native Standards: Web Audio API, Canvas 2D, and ServiceWorker API (Zero dependencies).     |
+---------------------------------------------------------------------------------------------------+

+---------------------------------------------------------------------------------------------------+
|               WHAT TO AVOID (Heavy Dependencies & Legal Minefields)                               |
+---------------------------------------------------------------------------------------------------+
| 1. AVOID PhET SceneryStack / Chipper: Compiling from source creates massive build delays.         |
| 2. AVOID Phyphox Code & Branding: Trademarks strictly reserved; GPL-3.0 creates licensing risks.  |
| 3. AVOID Monolithic Backends: Reject Kolibri (Django), Oppia (Docker), and Sunbird (K8s) stacks.  |
| 4. AVOID Native App Compiles: Reject Android Studio/NDK builds; stick 100% to mobile browser PWA. |
| 5. AVOID Heavy 3D Engines: Reject Three.js / Babylon.js / WebXR (thermal throttling on 2GB RAM).  |
+---------------------------------------------------------------------------------------------------+
```
