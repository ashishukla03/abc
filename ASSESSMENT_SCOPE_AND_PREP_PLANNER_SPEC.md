# ASSESSMENT SCOPE AND PREPARATION PLANNER SPECIFICATION
**Document ID:** GPL-SPEC-AP-V1  
**Project:** Gramin PocketLab — K–12 Multi-Board Learning Ecosystem  
**Target Audience:** Algorithmic Engineers, Backend/Client Architects, Learning Designers  
**Status:** Draft — Task v6 Security, Validation & Evidence Reconciliation Completed
**Classification:** Assessment Management & Intelligent Scheduling Specification  

---

## 1. Product Vision & Principles

Assessments in Indian schools vary tremendously—from a 15-minute Friday mental-math quiz to a 3-hour CBSE Class 10 Pre-Board examination or CISCE ICSE Class X assessment. When a student learns that a test is scheduled, their primary anxiety is: *"What exact topics are coming, and how should I divide my days to prepare without panicking?"*

The **Assessment & Examination Planner** addresses this directly:
1. **Granular Syllabus Scoping:** Allows students to isolate the exact chapters, topics, and subtopics their teacher announced, rather than forcing the entire textbook chapter.
2. **Three-Tier Syllabus Separation:** Distinguishes between official board syllabi, school-selected scopes, and student customizations.
3. **Adaptive, Non-Punitive Preparation Engine:** Generates a realistic, day-by-day study roadmap based on actual declared availability and concept mastery, automatically adapting when sessions are missed without guilt or punitive penalties.
4. **Guaranteed Syllabus Scope Protection:** The scheduler never silently drops or rewrites a student's declared assessment topics when time is limited.

---

## 2. Assessment Taxonomy & Data Schema (§6.1)

### 2.1 Complete Assessment Type Hierarchy

```typescript
export type AssessmentType =
  | 'weekly_quiz'
  | 'class_test'
  | 'unit_test'
  | 'monthly_assessment'
  | 'periodic_assessment_1'
  | 'periodic_assessment_2'
  | 'mid_term_exam'
  | 'half_yearly_exam'
  | 'term_1_exam'
  | 'term_2_final_exam'
  | 'pre_board_1'
  | 'pre_board_2'
  | 'annual_board_exam'
  | 'science_practical_exam'
  | 'oral_viva_assessment'
  | 'project_submission'
  | 'homework_assignment'
  | 'custom_diagnostic';

export interface GranularSyllabusItem {
  chapterNumber: number;
  chapterTitle: string;
  isEntireChapterIncluded: boolean;
  includedTopicIds: string[];            // Exact topic IDs selected by student
  excludedTopicIds: string[];            // Explicitly omitted topics (e.g. "Omit Exercise 5.3")
  specialTeacherDirectives?: string;     // e.g., "Focus on ray diagram proofs"
}

export interface AssessmentDefinition {
  assessmentId: string;
  learnerProfileId: string;
  title: string;                         // e.g., "Physics & Chemistry Half-Yearly"
  assessmentType: AssessmentType;
  subjectCodes: string[];                // Supports multi-subject assessments
  examDate: string;                      // 'YYYY-MM-DD'
  examStartTime: string;                 // 'HH:mm'
  durationMinutes: number;               // e.g., 90 mins or 180 mins
  maximumMarks?: number;                 // e.g., 40, 70, 80, 100
  weightagePercentage?: number;          // e.g., 20% of final grade
  questionFormatProfile: {
    mcqWeightPercent: number;            // e.g., 20%
    shortAnswerWeightPercent: number;    // e.g., 40%
    longAnswerDerivationsPercent: number;// e.g., 40%
    includesPracticalViva: boolean;
  };
  syllabusScope: Record<string, GranularSyllabusItem[]>; // Keyed by subjectCode
  studentNotes?: string;
  isArchived: boolean;
  createdAtTimestamp: number;
}
```

### 2.2 Three-Tier Syllabus Integrity Model

To prevent accidental data corruption, Gramin PocketLab enforces strict isolation across three distinct syllabus planes:

```
+---------------------------------------------------------------------------------+
| Plane 1: Official Board Master Syllabus (Immutable System Catalog)              |
|   - CBSE / CISCE / State Board (e.g. KSEAB) official curriculum standards and    |
|     NCERT / state textbook chapter and topic structures                         |
+---------------------------------------------------------------------------------+
                                       │ (Inherits base topic structure)
                                       ▼
+---------------------------------------------------------------------------------+
| Plane 2: School / Teacher Assessment Scope (Staged Context)                     |
|   - Specific subsets announced by the school for this test (e.g. Ch 2, 4, 5.1)   |
+---------------------------------------------------------------------------------+
                                       │ (Allows student-specific overrides)
                                       ▼
+---------------------------------------------------------------------------------+
| Plane 3: Student Preparation & Custom Focus Scope (Active Workspace)            |
|   - Student toggles custom priorities, personal weak topics, or extra revision   |
+---------------------------------------------------------------------------------+
```
*Rule:* Updates in Plane 3 never overwrite Plane 1 or Plane 2. A reset action can restore the official baseline at any time.

---

## 3. Intelligent Preparation Engine Algorithm (§6.2)

When an assessment is created or updated, the **Preparation Scheduler** creates a phased study trajectory matching the single unified algorithm specified in [`PREP_PLAN_ALGORITHM_AND_ACCEPTANCE_TESTS.md`](./PREP_PLAN_ALGORITHM_AND_ACCEPTANCE_TESTS.md).

