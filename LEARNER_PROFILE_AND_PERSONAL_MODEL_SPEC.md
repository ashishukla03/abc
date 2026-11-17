# LEARNER PROFILE AND PERSONAL LEARNING MODEL SPECIFICATION
**Document ID:** GPL-SPEC-PLM-V1  
**Project:** Gramin PocketLab — K–12 Multi-Board Learning Ecosystem  
**Target Audience:** Machine Learning/Cognitive Engineers, Frontend Developers, Data Architects  
**Status:** Draft — Task v6 Security, Validation & Evidence Reconciliation Completed
**Classification:** Core Data Architecture, Multi-Profile Isolation & Cognitive Model Specification  

---

## 1. Executive Summary & Design Tenets

In shared-device rural households, siblings in different grades (e.g., an elder sister in Class 10 and a younger brother in Class 6) frequently share a single family smartphone. If an educational application conflates learner progress under a single account, learning records corrupt, revision schedules break down, and assessment preparation fails.

**Gramin PocketLab establishes two foundational systems:**
1. **Persistent Multi-Profile Isolation System:** Sandboxed local profile partitions on a single shared device without requiring distinct email addresses, phone numbers, or cloud accounts.
2. **Evidence-Based Personal Learning Model (PLM):** A concept-level cognitive modeling engine that tracks multi-source evidence of understanding using scientifically grounded, non-judgmental concept states, strictly avoiding pseudoscientific "learning styles", fabricated percentage masteries, or speed-based penalties.

---

## 2. Multi-Profile Architecture & Local Sandboxing (§7.1)

```
+---------------------------------------------------------------------------------+
|                   BROWSER PERSISTENCE LAYER (IndexedDB / LocalStorage)          |
+---------------------------------------------------------------------------------+
| System Registry: pocketlab_profiles_index                                       |
| Active Session Pointer: pocketlab_active_profile_id                             |
+---------------------------------------------------------------------------------+
       │                                         │
       ▼ (Scoped Partition A)                   ▼ (Scoped Partition B)
+-------------------------------+       +-------------------------------+
| Profile 1: 'Priya' (Class 10) |       | Profile 2: 'Arun' (Class 6)   |
| - CBSE Class 10               |       | - KSEAB Class 6 State Board   |
| - School Context & Timetable  |       | - School Context & Timetable  |
| - Upcoming Board Exam Scopes  |       | - Term 1 Assessment Scopes    |
| - Personal Learning Model     |       | - Personal Learning Model     |
| - Scoped Storage Key Prefix:  |       | - Scoped Storage Key Prefix:  |
|   gpl_prof_usr_8f91a...       |       |   gpl_prof_usr_3e10b...       |
+-------------------------------+       +-------------------------------+
```

### 2.1 Profile Sandbox Contract & Shared-Device Threat Model

> [!CAUTION]
> **Honest Threat Modeling for Local Profiles:**
> 1. **Convenience vs. Cryptographic Security:** The optional 4-digit PIN is designed as a **convenient user-experience barrier** to prevent younger siblings from accidentally opening and overwriting an older child's study plans. It is **not** high-grade cryptographic authentication against a sophisticated adversary with physical access to the device.
> 2. **Same-Origin Storage Boundaries:** Within the browser sandbox, `IndexedDB` and `localStorage` partition data under profile-specific key prefixes (`gpl_prof_${profileId}_*`). While this prevents application-level cross-contamination between profiles, all partitions within the same origin share browser sandbox privileges.
> 3. **Physical Protection:** For sensitive student study notes or personal calendars, local AES-256-GCM encryption is supported (Document 6), where keys are derived from the profile PIN.

```typescript
export interface LearnerProfile {
  profileId: string;                     // Cryptographic UUID v4
  displayName: string;                   // Local avatar name (e.g., "Priya", "Arun")
  avatarIdentifier: string;              // Local vector icon identifier
  profilePinHash?: string;               // Optional 4-digit PBKDF2 hash (local barrier against accidental switching)
  educationalTier: 'preparatory_class_5' | 'middle_classes_6_8' | 'secondary_classes_9_10' | 'senior_secondary_classes_11_12';
  schoolContextId: string;               // Links to SchoolProfile
  timetableId: string;                   // Links to WeeklyTimetable
  createdAtTimestamp: number;
  lastActiveTimestamp: number;
}
```

### 2.2 Profile Operations & Lifecycle
1. **Creation:** Instantaneous local creation. No email, phone number, or OTP required. Default preferences inherit class-level templates.
2. **Switching:** Instant profile switch via top navigation drawer. Active state unmounts previous learner data from volatile memory, flushes write buffers, and mounts the new profile's store.
3. **Application-Level Partitioning:** Every IndexedDB object store and localStorage key is namespaced by `gpl_prof_${profileId}_*`.
4. **Export & Portability:** Single-click export of an individual profile's entire learning history into a structured JSON file (`pocketlab_backup_Priya_2026.json`).
5. **Deletion:** One-click permanent local purging from IndexedDB and local caches.

