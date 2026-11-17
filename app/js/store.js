/**
 * Gramin PocketLab — Central Reactive State Store
 * File: app/js/store.js
 * Architecture Contract: architecture_plan/MODULE_INTERFACE_CONTRACT.md (AppSessionState)
 * Conformance: Strict ES6 Module, Zero External Dependencies, Deterministic Persistence
 */

export const STORAGE_KEY = 'pocketlab_progress';

export const SUBJECT_IDS = ['physics', 'math', 'biology', 'chemistry'];

export const STEP_IDS = [
  's0_map',
  's1_intro',
  's2_predict',
  's3_explore',
  's4_understand',
  's5_feedback_retry',
  's6_exit_result'
];

/**
 * Creates the pristine initial progress state for a single subject mission.
 * @returns {Object}
 */
export function createInitialSubjectProgress() {
  return {
    isCompleted: false,
    predictionChoiceId: null,
    interactiveCompleted: false,
    formativePassedFirstTry: false,
    retryChoiceId: null,
    retryAttempts: 0,
    exitScores: [0, 0],
    completedAt: null,
    earnedBadgeId: null
  };
}

/**
 * Creates the complete default application session state.
 * @returns {Object}
 */
export function createDefaultState() {
  return {
    currentSubject: null,
    currentStep: 's0_map',
    selectedLocale: 'en',
    activeSessionId: 'default_learner',
    audioMuted: false,
    progress: {
      physics: createInitialSubjectProgress(),
      math: createInitialSubjectProgress(),
      biology: createInitialSubjectProgress(),
      chemistry: createInitialSubjectProgress()
    }
  };
}

/**
 * Safe LocalStorage feature detection with fallback to in-memory mode.
 */
let isLocalStorageAvailable = false;
try {
  const testKey = '__pocketlab_storage_probe__';
  window.localStorage.setItem(testKey, '1');
  window.localStorage.removeItem(testKey);
  isLocalStorageAvailable = true;
} catch (e) {
  isLocalStorageAvailable = false;
  console.warn('[Gramin PocketLab Store] LocalStorage unavailable; running in volatile memory-only mode.');
}

/**
 * Reads and merges persisted state from LocalStorage.
 * Defensive validation ensures corrupted or partial JSON never crashes the app.
 * @returns {Object} Validated state object
 */
function loadPersistedState() {
  const base = createDefaultState();
  if (!isLocalStorageAvailable) return base;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return base;

    // Restore scalar properties if valid
    if (parsed.selectedLocale === 'en' || parsed.selectedLocale === 'kn') {
      base.selectedLocale = parsed.selectedLocale;
    }
    if (typeof parsed.audioMuted === 'boolean') {
      base.audioMuted = parsed.audioMuted;
    }
    if (typeof parsed.activeSessionId === 'string' && parsed.activeSessionId) {
      base.activeSessionId = parsed.activeSessionId;
    }

    // Restore per-subject progress
    if (parsed.progress && typeof parsed.progress === 'object') {
      SUBJECT_IDS.forEach((subject) => {
        const stored = parsed.progress[subject];
        if (stored && typeof stored === 'object') {
          base.progress[subject] = {
            isCompleted: Boolean(stored.isCompleted),
            predictionChoiceId: typeof stored.predictionChoiceId === 'string' ? stored.predictionChoiceId : null,
            interactiveCompleted: Boolean(stored.interactiveCompleted || stored.interactiveCompletedSuccessfully),
            formativePassedFirstTry: Boolean(stored.formativePassedFirstTry),
            retryChoiceId: typeof stored.retryChoiceId === 'string' ? stored.retryChoiceId : null,
            retryAttempts: typeof stored.retryAttempts === 'number' ? Math.max(0, stored.retryAttempts) : 0,
            exitScores: Array.isArray(stored.exitScores) && stored.exitScores.length === 2
              ? [Number(stored.exitScores[0]) || 0, Number(stored.exitScores[1]) || 0]
              : [0, 0],
            completedAt: typeof stored.completedAt === 'number' ? stored.completedAt : null,
            earnedBadgeId: typeof stored.earnedBadgeId === 'string' ? stored.earnedBadgeId : null
          };
        }
      });
    }

    return base;
  } catch (err) {
    console.warn('[Gramin PocketLab Store] LocalStorage parse failed, resetting to clean defaults:', err);
    return base;
  }
}

/**
 * Persists current session state to LocalStorage.
 * @param {Object} state
 */
