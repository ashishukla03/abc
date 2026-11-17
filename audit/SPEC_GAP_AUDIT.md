# SPECIFICATION GAP AUDIT — GRAMIN POCKETLAB

**Document ID:** AUDIT-SPEC-GAP-V1  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Event:** STEM for Impact 2026, Presidency University, Bengaluru  
**Role:** Independent Product Requirements Reviewer & QA Auditor  
**Date:** October 20, 2026  
**Status:** Audit Complete — Pre-Event Review  

---

## 1. Executive Summary & Review Overview

This audit evaluates the complete set of specifications authored for **Gramin PocketLab** (located in [`specs/`](../specs/)) against the approved four-subject scope, the real-world judging criteria of the **STEM for Impact Hackathon**, and the strict operational constraints of rural Indian government schools.

### Overall Audit Verdict
* **Total Requirements Audited:** 48 requirements across 12 dimensions.
* **Complete & Internally Consistent:** 34 requirements (70.8%).
* **Incomplete / Requiring Explicit Operational Boundary:** 9 requirements (18.8%).
* **Conflicting Across Documents:** 3 requirements (6.2%).
* **Not Verified (Awaiting Organizer / Physical Hardware Check):** 2 requirements (4.2%).
* **Out of Scope (Correctly Guarded):** Zero scope creep into AI backends or native 3D.

---

## 2. Comprehensive Review Across the 12 Audit Dimensions

### Dimension 1: Problem Identification and Target Learner
* **Classification:** Complete and Internally Consistent.
* **Findings:** Problem is grounded in official national data: UDISE+ indicates integrated science laboratory facilities are available in 51.7% of government schools with secondary sections nationally; ASER 2023 demonstrates that 89.0% of surveyed youth had a smartphone at home, 66.1% of smartphone-capable youth report educational use, and 56.7% struggle with foundational 3-digit division. Target cohort is precisely defined as Grades 6–8 learners on budget Android smartphones.
* **Gaps:** None.

### Dimension 2: Novelty and Differentiation from Existing Tools
* **Classification:** Complete and Internally Consistent.
* **Findings:** Clearly differentiated from both ends of the educational technology spectrum: avoids the passive video consumption of DIKSHA/YouTube and avoids the heavy, crashing 3D WebGL models of Labster/PraxiLabs. Bridges the open-ended nature of exploratory simulation sandboxes (such as PhET or GeoGebra, which provide high-fidelity exploration but in unguided classroom settings lack built-in formative question-and-feedback loops) by wrapping lightweight micro-labs in an inquiry-scaffolded 7-step feedback cycle.
* **Gaps:** None.

### Dimension 3: Educational Impact and Learning Mechanism
* **Classification:** Complete and Internally Consistent.
* **Findings:** Learning mechanism is directly mapped to peer-reviewed learning science: retrieval practice (Dunlosky et al., $g \approx 0.50–0.73$), process-oriented formative feedback (Wisniewski & Hattie, $d = 0.48$), and active variable manipulation (Freeman et al., $g = 0.47$). The 7-step cycle is uniform across all four subjects.
* **Gaps:** None.

### Dimension 4: Feasibility within a Conservative 21-Hour Build Window
* **Classification:** Incomplete (High Severity).
* **Gap Identified:** Four full interactive micro-labs + audio synthesizer + 7-step engine + canvas plotting is an ambitious build for 21 hours if not strictly modularized.
* **Impact:** Risk of incomplete interactive stages during the presentation if team members get bogged down in custom canvas code.
* **Mitigation / Resolution:** Lock a minimal viable interaction contract for Biology (SVG node state toggle rather than complex dynamic force-directed physics layout) and Math (stepper controls rather than custom fluid drag canvas).

### Dimension 5: Working-Demo Reliability
* **Classification:** Incomplete (Blocker Severity).
* **Gap Identified:** Audio autoplay security policies on mobile Chrome/Safari will silence the synthesizer unless an explicit user interaction event initializes and resumes the `AudioContext`.
* **Mitigation / Resolution:** The UI must display an unblockable, clear modal or start button (`"Tap to Enter Sound Lab"`) that executes `audioCtx.resume()` synchronously within the click handler before navigating to Step 3.

### Dimension 6: Access, Inclusion, Language, Device and Connectivity Constraints
* **Classification:** Conflicting (High Severity).
* **Gap Identified:** 
  * *Offline Definition Conflict:* Some early project text loosely stated "works offline without internet", whereas technical reality dictates that **the app only works offline after its first successful load and Service Worker caching**. The very first visit requires an initial network connection to download the ~2MB bundle.
  * *Language Scope:* Reconciled to English primary fallback, Kannada draft strings pending human review, and Hindi deferred outside initial MVP scope.