---

## 3. The Personal Learning Model (PLM) Schema (§8.0)

The PLM operates at the atomic **Concept Node** level rather than coarse chapter levels. A single chapter (e.g., Class 7 Acids & Bases) decomposes into multiple concept nodes:
- `concept_acid_properties_sour_taste`
- `concept_indicator_turmeric_color_shift`
- `concept_neutralization_reaction`
- `concept_water_potability_dissociation_from_ph`

### 3.1 Five Cautious Concept Evidence States

> [!IMPORTANT]
> **Prohibition of Speed-Based Penalties & Fabricated Percentages:**
> 1. **Response Speed is NOT a Mastery Requirement:** Response time varies with reading speed, language proficiency, motor control, deliberate reflection, assistive technology, and screen responsiveness. Gramin PocketLab **never** penalizes slower, thoughtful answers or uses rapid response speed as a requirement for demonstrating deep understanding.
> 2. **Multi-Point Evidence Requirement:** A single correct answer or isolated transfer question is insufficient to claim durable mastery. Progression requires multiple consistent observations across varied contexts and delayed retrieval.

```
[ Not Yet Explored ]
        │ (Completes initial lesson / QuestionWorld exploration)
        ▼
   [ Learning ]
        │ (Demonstrates understanding across varied formats with scaffolding)
        ▼
  [ Practising ]
        │ (Demonstrates consistent unassisted problem-solving across multiple sessions)
        ▼
[ Strong Recent Evidence ] ──(Extended interval / failed retrieval)──► [ Review Recommended ]
        ▲                                                                        │
        └──────────────────────(Successful Spaced Retrieval)─────────────────────┘
```

1. **`Not yet explored`:** Concept has zero recorded interaction evidence in the platform.
2. **`Learning`:** Concept introduced; student has explored interactive models or solved initial questions with scaffolding; unassisted independent execution is not yet established.
3. **`Practising`:** Student has solved multiple standard QuestionWorlds independently, but requires longitudinal reinforcement across varied item structures.
4. **`Strong recent evidence`:** Student has demonstrated consistent, unassisted problem-solving across multiple independent sessions and successfully answered delayed transfer questions without triggering diagnostic misconceptions.
5. **`Review recommended`:** Either an active assessment is imminent and concept requires refreshing, or retrieval practice revealed misconception recurrence, or the configurable review heuristic interval has elapsed.

### 3.2 Evidence Record Schema

```typescript
export type InteractionOutcome = 
  | 'correct_unassisted_first_try' 
  | 'correct_after_progressive_hint' 
  | 'incorrect_misconception_identified' 
  | 'incorrect_procedural_error' 
  | 'abandoned_before_submission';

export type ErrorClassification = 
  | 'conceptual_misconception' 
  | 'procedural_misstep' 
  | 'arithmetic_calculation' 
  | 'reading_misinterpretation' 
  | 'boundary_condition_omission';

export interface ConceptEvidenceRecord {
  conceptId: string;
  subjectCode: string;
  chapterNumber: number;
  currentState: 'not_yet_explored' | 'learning' | 'practising' | 'strong_recent_evidence' | 'review_recommended';
  lastEvaluatedTimestamp: number;
  
  // Diverse Multi-Source Evidence Counts
  multiSourceObservations: {
    independentProblemSolvesCount: number;  // Unassisted correct answers
    scaffoldedCompletionsCount: number;     // Solved after viewing progressive hints
    transferChallengesSolvedCount: number;   // Solved in varied/novel contexts
    misconceptionRemediationsCount: number; // Corrected after diagnostic feedback
    totalSessionsObserved: number;          // Unique calendar days with active evidence
  };

  misconceptionHistory: {
    misconceptionId: string;
    occurrencesCount: number;
    lastObservedTimestamp: number;
    isRemediated: boolean;
  }[];

  // Configurable Spaced Review Heuristics (Draft working intervals, not universal dogmas)
  reviewHeuristics: {
    baseIntervalDays: number;               // Default configurable starting interval: 7 days
    stabilityMultiplier: number;           // Scales with consecutive successful retrievals
    lastSuccessfulRetrievalTimestamp: number;
    nextRecommendedReviewDate: string;      // 'YYYY-MM-DD'
  };
}
```

---

## 4. Personalised Recommendation Engine (§8.1)

The recommendation engine generates an actionable **Next Best Step** queue for each learner. Every recommendation is transparent, explainable, and linked to evidence.

### 4.1 Recommendation Rules Schema

