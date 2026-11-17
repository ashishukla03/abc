# STEM ZIP AUDIT REVIEW — GRAMIN POCKETLAB

**Document ID:** AUDIT-STEM-REVIEW-V1  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Date:** October 24, 2026  
**Status:** Audit Findings & Resolution Matrix  

---

## 1. Executive Summary & Review Findings

An exhaustive audit of all 80 files in the repository (66 Markdown, 11 CSV, 3 other files) confirmed that the overall project direction—Gramin PocketLab covering four NCERT STEM subjects (Mathematics, Biology, Chemistry, Physics) with a unified 7-step Predict-Observe-Explain inquiry engine—is conceptually solid, highly competitive, and well-structured.

### 1.1 What Is Present and Strong
* Comprehensive pedagogical specifications mapped to NCERT competencies.
* Misconception diagnosis and branching feedback mechanisms.
* Consistent UI design tokens with subject-specific identity accents.
* Modular, decoupled TypeScript interface contracts for concurrent team development.
* Realistic risk analysis and conservative 21-hour execution timeline.

### 1.2 Status of Application Code (`app/`)
* The `app/` directory currently contains strictly a Web App Manifest (`app/manifest.json`) and an SVG icon (`app/assets/icon.svg`).
* There is **zero runnable application code** (`index.html`, `main.js`, `index.css`, service worker).
* Acceptance test matrices represent planned verification procedures, not completed executions.
* **This status is fully intentional and compliant with hackathon rules** prohibiting pre-event code development. Core implementation will occur entirely within the official build window.

---

## 2. Key Audit Findings & Resolution Summary

### 2.1 Critical — Audio Safety Claim (−3 dBFS)
* **Finding:** Documents claimed that software gain clamping to $-3\text{ dBFS}$ prevents biological hearing damage and physical speaker damage. Digital signal scale (dBFS) is not physical sound pressure (dB SPL). Output volume depends on device hardware, headphone sensitivity, OS amplification, and acoustic transducers.
* **Resolution:** Removed false hearing-damage prevention and speaker-damage guarantee claims. Re-scoped $-3\text{ dBFS}$ ($0.70$ linear scale) clamping strictly as a software measure to prevent digital clipping distortion on phone DACs. Added true auditory safeguards and testing: conservative default volume ($20\%–30\%$), strict user-initiated playback (no autoplay), persistent global mute/stop controls, and a practical actual-device audio playback test plan (verifying playback, user-controlled volume, stop/mute responsiveness, and distortion; without claiming calibrated SPL or guaranteed hearing safety).

