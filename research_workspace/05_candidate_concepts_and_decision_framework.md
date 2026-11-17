# Strategic Candidate Concepts, Evaluation Matrix & Source Register

**Author:** Research Coordinator (STEM for Impact 2026 Hackathon Team)  
**Date:** October 20, 2026  
**Status:** Historical Exploration Artifact — Preserved Research Record  

> **Historical Research Artifact:** This document records early candidate concept ideation. For active architecture and specifications, see [SOURCE_OF_TRUTH.md](../audit/SOURCE_OF_TRUTH.md). Note: Concept C's proposed PhET simulation bundling was formally rejected due to CC BY-NC 4.0 licensing restrictions and runtime size; the team adopted Gramin PocketLab with 100% original Canvas micro-simulations under proposed MIT terms.

---

## 1. Five Distinct Candidate Concepts

### Concept A: "Gramin PocketLab" — Smartphone Sensor-Powered Physical Science Lab
* **Core Subject:** Physics & Physical Sciences (NCERT Grades 8–10: Acoustics, Motion, Light, Gravity).
* **The Problem:** 49.8% of government secondary schools have no science lab. Students memorize formulas for acceleration ($g = 9.8 \text{ m/s}^2$), sound frequency, and optical illumination from static diagrams without empirical testing.
* **Proposed Solution:** A lightweight PWA that transforms the student's entry-level smartphone into an experimental sensor lab. Uses browser Web APIs (`DeviceMotionEvent` for pendulum gravity, Web Audio API for resonance and Doppler frequencies, camera light exposure for inverse-square illumination).
* **Evidence Base:** Smetana & Bell (2012) inquiry cycles ($d \approx 0.55$); Phyphox empirical protocols; Wisniewski et al. (2020) immediate data feedback.
* **Tech Stack & Feasibility:** HTML5, Web APIs, Canvas charting (Chart.js / micro-canvas). 100% offline, zero hardware cost, bundle size < 3MB. Extremely high feasibility in 24 hours.

### Concept B: "KisanGanit" (Agri-Math) — Contextualized Applied Numeracy Engine
* **Core Subject:** Mathematics & Applied Numeracy (NCERT Grades 6–9: Proportions, Ratios, Surface Area, Percentage, Data Interpretation).
* **The Problem:** Over 56% of rural youth struggle with basic arithmetic (ASER 2023) because math is taught abstractly without situational relevance. Abstract problems fail to motivate students whose daily environment involves farming, trade, and local crafts.
* **Proposed Solution:** A story-driven, scenario-based mathematical problem engine centered on rural livelihoods (e.g. optimizing drip irrigation flow rates, calculating crop yields per hectare, sizing solar water pumps, computing micro-credit interest rates). Features an intelligent diagnostic prerequisite tree (remediating foundational fractions/division when advanced calculations fail).
* **Evidence Base:** Muralidharan et al. (2019) adaptive teaching ($0.37\sigma$ gain); Sailer & Homner (2020) contextual narrative game fiction ($g = 0.49$).
* **Tech Stack & Feasibility:** React or Vanilla JS + IndexedDB for local multi-student profile progress; Mathigon `euclid.js` for dynamic land-parcel geometry. Highly feasible in 24 hours.

### Concept C: "Jal-Chakra & BioScope" — Interactive Rural Ecology & Life Sciences Simulator
* **Core Subject:** Biology & Environmental Chemistry (NCERT Grades 7–10: Water Quality, Soil Chemistry, Photosynthesis, Ecosystem Food Webs).
* **The Problem:** Students cannot see microscopic bacterial cycles or abstract ecological feedback loops. Chemistry reagents are hazardous and missing in underfunded schools.
* **Proposed Solution:** A low-footprint 2D interactive ecosystem and chemical reaction simulator. Students manipulate parameters like rainfall, fertilizer runoff, soil pH, and dissolved oxygen to observe real-time dynamic shifts in water potability and plant growth. Incorporates pre-compiled PhET standalone bundles paired with guided Predict-Observe-Explain inquiry prompts.
* **Evidence Base:** PhET research-backed conceptual modeling; Smetana & Bell (2012); Freeman et al. (2014) active learning ($g = 0.47$).
* **Tech Stack & Feasibility:** Embedded standalone PhET HTML5 simulations wrapped in custom lightweight cognitive assessment shells. High feasibility in 24 hours.