```typescript
export interface LearnerRecommendation {
  recommendationId: string;
  recommendationType: 
    | 'prerequisite_repair'              // Fix broken foundational concept
    | 'assessment_preparation_task'     // Direct exam scope priority
    | 'spaced_review_refresher'         // Spaced repetition due based on heuristic interval
    | 'new_concept_exploration'         // Natural syllabus sequence forward step
    | 'transfer_deepening';             // Deepen concepts with strong evidence
  priorityScore: number;                // 0 (Lowest) to 100 (Highest Priority)
  targetConceptId: string;
  targetQuestionWorldId?: string;
  explainableReasonKey: string;         // Localized key for student-facing rationale
  evidenceCitation: string;             // Human-readable rationale shown in UI
  estimatedMinutes: number;
}
```

### 4.2 Authoritative Priority Ranking Formula (Specification Model)

> [!NOTE]
> **Authoritative Priority Scoring Specification (40/30/20/10 Model):**
> For any concept $C$, its recommendation priority score $P(C) \in [0, 100]$ is computed as an explicit, bounded linear combination of four normalized factors:

$$P(C) = \text{clamp}\Big(40 \cdot E(C) + 30 \cdot R(C) + 20 \cdot Q(C) + 10 \cdot S(C), \, 0, \, 100\Big)$$

Where each factor has an explicit definition, bounded $[0.0, 1.0]$ range, and defined evidence source:

1. **Exam Urgency Factor $E(C) \in [0.0, 1.0]$ (Weight = 40):**
   - **Meaning:** Measures time pressure for concepts appearing in confirmed upcoming school assessments.
   - **Source:** Active assessment syllabus declared in School & Study Hub.
   - **Formula:**
     $$E(C) = \begin{cases} 
     \max\left(0, 1.0 - \frac{\text{DaysUntilExam}}{14}\right) & \text{if } C \text{ is in declared assessment scope} \\
     0.0 & \text{otherwise}
     \end{cases}$$
2. **Review Need Factor $R(C) \in [0.0, 1.0]$ (Weight = 30):**
   - **Meaning:** Measures urgency of remediation based on diagnostic error triggers or elapsed review intervals.
   - **Source:** Local personal learning model concept state history.
   - **Formula:**
     $$R(C) = \begin{cases}
     1.0 & \text{if State} = \text{'review\_recommended'} \text{ (Active misconception trap triggered)} \\
     \min\left(1.0, \frac{\text{CurrentDate} - \text{NextReviewDate}}{\text{BaseIntervalDays}}\right) & \text{if CurrentDate} \ge \text{NextReviewDate} \\
     0.0 & \text{otherwise (concept fresh or mastered)}
     \end{cases}$$
3. **Prerequisite Foundation Factor $Q(C) \in [0.0, 1.0]$ (Weight = 20):**
   - **Meaning:** Identifies unmastered foundational concepts that block upcoming curriculum chapters.
   - **Source:** Curriculum dependency graph (e.g., fractions block rational numbers).
   - **Formula:**
     $$Q(C) = \begin{cases}
     1.0 & \text{if } C \text{ is an unmastered prerequisite for an upcoming chapter} \\
     0.0 & \text{otherwise}
     \end{cases}$$
4. **Curriculum Sequence Factor $S(C) \in [0.0, 1.0]$ (Weight = 10):**
   - **Meaning:** Encourages standard textbook chapter progression.
   - **Source:** Prescribed textbook syllabus order.
   - **Formula:**
     $$S(C) = \begin{cases}
     0.8 & \text{if } C \text{ is the immediate next unstudied chapter in syllabus order} \\
     0.2 & \text{otherwise}
     \end{cases}$$

### 4.3 Missing Data Behavior, Cold-Start & Tie-Breaking

1. **Cold-Start Regime (Brand New Profile):**
   - If a learner has zero historical records, $E(C) = 0.0$, $R(C) = 0.0$, $Q(C) = 0.0$.
   - Recommendations follow initial textbook sequence ($S(C) = 0.8 \implies P(C) = 10 \times 0.8 = 8.00$).
   - This smoothly bootstraps initial diagnostic exploration without overwhelming the student.
2. **High-Urgency Exam + Misconception Regime:**
   - Exam in 5 days ($E = 1 - 5/14 = 0.643$).
   - Active misconception triggered ($R = 1.0$).
   - Unmastered prerequisite ($Q = 1.0$).
   - Current syllabus topic ($S = 0.8$).
   - Priority: $P(C) = 40(0.643) + 30(1.0) + 20(1.0) + 10(0.8) = 25.71 + 30.0 + 20.0 + 8.0 = 83.71 / 100$.
3. **Tie-Breaking Determinism:**
   - 1st Priority: Lowest Chapter Number (Curricular sequence).
   - 2nd Priority: Higher Exam Marks Weightage.
   - 3rd Priority: Alphabetical Concept Identifier.
4. **Transparent Learner Explainability:**
   - Every recommendation surfaces an authentic `evidenceCitation` explaining the exact rationale in clear regional language.
