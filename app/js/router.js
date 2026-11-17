/**
 * Gramin PocketLab — Client Hash Router & Navigation Guards
 * File: app/js/router.js
 * Architecture Contract: learning_flow/SHARED_LEARNING_FLOW_SPEC.md
 * Conformance: Hash-based SPA routing with browser history & step progression guards
 */

import { store, SUBJECT_IDS, STEP_IDS } from './store.js';

class ClientRouter {
  constructor() {
    this._isSyncing = false;
    this._handleHashChange = this._handleHashChange.bind(this);
    this._handleStoreChange = this._handleStoreChange.bind(this);
  }

  /**
   * Initializes the router, attaches window hash event listeners,
   * subscribes to store synchronization, and resolves the initial route.
   */
  init() {
    window.addEventListener('hashchange', this._handleHashChange);
    store.subscribe(this._handleStoreChange);

    // Resolve initial URL route on page load
    this._handleHashChange();
  }

  /**
   * Cleans up event listeners when needed.
   */
  destroy() {
    window.removeEventListener('hashchange', this._handleHashChange);
  }

  /**
   * Parses the current window.location.hash into subject and step tokens.
   * Supports:
   *   "" | "#" | "#/" | "#/map" -> { subject: null, step: 's0_map' }
   *   "#/physics" | "#physics" -> { subject: 'physics', step: 's1_intro' }
   *   "#/physics/s3_explore" | "#physics/s3_explore" -> { subject: 'physics', step: 's3_explore' }
   * @returns {{ subject: string|null, step: string }}
   */
  parseHash() {
    let raw = window.location.hash || '';
    if (raw.startsWith('#')) raw = raw.slice(1);
    if (raw.startsWith('/')) raw = raw.slice(1);
    if (raw.endsWith('/')) raw = raw.slice(0, -1);

    const parts = raw.split('/').map((s) => s.trim().toLowerCase()).filter(Boolean);

    if (parts.length === 0 || parts[0] === 'map') {
      return { subject: null, step: 's0_map' };
    }

    if (parts[0] === 'hub') {
      if (typeof store.setActiveTab === 'function') store.setActiveTab('hub');
      return { subject: null, step: 's0_map' };
    }

    if (parts[0] === 'profile') {
      if (typeof store.setActiveTab === 'function') store.setActiveTab('profile');
      return { subject: null, step: 's0_map' };
    }

    const candidateSubject = parts[0];
    if (!SUBJECT_IDS.includes(candidateSubject)) {
      return { subject: null, step: 's0_map' };
    }

    if (parts.length === 1) {
      return { subject: candidateSubject, step: 's1_intro' };
    }

    const candidateStep = parts[1];
    if (STEP_IDS.includes(candidateStep)) {
      return { subject: candidateSubject, step: candidateStep };
    }

    // Default to s1_intro if step is unknown
    return { subject: candidateSubject, step: 's1_intro' };
  }

  /**
   * Formats a canonical URL hash string from subject and step.
   * @param {string|null} subject
   * @param {string} step
   * @returns {string}
   */
  formatHash(subject, step) {
    if (!subject || step === 's0_map') {
      return '#/map';
    }
    return `#/${subject}/${step}`;
  }

  /**
   * Validates whether navigation to the given target is permitted under
   * pedagogical progression invariants. If blocked, returns the fallback step.
   *
   * Invariants:
   * 1. Cannot enter S3 (explore) without a prediction recorded on S2.
   * 2. Cannot enter S4, S5, or S6 without completing the S3 lab interaction.
   *
   * @param {string|null} subject
   * @param {string} step
   * @returns {{ allowed: boolean, redirectSubject: string|null, redirectStep: string }}
   */
  validateNavigation(subject, step) {
    if (!subject || step === 's0_map') {
      return { allowed: true, redirectSubject: null, redirectStep: 's0_map' };
    }

    if (!SUBJECT_IDS.includes(subject)) {
      return { allowed: false, redirectSubject: null, redirectStep: 's0_map' };
    }

    const state = store.getState();
    const progress = state.progress[subject];

    if (step === 's1_intro' || step === 's2_predict') {
      return { allowed: true, redirectSubject: subject, redirectStep: step };
    }

    // Guard: Must have prediction before S3
    if (!progress.predictionChoiceId) {
      console.warn(`[Gramin PocketLab Router] Guard blocked skipping to "${step}" before S2 prediction.`);
      return { allowed: false, redirectSubject: subject, redirectStep: 's2_predict' };
    }

    if (step === 's3_explore') {
      return { allowed: true, redirectSubject: subject, redirectStep: 's3_explore' };
    }

    // Guard: Must have completed interactive exploration before S4, S5, S6
    if (!progress.interactiveCompleted) {
      console.warn(`[Gramin PocketLab Router] Guard blocked skipping to "${step}" before S3 lab completion.`);
      return { allowed: false, redirectSubject: subject, redirectStep: 's3_explore' };
    }

    return { allowed: true, redirectSubject: subject, redirectStep: step };
  }

