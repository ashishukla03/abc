/**
 * Gramin PocketLab — Automated Verification Suite
 * Suite 12: test_tutor_and_mock_engine.mjs
 *
 * Verifies:
 * 1. AI Tutor Grounded Retrieval & Textbook Citations.
 * 2. 3-Tier Graduated Hint Scaffolding (no answer leakage).
 * 3. Misconception Detection & Diagnostic Guidance.
 * 4. Truthful Offline/Local Grounding Disclaimer.
 * 5. Mock Exam Engine Session Creation & Timer Initialization.
 * 6. Automated Exam Evaluation & Topic-Level Diagnostic Breakdown.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const { aiTutor, AITutorEngine, VERIFIED_LOCAL_KNOWLEDGE } = await import('../app/engine/ai_tutor.js');
const { createExamSession, evaluateExamSession, MOCK_EXAM_BLUEPRINTS } = await import('../app/engine/mock_exam_engine.js');

test('Suite 12: Grounded AI Tutor & Mock Exam Engine', async (t) => {

  await t.test('1. AI Tutor Grounded Retrieval & Provenance', () => {
    const res = aiTutor.ask({ subject: 'physics', topicKey: 'sound_waves' });
    assert.equal(res.tutorStatus, 'offline_verified_grounded');
    assert.ok(res.groundedSource.citation.includes('NCERT'), 'Citation must cite NCERT curriculum');
    assert.ok(res.explanation.length > 50, 'Explanation must be substantive');
    assert.ok(res.simplerLanguage.length > 20, 'Simpler language explanation must exist');
    assert.ok(res.analogy.length > 20, 'Practical analogy must exist');
  });

  await t.test('2. 3-Tier Graduated Hints Scaffolding', () => {
    // Level 1 hint
    const h1 = aiTutor.ask({ subject: 'physics', topicKey: 'sound_waves', hintLevel: 1 });
    assert.equal(h1.hintLevel, 1);
    assert.ok(h1.activeHint.includes('Hint 1'), 'Tier 1 must be observational prompt');
    assert.ok(!h1.activeHint.includes('increase the frequency (Hz) while keeping'), 'Tier 1 must not reveal the direct answer');

    // Level 3 hint
    const h3 = aiTutor.ask({ subject: 'physics', topicKey: 'sound_waves', hintLevel: 3 });
    assert.equal(h3.hintLevel, 3);
    assert.ok(h3.activeHint.includes('Hint 3'), 'Tier 3 must provide directional instruction');
  });

  await t.test('3. Misconception Detection (Loudness vs Pitch & pH 7 Safety)', () => {
    // Test Sound Wave Misconception
    const resSound = aiTutor.ask({
      subject: 'physics',
      topicKey: 'sound_waves',
      studentAnswer: 'To make the pitch higher I hit the drum louder with big volume.'
    });
    assert.ok(resSound.misconceptionDiagnostic, 'Must detect frequency/amplitude confusion');
    assert.ok(resSound.misconceptionDiagnostic.includes('loudness with pitch'));

    // Test Chemistry pH Potability Misconception
    const resChem = aiTutor.ask({
      subject: 'chemistry',
      topicKey: 'acids_bases',
      studentAnswer: 'Since the water has pH 7 it is completely clean safe and potable to drink.'
    });
    assert.ok(resChem.misconceptionDiagnostic, 'Must detect pH 7 potability misconception');
    assert.ok(resChem.misconceptionDiagnostic.includes('Safety Alert'));
  });

  await t.test('4. Truthful AI Tutor Unconnected Fallback State', () => {
    const offlineEngine = new AITutorEngine({ apiKey: null });
    const res = offlineEngine.ask({ subject: 'biology' });
    assert.equal(res.tutorStatus, 'offline_verified_grounded');
    assert.ok(res.disclaimer.includes('Local Verified Grounding Mode'), 'Must be truthfully labelled offline mode');

    const onlineEngine = new AITutorEngine({ apiKey: 'mock_key' });
    const resOnline = onlineEngine.ask({ subject: 'biology' });
    assert.equal(resOnline.tutorStatus, 'live_ai_connected');
  });

  await t.test('5. Mock Exam Engine Session Initialization', () => {
    const session = createExamSession('cbse-7-science-term1');
    assert.ok(session.sessionId.startsWith('mock-session-'));
    assert.equal(session.durationSeconds, 1800); // 30 mins
    assert.equal(session.questions.length, 5);
    assert.equal(session.sections.length, 2);
    assert.equal(session.isSubmitted, false);
  });

  await t.test('6. Mock Exam Automated Evaluation & Topic Scoring', () => {
    const session = createExamSession('cbse-7-science-term1');
    
    // Student answers: Q1 correct, Q2 correct, Q3 incorrect, Q4 correct, Q5 correct
    session.answers = {
      q1: 'opt-a', // Correct (1 mark)
      q2: 'opt-b', // Correct (1 mark)
      q3: 'opt-a', // Wrong (0 marks, correct was opt-b)
      q4: 'opt-b', // Correct (3 marks)
      q5: 'opt-a'  // Correct (3 marks)
    };

    const evalReport = evaluateExamSession(session);
    assert.equal(evalReport.maxPossibleMarks, 9); // 1 + 1 + 1 + 3 + 3 = 9 marks
    assert.equal(evalReport.totalScore, 8); // 8 / 9 marks
    assert.equal(evalReport.percentage, 89);
    assert.equal(evalReport.grade, 'A (Distinction)');

    // Verify subject breakdown: Biology missed 1 mark
    assert.equal(evalReport.subjectBreakdown.biology.earned, 0);
    assert.equal(evalReport.subjectBreakdown.biology.total, 1);
    assert.ok(evalReport.recommendations.some(r => r.includes('BIOLOGY')), 'Must generate remediation for Biology');
  });
});