* **Resolution:** Correct all documentation to explicitly state: `"Offline-capable via Service Worker cache after first successful load"`. Use pre-defined English primary strings with optional human-verified Kannada toggle.

### Dimension 7: Scalability and Pitch Clarity
* **Classification:** Complete and Internally Consistent.
* **Findings:** Pitch narrative is clear: one unified engine, four foundational subjects, zero marginal distribution cost, zero server hosting costs, works on sub-$100 hardware.
* **Gaps:** None.

### Dimension 8: Content Accuracy and Curriculum Fit
* **Classification:** Complete and Internally Consistent.
* **Findings:** Strictly aligned with NCERT Class 6–8 syllabi. Math water ratio enforces invariant $1:2:3$ summing to 12. Biology food web uses correct trophic cascade principles with explicit energy-flow arrows. Chemistry accurately identifies pH 3 as acidic, pH 7 as neutral, and pH 10 as basic. Physics models frequency ($220\text{ Hz}$, $440\text{ Hz}$) as pitch and amplitude as loudness.
* **Gaps:** None.

### Dimension 9: Privacy, Safety and Permissions
* **Classification:** Complete and Internally Consistent.
* **Findings:** 
  * Privacy & Data Handling: Zero PII collected; anonymous single learner progress stored locally in `localStorage` under `pocketlab_progress` (profile switcher UI deferred from MVP); formal legal compliance under the DPDP Act 2023 has not been assessed.
  * Audio safety: Gain node clamped to $-3\text{ dBFS}$ ($0.70$ linear scale) as a software ceiling to prevent digital clipping distortion on budget DACs (does not guarantee biological hearing safety or prevent physical speaker damage at elevated volume). Behavioral safeguards (default low volume $20\%–30\%$, zero autoplay, persistent mute controls, physical calibration) protect the listener.
  * Chemical disclaimer: Mandatory visible banner stating a pH reading does not test for pathogens and pH 7 does not establish water potability or biological safety.
  * Microphone permissions: Strictly optional, permission-gated, non-blocking fallback to synthetic generator. Zero recording storage.
* **Gaps:** None.

### Dimension 10: Licensing and Disclosure of Pre-Existing Work
* **Classification:** Complete and Internally Consistent.
* **Findings:** Explicitly bans borrowing PhET Scenery code or Phyphox GPL code/branding. Mandates custom MIT-compatible HTML5 Canvas and Web Audio API code written during the event window. Pre-event specifications disclosed transparently.
* **Gaps:** None.

### Dimension 11: Accessibility and Mobile Usability
* **Classification:** Incomplete (Medium Severity).
* **Gap Identified:** Biology food web canvas graph is visual; screen readers and low-vision learners need a deterministic non-visual text equivalent.
* **Resolution:** Mandate a semantic, collapsible HTML `<details>` table listing all producer-consumer relationships with `aria-live` status announcements.

### Dimension 12: Scope Consistency Across Project Documents
* **Classification:** Conflicting (High Severity).
* **Gap Identified:** The original hackathon PDF prompt emphasized selecting "one core STEM subject" (with Sound Detective as flagship), whereas the V2 directive mandates a "four-subject STEM missions" product.
* **Resolution:** Reconcile explicitly: Gramin PocketLab is architected as a **single cross-disciplinary STEM engine** that demonstrates scalability across all four NCERT subjects, while spotlighting **Sound Detective (Physics)** as the live flagship demonstration for judges.

---

## 3. Detailed Incomplete & Conflicting Items Register

