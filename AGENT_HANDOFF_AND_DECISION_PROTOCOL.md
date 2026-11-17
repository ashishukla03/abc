# Gramin PocketLab Multi-Agent Handoff & Decision Protocol

**Product:** Gramin PocketLab (Classes 5–12 All-Subject Learning Ecosystem)  
**Author:** Multi-Agent Orchestration Lead & Quality Systems Architect  
**Date:** November 2026  
**Status:** COMPLETE / GOVERNANCE APPROVED  

---

## 1. Principles of Governed Multi-Agent Collaboration

To eliminate confusion, redundant work, merge collisions, and silent bugs, the Gramin PocketLab multi-agent swarm operates under strict, protocol-driven collaboration rules. 

No agent writes code outside its assigned files, no branch is merged without independent automated verification, and all inter-agent requests follow standardized structured contracts.

---

## 2. Standardized Task Card Schema

Every task assigned by the Lead Orchestrator or handed off between agents must use the following Markdown template:

```markdown
### [TASK-CARD: {TASK_ID}] — {TASK_TITLE}
* **Assigned Agent:** {AGENT_ID} ({ROLE_NAME})
* **Worktree Branch:** `worktree/{AGENT_ID}-{TASK_ID}`
* **Exclusive Owned Paths:**
  - `{PATH_1}`
  - `{PATH_2}`
* **Prohibited Paths:** `{STRICTLY_PROHIBITED_DIRECTORIES}`
* **Prerequisites & Dependencies:**
  - Depends on completed task: `{DEPENDENT_TASK_ID}`
  - Interface contracts: `{SHARED_INTERFACE_FILE}`
* **Deliverables:**
  1. `{EXACT_DELIVERABLE_FILE_1}`
  2. `{EXACT_DELIVERABLE_FILE_2}`
* **Acceptance Criteria:**
  - [ ] Criterion 1: {EXPLICIT_BEHAVIOR}
  - [ ] Criterion 2: Zero modifications outside owned paths.
  - [ ] Criterion 3: 100% automated tests passing with exit code 0.
* **Verification Method:** `{UNIT_TEST | AST_VALIDATOR | PLAYWRIGHT_A11Y | STATIC_LINT}`
```

---

## 3. Communication & @Mention Semantics

Agents communicate via Antigravity's message routing or formal task comments using strict tag conventions:

* `@coordinator`: Direct escalation to Lead Engineering Orchestrator for scope clarification, task reassignment, or merge authorization.
* `@verifier`: Formal request to Independent QA Verifier for branch audit and quality gate certification.
* `@rfic`: Formal **Request for Interface Change** when an agent requires an update to a shared file owned by another role (e.g., modifying `app/styles/tokens.css` or `types.d.ts`).
* `@blocker`: Immediate notification of an architectural, dependency, or security stoppage.

---

## 4. Blocker Escalation & Resolution Protocol

```
+-----------------------------------------------------------------------------------+
|                           THREE-TIER BLOCKER ESCALATION                           |
+-----------------------------------------------------------------------------------+
|  TIER 1: PEER CLARIFICATION                                                       |
|  - Scope: Minor data clarification or interface question between 2 workers.       |
|  - SLA: Resolved within 1 conversational turn.                                    |
|  - Resolution: Peer replies with documented schema reference.                      |
+-----------------------------------------------------------------------------------+
                                         | (Unresolved or boundary change required)
                                         v
+-----------------------------------------------------------------------------------+
|  TIER 2: REQUEST FOR INTERFACE CHANGE (RFIC)                                      |
|  - Scope: Proposed edit to a shared contract file (types.d.ts, tokens.css, store) |
|  - Process: Requesting agent drafts RFIC card -> Target owner reviews ->          |
|             Coordinator approves -> Target owner makes the edit in isolation.     |
+-----------------------------------------------------------------------------------+
                                         | (Security or architectural violation)
                                         v
+-----------------------------------------------------------------------------------+
|  TIER 3: QUALITY / SECURITY VETO & WORKSTREAM FREEZE                              |
|  - Scope: Violation of DPDP Act, accessibility failure, memory budget breach,    |
|           or unassigned file modification.                                        |
|  - Authority: QA Verifier or Security Engineer executes immediate STOP-WORK.     |
|  - Action: Affected worktree frozen; branch rejected until defect is remediated. |
+-----------------------------------------------------------------------------------+
```

---

## 5. Merge Governance & Branch Lifecycle

```
[main] (LOCKED)
   |
   +---> Branch created: `worktree/{AGENT_ID}-{TASK_ID}`
   |        |
   |        +---> Worker completes tasks strictly within Owned_Paths
   |        +---> Worker runs local tests & validates exit code 0
   |        +---> Worker files Pull Request (@verifier)
   |
   +---> QA Verifier checks out branch independently
   |        |
   |        +---> Verifier runs AST static analysis & full test suite
   |        +---> Verifier confirms ZERO edits in Prohibited_Paths
   |        +---> IF FAIL: Verifier files rejection report -> Worker fixes
   |        +---> IF PASS: Verifier issues Signed Pass Certificate
   |
   +---> Lead Orchestrator receives Signed Pass Certificate
            |
            +---> Orchestrator executes Fast-Forward Merge into [main]
            +---> Regenerates SHA-256 release manifest
```

### Pre-Merge Automated Gates:
1. `npm test` (or `node tests/run_all_tests.js`) must exit with code 0 (100% tests passing).
2. `python TASK_V*_STATIC_VALIDATION.py` must exit with code 0 (zero AST or lint errors).
3. `git diff --name-only main` must strictly contain only paths matching the agent's entry in `AGENT_FILE_OWNERSHIP_MATRIX.csv`.

---

## 6. Architecture Decision Records (ADRs)

Any substantial architectural, technical, or pedagogical change must be logged as an ADR in `architecture_plan/decisions/` formatted as:
* **ADR-{ID}: Title**
* **Context & Problem Statement:** Why is the decision necessary?
* **Options Considered:** Trade-off analysis of candidate approaches.
* **Decision:** What was chosen and why.
* **Consequences:** Positive outcomes and architectural trade-offs accepted.

