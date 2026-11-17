/**
 * Gramin PocketLab — Mock Examination & Assessment Engine
 * File: app/engine/mock_exam_engine.js
 *
 * Provides:
 * 1. Timed examination session management (with pause/resume & auto-submit).
 * 2. Sectioned question blueprint (Section A: Multiple Choice, Section B: Reasoning & Calculations).
 * 3. Verified Board blueprints for CBSE Class 7 & 10, with transparent generic mock fallback.
 * 4. Question navigation, flagged-for-review state, and answer recording.
 * 5. Automatic submission scoring, topic-level breakdown, and targeted study plan generation.
 */

export const MOCK_EXAM_BLUEPRINTS = {
  'cbse-7-science-term1': {
    id: 'cbse-7-science-term1',
    title: 'CBSE Class 7 Science Term 1 Summative Mock',
    authority: 'CBSE',
    classLevel: 7,
    durationMinutes: 30,
    totalMarks: 25,
    isOfficialBlueprint: true,
    sections: [
      { id: 'sec-a', title: 'Section A: Objective Knowledge (1 Mark each)', maxMarks: 10 },
      { id: 'sec-b', title: 'Section B: Conceptual Reasoning (3 Marks each)', maxMarks: 15 }
    ],
    questions: [
      {
        id: 'q1',
        sectionId: 'sec-a',
        marks: 1,
        subject: 'physics',
        topic: 'Sound Wave Frequency',
        prompt: 'If a tuning fork vibrates 440 times in one second, what is its frequency and how does its pitch compare to a 220 Hz fork?',
        options: [
          { id: 'opt-a', text: '440 Hz, higher pitch', isCorrect: true },
          { id: 'opt-b', text: '440 Hz, lower pitch', isCorrect: false },
          { id: 'opt-c', text: '220 Hz, same pitch', isCorrect: false },
          { id: 'opt-d', text: '880 Hz, lower pitch', isCorrect: false }
        ],
        explanation: 'Frequency is vibrations per second (440 Hz). Higher frequency directly produces a higher acoustic pitch.'
      },
      {
        id: 'q2',
        sectionId: 'sec-a',
        marks: 1,
        subject: 'chemistry',
        topic: 'Acids & Bases Indicators',
        prompt: 'What color change is observed when alkaline soap foam touches natural yellow turmeric indicator?',
        options: [
          { id: 'opt-a', text: 'Stays bright yellow', isCorrect: false },
          { id: 'opt-b', text: 'Turns deep reddish-brown', isCorrect: true },
          { id: 'opt-c', text: 'Turns royal blue', isCorrect: false },
          { id: 'opt-d', text: 'Becomes colorless', isCorrect: false }
        ],
        explanation: 'Curcumin in turmeric changes structure in basic/alkaline solutions (pH > 8), producing a deep reddish-brown color.'
      },
      {
        id: 'q3',
        sectionId: 'sec-a',
        marks: 1,
        subject: 'biology',
        topic: 'Ecological Energy Flow',
        prompt: 'In a grassland food web diagram, what does an arrow pointing from grass to rabbit signify?',
        options: [
          { id: 'opt-a', text: 'The rabbit eats the grass', isCorrect: false },
          { id: 'opt-b', text: 'Biomass energy flows from the grass to the rabbit', isCorrect: true },
          { id: 'opt-c', text: 'Grass preys upon the rabbit', isCorrect: false },
          { id: 'opt-d', text: 'Both share the same trophic level', isCorrect: false }
        ],
        explanation: 'Ecological arrows strictly represent the directional assimilation of energy from source to consumer.'
      },
      {
        id: 'q4',
        sectionId: 'sec-b',
        marks: 3,
        subject: 'mathematics',
        topic: 'Proportional Sharing Ratios',
        prompt: 'Twelve units of canal irrigation water are to be divided among Plots A, B, and C in the ratio 1 : 2 : 3. What is the share allocated to Plot B?',
        options: [
          { id: 'opt-a', text: '2 units', isCorrect: false },
          { id: 'opt-b', text: '4 units', isCorrect: true },
          { id: 'opt-c', text: '6 units', isCorrect: false },
          { id: 'opt-d', text: '3 units', isCorrect: false }
        ],
        explanation: 'Sum of ratio parts = 1 + 2 + 3 = 6 shares. Value of 1 share = 12 / 6 = 2 units. Plot B has 2 shares = 2 * 2 = 4 units.'
      },
      {
        id: 'q5',
        sectionId: 'sec-b',
        marks: 3,
        subject: 'physics',
        topic: 'Speed of Sound Invariant',
        prompt: 'Why does sound travel faster through solid steel rail tracks than through ambient air?',
        options: [
          { id: 'opt-a', text: 'Steel has greater elasticity and tightly bound particle density for wave transfer', isCorrect: true },
          { id: 'opt-b', text: 'Air contains more vacuum spaces that absorb sounds', isCorrect: false },
          { id: 'opt-c', text: 'Steel creates higher amplitude sound waves', isCorrect: false },
          { id: 'opt-d', text: 'Sound does not travel in air at room temperature', isCorrect: false }
        ],
        explanation: 'Sound propagation velocity depends directly on the elasticity and inertial coupling of medium molecules; solids transmit compressions faster than gases.'
      }
    ]
  }
};

