# BLOCKERS & CRITICAL ACTIONS BEFORE EVENT KICKOFF

**Document ID:** AUDIT-BLOCKERS-PRE-EVENT-V1  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Event:** STEM for Impact 2026, Presidency University, Bengaluru  
**Date:** October 20, 2026  
**Status:** Urgent Pre-Event Action Items  

---

## 1. High-Priority Blockers (Must Be Addressed Before Hour 00:00)

| Blocker ID | Critical Risk Area | Why It Blocks Success | Required Immediate Pre-Event Action | Assigned Owner | Acceptance Verification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BLK-01** | **Mobile Web Audio Autoplay Gesture** | Mobile browsers (Chrome/Android, iOS Safari) strictly suspend Web Audio unless initialized directly inside a user touch/click event handler. If missed, Sound Detective will produce zero sound during judging. | Finalize the interaction pattern: include an explicit, unblockable "Tap to Enable Sound & Enter Lab" button that calls `audioCtx.resume()` synchronously inside the click callback before rendering the physics stage. | **Dev 2 (Physics Lead)** | Specified & emulated via Chrome CDP: sound plays only on explicit tap; physical Android hardware test pending event day. |
| **BLK-02** | **Accurate Offline Framing & Pitch Alignment** | Judges will test the app in Airplane Mode. If we claim it works "without internet", but the first-ever visit on an uncached judge device fails because the device was never connected, the team will be penalized for false claims. | Formulate our exact pitch phrase: *"Gramin PocketLab is an offline-first PWA that caches its complete bundle on initial load, running offline in Airplane Mode after successful cache installation."* Pre-cache the demo devices before stepping up to the judges' table! | **Team Captain & Dev 1** | Judge device loads from cache in Airplane Mode; pitch deck clearly explains the first-load caching architecture. |
| **BLK-03** | **Hackathon Subject Rule Alignment** | Whether the hackathon prompt requires focusing exclusively on a single core STEM subject or permits a multi-subject platform with a flagship module is an unconfirmed prompt interpretation. Keep multi-subject eligibility as an OPEN organizer question for check-in confirmation; do not assert that one subject is mandatory unless the official rulebook explicitly confirms it. | Prepare our opening elevator pitch and clarify with organizers at check-in: *"Our entry for STEM for Impact 2026 tackles Physics (Sound Detective) as our core flagship demonstration, built on a modular learning engine that proves scalability across Mathematics, Biology, and Chemistry."* | **Team Captain** | Keep multi-subject eligibility as an OPEN organizer question; clarify interpretation at event check-in. |
| **BLK-04** | **Hardware Test Device Readiness** | Relying on desktop browser emulation during development can hide mobile touch bugs, CSS viewport layout shifts, and audio latency issues. | Secure at least two real physical budget Android smartphones (ideally sub-$100 Redmi/Realme devices running Android 10/11) with Chrome installed for live testing during the hackathon. | **Dev 5 (QA Lead)** | Test devices on hand, charged, and connected to local dev server via USB debugging or local Wi-Fi. |

---

## 2. The Smallest Set of Pre-Event Decisions the Team Must Resolve

Before the 21-hour build window starts, the team needs consensus on exactly **three concise choices**:

1. **Tech Stack Confirmation:**  
   * *Question:* Do we commit 100% to **Vanilla HTML5 + ES6 Modules + Vanilla CSS**?  
   * *Recommendation:* **YES**. Eliminates npm build failures, node_modules bloat, and bundler headaches, keeping the build lean, robust, and lightning-fast.
2. **Language Scope for Bengaluru Judging:**  
   * *Question:* How do we handle regional language support for the MVP?  
   * *Recommendation:* **English primary fallback + Kannada review (Hindi deferred)**. The hackathon is hosted at Presidency University, Bengaluru. Keep English as complete primary fallback, verify draft Kannada strings with a native speaker on the team before production exposure, and keep Hindi deferred outside the initial MVP scope.
3. **Pre-Hackathon Code Freeze Integrity:**  
   * *Question:* Do all team members agree to refrain from writing application code before the official timer starts?  
   * *Recommendation:* **YES**. Preserve hackathon integrity and fair play. Rely strictly on our pre-event specifications and research dossiers to build with maximum velocity during the official window.
