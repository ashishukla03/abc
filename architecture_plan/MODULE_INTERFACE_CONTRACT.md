# MODULE INTERFACE CONTRACT & SHARED DATA SCHEMA

**Document ID:** ARCH-MODULE-CONTRACT-V2  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Role:** Senior Front-End Architect  
**Conformance:** Strict TypeScript Interface Contracts & JSON Schemas  

---

## 1. Architectural Interface Contracts

To allow four subject developers to work completely in parallel without colliding or breaking the shared learning engine, all subject modules must implement the following TypeScript interface contract:

```typescript
/** Supported STEM Subject Identifiers */
export type SubjectId = 'math' | 'biology' | 'chemistry' | 'physics';

/** Seven Standard Mission Steps */
export type StepId = 
  | 's0_map'
  | 's1_intro'
  | 's2_predict'
  | 's3_explore'
  | 's4_understand'
  | 's5_feedback_retry'
  | 's6_exit_result';

/** Localization Key Reference */
export type I18nKey = string;

/** Multiple Choice Option Contract */
export interface AssessmentOption {
  id: string;
  labelKey: I18nKey;
  isCorrect: boolean;
  misconceptionId?: string; // Optional tag linking to targeted feedback
}

/** Formative / Summative Question Item */
export interface AssessmentItem {
  id: string;
  promptKey: I18nKey;
  options: AssessmentOption[];
  explanationKey: I18nKey;
}

/** Interactive Micro-Lab State Lifecycle */
export interface SubjectInteractionHandler<TState = Record<string, unknown>> {
  /** Returns the pristine initial state for the lab widget */
  getInitialState(): TState;

  /** Validates whether current parameters satisfy mathematical/scientific invariants */
  validateInvariant(state: TState): {
    isValid: boolean;
    userFacingMessageKey?: I18nKey;
    difference?: number;
  };

  /** Resets the lab state to initial values without wiping mission progress */
  resetState(): TState;

  /** Renders or mounts the interactive widget inside the provided DOM container */
  mount(container: HTMLElement, state: TState, onStateChange: (newState: TState) => void): void;

  /** Dismounts and cleans up resources (e.g. stops AudioContext, cleans listeners) */
  unmount(): void;
}

/** Full Module Definition Schema */
export interface StemMissionDefinition<TState = Record<string, unknown>> {
  id: string;                      // E.g. 'mission-physics-sound'
  subjectId: SubjectId;
  titleKey: I18nKey;
  scopeSummaryKey: I18nKey;
  curriculumStandard: string;      // E.g. 'NCERT Class 8 Science Ch 13'
  estimatedDurationMinutes: number;// E.g. 6
  
  // Step Content Data
  introScenarioKey: I18nKey;
  learningObjectiveKey: I18nKey;
  
  predictionQuestion: AssessmentItem;
  
  interactionHandler: SubjectInteractionHandler<TState>;
  
  conceptExplanationKeys: {
    headingKey: I18nKey;
    paragraphsKeys: I18nKey[];
    ruleBoxKey: I18nKey;
  };
  
  formativeCheckQuestion: AssessmentItem;
  retryQuestion: AssessmentItem;
  exitCheckQuestions: [AssessmentItem, AssessmentItem];
  
  // Safety & Provenance Metadata
  safetyDisclaimerKey?: I18nKey;
  assetProvenance: {
    source: string;
    licence: string;
    author: string;
  };
}
```

---

## 2. Shared Engine State Store (`store.js`)

The global application state is managed as an immutable, reactive store stored in volatile memory and synced to `localStorage`:

```typescript
export interface AppSessionState {
  currentSubject: SubjectId | null;
  currentStep: StepId;
  selectedLocale: 'en' | 'kn';
  activeSessionId: string; // Anonymous local session identifier (Multi-student profile switcher UI deferred from MVP)
  audioMuted: boolean;
  
  // Per-Subject Learner Progress (Stored Locally)
  progress: Record<SubjectId, {
    isCompleted: boolean;
    predictionChoiceId: string | null;
    interactiveCompleted: boolean;
    formativePassedFirstTry: boolean;
    retryChoiceId: string | null;
    exitScores: [number, number]; // 0 or 1 per question
    completedAt?: number;
  }>;
}
```

---

## 3. Concrete Module Implementation Example: Mathematics

To illustrate modular decoupling, here is the exact interface contract implementation for `modules/math.js`:

```javascript
// modules/math.js
export const MathModule = {
  id: 'mission-math-water',
  subjectId: 'math',
  titleKey: 'math.title',
  
  getInitialState() {
    return { targetTotal: 12, plotA: 0, plotB: 0, plotC: 0 };
  },
  
  validateInvariant(state) {
    const sum = state.plotA + state.plotB + state.plotC;
    if (sum !== state.targetTotal) {
      return {
        isValid: false,
        userFacingMessageKey: sum < state.targetTotal ? 'math.error.under' : 'math.error.over',
        difference: Math.abs(state.targetTotal - sum)
      };
    }
    // Check ratio 1:2:3 -> Plot A = 2, Plot B = 4, Plot C = 6
    const isProportional = (state.plotA === 2 && state.plotB === 4 && state.plotC === 6);
    return {
      isValid: isProportional,
      userFacingMessageKey: isProportional ? 'math.success.valid' : 'math.error.wrong_ratio'
    };
  },
  
  mount(container, state, onStateChange) {
    // Mounts pure HTML steppers and water visualizer
    // Calls onStateChange(newState) on stepper clicks
  },
  
  unmount() {
    // Pure DOM cleanup
  }
};
```
