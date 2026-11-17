# Gramin PocketLab Governed Multi-Agent Swarm Orchestration Plan

**Product:** Gramin PocketLab (Classes 5–12 All-Subject Learning Ecosystem)  
**Author:** Multi-Agent Orchestration Lead & Principal Systems Architect  
**Date:** November 2026  
**Status:** COMPLETE / GOVERNANCE APPROVED  

---

## 1. Executive Summary & Orchestration Principles

Building a massive, multi-board, offline-first learning platform across 8 grades (Classes 5–12) requires coordinated development velocity without sacrificing architectural integrity, child privacy, or code quality. 

This document defines the **Governed Multi-Agent Swarm Framework** for Gramin PocketLab. By pairing specialized autonomous agents with isolated workspaces, strict file ownership boundaries, structured communication protocols, and an independent verification gate, the system enables high-throughput parallel execution while preventing race conditions, scope creep, and untested regressions.

---

## 2. Antigravity Capabilities & Execution Architecture

### 2.1. Native Subagent Subsystem
Antigravity provides first-class native tool primitives for launching and governing isolated agent execution:
* `invoke_subagent`: Spawns an agent instance with a dedicated prompt, role, and workspace mode (`'branch'`, `'share'`, or `'inherit'`).
* `define_subagent`: Declares persistent subagent archetypes with custom system prompts, write tool access, and MCP integration.
* `manage_subagents`: Inspects live subagent state, lists active processes, or terminates unresponsive agents.
* `send_message`: Routes peer-to-peer messages across active agent conversation threads.

### 2.2. Workspace Isolation Mode
All implementation agents must run with `Workspace: 'branch'`. This provisions a clean, isolated Git branch/worktree for each agent, preventing concurrent file writes, uncommitted conflicts, and cross-agent code contamination.

### 2.3. User-Facing Slash Commands
Antigravity features built-in UI commands (`/swarm`, `/teamwork`, `/boost`) that trigger multi-agent workflows from the user interface. Because these commands are interactive UI triggers, the orchestrator recommends the exact syntax for user invocation:
```text
/swarm Implement Stage 1 of Gramin PocketLab using the Governed Swarm Architecture defined in MULTI_AGENT_ORCHESTRATION_PLAN.md. Assign isolated worktrees, enforce AGENT_FILE_OWNERSHIP_MATRIX.csv, and gate all merges through QA Verifier.
```

---

## 3. The 12 Governed Agent Roles

```
+---------------------------------------------------------------------------------------------------+
|                                 LEAD ENGINEERING ORCHESTRATOR                                     |
|                                     (Swarm Coordinator)                                           |
+---------------------------------------------------------------------------------------------------+
           |                                                                      |
           v                                                                      v
+-----------------------+  +-----------------------+  +---------------------------------------------+
|    DESIGN & DOMAIN    |  |  APPLICATION RUNTIME  |  |           INTEGRITY & COMPLIANCE            |
|-----------------------|  |-----------------------|  |---------------------------------------------|
| 1. Curriculum Arch    |  | 3. Frontend Engineer  |  | 8. Accessibility & Perf Engineer            |
| 2. Creative Director  |  | 4. Motion Engineer    |  | 9. Security & Privacy Engineer              |
|                       |  | 5. QuestionWorld Eng  |  | 10. QA Verifier / Challenger (GATEKEEPER)   |
|                       |  | 6. School Hub Eng     |  |                                             |
|                       |  | 7. Profile Data Eng   |  |                                             |
+-----------------------+  +-----------------------+  +---------------------------------------------+
```

### Role Catalog:
1. **Lead Orchestrator (Coordinator):** Task assignment, worktree provisioning, milestone synchronization, blocker triage, final merge integration.
2. **Curriculum Architect:** Board alignment (CBSE, ICSE, State Boards), learning objectives, Bloom taxonomy tags, question schemas.
3. **Creative Director:** Design system tokens, typography scales, responsive layouts, color contrast compliance, visual affordances.
4. **Frontend Core Engineer:** Application shell, state management, router, client storage (IndexedDB), Service Worker lifecycle.
5. **Motion Systems Engineer:** Compositor animations, CSS keyframe tokens, WAAPI transitions, reduced-motion overrides.
6. **QuestionWorld Simulation Engineer:** Sandboxed interactive manipulatives, SVG/Canvas apparatus, procedural physics/chemistry engines.
7. **School Hub & Timetable Engineer:** Exam preparation planner, revision scheduler, offline timetable management, calendar integration.
8. **Learner Profile & Data Engineer:** Personal learning models, mastery estimation (BKT), offline telemetry, encrypted state persistence.
9. **Backend & Cloud Integration Engineer:** Cloud sync protocol, conflict-free replicated data types (CRDTs), API contracts, auth adapters.
10. **Accessibility & Performance Engineer:** WCAG 2.2 AA auditing, screen reader semantics (ARIA), memory optimization, 60fps frame profiling.
11. **Security & Child Privacy Engineer:** DPDP Act 2023 compliance, parent consent gates, zero third-party telemetry, local AES-GCM encryption.
12. **QA Verifier & Independent Challenger:** Uncompromising gatekeeper; executes test runners, static linters, visual regression, AST checks; holds veto power over all merges.

---

## 4. Five-Stage Swarm Lifecycle & Governance Gates

```
+-----------------------------------------------------------------------------------+
| STAGE 1: INGESTION & WORKSPACE PROVISIONING                                        |
| - Orchestrator ingests baseline artifacts and checks starting SHA-256 hashes      |
| - Provisions isolated Git branches/worktrees per specialized worker               |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
| STAGE 2: PARALLEL WORKSTREAM EXECUTION                                            |
| - Specialized workers operate concurrently in their isolated branches             |
| - Strictly respect AGENT_FILE_OWNERSHIP_MATRIX.csv (Zero out-of-scope edits)       |
| - Communicate blockers via @mention handoff cards                                 |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
| STAGE 3: ISOLATED WORKTREE COMMIT & PULL REQUEST                                  |
| - Worker verifies branch with local tests and static validation                   |
| - Generates atomic commit with verifiable artifact summary                        |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
| STAGE 4: INDEPENDENT VERIFICATION QUALITY GATE (MANDATORY)                         |
| - QA Verifier executes automated test suite, AST validators, and visual checks    |
| - If ANY check fails -> Immediate rejection back to worker branch                 |
| - If 100% checks pass -> Verifier signs cryptographic pass certificate            |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
| STAGE 5: INTEGRATION OWNER MERGE & RELEASE RECONCILIATION                         |
| - Lead Orchestrator performs fast-forward merge into mainline branch              |
| - Regenerates SHA-256 release manifests and archives package                      |
+-----------------------------------------------------------------------------------+
```

---

## 5. Conflict Resolution & Merging Rules
1. **Ownership Exclusivity:** No two agents may possess write ownership over the same file in any stage.
2. **Shared Interface Contracts:** Modifications to shared interfaces (e.g., `types.ts`, `tokens.css`) require an approved Request for Interface Change (RFIC) co-signed by the Orchestrator and affected workers.
3. **Zero Merges Without Verifier Approval:** The Git mainline is cryptographically locked; only PRs carrying the QA Verifier's explicit sign-off hash may be merged.

