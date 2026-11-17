# FIVE-PERSON TEAM ROLES, RESPONSIBILITY ALLOCATION & INTERFACES

**Document ID:** TEAM-OWNERSHIP-ROLES-V2  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Event:** STEM for Impact 2026, Presidency University, Bengaluru  
**Role:** Integration Coordinator & Technical Delivery Lead  
**Planning Policy:** Clear ownership, explicit dependencies, zero undocumented tasks, and realistic skill adaptation. **Zero application code authored before the event.**  

---

## 1. Five-Person Role Allocation & Ownership Boundaries

The team structure accommodates cross-functional skill sets (engineering, pedagogy, UI/UX, QA, and content authoring) without assuming all five members are full-stack programmers:

| Role Title | Primary Owner | Exclusive File & Directory Ownership | Core Responsibilities | Explicit Dependencies | Measurable Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Integration & Technical Lead** | Member 1 (Lead Dev) | `index.html`, `app.js`, `store.js`, `service-worker.js`, `engine/` | App shell, 7-step state machine runner, Cache-First Service Worker, local persistence, master branch merges. | None (Foundational) | Clean shell boots; 7-step state machine transitions deterministically between S0 and S6. |
| **Physics Flagship Lead** | Member 2 (Audio/Physics Dev) | `modules/physics.js`, `audio/` | Web Audio synthesizer ($220\text{ Hz} / 440\text{ Hz}$), 60 FPS oscilloscope canvas, mobile audio unlock, mic listener. | `engine/` interface contract | Tapping $440\text{ Hz}$ audibly raises pitch by 1 octave and doubles wave cycles on canvas; output clamped to $-3\text{ dBFS}$. |
| **Mathematics Module Lead** | Member 3 (Math/Logic Dev) | `modules/math.js` | Water allocation steppers ($0–T$), sum invariant validator ($=T$), ratio validator ($2, 4, 6$), visual water bar filling. | `engine/` interface contract | Allocating $2, 4, 6$ passes invariant; allocating $4, 4, 4$ or $1, 2, 3$ triggers targeted misconception feedback. |
| **Biology & Chemistry Lead** | Member 4 (Visual/Life Sciences Dev) | `modules/biology.js`, `modules/chemistry.js` | SVG food web node toggles (simplified trophic cascade model), four virtual beaker indicator dips (Natural Turmeric Paper / Universal Indicator Paper across Lemon Juice, Distilled Water, Baking Soda, Soap Solution), chemical safety disclaimer. | `engine/` interface contract | Biology toggles cascade states (`Surging`/`Declining`); Chemistry shifts Natural Turmeric Paper to Reddish-Brown in bases; safety banner permanently visible. |
| **UI/UX, Content & QA Lead** | Member 5 (Design, Pedagogy & QA) | `index.css`, `content/i18n.json`, `qa_test_plan/` | Design tokens, $48\text{ px}$ mobile touch targets, high-contrast accessible tokens, Kannada string review, running the 37 acceptance tests. | All module PRs | Zero horizontal overflow at $360\text{ px}$; all 37 acceptance tests verified on a physical budget Android phone in Airplane Mode. |

---

## 2. Locked Core Interfaces (Module Owners Must NOT Change Independently)

To prevent breaking the application shell during parallel development, the following interfaces are strictly **frozen** and can only be modified by Member 1 (Integration Lead):

1. **Global Navigation & Step Identifiers:**  
   * The step identifiers (`s0_map`, `s1_intro`, `s2_predict`, `s3_explore`, `s4_understand`, `s5_feedback_retry`, `s6_exit_result`) are immutable constants.
2. **Subject Module Contract (`SubjectInteractionHandler`):**  
   * Every subject file (`modules/*.js`) must export a module object implementing:
     * `getInitialState()`
     * `validateInvariant(state)`
     * `resetState()`
     * `mount(container, state, onStateChange)`
     * `unmount()`
   * Module owners **must not alter the method signatures** or introduce custom global navigation calls.
3. **Global Styling Classes & Design Tokens:**  
   * Module developers must use CSS custom properties (`var(--color-primary-action)`, `var(--space-16)`, etc.) rather than defining conflicting inline hex codes or custom utility classes.
4. **Data Store Mutations:**  
   * Modules communicate state changes exclusively by invoking the passed `onStateChange(newState)` callback. Modules are strictly prohibited from directly calling `localStorage.setItem()` or modifying global window variables.

---

## 3. Skill-Adaptive Rebalancing Plan

If team members provide specific skill disclosures at the hackathon venue, responsibilities rebalance smoothly without disrupting ownership boundaries:
* *Scenario A (Fewer Coders, More Content/Designers):* Member 4 pairs with Member 5 on SVG assets, NCERT question mapping, and UI styling, while Member 1 handles JavaScript integration for both Math and Biology using our pre-written interface contracts.
* *Scenario B (Strong Front-End Team):* Each subject module owner writes their own canvas/SVG interaction logic independently, while Member 5 focuses 100% on automated Cypress/Playwright scripts and multi-device QA.
