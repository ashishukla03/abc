/**
 * Gramin PocketLab — Canonical Mission Definitions & Assessment Data
 * File: app/content/missions_data.js
 * Architecture Contract: architecture_plan/MODULE_INTERFACE_CONTRACT.md (StemMissionDefinition)
 * Conformance: NCERT Curriculum Alignment, Four STEM Missions, Explicit Misconception Mappings
 */

import { PhysicsModule } from '../modules/physics.js';
import { MathModule } from '../modules/math_stub.js';
import { BiologyModule } from '../modules/biology_stub.js';
import { ChemistryModule } from '../modules/chemistry_stub.js';

/**
 * Registry of all four canonical STEM missions.
 * @type {Record<string, Object>}
 */
export const MISSIONS = {
  // ===========================================================================
  // 1. PHYSICS (Flagship): Sound Detective
  // ===========================================================================
  physics: {
    id: 'mission-physics-sound',
    subjectId: 'physics',
    titleKey: 'subject.physics.title',
    scopeSummaryKey: 'subject.physics.desc',
    curriculumStandard: 'NCERT Class 8 Science Ch 13',
    estimatedDurationMinutes: 8,
    accentColorVar: 'var(--color-phys)',
    iconEmoji: '🎵',

    // S1 Intro Brief
    introScenarioKey: 'phys.s1.scenario',
    learningObjectiveKey: 'phys.s1.objective',

    // S2 Pre-Activity Hypothesis Prediction
    predictionQuestion: {
      id: 'q-pred-phys-01',
      promptKey: 'phys.pred.prompt',
      options: [
        { id: 'opt-a', labelKey: 'phys.pred.opt_a', isCorrect: true },
        { id: 'opt-b', labelKey: 'phys.pred.opt_b', isCorrect: false, misconceptionId: 'phys.fb.frequency' },
        { id: 'opt-c', labelKey: 'phys.pred.opt_c', isCorrect: false, misconceptionId: 'phys.fb.frequency' }
      ],
      explanationKey: 'phys.pred.explain'
    },

    // S3 Interactive Micro-Lab Binding
    interactionHandler: PhysicsModule,
    observationPromptKey: 's3.phys_prompt',
    safetyDisclaimerKey: 'phys.audio_notice',

    // S4 Concept Explanation
    conceptExplanationKeys: {
      headingKey: 's4.heading',
      observedKey: 'phys.s4.observed',
      paragraphsKeys: ['phys.s4.p1', 'phys.s4.p2'],
      ruleBoxKey: 'phys.s4.rule',
      ruleBoxTitleKey: 's4.rule_box_title'
    },

    // S5 Formative Diagnostic Check & Changed Retry
    formativeCheckQuestion: {
      id: 'q-formative-phys-01',
      promptKey: 'phys.formative.prompt',
      options: [
        { id: 'opt-a', labelKey: 'phys.formative.opt_a', isCorrect: false, misconceptionId: 'phys.fb.frequency' },
        { id: 'opt-b', labelKey: 'phys.formative.opt_b', isCorrect: true },
        { id: 'opt-c', labelKey: 'phys.formative.opt_c', isCorrect: false, misconceptionId: 'phys.fb.frequency' }
      ],
      explanationKey: 'phys.formative.explain',
      misconceptionFeedbackKeys: {
        'opt-a': 'phys.fb.frequency',
        'opt-c': 'phys.fb.frequency'
      }
    },
    retryQuestion: {
      id: 'q-retry-phys-01',
      promptKey: 'phys.retry.prompt',
      options: [
        { id: 'opt-a', labelKey: 'phys.retry.opt_a', isCorrect: false },
        { id: 'opt-b', labelKey: 'phys.retry.opt_b', isCorrect: true },
        { id: 'opt-c', labelKey: 'phys.retry.opt_c', isCorrect: false }
      ],
      explanationKey: 'phys.retry.explain'
    },

    // S6 Summative Exit Checks & Transfer
    exitCheckQuestions: [
      {
        id: 'q-exit1-phys-01',
        promptKey: 'phys.exit1.prompt',
        options: [
          { id: 'opt-a', labelKey: 'phys.exit1.opt_a', isCorrect: true },
          { id: 'opt-b', labelKey: 'phys.exit1.opt_b', isCorrect: false },
          { id: 'opt-c', labelKey: 'phys.exit1.opt_c', isCorrect: false }
        ],
        explanationKey: 'phys.exit1.explain'
      },
      {
        id: 'q-exit2-phys-01',
        promptKey: 'phys.exit2.prompt',
        options: [
          { id: 'opt-a', labelKey: 'phys.exit2.opt_a', isCorrect: false },
          { id: 'opt-b', labelKey: 'phys.exit2.opt_b', isCorrect: true },
          { id: 'opt-c', labelKey: 'phys.exit2.opt_c', isCorrect: false }
        ],
        explanationKey: 'phys.exit2.explain'
      }
    ],

    // Mastery Tokens & Summary
    masteryBadge: {
      id: 'badge-physics-dhwani',
      nameKey: 'badge.phys.name',
      descKey: 'badge.phys.desc',
      iconEmoji: '🎵'
    },
    recapBulletKeys: ['phys.recap_1', 'phys.recap_2'],
    assetProvenance: {
      source: 'Gramin PocketLab Internal Engineering & NCERT Class 8 Science',
      licence: 'MIT',
      author: 'Gramin PocketLab Acoustics Team'
    }
  },

  // ===========================================================================
  // 2. MATHEMATICS: Water Share Challenge
  // ===========================================================================
  math: {
    id: 'mission-math-water',
    subjectId: 'math',
    titleKey: 'subject.math.title',
    scopeSummaryKey: 'subject.math.desc',
    curriculumStandard: 'NCERT Class 6 Mathematics Ch 12',
    estimatedDurationMinutes: 6,
    accentColorVar: 'var(--color-math)',
    iconEmoji: '💧',

    // S1 Intro Brief
    introScenarioKey: 'math.s1.scenario',
    learningObjectiveKey: 'math.s1.objective',

    // S2 Pre-Activity Hypothesis Prediction
    predictionQuestion: {
      id: 'q-pred-math-01',
      promptKey: 'math.pred.prompt',
      options: [
        { id: 'opt-a', labelKey: 'math.pred.opt_a', isCorrect: false, misconceptionId: 'math.fb.additive' },
        { id: 'opt-b', labelKey: 'math.pred.opt_b', isCorrect: false, misconceptionId: 'math.fb.additive' },
        { id: 'opt-c', labelKey: 'math.pred.opt_c', isCorrect: true }
      ],
      explanationKey: 'math.pred.explain'
    },

    // S3 Interactive Micro-Lab Binding
    interactionHandler: MathModule,
    observationPromptKey: 's3.math_prompt',

    // S4 Concept Explanation
    conceptExplanationKeys: {
      headingKey: 's4.heading',
      observedKey: 'math.s4.observed',
      paragraphsKeys: ['math.s4.p1', 'math.s4.p2'],
      ruleBoxKey: 'math.s4.rule',
      ruleBoxTitleKey: 's4.rule_box_title'
    },

    // S5 Formative Diagnostic Check & Changed Retry
    formativeCheckQuestion: {
      id: 'q-formative-math-01',
      promptKey: 'math.formative.prompt',
      options: [
        { id: 'opt-a', labelKey: 'math.formative.opt_a', isCorrect: false, misconceptionId: 'math.fb.additive' },
        { id: 'opt-b', labelKey: 'math.formative.opt_b', isCorrect: true },
        { id: 'opt-c', labelKey: 'math.formative.opt_c', isCorrect: false, misconceptionId: 'math.fb.additive' }
      ],
      explanationKey: 'math.formative.explain',
      misconceptionFeedbackKeys: {
        'opt-a': 'math.fb.additive',
        'opt-c': 'math.fb.additive'
      }
    },
    retryQuestion: {
      id: 'q-retry-math-01',
      promptKey: 'math.retry.prompt',
      options: [
        { id: 'opt-a', labelKey: 'math.retry.opt_a', isCorrect: false },
        { id: 'opt-b', labelKey: 'math.retry.opt_b', isCorrect: true },
        { id: 'opt-c', labelKey: 'math.retry.opt_c', isCorrect: false }
      ],
      explanationKey: 'math.retry.explain'
    },

    // S6 Summative Exit Checks & Transfer
    exitCheckQuestions: [
      {
        id: 'q-exit1-math-01',
        promptKey: 'math.exit1.prompt',
        options: [
          { id: 'opt-a', labelKey: 'math.exit1.opt_a', isCorrect: true },
          { id: 'opt-b', labelKey: 'math.exit1.opt_b', isCorrect: false },
          { id: 'opt-c', labelKey: 'math.exit1.opt_c', isCorrect: false }
        ],
        explanationKey: 'math.exit1.explain'
      },
      {
        id: 'q-exit2-math-01',
        promptKey: 'math.exit2.prompt',
        options: [
          { id: 'opt-a', labelKey: 'math.exit2.opt_a', isCorrect: false },
          { id: 'opt-b', labelKey: 'math.exit2.opt_b', isCorrect: true },
          { id: 'opt-c', labelKey: 'math.exit2.opt_c', isCorrect: false }
        ],
        explanationKey: 'math.exit2.explain'
      }
    ],

    // Mastery Tokens & Summary
    masteryBadge: {
      id: 'badge-math-jalmitra',
      nameKey: 'badge.math.name',
      descKey: 'badge.math.desc',
      iconEmoji: '💧'
    },
    recapBulletKeys: ['math.recap_1', 'math.recap_2'],
    assetProvenance: {
      source: 'Gramin PocketLab Internal Engineering & NCERT Class 6 Mathematics',
      licence: 'MIT',
      author: 'Gramin PocketLab Mathematics Team'
    }
  },

  // ===========================================================================
  // 3. BIOLOGY: Food Web Explorer
  // ===========================================================================
  biology: {
    id: 'mission-bio-foodweb',
    subjectId: 'biology',
    titleKey: 'subject.biology.title',
    scopeSummaryKey: 'subject.biology.desc',
    curriculumStandard: 'NCERT Class 7 Science Ch Forests',
    estimatedDurationMinutes: 6,
    accentColorVar: 'var(--color-bio)',
    iconEmoji: '🌱',

    // S1 Intro Brief
    introScenarioKey: 'bio.s1.scenario',
    learningObjectiveKey: 'bio.s1.objective',

    // S2 Pre-Activity Hypothesis Prediction
    predictionQuestion: {
      id: 'q-pred-bio-01',
      promptKey: 'bio.pred.prompt',
      options: [
        { id: 'opt-a', labelKey: 'bio.pred.opt_a', isCorrect: true },
        { id: 'opt-b', labelKey: 'bio.pred.opt_b', isCorrect: false, misconceptionId: 'bio.fb.producer' },
        { id: 'opt-c', labelKey: 'bio.pred.opt_c', isCorrect: false, misconceptionId: 'bio.fb.producer' }
      ],
      explanationKey: 'bio.pred.explain'
    },

    // S3 Interactive Micro-Lab Binding
    interactionHandler: BiologyModule,
    observationPromptKey: 's3.bio_prompt',

    // S4 Concept Explanation
    conceptExplanationKeys: {
      headingKey: 's4.heading',
      observedKey: 'bio.s4.observed',
      paragraphsKeys: ['bio.s4.p1', 'bio.s4.p2'],
      ruleBoxKey: 'bio.s4.rule',
      ruleBoxTitleKey: 's4.rule_box_title'
    },

    // S5 Formative Diagnostic Check & Changed Retry
    formativeCheckQuestion: {
      id: 'q-formative-bio-01',
      promptKey: 'bio.formative.prompt',
      options: [
        { id: 'opt-a', labelKey: 'bio.formative.opt_a', isCorrect: false, misconceptionId: 'bio.fb.producer' },
        { id: 'opt-b', labelKey: 'bio.formative.opt_b', isCorrect: true },
        { id: 'opt-c', labelKey: 'bio.formative.opt_c', isCorrect: false, misconceptionId: 'bio.fb.producer' }
      ],
      explanationKey: 'bio.formative.explain',
      misconceptionFeedbackKeys: {
        'opt-a': 'bio.fb.producer',
        'opt-c': 'bio.fb.producer'
      }
    },
    retryQuestion: {
      id: 'q-retry-bio-01',
      promptKey: 'bio.retry.prompt',
      options: [
        { id: 'opt-a', labelKey: 'bio.retry.opt_a', isCorrect: false },
        { id: 'opt-b', labelKey: 'bio.retry.opt_b', isCorrect: true },
        { id: 'opt-c', labelKey: 'bio.retry.opt_c', isCorrect: false }
      ],
      explanationKey: 'bio.retry.explain'
    },

    // S6 Summative Exit Checks & Transfer
    exitCheckQuestions: [
      {
        id: 'q-exit1-bio-01',
        promptKey: 'bio.exit1.prompt',
        options: [
          { id: 'opt-a', labelKey: 'bio.exit1.opt_a', isCorrect: true },
          { id: 'opt-b', labelKey: 'bio.exit1.opt_b', isCorrect: false },
          { id: 'opt-c', labelKey: 'bio.exit1.opt_c', isCorrect: false }
        ],
        explanationKey: 'bio.exit1.explain'
      },
      {
        id: 'q-exit2-bio-01',
        promptKey: 'bio.exit2.prompt',
        options: [
          { id: 'opt-a', labelKey: 'bio.exit2.opt_a', isCorrect: false },
          { id: 'opt-b', labelKey: 'bio.exit2.opt_b', isCorrect: true },
          { id: 'opt-c', labelKey: 'bio.exit2.opt_c', isCorrect: false }
        ],
        explanationKey: 'bio.exit2.explain'
      }
    ],

    // Mastery Tokens & Summary
    masteryBadge: {
      id: 'badge-bio-prakriti',
      nameKey: 'badge.bio.name',
      descKey: 'badge.bio.desc',
      iconEmoji: '🌱'
    },
    recapBulletKeys: ['bio.recap_1', 'bio.recap_2'],
    assetProvenance: {
      source: 'Gramin PocketLab Internal Engineering & NCERT Class 7 Science',
      licence: 'MIT',
      author: 'Gramin PocketLab Biology Team'
    }
  },

  // ===========================================================================
  // 4. CHEMISTRY: pH Color Lab
  // ===========================================================================
  chemistry: {
    id: 'mission-chem-ph',
    subjectId: 'chemistry',
    titleKey: 'subject.chemistry.title',
    scopeSummaryKey: 'subject.chemistry.desc',
    curriculumStandard: 'NCERT Class 7 Science Ch 5',
    estimatedDurationMinutes: 6,
    accentColorVar: 'var(--color-chem)',
    iconEmoji: '🧪',

    // S1 Intro Brief
    introScenarioKey: 'chem.s1.scenario',
    learningObjectiveKey: 'chem.s1.objective',

    // S2 Pre-Activity Hypothesis Prediction
    predictionQuestion: {
      id: 'q-pred-chem-01',
      promptKey: 'chem.pred.prompt',
      options: [
        { id: 'opt-a', labelKey: 'chem.pred.opt_a', isCorrect: false, misconceptionId: 'chem.fb.scale' },
        { id: 'opt-b', labelKey: 'chem.pred.opt_b', isCorrect: true },
        { id: 'opt-c', labelKey: 'chem.pred.opt_c', isCorrect: false, misconceptionId: 'chem.fb.scale' }
      ],
      explanationKey: 'chem.pred.explain'
    },

    // S3 Interactive Micro-Lab Binding
    interactionHandler: ChemistryModule,
    observationPromptKey: 's3.chem_prompt',
    safetyDisclaimerKey: 'chem.safety_disclaimer',

    // S4 Concept Explanation
    conceptExplanationKeys: {
      headingKey: 's4.heading',
      observedKey: 'chem.s4.observed',
      paragraphsKeys: ['chem.s4.p1', 'chem.s4.p2'],
      ruleBoxKey: 'chem.s4.rule',
      ruleBoxTitleKey: 's4.rule_box_title'
    },

    // S5 Formative Diagnostic Check & Changed Retry
    formativeCheckQuestion: {
      id: 'q-formative-chem-01',
      promptKey: 'chem.formative.prompt',
      options: [
        { id: 'opt-a', labelKey: 'chem.formative.opt_a', isCorrect: false, misconceptionId: 'chem.fb.scale' },
        { id: 'opt-b', labelKey: 'chem.formative.opt_b', isCorrect: true },
        { id: 'opt-c', labelKey: 'chem.formative.opt_c', isCorrect: false, misconceptionId: 'chem.fb.scale' }
      ],
      explanationKey: 'chem.formative.explain',
      misconceptionFeedbackKeys: {
        'opt-a': 'chem.fb.scale',
        'opt-c': 'chem.fb.scale'
      }
    },
    retryQuestion: {
      id: 'q-retry-chem-01',
      promptKey: 'chem.retry.prompt',
      options: [
        { id: 'opt-a', labelKey: 'chem.retry.opt_a', isCorrect: true },
        { id: 'opt-b', labelKey: 'chem.retry.opt_b', isCorrect: false },
        { id: 'opt-c', labelKey: 'chem.retry.opt_c', isCorrect: false }
      ],
      explanationKey: 'chem.retry.explain'
    },

    // S6 Summative Exit Checks & Transfer
    exitCheckQuestions: [
      {
        id: 'q-exit1-chem-01',
        promptKey: 'chem.exit1.prompt',
        options: [
          { id: 'opt-a', labelKey: 'chem.exit1.opt_a', isCorrect: false },
          { id: 'opt-b', labelKey: 'chem.exit1.opt_b', isCorrect: true },
          { id: 'opt-c', labelKey: 'chem.exit1.opt_c', isCorrect: false }
        ],
        explanationKey: 'chem.exit1.explain'
      },
      {
        id: 'q-exit2-chem-01',
        promptKey: 'chem.exit2.prompt',
        options: [
          { id: 'opt-a', labelKey: 'chem.exit2.opt_a', isCorrect: false },
          { id: 'opt-b', labelKey: 'chem.exit2.opt_b', isCorrect: false },
          { id: 'opt-c', labelKey: 'chem.exit2.opt_c', isCorrect: true }
        ],
        explanationKey: 'chem.exit2.explain'
      }
    ],

    // Mastery Tokens & Summary
    masteryBadge: {
      id: 'badge-chem-rasayan',
      nameKey: 'badge.chem.name',
      descKey: 'badge.chem.desc',
      iconEmoji: '🧪'
    },
    recapBulletKeys: ['chem.recap_1', 'chem.recap_2'],
    safetyNoticeKey: 'chem.safety_disclaimer',
    assetProvenance: {
      source: 'Gramin PocketLab Internal Engineering & NCERT Class 7 Science',
      licence: 'MIT',
      author: 'Gramin PocketLab Chemistry Team'
    }
  }
};

/**
 * Returns canonical mission definition for a subject ID, or null.
 * @param {string} subjectId
 * @returns {Object|null}
 */
export function getMission(subjectId) {
  return MISSIONS[subjectId] || null;
}

/**
 * Returns all registered STEM missions.
 * @returns {Object[]}
 */
export function getAllMissions() {
  return Object.values(MISSIONS);
}