### 2.2 Critical — PhET Licensing Misreported
* **Finding:** The repository claimed published PhET simulations are licensed under CC BY 4.0. Current official PhET licensing ([https://phet.colorado.edu/en/licensing](https://phet.colorado.edu/en/licensing)) states regular published HTML simulations are licensed under **CC BY-NC 4.0** (Creative Commons Attribution-NonCommercial 4.0). Individual software repositories under the PhET organization carry distinct licenses (including GPL-3.0, MIT, or custom terms depending on the specific repository), and commercial reuse requires a paid license agreement from CU Boulder.
* **Resolution:** Corrected all licensing references. Formally adopted the policy to **author 100% original, lightweight HTML5 Canvas micro-simulations** under proposed MIT terms (pending explicit team approval) during the hackathon. PhET is retained solely as pedagogical inspiration; zero PhET source code or compiled packages will be bundled.

### 2.3 High — National Education Statistics (UDISE+ Table 7.23 & ASER)
* **Finding:**
  * UDISE+ reports whether facilities are *reported as available*, not functional equipment status or internet reliability. Official UDISE+ 2024–25 Table 7.23 indicates that an integrated science-lab facility was reported available in **57.1%** of schools with secondary sections across All Managements, and in **51.7%** of government schools with secondary sections nationally (leaving 48.3% of government secondary sections without this facility space). Internet facility is reported available in **58.6%** of government schools nationally. Neither table establishes specific "rural-only" percentages claimed earlier.
  * ASER 2023 ("Beyond Basics") reported that 89.0% of surveyed rural youth had a smartphone at home, and among those who could use one, 66.1% engaged in educational activity during the reference week. The earlier claim of "only 57% educational use" was inaccurate and misleading.
* **Resolution:** Corrected statistics with precise table/citation sources and accurate denominators (UDISE+ Table 7.23: 57.1% all-managements, 51.7% government schools with secondary sections). Marked untraceable subgroup claims as unverified assumptions.

### 2.4 High — Oscilloscope Waveform Cycle Mathematics
* **Finding:** Specifications asserted that a $0–10\text{ ms}$ window shows exactly 2 cycles at 220 Hz and 4 cycles at 440 Hz. In reality, a $10\text{ ms}$ ($0.010\text{ s}$) window contains $220 \times 0.010 = 2.2$ cycles and $440 \times 0.010 = 4.4$ cycles.
* **Resolution:** Updated specifications to cite accurate mathematics ($2.2$ and $4.4$ cycles across $10\text{ ms}$). Explicitly designated the visual canvas as an illustrative, normalized educational oscilloscope demonstrating a clear $2\times$ horizontal compression on frequency doubling. Updated acceptance tests accordingly.

### 2.5 High — UI Control-Border Contrast
* **Finding:** The specified `--color-border: #D9E0EB` token exhibits only about $1.38:1$ contrast against white, failing the W3C WCAG 2.1 Non-text Contrast requirement of $3:1$ for essential UI component boundaries. Premature claims of WCAG compliance were made without testing rendered interfaces.
* **Resolution:** Introduced a dedicated high-contrast interactive control border token: `--color-border-control: #6B7280` (recalculated at **4.83:1** against white and **4.51:1** against `#F5F7FB`, exceeding the 3:1 non-text target). Preserved dual affordances (solid fills, distinct text labels, and $3\text{ px}$ focus rings). Removed premature compliance claims, reclassifying accessibility goals as design targets to be validated on real viewports during the build.

### 2.6 High — Mathematics Pesticide Context & Input Bounds
* **Finding:**
  * Mathematics Exit Check 1 referenced mixing 30 liters of neem pesticide spray in a $1 : 5$ ratio, which could be misconstrued as real agricultural pesticide mixing advice.
  * Input boundaries were hardcoded to $0–12$, conflicting with State 2 exercises ($T = 24$) and Exit Check 2 (24 notebooks).
* **Resolution:** Replaced the pesticide question with a neutral school craft workshop example: mixing 30 liters of clay slurry using powdered clay and water in a $1 : 5$ ratio ($5\text{ L}$ clay powder). Replaced the static $0–12$ bound with dynamic clamping $[0, T]$ matching current exercise capacity.

### 2.7 High — Chemistry pH Wording
* **Finding:** Content stated "pH 11 is a strong base." In chemical nomenclature, "strong base" refers to complete dissociation (e.g. $\text{NaOH}$), whereas pH is hydrogen ion concentration.
* **Resolution:** Replaced with introductory curriculum phrasing: "pH 11 represents a basic / alkaline solution."

### 2.8 High — Assessment Threshold vs. Binary Questions
* **Finding:** Learning objectives specified $\ge 80\%$ accuracy, while providing exactly two binary exit-check questions (which can only yield $0\%$, $50\%$, or $100\%$).
* **Resolution:** Replaced with a clear "two-out-of-two (100%)" transfer mastery criterion.

### 2.9 Operational Inconsistencies Resolved
* **Language Scope:** Locked on English as complete primary/fallback; Kannada draft strings retained under `[PENDING HUMAN REVIEW]`; Hindi deferred outside initial MVP scope.
* **User Profiles:** Deferred multi-student profile switcher UI (`profile_1` / `profile_2`) from the MVP; scoped to single local session in `localStorage`.
* **Competitor Research (DIKSHA):** Corrected documentation to accurately reflect DIKSHA's official capabilities (guest access, offline downloads, QR access, Kannada). Re-centered differentiation on our interactive 7-step POE cycle and real-time micro-simulations.
* **False Precision in Scoring:** Reclassified the $90.8/100$ score as an internal heuristic preparation evaluation. Reclassified performance metrics ("sub-2MB," "60 FPS," "zero latency") as engineering design targets.
* **Hyperlinks:** Replaced all 57 machine-specific `file:///c:/...` links with portable relative markdown links.
* **Citation DOI:** Corrected feedback meta-analysis DOI to `10.3389/fpsyg.2019.03087`.
* **Event Schedule:** Locked planning to a conservative 21-hour window (8 AM Nov 17 to 5 AM Nov 18); added task to confirm schedule and subject presentation rules with organizers at registration.
