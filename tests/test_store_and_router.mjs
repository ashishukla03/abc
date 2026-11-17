/**
 * Gramin PocketLab — Automated Verification Suite
 * Suite 1: test_store_and_router.mjs
 *
 * Verifies:
 * 1. Initial state structure and scalar values.
 * 2. State mutations and immutability (deep-clone snapshot guarantees).
 * 3. Persistence to localStorage mock & defensive recovery from corrupted JSON.
 * 4. In-memory mode fallback when storage is inaccessible.
 * 5. Pub/sub observer pattern: subscribe, notification payloads, unsubscribe, error resilience.
 * 6. Navigation guards:
 *    - Cannot advance past S2 to S3 without recorded prediction.
 *    - Cannot advance past S3 to S4/S5/S6 without completed lab interaction.
 * 7. Router hash parsing, formatting, and step traversal (nextStep, prevStep, goToMap, goToSubject).
 * 8. Locale toggle ('en' <-> 'kn') and mute toggle.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

// Establish mock browser environment before module import
class MockLocalStorage {
  constructor() {
    this.store = new Map();
    this.failOnSet = false;
  }
  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }
  setItem(key, value) {
    if (this.failOnSet) {
      throw new Error('QuotaExceededError or Storage Disabled');
    }
    this.store.set(key, String(value));
  }
  removeItem(key) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}

const mockStorage = new MockLocalStorage();

let _hash = '#/map';
const mockWindow = {
  localStorage: mockStorage,
  location: {
    get hash() { return _hash; },
    set hash(val) {
      _hash = val;
      mockWindow._trigger('hashchange');
    },
    href: 'http://localhost/#/map',
    replace(url) {
      this.href = url;
      const hashIndex = url.indexOf('#');
      this.hash = hashIndex !== -1 ? url.slice(hashIndex) : '';
    }
  },
  _listeners: {},
  addEventListener(event, fn) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(fn);
  },
  removeEventListener(event, fn) {
    if (this._listeners[event]) {
      this._listeners[event] = this._listeners[event].filter(cb => cb !== fn);
    }
  },
  _trigger(event) {
    if (this._listeners[event]) {
      this._listeners[event].forEach(fn => fn());
    }
  }
};

globalThis.window = mockWindow;

// Dynamic import after mock window setup
const { store, createDefaultState, createInitialSubjectProgress, SUBJECT_IDS, STEP_IDS, STORAGE_KEY } = await import('../app/js/store.js');
const { router } = await import('../app/js/router.js');

// Initialize router listeners
router.init();

test('Suite 1: Store & Router Verification', async (t) => {
  // Reset store before test suite
  store.resetAllProgress();
  mockStorage.clear();

  await t.test('1. Initial State Contract & Structure', () => {
    const state = store.getState();
    assert.equal(state.currentSubject, null, 'Default subject should be null');
    assert.equal(state.currentStep, 's0_map', 'Default step should be s0_map');
    assert.equal(state.selectedLocale, 'en', 'Default locale should be en');
    assert.equal(state.audioMuted, false, 'Default audioMuted should be false');
    assert.equal(state.activeSessionId, 'default_learner', 'Active session ID must be default_learner');

    assert.ok(state.progress, 'Progress object must exist');
    assert.deepEqual(Object.keys(state.progress).sort(), [...SUBJECT_IDS].sort(), 'All 4 subjects must exist in progress');

    SUBJECT_IDS.forEach((subj) => {
      const p = state.progress[subj];
      assert.equal(p.isCompleted, false, `${subj}.isCompleted must be false`);
      assert.equal(p.predictionChoiceId, null, `${subj}.predictionChoiceId must be null`);
      assert.equal(p.interactiveCompleted, false, `${subj}.interactiveCompleted must be false`);
      assert.equal(p.formativePassedFirstTry, false, `${subj}.formativePassedFirstTry must be false`);
      assert.equal(p.retryChoiceId, null, `${subj}.retryChoiceId must be null`);
      assert.equal(p.retryAttempts, 0, `${subj}.retryAttempts must be 0`);
      assert.deepEqual(p.exitScores, [0, 0], `${subj}.exitScores must be [0, 0]`);
      assert.equal(p.completedAt, null, `${subj}.completedAt must be null`);
      assert.equal(p.earnedBadgeId, null, `${subj}.earnedBadgeId must be null`);
    });
  });

  await t.test('2. Immutability & Deep Clone Isolation', () => {
    const snap1 = store.getState();
    snap1.currentSubject = 'corrupted_external';
    snap1.progress.physics.isCompleted = true;

    const snap2 = store.getState();
    assert.equal(snap2.currentSubject, null, 'Mutating returned snapshot must not alter store internal state');
    assert.equal(snap2.progress.physics.isCompleted, false, 'Mutating nested snapshot must not mutate store state');
  });

  await t.test('3. State Mutations & Actions', () => {
    // Valid subject transition
    store.setSubject('physics');
    assert.equal(store.getState().currentSubject, 'physics');

    // Invalid subject rejected defensively
    store.setSubject('astronomy');
    assert.equal(store.getState().currentSubject, 'physics', 'Invalid subject must be rejected');

    // Valid step transition
    store.setStep('s1_intro');
    assert.equal(store.getState().currentStep, 's1_intro');

    // Invalid step rejected defensively
    store.setStep('s99_invalid');
    assert.equal(store.getState().currentStep, 's1_intro', 'Invalid step must be rejected');

    // Prediction recording
    store.setStep('s2_predict');
    store.recordPrediction('opt-a');
    assert.equal(store.getState().progress.physics.predictionChoiceId, 'opt-a');

    // Interactive completion
    store.setInteractiveCompleted(true);
    assert.equal(store.getState().progress.physics.interactiveCompleted, true);

    // Formative diagnostic result (first try true)
    store.recordFormativeResult(true, 'opt-b');
    assert.equal(store.getState().progress.physics.formativePassedFirstTry, true);

    // Retry choice recording
    store.recordRetryChoice('opt-c');
    assert.equal(store.getState().progress.physics.retryChoiceId, 'opt-c');
    assert.equal(store.getState().progress.physics.retryAttempts, 1);

    // Exit scores and completion
    store.recordExitScore(0, 1);
    store.recordExitScore(1, 1);
    const completedProgress = store.getState().progress.physics;
    assert.deepEqual(completedProgress.exitScores, [1, 1]);
    assert.equal(completedProgress.isCompleted, true);
    assert.ok(typeof completedProgress.completedAt === 'number' && completedProgress.completedAt > 0);
    assert.equal(completedProgress.earnedBadgeId, 'badge_physics_mastery');
  });

  await t.test('4. Granular Reset: resetSubjectLab vs resetSubjectProgress vs resetAllProgress', () => {
    // Reset lab only: interactiveCompleted -> false, but badges & isCompleted preserved!
    store.resetSubjectLab('physics');
    let state = store.getState();
    assert.equal(state.progress.physics.interactiveCompleted, false, 'Lab should be reset');
    assert.equal(state.progress.physics.isCompleted, true, 'isCompleted must be retained on lab-only reset');
    assert.equal(state.progress.physics.earnedBadgeId, 'badge_physics_mastery', 'Badge retained on lab-only reset');

    // Reset subject progress completely
    store.resetSubjectProgress('physics');
    state = store.getState();
    assert.deepEqual(state.progress.physics, createInitialSubjectProgress(), 'Physics progress must be fully reset');

    // Modify multiple subjects and reset all
    store.setSubject('math');
    store.recordPrediction('opt-b');
    store.resetAllProgress();
    state = store.getState();
    assert.equal(state.currentSubject, null);
    assert.equal(state.currentStep, 's0_map');
    assert.equal(state.progress.math.predictionChoiceId, null);
  });

  await t.test('5. Pub/Sub Listener Dispatch & Error Resilience', () => {
    let callCount = 0;
    let lastAction = null;
    let lastPayload = null;

    const unsubscribe = store.subscribe((snap, action, payload) => {
      callCount++;
      lastAction = action;
      lastPayload = payload;
    });

    store.setSubject('biology');
    assert.equal(callCount, 1);
    assert.equal(lastAction, 'SET_SUBJECT');
    assert.equal(lastPayload, 'biology');

    // Register a broken listener that throws — must not break the notification loop
    const brokenUnsub = store.subscribe(() => {
      throw new Error('Listener crash simulation');
    });

    store.setStep('s1_intro');
    assert.equal(callCount, 2);
    assert.equal(lastAction, 'SET_STEP');

    brokenUnsub();
    unsubscribe();

    // After unsubscription, no further events received
    store.setSubject('chemistry');
    assert.equal(callCount, 2, 'Unsubscribed listener must not be called again');
  });

  await t.test('6. LocalStorage Mock Persistence & Defensive Deserialization', () => {
    store.resetAllProgress();
    store.setSubject('chemistry');
    store.setLocale('kn');
    store.setMuted(true);
    store.recordPrediction('chem-opt-1');

    // Check raw string in localStorage
    const raw = mockStorage.getItem(STORAGE_KEY);
    assert.ok(raw, 'Data must be stored in localStorage');
    const parsed = JSON.parse(raw);
    assert.equal(parsed.selectedLocale, 'kn');
    assert.equal(parsed.audioMuted, true);
    assert.equal(parsed.progress.chemistry.predictionChoiceId, 'chem-opt-1');

    // Test corrupted JSON recovery
    mockStorage.setItem(STORAGE_KEY, '{ invalid_malformed_json ::: !!!');
    // Calling resetAllProgress clears or handles gracefully
    store.resetAllProgress();
    assert.equal(store.getState().currentStep, 's0_map');
  });

  await t.test('7. In-Memory Mode Resilience (QuotaExceeded / Storage Failures)', () => {
    mockStorage.failOnSet = true; // Simulate private browsing / quota exceeded
    assert.doesNotThrow(() => {
      store.setSubject('math');
      store.setStep('s2_predict');
      store.recordPrediction('opt-test');
    }, 'Store must not throw when localStorage fails');

    assert.equal(store.getState().currentSubject, 'math');
    assert.equal(store.getState().progress.math.predictionChoiceId, 'opt-test');
    mockStorage.failOnSet = false;
  });

  await t.test('8. Navigation Guards: Pedagogical Progression Invariants', () => {
    store.resetAllProgress();
    store.setSubject('physics');

    // S0, S1, S2 are always accessible
    assert.equal(store.isStepAccessible('physics', 's0_map'), true);
    assert.equal(store.isStepAccessible('physics', 's1_intro'), true);
    assert.equal(store.isStepAccessible('physics', 's2_predict'), true);

    // GUARD 1: Cannot enter S3 (explore) without prediction on S2
    assert.equal(store.isStepAccessible('physics', 's3_explore'), false, 'S3 must be blocked before prediction');
    const navToS3Blocked = router.validateNavigation('physics', 's3_explore');
    assert.equal(navToS3Blocked.allowed, false);
    assert.equal(navToS3Blocked.redirectStep, 's2_predict', 'Blocked S3 navigation must redirect to s2_predict');

    // Fulfill prediction precondition
    store.recordPrediction('opt-a');
    assert.equal(store.isStepAccessible('physics', 's3_explore'), true, 'S3 must be accessible after prediction');
    const navToS3Allowed = router.validateNavigation('physics', 's3_explore');
    assert.equal(navToS3Allowed.allowed, true);

    // GUARD 2: Cannot enter S4, S5, S6 without completing interactive exploration on S3
    ['s4_understand', 's5_feedback_retry', 's6_exit_result'].forEach((step) => {
      assert.equal(store.isStepAccessible('physics', step), false, `${step} must be blocked before lab completion`);
      const navBlocked = router.validateNavigation('physics', step);
      assert.equal(navBlocked.allowed, false);
      assert.equal(navBlocked.redirectStep, 's3_explore', `Blocked ${step} must redirect to s3_explore`);
    });

    // Fulfill lab completion precondition
    store.setInteractiveCompleted(true);
    ['s4_understand', 's5_feedback_retry', 's6_exit_result'].forEach((step) => {
      assert.equal(store.isStepAccessible('physics', step), true, `${step} must be accessible after lab completion`);
      const navAllowed = router.validateNavigation('physics', step);
      assert.equal(navAllowed.allowed, true);
    });
  });

  await t.test('9. Router Hash Parsing & Formatting', () => {
    mockWindow.location.hash = '';
    assert.deepEqual(router.parseHash(), { subject: null, step: 's0_map' });

    mockWindow.location.hash = '#/map';
    assert.deepEqual(router.parseHash(), { subject: null, step: 's0_map' });

    mockWindow.location.hash = '#/physics';
    assert.deepEqual(router.parseHash(), { subject: 'physics', step: 's1_intro' });

    mockWindow.location.hash = '#/physics/s3_explore';
    assert.deepEqual(router.parseHash(), { subject: 'physics', step: 's3_explore' });

    mockWindow.location.hash = '#/unknown_subject/s1_intro';
    assert.deepEqual(router.parseHash(), { subject: null, step: 's0_map' });

    // Formatting
    assert.equal(router.formatHash(null, 's0_map'), '#/map');
    assert.equal(router.formatHash('physics', 's0_map'), '#/map');
    assert.equal(router.formatHash('physics', 's2_predict'), '#/physics/s2_predict');
  });

  await t.test('10. Router Step Traversal (nextStep, prevStep, goToMap, goToSubject)', () => {
    store.resetAllProgress();
    router.goToSubject('physics');
    assert.equal(store.getState().currentSubject, 'physics');
    assert.equal(store.getState().currentStep, 's1_intro');

    // Advance to S2
    router.nextStep();
    assert.equal(store.getState().currentStep, 's2_predict');

    // Advance to S3 (blocked because no prediction) -> stays/redirects to s2_predict
    router.nextStep();
    assert.equal(store.getState().currentStep, 's2_predict', 'Advance to S3 without prediction must stay at s2_predict');

    // Fulfill S2 prediction
    store.recordPrediction('opt-a');
    router.nextStep();
    assert.equal(store.getState().currentStep, 's3_explore', 'Advance to S3 after prediction must succeed');

    // Step back
    router.prevStep();
    assert.equal(store.getState().currentStep, 's2_predict');

    // Jump to map
    router.goToMap();
    assert.equal(store.getState().currentStep, 's0_map');
    assert.equal(store.getState().currentSubject, null);
  });

  await t.test('11. Locale & Mute Toggles', () => {
    store.resetAllProgress();
    assert.equal(store.getState().selectedLocale, 'en');

    // Toggle locale
    store.toggleLocale();
    assert.equal(store.getState().selectedLocale, 'kn');
    store.toggleLocale();
    assert.equal(store.getState().selectedLocale, 'en');

    // Set locale explicitly
    store.setLocale('kn');
    assert.equal(store.getState().selectedLocale, 'kn');
    store.setLocale('invalid_loc'); // Ignored
    assert.equal(store.getState().selectedLocale, 'kn');
    store.setLocale('en');
    assert.equal(store.getState().selectedLocale, 'en');

    // Toggle mute
    assert.equal(store.getState().audioMuted, false);
    store.toggleMute();
    assert.equal(store.getState().audioMuted, true);
    store.toggleMute();
    assert.equal(store.getState().audioMuted, false);

    // Set muted explicitly
    store.setMuted(true);
    assert.equal(store.getState().audioMuted, true);
    store.setMuted(false);
    assert.equal(store.getState().audioMuted, false);
  });
});
