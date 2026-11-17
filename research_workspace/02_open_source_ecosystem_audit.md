# Open Source Ecosystem Audit & Code Reuse Feasibility Report

**Author:** Research Coordinator (STEM for Impact 2026 Hackathon Team)  
**Date:** October 20, 2026  
**Focus:** Technical audit of real open-source repositories, license compatibility, dependency footprints, offline viability, and reuse feasibility for a 24-hour hackathon.

> [!NOTE]
> **Historical Research Artifact:** This dossier records initial open-source exploration. For reconciled decisions, refer to [SOURCE_OF_TRUTH.md](../audit/SOURCE_OF_TRUTH.md) and [P0_CORRECTIONS_LOG.md](../audit/P0_CORRECTIONS_LOG.md). (Binding policy: PhET published HTML simulations use CC BY-NC 4.0; our project builds 100% original HTML5 Canvas visualisations under MIT, treating PhET solely as pedagogical inspiration).

---

## 1. Repository Audit Matrix

| Repository | GitHub Org / URL | Primary License | Tech Stack & Dependencies | Activity & Maintenance Status (2024–2026) | Reusability vs. Inspiration Assessment | Hackathon Integration Feasibility |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **PhET Interactive Simulations** | `phetsims` ([github.com/phetsims](https://github.com/phetsims)) | Code: GPL-3.0 / MIT (submodules); Published HTML sims: CC BY-NC 4.0 | TypeScript/JavaScript, SceneryStack (`scenery`, `axon`, `dot`, `kite`, `phet-core`), Grunt | Extremely active; daily commits across 100+ simulation repositories. | **Pedagogical Inspiration Only (High); Direct Code Embedding Rejected (Low)**. Standalone HTML bundles carry CC BY-NC 4.0 restrictions and Scenery runtime weight. | **Low** for hackathon bundling. Replaced by 100% original lightweight HTML5 Canvas micro-simulations. |
| **Kolibri Learning Platform** | `learningequality/kolibri` ([github.com/learningequality/kolibri](https://github.com/learningequality/kolibri)) | MIT License | Python, Django, Django REST Framework, Vue.js, SQLite/PostgreSQL, Git LFS | Actively maintained by Learning Equality; regular releases, vibrant international NGO adoption. | **Design & Architectural Inspiration (High); Direct Reuse (Low)**. Kolibri is a full-fledged offline LMS server. Forking or extending the entire Django + Vue stack in 24 hours creates massive build overhead and dependency friction. | **Low** for codebase reuse in a 24h event. **High** for architectural patterns: SQLite client-side synchronization, content pack indexing, offline token tracking. |
| **Phyphox (Physical Phone Experiments)** | `phyphox` (`phyphox-android`, `phyphox-experiments`) ([github.com/phyphox](https://github.com/phyphox)) | GNU GPL v3.0 (Trademarks strictly reserved by RWTH Aachen) | Java/Kotlin (Android), Objective-C/Swift (iOS), XML for experiment definitions, Bluetooth LE | Regular maintenance by RWTH Aachen University physics department; community experiment repository active. | **Partial Direct Reuse / High Inspiration**. Building custom native experiments using their XML schema format (`.phyphox` files) or replicating sensor listeners via standard Web Sensor APIs (`devicemotion`, `DeviceOrientationEvent`, Ambient Light API). | **High** for using Web Sensor APIs inspired by Phyphox. **Medium** for compiling native Android forks due to NDK and native sensor tuning hurdles. |
| **Mathigon Ecosystem (Euclid.js & Core)** | `mathigon` (`euclid.js`, `boost.js`, `fermat.js`) ([github.com/mathigon](https://github.com/mathigon)) | MIT License (Core utility libraries); Main Polypad app is proprietary (Amplify Education) | TypeScript, SVG/Canvas rendering, clean zero-dependency math/geometry primitives | Repositories maintained but core attention shifted post-Amplify acquisition (2021). | **Modular Code Reusable (High)**. `euclid.js` and `fermat.js` can be dropped into any client-side JavaScript or React/Vue app to handle 2D geometric constructs, polygons, angles, and vector algebra without heavy math libraries. | **Very High** for dropping `euclid.js` into an interactive geometric canvas or coordinate plane challenge. |
| **Oppia Web Platform** | `oppia/oppia` ([github.com/oppia/oppia](https://github.com/oppia/oppia)) | Apache License 2.0 | Python 3, Angular, Google Cloud Datastore, Docker | Extremely active open-source community with extensive CI/CD pipelines and thousands of contributors. | **Inspiration Only**. Oppia is an enormous, monolithic learning platform designed for structured, branching interactive tutorials. Local dev setup requires 15–30GB disk space, Docker, and 45+ minutes to build. | **Zero** for 24-hour hackathon repo cloning. **High** for UX design: bite-sized feedback dialogues, common error state categorization, and conversational tutoring flow. |
| **Kiwix / Libzim** | `kiwix` (`kiwix-js`, `libzim`) ([github.com/kiwix](https://github.com/kiwix)) | GNU GPL v3.0 | C++ (`libzim`), Pure JavaScript (`kiwix-js`), ServiceWorkers, IndexedDB | Actively maintained; widespread global use for offline Wikipedia, Khan Academy, and PhET storage. | **Reusable via ServiceWorker / Open Standards**. `kiwix-js` enables reading compressed ZIM archives directly inside a client-side browser with no backend server. | **Medium-to-High** if our concept requires packaging multi-megabyte encyclopedic or curriculum dumps for zero-data environments. |

---

## 2. In-Depth Technical Audits & Setup Bottlenecks

### 2.1 PhET Interactive Simulations (`phetsims`)
* **License Analysis:** 
  * Source code in GitHub repositories is under the **GNU General Public License v3 (GPL-3.0)** or **MIT License** depending on the specific utility library.
  * *Official Terms:* According to official PhET licensing ([https://phet.colorado.edu/en/licensing](https://phet.colorado.edu/en/licensing)), regular published HTML simulation files are distributed under **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**, not CC BY 4.0. The PhET name and logo are registered trademarks and may not be used without a separate license agreement from CU Boulder.
  * *Historical Context & Team Decision:* Earlier research drafts explored embedding standalone PhET bundles under the mistaken assertion that published HTML files were CC BY 4.0. To eliminate licensing contamination, non-commercial redistribution hurdles, and multi-megabyte bundle overhead, **the team resolved to author 100% original, lightweight HTML5 Canvas micro-simulations** during the build window. PhET is retained strictly as pedagogical inspiration.
* **Dependencies & Build Pipeline:** Building a simulation from source requires cloning `chipper`, `scenery`, `sun`, `axon`, and configuring Grunt build tools. In a 24-hour event, building from source is an unnecessary time sink.
* **Adopted Architecture:** Reject embedding or recompiling PhET. Author pure, zero-dependency HTML5 Canvas simulations natively in Vanilla JS.

### 2.2 Phyphox & Web Sensor APIs
* **License & Trademark Analysis:** 
  * The source code is **GPL v3.0**. If native code is adapted, the resulting work must also remain GPL-3.0.
  * *Important Constraint:* "Phyphox" and the RWTH Aachen logo are registered trademarks and cannot be used in a derived product's name or logo.
* **Technical Reality Check for Hackathons:** Rather than compiling a native Android project with complex C++/NDK sensor filters, modern mobile web browsers (Chrome/Firefox on Android) support:
  * `DeviceMotionEvent` (accelerometer, gyroscope)
  * `DeviceOrientationEvent` (compass, tilt, pitch)
  * `AudioContext` & Web Audio API (real-time microphone frequency analysis, Doppler effect, sound level meters)
  * Ambient Light Sensor API (Generic Sensor API spec)
* **Strategy:** Replicate the experimental methodology of Phyphox (e.g. measuring gravity via pendulum period or determining resonant acoustics) using lightweight browser Web APIs that run instantly on any student's phone without requiring Play Store installation.

### 2.3 Mathigon Modular Libraries (`euclid.js`, `fermat.js`)
* **License:** **MIT License**. Freely permissive for integration and modification.
* **Dependencies:** Clean ES module structure with minimal external baggage.
* **Reuse Potential:** Ideal for rapidly assembling interactive geometric diagrams, coordinate graphing, and trigonometric visualizations on an HTML5 `<canvas>` or SVG overlay without needing heavy engines like Babylon or Three.js.

---

## 3. Clear Boundaries: What to Re-Use vs. What to Build Fresh

```
+-------------------------------------------------------------+
|               WHAT TO REUSE DIRECTLY                        |
+-------------------------------------------------------------+
| 1. PhET Standalone HTML5 simulation bundles (embedded via   |
|    clean sandboxed iframes or PWA storage).                 |
| 2. Mathigon `euclid.js` for 2D math & geometry rendering.   |
| 3. Standard Web APIs (Web Audio, Geolocation, DeviceMotion).|
| 4. SQLite/WASM or IndexedDB (idb-keyval / Dexie.js) for     |
|    100% offline persistence and sync queues.                |
+-------------------------------------------------------------+

+-------------------------------------------------------------+
|               WHAT TO INSPIRE DESIGN ONLY                   |
+-------------------------------------------------------------+
| 1. Kolibri's asynchronous sync token architecture.          |
| 2. Oppia's step-by-step misconception branching feedback.   |
| 3. Phyphox's structured real-world sensor inquiry workflows.|
| 4. Mindspark's dynamic diagnostic prerequisite mapping.     |
+-------------------------------------------------------------+

+-------------------------------------------------------------+
|               WHAT TO AVOID / DO NOT REUSE                  |
+-------------------------------------------------------------+
| 1. Full Kolibri / Oppia full-stack backends (too heavy).    |
| 2. Re-compiling SceneryStack/PhET build systems from source.|
| 3. Native ARCore / Sceneform SDKs (device incompatibility). |
+-------------------------------------------------------------+
```