  /**
   * Handles hashchange events: validates route, applies guards, updates store.
   * @private
   */
  _handleHashChange() {
    if (this._isSyncing) return;

    const parsed = this.parseHash();
    const validation = this.validateNavigation(parsed.subject, parsed.step);

    if (!validation.allowed) {
      // Guard redirected — update hash to valid target
      this._isSyncing = true;
      window.location.hash = this.formatHash(validation.redirectSubject, validation.redirectStep);
      this._isSyncing = false;

      store.setSubject(validation.redirectSubject);
      store.setStep(validation.redirectStep);
      return;
    }

    this._isSyncing = true;
    store.setSubject(parsed.subject);
    store.setStep(parsed.step);
    this._isSyncing = false;
  }

  /**
   * Synchronizes window hash when store state changes programmatically.
   * @private
   */
  _handleStoreChange(state, action) {
    if (this._isSyncing) return;

    // React to subject or step modifications
    if (action === 'SET_SUBJECT' || action === 'SET_STEP' || action === 'RESET_ALL_PROGRESS') {
      const targetHash = this.formatHash(state.currentSubject, state.currentStep);
      if (window.location.hash !== targetHash) {
        this._isSyncing = true;
        window.location.hash = targetHash;
        this._isSyncing = false;
      }
    }
  }

  /**
   * Programmatically navigates to a subject and step.
   * @param {string|null} subject
   * @param {string} step
   * @param {Object} [options]
   * @param {boolean} [options.replace=false] Whether to replace current history entry
   */
  navigate(subject, step, { replace = false } = {}) {
    const validation = this.validateNavigation(subject, step);
    const targetSubject = validation.allowed ? subject : validation.redirectSubject;
    const targetStep = validation.allowed ? step : validation.redirectStep;
    const targetHash = this.formatHash(targetSubject, targetStep);

    if (replace && window.location.replace) {
      const urlWithoutHash = window.location.href.split('#')[0];
      window.location.replace(`${urlWithoutHash}${targetHash}`);
    } else {
      window.location.hash = targetHash;
    }
  }

  /**
   * Navigates to the Mission Map (S0).
   */
  goToMap() {
    if (typeof store.setActiveTab === 'function') store.setActiveTab('missions');
    this.navigate(null, 's0_map');
  }

  /**
   * Navigates to the School & Study Hub.
   */
  goToHub() {
    if (typeof store.setActiveTab === 'function') store.setActiveTab('hub');
    this.navigate(null, 's0_map');
  }

  /**
   * Navigates to the Learner Profile & Model.
   */
  goToProfile() {
    if (typeof store.setActiveTab === 'function') store.setActiveTab('profile');
    this.navigate(null, 's0_map');
  }

  /**
   * Navigates to the introductory step (S1) of a chosen subject.
   * @param {'physics'|'math'|'biology'|'chemistry'} subjectId
   */
  goToSubject(subjectId) {
    if (!SUBJECT_IDS.includes(subjectId)) {
      this.goToMap();
      return;
    }
    this.navigate(subjectId, 's1_intro');
  }

  /**
   * Advances to the next step in the canonical 7-step sequence.
   * If on S6, returns to the Mission Map (S0).
   */
  nextStep() {
    const { currentSubject, currentStep } = store.getState();
    if (!currentSubject || currentStep === 's0_map') {
      return;
    }

    const currentIndex = STEP_IDS.indexOf(currentStep);
    if (currentIndex === -1 || currentIndex === STEP_IDS.length - 1) {
      // Completed S6 -> return to S0 Mission Map
      this.goToMap();
      return;
    }

    const nextStepId = STEP_IDS[currentIndex + 1];
    this.navigate(currentSubject, nextStepId);
  }

  /**
   * Steps back to the previous step in the sequence.
   * If on S1, returns to the Mission Map (S0).
   */
  prevStep() {
    const { currentSubject, currentStep } = store.getState();
    if (!currentSubject || currentStep === 's0_map') {
      return;
    }

    const currentIndex = STEP_IDS.indexOf(currentStep);
    if (currentIndex <= 1) {
      // S1 or invalid -> return to S0 Mission Map
      this.goToMap();
      return;
    }

    const prevStepId = STEP_IDS[currentIndex - 1];
    this.navigate(currentSubject, prevStepId);
  }
}

/**
 * Singleton client router instance export.
 */
export const router = new ClientRouter();