### Concept D: "VidyutSetu" — Offline Virtual Circuit & Renewable Energy Tinkering Sandbox
* **Core Subject:** Physics & Electrical Engineering (NCERT Grades 8–10: Electric Current, Series/Parallel Circuits, Resistance, Solar PV Generation).
* **The Problem:** Physical electrical components (batteries, resistors, switches, multimeters) are scarce, fragile, or quickly depleted in rural schools.
* **Proposed Solution:** A 2D snap-and-play schematic breadboard simulator that allows students to build circuits, measure virtual currents/voltages, and diagnose blown fuses or short circuits with zero risk. Connects directly to solar home-lighting systems common in off-grid rural communities.
* **Evidence Base:** CircuitVerse open-source logic principles; Dunlosky et al. (2013) retrieval testing via circuit fault-finding challenges.
* **Tech Stack & Feasibility:** 2D Canvas / SVG drag-and-drop circuit engine. 100% offline. High technical feasibility.

### Concept E: "PrashnaSaathi" — Vernacular Socratic STEM Voice-Tutor
* **Core Subject:** Cross-Disciplinary STEM (Physics, Chemistry, Biology, Math).
* **The Problem:** 80%+ rural students face language comprehension barriers with English-heavy STEM textbooks and have zero access to after-school tutors or mentors.
* **Proposed Solution:** A localized voice-and-text interactive Socratic tutor. A student asks a question or snaps a photo of a textbook problem in Hindi/regional language, and the tutor engages in step-by-step questioning without giving the answer away directly.
* **Evidence Base:** Wisniewski et al. (2020) process-level formative feedback ($d = 0.48$); NEP 2020 multilingual mandate.
* **Tech Stack & Feasibility:** Requires speech-to-text API (e.g. Bhashini / Whisper) and LLM inference. **Warning:** High network bandwidth dependency, latency on 2G/3G, API token costs, and hallucination risks make this higher risk for a 24h rural hackathon MVP unless strictly scoped.

---

## 2. Transparent Multi-Criteria Comparison Framework

Each candidate concept is scored on a 1 to 5 scale across 6 objective hackathon evaluation dimensions:
1. **Pedagogical Impact & Evidence Alignment:** Grounding in proven learning science (effect sizes, active inquiry).
2. **Rural & Offline Viability:** Independence from high-speed broadband and high-end hardware.
3. **Curriculum & NEP Alignment:** Direct correlation with NCERT/State Board syllabi and NEP 2020 guidelines.
4. **24-Hour Hackathon Feasibility:** Ability to build a complete, flawless, working demo within the 24-hour event window.
5. **Technical Innovation & "Wow" Factor:** Ability to impress judges with an original, interactive, non-trivial solution.
6. **Inclusivity & Accessibility:** Low barrier to entry for multilingual, shared-device, first-generation learners.

### Weighted Scoring Matrix (Scale 1–5, Higher is Better)

| Evaluation Criteria (Weight) | Concept A: Gramin PocketLab (Sensors) | Concept B: KisanGanit (Agri-Math) | Concept C: BioScope (Eco-Sim) | Concept D: VidyutSetu (Circuits) | Concept E: PrashnaSaathi (Voice AI) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Pedagogical Evidence (20%)** | 4.8 | 4.6 | 4.7 | 4.5 | 3.8 |
| **Rural & Offline Viability (20%)** | 4.9 | 5.0 | 4.8 | 4.8 | 2.0 |
| **Curriculum & NEP Alignment (15%)** | 4.7 | 4.9 | 4.6 | 4.7 | 4.0 |
| **24-Hour Feasibility (20%)** | 4.7 | 4.8 | 4.5 | 4.3 | 2.5 |
| **Technical Innovation / "Wow" (15%)** | 5.0 | 4.2 | 4.3 | 4.2 | 4.6 |
| **Inclusivity & Low-Resource (10%)** | 4.6 | 4.8 | 4.5 | 4.4 | 3.5 |
| **WEIGHTED TOTAL SCORE (out of 5.0)** | **4.79** | **4.73** | **4.60** | **4.50** | **3.22** |

### Critical Takeaway:
* **Top Contender 1: Concept A ("Gramin PocketLab")** offers the highest judge "wow" factor by turning an ordinary phone into a real lab instrument using free native browser APIs, with near-zero bundle size.
* **Top Contender 2: Concept B ("KisanGanit")** offers the strongest grounding in verified ASER rural math deficiencies and NEP 2020 contextualization.
* **High-Risk Outlier: Concept E ("PrashnaSaathi")**, while fashionable due to generative AI, fails severely on rural offline reliability, 2G latency, and hackathon execution risk.

---

## 3. Compliance, Safety, Privacy & Hackathon Rule Checks

1. **Licensing Compliance:**
   * PhET Licensing Note: Regular published HTML simulations are distributed under **CC BY-NC 4.0** (source code is GPL-3.0/MIT; commercial distribution or trademark use requires separate permission). To eliminate licensing ambiguities and bundle overhead, the team decided to author 100% original HTML5 Canvas micro-simulations under proposed MIT terms (pending explicit team approval).
   * If using Phyphox inspirations: Do **not** use the "phyphox" trademark or Aachen university logo; develop native Web Sensor API listeners independently.
   * If using Mathigon libraries: MIT License applies; keep copyright notices intact.