function savePersistedState(state) {
  if (!isLocalStorageAvailable) return;

  try {
    const payload = {
      activeSessionId: state.activeSessionId,
      selectedLocale: state.selectedLocale,
      audioMuted: state.audioMuted,
      progress: state.progress,
      lastActiveTimestamp: Date.now()
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('[Gramin PocketLab Store] Failed to save state to LocalStorage:', err);
  }
}

/**
 * Global reactive state container instance.
 */
class StateStore {
  constructor() {
    this._state = loadPersistedState();
    this._listeners = new Set();
  }

  /**
   * Returns a deep clone / snapshot of the current state.
   * Prevents outside direct mutation of internal store structures.
   * @returns {Object}
   */
  getState() {
    return JSON.parse(JSON.stringify(this._state));
  }

  /**
   * Subscribes a listener to store changes.
   * @param {Function} listener Callback receiving `(stateSnapshot, action, payload)`
   * @returns {Function} Unsubscribe function
   */
  subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('[Gramin PocketLab Store] Subscriber must be a callable function');
    }
    this._listeners.add(listener);
    return () => {
      this._listeners.delete(listener);
    };
  }

  /**
   * Broadcasts the current state snapshot to all registered listeners.
   * @private
   */
  _notify(action, payload) {
    savePersistedState(this._state);
    const snapshot = this.getState();
    this._listeners.forEach((listener) => {
      try {
        listener(snapshot, action, payload);
      } catch (err) {
        console.error('[Gramin PocketLab Store] Error in listener callback:', err);
      }
    });
  }

  /**
   * Sets the current active STEM subject.
   * @param {'physics'|'math'|'biology'|'chemistry'|null} subjectId
   */
  setSubject(subjectId) {
    if (subjectId !== null && !SUBJECT_IDS.includes(subjectId)) {
      console.warn(`[Gramin PocketLab Store] Invalid subjectId rejected: "${subjectId}"`);
      return;
    }
    if (this._state.currentSubject === subjectId) return;

    this._state.currentSubject = subjectId;
    this._notify('SET_SUBJECT', subjectId);
  }

  /**
   * Sets the current mission step.
   * @param {'s0_map'|'s1_intro'|'s2_predict'|'s3_explore'|'s4_understand'|'s5_feedback_retry'|'s6_exit_result'} stepId
   */
  setStep(stepId) {
    if (!STEP_IDS.includes(stepId)) {
      console.warn(`[Gramin PocketLab Store] Invalid stepId rejected: "${stepId}"`);
      return;
    }
    if (this._state.currentStep === stepId) return;

    this._state.currentStep = stepId;
    this._notify('SET_STEP', stepId);
  }

  /**
   * Records the learner's initial hypothesis / prediction choice for the active subject.
   * @param {string} choiceId
   */
  recordPrediction(choiceId) {
    const subject = this._state.currentSubject;
    if (!subject || !this._state.progress[subject]) {
      console.warn('[Gramin PocketLab Store] Cannot record prediction without an active subject');
      return;
    }

    this._state.progress[subject].predictionChoiceId = String(choiceId);
    this._notify('RECORD_PREDICTION', { subject, choiceId });
  }

  /**
   * Marks whether the interactive lab exploration has been adequately observed / completed.
   * @param {boolean} [completed=true]
   */
  setInteractiveCompleted(completed = true) {
    const subject = this._state.currentSubject;
    if (!subject || !this._state.progress[subject]) {
      console.warn('[Gramin PocketLab Store] Cannot set interactive completion without an active subject');
      return;
    }

    this._state.progress[subject].interactiveCompleted = Boolean(completed);
    this._notify('SET_INTERACTIVE_COMPLETED', { subject, completed: Boolean(completed) });
  }

  /**
   * Records formative diagnostic question result on S5.
   * @param {boolean} isCorrect
   * @param {string} [choiceId]
   */
  recordFormativeResult(isCorrect, choiceId = null) {
    const subject = this._state.currentSubject;
    if (!subject || !this._state.progress[subject]) return;

    if (this._state.progress[subject].retryAttempts === 0) {
      this._state.progress[subject].formativePassedFirstTry = Boolean(isCorrect);
    }
    this._notify('RECORD_FORMATIVE_RESULT', { subject, isCorrect, choiceId });
  }

  /**
   * Records retry question selection on S5.
   * @param {string} choiceId
   */
  recordRetryChoice(choiceId) {
    const subject = this._state.currentSubject;
    if (!subject || !this._state.progress[subject]) return;

    this._state.progress[subject].retryChoiceId = String(choiceId);
    this._state.progress[subject].retryAttempts += 1;
    this._notify('RECORD_RETRY_CHOICE', { subject, choiceId });
  }

  /**
   * Records an exit check question score on S6 (0 or 1).
   * Automatically marks the mission as completed once both questions are recorded.
   * @param {0|1} qIndex Question index (0 or 1)
   * @param {0|1} score Score (0 or 1)
   */
  recordExitScore(qIndex, score) {
    const subject = this._state.currentSubject;
    if (!subject || !this._state.progress[subject]) {
      console.warn('[Gramin PocketLab Store] Cannot record exit score without an active subject');
      return;
    }

    const idx = qIndex === 1 ? 1 : 0;
    const sanitizedScore = Number(score) === 1 ? 1 : 0;
    this._state.progress[subject].exitScores[idx] = sanitizedScore;

    // Mark completion and award badge
    this._state.progress[subject].isCompleted = true;
    this._state.progress[subject].completedAt = Date.now();
    this._state.progress[subject].earnedBadgeId = `badge_${subject}_mastery`;

    this._notify('RECORD_EXIT_SCORE', {
      subject,
      qIndex: idx,
      score: sanitizedScore,
      totalExitScore: this._state.progress[subject].exitScores[0] + this._state.progress[subject].exitScores[1]
    });
  }

  /**
   * Toggles global audio mute state.
   */
  toggleMute() {
    this._state.audioMuted = !this._state.audioMuted;
    this._notify('TOGGLE_MUTE', this._state.audioMuted);
  }

  /**
   * Sets global audio mute state explicitly.
   * @param {boolean} muted
   */
  setMuted(muted) {
    this._state.audioMuted = Boolean(muted);
    this._notify('SET_MUTED', this._state.audioMuted);
  }

  /**
   * Toggles between English ('en') and Kannada ('kn').
   */
  toggleLocale() {
    this._state.selectedLocale = this._state.selectedLocale === 'en' ? 'kn' : 'en';
    this._notify('TOGGLE_LOCALE', this._state.selectedLocale);
  }

  /**
   * Sets the active locale explicitly.
   * @param {'en'|'kn'} locale
   */
  setLocale(locale) {
    if (locale !== 'en' && locale !== 'kn') return;
    if (this._state.selectedLocale === locale) return;

    this._state.selectedLocale = locale;
    this._notify('SET_LOCALE', locale);
  }

  /**
   * Resets progress for a specific STEM subject.
   * @param {'physics'|'math'|'biology'|'chemistry'} subjectId
   */
  resetSubjectProgress(subjectId) {
    if (!SUBJECT_IDS.includes(subjectId)) return;

    this._state.progress[subjectId] = createInitialSubjectProgress();
    this._notify('RESET_SUBJECT_PROGRESS', subjectId);
  }

  /**
   * Resets only the interactive lab state for a specific subject (re-enables S3 observation)
   * without wiping previously earned badges or completion status.
   * @param {'physics'|'math'|'biology'|'chemistry'} subjectId
   */
  resetSubjectLab(subjectId) {
    if (!SUBJECT_IDS.includes(subjectId)) return;

    if (this._state.progress[subjectId]) {
      this._state.progress[subjectId].interactiveCompleted = false;
    }
    this._notify('RESET_SUBJECT_LAB', subjectId);
  }

  /**
   * Resets all progress across all 4 subjects and clears persisted LocalStorage.
   */
  resetAllProgress() {
    this._state = createDefaultState();
    if (isLocalStorageAvailable) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        console.warn('[Gramin PocketLab Store] Failed to clear LocalStorage:', err);
      }
    }
    this._notify('RESET_ALL_PROGRESS', null);
  }

  /**
   * Checks whether a target step is currently accessible based on prerequisite validation.
   * @param {string} subjectId
   * @param {string} stepId
   * @returns {boolean}
   */
  isStepAccessible(subjectId, stepId) {
    if (stepId === 's0_map') return true;
    if (!subjectId || !SUBJECT_IDS.includes(subjectId)) return false;
    if (stepId === 's1_intro' || stepId === 's2_predict') return true;

    const prog = this._state.progress[subjectId];
    if (!prog) return false;

    // S3 requires prediction choice on S2
    if (stepId === 's3_explore') {
      return Boolean(prog.predictionChoiceId);
    }

    // S4, S5, S6 require interactive exploration completed on S3
    if (stepId === 's4_understand' || stepId === 's5_feedback_retry' || stepId === 's6_exit_result') {
      return Boolean(prog.predictionChoiceId) && Boolean(prog.interactiveCompleted);
    }

    return false;
  }
}

/**
 * Singleton instance export of the central StateStore.
 */
export const store = new StateStore();
