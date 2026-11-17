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
import { FractionsModule } from '../modules/fractions_module.js';
import { OpticsModule } from '../modules/optics_module.js';
import { CalculusModule } from '../modules/calculus_module.js';
import { CodingModule } from '../modules/coding_module.js';

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

/**
 * Extended Age-Adaptive Interactive Micro-Labs across K-12 Grade Bands.
 */
export const EXTENDED_MISSIONS = {
  fractions: {
    id: 'mission-math-fractions',
    subjectId: 'fractions',
    title: "Baker's Chapati Feast",
    gradeBand: 'Preparatory',
    classLevel: 5,
    curriculumStandard: 'NCERT Class 5 Mathematics',
    iconEmoji: '🫓',
    interactionHandler: FractionsModule,
    topic: 'Equivalent Fractions',
    description: 'Cut the village festival chapati and find visually equivalent fractions.'
  },
  coding: {
    id: 'mission-computing-maze',
    subjectId: 'coding',
    title: 'Solar Rover Algorithm Studio',
    gradeBand: 'Middle',
    classLevel: 8,
    curriculumStandard: 'NCERT Class 8 Computing',
    iconEmoji: '🤖',
    interactionHandler: CodingModule,
    topic: 'Algorithmic Sequencing & Loops',
    description: 'Assemble sequence and loop instructions to guide the solar rover through obstacles.'
  },
  optics: {
    id: 'mission-physics-optics',
    subjectId: 'optics',
    title: "Ray Optics Refraction & Snell's Law",
    gradeBand: 'Secondary',
    classLevel: 10,
    curriculumStandard: 'NCERT Class 10 Physics',
    iconEmoji: '🔦',
    interactionHandler: OpticsModule,
    topic: 'Light Refraction & Critical Angle',
    description: 'Direct laser beam from air into glass slab and observe refractive bending.'
  },
  calculus: {
    id: 'mission-math-calculus',
    subjectId: 'calculus',
    title: 'Solar Roof Area Integrals',
    gradeBand: 'Senior Secondary',
    classLevel: 12,
    curriculumStandard: 'NCERT Class 12 Mathematics',
    iconEmoji: '☀️',
    interactionHandler: CalculusModule,
    topic: 'Applications of Definite Integrals',
    description: 'Increase Riemann sum strips to calculate exact area under the curved solar panel profile.'
  }
};

/**
 * Authoritative Question Worlds Sample Catalog (29 entries from QUESTION_WORLD_SAMPLE_CATALOG.csv)
 * Spanning Classes 5-12, all major boards (CBSE, CISCE, KSEAB), and multi-subject disciplines.
 */
