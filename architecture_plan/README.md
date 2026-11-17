# Gramin PocketLab — Technical Architecture Index

**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Event:** STEM for Impact 2026 (Presidency University, Bengaluru)  
**Role:** Senior Front-End Architect & Open-Source Compliance Reviewer  
**Status:** Pre-Event Architecture Proposal Complete (Zero Code Implemented)  

---

## Architecture Deliverables Directory

1. **[ARCHITECTURE_PROPOSAL.md](./ARCHITECTURE_PROPOSAL.md)**
   * Existing workspace inspection (zero pre-existing framework baggage).
   * System architecture decomposition: shared learning engine decoupling, module boundaries, Web Audio synthesizer pipeline, and the **minimum vertical slice** (Sound Detective flagship) to build during Hours 00:00–03:00.

2. **[MODULE_INTERFACE_CONTRACT.md](./MODULE_INTERFACE_CONTRACT.md)**
   * Formal TypeScript interfaces and concrete module schemas (`StemMissionDefinition`, `SubjectInteractionHandler`, `AssessmentItem`).
   * Decoupled module boundaries enabling four subject developers to build concurrently without engine conflicts.
   * Concrete reference implementation for `modules/math.js`.

3. **[OFFLINE_AND_PRIVACY_PLAN.md](./OFFLINE_AND_PRIVACY_PLAN.md)**
   * Truthful offline framing: Cache-First Service Worker caches bundle on first load, operating 100% offline in Airplane Mode thereafter.
   * LocalStorage failure fallback to in-memory store.
   * Safe microphone lifecycle (immediate hardware track release, non-blocking denial fallback, strict prohibition on saving or uploading raw audio).
   * Factual data-handling architecture (zero PII collected, anonymous single session stored locally; formal legal compliance under DPDP Act 2023 not assessed).

4. **[DEPENDENCY_AND_LICENCE_REGISTER.csv](./DEPENDENCY_AND_LICENCE_REGISTER.csv)**
   * Comprehensive open-source audit of PhET, Phyphox, Kolibri, Mathigon, CircuitVerse, Oppia, Lucide Icons, and native W3C Web APIs.
   * Categorization into: *Potentially reusable after approval*, *Inspiration only*, and *Avoid for this event*.

5. **[ARCHITECTURE_DECISION_RECORD.md](./ARCHITECTURE_DECISION_RECORD.md)**
   * 5 finalized Architecture Decision Records (ADRs) covering the zero-build native web stack, client-only zero-server execution, Web Audio acoustic synthesis, progressive microphone enhancement, and the avoidance of heavy/GPL-3.0 repositories.
