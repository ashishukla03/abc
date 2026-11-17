# FINAL RISK REGISTER & FAILURE PREVENTION PROTOCOLS

**Document ID:** SYNTHESIS-FINAL-RISKS-V2  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Event:** STEM for Impact 2026, Presidency University, Bengaluru  
**Role:** Independent Synthesis Lead & Risk Officer  
**Objective:** Identify the high-consequence failure modes that could jeopardize the hackathon outcome and define non-negotiable operational controls.  

---

## 1. Comprehensive Risk Register

| Risk ID | Category | Specific Threat Description | Probability | Impact | Mitigation Strategy & Operational Control | Owner |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- |
| **RSK-01** | **Technical / Audio** | Mobile browser blocks Web Audio output on judge's phone due to strict autoplay policies. Sound Detective is silent. | High | **Catastrophic** | Enforce an explicit, unblockable synchronous user gesture button: `"Tap to Enable Sound & Enter Lab"` that calls `audioCtx.resume()` before mounting the canvas stage. | Dev 2 (Physics Lead) |
| **RSK-02** | **Technical / Offline** | Judge tests offline claim on an uncached device without Wi-Fi, causing browser network failure. Team accused of false claims. | Medium | **High** | Frame pitch accurately: *"Offline-first PWA caching on initial load, running offline in Airplane Mode after successful cache installation."* Pre-cache all demonstration smartphones prior to judging. | Team Captain |
| **RSK-03** | **Rules / Governance** | Ambiguity regarding whether the hackathon guideline permits multi-subject platforms or expects a single-subject entry. | Medium | **Medium** | Keep multi-subject eligibility as an OPEN organizer question at registration; do not assert that one subject is mandatory unless official rulebook confirms it. Pitch Physics (Sound Detective) as primary flagship with modular platform scalability. | Team Captain |
| **RSK-04** | **Execution / Time** | Team attempts to build dynamic physics particle systems or custom graph layout engines, missing the 21-hour submission deadline. | Medium | **High** | Strictly lock MVP interaction bounds: Biology uses clean static SVG node toggles (simplified model); Math uses standard HTML stepper inputs; Physics uses a lightweight mathematical sine formula. | Dev 1 (Lead Architect) |
| **RSK-05** | **Legal / IP** | Accidentally copying PhET Scenery code or using the registered "Phyphox" name/logo, risking disqualification. | Low | **Catastrophic** | 100% original code authored during event. Zero PhET Scenery clones; zero Phyphox trademarks; pure W3C Web Audio API and Canvas standards under MIT. | Dev 1 & All Devs |
| **RSK-06** | **Scientific / Safety** | Failing to emphasize that pH 7 does not guarantee drinking water is biologically safe, leading to critique from science judges. | Low | **Medium** | Chemistry screen mandates a permanent, unmissable warning banner: *"A neutral pH of 7 does NOT prove water is biologically safe to drink."* | Dev 2 (Chemistry Lead) |
| **RSK-07** | **Hardware / Usability** | Controls too small or text clipped on budget 360px Android screens (Redmi/Realme). | Medium | **High** | Strict enforcement of $48\text{ px}$ minimum touch targets, 8pt spacing grid, zero horizontal overflow (`overflow-x: hidden`), and testing on physical budget hardware. | Dev 4 (UI/UX Lead) |
| **RSK-08** | **Privacy / Legal** | Collecting student names, phone numbers, or storing raw microphone audio, violating India's DPDP Act 2023. | Low | **High** | Zero PII collected; single anonymous local session under `pocketlab_progress` in `localStorage` (multi-profile deferred to post-MVP); mic audio processed exclusively in volatile memory; zero audio saved. | Dev 1 (Lead Architect) |

---

## 2. Non-Negotiable Operational Controls Before Kickoff

1. **The "Airplane Mode" Verification Protocol:** Before stepping up to the judges' table, the presenter must toggle the demo phone to Airplane Mode in front of the judges, launch the app, and demonstrate full functionality.
2. **The "Zero Unrun Code" Rule:** No code may be authored before the official event timer starts. Specifications and architectural contracts are our tools for speed during the event.
3. **The "Single Speaker" Audio Rule:** Physics audio output must be software-clamped to $-3\text{ dBFS}$ to ensure tones are clean, pleasant, and non-distorting on budget mobile phone speakers. Paired with low default volume ($20\%–30\%$), strict user-initiated playback (no autoplay), prominent mute/stop controls, and pre-judging physical handset sound level calibration.
