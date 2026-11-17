# Gramin PocketLab — Team Coordination & Integration Index

**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Event:** STEM for Impact 2026 (Presidency University, Bengaluru)  
**Role:** Integration Coordinator & Technical Delivery Lead  
**Planning Horizon:** Conservative 21-Hour Phased Execution Window  

---

## Team Coordination Deliverables Directory

1. **[TEAM_OWNERSHIP.md](./TEAM_OWNERSHIP.md)**
   * Complete 5-person role allocation matrix mapping Lead Dev, Physics Lead, Math Lead, Bio/Chem Lead, and QA/Design Lead to exclusive file ownership boundaries.
   * Frozen core interfaces that module owners must not change independently.
   * Skill-adaptive rebalancing plans for non-programmer and full-stack team variations.

2. **[INTEGRATION_PLAN.md](./INTEGRATION_PLAN.md)**
   * Trunk-based git branching strategy (`feat/<subject>-<feature>`) and PR review governance.
   * Five sequential integration checkpoints with strict deadlines and sign-off criteria.
   * Parallelization blueprint guaranteeing zero-collision development between Hours 06:30 and 12:00.

3. **[BUILD_WINDOW_PLAN.md](./BUILD_WINDOW_PLAN.md)**
   * Chronological hour-by-hour execution schedule across 6 distinct phases.
   * Priority hierarchy: Shell $\rightarrow$ Physics flagship $\rightarrow$ 3 parallel modules $\rightarrow$ Formative feedback $\rightarrow$ Offline device QA $\rightarrow$ Code freeze and rehearsal.

4. **[SCOPE_FREEZE_AND_FALLBACKS.md](./SCOPE_FREEZE_AND_FALLBACKS.md)**
   * Three rigid scope-freeze enforcement rules (Hour 12 module freeze, feature cut triggers, Hour 19 absolute code freeze).
   * Module-specific fallback downgrades if any developer falls behind schedule.
   * Zero-failure demonstration protocols for microphone denial/noise and venue Wi-Fi crashes (Airplane Mode demo).