export const QUESTION_WORLDS_CATALOG = [
  {
    worldId: 'QW-MTH-05-01',
    subject: 'Mathematics',
    gradeBand: 'Preparatory',
    classLevel: 5,
    curriculumAuthority: 'CBSE',
    chapter: 'Fractions',
    topic: 'Equivalent Fractions',
    worldTitle: "Baker's Chapati Feast",
    environmentType: 'Bakery Kitchen',
    narrativeContext: 'Distribute chapatis equally among village guests using cutter',
    coreMechanic: 'Interactive circle fraction cutter with visual slice merger',
    pedagogicalTarget: 'Understanding 2/4 equals 1/2 visually',
    misconception: 'Larger denominator means bigger piece fallacy',
    iconEmoji: '🫓',
    moduleId: 'fractions'
  },
  {
    worldId: 'QW-MTH-08-01',
    subject: 'Mathematics',
    gradeBand: 'Middle',
    classLevel: 6,
    curriculumAuthority: 'CBSE',
    chapter: 'Ratio and Proportion',
    topic: 'Three-Part Unequal Division',
    worldTitle: 'Village Canal Water Sharing',
    environmentType: 'Irrigation Canal Sluice Gate',
    narrativeContext: 'Allocate 12 units of water across 3 plots in 1:2:3 ratio',
    coreMechanic: 'Dynamic increment steppers with real-time capacity clamping',
    pedagogicalTarget: 'Proportional reasoning and multi-part allocation invariants',
    misconception: 'Additive equipartition fallacy (12/3 = 4 each)',
    iconEmoji: '💧',
    moduleId: 'math'
  },
  {
    worldId: 'QW-MTH-10-01',
    subject: 'Mathematics',
    gradeBand: 'Secondary',
    classLevel: 10,
    curriculumAuthority: 'CBSE',
    chapter: 'Trigonometry',
    topic: 'Heights and Distances',
    worldTitle: 'Surveying the Sun Temple',
    environmentType: 'Ancient Architectural Survey',
    narrativeContext: 'Align theodolite angle slider to measure shadow and tower height',
    coreMechanic: 'Angle of elevation slider with dynamic hypotenuse triangle',
    pedagogicalTarget: 'Application of tangent ratio in indirect physical measurement',
    misconception: 'Confusing angle of elevation with angle of depression',
    iconEmoji: '📐'
  },
  {
    worldId: 'QW-MTH-12-01',
    subject: 'Mathematics',
    gradeBand: 'Senior Secondary',
    classLevel: 12,
    curriculumAuthority: 'CBSE',
    chapter: 'Calculus',
    topic: 'Applications of Integrals',
    worldTitle: 'Solar Roof Area Calculator',
    environmentType: 'Solar Energy Lab',
    narrativeContext: 'Find exact area under parabola curve for solar roof panel',
    coreMechanic: 'Riemann sum slider increasing slice count to limit of integral',
    pedagogicalTarget: 'Definite integral as accumulation of infinitesimal strips',
    misconception: 'Confusing antiderivative constant with definite boundary area',
    iconEmoji: '☀️',
    moduleId: 'calculus'
  },
  {
    worldId: 'QW-BIO-06-01',
    subject: 'Biology',
    gradeBand: 'Middle',
    classLevel: 7,
    curriculumAuthority: 'CBSE',
    chapter: 'Our Environment',
    topic: 'Food Webs and Trophic Cascades',
    worldTitle: 'Paddy Field Ecosystem Balance',
    environmentType: 'Rural Agricultural Field',
    narrativeContext: 'Investigate predator-prey balance between owls snakes and frogs',
    coreMechanic: 'SVG interactive food web with toggleable disturbance triggers',
    pedagogicalTarget: 'Understanding indirect trophic cascade relationships',
    misconception: 'Direct-only thinking (removing snakes only affects frogs)',
    iconEmoji: '🌾',
    moduleId: 'biology'
  },
  {
    worldId: 'QW-BIO-10-01',
    subject: 'Biology',
    gradeBand: 'Secondary',
    classLevel: 10,
    curriculumAuthority: 'CISCE',
    chapter: 'Life Processes',
    topic: 'Cellular Respiration and Photosynthesis',
    worldTitle: 'Leaf Stomata Micro-Chamber',
    environmentType: 'Microscopic Leaf Stoma Chamber',
    narrativeContext: 'Control light and humidity sliders to observe guard cell turgidity',
    coreMechanic: 'Dynamic dual-state guard cell membrane simulation',
    pedagogicalTarget: 'Mechanism of stomatal opening via osmosis and potassium flux',
    misconception: 'Belief that plants only photosynthesize and do not respire',
    iconEmoji: '🔬'
  },
  {
    worldId: 'QW-BIO-12-01',
    subject: 'Biology',
    gradeBand: 'Senior Secondary',
    classLevel: 12,
    curriculumAuthority: 'CBSE',
    chapter: 'Genetics',
    topic: 'Dihybrid Cross and Independent Assortment',
    worldTitle: 'Mendelian Pea Pod Greenhouse',
    environmentType: 'Monastery Research Greenhouse',
    narrativeContext: 'Breed homozygous and heterozygous pea plants to observe 9:3:3:1 ratio',
    coreMechanic: 'Drag-and-drop allele gamete combiner onto 4x4 Punnett grid',
    pedagogicalTarget: 'Law of independent assortment and phenotypic segregation',
    misconception: 'Blending inheritance misconception (mixing traits like paint)',
    iconEmoji: '🌱'
  },
  {
    worldId: 'QW-CHM-07-01',
    subject: 'Chemistry',
    gradeBand: 'Middle',
    classLevel: 7,
    curriculumAuthority: 'CBSE',
    chapter: 'Acids Bases and Salts',
    topic: 'Indicators and pH Scale',
    worldTitle: 'Village Dye Works pH Testing',
    environmentType: 'Natural Dye Laboratory',
    narrativeContext: 'Test Lemon Juice Distilled Water Baking Soda and Soap with indicators',
    coreMechanic: 'Virtual beaker dipping strip with CSS chromatic shifts',
    pedagogicalTarget: 'Classifying acidic neutral and alkaline substances using indicators',
    misconception: 'Neutral pH 7 implies absolute potability and pathogen safety',
    iconEmoji: '🧪',
    moduleId: 'chemistry'
  },
  {
    worldId: 'QW-CHM-10-01',
    subject: 'Chemistry',
    gradeBand: 'Secondary',
    classLevel: 10,
    curriculumAuthority: 'CBSE',
    chapter: 'Chemical Reactions',
    topic: 'Reactivity Series and Displacement',
    worldTitle: 'Metal Extraction Metallurgy Bench',
    environmentType: 'Foundry Metallurgy Station',
    narrativeContext: 'Submerge zinc and iron strips into copper sulphate solution',
    coreMechanic: 'Dynamic metal replacement animation with electron exchange visualizer',
    pedagogicalTarget: 'Predicting single displacement reactions via reactivity series',
    misconception: 'Belief that all metals react equally with aqueous solutions',
    iconEmoji: '⚙️'
  },
  {
    worldId: 'QW-CHM-12-01',
    subject: 'Chemistry',
    gradeBand: 'Senior Secondary',
    classLevel: 12,
    curriculumAuthority: 'CBSE',
    chapter: 'Electrochemistry',
    topic: 'Galvanic Cells and Nernst Equation',
    worldTitle: 'Daniell Cell Voltage Workbench',
    environmentType: 'Electrochemistry Lab Bench',
    narrativeContext: 'Swap zinc/copper electrodes and adjust molar concentration sliders',
    coreMechanic: 'Real-time voltmeter dial reacting to ion flow and salt bridge',
    pedagogicalTarget: 'Relating standard reduction potentials to cell electromotive force',
    misconception: 'Belief that electrons flow through the salt bridge solution',
    iconEmoji: '🔋'
  },
  {
    worldId: 'QW-PHY-08-01',
    subject: 'Physics',
    gradeBand: 'Middle',
    classLevel: 8,
    curriculumAuthority: 'CBSE',
    chapter: 'Sound',
    topic: 'Frequency Pitch and Waveforms',
    worldTitle: 'The Sound Detective Acoustic Studio',
    environmentType: 'Acoustic Wave Testing Room',
    narrativeContext: 'Compare 220 Hz low tone and 440 Hz high tone on live oscilloscope',
    coreMechanic: 'Oscillator playback button with 60 FPS 10ms sine wave canvas',
    pedagogicalTarget: 'Decoupling frequency (pitch) from amplitude (loudness)',
    misconception: 'Louder sound travels faster or has higher frequency',
    iconEmoji: '🎵',
    moduleId: 'physics'
  },
  {
    worldId: 'QW-PHY-10-01',
    subject: 'Physics',
    gradeBand: 'Secondary',
    classLevel: 10,
    curriculumAuthority: 'CISCE',
    chapter: 'Light',
    topic: 'Ray Optics Refraction and Snell\'s Law',
    worldTitle: 'Underwater Laser Beacon',
    environmentType: 'Harbor Lighthouse Water Tank',
    narrativeContext: 'Direct laser beam from air into glass slab at varying incident angles',
    coreMechanic: 'Interactive protractor dragging light ray with refractive bending',
    pedagogicalTarget: 'Snell\'s law of refraction and critical angle total internal reflection',
    misconception: 'Light ray bends towards normal when speeding up',
    iconEmoji: '🔦',
    moduleId: 'optics'
  },
  {
    worldId: 'QW-PHY-12-01',
    subject: 'Physics',
    gradeBand: 'Senior Secondary',
    classLevel: 12,
    curriculumAuthority: 'CBSE',
    chapter: 'Electromagnetism',
    topic: 'Faraday\'s Law and Lenz\'s Law',
    worldTitle: 'Maglev Induction Turbine',
    environmentType: 'High-Speed Rail Dynamo Laboratory',
    narrativeContext: 'Plunge bar magnet into wire solenoid coil at varying velocities',
    coreMechanic: 'Electromagnetic flux canvas with real-time galvanometer needle',
    pedagogicalTarget: 'Rate of change of magnetic flux inducing counter-electromotive force',
    misconception: 'Magnetic field strength alone induces current without change',
    iconEmoji: '🧲'
  },
  {
    worldId: 'QW-HIS-06-01',
    subject: 'Social Science',
    gradeBand: 'Middle',
    classLevel: 6,
    curriculumAuthority: 'CBSE',
    chapter: 'Early Civilisations',
    topic: 'Indus Valley City Planner',
    worldTitle: 'Harappan Bronze Age City Site',
    environmentType: 'Archaeological Excavation Grid',
    narrativeContext: 'Reconstruct granary water drainage system and public bath',
    coreMechanic: 'Grid-based urban map placing terracotta drain channels',
    pedagogicalTarget: 'Understanding advanced urban sanitation and civic planning in antiquity',
    misconception: 'Ancient cities developed randomly without municipal coordination',
    iconEmoji: '🏛️'
  },
  {
    worldId: 'QW-HIS-10-01',
    subject: 'Social Science',
    gradeBand: 'Secondary',
    classLevel: 10,
    curriculumAuthority: 'CBSE',
    chapter: 'Nationalism in India',
    topic: 'The Salt March Route Cartographer',
    worldTitle: '1930 Coastal Dandi Trail',
    environmentType: 'Historical Cartography Studio',
    narrativeContext: 'Investigate regional salt monopoly laws and trace 240-mile march',
    coreMechanic: 'Interactive historical map with primary source quote inspection pins',
    pedagogicalTarget: 'Civil disobedience tactics economic self-reliance and grassroots mobilization',
    misconception: 'Belief that the Salt March was purely a symbolic ceremonial gesture',
    iconEmoji: '🗺️'
  },
  {
    worldId: 'QW-GEO-07-01',
    subject: 'Geography',
    gradeBand: 'Middle',
    classLevel: 7,
    curriculumAuthority: 'CBSE',
    chapter: 'Water and Ocean Dynamics',
    topic: 'Monsoon Cycle and Cloud Chamber',
    worldTitle: 'Indian Ocean Atmospheric Station',
    environmentType: 'Meteorological Cloud Chamber',
    narrativeContext: 'Adjust sea surface temperature and wind pressure arrows to form clouds',
    coreMechanic: 'Boric isobar pressure slider driving moisture cloud convection',
    pedagogicalTarget: 'Understanding orographic rainfall and southwest monsoon mechanism',
    misconception: 'Rain falls automatically when clouds simply become dark',
    iconEmoji: '🌧️'
  },
  {
    worldId: 'QW-GEO-11-01',
    subject: 'Geography',
    gradeBand: 'Senior Secondary',
    classLevel: 11,
    curriculumAuthority: 'CBSE',
    chapter: 'Physical Geography',
    topic: 'Plate Tectonics and Mountain Building',
    worldTitle: 'Himalayan Fold Mountain Fault Simulator',
    environmentType: 'Geological Subduction Observatory',
    narrativeContext: 'Drive Eurasian and Indian continental plates into collision',
    coreMechanic: 'Compressive stress lever demonstrating crustal folding and earthquakes',
    pedagogicalTarget: 'Convergent tectonic boundaries and fold mountain genesis',
    misconception: 'Continents float freely across ocean water like boats',
    iconEmoji: '🏔️'
  },
  {
    worldId: 'QW-POL-09-01',
    subject: 'Social Science',
    gradeBand: 'Secondary',
    classLevel: 9,
    curriculumAuthority: 'CBSE',
    chapter: 'Democratic Rights',
    topic: 'The Village Gram Sabha Council',
    worldTitle: 'Panchayat Banyan Tree Meeting',
    environmentType: 'Civic Gram Sabha Chamber',
    narrativeContext: 'Resolve community borewell water dispute using fundamental rights',
    coreMechanic: 'Dialogue tree matching villagers\' grievances to Articles 14 19 21',
    pedagogicalTarget: 'Constitutional balance between equality freedom and public order',
    misconception: 'Fundamental rights are absolute and carry zero legal limitations',
    iconEmoji: '📜'
  },
  {
    worldId: 'QW-ECO-10-01',
    subject: 'Social Science',
    gradeBand: 'Secondary',
    classLevel: 10,
    curriculumAuthority: 'CBSE',
    chapter: 'Understanding Economic Development',
    topic: 'Village Credit and Debt Trap',
    worldTitle: 'Rural Cooperative Credit Society',
    environmentType: 'Rural Bank & Credit Ledger',
    narrativeContext: 'Compare informal moneylender interest rates with formal bank loans',
    coreMechanic: 'Loan amortization slider showing compound debt accumulation',
    pedagogicalTarget: 'Distinguishing productive investment from predatory debt cycles',
    misconception: 'High interest rates are harmless if the principal loan is small',
    iconEmoji: '🏦'
  },
  {
    worldId: 'QW-COM-11-01',
    subject: 'Commerce',
    gradeBand: 'Senior Secondary',
    classLevel: 11,
    curriculumAuthority: 'CISCE',
    chapter: 'Accountancy',
    topic: 'Double Entry Ledger Balancing',
    worldTitle: 'Artisan Weaving Cooperative Ledger',
    environmentType: 'Textile Weaver Accounts Office',
    narrativeContext: 'Post journal transactions into debits and credits for yarn purchases',
    coreMechanic: 'Interactive balance scale matching assets with liabilities plus equity',
    pedagogicalTarget: 'Dual aspect concept in accounting equation (Assets = Liabilities + Equity)',
    misconception: 'Debit always means money received and credit means money lost',
    iconEmoji: '⚖️'
  },
  {
    worldId: 'QW-COM-12-01',
    subject: 'Commerce',
    gradeBand: 'Senior Secondary',
    classLevel: 12,
    curriculumAuthority: 'CBSE',
    chapter: 'Business Studies',
    topic: 'Supply Chain and Working Capital',
    worldTitle: 'Organic Mango Pulp Processing Factory',
    environmentType: 'Agro-Processing Logistics Floor',
    narrativeContext: 'Allocate working capital between raw inventory transit and storage',
    coreMechanic: 'Inventory buffer slider balancing holding costs against stockouts',
    pedagogicalTarget: 'Optimizing operating cycles and working capital requirements',
    misconception: 'Higher inventory always guarantees higher business profit',
    iconEmoji: '📦'
  },
  {
    worldId: 'QW-ENG-05-01',
    subject: 'Languages',
    gradeBand: 'Preparatory',
    classLevel: 5,
    curriculumAuthority: 'CBSE',
    chapter: 'Grammar and Reading',
    topic: 'Detective Punctuation Inspector',
    worldTitle: 'Village Library Mystery Room',
    environmentType: 'Literary Editorial Desk',
    narrativeContext: 'Place missing speech marks and question tags into dialogue fragments',
    coreMechanic: 'Drag-and-drop quotation marks and commas into sentence stream',
    pedagogicalTarget: 'Direct speech formatting and conversational punctuation rules',
    misconception: 'Exclamation marks belong at the end of every sentence for excitement',
    iconEmoji: '🔍'
  },
  {
    worldId: 'QW-ENG-08-01',
    subject: 'Languages',
    gradeBand: 'Middle',
    classLevel: 8,
    curriculumAuthority: 'CBSE',
    chapter: 'Poetry and Comprehension',
    topic: 'Metaphor Meadow',
    worldTitle: 'Poetic Imagery Conservatory',
    environmentType: 'Metaphor Botanical Conservatory',
    narrativeContext: 'Match figurative stanzas with real-world tenor and vehicle cards',
    coreMechanic: 'Interactive Venn diagram mapping literal attributes to metaphoric meaning',
    pedagogicalTarget: 'Differentiating similes metaphors and personification in poetry',
    misconception: 'Metaphors are literal falsehoods rather than figurative comparisons',
    iconEmoji: '🌸'
  },
  {
    worldId: 'QW-KAN-07-01',
    subject: 'Languages',
    gradeBand: 'Middle',
    classLevel: 7,
    curriculumAuthority: 'KSEAB',
    chapter: 'Vachana Sahitya',
    topic: 'Basavanna Vachana Decipherer',
    worldTitle: 'Kudalasangama Temple Study Chamber',
    environmentType: 'Classical Epigraphic Script Scriptorium',
    narrativeContext: 'Analyze Kayaka and Dasoha philosophical couplets using word roots',
    coreMechanic: 'Interactive word-tile arranger linking Kannada classical idioms',
    pedagogicalTarget: 'Appreciating medieval egalitarian reform philosophy in Kannada literature',
    misconception: 'Treating classical poetry as isolated vocabulary without social context',
    iconEmoji: '📖'
  },
  {
    worldId: 'QW-HIN-09-01',
    subject: 'Languages',
    gradeBand: 'Secondary',
    classLevel: 9,
    curriculumAuthority: 'CBSE',
    chapter: 'Hindi Grammar',
    topic: 'Sandhi and Samas Workshop',
    worldTitle: 'Varanasi Literary Printing Press',
    environmentType: 'Movable-Type Printing Workshop',
    narrativeContext: 'Combine root words into Tatpurush and Dvandva compound nouns',
    coreMechanic: 'Movable letter-press blocks fusing phonemes into compound words',
    pedagogicalTarget: 'Phonetic assimilation and compound noun synthesis rules in Hindi',
    misconception: 'Assuming all joined words follow identical sandhi vowel mutations',
    iconEmoji: '🔤'
  },
  {
    worldId: 'QW-CSC-08-01',
    subject: 'Computing',
    gradeBand: 'Middle',
    classLevel: 8,
    curriculumAuthority: 'CBSE',
    chapter: 'Coding and Logic',
    topic: 'Maze Navigator Algorithm Studio',
    worldTitle: 'Robotic Rover Test Course',
    environmentType: 'Robotics Prototyping Grid Arena',
    narrativeContext: 'Arrange directional loop blocks to navigate rover through village grid',
    coreMechanic: 'Visual block-based code sequence with step debugger',
    pedagogicalTarget: 'Algorithmic sequencing condition branches and loop invariants',
    misconception: 'Computers possess human intuition to fix missing instructions',
    iconEmoji: '🤖',
    moduleId: 'coding'
  },
  {
    worldId: 'QW-CSC-11-01',
    subject: 'Computing',
    gradeBand: 'Senior Secondary',
    classLevel: 11,
    curriculumAuthority: 'CBSE',
    chapter: 'Computer Science',
    topic: 'Sorting Algorithms and Complexity',
    worldTitle: 'Postal Sorting Hub Visualizer',
    environmentType: 'District Speed-Post Distribution Center',
    narrativeContext: 'Compare Bubble Sort and Binary Merge Sort swapping mail bags',
    coreMechanic: 'Speed slider running sorting algorithms with live comparison counters',
    pedagogicalTarget: 'Algorithm time complexity Big-O notation and comparison overhead',
    misconception: 'Shorter code length always executes faster than longer algorithms',
    iconEmoji: '💻'
  },
  {
    worldId: 'QW-ART-06-01',
    subject: 'Arts',
    gradeBand: 'Middle',
    classLevel: 6,
    curriculumAuthority: 'CBSE',
    chapter: 'Visual Arts',
    topic: 'Warli Folk Painting Geometry',
    worldTitle: 'Tribal Clay Courtyard',
    environmentType: 'Folk Art Mural Wall',
    narrativeContext: 'Construct village celebration mural using circles triangles and lines',
    coreMechanic: 'Canvas stencil tool snapping fundamental geometric primitives',
    pedagogicalTarget: 'Appreciating geometric rhythm harmony and indigenous folk art traditions',
    misconception: 'Folk art lacks deliberate mathematical proportion and geometric structure',
    iconEmoji: '🎨'
  },
  {
    worldId: 'QW-PED-09-01',
    subject: 'Physical Education',
    gradeBand: 'Secondary',
    classLevel: 9,
    curriculumAuthority: 'CBSE',
    chapter: 'Health and Fitness',
    topic: 'Aerobic Heart Rate Zone Trainer',
    worldTitle: 'Kabaddi Village Training Ground',
    environmentType: 'Athletic Biometrics Field',
    narrativeContext: 'Monitor simulated runner heart rate across resting aerobic and anaerobic zones',
    coreMechanic: 'Treadmill velocity dial matching BPM pulse to exertion thresholds',
    pedagogicalTarget: 'Target heart rate calculation and cardiovascular training adaptations',
    misconception: 'Maximum physical exertion at all times produces the best fitness gains',
    iconEmoji: '🏃'
  }
];

export function getQuestionWorld(worldId) {
  return QUESTION_WORLDS_CATALOG.find((w) => w.worldId === worldId) || null;
}

export function getAllQuestionWorlds() {
  return [...QUESTION_WORLDS_CATALOG];
}

export function getQuestionWorldsByGrade(gradeBand) {
  if (!gradeBand || gradeBand === 'all') return [...QUESTION_WORLDS_CATALOG];
  return QUESTION_WORLDS_CATALOG.filter((w) => w.gradeBand.toLowerCase() === gradeBand.toLowerCase());
}

export function getExtendedMission(id) {
  return EXTENDED_MISSIONS[id] || null;
}