```mermaid
flowchart TD
    A[Assessment Scope & Target Date] --> B[Retrieve Available Free Study Slots from Timetable]
    B --> C[Query Personal Learning Model for Concept Evidence]
    C --> D[Identify Weak Concepts & Prerequisites]
    D --> E[Compute Cognitive Effort Weights per Topic]
    E --> F[Phase 1: Diagnostic & Concept Exploration (30%)]
    F --> G[Phase 2: Worked Examples & Guided Practice (30%)]
    G --> H[Phase 3: Retrieval Practice & Misconception Remediation (25%)]
    H --> I[Phase 4: Spaced Recall & Synthesis Simulation (15%)]
    I --> J[Day N-1: Full Timed Mock Exam & Formula Check]
    J --> K[Day N: Final Morning Confidence Buffer]
```

### 3.1 Cognitive Effort Weighting Formula

For each selected topic $k$ in the assessment scope, total allocated study duration $T(k)$ is calculated as:

$$T(k) = T_{\text{base}}(k) \cdot \mu_{\text{diff}}(k) \cdot \omega_{\text{state}}(k) \cdot \psi_{\text{marks}}(k)$$

Where:
- $T_{\text{base}}(k) \in [20, 45]\text{ minutes}$ (Standard baseline instructional duration).
- $\mu_{\text{diff}}(k) \in \{1.0 \text{ [Foundational]}, 1.3 \text{ [Standard]}, 1.6 \text{ [Advanced]}\}$.
- $\omega_{\text{state}}(k)$ is derived from the student's Personal Learning Model (PLM):
  $$\omega_{\text{state}}(k) = \begin{cases} 
  1.8 & \text{if } \text{State} = \text{'not\_yet\_explored'} \\
  1.5 & \text{if } \text{State} \in \{\text{'learning'}, \text{'review\_recommended'}\} \\
  1.0 & \text{if } \text{State} = \text{'practising'} \\
  0.6 & \text{if } \text{State} = \text{'strong\_recent\_evidence'} 
  \end{cases}$$
- $\psi_{\text{marks}}(k) = 1.0 + 0.5 \cdot \left(\frac{\text{TopicExamWeightMarks}}{\text{TotalExamMarks}}\right)$ (Prioritizes heavily-weighted topics).

### 3.2 Strict Protection of Declared Assessment Scope

> [!CRITICAL]
> **Zero Silent Pruning Guarantee:**
> Under NO circumstances will the preparation scheduler silently drop, remove, or un-schedule any topic that the student has declared as part of their school assessment.
> 
> If total declared study time is insufficient to cover all topics deeply:
> 1. **Preserve Full Scope:** All declared topics remain in the schedule plan view.
> 2. **Transparent Prioritization:** Foundational prerequisites and high-mark topics receive full 4-phase preparation; lower-priority topics receive condensed diagnostic summaries.
> 3. **Deficit Highlighting:** Topics with insufficient time are explicitly highlighted with an amber alert pill: `[Time deficit: Core formula review only]`.
> 4. **Student Decision Agency:** The interface offers the learner three transparent options:
>    - *Option A:* Increase study time by adding a weekend or evening window.
>    - *Option B:* Accept condensed high-yield concept summaries for lower-yield topics.
>    - *Option C:* Manually exclude specific subtopics with teacher permission.
> 5. **Zero False Claims:** The engine never reports an incomplete plan as full syllabus coverage.

### 3.3 Adaptive Rescheduling & Non-Punitive Philosophy

> [!CAUTION]
> **No Guilt, No Broken Streaks:**
> If a student misses a scheduled study session due to family chores, illness, or fatigue:
> 1. The system **never** displays guilt-inducing popups, broken streaks, or negative tone.
> 2. The preparation engine offers a simple, one-tap prompt: *"Life happens! Would you like to spread the remaining topics across upcoming days, or use unallocated buffer slots?"*
> 3. Unattempted tasks are redistributed into remaining buffer slots, preserving foundational prerequisites first.

---

## 4. Reminders & Notification Architecture (§6.3)

### 4.1 Opt-in Notification Policy

```typescript
export interface ReminderSettings {
  remindersEnabled: boolean;
  notifyAssessmentDaysBefore: number[];  // e.g., [7, 3, 1, 0]
  notifyStudySessionMinutesBefore: number;// e.g., 15 mins before
  quietHoursStart: string;               // e.g., '21:30'
  quietHoursEnd: string;                 // e.g., '06:30'
  allowSoundAlerts: boolean;
  calendarExportEnabled: boolean;        // Enables .ICS download
}
```

### 4.2 Platform Limitations & Fallback Guarantee

1. **Operating System Background Limitations:** Android battery optimization (Doze mode), iOS background restrictions, and desktop sleeping aggressively kill Web Push and timer loops on offline devices.
2. **Gramin Truthful Contract:** Gramin PocketLab **never** guarantees that a notification will ring if the browser/device is closed or powered off.
3. **Resilience Strategy:**
   - **In-App Heads-Up Bar:** Primary notification channel. Every time the app opens, an alert bar highlights upcoming tasks and study plans.
   - **Offline Calendar Export (.ICS):** Generates standard RFC 5545 `.ics` calendar files that import directly into native Android / Google Calendar apps, allowing the phone's native OS to handle alarms reliably without app background execution.