| Item ID | Exact Requirement | Why It Matters | Severity | Recommended Resolution | Owner / Role | Measurable Acceptance Criterion |
| :--- | :--- | :--- | :---: | :--- | :--- | :--- |
| **GAP-01** | Accurate Offline Availability Framing | Claiming the app works "without internet" is technically false for the first visit and will fail judge inspection if tested on an uncached device without Wi-Fi. | **Blocker** | Update all documentation and UI to state: *"Requires one-time initial load (~2MB); fully operational offline thereafter via Service Worker."* | Dev 1 (Lead Architect) | App loads and executes all 4 missions in Chrome DevTools Offline mode after one initial page load. |
| **GAP-02** | AudioContext Mobile Gesture Unblock | Mobile browsers (Chrome/Android, iOS Safari) strictly block Web Audio output unless initialized directly inside a user touch/click gesture. | **Blocker** | Implement an explicit "Start Lab / Enable Audio" button on the Physics mission screen that synchronously calls `audioCtx.resume()`. | Dev 2 (Physics Lead) | Audio tones play reliably on a real mobile device without console warning: `The AudioContext was not allowed to start`. |
| **GAP-03** | Microphone Permission Graceful Degradation | If microphone access is denied or dismissed, the physics lab must not hang, throw unhandled promise rejections, or block mission completion. | **High** | Wrap `getUserMedia()` in a try/catch block; if error occurs, set `micAvailable = false`, display a non-blocking toast, and default to synthetic tone generation. | Dev 2 (Physics Lead) | User clicks "Block" on mic prompt; synthetic tone generator remains 100% interactive and user can reach Step 7. |
| **GAP-04** | 21-Hour Scope Containment for Biology Lab | Building an open-ended dynamic physics graph simulation in 21 hours risks delivery failure. | **High** | Scope Biology to a clean SVG-based 6-node state graph with 3 toggle buttons (Drought, Remove Snakes, Restore Balance) and deterministic state tables. | Dev 3 (Biology Lead) | Node graph renders cleanly in $<100$ lines of code with zero external graph libraries. |
| **GAP-05** | Math Invariant Enforcement on Free Input | If learners enter invalid or negative numbers into the water share allocation, the app could show inconsistent totals ($>T$ or $<0$). | **High** | Clamp all stepper inputs between $0$ and $T$ (where $T$ matches active exercise capacity, e.g. 12 or 24); disable verification button if `allocA + allocB + allocC != T`. | Dev 3 (Math Lead) | Verification button is disabled (`aria-disabled="true"`) whenever sum $\ne T$; error toast explains exact deficit/excess. |
| **GAP-06** | Screen Reader Fallback for Food Web | Visual graphs without text equivalents fail WCAG 2.1 AA and hackathon inclusion scoring. | **Medium** | Provide an accessible semantic HTML table detailing every predator-prey relationship directly below the SVG canvas. | Dev 4 (UI/UX Lead) | Screen reader (VoiceOver/TalkBack) reads: *"Grass eaten by Grasshopper; Grasshopper eaten by Frog"*. |
| **GAP-07** | Multilingual Dictionary Structure | Promising regional language support without a defined key-value schema leads to hardcoded text during late-night hackathon coding. | **Medium** | Pre-define a clean JSON localization dictionary (`content/i18n.json`) with complete English strings and human-reviewed Kannada keys. | Dev 5 (Content Lead) | Language selector toggles prompts between English and verified Kannada with zero missing keys. |
| **GAP-08** | Organizer Subject Selection Eligibility Confirmation | Whether the event rule requires submitting exactly one core STEM subject or permits a multi-subject modular suite remains an unconfirmed organizer question. Submitting four subjects without clarification could risk administrative penalization if the rule is strictly enforced. | **High** | Keep multi-subject eligibility as an open organizer question before freezing scope; prepare Physics (Sound Detective) as the primary flagship entry if single-subject compliance is required, while keeping Math, Biology, and Chemistry available to showcase platform modularity if multi-subject is approved. | Team Captain | Organizer clarification obtained on whether single-subject or multi-subject platform submission satisfies the competition prompt. |

---

## 4. Requirement Verification & Traceability Summary

* **All 4 Subjects Have Genuine Interactions:** Specified — implementation and runtime behavior not yet tested on target hardware.
  * Math: Dynamic stepper allocation with real-time tank sum calculation and ratio verification ($2, 4, 6$).
  * Biology: Interactive ecosystem disturbance toggles triggering simplified trophic cascade state recalculations.
  * Chemistry: Virtual indicator paper dip causing dynamic CSS color shifts (Natural Turmeric Paper & Universal Indicator Paper) across four beakers (Lemon Juice pH 2.2, Distilled Water pH 7.0, Baking Soda Solution pH 8.5, Soap Solution pH 10.0) and non-color text badge indicator.
  * Physics: Interactive frequency/amplitude sliders, Web Audio synthetic oscillator tone playback, dynamic sine canvas (targeting 60 FPS), and optional mic visualizer.
* **Formative Feedback & Exit Checks Present on All Subjects:** Specified — implementation and runtime behavior not yet tested. Every subject has an explicit misconception feedback script and a summative exit transfer check; scientific correctness reviewed, curriculum edition alignment pending teacher review.
* **Microphone Access Non-Blocking:** Specified — implementation and runtime behavior not yet tested. Physics lab design functions completely on synthetic tones; microphone input is purely an optional progressive enhancement.
