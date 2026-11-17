# Shared Module Schema & Data Contracts — Gramin PocketLab

**Document ID:** SPEC-SCHEMA-V2  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Status:** Pre-Event Specification  

---

## 1. Schema Objectives & Design Principles

All four STEM missions share an identical TypeScript data structure. This contract ensures:
1. **Decoupled Content:** Content authors can refine text, questions, and translations without modifying UI or engine logic.
2. **Deterministic State Transitions:** The learning lifecycle runner processes any subject by stepping through standard state transitions.
3. **Local Progress & Provenance:** Every session records progress deterministically into an anonymous local structure without server calls.

---

## 2. Core TypeScript Interfaces

```typescript
/** Stable Subject Identifiers */
export type SubjectId = 'math' | 'biology' | 'chemistry' | 'physics';

/** The 7 Steps of the Canonical Mission Flow */
export type MissionStepId = 
  | 'intro'
  | 'predict'
  | 'explore'
  | 'explain'
  | 'feedback_retry'
  | 'exit_check'
  | 'result';

/** Single Multiple Choice Assessment Item */
export interface AssessmentQuestion {
  id: string;
  promptKey: string;             // Localization key for question text
  options: {
    id: string;
    labelKey: string;          // Localization key for option text
    isCorrect: boolean;
  }[];
  explanationKey: string;        // Pedagogical rationale shown post-selection
  misconceptionMapping?: Record<string, string>; // Maps wrong option ID to targeted feedback key
}

/** Subject-Specific Interaction Configuration */
export interface InteractionConfig {
  interactiveType: 'water_allocator' | 'food_web_graph' | 'ph_indicator_lab' | 'sound_frequency_synth';
  initialState: Record<string, unknown>;
  validInputBounds: Record<string, { min: number; max: number; step?: number }>;
  targetSolution: Record<string, unknown>;
  safetyDisclaimerKey?: string;  // E.g., for Chemistry water safety or Physics audio volume
}

/** Complete Mission Definition Schema */
export interface StemMissionModule {
  id: string;                    // E.g., 'mission-math-water-01'
  subjectId: SubjectId;
  titleKey: string;
  curriculumStandard: string;    // E.g., 'NCERT Class 6 Ch 12'
  targetGradeRange: [number, number]; // E.g., [6, 8]
  estimatedDurationMinutes: number;   // E.g., 6
  
  // Pedagogical Content Sequence
  introStoryKey: string;
  predictionQuestion: AssessmentQuestion;
  interactionConfig: InteractionConfig;
  conceptSummaryKeys: {
    headingKey: string;
    bulletKeys: string[];
    diagramAssetPath?: string;
  };
  retryQuestion: AssessmentQuestion;
  exitCheckQuestion: AssessmentQuestion;
  
  // Gamification & Mastery Tokens
  masteryBadge: {
    id: string;
    nameKey: string;
    vectorIconId: string;
  };
}

/** Local Anonymous Learner Session Progress Schema (Single Local Session; Multi-Profile UI Deferred from MVP) */
export interface LearnerSessionProgress {
  sessionId: string;             // Anonymous local session identifier (e.g. 'default_learner')
  lastActiveTimestamp: number;
  completedMissions: Record<SubjectId, {
    isCompleted: boolean;
    completedAt?: number;
    predictionAnswerId?: string;
    interactiveCompletedSuccessfully: boolean;
    retryAttempts: number;
    exitCheckScore: 0 | 1 | 2;
    earnedBadgeId?: string;
  }>;
}
```

---

## 3. Concrete Subject Module Declarations (JSON Representation)

```json
{
  "missions": [
    {
      "id": "mission-math-water-01",
      "subjectId": "math",
      "titleKey": "mission.math.title",
      "curriculumStandard": "NCERT Class 6 Ch 12 (Ratio and Proportion) — working draft",
      "targetGradeRange": [6, 8],
      "estimatedDurationMinutes": 6,
      "predictionQuestion": {
        "id": "q-pred-math-01",
        "promptKey": "math.pred.prompt",
        "options": [
          { "id": "opt-3", "labelKey": "math.pred.opt3", "isCorrect": false },
          { "id": "opt-6", "labelKey": "math.pred.opt6", "isCorrect": true },
          { "id": "opt-4", "labelKey": "math.pred.opt4", "isCorrect": false }
        ],
        "explanationKey": "math.pred.explain"
      },
      "interactionConfig": {
        "interactiveType": "water_allocator",
        "initialState": { "tankTotal": 12, "plotA": 0, "plotB": 0, "plotC": 0 },
        "validInputBounds": {
          "plotA": { "min": 0, "max": 12, "step": 1 },
          "plotB": { "min": 0, "max": 12, "step": 1 },
          "plotC": { "min": 0, "max": 12, "step": 1 }
        },
        "targetSolution": { 
          "plotA": 2, "plotB": 4, "plotC": 6,
          "validationRule": "plotA + plotB + plotC === tankTotal && plotB === 2 * plotA && plotC === 3 * plotA (e.g. 1, 5, 6 sums to 12 but fails ratio validation)"
        }
      },
      "masteryBadge": {
        "id": "badge-math-jalmitr",
        "nameKey": "badge.math.name",
        "vectorIconId": "icon-water-guardian"
      }
    },
    {
      "id": "mission-physics-sound-01",
      "subjectId": "physics",
      "titleKey": "mission.physics.title",
      "curriculumStandard": "NCERT Class 8 Ch 13 (Sound) — working draft",
      "targetGradeRange": [7, 9],
      "estimatedDurationMinutes": 8,
      "predictionQuestion": {
        "id": "q-pred-phys-01",
        "promptKey": "phys.pred.prompt",
        "options": [
          { "id": "opt-pitch", "labelKey": "phys.pred.opt_pitch", "isCorrect": true },
          { "id": "opt-loud", "labelKey": "phys.pred.opt_loud", "isCorrect": false },
          { "id": "opt-speed", "labelKey": "phys.pred.opt_speed", "isCorrect": false }
        ],
        "explanationKey": "phys.pred.explain"
      },
      "interactionConfig": {
        "interactiveType": "sound_frequency_synth",
        "initialState": { "frequencyHz": 220, "amplitudePercent": 50, "isPlaying": false },
        "validInputBounds": {
          "frequencyHz": { "min": 100, "max": 1000, "step": 10 },
          "amplitudePercent": { "min": 10, "max": 100, "step": 5 }
        },
        "targetSolution": { "observedPitchComparison": true },
        "safetyDisclaimerKey": "phys.safety.volume_warning"
      },
      "masteryBadge": {
        "id": "badge-phys-dhwani",
        "nameKey": "badge.phys.name",
        "vectorIconId": "icon-sound-detective"
      }
    }
  ]
}
```

---

## 4. Reset & Persistence State Invariants

1. **Mission Step Reset:** Clicking the reset icon resets only the `interactiveState` of the active subject back to `initialState`. It does not clear previously earned badges or reset unrelated subjects.
2. **Local Session Persistence:** All mission progress writes to `localStorage.setItem('pocketlab_progress', ...)` with fallback to volatile in-memory state. (Multi-student profile switcher UI `profile_1` / `profile_2` is deferred from the MVP to preserve interface simplicity).
3. **Data Provenance Guarantee:** All strings are referenced via stable localization keys (`subject.step.key`). Hardcoded UI strings are forbidden in the interaction engine.
