# 3-MINUTE JUDGING DEMO SMOKE TEST — GRAMIN POCKETLAB

**Document ID:** QA-SMOKE-TEST-V2  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Event:** STEM for Impact 2026, Presidency University, Bengaluru  
**Role:** Lead Presenter & QA Smoke Test Engineer  
**Objective:** A rehearsed, zero-failure 180-second live demonstration script for judging panels proving real interaction, offline resilience, and pedagogical impact.  

---

## 1. Pre-Demo Checklist (T-minus 5 Minutes)

* [ ] Demo smartphone (budget Android) is charged $\ge 50\%$.
* [ ] Application has been successfully loaded at least once on Wi-Fi so Service Worker CacheStorage is populated on the device.
* [ ] Device volume is tested at a conservative initial level ($20\%–30\%$), and adjusted comfortably without distortion.
* [ ] **DEVICE IS PLACED IN AIRPLANE MODE** (verifying offline operation from Service Worker cache on this pre-cached handset).

---

## 2. Chronological 3-Minute Live Script & Test Actions

```
+---------------------------------------------------------------------------------------------------+
| TIME      | DEMO ACTION                                   | VERIFIABLE OBSERVATION FOR JUDGES     |
+---------------------------------------------------------------------------------------------------+
| 00:00 -   | 1. Show Home Screen (S0)                      | - Read 1-sentence product mission.    |
| 00:30     | 2. Point out "Cached Offline" green pill      | - Explain Service Worker cache mode.  |
|           | 3. Show 4 active subject cards                | - Prove all 4 subjects are available. |
|           | 4. Tap "Start Investigation" on Physics card  | - Transition cleanly to S1 Intro.     |
+-----------+-----------------------------------------------+---------------------------------------+
| 00:30 -   | 1. Tap "Make Prediction" (S1 -> S2)           | - Low-stakes hypothesis interface.    |
| 01:00     | 2. Select: "Pitch gets higher (shrill)"       | - Radio highlights in subject accent. |
|           | 3. Tap "Enter Lab" (Synchronous Audio Unlock) | - AudioContext resumes silently.      |
+-----------+-----------------------------------------------+---------------------------------------+
| 01:00 -   | 1. Tap "Play 220 Hz" on S3                    | - Audible low-pitched tone plays.     |
| 01:45     | 2. Show responsive oscilloscope canvas        | - 2.2 cycles across 10 ms window.     |
| (FLAGSHIP)| 3. Tap "Play 440 Hz"                          | - Audibly jumps 1 octave higher.      |
|           | 4. Point out canvas wave compression          | - Exactly 4.4 cycles (2x compression).|
|           | 5. Slide Amplitude from 20% to 70%            | - Sound gets louder; wave height grows|
|           |                                               |   vertically; peak spacing constant!  |
|           | 6. Tap "Stop Tone"                            | - Sound ceases immediately.           |
+-----------+-----------------------------------------------+---------------------------------------+
| 01:45 -   | 1. Tap "Advance to Explanation" (S4)          | - Visual recap connects to lab state. |
| 02:15     | 2. Show S5 Feedback & Scaffolding             | - Explain how misconceptions are fixed|
|           | 3. Complete S6 Exit Check transfer question   | - Show real score calculation (2/2).  |
+-----------+-----------------------------------------------+---------------------------------------+
| 02:15 -   | 1. Tap "Return to Mission Map" (S0)           | - Physics card shows completion badge.|
| 02:45     | 2. Tap Chemistry card -> pH Color Lab         | - Dip turmeric into soap beaker.      |
| (MODULAR) | 3. Show dynamic color shift (Yellow -> Brown) | - Scale highlights pH 10.0 (Basic).   |
|           | 4. Point out Water Safety Disclaimer          | - "pH 7 does NOT prove water safety". |
+-----------+-----------------------------------------------+---------------------------------------+
| 02:45 -   | 1. Summarize: 4 Subjects, 1 Engine, PWA       | - Zero cloud dependencies.            |
| 03:00     | 2. Answer Judge Questions                     | - Point to NCERT curriculum alignment.|
+---------------------------------------------------------------------------------------------------+
```

---

## 3. Emergency Backup Protocols During Judging

1. **If Judges Request Microphone Test:**  
   * Tap `[ 🎙 Test Microphone ]`. If venue auditorium is too noisy to get a clean pitch, tap `[ ⏹ Switch back to Synthetic Generator ]`. Emphasize that progressive enhancement guarantees the student's lesson is never blocked.
2. **If Judges Ask "Does it work on low-end phones?":**  
   * Hand them the physical Redmi 9A test device directly. Point out the responsive 2D canvas rendering and $48\text{ px}$ touch targets.
3. **If Judges Ask About Offline Reality:**  
   * Explain the Service Worker lifecycle: the application loads and caches assets on its initial visit, allowing subsequent launches on the same cached device to operate without an active internet connection. Refresh the page while in Airplane Mode to demonstrate cache retrieval.