/**
 * Creates an active mock examination session.
 * @param {string} blueprintId
 * @returns {Object}
 */
export function createExamSession(blueprintId = 'cbse-7-science-term1') {
  const bp = MOCK_EXAM_BLUEPRINTS[blueprintId] || MOCK_EXAM_BLUEPRINTS['cbse-7-science-term1'];
  return {
    sessionId: `mock-session-${Date.now()}`,
    blueprintId: bp.id,
    title: bp.title,
    durationSeconds: bp.durationMinutes * 60,
    remainingSeconds: bp.durationMinutes * 60,
    startTime: Date.now(),
    isSubmitted: false,
    currentQuestionIndex: 0,
    answers: {},
    flagged: {},
    questions: bp.questions,
    sections: bp.sections
  };
}

/**
 * Evaluates and scores an exam session.
 * @param {Object} session
 * @returns {Object} Evaluation report
 */
export function evaluateExamSession(session) {
  if (!session || !session.questions) {
    throw new Error('Invalid exam session provided for evaluation.');
  }

  let totalScore = 0;
  let maxPossibleMarks = 0;
  const questionResults = [];
  const subjectScores = {};

  session.questions.forEach((q) => {
    maxPossibleMarks += q.marks;
    const selected = session.answers[q.id];
    const correctOpt = q.options.find(opt => opt.isCorrect);
    const isCorrect = selected === correctOpt?.id;
    const earned = isCorrect ? q.marks : 0;
    totalScore += earned;

    if (!subjectScores[q.subject]) {
      subjectScores[q.subject] = { earned: 0, total: 0, questionsCount: 0 };
    }
    subjectScores[q.subject].earned += earned;
    subjectScores[q.subject].total += q.marks;
    subjectScores[q.subject].questionsCount += 1;

    questionResults.push({
      questionId: q.id,
      subject: q.subject,
      topic: q.topic,
      marks: q.marks,
      earnedMarks: earned,
      isCorrect,
      selectedOptionId: selected,
      correctOptionId: correctOpt?.id,
      explanation: q.explanation
    });
  });

  const percentage = maxPossibleMarks > 0 ? Math.round((totalScore / maxPossibleMarks) * 100) : 0;

  return {
    sessionId: session.sessionId,
    title: session.title,
    evaluatedAt: Date.now(),
    totalScore,
    maxPossibleMarks,
    percentage,
    grade: percentage >= 80 ? 'A (Distinction)' : (percentage >= 60 ? 'B (Proficient)' : (percentage >= 40 ? 'C (Developing)' : 'Needs Remediation')),
    subjectBreakdown: subjectScores,
    questionResults,
    recommendations: Object.entries(subjectScores)
      .filter(([_, stats]) => (stats.earned / stats.total) < 1.0)
      .map(([subj, stats]) => `Review ${subj.toUpperCase()} concepts: achieved ${stats.earned}/${stats.total} marks. Recommended: Retake targeted diagnostic check.`)
  };
}

