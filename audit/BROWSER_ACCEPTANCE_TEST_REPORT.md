# BROWSER ACCEPTANCE TEST REPORT — GRAMIN POCKETLAB

**Document ID:** BATR-2026-001  
**Target URL:** `http://localhost:8000/` (Served from `c:\Users\priya\Downloads\STEM\app`)  
**Browser Engine:** Google Chrome Headless (`Chrome/157.0.8103.38`, Windows 64-bit)  
**Protocol:** Chrome DevTools Protocol (CDP) via native Node.js WebSocket  
**Test Script:** [`tests/run_real_browser_validation.mjs`](file:///c:/Users/priya/Downloads/STEM/tests/run_real_browser_validation.mjs)  
**Execution Timestamp:** November 9, 2026 (Live Execution)  
**Overall Status:** PASS (8 / 8 Checks Passed)

---

## 1. Executive Summary

This report documents the live, automated end-to-end browser acceptance testing of Gramin PocketLab running in an authentic Google Chrome browser instance. Unlike unit tests running against a simulated DOM in Node.js, these tests were executed directly inside a Chromium browser engine using the Chrome DevTools Protocol (CDP) to verify DOM layout, real Canvas 2D painting, Web Audio context state changes, client hash routing, LocalStorage persistence across reloads, and responsive layout behavior under mobile viewports.

---

## 2. Test Execution & Verification Matrix

| Check ID | Verification Area | Target Action & Requirement | Real Browser Result | Status |
| :--- | :--- | :--- | :--- | :---: |
| **BAT-01** | **Initial Application Load & Console Integrity** | Launch `http://localhost:8000/`. Verify page title contains "Gramin PocketLab" and zero uncaught JavaScript exceptions or runtime console errors occur. | Page loaded with title: `"Gramin PocketLab — STEM Missions"`.<br>Uncaught exceptions: `0`<br>Console error logs: `0` | **PASS** |
| **BAT-02** | **Mission Map & Subject Navigation** | Verify `#s0_map` renders 4 subject cards. Click Physics "Start Mission" button (`.btn-select-subject`). Verify client hash router transitions to `#/physics/s1_intro`. | 4 subject cards rendered.<br>Physics card selected.<br>Router URL updated to `#/physics/s1_intro`. | **PASS** |
| **BAT-03** | **Pedagogical Progression (S1 $\rightarrow$ S2 $\rightarrow$ S3)** | On S1: Click "Start Investigation" $\rightarrow$ verify navigation to `#/physics/s2_predict`.<br>On S2: Select hypothesis radio `opt-a` and click "Enter Lab" $\rightarrow$ verify navigation to `#/physics/s3_explore` and Canvas element presence. | S1 CTA navigates to `#/physics/s2_predict`.<br>Hypothesis radio input enabled submit button.<br>Navigated to `#/physics/s3_explore`.<br>`#phys-oscilloscope-canvas` mounted: `true`. | **PASS** |
| **BAT-04** | **Physics Audio Engine & Tone Synthesis** | In S3 Micro-Lab:<br>1. Verify zero autoplay (audio does not synthesize on screen load).<br>2. Click `#phys-preset-220` $\rightarrow$ verify audio tone starts and state badge reads "🔊 Tone Playing".<br>3. Click `#phys-preset-440` $\rightarrow$ verify cycle readout updates to "4.4 cycles / 10 ms".<br>4. Click `#phys-stop-btn` $\rightarrow$ verify audio halts and state badge reads "⏹ Stopped". | AudioContext initialized suspended.<br>220 Hz playback triggered: `true`.<br>440 Hz cycles badge: `"4.4 cycles / 10 ms"`.<br>Stop button halted audio: `true` (state badge reads "⏹ Stopped"). | **PASS** |
| **BAT-05** | **End-to-End Inquiry Cycle (S3 $\rightarrow$ S6)** | 1. Click `#btn-s3-observed` to advance to S4 Concept.<br>2. Click `#btn-s4-check` to advance to S5 Diagnostic.<br>3. Answer diagnostic question `opt-b` and submit.<br>4. Click `#btn-s5-proceed` to advance to S6 Exit Check.<br>5. Answer Exit Q1 (`opt-a`) and Q2 (`opt-b`), submit.<br>6. Verify mastery badge awarded and stored in `localStorage`. | S3 $\rightarrow$ S4 $\rightarrow$ S5 $\rightarrow$ S6 completed.<br>Summative score: 2/2.<br>`localStorage.getItem('pocketlab_progress')` verified containing `progress.physics.isCompleted = true` and `earnedBadgeId = "badge_physics_mastery"`. | **PASS** |
| **BAT-06** | **Browser Refresh Persistence** | Trigger full page reload (`Page.reload`). Verify `localStorage` state is read on startup and completion badge remains preserved. | Page reloaded via CDP.<br>`pocketlab_progress` parsed correctly.<br>State preserved: `true`. | **PASS** |
| **BAT-07** | **Mobile Viewport Usability ($360\text{px} \times 640\text{px}$)** | Set device metrics override to $360\text{px}$ width (Redmi 9A / low-end Android mobile standard). Verify no horizontal scroll overflow (`documentElement.scrollWidth <= 360`). | Initial run detected 12px overflow (`scrollWidth: 372px`) due to `.header-center` pill on narrow widths.<br>Applied CSS fix in `app/css/main.css` (`@media (max-width: 480px)` hides redundant header pill).<br>Re-test confirmed: `documentElement.scrollWidth = 360px` (`hasHorizontalOverflow = false`). | **PASS** |
| **BAT-08** | **Offline Service Worker Functionality** | 1. Verify `navigator.serviceWorker.controller` is active.<br>2. Verify `caches.open('pocketlab-v2')` contains all 16 precached assets.<br>3. Set `Network.emulateNetworkConditions({ offline: true })`.<br>4. Trigger page reload while disconnected.<br>5. Verify app renders shell and `#runner-stage`. | Service Worker active: `true`.<br>Cache asset count: `16`.<br>Reloaded in offline mode: `true`.<br>Shell and stage rendered successfully while disconnected. | **PASS** |

---

## 3. Real Browser Console Logs

During the entire automated Chrome CDP execution session, all console calls were captured:
- **Total Warnings:** `0`
- **Total Uncaught Errors:** `0`
- **Total Console Error Messages:** `0`

---

## 4. Defect Remediated During Real Browser Testing

- **Defect ID:** DEF-BAT-01
- **Severity:** Medium (Mobile Usability)
- **Description:** On a $360\text{px}$ viewport, `document.documentElement.scrollWidth` reported $372\text{px}$ (12px horizontal overflow).
- **Root Cause:** In `app/css/main.css`, `.header-inner` contained the brand title, the network status pill (`.header-center`), and three action buttons (`.header-right`) in a non-wrapping flex row with $16\text{px}$ horizontal padding.
- **Fix Applied:** In `app/css/main.css` ([line 186](file:///c:/Users/priya/Downloads/STEM/app/css/main.css#L186)), added a `@media (max-width: 480px)` rule reducing header padding to $8\text{px}$ and hiding `.header-center` (as offline readiness is already prominently displayed on the mission map and brief screens).
- **Verification:** Re-running CDP mobile emulation confirmed `document.documentElement.scrollWidth === 360`, completely eliminating horizontal scroll.

