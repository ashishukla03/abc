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
  const defaultProgress = {
    physics: createInitialSubjectProgress(),
    math: createInitialSubjectProgress(),
    biology: createInitialSubjectProgress(),
    chemistry: createInitialSubjectProgress()
  };

  const defaultStudyHub = {
    timetable: [
      { period: 1, time: '09:00 - 09:45', subject: 'Mathematics', topic: 'Ratio & Proportional Water Sharing', room: 'Room 7B', teacher: 'Mrs. Rao', active: false },
      { period: 2, time: '09:50 - 10:35', subject: 'Science (Physics)', topic: 'Sound Wave Oscilloscope & Pitch', room: 'Science Lab', teacher: 'Mr. Patel', active: true },
      { period: 3, time: '10:50 - 11:35', subject: 'Science (Chemistry)', topic: 'pH Color Lab & Indicators', room: 'Chemistry Lab', teacher: 'Dr. Sharma', active: false },
      { period: 4, time: '11:40 - 12:25', subject: 'Social Science', topic: 'Indus Valley Urban Drainage', room: 'Room 7B', teacher: 'Mr. Kumar', active: false },
      { period: 5, time: '01:15 - 02:00', subject: 'Computing', topic: 'Solar Rover Algorithm Sequence', room: 'ICT Room', teacher: 'Ms. Anitha', active: false },
      { period: 6, time: '02:05 - 02:50', subject: 'Kannada / Language', topic: 'Basavanna Vachana Decipherer', room: 'Room 7B', teacher: 'Mr. Gowda', active: false }
    ],
    examCountdowns: [
      { id: 'exam-sci-t1', title: 'Term 1 Science Summative', daysLeft: 14, date: '01 Dec 2026', syllabus: 'Sound, Acids & Bases, Ecosystems', urgency: 'high' },
      { id: 'exam-mth-mid', title: 'CBSE Mathematics Mid-Term', daysLeft: 21, date: '08 Dec 2026', syllabus: 'Ratio & Proportion, Fractions, Geometry', urgency: 'medium' },
      { id: 'exam-talent-nstse', title: 'National Science Talent Search (NSTSE)', daysLeft: 45, date: '02 Jan 2027', syllabus: 'Class 6–8 Integrated Science & Tech', urgency: 'normal' }
    ],
    syllabusChecklist: [
      { id: 'ncert-math-ch12', subject: 'Mathematics', chapter: 'Class 6 Ch 12: Ratio & Proportion', completed: true },
      { id: 'ncert-phys-ch13', subject: 'Physics', chapter: 'Class 8 Ch 13: Sound Frequency & Pitch', completed: true },
      { id: 'ncert-chem-ch5', subject: 'Chemistry', chapter: 'Class 7 Ch 5: Acids, Bases and Salts', completed: true },
      { id: 'ncert-bio-ch10', subject: 'Biology', chapter: 'Class 7 Ch 10: Food Webs & Ecosystems', completed: false },
      { id: 'ncert-csc-ch4', subject: 'Computing', chapter: 'Class 8 Ch 4: Sequence Loops & Rover Logic', completed: false },
      { id: 'ncert-mth-ch5', subject: 'Mathematics', chapter: 'Class 5 Ch 4: Equivalent Fractions', completed: true },
      { id: 'ncert-phys-ch10', subject: 'Physics', chapter: 'Class 10 Ch 10: Ray Optics & Refraction', completed: false },
      { id: 'ncert-mth-ch12-calc', subject: 'Mathematics', chapter: 'Class 12 Ch 8: Applications of Integrals', completed: false }
    ],
    recommendationWeights: {
      examImportance: 0.40,
      misconceptionCount: 0.30,
      retentionGapDays: 0.20,
      curriculumSequence: 0.10
    }
  };

  const defaultProfile = {
    id: 'profile-aarav',
    name: 'Aarav Sharma',
    school: 'Zilla Parishad High School, Ballari',
    country: 'India',
    state: 'Karnataka',
    board: 'CBSE',
    classLevel: 7,
    academicSession: '2026-2027',
    medium: 'English',
    section: 'B',
    stream: 'General',
    enrolledSubjects: ['physics', 'chemistry', 'biology', 'math'],
    avatar: '👨‍🎓',
    guardianConsent: { granted: true, timestamp: 1731600000000, relationship: 'parent_guardian' },
    hasCompletedOnboarding: true,
    streakDays: 7,
    xp: 450,
    level: 3,
    badges: ['badge-phys-dhwani', 'badge-math-bhaga'],
    radarScores: {
      math: 85,
      physics: 90,
      chemistry: 75,
      biology: 80,
      social: 70,
      computing: 85
    },
    activityLog: [
      { id: 'act-1', timestamp: Date.now() - 3600000, type: 'test', title: 'CBSE Class 7 Science Diagnostic', score: 85, maxScore: 100, topic: 'Sound & Pitch' },
      { id: 'act-2', timestamp: Date.now() - 7200000, type: 'lab', title: 'Interactive Frequency Lab', score: 100, maxScore: 100, topic: 'Acoustics' }
    ],
    topicMastery: {
      't4-1': { status: 'mastered', score: 90, lastAttempt: Date.now() - 86400000 },
      't4-2': { status: 'in_progress', score: 60, lastAttempt: Date.now() - 43200000 },
      't13-1': { status: 'mastered', score: 95, lastAttempt: Date.now() - 20000000 }
    }
  };

  return {
    currentSubject: null,
    currentStep: 's0_map',
    selectedLocale: 'en',
    activeSessionId: 'default_learner',
    audioMuted: false,
    gradeBand: 'middle',
    selectedClass: 7,
    selectedBoard: 'CBSE',
    activeTab: 'missions',
    activeProfileId: 'profile-aarav',
    profiles: [
      {
        id: 'profile-aarav',
        learnerProfile: defaultProfile,
        studyHub: defaultStudyHub,
        progress: defaultProgress,
        gradeBand: 'middle',
        selectedClass: 7,
        selectedBoard: 'CBSE'
      }
    ],
    learnerProfile: defaultProfile,
    studyHub: defaultStudyHub,
    progress: defaultProgress
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
    if (parsed.gradeBand) base.gradeBand = parsed.gradeBand;
    if (parsed.selectedClass) base.selectedClass = parsed.selectedClass;
    if (parsed.selectedBoard) base.selectedBoard = parsed.selectedBoard;
    if (parsed.activeTab) base.activeTab = parsed.activeTab;
    if (parsed.learnerProfile && typeof parsed.learnerProfile === 'object') {
      base.learnerProfile = { ...base.learnerProfile, ...parsed.learnerProfile };
    }
    if (parsed.studyHub && typeof parsed.studyHub === 'object') {
      base.studyHub = { ...base.studyHub, ...parsed.studyHub };
    }

    if (parsed.activeProfileId) base.activeProfileId = parsed.activeProfileId;
    if (Array.isArray(parsed.profiles) && parsed.profiles.length > 0) {
      base.profiles = parsed.profiles;
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
    // Keep active profile synced in profiles collection
    if (Array.isArray(state.profiles)) {
      const idx = state.profiles.findIndex((p) => p.id === state.activeProfileId);
      if (idx !== -1) {
        state.profiles[idx] = {
          id: state.activeProfileId,
          learnerProfile: state.learnerProfile,
          studyHub: state.studyHub,
          progress: state.progress,
          gradeBand: state.gradeBand,
          selectedClass: state.selectedClass,
          selectedBoard: state.selectedBoard
        };
      }
    }

    const payload = {
      activeSessionId: state.activeSessionId,
      selectedLocale: state.selectedLocale,
      audioMuted: state.audioMuted,
      gradeBand: state.gradeBand,
      selectedClass: state.selectedClass,
      selectedBoard: state.selectedBoard,
      activeTab: state.activeTab,
      activeProfileId: state.activeProfileId,
      profiles: state.profiles,
      learnerProfile: state.learnerProfile,
      studyHub: state.studyHub,
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

  setGradeBand(band) {
    if (!['preparatory', 'middle', 'secondary', 'senior'].includes(band)) return;
    this._state.gradeBand = band;
    this._notify('SET_GRADE_BAND', band);
  }

  setClass(classNum) {
    const num = Number(classNum);
    if (num < 5 || num > 12) return;
    this._state.selectedClass = num;
    this._notify('SET_CLASS', num);
  }

  setBoard(board) {
    this._state.selectedBoard = String(board);
    this._notify('SET_BOARD', board);
  }

  setActiveTab(tab) {
    const validTabs = ['missions', 'hub', 'profile', 'onboarding', 'browser', 'mock-test', 'tutor', 'profiles'];
    if (!validTabs.includes(tab)) return;
    this._state.activeTab = tab;
    this._notify('SET_ACTIVE_TAB', tab);
  }

  toggleSyllabusItem(id) {
    const item = this._state.studyHub.syllabusChecklist.find((s) => s.id === id);
    if (item) {
      item.completed = !item.completed;
      this._notify('TOGGLE_SYLLABUS', { id, completed: item.completed });
    }
  }

  addXP(amount) {
    const num = Number(amount) || 0;
    this._state.learnerProfile.xp += num;
    const newLevel = Math.floor(this._state.learnerProfile.xp / 200) + 1;
    this._state.learnerProfile.level = newLevel;
    this._notify('ADD_XP', { xp: this._state.learnerProfile.xp, level: newLevel });
  }

  updateLearnerProfile(updates) {
    if (!updates || typeof updates !== 'object') return;
    this._state.learnerProfile = { ...this._state.learnerProfile, ...updates };
    this._notify('UPDATE_PROFILE', this._state.learnerProfile);
  }

  addTimetablePeriod(periodObj) {
    if (!periodObj || !periodObj.subject) return;
    const newPeriod = {
      period: (this._state.studyHub.timetable.length + 1),
      time: periodObj.time || '10:00 - 10:45',
      subject: String(periodObj.subject),
      topic: String(periodObj.topic || 'General Lesson'),
      room: String(periodObj.room || 'Classroom'),
      teacher: String(periodObj.teacher || 'Teacher'),
      active: false
    };
    this._state.studyHub.timetable.push(newPeriod);
    this._notify('ADD_TIMETABLE_PERIOD', newPeriod);
  }

  deleteTimetablePeriod(index) {
    if (index >= 0 && index < this._state.studyHub.timetable.length) {
      this._state.studyHub.timetable.splice(index, 1);
      this._state.studyHub.timetable.forEach((p, idx) => { p.period = idx + 1; });
      this._notify('DELETE_TIMETABLE_PERIOD', index);
    }
  }

  addExamCountdown(examObj) {
    if (!examObj || !examObj.title) return;
    const days = Number(examObj.daysLeft) >= 0 ? Number(examObj.daysLeft) : 7;
    const newExam = {
      id: `exam-${Date.now()}`,
      title: String(examObj.title),
      daysLeft: days,
      date: String(examObj.date || 'Upcoming'),
      syllabus: String(examObj.syllabus || 'All chapters'),
      urgency: days <= 7 ? 'high' : (days <= 15 ? 'medium' : 'normal')
    };
    this._state.studyHub.examCountdowns.push(newExam);
    this._notify('ADD_EXAM_COUNTDOWN', newExam);
  }

  deleteExamCountdown(examId) {
    this._state.studyHub.examCountdowns = this._state.studyHub.examCountdowns.filter((e) => e.id !== examId);
    this._notify('DELETE_EXAM_COUNTDOWN', examId);
  }

  addSyllabusChapter(chapterObj) {
    if (!chapterObj || !chapterObj.chapter) return;
    const newChapter = {
      id: `custom-ch-${Date.now()}`,
      subject: String(chapterObj.subject || 'General Science'),
      chapter: String(chapterObj.chapter),
      completed: Boolean(chapterObj.completed)
    };
    this._state.studyHub.syllabusChecklist.push(newChapter);
    this._notify('ADD_SYLLABUS_CHAPTER', newChapter);
  }

  deleteSyllabusChapter(chapterId) {
    this._state.studyHub.syllabusChecklist = this._state.studyHub.syllabusChecklist.filter((c) => c.id !== chapterId);
    this._notify('DELETE_SYLLABUS_CHAPTER', chapterId);
  }

  updateSchoolInfo({ schoolName, board, classLevel, section }) {
    if (schoolName) this._state.learnerProfile.school = String(schoolName);
    if (board) {
      this._state.learnerProfile.board = String(board);
      this._state.selectedBoard = String(board);
    }
    if (classLevel) {
      const num = Number(classLevel);
      this._state.learnerProfile.classLevel = num;
      this._state.selectedClass = num;
      if (num === 5) this._state.gradeBand = 'preparatory';
      else if (num <= 8) this._state.gradeBand = 'middle';
      else if (num <= 10) this._state.gradeBand = 'secondary';
      else this._state.gradeBand = 'senior';
    }
    if (section) this._state.learnerProfile.section = String(section);
    this._notify('UPDATE_SCHOOL_INFO', this._state.learnerProfile);
  }

  createProfile(profileData) {
    if (!profileData || !profileData.name) return null;
    const newId = `profile-${Date.now()}`;
    const newProfile = {
      id: newId,
      name: String(profileData.name),
      school: String(profileData.school || ''),
      country: 'India',
      state: String(profileData.state || 'Karnataka'),
      board: String(profileData.board || 'CBSE'),
      classLevel: Number(profileData.classLevel) || 7,
      academicSession: '2026-2027',
      medium: String(profileData.medium || 'English'),
      section: String(profileData.section || 'A'),
      stream: Number(profileData.classLevel) >= 11 ? String(profileData.stream || 'Science') : 'General',
      enrolledSubjects: Array.isArray(profileData.enrolledSubjects) ? profileData.enrolledSubjects : ['physics', 'chemistry', 'biology', 'math'],
      avatar: String(profileData.avatar || '👨‍🎓'),
      guardianConsent: {
        granted: Boolean(profileData.guardianConsentGranted),
        timestamp: Date.now(),
        relationship: 'parent_guardian'
      },
      streakDays: 1,
      xp: 50,
      level: 1,
      badges: [],
      radarScores: { math: 60, physics: 60, chemistry: 60, biology: 60, social: 60, computing: 60 }
    };

    const emptyProgress = {
      physics: createInitialSubjectProgress(),
      math: createInitialSubjectProgress(),
      biology: createInitialSubjectProgress(),
      chemistry: createInitialSubjectProgress()
    };

    const emptyStudyHub = {
      timetable: [],
      examCountdowns: [],
      syllabusChecklist: [],
      recommendationWeights: { examImportance: 0.4, misconceptionCount: 0.3, retentionGapDays: 0.2, curriculumSequence: 0.1 }
    };

    const band = newProfile.classLevel === 5 ? 'preparatory' : (newProfile.classLevel <= 8 ? 'middle' : (newProfile.classLevel <= 10 ? 'secondary' : 'senior'));

    const profileRecord = {
      id: newId,
      learnerProfile: newProfile,
      studyHub: emptyStudyHub,
      progress: emptyProgress,
      gradeBand: band,
      selectedClass: newProfile.classLevel,
      selectedBoard: newProfile.board
    };

    if (!Array.isArray(this._state.profiles)) {
      this._state.profiles = [];
    }
    this._state.profiles.push(profileRecord);
    this.switchProfile(newId);
    return newId;
  }

  switchProfile(profileId) {
    if (!profileId || !Array.isArray(this._state.profiles)) return;
    const target = this._state.profiles.find((p) => p.id === profileId);
    if (!target) return;

    this._state.activeProfileId = target.id;
    this._state.learnerProfile = { ...target.learnerProfile };
    this._state.studyHub = { ...target.studyHub };
    this._state.progress = { ...target.progress };
    this._state.gradeBand = target.gradeBand || 'middle';
    this._state.selectedClass = target.selectedClass || 7;
    this._state.selectedBoard = target.selectedBoard || 'CBSE';

    this._notify('SWITCH_PROFILE', target);
  }

  deleteProfile(profileId) {
    if (!Array.isArray(this._state.profiles) || this._state.profiles.length <= 1) {
      console.warn('[Gramin PocketLab Store] Cannot delete the only profile.');
      return;
    }
    this._state.profiles = this._state.profiles.filter((p) => p.id !== profileId);
    if (this._state.activeProfileId === profileId) {
      this.switchProfile(this._state.profiles[0].id);
    } else {
      this._notify('DELETE_PROFILE', profileId);
    }
  }

  grantGuardianConsent(profileId) {
    const prof = (this._state.profiles || []).find((p) => p.id === profileId);
    if (prof) {
      prof.learnerProfile.guardianConsent = {
        granted: true,
        timestamp: Date.now(),
        relationship: 'parent_guardian'
      };
      if (this._state.activeProfileId === profileId) {
        this._state.learnerProfile.guardianConsent = prof.learnerProfile.guardianConsent;
      }
      this._notify('GRANT_GUARDIAN_CONSENT', { profileId, consent: prof.learnerProfile.guardianConsent });
    }
  }

  setEnrolledSubjects(subjectIds) {
    if (!Array.isArray(subjectIds)) return;
    this._state.learnerProfile.enrolledSubjects = subjectIds;
    this._notify('SET_ENROLLED_SUBJECTS', subjectIds);
  }

  getProfiles() {
    return (this._state.profiles || []).map((p) => ({
      id: p.id,
      name: p.learnerProfile?.name || 'Scholar',
      avatar: p.learnerProfile?.avatar || '👨‍🎓',
      board: p.learnerProfile?.board || 'CBSE',
      classLevel: p.learnerProfile?.classLevel || 7,
      isActive: p.id === this._state.activeProfileId
    }));
  }

  recordActivity(activity) {
    if (!activity || !activity.title) return;
    const act = {
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: Date.now(),
      type: activity.type || 'study',
      title: String(activity.title),
      subject: activity.subject || 'science',
      score: Number(activity.score) || 0,
      maxScore: Number(activity.maxScore) || 100,
      topic: activity.topic || ''
    };
    if (!Array.isArray(this._state.learnerProfile.activityLog)) {
      this._state.learnerProfile.activityLog = [];
    }
    this._state.learnerProfile.activityLog.unshift(act);
    if (this._state.learnerProfile.activityLog.length > 50) {
      this._state.learnerProfile.activityLog.length = 50;
    }
    this._notify('RECORD_ACTIVITY', act);
  }

  recordTopicMastery(topicId, status = 'mastered', score = 100) {
    if (!topicId) return;
    if (!this._state.learnerProfile.topicMastery) {
      this._state.learnerProfile.topicMastery = {};
    }
    this._state.learnerProfile.topicMastery[topicId] = {
      status,
      score: Number(score) || 100,
      lastAttempt: Date.now()
    };
    this.addXP(25);
    this._notify('RECORD_TOPIC_MASTERY', { topicId, status, score });
  }

  completeOnboarding(data) {
    if (!data || typeof data !== 'object') return;
    this.updateSchoolInfo({
      schoolName: data.schoolName,
      board: data.board,
      classLevel: data.classLevel,
      section: data.section || 'A'
    });
    if (data.name) this._state.learnerProfile.name = String(data.name);
    if (data.avatar) this._state.learnerProfile.avatar = String(data.avatar);
    if (data.state) this._state.learnerProfile.state = String(data.state);
    if (data.medium) this._state.learnerProfile.medium = String(data.medium);
    if (Array.isArray(data.enrolledSubjects)) {
      this.setEnrolledSubjects(data.enrolledSubjects);
    }
    if (data.upcomingExam && data.upcomingExam.title) {
      this.addExamCountdown(data.upcomingExam);
    }
    this._state.learnerProfile.hasCompletedOnboarding = true;
    this._state.learnerProfile.guardianConsent = {
      granted: true,
      timestamp: Date.now(),
      relationship: 'parent_guardian'
    };
    this.addXP(100);
    this.recordActivity({
      type: 'onboarding',
      title: 'Completed Student Onboarding & School Profile Setup',
      score: 100,
      maxScore: 100,
      topic: 'Account Setup'
    });
    this._notify('COMPLETE_ONBOARDING', this._state.learnerProfile);
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