2. **Child Data Protection & Privacy (Factual Data-Handling; Formal DPDP Compliance Not Assessed):**
   * Do not collect personally identifiable information (PII) such as full names, phone numbers, Aadhaar numbers, or school locations.
   * Use anonymous local device identifiers stored in browser `localStorage` or `IndexedDB`.
   * Never require social login (Google/Facebook) which frequently fails on shared rural family devices.
3. **Safety Considerations:**
   * Sensor physics experiments (e.g. measuring pendulum swing or acoustic frequency) must include clear UI warnings to avoid dropping the phone or exposing it to water/extreme heat.
4. **Hackathon 24-Hour Rule Integrity:**
   * All application code must be authored during the hackathon window.
   * Open-source components must be declared transparently in the repository README and submission notes.

---

## 4. Comprehensive Source & Evidence Register

1. **Muralidharan, K., Singh, A., & Ganimian, A. J. (2019).** "Disrupting Education? Experimental Evidence on Technology-Aided Instruction in India." *American Economic Review*, 109(4), 1426–1460. [https://www.aeaweb.org/articles?id=10.1257/aer.20171112](https://www.aeaweb.org/articles?id=10.1257/aer.20171112)
2. **Freeman, S., et al. (2014).** "Active learning increases student performance in science, engineering, and mathematics." *Proceedings of the National Academy of Sciences (PNAS)*, 111(23), 8410–8415. [https://www.pnas.org/doi/10.1073/pnas.1319030111](https://www.pnas.org/doi/10.1073/pnas.1319030111)
3. **Dunlosky, J., et al. (2013).** "Improving Students’ Learning With Cognitive Techniques." *Psychological Science in the Public Interest*, 14(1), 4–58. [https://doi.org/10.1177/1529100612453266](https://doi.org/10.1177/1529100612453266)
4. **Wisniewski, B., Zierer, K., & Hattie, J. (2020).** "The Power of Feedback Revisited: A Meta-Analysis of Educational Feedback Research." *Frontiers in Psychology*, 10:3087. [https://doi.org/10.3389/fpsyg.2019.03087](https://doi.org/10.3389/fpsyg.2019.03087)
5. **Sailer, M., & Homner, L. (2020).** "The Gamification of Learning: A Meta-Analysis." *Educational Psychology Review*, 32(1), 77–112. [https://doi.org/10.1007/s10648-019-09498-w](https://doi.org/10.1007/s10648-019-09498-w)
6. **ASER Centre (2023/2024).** "Annual Status of Education Report (Rural) 2023: Beyond Basics." Pratham Education Foundation. [https://asercentre.org](https://asercentre.org)
7. **Ministry of Education, Government of India (2024).** "Unified District Information System for Education Plus (UDISE+) 2023–24 Flash Statistics." [https://udiseplus.gov.in](https://udiseplus.gov.in)
8. **National Steering Committee for National Curriculum Frameworks (2023).** "National Curriculum Framework for School Education (NCF-SE 2023)." NCERT, Ministry of Education, Govt of India.
9. **PhET Interactive Simulations Project.** University of Colorado Boulder. Source repositories: [https://github.com/phetsims](https://github.com/phetsims); Platform: [https://phet.colorado.edu](https://phet.colorado.edu)
10. **Learning Equality (2024).** "Kolibri Learning Platform." [https://github.com/learningequality/kolibri](https://github.com/learningequality/kolibri)
11. **RWTH Aachen University (2024).** "Phyphox: Physical Phone Experiments." [https://github.com/phyphox](https://github.com/phyphox); [https://phyphox.org](https://phyphox.org)
12. **Mathigon by Amplify (2024).** "Euclid.js & Fermat.js Mathematical Libraries." [https://github.com/mathigon](https://github.com/mathigon)

---

## 5. Unanswered Questions & Team Decision Points

Before kicking off the 24-hour hackathon build, the team must align on the following unresolved questions:
1. **Core Subject Selection:** Hackathon rules stipulate choosing **one core STEM subject** (Mathematics, Biology, Chemistry, or Physics). Does the team prefer Physics (Concept A: Phone Sensors) or Mathematics (Concept B: Agri-Numeracy)?
2. **Device Input Modality:** Will our primary demonstration use touch/canvas interactions or live physical sensor inputs (e.g. shaking/tilting the phone or clapping to measure sound waves)?
3. **Language Scope for MVP:** Should the MVP support English + Hindi, or include an additional regional language (e.g. Tamil/Kannada) to maximize inclusion points?
4. **Offline Evaluation Mechanism:** Should student progress sync opportunistically when a connection is restored (via ServiceWorker background sync), or remain entirely contained within local storage for the demo?
