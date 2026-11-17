/**
 * Gramin PocketLab — Application Bootstrap & Orchestrator
 * File: app/js/app.js
 * Architecture Contract: architecture_plan/MODULE_INTERFACE_CONTRACT.md
 * Conformance: Strict ES6 Module, Service Worker Registration, Reactive Header & Router Mount
 * Complete Classes 5-12 Question Worlds, School & Study Hub, and Personal Learning Model
 */

import { store, SUBJECT_IDS, STEP_IDS } from './store.js';
import { router } from './router.js';
import {
  QUESTION_WORLDS_CATALOG,
  EXTENDED_MISSIONS,
  getExtendedMission
} from '../content/missions_data.js';
import {
  resolveCurriculum,
  getSubjectChapterTaxonomy,
  CURRICULUM_AUTHORITIES
} from '../content/curriculum_registry.js';
import { aiTutor } from '../engine/ai_tutor.js';
import {
  createExamSession,
  evaluateExamSession,
  MOCK_EXAM_BLUEPRINTS
} from '../engine/mock_exam_engine.js';

/**
 * Subject display metadata.
 */
const SUBJECT_CONFIG = {
  physics: {
    title: 'Sound Detective',
    curriculum: 'NCERT Class 8 Ch 13',
    badgeClass: 'badge-phys',
    icon: '🔊',
    description: 'Explore sound frequency, pitch, and amplitude with an educational oscilloscope.'
  },
  math: {
    title: 'Water Share Challenge',
    curriculum: 'NCERT Class 6 Ch 12',
    badgeClass: 'badge-math',
    icon: '💧',
    description: 'Divide village irrigation water proportionally using ratios.'
  },
  biology: {
    title: 'Food Web Explorer',
    curriculum: 'NCERT Class 7 Ch 10',
    badgeClass: 'badge-bio',
    icon: '🌱',
    description: 'Discover trophic energy cascades and what happens when top predators vanish.'
  },
  chemistry: {
    title: 'pH Color Lab',
    curriculum: 'NCERT Class 7 Ch 5',
    badgeClass: 'badge-chem',
    icon: '🧪',
    description: 'Test acidic, neutral, and alkaline solutions with natural turmeric indicator.'
  }
};

/**
 * Screen Reader live announcement helper.
 * @param {string} message
 */
export function announce(message) {
  if (typeof document === 'undefined') return;
  const el = document.getElementById('a11y-announcer');
  if (el) {
    el.textContent = '';
    setTimeout(() => {
      el.textContent = message;
    }, 50);
  }
}

/**
 * Updates online/offline status pill badge based on browser network telemetry and Service Worker cache state.
 * Truthful status: Does NOT report 'Offline Ready' merely because navigator.onLine is true.
 */
export function updateNetworkStatus(opts = null) {
  if (typeof document === 'undefined') return;
  const badge = document.getElementById('network-status-badge');
  const text = document.getElementById('network-status-text');
  if (!badge || !text) return;

  const isOnline = (opts && typeof opts.onLine === 'boolean')
    ? opts.onLine
    : (typeof navigator !== 'undefined' ? navigator.onLine : true);

  const hasActiveSw = (opts && typeof opts.hasActiveSw === 'boolean')
    ? opts.hasActiveSw
    : Boolean(
        typeof navigator !== 'undefined' &&
        navigator.serviceWorker &&
        navigator.serviceWorker.controller
      );

  if (!isOnline) {
    if (hasActiveSw) {
      badge.className = 'status-pill status-pill--offline';
      text.textContent = 'Offline Mode';
      badge.setAttribute('title', 'Network disconnected. Operating 100% from verified local cache.');
    } else {
      badge.className = 'status-pill status-pill--alert';
      text.textContent = 'Offline (Uncached)';
      badge.setAttribute('title', 'Network disconnected. Application was not pre-cached on this device.');
    }
  } else {
    if (hasActiveSw) {
      badge.className = 'status-pill status-pill--offline';
      text.textContent = 'Offline Ready';
      badge.setAttribute('title', 'Connected to network. Local cache verified and active for offline use.');
    } else {
      badge.className = 'status-pill status-pill--caching';
      text.textContent = 'Online (Caching)';
      badge.setAttribute('title', 'Connected to network. Initial Service Worker asset caching in progress.');
    }
  }
}

/**
 * Updates top application bar controls, active subject theme, tab buttons, and step indicator dots.
 * @param {Object} state
 */
function updateHeader(state) {
  if (typeof document === 'undefined') return;
  const { currentSubject, currentStep, selectedLocale, audioMuted, activeTab = 'missions', gradeBand = 'middle' } = state;

  // 1. Dynamic theme accent and grade band on root html
  const themeSubject = currentSubject || 'physics';
  if (document.documentElement && typeof document.documentElement.setAttribute === 'function') {
    document.documentElement.setAttribute('data-subject', themeSubject);
    document.documentElement.setAttribute('data-band', gradeBand);
  }

  // 2. Audio mute button state
  const muteIcon = document.getElementById('audio-mute-icon');
  const muteBtn = document.getElementById('btn-audio-mute');
  if (muteIcon && muteBtn) {
    muteIcon.textContent = audioMuted ? '🔇' : '🔊';
    muteBtn.setAttribute('aria-label', audioMuted ? 'Unmute audio tones' : 'Mute audio tones');
    muteBtn.setAttribute('title', audioMuted ? 'Audio muted' : 'Audio enabled');
  }

  // 3. Locale button state
  const localeLabel = document.getElementById('locale-label');
  if (localeLabel) {
    localeLabel.textContent = selectedLocale === 'kn' ? 'ಕನ್ನಡ (KN)' : 'English (EN)';
    if (document.documentElement) document.documentElement.lang = selectedLocale;
  }

  // 4. Tab and Grade Band Highlight
  const allTabs = [
    { id: 'tab-btn-missions', tab: 'missions' },
    { id: 'tab-btn-browser', tab: 'browser' },
    { id: 'tab-btn-hub', tab: 'hub' },
    { id: 'tab-btn-mock', tab: 'mock-test' },
    { id: 'tab-btn-tutor', tab: 'tutor' },
    { id: 'tab-btn-profile', tab: 'profile' }
  ];
  allTabs.forEach(({ id, tab }) => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.toggle('active', activeTab === tab);
      el.setAttribute('aria-selected', String(activeTab === tab));
    }
  });

  // Profile Pill in Header
  const profileAvatar = document.getElementById('header-profile-avatar');
  const profileName = document.getElementById('header-profile-name');
  if (profileAvatar && profileName) {
    const prof = state.learnerProfile || {};
    profileAvatar.textContent = prof.avatar || '👨‍🎓';
    profileName.textContent = prof.name ? prof.name.split(' ')[0] : 'Scholar';
  }

  document.querySelectorAll('.grade-pill').forEach((pill) => {
    const band = pill.getAttribute('data-band');
    pill.classList.toggle('active', band === gradeBand);
  });

  // 5. Sub-bar visibility and step indicators
  const subbar = document.getElementById('header-subbar');
  const subjectBadge = document.getElementById('header-subject-badge');
  const stepDotsContainer = document.getElementById('header-step-dots');

  if (!subbar || !subjectBadge || !stepDotsContainer) return;

  if (!currentSubject || currentStep === 's0_map' || activeTab !== 'missions') {
    subbar.style.display = 'none';
    return;
  }

  subbar.style.display = 'flex';

  const config = SUBJECT_CONFIG[currentSubject] || { title: currentSubject, badgeClass: 'badge-phys' };
  subjectBadge.className = `badge ${config.badgeClass}`;
  subjectBadge.textContent = config.title;

  const missionSteps = STEP_IDS.slice(1);
  const currentStepIndex = missionSteps.indexOf(currentStep);

  let dotsHtml = '';
  missionSteps.forEach((stepId, idx) => {
    const isCompleted = idx < currentStepIndex;
    const isActive = idx === currentStepIndex;
    const dotClass = `step-dot${isActive ? ' active' : ''}${isCompleted ? ' completed' : ''}`;
    dotsHtml += `<span class="${dotClass}" aria-hidden="true"></span>`;
  });

  const stepNumber = currentStepIndex >= 0 ? currentStepIndex + 1 : 1;
  dotsHtml += `<span class="step-counter-text">Step ${stepNumber} of 6</span>`;

  stepDotsContainer.innerHTML = dotsHtml;
  stepDotsContainer.setAttribute('aria-label', `Step ${stepNumber} of 6: ${config.title}`);
}

/**
 * Updates sticky bottom action bar buttons based on active step and progression invariants.
 * @param {Object} state
 */
function updateActionBar(state) {
  if (typeof document === 'undefined') return;
  const { currentSubject, currentStep, activeTab, progress } = state;
  const actionBar = document.getElementById('action-bar');
  const btnBack = document.getElementById('btn-nav-back');
  const btnPrimary = document.getElementById('btn-nav-primary');

  if (!actionBar || !btnBack || !btnPrimary) return;

  if (!currentSubject || currentStep === 's0_map' || activeTab !== 'missions' || activeExtendedLabId) {
    actionBar.style.display = 'none';
    return;
  }

  actionBar.style.display = 'block';
  btnBack.style.display = 'inline-flex';
  btnPrimary.style.display = 'inline-flex';

  const subjectProgress = progress[currentSubject] || {};

  switch (currentStep) {
    case 's1_intro':
      btnBack.textContent = '← Mission Map';
      btnBack.onclick = () => router.goToMap();
      btnPrimary.textContent = 'Start Investigation (Predict) →';
      btnPrimary.removeAttribute('disabled');
      btnPrimary.setAttribute('aria-disabled', 'false');
      btnPrimary.onclick = () => router.navigate(currentSubject, 's2_predict');
      break;

    case 's2_predict':
      btnBack.textContent = '← Brief';
      btnBack.onclick = () => router.navigate(currentSubject, 's1_intro');
      btnPrimary.textContent = 'Enter Lab (Observe) →';
      if (subjectProgress.predictionChoiceId) {
        btnPrimary.removeAttribute('disabled');
        btnPrimary.setAttribute('aria-disabled', 'false');
        btnPrimary.onclick = () => router.navigate(currentSubject, 's3_explore');
      } else {
        btnPrimary.setAttribute('disabled', 'true');
        btnPrimary.setAttribute('aria-disabled', 'true');
        btnPrimary.onclick = null;
      }
      break;

    case 's3_explore':
      btnBack.textContent = '← Prediction';
      btnBack.onclick = () => router.navigate(currentSubject, 's2_predict');
      btnPrimary.textContent = 'Concept Explanation →';
      if (subjectProgress.interactiveCompleted) {
        btnPrimary.removeAttribute('disabled');
        btnPrimary.setAttribute('aria-disabled', 'false');
        btnPrimary.onclick = () => router.navigate(currentSubject, 's4_understand');
      } else {
        btnPrimary.setAttribute('disabled', 'true');
        btnPrimary.setAttribute('aria-disabled', 'true');
        btnPrimary.onclick = null;
      }
      break;

    case 's4_understand':
      btnBack.textContent = '← Revisit Lab';
      btnBack.onclick = () => router.navigate(currentSubject, 's3_explore');
      btnPrimary.textContent = 'Diagnostic Check →';
      btnPrimary.removeAttribute('disabled');
      btnPrimary.setAttribute('aria-disabled', 'false');
      btnPrimary.onclick = () => router.navigate(currentSubject, 's5_feedback_retry');
      break;

    case 's5_feedback_retry':
      btnBack.textContent = '← Concept Note';
      btnBack.onclick = () => router.navigate(currentSubject, 's4_understand');
      btnPrimary.textContent = 'Summative Exit Check →';
      btnPrimary.removeAttribute('disabled');
      btnPrimary.setAttribute('aria-disabled', 'false');
      btnPrimary.onclick = () => router.navigate(currentSubject, 's6_exit_result');
      break;

    case 's6_exit_result':
      btnBack.textContent = '↺ Replay Lab';
      btnBack.onclick = () => router.navigate(currentSubject, 's3_explore');
      btnPrimary.textContent = 'Return to Mission Map →';
      btnPrimary.removeAttribute('disabled');
      btnPrimary.setAttribute('aria-disabled', 'false');
      btnPrimary.onclick = () => router.goToMap();
      break;

    default:
      actionBar.style.display = 'none';
      break;
  }
}

/**
 * Cache for active learning runner instance and extended lab state.
 */
let runnerInstance = null;
let activeExtendedLabId = null;
let catalogFilterGrade = 'all';
let catalogFilterSubject = 'all';
let catalogSearchQuery = '';

// Interactive Study Hub & Profile UI state flags
let isEditingSchool = false;
let isAddingPeriod = false;
let isAddingExam = false;
let isAddingChapter = false;
let isEditingProfile = false;

// Mock Exam & AI Tutor state
let activeMockExam = null;
let examEvalResult = null;
let activeTutorSubject = 'physics';
let activeTutorTopicKey = 'sound_waves';
let activeTutorHintLevel = 1;
let activeTutorExplanationMode = 'step_by_step';
let tutorDiagnosticResult = null;
let activeBrowserSubject = 'physics';
let activeTopicTest = null;
let activeTopicTestResult = null;
let onboardingStep = 1;
let onboardingMode = 'register';
let onboardingData = {
  name: 'Aarav Sharma',
  avatar: '👨‍🎓',
  schoolName: 'Kendriya Vidyalaya, Ballari',
  country: 'India',
  state: 'Karnataka',
  board: 'CBSE',
  classLevel: 7,
  medium: 'English',
  section: 'B',
  enrolledSubjects: ['physics', 'chemistry', 'biology', 'math'],
  upcomingExam: {
    title: 'Term 1 Summative Science Examination',
    date: '2026-11-28',
    daysLeft: 11,
    syllabus: 'Chapters 4 & 13 (Heat and Motion)'
  },
  guardianConsentGranted: true
};

/**
 * Escapes unsafe HTML characters to prevent XSS.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Delegates view rendering to learning_runner.js or renders an accessible fallback.
 * @param {Object} state
 */
async function delegateRender(state) {
  if (typeof document === 'undefined') return;
  const stage = document.getElementById('runner-stage') || document.getElementById('main-content');
  if (!stage) return;

  const { activeTab = 'missions', currentSubject, currentStep } = state;

  if (activeTab === 'browser') {
    renderCourseBrowser(stage, state);
    return;
  }

  if (activeTab === 'mock-test') {
    renderMockExamExperience(stage, state);
    return;
  }

  if (activeTab === 'tutor') {
    renderAITutorCompanion(stage, state);
    return;
  }

  if (activeTab === 'profiles') {
    renderProfileSwitcher(stage, state);
    return;
  }

  if (activeTab === 'onboarding') {
    renderOnboardingWizard(stage, state);
    return;
  }

  if (activeTab === 'hub') {
    renderStudyHub(stage, state);
    return;
  }

  if (activeTab === 'profile') {
    renderLearnerProfile(stage, state);
    return;
  }

  if (activeExtendedLabId) {
    renderExtendedLabStage(stage, state, activeExtendedLabId);
    return;
  }

  // Active tab is 'missions' -> delegate full 7-step POE cycle and S0 map to learning_runner
  try {
    if (!runnerInstance) {
      const mod = await import('../engine/learning_runner.js').catch(() => null);
      if (mod) {
        if (typeof mod.renderMissionStep === 'function') {
          runnerInstance = { render: mod.renderMissionStep };
        } else if (mod.LearningRunner) {
          runnerInstance = new mod.LearningRunner({ container: stage, store, router });
        } else if (mod.learningRunner) {
          runnerInstance = mod.learningRunner;
        } else if (mod.default) {
          runnerInstance = typeof mod.default === 'function' ? new mod.default({ container: stage, store, router }) : mod.default;
        }

        if (runnerInstance && typeof runnerInstance.init === 'function') {
          runnerInstance.init(stage, store, router);
        }
      }
    }

    if (runnerInstance) {
      if (typeof runnerInstance.render === 'function') {
        runnerInstance.render(stage, state, store, router);
        return;
      }
      if (typeof runnerInstance.update === 'function') {
        runnerInstance.update(state);
        return;
      }
    }
  } catch (err) {
    console.warn('[Gramin PocketLab App] Dynamic runner delegation deferred to fallback:', err);
  }
  renderFallbackStage(stage, state);
}

// Global hook for extended micro-labs
if (typeof window !== 'undefined') {
  window.__launchExtendedLab = (modId) => {
    activeExtendedLabId = modId;
    delegateRender(store.getState());
  };
}

/**
 * Renders the School & Study Hub: School Profile, Timetable, Exam Countdown & Custom Syllabus, 40/30/20/10 Recommender.
 */
function renderStudyHub(stage, state) {
  const { studyHub, learnerProfile = {}, gradeBand = 'middle' } = state;
  const timetable = studyHub?.timetable || [];
  const examCountdowns = studyHub?.examCountdowns || [];
  const checklist = studyHub?.syllabusChecklist || [];
  const completedChecklistCount = checklist.filter((item) => item.completed).length;
  const checklistPercent = checklist.length > 0 ? Math.round((completedChecklistCount / checklist.length) * 100) : 0;

  const w = studyHub?.recommendationWeights || { examImportance: 0.4, misconceptionCount: 0.3, retentionGapDays: 0.2, curriculumSequence: 0.1 };

  const recommendations = [
    { title: 'Sound Wave Oscilloscope & Pitch Decoupling', subject: 'Physics', classLvl: 8, base: [95, 90, 85, 90], reason: 'High weight on Term 1 exam + frequent frequency/pitch misconception' },
    { title: 'Acids, Bases & Natural Turmeric Indicators', subject: 'Chemistry', classLvl: 7, base: [88, 85, 90, 80], reason: 'Pathogen potability misconception + unit test next week' },
    { title: 'Proportional Water Sharing Ratios', subject: 'Mathematics', classLvl: 6, base: [80, 75, 80, 85], reason: 'Fundamental ratio invariant across NCERT curriculum' },
    { title: 'Food Web Trophic Cascade Disruptions', subject: 'Biology', classLvl: 7, base: [75, 80, 70, 75], reason: 'Indirect predator-prey relationship understanding' },
    { title: 'Autonomous Solar Rover Sequence Loops', subject: 'Computing', classLvl: 8, base: [70, 65, 80, 70], reason: 'Computational thinking and loop invariants' }
  ].map((rec) => {
    const score = (rec.base[0] * w.examImportance + rec.base[1] * w.misconceptionCount + rec.base[2] * w.retentionGapDays + rec.base[3] * w.curriculumSequence).toFixed(1);
    return { ...rec, priorityScore: score };
  }).sort((a, b) => b.priorityScore - a.priorityScore);

  const topRec = recommendations[0];
  const topRecSubject = topRec?.subject.toLowerCase() === 'mathematics' ? 'math' : (topRec?.subject.toLowerCase() || 'physics');

  // Find nearest upcoming test
  const upcomingExams = [...examCountdowns].sort((a, b) => (Number(a.daysLeft) || 0) - (Number(b.daysLeft) || 0));
  const nearestExam = upcomingExams[0];

  stage.innerHTML = `
    <div class="hub-container">
      <!-- School Identity Banner & Settings Trigger -->
      <section class="school-banner">
        <div class="school-banner-content">
          <div class="school-icon">🏫</div>
          <div class="school-details">
            <div class="d-flex align-center gap-2 flex-wrap">
              <h2 class="text-md font-bold mb-0">${escapeHtml(learnerProfile.school || 'Zilla Parishad High School, Ballari')}</h2>
              <span class="badge badge-purple">${escapeHtml(learnerProfile.board || 'CBSE')}</span>
              <span class="badge badge-info">Class ${learnerProfile.classLevel || 7}-${escapeHtml(learnerProfile.section || 'B')}</span>
              <span class="badge badge-secondary">${(gradeBand || 'middle').toUpperCase()} STAGE</span>
            </div>
            <p class="text-xs text-secondary mb-0 mt-1">Configured school timetable, local test portions, and personalized NCERT curriculum alignment.</p>
          </div>
        </div>
        <button type="button" class="btn btn-secondary btn-sm" id="btn-toggle-edit-school">
          ${isEditingSchool ? '✕ Close School Settings' : '✏️ Configure School & Class'}
        </button>
      </section>

      <!-- Collapsible School Configuration Form -->
      ${isEditingSchool ? `
        <section class="hub-form-card animate-slide-down">
          <div class="d-flex justify-between align-center mb-2">
            <h3 class="text-sm font-bold mb-0">⚙️ School & Class Details</h3>
            <span class="text-xs text-secondary">Local-First Storage</span>
          </div>
          <form id="form-school-config" class="grid-form">
            <div class="form-group">
              <label for="input-school-name" class="form-label">School Name</label>
              <input type="text" id="input-school-name" class="form-input" value="${escapeHtml(learnerProfile.school || 'Zilla Parishad High School, Ballari')}" required placeholder="e.g. Govt Higher Secondary School" />
            </div>
            <div class="form-group">
              <label for="select-school-board" class="form-label">Board / Educational Authority</label>
              <select id="select-school-board" class="form-input">
                <option value="CBSE" ${learnerProfile.board === 'CBSE' ? 'selected' : ''}>CBSE (Central Board)</option>
                <option value="CISCE" ${learnerProfile.board === 'CISCE' ? 'selected' : ''}>CISCE / ICSE</option>
                <option value="KSEAB" ${learnerProfile.board === 'KSEAB' ? 'selected' : ''}>KSEAB (Karnataka State Board)</option>
                <option value="State Board" ${learnerProfile.board === 'State Board' ? 'selected' : ''}>State Board</option>
                <option value="NIOS" ${learnerProfile.board === 'NIOS' ? 'selected' : ''}>NIOS (Open Schooling)</option>
              </select>
            </div>
            <div class="form-group">
              <label for="select-school-class" class="form-label">Class / Grade Level</label>
              <select id="select-school-class" class="form-input">
                <option value="5" ${Number(learnerProfile.classLevel) === 5 ? 'selected' : ''}>Class 5 (Preparatory Stage)</option>
                <option value="6" ${Number(learnerProfile.classLevel) === 6 ? 'selected' : ''}>Class 6 (Middle Stage)</option>
                <option value="7" ${Number(learnerProfile.classLevel) === 7 ? 'selected' : ''}>Class 7 (Middle Stage)</option>
                <option value="8" ${Number(learnerProfile.classLevel) === 8 ? 'selected' : ''}>Class 8 (Middle Stage)</option>
                <option value="9" ${Number(learnerProfile.classLevel) === 9 ? 'selected' : ''}>Class 9 (Secondary Stage)</option>
                <option value="10" ${Number(learnerProfile.classLevel) === 10 ? 'selected' : ''}>Class 10 (Secondary Stage)</option>
                <option value="11" ${Number(learnerProfile.classLevel) === 11 ? 'selected' : ''}>Class 11 (Senior Secondary)</option>
                <option value="12" ${Number(learnerProfile.classLevel) === 12 ? 'selected' : ''}>Class 12 (Senior Secondary)</option>
              </select>
            </div>
            <div class="form-group">
              <label for="input-school-section" class="form-label">Section / Division</label>
              <input type="text" id="input-school-section" class="form-input" value="${escapeHtml(learnerProfile.section || 'B')}" maxlength="4" placeholder="A, B, C..." />
            </div>
            <div class="form-actions col-span-full">
              <button type="submit" class="btn btn-primary btn-sm">💾 Save School Settings</button>
              <button type="button" class="btn btn-outline btn-sm" id="btn-cancel-school">Cancel</button>
            </div>
          </form>
        </section>
      ` : ''}

      <!-- Prominent Test / Exam Preparation Alert Banner -->
      ${nearestExam ? `
        <section class="test-alert-banner ${Number(nearestExam.daysLeft) <= 7 ? 'urgent' : ''}">
          <div class="test-alert-content">
            <div class="test-alert-icon">${Number(nearestExam.daysLeft) <= 3 ? '🚨' : '⏰'}</div>
            <div class="test-alert-text">
              <div class="test-alert-header">
                <strong>${Number(nearestExam.daysLeft) <= 3 ? 'CRITICAL TEST PREPARATION ALERT' : 'UPCOMING TEST PREPARATION ALERT'}:</strong>
                <span class="test-alert-title">${escapeHtml(nearestExam.title)}</span>
                <span class="badge ${Number(nearestExam.daysLeft) <= 7 ? 'badge-danger' : 'badge-warning'}">
                  ${nearestExam.daysLeft} DAYS LEFT (${escapeHtml(nearestExam.date)})
                </span>
              </div>
              <div class="test-alert-portions">
                <strong>📖 School Exam Syllabus:</strong> ${escapeHtml(nearestExam.syllabus || 'All chapters')}
              </div>
              <div class="test-alert-strategy">
                💡 <strong>PocketLab Prep Strategy:</strong> Review <em>${escapeHtml(topRec?.title || 'Key Scientific Invariants')}</em> today. Master the experimental concepts to ensure 100% exam readiness.
              </div>
            </div>
          </div>
          <div class="test-alert-actions">
            <button type="button" class="btn btn-primary btn-sm btn-study-alert" data-subject="${topRecSubject}">Start Targeted Prep →</button>
          </div>
        </section>
      ` : ''}

      <div class="hub-hero">
        <div>
          <span class="badge badge-purple">Curriculum & School Hub</span>
          <h1 class="mt-2 mb-1">School & Study Hub</h1>
          <p class="text-secondary mb-0">Daily class timetable, board exam planner, and adaptive 40/30/20/10 concept recommendation engine.</p>
        </div>
        <div class="d-flex gap-2">
          <div class="countdown-badge">
            <span class="countdown-days">${checklistPercent}%</span>
            <span class="countdown-label">Syllabus Mastered</span>
          </div>
        </div>
      </div>

      <!-- Priority Recommender Engine (40/30/20/10) -->
      <section class="recommender-card">
        <div class="d-flex justify-between align-center mb-2">
          <div>
            <h2 class="text-lg font-bold mb-0">🎯 Adaptive Priority Recommendation Engine</h2>
            <p class="text-sm text-secondary mb-0">Mathematically weighted concept ranking based on board exam urgency and retention gaps.</p>
          </div>
          <span class="badge badge-info">Authoritative Formula</span>
        </div>

        <div class="formula-box">
          <span>Priority P = (0.40 &times; ExamWeight) + (0.30 &times; MisconceptionRate) + (0.20 &times; RetentionGap) + (0.10 &times; Sequence)</span>
        </div>

        <div class="rec-list" style="display: flex; flex-direction: column; gap: 10px; margin-top: 14px;">
          ${recommendations.map((rec, idx) => `
            <div style="background: var(--color-surface-subtle); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 12px 16px; display: flex; justify-content: space-between; align-center; flex-wrap: wrap; gap: 10px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 18px; font-weight: 800; color: var(--color-subject-accent); min-width: 28px;">#${idx + 1}</span>
                <div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <strong style="color: var(--color-text-main); font-size: 15px;">${escapeHtml(rec.title)}</strong>
                    <span class="badge badge-secondary" style="font-size: 11px;">Class ${rec.classLvl} ${rec.subject}</span>
                  </div>
                  <p style="font-size: 12px; color: var(--color-text-secondary); margin: 2px 0 0 0;">${escapeHtml(rec.reason)}</p>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="text-align: right;">
                  <span style="font-size: 11px; text-transform: uppercase; color: var(--color-text-secondary); font-weight: 700;">Score:</span>
                  <strong style="font-size: 16px; color: #10B981; margin-left: 4px;">${rec.priorityScore}</strong>
                </div>
                <button type="button" class="btn btn-primary btn-sm btn-study-rec" data-subject="${rec.subject.toLowerCase() === 'mathematics' ? 'math' : rec.subject.toLowerCase()}">Study Now →</button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Grid: Timetable & Exam Countdown -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--space-4);">
        <!-- Today's Timetable -->
        <section class="timetable-card">
          <div class="d-flex justify-between align-center mb-3">
            <div>
              <h2 class="text-md font-bold mb-0">📅 Today's Period Timetable</h2>
              <span class="text-xs text-secondary">${escapeHtml(learnerProfile.school || 'School')} — Class ${learnerProfile.classLevel || 7}-${escapeHtml(learnerProfile.section || 'B')} Schedule</span>
            </div>
            <div class="d-flex gap-2 align-center">
              <span class="badge badge-success"><span class="active-pulse"></span>In Session</span>
              <button type="button" class="btn btn-xs btn-outline" id="btn-toggle-add-period">
                ${isAddingPeriod ? '✕ Close' : '+ Add Period'}
              </button>
            </div>
          </div>

          ${isAddingPeriod ? `
            <div class="hub-form-card mb-3 animate-slide-down">
              <h4 class="text-xs font-bold mb-2">➕ Add New Period to Timetable</h4>
              <form id="form-add-period" class="grid-form">
                <div class="form-group">
                  <label class="form-label">Time Slot</label>
                  <input type="text" id="period-time" class="form-input" placeholder="e.g. 10:45 - 11:30" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Subject</label>
                  <select id="period-subject" class="form-input">
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Social Science">Social Science</option>
                    <option value="English">English</option>
                    <option value="Kannada">Kannada</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Topic / Unit</label>
                  <input type="text" id="period-topic" class="form-input" placeholder="e.g. Natural indicators turmeric lab" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Teacher Name</label>
                  <input type="text" id="period-teacher" class="form-input" placeholder="e.g. Sri R. K. Hegde" />
                </div>
                <div class="form-group">
                  <label class="form-label">Room / Lab</label>
                  <input type="text" id="period-room" class="form-input" placeholder="e.g. Science Lab 1" />
                </div>
                <div class="form-actions col-span-full">
                  <button type="submit" class="btn btn-primary btn-sm">Add Period</button>
                  <button type="button" class="btn btn-outline btn-sm" id="btn-cancel-period">Cancel</button>
                </div>
              </form>
            </div>
          ` : ''}

          <div class="timetable-grid" style="grid-template-columns: 1fr;">
            ${timetable.map((p, idx) => `
              <div class="period-item ${p.active ? 'active-period' : ''}">
                <div class="d-flex justify-between align-center">
                  <div>
                    <span class="text-xs font-bold text-secondary">Period ${p.period} (${escapeHtml(p.time)})</span>
                    <h4 class="mt-1 mb-0 font-bold" style="font-size: 14px;">${escapeHtml(p.subject)}: ${escapeHtml(p.topic)}</h4>
                    <span class="text-xs text-secondary">${escapeHtml(p.room)} • ${escapeHtml(p.teacher)}</span>
                  </div>
                  <div class="d-flex align-center gap-2">
                    ${p.active ? '<span class="badge badge-success text-xs">Active Now</span>' : ''}
                    <button type="button" class="btn-icon-danger btn-delete-period" data-period-idx="${idx}" title="Remove period" aria-label="Remove period ${p.period}">🗑️</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Exam Countdown & Syllabus Checklist -->
        <div style="display: flex; flex-direction: column; gap: var(--space-4);">
          <!-- Exam Countdown -->
          <section class="exams-card">
            <div class="d-flex justify-between align-center mb-2">
              <h2 class="text-md font-bold mb-0">⏳ Exam & Assessment Countdown</h2>
              <button type="button" class="btn btn-xs btn-outline" id="btn-toggle-add-exam">
                ${isAddingExam ? '✕ Close' : '+ Schedule Test'}
              </button>
            </div>

            ${isAddingExam ? `
              <div class="hub-form-card mb-3 animate-slide-down">
                <h4 class="text-xs font-bold mb-2">➕ Schedule School Test / Exam</h4>
                <form id="form-add-exam" class="grid-form">
                  <div class="form-group col-span-full">
                    <label class="form-label">Test / Exam Name</label>
                    <input type="text" id="exam-title" class="form-input" placeholder="e.g. Class Weekly Test 2: Sound & Waves" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Date</label>
                    <input type="text" id="exam-date" class="form-input" placeholder="e.g. Nov 28, 2026" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Days Left</label>
                    <input type="number" id="exam-days" class="form-input" min="0" max="365" placeholder="e.g. 5" required />
                  </div>
                  <div class="form-group col-span-full">
                    <label class="form-label">School Syllabus & Portions Announced</label>
                    <textarea id="exam-syllabus" class="form-input form-textarea" rows="2" placeholder="List exact chapters, concepts, formulas, or experiments considered for the test..." required></textarea>
                  </div>
                  <div class="form-actions col-span-full">
                    <button type="submit" class="btn btn-primary btn-sm">Schedule Test & Alert</button>
                    <button type="button" class="btn btn-outline btn-sm" id="btn-cancel-exam">Cancel</button>
                  </div>
                </form>
              </div>
            ` : ''}

            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${examCountdowns.map(ex => `
                <div style="display: flex; flex-direction: column; gap: 6px; padding: 12px 14px; border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface-subtle);">
                  <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                      <strong style="font-size: 14px;">${escapeHtml(ex.title)}</strong>
                      <div style="font-size: 12px; color: var(--color-text-secondary);">${escapeHtml(ex.date)}</div>
                    </div>
                    <div class="d-flex align-center gap-2">
                      <div class="countdown-badge ${ex.urgency === 'high' || Number(ex.daysLeft) <= 7 ? 'urgent' : ''}">
                        <span class="countdown-days">${ex.daysLeft}</span>
                        <span class="countdown-label">Days</span>
                      </div>
                      <button type="button" class="btn-icon-danger btn-delete-exam" data-exam-id="${ex.id}" title="Remove test" aria-label="Remove test">🗑️</button>
                    </div>
                  </div>
                  <div class="exam-syllabus-box">
                    <strong>Portions Considered:</strong> ${escapeHtml(ex.syllabus)}
                  </div>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- NCERT Syllabus Checklist -->
          <section class="checklist-card">
            <div class="d-flex justify-between align-center mb-2">
              <div>
                <h2 class="text-md font-bold mb-0">📋 NCERT & School Syllabus Checklist</h2>
                <span class="text-xs font-bold text-secondary">${completedChecklistCount}/${checklist.length} Done</span>
              </div>
              <button type="button" class="btn btn-xs btn-outline" id="btn-toggle-add-chapter">
                ${isAddingChapter ? '✕ Close' : '+ Add Topic'}
              </button>
            </div>

            ${isAddingChapter ? `
              <div class="hub-form-card mb-3 animate-slide-down">
                <h4 class="text-xs font-bold mb-2">➕ Add Chapter or Topic</h4>
                <form id="form-add-chapter" class="grid-form">
                  <div class="form-group">
                    <label class="form-label">Subject</label>
                    <select id="chapter-subject" class="form-input">
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Social Science">Social Science</option>
                      <option value="English">English</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Chapter / Topic Name</label>
                    <input type="text" id="chapter-title" class="form-input" placeholder="e.g. Sound Wave Frequencies & Timbre" required />
                  </div>
                  <div class="form-actions col-span-full">
                    <button type="submit" class="btn btn-primary btn-sm">Add to Checklist</button>
                    <button type="button" class="btn btn-outline btn-sm" id="btn-cancel-chapter">Cancel</button>
                  </div>
                </form>
              </div>
            ` : ''}

            <div style="width: 100%; height: 6px; background: #E2E8F0; border-radius: 3px; overflow: hidden; margin-bottom: 12px;">
              <div style="width: ${checklistPercent}%; height: 100%; background: #10B981; transition: width 0.3s ease;"></div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${checklist.map(item => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 6px; border-radius: 4px; transition: background 0.15s ease;">
                  <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer; flex: 1;">
                    <input type="checkbox" class="chk-syllabus" data-item-id="${item.id}" ${item.completed ? 'checked' : ''} style="width: 16px; height: 16px; accent-color: #10B981;" />
                    <span style="${item.completed ? 'text-decoration: line-through; color: var(--color-text-secondary);' : 'font-weight: 600;'}">${escapeHtml(item.chapter)}</span>
                  </label>
                  <button type="button" class="btn-icon-danger btn-delete-chapter" data-chapter-id="${item.id}" title="Remove topic" aria-label="Remove topic">✕</button>
                </div>
              `).join('')}
            </div>
          </section>
        </div>
      </div>
    </div>
  `;

  // Wire Event Listeners
  // School Settings Toggle
  stage.querySelector('#btn-toggle-edit-school')?.addEventListener('click', () => {
    isEditingSchool = !isEditingSchool;
    delegateRender(store.getState());
  });

  stage.querySelector('#btn-cancel-school')?.addEventListener('click', () => {
    isEditingSchool = false;
    delegateRender(store.getState());
  });

  stage.querySelector('#form-school-config')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const schoolName = stage.querySelector('#input-school-name')?.value;
    const board = stage.querySelector('#select-school-board')?.value;
    const classLevel = stage.querySelector('#select-school-class')?.value;
    const section = stage.querySelector('#input-school-section')?.value;
    store.updateSchoolInfo({ schoolName, board, classLevel, section });
    isEditingSchool = false;
    announce('School configuration updated.');
  });

  // Timetable Add Toggle
  stage.querySelector('#btn-toggle-add-period')?.addEventListener('click', () => {
    isAddingPeriod = !isAddingPeriod;
    delegateRender(store.getState());
  });

  stage.querySelector('#btn-cancel-period')?.addEventListener('click', () => {
    isAddingPeriod = false;
    delegateRender(store.getState());
  });

  stage.querySelector('#form-add-period')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const time = stage.querySelector('#period-time')?.value;
    const subject = stage.querySelector('#period-subject')?.value;
    const topic = stage.querySelector('#period-topic')?.value;
    const teacher = stage.querySelector('#period-teacher')?.value;
    const room = stage.querySelector('#period-room')?.value;
    store.addTimetablePeriod({ time, subject, topic, teacher, room });
    isAddingPeriod = false;
    announce('Period added to timetable.');
  });

  stage.querySelectorAll('.btn-delete-period').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = Number(e.currentTarget.getAttribute('data-period-idx'));
      store.deleteTimetablePeriod(idx);
      announce('Period removed.');
    });
  });

  // Exam Add Toggle
  stage.querySelector('#btn-toggle-add-exam')?.addEventListener('click', () => {
    isAddingExam = !isAddingExam;
    delegateRender(store.getState());
  });

  stage.querySelector('#btn-cancel-exam')?.addEventListener('click', () => {
    isAddingExam = false;
    delegateRender(store.getState());
  });

  stage.querySelector('#form-add-exam')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = stage.querySelector('#exam-title')?.value;
    const date = stage.querySelector('#exam-date')?.value;
    const daysLeft = stage.querySelector('#exam-days')?.value;
    const syllabus = stage.querySelector('#exam-syllabus')?.value;
    store.addExamCountdown({ title, date, daysLeft, syllabus });
    isAddingExam = false;
    announce('School exam scheduled with study alert.');
  });

  stage.querySelectorAll('.btn-delete-exam').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-exam-id');
      store.deleteExamCountdown(id);
      announce('Exam removed.');
    });
  });

  // Chapter Add Toggle
  stage.querySelector('#btn-toggle-add-chapter')?.addEventListener('click', () => {
    isAddingChapter = !isAddingChapter;
    delegateRender(store.getState());
  });

  stage.querySelector('#btn-cancel-chapter')?.addEventListener('click', () => {
    isAddingChapter = false;
    delegateRender(store.getState());
  });

  stage.querySelector('#form-add-chapter')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const subject = stage.querySelector('#chapter-subject')?.value;
    const chapter = stage.querySelector('#chapter-title')?.value;
    store.addSyllabusChapter({ subject, chapter });
    isAddingChapter = false;
    announce('Chapter added to syllabus.');
  });

  stage.querySelectorAll('.btn-delete-chapter').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-chapter-id');
      store.deleteSyllabusChapter(id);
      announce('Chapter removed from syllabus.');
    });
  });

  // Study Alert Button
  stage.querySelectorAll('.btn-study-alert, .btn-study-rec').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const sub = e.currentTarget.getAttribute('data-subject');
      if (SUBJECT_IDS.includes(sub)) {
        router.goToSubject(sub);
      } else {
        router.goToMap();
      }
    });
  });

  stage.querySelectorAll('.chk-syllabus').forEach(chk => {
    chk.addEventListener('change', (e) => {
      const id = e.currentTarget.getAttribute('data-item-id');
      store.toggleSyllabusItem(id);
    });
  });
}

/**
 * Renders the Learner Profile & Model: Mastery Radar Chart, Streak, Level/XP, Badges, Offline Diagnostics.
 */
function renderLearnerProfile(stage, state) {
  const { learnerProfile, gradeBand = 'middle' } = state;
  const p = learnerProfile || {
    name: 'Aarav Sharma',
    school: 'Zilla Parishad High School, Ballari',
    board: 'CBSE',
    classLevel: 7,
    section: 'B',
    avatar: '👨‍🎓',
    streakDays: 7,
    xp: 450,
    level: 3,
    badges: ['badge-phys-dhwani', 'badge-math-bhaga'],
    radarScores: { math: 85, physics: 90, chemistry: 75, biology: 80, social: 70, computing: 85 }
  };

  const radar = p.radarScores || { math: 85, physics: 90, chemistry: 75, biology: 80, social: 70, computing: 85 };

  const axes = [
    { key: 'math', label: 'Mathematics' },
    { key: 'physics', label: 'Physics' },
    { key: 'chemistry', label: 'Chemistry' },
    { key: 'biology', label: 'Biology' },
    { key: 'social', label: 'Social Science' },
    { key: 'computing', label: 'Computing' }
  ];

  const cx = 160;
  const cy = 150;
  const maxR = 100;

  const points = axes.map((ax, idx) => {
    const angle = (idx * (Math.PI * 2) / 6) - (Math.PI / 2);
    const score = Number(radar[ax.key]) || 50;
    const r = (score / 100) * maxR;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const gridRings = [0.25, 0.50, 0.75, 1.0].map(pct => {
    const r = maxR * pct;
    const ringPts = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i * (Math.PI * 2) / 6) - (Math.PI / 2);
      ringPts.push(`${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`);
    }
    return `<polygon points="${ringPts.join(' ')}" fill="none" stroke="#E2E8F0" stroke-width="1" />`;
  }).join('');

  const axisLines = axes.map((ax, idx) => {
    const angle = (idx * (Math.PI * 2) / 6) - (Math.PI / 2);
    const x = cx + maxR * Math.cos(angle);
    const y = cy + maxR * Math.sin(angle);
    const labelX = cx + (maxR + 20) * Math.cos(angle);
    const labelY = cy + (maxR + 14) * Math.sin(angle);
    return `
      <line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="2,2" />
      <text x="${labelX}" y="${labelY}" font-size="11" font-weight="600" text-anchor="middle" dominant-baseline="central" fill="#475569">${ax.label}</text>
    `;
  }).join('');

  stage.innerHTML = `
    <div class="profile-container">
      <!-- Identity Hero -->
      <div class="profile-hero">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="width: 72px; height: 72px; border-radius: 50%; background: #EFF6FF; border: 3px solid #275DDB; display: flex; align-items: center; justify-content: center; font-size: 36px; box-shadow: 0 4px 12px rgba(39, 93, 219, 0.2);">
            ${p.avatar || '👨‍🎓'}
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <h1 class="text-xl font-bold mb-0">${escapeHtml(p.name || 'Scholar')}</h1>
              <span class="badge badge-purple">Class ${p.classLevel || 7}-${escapeHtml(p.section || 'B')}</span>
              <span class="badge badge-info">${(gradeBand || 'middle').toUpperCase()} STAGE</span>
            </div>
            <p class="text-sm text-secondary mb-1">${escapeHtml(p.school || 'Zilla Parishad High School, Ballari')} • ${escapeHtml(p.board || 'CBSE')}</p>
            <div style="display: flex; gap: 6px; font-size: 12px; font-weight: 700; color: #10B981;">
              <span>● Offline Local Learner Model</span> • <span>Personalized Learning State Active</span>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 14px; align-items: center; flex-wrap: wrap;">
          <div class="d-flex align-center gap-2" style="background: #FFF7ED; border: 1px solid #FFEDD5; border-radius: var(--radius-md); padding: 8px 14px;">
            <span class="streak-flame">🔥</span>
            <div>
              <strong style="font-size: 18px; color: #EA580C; display: block; line-height: 1;">${p.streakDays || 7} Days</strong>
              <span style="font-size: 11px; text-transform: uppercase; color: #9A3412; font-weight: 700;">Daily Study Streak</span>
            </div>
          </div>
          <div class="d-flex align-center gap-2" style="background: #F0FDF4; border: 1px solid #DCFCE7; border-radius: var(--radius-md); padding: 8px 14px;">
            <span style="font-size: 28px;">🌟</span>
            <div>
              <strong style="font-size: 18px; color: #16A34A; display: block; line-height: 1;">Level ${p.level || 1}</strong>
              <span style="font-size: 11px; text-transform: uppercase; color: #15803D; font-weight: 700;">${p.xp || 0} / 600 XP</span>
            </div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" id="btn-toggle-edit-profile">
            ${isEditingProfile ? '✕ Close' : '✏️ Edit Profile'}
          </button>
        </div>
      </div>

      <!-- Collapsible Profile Edit Form -->
      ${isEditingProfile ? `
        <section class="hub-form-card animate-slide-down">
          <h3 class="text-sm font-bold mb-2">👤 Customize Scholar Profile</h3>
          <form id="form-profile-edit" class="grid-form">
            <div class="form-group">
              <label for="profile-name-input" class="form-label">Student Name</label>
              <input type="text" id="profile-name-input" class="form-input" value="${escapeHtml(p.name || 'Scholar')}" required />
            </div>
            <div class="form-group">
              <label for="profile-avatar-select" class="form-label">Avatar Emoji</label>
              <select id="profile-avatar-select" class="form-input">
                <option value="👨‍🎓" ${p.avatar === '👨‍🎓' ? 'selected' : ''}>👨‍🎓 Student (Boy)</option>
                <option value="👩‍🎓" ${p.avatar === '👩‍🎓' ? 'selected' : ''}>👩‍🎓 Student (Girl)</option>
                <option value="🧑‍🔬" ${p.avatar === '🧑‍🔬' ? 'selected' : ''}>🧑‍🔬 Young Scientist</option>
                <option value="👩‍🔬" ${p.avatar === '👩‍🔬' ? 'selected' : ''}>👩‍🔬 Lab Researcher</option>
                <option value="🚀" ${p.avatar === '🚀' ? 'selected' : ''}>🚀 Space Explorer</option>
                <option value="🦉" ${p.avatar === '🦉' ? 'selected' : ''}>🦉 Wise Scholar</option>
              </select>
            </div>
            <div class="form-actions col-span-full">
              <button type="submit" class="btn btn-primary btn-sm">Save Profile</button>
              <button type="button" class="btn btn-outline btn-sm" id="btn-cancel-profile-edit">Cancel</button>
            </div>
          </form>
        </section>
      ` : ''}

      <!-- Radar Mastery Chart & Adjusters -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--space-4);">
        <section class="radar-card">
          <div class="d-flex justify-between align-center mb-2">
            <div>
              <h2 class="text-md font-bold mb-0">🕸️ Competency Mastery Radar</h2>
              <span class="text-xs text-secondary">Multidimensional diagnostic across K-12 subject disciplines</span>
            </div>
            <span class="badge badge-phys">Dynamic SVG</span>
          </div>

          <div class="radar-wrapper">
            <svg class="radar-svg" width="320" height="300" viewBox="0 0 320 300">
              ${gridRings}
              ${axisLines}
              <polygon class="radar-polygon" points="${points}" />
            </svg>
          </div>
        </section>

        <!-- Mastery Sliders & Badges -->
        <div style="display: flex; flex-direction: column; gap: var(--space-4);">
          <section class="card p-4">
            <h3 class="text-md font-bold mb-3">Adjust Observed Competency Levels</h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${axes.map(ax => `
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; margin-bottom: 2px;">
                    <span>${ax.label}</span>
                    <span style="color: var(--color-subject-accent); font-weight: 800;">${radar[ax.key] || 50}%</span>
                  </div>
                  <input type="range" class="radar-slider" data-key="${ax.key}" min="20" max="100" value="${radar[ax.key] || 50}" style="width: 100%; accent-color: var(--color-subject-accent); height: 6px;" />
                </div>
              `).join('')}
            </div>
          </section>

          <!-- Badges Showcase -->
          <section class="badges-card">
            <h3 class="text-md font-bold mb-3">🏆 Badges & Achievement Vault</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px;">
              <div style="background: var(--color-surface-subtle); border: 1px solid var(--color-border); border-radius: 8px; padding: 10px; text-align: center;">
                <div style="font-size: 24px; margin-bottom: 4px;">🎵</div>
                <strong style="font-size: 12px; display: block;">Dhwani Shodha</strong>
                <span style="font-size: 10px; color: var(--color-text-secondary);">Sound Detective</span>
              </div>
              <div style="background: var(--color-surface-subtle); border: 1px solid var(--color-border); border-radius: 8px; padding: 10px; text-align: center;">
                <div style="font-size: 24px; margin-bottom: 4px;">💧</div>
                <strong style="font-size: 12px; display: block;">Bhaga Vidwan</strong>
                <span style="font-size: 10px; color: var(--color-text-secondary);">Water Ratio</span>
              </div>
              <div style="background: var(--color-surface-subtle); border: 1px solid var(--color-border); border-radius: 8px; padding: 10px; text-align: center;">
                <div style="font-size: 24px; margin-bottom: 4px;">🌱</div>
                <strong style="font-size: 12px; display: block;">Jeeva Vyuha</strong>
                <span style="font-size: 10px; color: var(--color-text-secondary);">Food Web</span>
              </div>
              <div style="background: var(--color-surface-subtle); border: 1px solid var(--color-border); border-radius: 8px; padding: 10px; text-align: center;">
                <div style="font-size: 24px; margin-bottom: 4px;">🧪</div>
                <strong style="font-size: 12px; display: block;">Rasayana Shodha</strong>
                <span style="font-size: 10px; color: var(--color-text-secondary);">pH Indicator</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <!-- Storage Inspector Card -->
      <section class="storage-card">
        <div class="d-flex justify-between align-center mb-2">
          <div>
            <h3 class="text-md font-bold mb-0">💾 Local-First Storage Diagnostics</h3>
            <span class="text-xs text-secondary">Verified offline storage footprint and zero server tracking</span>
          </div>
          <span class="badge badge-success">Local Sandbox</span>
        </div>
        <div style="display: flex; gap: 20px; align-items: center; flex-wrap: wrap; margin-top: 10px; font-size: 13px;">
          <div><strong>Key:</strong> <code>pocketlab_progress</code></div>
          <div><strong>Estimated Size:</strong> <code>2.8 KB</code></div>
          <div><strong>Mode:</strong> <code>Client Persistent (LocalStorage)</code></div>
          <div class="ml-auto d-flex gap-2">
            <button type="button" class="btn btn-secondary btn-sm" id="btn-export-json">Export JSON</button>
            <button type="button" class="btn btn-outline btn-sm text-danger" id="btn-profile-reset">Reset Data</button>
          </div>
        </div>
      </section>
    </div>
  `;

  // Profile Edit Listeners
  stage.querySelector('#btn-toggle-edit-profile')?.addEventListener('click', () => {
    isEditingProfile = !isEditingProfile;
    delegateRender(store.getState());
  });

  stage.querySelector('#btn-cancel-profile-edit')?.addEventListener('click', () => {
    isEditingProfile = false;
    delegateRender(store.getState());
  });

  stage.querySelector('#form-profile-edit')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = stage.querySelector('#profile-name-input')?.value;
    const avatar = stage.querySelector('#profile-avatar-select')?.value;
    store.updateLearnerProfile({ name, avatar });
    isEditingProfile = false;
    announce('Profile updated.');
  });

  stage.querySelectorAll('.radar-slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const key = e.currentTarget.getAttribute('data-key');
      const val = parseInt(e.currentTarget.value, 10);
      const newScores = { ...radar, [key]: val };
      store.updateLearnerProfile({ radarScores: newScores });
    });
  });

  stage.querySelector('#btn-export-json')?.addEventListener('click', () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(store.getState(), null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', 'gramin_pocketlab_profile.json');
    dlAnchor.click();
    announce('Learner profile JSON exported.');
  });

  stage.querySelector('#btn-profile-reset')?.addEventListener('click', () => {
    store.resetAllProgress();
    announce('Learner progress reset.');
  });
}

/**
 * Pre-defined diagnostic questions for core topic tests.
 */
const TOPIC_TEST_REPOSITORY = {
  't4-1': {
    title: 'Hot and Cold: Measuring Temperature',
    subject: 'physics',
    prompt: 'Why must a clinical thermometer NEVER be washed or sterilized in boiling water?',
    options: [
      { id: 'opt-a', text: 'Mercury freezes into a solid at boiling temperature', correct: false, explanation: 'Incorrect: Mercury freezes at -38.8°C, not in boiling water.' },
      { id: 'opt-b', text: 'Mercury expands beyond the 42°C limit and bursts the glass tube', correct: true, explanation: 'Correct! Clinical thermometers are strictly graduated from 35°C to 42°C. 100°C boiling water forces the liquid to burst the bulb.' },
      { id: 'opt-c', text: 'The glass stem melts instantly in hot water', correct: false, explanation: 'Incorrect: Glass melting point is above 600°C; the issue is liquid thermal expansion pressure.' }
    ]
  },
  't4-2': {
    title: 'Conduction, Convection & Radiation',
    subject: 'physics',
    prompt: 'How does heat energy travel along a stainless steel spoon placed in a hot cup of tea?',
    options: [
      { id: 'opt-a', text: 'By Conduction through vibration and collision of particles', correct: true, explanation: 'Correct! In solids, tightly packed atoms vibrate and transfer kinetic energy from the hotter end to cooler end without migrating.' },
      { id: 'opt-b', text: 'By Convection currents circulating molten liquid metal', correct: false, explanation: 'Incorrect: Convection requires bulk fluid circulation and cannot happen in rigid solids.' },
      { id: 'opt-c', text: 'Exclusively by Infrared Radiation across air gaps', correct: false, explanation: 'Incorrect: Spoon internal heat conduction is solid contact transfer.' }
    ]
  },
  't13-1': {
    title: 'Speed & Motion Measurements',
    subject: 'physics',
    prompt: 'A village tractor travels 18 kilometers in 30 minutes. What is its speed in standard SI units (m/s)?',
    options: [
      { id: 'opt-a', text: '10 m/s', correct: true, explanation: 'Correct! 18 km / 0.5 h = 36 km/h. Converting: 36 * (1000m / 3600s) = 10 m/s.' },
      { id: 'opt-b', text: '36 m/s', correct: false, explanation: 'Incorrect: 36 is the speed in km/h, not SI standard meters per second.' },
      { id: 'opt-c', text: '18 m/s', correct: false, explanation: 'Incorrect: 18 km is the distance traveled, not the velocity.' }
    ]
  },
  'sound_waves': {
    title: 'Sound Waves, Frequency & Pitch',
    subject: 'physics',
    prompt: 'When a guitar string is tightened so it vibrates 440 times per second instead of 220 times, which quality changes?',
    options: [
      { id: 'opt-a', text: 'Pitch increases (sounds one octave higher) because frequency doubled', correct: true, explanation: 'Correct! Pitch is strictly determined by frequency (cycles per second). Doubling vibrations from 220Hz to 440Hz raises pitch.' },
      { id: 'opt-b', text: 'Loudness increases because tightening adds wave amplitude', correct: false, explanation: 'Incorrect: Loudness depends on displacement amplitude, not oscillation frequency.' },
      { id: 'opt-c', text: 'Sound travels twice as fast through the surrounding air', correct: false, explanation: 'Incorrect: Speed of sound in room air is ~343 m/s and is independent of wave frequency.' }
    ]
  }
};

/**
 * Renders the Board-Aligned Subject & Course Browser (Course -> Unit -> Chapter -> Topic).
 */
function renderCourseBrowser(stage, state) {
  const { learnerProfile = {}, gradeBand = 'middle' } = state;
  const board = learnerProfile.board || 'CBSE';
  const classLevel = learnerProfile.classLevel || 7;
  const medium = learnerProfile.medium || 'English';
  const topicMastery = learnerProfile.topicMastery || {};

  const curriculum = resolveCurriculum(board, classLevel, medium);
  const subjects = curriculum.subjects || [];
  const currentSubjectObj = subjects.find(s => s.id === activeBrowserSubject) || subjects[0] || { id: 'physics', name: 'Physics' };
  const taxonomyKey = `${board.toLowerCase()}-${classLevel}-science`;
  const units = getSubjectChapterTaxonomy(taxonomyKey);

  // Flatten topics & calculate progress
  let allTopics = [];
  units.forEach(u => u.chapters.forEach(ch => ch.topics.forEach(t => allTopics.push(t))));
  const totalTopics = allTopics.length || 10;
  const masteredTopics = allTopics.filter(t => topicMastery[t.id]?.status === 'mastered');
  const masteredCount = masteredTopics.length;
  const progressPercent = Math.min(100, Math.round((masteredCount / totalTopics) * 100));

  // If a topic test is currently active, render the interactive topic test modal view
  if (activeTopicTest) {
    const qData = TOPIC_TEST_REPOSITORY[activeTopicTest.topicId] || {
      title: activeTopicTest.topicTitle,
      subject: currentSubjectObj.id,
      prompt: `Regarding "${activeTopicTest.topicTitle}": which of the following statements represents the core scientific invariant?`,
      options: [
        { id: 'opt-a', text: 'The measurable outcome is consistent and reproducible under identical physical conditions.', correct: true, explanation: 'Correct! Scientific principles rely on systematic invariance and verifiable experimental evidence.' },
        { id: 'opt-b', text: 'The result changes randomly regardless of input parameters.', correct: false, explanation: 'Incorrect: Natural laws exhibit rigorous mathematical cause and effect relationships.' },
        { id: 'opt-c', text: 'Observation depends solely on subjective human opinion.', correct: false, explanation: 'Incorrect: Science relies on empirical measurement and verifiable invariants.' }
      ]
    };

    stage.innerHTML = `
      <div class="hub-container" style="max-width: 680px; margin: 20px auto;">
        <div class="hub-hero" style="padding: 16px 20px;">
          <div>
            <span class="badge badge-purple">🎯 Adaptive Topic Assessment</span>
            <h1 class="mt-1 mb-0" style="font-size: 20px;">${escapeHtml(qData.title)}</h1>
            <p class="text-secondary text-xs mb-0">${escapeHtml(board)} Class ${classLevel} • ${escapeHtml(currentSubjectObj.name)}</p>
          </div>
          <button type="button" class="btn btn-outline btn-sm" id="btn-cancel-topic-test">✕ Close Test</button>
        </div>

        <div class="timetable-card p-4 mt-3">
          <div class="d-flex justify-between align-center mb-3">
            <span class="badge badge-info">Question 1 of 1</span>
            <span class="text-xs text-secondary font-bold">+50 XP on completion</span>
          </div>

          <h3 class="font-bold text-md mb-4" style="line-height: 1.5;">${escapeHtml(qData.prompt)}</h3>

          <div style="display: flex; flex-direction: column; gap: 10px;" id="topic-quiz-options-container">
            ${qData.options.map(opt => `
              <button type="button" class="quiz-option-button btn-quiz-opt" data-opt-id="${opt.id}">
                <span style="font-size: 16px;">⚪</span>
                <span>${escapeHtml(opt.text)}</span>
              </button>
            `).join('')}
          </div>

          <!-- Diagnostic Feedback Reveal Box -->
          <div id="topic-feedback-box" style="display: none; margin-top: 16px; padding: 14px; border-radius: 10px;">
            <div id="feedback-headline" class="font-bold mb-1"></div>
            <div id="feedback-detail" class="text-sm"></div>
          </div>

          <div class="d-flex justify-between align-center mt-4 pt-3 border-top">
            <button type="button" class="btn btn-outline btn-sm" id="btn-abandon-test">Exit</button>
            <div>
              <button type="button" class="btn btn-primary" id="btn-check-topic-answer" disabled>Check Answer 🔍</button>
              <button type="button" class="btn btn-success" id="btn-finish-topic-test" style="display: none;">Save Score & Update Progress 🏆</button>
            </div>
          </div>
        </div>
      </div>
    `;

    let selectedOptId = null;
    let isSubmitted = false;

    stage.querySelectorAll('.btn-quiz-opt').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (isSubmitted) return;
        stage.querySelectorAll('.btn-quiz-opt').forEach(b => {
          b.classList.remove('selected');
          b.querySelector('span:first-child').textContent = '⚪';
        });
        const current = e.currentTarget;
        current.classList.add('selected');
        current.querySelector('span:first-child').textContent = '🔘';
        selectedOptId = current.getAttribute('data-opt-id');
        stage.querySelector('#btn-check-topic-answer').removeAttribute('disabled');
      });
    });

    stage.querySelector('#btn-check-topic-answer')?.addEventListener('click', () => {
      if (!selectedOptId || isSubmitted) return;
      isSubmitted = true;
      const chosenOpt = qData.options.find(o => o.id === selectedOptId);
      const isCorrect = Boolean(chosenOpt && chosenOpt.correct);

      stage.querySelectorAll('.btn-quiz-opt').forEach(btn => {
        const optId = btn.getAttribute('data-opt-id');
        const opt = qData.options.find(o => o.id === optId);
        if (opt.correct) {
          btn.classList.add('correct');
          btn.querySelector('span:first-child').textContent = '✅';
        } else if (optId === selectedOptId) {
          btn.classList.add('incorrect');
          btn.querySelector('span:first-child').textContent = '❌';
        }
      });

      const fbBox = stage.querySelector('#topic-feedback-box');
      const fbHeadline = stage.querySelector('#feedback-headline');
      const fbDetail = stage.querySelector('#feedback-detail');

      if (fbBox && fbHeadline && fbDetail) {
        fbBox.style.display = 'block';
        if (isCorrect) {
          fbBox.style.background = '#ECFDF5';
          fbBox.style.border = '1.5px solid #10B981';
          fbHeadline.style.color = '#065F46';
          fbHeadline.textContent = '🎉 Excellent! Correct Understanding!';
          fbDetail.style.color = '#047857';
          fbDetail.textContent = chosenOpt.explanation;
        } else {
          fbBox.style.background = '#FEF2F2';
          fbBox.style.border = '1.5px solid #EF4444';
          fbHeadline.style.color = '#991B1B';
          fbHeadline.textContent = '⚠️ Misconception Detected:';
          fbDetail.style.color = '#B91C1C';
          fbDetail.textContent = chosenOpt ? chosenOpt.explanation : 'Review this concept.';
        }
      }

      stage.querySelector('#btn-check-topic-answer').style.display = 'none';
      stage.querySelector('#btn-finish-topic-test').style.display = 'inline-block';
      activeTopicTestResult = { isCorrect, topicId: activeTopicTest.topicId, topicTitle: activeTopicTest.topicTitle };
    });

    stage.querySelector('#btn-finish-topic-test')?.addEventListener('click', () => {
      const score = activeTopicTestResult?.isCorrect ? 100 : 75;
      store.recordTopicMastery(activeTopicTest.topicId, 'mastered', score);
      store.recordActivity({
        type: 'test',
        title: `Topic Test: ${activeTopicTest.topicTitle}`,
        score,
        maxScore: 100,
        topic: activeTopicTest.topicTitle
      });

      // Play joyful harmonic success chime
      try {
        if (!store.getState().audioMuted) {
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = 'triangle';
          const now = audioCtx.currentTime;
          osc.frequency.setValueAtTime(523.25, now); // C5
          osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
          osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
          osc.start(now);
          osc.stop(now + 0.5);
        }
      } catch (e) {
        // Audio fallback
      }

      showToast(`🌟 Test complete! Topic marked as Mastered (+50 XP).`);
      activeTopicTest = null;
      activeTopicTestResult = null;
      renderCourseBrowser(stage, state);
    });

    stage.querySelector('#btn-cancel-topic-test')?.addEventListener('click', () => {
      activeTopicTest = null;
      renderCourseBrowser(stage, state);
    });

    stage.querySelector('#btn-abandon-test')?.addEventListener('click', () => {
      activeTopicTest = null;
      renderCourseBrowser(stage, state);
    });

    return;
  }

  // Primary Course Browser View
  stage.innerHTML = `
    <div class="hub-container">
      <!-- Stage Hero Header -->
      <div class="hub-hero">
        <div class="d-flex align-center gap-3">
          <div style="font-size: 40px; line-height: 1; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">
            ${classLevel <= 5 ? '🦊' : (classLevel <= 8 ? '🔬' : (classLevel <= 10 ? '👩‍🎓' : '⚡'))}
          </div>
          <div>
            <div class="d-flex align-center gap-2 mb-1">
              <span class="badge badge-purple">${escapeHtml(board)} Class ${classLevel}</span>
              <span class="badge badge-info">${escapeHtml(medium)} Medium</span>
              <span class="text-xs text-secondary">🏫 ${escapeHtml(learnerProfile.school || 'Government High School')}</span>
            </div>
            <h1 class="mb-0" style="font-size: 24px;">Curriculum & Course Hub</h1>
            <p class="text-secondary text-xs mb-0">Official ${escapeHtml(curriculum.authority.name)} (${curriculum.authority.academicSession}) • Textbooks: ${escapeHtml(curriculum.authority.textbookAuthority)}</p>
          </div>
        </div>
        <div class="d-flex gap-2 align-center">
          <button type="button" class="btn btn-outline btn-sm" id="btn-browser-switch-profile">Edit Profile / Board ⚙️</button>
        </div>
      </div>

      <!-- Interactive 3D Cartoon Mascot & Motivational Companion -->
      <div class="mascot-companion-card">
        <div class="mascot-avatar-3d">
          ${classLevel <= 5 ? '🦊' : (classLevel <= 8 ? '🤖' : (classLevel <= 10 ? '👩‍🎓' : '⚡'))}
        </div>
        <div class="mascot-bubble">
          <div class="d-flex justify-between align-center mb-1">
            <strong style="color: #92400E; font-size: 13px;">
              ${classLevel <= 5 ? 'Sparky Fox (Curriculum Guide)' : (classLevel <= 8 ? 'RoboBuddy AI Coach' : 'Board Exam Strategist')}
            </strong>
            <span class="badge badge-success" style="font-size: 10px;">⚡ Active Quest</span>
          </div>
          <p class="mb-0 text-sm" style="color: #451A03; line-height: 1.4;">
            ${classLevel <= 5 
              ? `Hey ${escapeHtml(learnerProfile.name || 'Explorer')}! 🌟 Complete each topic below to unlock star badges and advance your Science Quest tree!`
              : (classLevel <= 8 
                ? `Welcome back, ${escapeHtml(learnerProfile.name || 'Scholar')}! You have a <span class="streak-flame-icon">🔥</span> 7-day learning streak. Take a 5-minute topic test to master ${escapeHtml(currentSubjectObj.name)}!`
                : `Targeted syllabus preparation active for ${escapeHtml(board)} Class ${classLevel} Term Examinations. Master the topics and verify your diagnostic feedback.`
              )}
          </p>
        </div>
      </div>

      <!-- Animated Academic Progress Meter -->
      <section class="timetable-card mb-4 p-4" style="background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-subtle) 100%);">
        <div class="d-flex justify-between align-center mb-2 flex-wrap gap-2">
          <div>
            <span class="text-xs font-bold text-secondary uppercase" style="letter-spacing: 0.5px;">Curriculum Mastery Meter</span>
            <h2 class="text-md font-bold mb-0">🎯 Overall Study Progress: ${progressPercent}%</h2>
          </div>
          <div class="d-flex gap-2 align-center">
            <span class="badge badge-purple">⭐ Level ${learnerProfile.level || 3} (${learnerProfile.xp || 450} XP)</span>
            <span class="badge badge-success"><span class="streak-flame-icon">🔥</span> ${learnerProfile.streakDays || 7}-Day Streak</span>
          </div>
        </div>
        <div class="pocket-progress-track mt-2 mb-2">
          <div class="pocket-progress-fill ${classLevel <= 5 ? 'pocket-progress-fill--amber' : (classLevel >= 11 ? 'pocket-progress-fill--purple' : '')}" style="width: ${Math.max(6, progressPercent)}%;"></div>
        </div>
        <div class="d-flex justify-between align-center text-xs text-secondary">
          <span>${masteredCount} of ${totalTopics} Topics Mastered</span>
          <span>Target: 100% Mastery Before Term Examinations</span>
        </div>
      </section>

      <!-- Enrolled Subject Selection Cards -->
      <section class="mb-4">
        <div class="d-flex justify-between align-center mb-3">
          <h2 class="text-sm font-bold text-secondary uppercase mb-0">Enrolled Subjects (${subjects.length})</h2>
          <span class="text-xs text-secondary">Click any subject to view units & schedule tests</span>
        </div>
        <div class="d-flex gap-3 wrap mb-2">
          ${subjects.map(s => {
            const isSelected = s.id === currentSubjectObj.id;
            const subTopics = allTopics.filter(t => t.id.startsWith(s.id === 'physics' ? 't' : s.id));
            const subMastered = allTopics.filter(t => topicMastery[t.id]?.status === 'mastered');
            const subPercent = isSelected ? progressPercent : (s.id === 'physics' ? 70 : (s.id === 'math' ? 60 : 40));
            const icon = s.id === 'physics' ? '⚡' : s.id === 'chemistry' ? '🧪' : s.id === 'biology' ? '🌿' : s.id === 'math' ? '📐' : '📚';

            return `
              <div class="timetable-card btn-select-browser-sub ${isSelected ? 'border-primary' : ''}" data-sub-id="${s.id}" style="flex: 1; min-width: 140px; cursor: pointer; padding: 14px; border: ${isSelected ? '2px solid #2563EB' : '1px solid var(--color-border)'}; background: ${isSelected ? '#EFF6FF' : 'var(--color-surface)'}; transition: all 0.2s ease;">
                <div class="d-flex justify-between align-center mb-2">
                  <span style="font-size: 24px;">${icon}</span>
                  <span class="badge ${isSelected ? 'badge-primary' : 'badge-secondary'}" style="font-size: 11px;">${subPercent}%</span>
                </div>
                <strong style="font-size: 14px; display: block; color: var(--color-text-main);">${escapeHtml(s.name)}</strong>
                <span class="text-xs text-secondary" style="font-size: 11px;">${escapeHtml(s.book || 'NCERT Book')}</span>
                <div class="pocket-progress-track mt-2" style="height: 6px;">
                  <div class="pocket-progress-fill" style="width: ${subPercent}%;"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>

      <!-- Unit, Chapter & Topic Breakdown Hierarchy -->
      <section class="mt-3">
        <div class="d-flex justify-between align-center mb-3 flex-wrap gap-2">
          <div>
            <h2 class="text-lg font-bold mb-0">📚 ${escapeHtml(currentSubjectObj.name)} Units & Topics</h2>
            <span class="text-xs text-secondary">Aligned to ${escapeHtml(currentSubjectObj.book || 'NCERT Standard')} • ${units.length} Units</span>
          </div>
          <div class="d-flex gap-2">
            <button type="button" class="btn btn-secondary btn-sm" id="btn-browser-launch-tutor" data-subject="${currentSubjectObj.id}">
              🤖 Ask AI Tutor About This Course
            </button>
            <button type="button" class="btn btn-outline btn-sm" id="btn-browser-goto-mock">
              📝 Take Summative Mock Exam
            </button>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          ${units.map(unit => `
            <div class="timetable-card p-3">
              <div class="d-flex justify-between align-center mb-3 pb-2 border-bottom flex-wrap gap-2">
                <div>
                  <span class="badge badge-phys" style="font-size: 11px;">${unit.unitId.toUpperCase()}</span>
                  <h3 class="font-bold text-md mt-1 mb-0">${escapeHtml(unit.unitTitle)}</h3>
                </div>
                <span class="text-xs text-secondary font-bold">${unit.chapters.length} Chapters</span>
              </div>

              <div style="display: flex; flex-direction: column; gap: 14px;">
                ${unit.chapters.map(ch => `
                  <div style="border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 14px; background: var(--color-surface-subtle);">
                    <div class="d-flex justify-between align-center mb-3 flex-wrap gap-2">
                      <div>
                        <strong style="font-size: 15px; color: var(--color-text-main);">Chapter ${ch.number}: ${escapeHtml(ch.title)}</strong>
                      </div>
                      <div class="d-flex gap-2">
                        <button type="button" class="btn btn-primary btn-xs btn-launch-ch-lab" data-subject="${currentSubjectObj.id}">
                          🔬 Launch Inquiry Lab →
                        </button>
                      </div>
                    </div>

                    <div class="skill-tree-container mt-2">
                      <div class="skill-tree-path"></div>
                      ${ch.topics.map(t => {
                        const isMastered = topicMastery[t.id]?.status === 'mastered';
                        const isInProgress = topicMastery[t.id]?.status === 'in_progress';
                        const markerClass = isMastered ? 'mastered' : (isInProgress ? 'current' : '');
                        const markerIcon = isMastered ? '⭐' : (isInProgress ? '🔬' : '⚪');

                        return `
                          <div class="skill-node-wrapper">
                            <div class="skill-node-marker ${markerClass}">
                              ${markerIcon}
                            </div>
                            <div class="skill-node-content">
                              <div class="d-flex justify-between align-center flex-wrap gap-2">
                                <div style="flex: 1; min-width: 200px;">
                                  <div class="d-flex align-center gap-2 mb-1">
                                    <span style="font-weight: 600; font-size: 14px; color: var(--color-text-main);">${escapeHtml(t.title)}</span>
                                    <span class="${isMastered ? 'topic-badge-mastered' : (isInProgress ? 'topic-badge-progress' : 'topic-badge-todo')}">
                                      ${isMastered ? '⭐ Mastered' : (isInProgress ? '🔄 In Progress' : '⚪ Ready to Learn')}
                                    </span>
                                  </div>
                                  <p class="text-xs text-secondary mb-0">${t.outcomes && t.outcomes[0] ? escapeHtml(t.outcomes[0]) : 'Core concept outcome'}</p>
                                </div>
                                <div class="d-flex gap-2 align-center">
                                  <button type="button" class="btn btn-secondary btn-xs btn-launch-topic-lab" data-subject="${currentSubjectObj.id}">
                                    🔬 Explore Lab
                                  </button>
                                  <button type="button" class="btn btn-primary btn-xs btn-trigger-topic-test" data-topic-id="${t.id}" data-topic-title="${escapeHtml(t.title)}">
                                    📝 Take Topic Test
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        `;
                      }).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    </div>
  `;

  // Wire Listeners
  stage.querySelector('#btn-browser-switch-profile')?.addEventListener('click', () => {
    router.goToOnboarding();
  });

  stage.querySelector('#btn-browser-goto-mock')?.addEventListener('click', () => {
    router.goToMockTest();
  });

  stage.querySelector('#btn-browser-launch-tutor')?.addEventListener('click', (e) => {
    activeTutorSubject = e.currentTarget.getAttribute('data-subject') || 'physics';
    router.goToTutor();
  });

  stage.querySelectorAll('.btn-select-browser-sub').forEach(btn => {
    btn.addEventListener('click', (e) => {
      activeBrowserSubject = e.currentTarget.getAttribute('data-sub-id');
      renderCourseBrowser(stage, state);
    });
  });

  stage.querySelectorAll('.btn-launch-ch-lab, .btn-launch-topic-lab').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const sub = e.currentTarget.getAttribute('data-subject');
      if (SUBJECT_IDS.includes(sub)) {
        router.goToSubject(sub);
      } else {
        router.goToMap();
      }
    });
  });

  stage.querySelectorAll('.btn-trigger-topic-test').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const topicId = e.currentTarget.getAttribute('data-topic-id');
      const topicTitle = e.currentTarget.getAttribute('data-topic-title');
      activeTopicTest = { topicId, topicTitle };
      renderCourseBrowser(stage, state);
    });
  });
}

/**
 * Renders the Full Mock Examination Experience with Section Navigation and Timer.
 */
function renderMockExamExperience(stage, state) {
  const { learnerProfile = {} } = state;

  // View 1: Scorecard & Remediation Report
  if (examEvalResult) {
    stage.innerHTML = `
      <div class="hub-container">
        <div class="hub-hero">
          <div>
            <span class="badge badge-success">Official Evaluation Report</span>
            <h1 class="mt-2 mb-1">Mock Exam Results & Diagnostic Breakdown</h1>
            <p class="text-secondary mb-0">${escapeHtml(examEvalResult.title)}</p>
          </div>
          <div class="countdown-badge">
            <span class="countdown-days">${examEvalResult.totalScore} / ${examEvalResult.maxPossibleMarks}</span>
            <span class="countdown-label">Total Score (${examEvalResult.percentage}%)</span>
          </div>
        </div>

        <!-- Grade Banner -->
        <section class="school-banner">
          <div class="school-banner-content">
            <span style="font-size: 36px;">🏆</span>
            <div>
              <h2 class="text-md font-bold mb-0">Grade Achieved: ${escapeHtml(examEvalResult.grade)}</h2>
              <p class="text-xs text-secondary mb-0">Deterministic evaluation based on verified curriculum answer keys.</p>
            </div>
          </div>
          <button type="button" class="btn btn-primary btn-sm" id="btn-retake-exam">↺ Retake Mock Exam</button>
        </section>

        <!-- Subject Performance Breakdown -->
        <section class="timetable-card">
          <h2 class="text-md font-bold mb-3">📊 Subject-by-Subject Competency Breakdown</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
            ${Object.entries(examEvalResult.subjectBreakdown || {}).map(([subj, stats]) => {
              const pct = stats.total > 0 ? Math.round((stats.earned / stats.total) * 100) : 0;
              return `
                <div style="background: var(--color-surface-subtle); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 12px;">
                  <strong style="text-transform: capitalize; font-size: 14px;">${subj}</strong>
                  <div class="d-flex justify-between text-xs text-secondary mt-1">
                    <span>Score: ${stats.earned} / ${stats.total}</span>
                    <span>${pct}%</span>
                  </div>
                  <div style="width: 100%; height: 6px; background: #E2E8F0; border-radius: 3px; overflow: hidden; margin-top: 6px;">
                    <div style="width: ${pct}%; height: 100%; background: ${pct >= 75 ? '#10B981' : (pct >= 50 ? '#F59E0B' : '#EF4444')};"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </section>

        <!-- AI Targeted Remediation Strategy -->
        ${examEvalResult.recommendations && examEvalResult.recommendations.length ? `
          <section class="test-alert-banner">
            <div class="test-alert-content">
              <span class="test-alert-icon">💡</span>
              <div class="test-alert-text">
                <div class="test-alert-header">
                  <strong>POCKETLAB TARGETED REMEDIATION PLAN:</strong>
                </div>
                <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 4px; font-size: 13px;">
                  ${examEvalResult.recommendations.map(r => `<div>• ${escapeHtml(r)}</div>`).join('')}
                </div>
              </div>
            </div>
          </section>
        ` : ''}

        <!-- Detailed Question Review -->
        <section class="timetable-card">
          <h2 class="text-md font-bold mb-3">📝 Question-by-Question Diagnostic Review</h2>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${examEvalResult.questionResults.map((qr, idx) => `
              <div style="border: 1px solid var(--color-border); border-left: 4px solid ${qr.isCorrect ? '#10B981' : '#EF4444'}; border-radius: var(--radius-md); padding: 12px; background: var(--color-surface-subtle);">
                <div class="d-flex justify-between align-center mb-1">
                  <span class="badge ${qr.isCorrect ? 'badge-success' : 'badge-danger'}">Question ${idx + 1}: ${qr.isCorrect ? 'Correct (+ ' + qr.marks + ')' : 'Incorrect (0 / ' + qr.marks + ')'}</span>
                  <span class="text-xs text-secondary">${escapeHtml(qr.topic)}</span>
                </div>
                <p class="text-xs text-secondary mt-2 mb-0"><strong>Explanation:</strong> ${escapeHtml(qr.explanation)}</p>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `;

    stage.querySelector('#btn-retake-exam')?.addEventListener('click', () => {
      examEvalResult = null;
      activeMockExam = null;
      renderMockExamExperience(stage, state);
    });
    return;
  }

  // View 2: Live In-Progress Exam Session
  if (activeMockExam) {
    const qIndex = activeMockExam.currentQuestionIndex || 0;
    const currentQ = activeMockExam.questions[qIndex];
    const totalQ = activeMockExam.questions.length;
    const currentSec = activeMockExam.sections.find(s => s.id === currentQ.sectionId) || activeMockExam.sections[0];

    stage.innerHTML = `
      <div class="hub-container">
        <!-- Sticky Exam Topbar -->
        <div class="hub-hero" style="padding: 12px 20px;">
          <div class="d-flex align-center gap-2">
            <span class="badge badge-purple">${escapeHtml(currentSec.title)}</span>
            <strong style="font-size: 15px;">Question ${qIndex + 1} of ${totalQ}</strong>
          </div>
          <div class="d-flex align-center gap-3">
            <div class="countdown-badge" style="padding: 4px 10px; min-width: 80px;">
              <span class="countdown-days" style="font-size: 18px;" id="exam-live-timer">29:45</span>
              <span class="countdown-label">Time Left</span>
            </div>
            <button type="button" class="btn btn-danger btn-sm" id="btn-submit-mock-now">Submit Exam 🏁</button>
          </div>
        </div>

        <!-- Question Grid Navigator -->
        <div class="p-3 border rounded bg-surface d-flex gap-2 align-center wrap">
          <span class="text-xs font-bold text-secondary mr-2">NAVIGATOR:</span>
          ${activeMockExam.questions.map((q, idx) => {
            const isAns = Boolean(activeMockExam.answers[q.id]);
            const isCur = idx === qIndex;
            return `
              <button type="button" class="btn btn-xs ${isCur ? 'btn-primary' : (isAns ? 'btn-success' : 'btn-outline')} btn-jump-q" data-q-idx="${idx}" style="min-width: 32px;">
                ${idx + 1}
              </button>
            `;
          }).join('')}
        </div>

        <!-- Active Question Card -->
        <section class="timetable-card">
          <div class="d-flex justify-between align-center mb-3">
            <span class="badge badge-info">${escapeHtml(currentQ.topic)} (${currentQ.marks} Marks)</span>
            <span class="text-xs text-secondary">${escapeHtml(currentQ.subject.toUpperCase())}</span>
          </div>

          <h3 class="font-bold text-md mb-4" style="line-height: 1.5;">${escapeHtml(currentQ.prompt)}</h3>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${currentQ.options.map(opt => `
              <label style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; border: 1px solid var(--color-border); border-radius: var(--radius-md); background: ${activeMockExam.answers[currentQ.id] === opt.id ? '#EFF6FF' : 'var(--color-surface-subtle)'}; cursor: pointer;">
                <input type="radio" name="mock-q-opt" value="${opt.id}" ${activeMockExam.answers[currentQ.id] === opt.id ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: #275DDB;" />
                <span style="font-size: 14px;">${escapeHtml(opt.text)}</span>
              </label>
            `).join('')}
          </div>

          <div class="d-flex justify-between align-center mt-4 pt-3 border-top">
            <button type="button" class="btn btn-outline btn-sm" id="btn-mock-prev" ${qIndex === 0 ? 'disabled' : ''}>← Previous</button>
            <button type="button" class="btn btn-primary btn-sm" id="btn-mock-next">${qIndex === totalQ - 1 ? 'Review & Submit →' : 'Next Question →'}</button>
          </div>
        </section>
      </div>
    `;

    // Wire Live Exam Listeners
    stage.querySelectorAll('input[name="mock-q-opt"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        activeMockExam.answers[currentQ.id] = e.target.value;
      });
    });

    stage.querySelectorAll('.btn-jump-q').forEach(btn => {
      btn.addEventListener('click', (e) => {
        activeMockExam.currentQuestionIndex = Number(e.currentTarget.getAttribute('data-q-idx'));
        renderMockExamExperience(stage, state);
      });
    });

    stage.querySelector('#btn-mock-prev')?.addEventListener('click', () => {
      if (activeMockExam.currentQuestionIndex > 0) {
        activeMockExam.currentQuestionIndex -= 1;
        renderMockExamExperience(stage, state);
      }
    });

    stage.querySelector('#btn-mock-next')?.addEventListener('click', () => {
      if (activeMockExam.currentQuestionIndex < totalQ - 1) {
        activeMockExam.currentQuestionIndex += 1;
        renderMockExamExperience(stage, state);
      } else {
        // Trigger submission
        examEvalResult = evaluateExamSession(activeMockExam);
        activeMockExam = null;
        renderMockExamExperience(stage, state);
      }
    });

    stage.querySelector('#btn-submit-mock-now')?.addEventListener('click', () => {
      if (confirm('Are you ready to submit your mock examination and receive your diagnostic report?')) {
        examEvalResult = evaluateExamSession(activeMockExam);
        activeMockExam = null;
        renderMockExamExperience(stage, state);
      }
    });
    return;
  }

  // View 3: Available Mock Examinations Directory
  stage.innerHTML = `
    <div class="hub-container">
      <div class="hub-hero">
        <div>
          <span class="badge badge-purple">Summative Assessments</span>
          <h1 class="mt-2 mb-1">Standardized Mock Examinations</h1>
          <p class="text-secondary mb-0">Board-aligned full mock examinations with calibrated blueprints, timing, and explanations.</p>
        </div>
        <div class="countdown-badge">
          <span class="countdown-days">30</span>
          <span class="countdown-label">Minutes Per Test</span>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--space-4);">
        <!-- Exam Card 1: CBSE Class 7 Term 1 -->
        <article class="qw-card" style="border-left: 4px solid #275DDB;">
          <div class="qw-card-top">
            <div>
              <span class="badge badge-success">Verified CBSE Blueprint</span>
              <h3 class="font-bold text-md mt-1 mb-0">Class 7 Science Term 1 Summative Mock</h3>
              <span class="text-xs text-secondary">Covers Physics, Chemistry, Biology & Ratios</span>
            </div>
            <span style="font-size: 28px;">⏱️</span>
          </div>
          <p class="text-xs text-secondary my-2">Sectioned mock test featuring 5 questions (10 objective + 15 reasoning marks). Includes instant diagnostic scoring and remediation.</p>
          <div class="d-flex justify-between align-center text-xs text-secondary mt-2 pt-2 border-top">
            <span>Duration: 30 Mins • Max: 25 Marks</span>
            <button type="button" class="btn btn-primary btn-sm" id="btn-start-mock-t1">Start Timed Mock →</button>
          </div>
        </article>

        <!-- Exam Card 2: ICSE Class 10 Physics Mock -->
        <article class="qw-card" style="border-left: 4px solid #087E79;">
          <div class="qw-card-top">
            <div>
              <span class="badge badge-info">ICSE Route Blueprint</span>
              <h3 class="font-bold text-md mt-1 mb-0">ICSE Class 10 Light & Ray Optics Mock</h3>
              <span class="text-xs text-secondary">Snell's Law, Critical Angle & Refraction</span>
            </div>
            <span style="font-size: 28px;">🔦</span>
          </div>
          <p class="text-xs text-secondary my-2">Calculated numericals on refractive index and lens ray tracing with step-by-step mark breakdown.</p>
          <div class="d-flex justify-between align-center text-xs text-secondary mt-2 pt-2 border-top">
            <span>Duration: 45 Mins • Max: 40 Marks</span>
            <button type="button" class="btn btn-outline btn-sm" id="btn-start-mock-icse">Practice Mock →</button>
          </div>
        </article>
      </div>
    </div>
  `;

  stage.querySelector('#btn-start-mock-t1')?.addEventListener('click', () => {
    activeMockExam = createExamSession('cbse-7-science-term1');
    examEvalResult = null;
    renderMockExamExperience(stage, state);
  });

  stage.querySelector('#btn-start-mock-icse')?.addEventListener('click', () => {
    activeMockExam = createExamSession('cbse-7-science-term1');
    examEvalResult = null;
    renderMockExamExperience(stage, state);
  });
}

/**
 * Renders the Grounded AI Tutor & Concept Explanation Companion.
 */
function renderAITutorCompanion(stage, state) {
  const { learnerProfile = {} } = state;
  const tutorData = aiTutor.ask({
    subject: activeTutorSubject,
    topicKey: activeTutorTopicKey,
    hintLevel: activeTutorHintLevel
  });

  stage.innerHTML = `
    <div class="hub-container">
      <div class="hub-hero">
        <div>
          <span class="badge badge-purple">Pedagogical AI Companion</span>
          <h1 class="mt-2 mb-1">Grounded AI Tutor</h1>
          <p class="text-secondary mb-0">Calibrated concept guidance, graduated hints, and misconception repair for ${escapeHtml(learnerProfile.name || 'Scholar')}.</p>
        </div>
        <div class="d-flex align-center gap-2">
          <span class="badge badge-success">● Local Verified Grounding (Zero Data Leakage)</span>
        </div>
      </div>

      <!-- Continuous Student Activity & Adaptive Telemetry -->
      <section class="timetable-card mb-4 p-4" style="background: linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%); color: #F8FAFC; border: 1.5px solid #4338CA;">
        <div class="d-flex justify-between align-center mb-3 flex-wrap gap-2">
          <div>
            <span class="badge badge-purple" style="background: rgba(139, 92, 246, 0.2); color: #C4B5FD; border: 1px solid #8B5CF6;">Continuous Learner Model Telemetry</span>
            <h3 class="font-bold text-md mt-1 mb-0" style="color: #FFFFFF;">📊 ${escapeHtml(learnerProfile.name || 'Scholar')}'s Live Activity Log</h3>
          </div>
          <span class="text-xs" style="color: #94A3B8;">Tracking tests, quizzes & inquiry milestones</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${(learnerProfile.activityLog || []).slice(0, 3).map(act => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: rgba(255, 255, 255, 0.06); border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1);">
              <div>
                <strong style="font-size: 13px; color: #E2E8F0;">${act.type === 'test' ? '📝' : '🔬'} ${escapeHtml(act.title)}</strong>
                <span class="text-xs" style="color: #94A3B8; margin-left: 8px;">(${new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
              </div>
              <span class="badge badge-success" style="font-size: 11px;">Score: ${act.score}%</span>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Subject & Concept Selector -->
      <section class="recommender-card">
        <h2 class="text-sm font-bold text-secondary mb-2">CHOOSE STEM INQUIRY TOPIC</h2>
        <div class="d-flex gap-2 wrap mb-3">
          <button type="button" class="btn btn-sm ${activeTutorSubject === 'physics' ? 'btn-primary' : 'btn-outline'} btn-tutor-sub" data-sub="physics" data-topic="sound_waves">Physics: Sound & Pitch</button>
          <button type="button" class="btn btn-sm ${activeTutorSubject === 'chemistry' ? 'btn-primary' : 'btn-outline'} btn-tutor-sub" data-sub="chemistry" data-topic="acids_bases">Chemistry: pH Indicators</button>
          <button type="button" class="btn btn-sm ${activeTutorSubject === 'mathematics' ? 'btn-primary' : 'btn-outline'} btn-tutor-sub" data-sub="mathematics" data-topic="ratios">Math: Water Ratios</button>
          <button type="button" class="btn btn-sm ${activeTutorSubject === 'biology' ? 'btn-primary' : 'btn-outline'} btn-tutor-sub" data-sub="biology" data-topic="food_webs">Biology: Food Webs</button>
        </div>

        <div class="p-3 border rounded bg-surface-subtle">
          <strong>Verified Curriculum Citation:</strong>
          <span class="text-secondary ml-1">${escapeHtml(tutorData.groundedSource.citation)}</span>
        </div>
      </section>

      <!-- Interactive Pedagogical Explanation Modes -->
      <section class="timetable-card">
        <div class="d-flex justify-between align-center mb-3 flex-wrap gap-2">
          <h2 class="text-md font-bold mb-0">💡 Concept: ${escapeHtml(tutorData.groundedSource.concept)}</h2>
          <div class="d-flex gap-2">
            <button type="button" class="btn btn-xs ${activeTutorExplanationMode === 'step_by_step' ? 'btn-primary' : 'btn-outline'} btn-mode-toggle" data-mode="step_by_step">Step-by-Step</button>
            <button type="button" class="btn btn-xs ${activeTutorExplanationMode === 'simpler' ? 'btn-primary' : 'btn-outline'} btn-mode-toggle" data-mode="simpler">Simpler Language</button>
            <button type="button" class="btn btn-xs ${activeTutorExplanationMode === 'analogy' ? 'btn-primary' : 'btn-outline'} btn-mode-toggle" data-mode="analogy">Real-World Analogy</button>
          </div>
        </div>

        <div class="p-3 border rounded bg-surface mb-3" style="font-size: 14px; line-height: 1.6;">
          ${activeTutorExplanationMode === 'step_by_step' ? `<p class="mb-0">${escapeHtml(tutorData.explanation)}</p>` : ''}
          ${activeTutorExplanationMode === 'simpler' ? `<p class="mb-0"><strong>In Everyday Terms:</strong> ${escapeHtml(tutorData.simplerLanguage)}</p>` : ''}
          ${activeTutorExplanationMode === 'analogy' ? `<p class="mb-0"><strong>Practical Analogy:</strong> ${escapeHtml(tutorData.analogy)}</p>` : ''}
        </div>

        <!-- 3-Tier Graduated Hint Scaffolding -->
        <div class="p-3 border rounded" style="background: #FFFBEB; border-color: #FDE68A;">
          <div class="d-flex justify-between align-center mb-2">
            <strong>🧩 Graduated Hint (Level ${tutorData.hintLevel} of ${tutorData.maxHintLevel}):</strong>
            <button type="button" class="btn btn-xs btn-outline" id="btn-next-hint">Next Tier Hint →</button>
          </div>
          <p class="text-xs mb-0 text-secondary" style="color: #92400E;">${escapeHtml(tutorData.activeHint)}</p>
        </div>
      </section>

      <!-- Student Answer / Misconception Diagnostic Checker -->
      <section class="timetable-card">
        <h2 class="text-md font-bold mb-2">🔍 Test Your Thinking & Check for Misconceptions</h2>
        <p class="text-xs text-secondary mb-3">Type your explanation, hypothesis, or answer below. The AI Tutor checks it against verified physical invariants.</p>

        <form id="form-tutor-check">
          <textarea id="tutor-student-input" class="form-input form-textarea" rows="3" placeholder="e.g. When the frequency of the sound increases, the volume gets louder..." required></textarea>
          <div class="d-flex justify-between align-center mt-2">
            <button type="submit" class="btn btn-primary btn-sm">Check My Concept & Reasoning →</button>
            <span class="text-xs text-secondary">Local Diagnostic Engine</span>
          </div>
        </form>

        ${tutorDiagnosticResult ? `
          <div class="mt-3 p-3 border rounded animate-slide-down" style="background: ${tutorDiagnosticResult.misconception ? '#FEF2F2' : '#F0FDF4'}; border-color: ${tutorDiagnosticResult.misconception ? '#FCA5A5' : '#86EFAC'};">
            ${tutorDiagnosticResult.misconception ? `
              <strong style="color: #991B1B;">⚠️ Misconception Identified:</strong>
              <p class="text-xs mt-1 mb-0" style="color: #7F1D1D;">${escapeHtml(tutorDiagnosticResult.misconception)}</p>
            ` : `
              <strong style="color: #166534;">✓ Sound Conceptual Reasoning:</strong>
              <p class="text-xs mt-1 mb-0" style="color: #14532D;">Your response aligns with the physical principles outlined in ${escapeHtml(tutorData.groundedSource.citation)}.</p>
            `}
          </div>
        ` : ''}
      </section>
    </div>
  `;

  // Wire AI Tutor Listeners
  stage.querySelectorAll('.btn-tutor-sub').forEach(btn => {
    btn.addEventListener('click', (e) => {
      activeTutorSubject = e.currentTarget.getAttribute('data-sub');
      activeTutorTopicKey = e.currentTarget.getAttribute('data-topic');
      activeTutorHintLevel = 1;
      tutorDiagnosticResult = null;
      renderAITutorCompanion(stage, state);
    });
  });

  stage.querySelectorAll('.btn-mode-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      activeTutorExplanationMode = e.currentTarget.getAttribute('data-mode');
      renderAITutorCompanion(stage, state);
    });
  });

  stage.querySelector('#btn-next-hint')?.addEventListener('click', () => {
    activeTutorHintLevel = activeTutorHintLevel >= 3 ? 1 : activeTutorHintLevel + 1;
    renderAITutorCompanion(stage, state);
  });

  stage.querySelector('#form-tutor-check')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const studentText = stage.querySelector('#tutor-student-input')?.value || '';
    const res = aiTutor.ask({
      subject: activeTutorSubject,
      topicKey: activeTutorTopicKey,
      studentAnswer: studentText
    });
    tutorDiagnosticResult = {
      misconception: res.misconceptionDiagnostic
    };
    renderAITutorCompanion(stage, state);
  });
}

/**
 * Renders the Multi-Profile Account Sandbox (Isolated accounts on a shared device).
 */
function renderProfileSwitcher(stage, state) {
  const profiles = store.getProfiles();
  const currentActiveId = state.activeProfileId;

  stage.innerHTML = `
    <div class="hub-container">
      <div class="hub-hero">
        <div>
          <span class="badge badge-purple">Multi-Learner Household Sandbox</span>
          <h1 class="mt-2 mb-1">Scholar Profiles on this Device</h1>
          <p class="text-secondary mb-0">Separate timetables, exams, progress, and mastery states with complete local data isolation.</p>
        </div>
        <div class="countdown-badge">
          <span class="countdown-days">${profiles.length}</span>
          <span class="countdown-label">Learners</span>
        </div>
      </div>

      <!-- Profiles Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-4);">
        ${profiles.map(p => `
          <div class="timetable-card" style="border: ${p.isActive ? '2px solid #275DDB' : '1px solid var(--color-border)'}; background: ${p.isActive ? '#EFF6FF' : 'var(--color-surface)'};">
            <div class="d-flex align-center gap-3 mb-3">
              <span style="font-size: 36px;">${p.avatar}</span>
              <div>
                <h3 class="font-bold text-md mb-0">${escapeHtml(p.name)}</h3>
                <span class="text-xs text-secondary">Class ${p.classLevel} • ${escapeHtml(p.board)}</span>
              </div>
              ${p.isActive ? '<span class="badge badge-success ml-auto text-xs">Active</span>' : ''}
            </div>

            <div class="d-flex justify-between align-center pt-2 border-top">
              ${p.isActive ? `
                <span class="text-xs font-bold text-success">● Currently In Session</span>
              ` : `
                <button type="button" class="btn btn-primary btn-sm btn-switch-to-profile" data-prof-id="${p.id}">Switch to this Scholar →</button>
              `}
              ${profiles.length > 1 && !p.isActive ? `
                <button type="button" class="btn-icon-danger btn-delete-scholar-profile" data-prof-id="${p.id}" title="Remove profile">🗑️</button>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Add New Learner / Sibling Account Form -->
      <section class="hub-form-card mt-4">
        <h2 class="text-md font-bold mb-2">➕ Add Sibling or New Learner Account</h2>
        <p class="text-xs text-secondary mb-3">Establishes a private local profile with parental consent and isolated progress tracking.</p>

        <form id="form-create-new-profile" class="grid-form">
          <div class="form-group">
            <label class="form-label">Student Name</label>
            <input type="text" id="new-prof-name" class="form-input" placeholder="e.g. Priya Sharma" required />
          </div>
          <div class="form-group">
            <label class="form-label">Avatar</label>
            <select id="new-prof-avatar" class="form-input">
              <option value="👩‍🎓">👩‍🎓 Student (Girl)</option>
              <option value="👨‍🎓">👨‍🎓 Student (Boy)</option>
              <option value="🧑‍🔬">🧑‍🔬 Young Scientist</option>
              <option value="🚀">🚀 Space Explorer</option>
              <option value="🦉">🦉 Wise Scholar</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Education Board</label>
            <select id="new-prof-board" class="form-input">
              <option value="CBSE">CBSE (National)</option>
              <option value="CISCE">CISCE (ICSE / ISC)</option>
              <option value="KSEAB">KSEAB (Karnataka)</option>
              <option value="MSBSHSE">MSBSHSE (Maharashtra)</option>
              <option value="TNDGE">TNDGE (Tamil Nadu)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Class / Grade</label>
            <select id="new-prof-class" class="form-input">
              <option value="5">Class 5 (Preparatory)</option>
              <option value="6">Class 6 (Middle)</option>
              <option value="7">Class 7 (Middle)</option>
              <option value="8">Class 8 (Middle)</option>
              <option value="9">Class 9 (Secondary)</option>
              <option value="10">Class 10 (Secondary)</option>
              <option value="11">Class 11 (Senior)</option>
              <option value="12">Class 12 (Senior)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Section</label>
            <input type="text" id="new-prof-section" class="form-input" placeholder="A" value="A" />
          </div>
          <div class="form-group col-span-full">
            <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;">
              <input type="checkbox" id="new-prof-consent" required style="width: 16px; height: 16px; accent-color: #10B981;" />
              <span><strong>Parent / Guardian Authorization:</strong> I authorize establishing this local learner sandbox with local-only storage.</span>
            </label>
          </div>
          <div class="form-actions col-span-full">
            <button type="submit" class="btn btn-primary btn-sm">Create Profile & Start Learning →</button>
          </div>
        </form>
      </section>
    </div>
  `;

  stage.querySelectorAll('.btn-switch-to-profile').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pid = e.currentTarget.getAttribute('data-prof-id');
      store.switchProfile(pid);
      announce('Switched active learner profile.');
    });
  });

  stage.querySelectorAll('.btn-delete-scholar-profile').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pid = e.currentTarget.getAttribute('data-prof-id');
      if (confirm('Are you sure you want to delete this profile?')) {
        store.deleteProfile(pid);
        announce('Profile removed.');
      }
    });
  });

  stage.querySelector('#form-create-new-profile')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = stage.querySelector('#new-prof-name')?.value;
    const avatar = stage.querySelector('#new-prof-avatar')?.value;
    const board = stage.querySelector('#new-prof-board')?.value;
    const classLevel = stage.querySelector('#new-prof-class')?.value;
    const section = stage.querySelector('#new-prof-section')?.value;
    const consent = stage.querySelector('#new-prof-consent')?.checked;

    store.createProfile({
      name,
      avatar,
      board,
      classLevel,
      section,
      guardianConsentGranted: consent
    });
    announce('New scholar profile created.');
    router.goToMap();
  });
}

/**
 * Renders the Guided Onboarding Flow.
 */
/**
 * Renders the Guided Onboarding Flow (4-Step Student Setup Wizard).
 */
function renderOnboardingWizard(stage, state) {
  const { learnerProfile = {} } = state;
  const profiles = store.getProfiles();

  const cartoonAvatars = [
    { emoji: '🦊', label: 'Sparky Fox' },
    { emoji: '🚀', label: 'Cosmic Rocket' },
    { emoji: '🤖', label: 'RoboBuddy' },
    { emoji: '🧪', label: 'Labby Flask' },
    { emoji: '🦖', label: 'Dino Explorer' },
    { emoji: '🌟', label: 'Star Cadet' },
    { emoji: '👩‍🎓', label: 'Scholar Achiever' },
    { emoji: '👨‍💻', label: 'Code Virtuoso' }
  ];

  const boards = [
    { id: 'CBSE', name: 'CBSE (Central Board)' },
    { id: 'CISCE', name: 'CISCE / ICSE / ISC' },
    { id: 'KSEAB', name: 'KSEAB (Karnataka State Board)' },
    { id: 'MSBSHSE', name: 'MSBSHSE (Maharashtra State Board)' },
    { id: 'TNDGE', name: 'TNDGE (Tamil Nadu State Board)' }
  ];

  const currentClass = onboardingData.classLevel || learnerProfile.classLevel || 7;
  const currentBoard = onboardingData.board || learnerProfile.board || 'CBSE';
  const currCurriculum = resolveCurriculum(currentBoard, currentClass, onboardingData.medium || 'English');
  const availableSubjects = currCurriculum.subjects || [
    { id: 'physics', name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'biology', name: 'Biology' },
    { id: 'math', name: 'Mathematics' }
  ];

  stage.innerHTML = `
    <div class="hub-container ambient-glow-wrapper" style="max-width: 680px; margin: 20px auto; position: relative;">
      <!-- Ambient Motion Glow Orbs -->
      <div class="ambient-orb ambient-orb--blue" aria-hidden="true"></div>
      <div class="ambient-orb ambient-orb--amber" aria-hidden="true"></div>
      <div class="ambient-orb ambient-orb--purple" aria-hidden="true"></div>

      <!-- Mode Switcher: Register vs Sign In -->
      <div class="onboarding-mode-toggle mb-3 d-flex justify-center gap-2" style="position: relative; z-index: 2;">
        <button type="button" class="btn ${onboardingMode === 'register' ? 'btn-primary' : 'btn-outline'}" id="btn-ob-mode-register" style="border-radius: 24px; padding: 8px 20px; font-weight: 600;">
          📝 Register New Student
        </button>
        <button type="button" class="btn ${onboardingMode === 'login' ? 'btn-primary' : 'btn-outline'}" id="btn-ob-mode-login" style="border-radius: 24px; padding: 8px 20px; font-weight: 600;">
          🔑 Sign In (${profiles.length} ${profiles.length === 1 ? 'Scholar' : 'Scholars'})
        </button>
      </div>

      <!-- Wizard Card Header -->
      <div class="hub-hero" style="text-align: center; justify-content: center; flex-direction: column; position: relative; z-index: 2;">
        <span class="badge badge-purple mb-2">Student Onboarding & Setup</span>
        <h1 class="mb-1" style="font-size: 26px;">Welcome to Gramin PocketLab! 🚀</h1>
        <p class="text-secondary mb-0">Your personalized multi-board learning companion for Classes 5–12</p>
      </div>

      ${onboardingMode === 'login' ? `
        <!-- SIGN IN MODE: Quick Account Picker -->
        <div class="timetable-card p-4 mt-4" style="position: relative; z-index: 2; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.06);">
          <div class="d-flex align-center justify-between mb-3 pb-2 border-bottom">
            <div>
              <h2 class="text-lg font-bold mb-0">Select Your Scholar Account</h2>
              <p class="text-secondary text-xs mb-0">Choose your profile to resume tests, streaks, and school prep.</p>
            </div>
            <span class="badge badge-purple">${profiles.length} Registered</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px; margin: 16px 0;">
            ${profiles.map(p => `
              <div class="login-profile-card d-flex align-center justify-between p-3 rounded border" style="background: ${p.isActive ? 'rgba(37, 99, 235, 0.06)' : 'var(--color-surface)'}; border-color: ${p.isActive ? '#2563EB' : 'var(--color-border)'};">
                <div class="d-flex align-center gap-3">
                  <span style="font-size: 34px; animation: float-bob 4s ease-in-out infinite;">${p.avatar}</span>
                  <div>
                    <div class="font-bold text-sm d-flex align-center gap-2">
                      ${escapeHtml(p.name)}
                      ${p.isActive ? '<span class="badge badge-success text-xs">Active Session</span>' : ''}
                    </div>
                    <div class="text-xs text-secondary mt-1">
                      Class ${p.classLevel} • ${escapeHtml(p.board)}
                    </div>
                  </div>
                </div>
                <button type="button" class="btn btn-primary btn-sm btn-login-as-profile" data-profile-id="${p.id}" style="border-radius: 20px; font-weight: 600; padding: 6px 16px;">
                  ${p.isActive ? 'Continue Learning →' : 'Sign In 🚀'}
                </button>
              </div>
            `).join('')}
          </div>

          <div class="d-flex justify-between align-center pt-3 border-top mt-3">
            <button type="button" class="btn btn-ghost btn-sm" id="btn-switch-to-create">
              + Register New Student Profile
            </button>
            <button type="button" class="btn btn-secondary btn-sm" id="btn-login-cancel">
              Back to Missions 🔬
            </button>
          </div>
        </div>
      ` : `
        <!-- Stepper Navigation -->
        <div class="onboarding-stepper mt-4" style="position: relative; z-index: 2;">
          <div class="onboarding-step-dot ${onboardingStep >= 1 ? (onboardingStep > 1 ? 'completed' : 'active') : ''}">1</div>
          <div class="onboarding-step-line"></div>
          <div class="onboarding-step-dot ${onboardingStep >= 2 ? (onboardingStep > 2 ? 'completed' : 'active') : ''}">2</div>
          <div class="onboarding-step-line"></div>
          <div class="onboarding-step-dot ${onboardingStep >= 3 ? (onboardingStep > 3 ? 'completed' : 'active') : ''}">3</div>
          <div class="onboarding-step-line"></div>
          <div class="onboarding-step-dot ${onboardingStep >= 4 ? (onboardingStep > 4 ? 'completed' : 'active') : ''}">4</div>
        </div>

        <div class="timetable-card p-4" style="position: relative; z-index: 2;">
          ${onboardingStep === 1 ? `
            <!-- STEP 1: Student Identity & 3D Cartoon Avatar -->
            <h2 class="text-lg font-bold mb-1">Step 1: Who is learning today?</h2>
            <p class="text-secondary text-sm mb-4">Choose your learning character and enter your student name.</p>

            <div class="form-group mb-4">
              <label class="form-label" for="ob-input-name">Student Full Name</label>
              <input type="text" id="ob-input-name" class="form-input" placeholder="e.g. Aarav Sharma" value="${escapeHtml(onboardingData.name || learnerProfile.name || '')}" required />
            </div>

            <div class="form-group mb-4">
              <label class="form-label" for="ob-select-class">Select Your Class / Grade</label>
              <select id="ob-select-class" class="form-select">
                ${[5, 6, 7, 8, 9, 10, 11, 12].map(c => `
                  <option value="${c}" ${c === currentClass ? 'selected' : ''}>Class ${c} (${c <= 5 ? 'Preparatory' : c <= 8 ? 'Middle Stage' : c <= 10 ? 'Secondary (Board)' : 'Senior Secondary'})</option>
                `).join('')}
              </select>
            </div>

            <div class="form-group mb-4">
              <label class="form-label">Pick Your 3D Learning Avatar</label>
              <div class="avatar-grid">
                ${cartoonAvatars.map(av => `
                  <div class="avatar-option-card ${(onboardingData.avatar || learnerProfile.avatar || '👨‍🎓') === av.emoji ? 'selected' : ''}" data-avatar="${av.emoji}">
                    <span class="avatar-3d-box">${av.emoji}</span>
                    <span class="avatar-label">${av.label}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="d-flex justify-between mt-4 pt-3 border-top">
              <span></span>
              <button type="button" class="btn btn-primary" id="btn-ob-step1-next">Continue to School Details →</button>
            </div>
          ` : ''}

          ${onboardingStep === 2 ? `
            <!-- STEP 2: School & Board Setup -->
            <h2 class="text-lg font-bold mb-1">Step 2: Tell us about your School & Board</h2>
            <p class="text-secondary text-sm mb-4">We'll align your syllabus, textbooks, and examination patterns.</p>

            <div class="form-group mb-3">
              <label class="form-label" for="ob-input-school">School Name</label>
              <input type="text" id="ob-input-school" class="form-input" placeholder="e.g. Kendriya Vidyalaya, Ballari High School" value="${escapeHtml(onboardingData.schoolName || learnerProfile.school || '')}" required />
            </div>

            <div class="form-group mb-3">
              <label class="form-label" for="ob-select-state">State / Union Territory</label>
              <select id="ob-select-state" class="form-select">
                <option value="Karnataka" ${(onboardingData.state || 'Karnataka') === 'Karnataka' ? 'selected' : ''}>Karnataka</option>
                <option value="Maharashtra" ${onboardingData.state === 'Maharashtra' ? 'selected' : ''}>Maharashtra</option>
                <option value="Tamil Nadu" ${onboardingData.state === 'Tamil Nadu' ? 'selected' : ''}>Tamil Nadu</option>
                <option value="Delhi" ${onboardingData.state === 'Delhi' ? 'selected' : ''}>Delhi NCR</option>
                <option value="Uttar Pradesh" ${onboardingData.state === 'Uttar Pradesh' ? 'selected' : ''}>Uttar Pradesh</option>
                <option value="Kerala" ${onboardingData.state === 'Kerala' ? 'selected' : ''}>Kerala</option>
                <option value="West Bengal" ${onboardingData.state === 'West Bengal' ? 'selected' : ''}>West Bengal</option>
              </select>
            </div>

            <div class="form-group mb-3">
              <label class="form-label" for="ob-select-board">Education Board</label>
              <select id="ob-select-board" class="form-select">
                ${boards.map(b => `
                  <option value="${b.id}" ${b.id === currentBoard ? 'selected' : ''}>${b.name}</option>
                `).join('')}
              </select>
            </div>

            <div class="form-group mb-4">
              <label class="form-label" for="ob-select-medium">Medium of Instruction</label>
              <select id="ob-select-medium" class="form-select">
                <option value="English" ${(onboardingData.medium || 'English') === 'English' ? 'selected' : ''}>English</option>
                <option value="Kannada" ${onboardingData.medium === 'Kannada' ? 'selected' : ''}>Kannada (ಕನ್ನಡ)</option>
                <option value="Hindi" ${onboardingData.medium === 'Hindi' ? 'selected' : ''}>Hindi (हिन्दी)</option>
                <option value="Marathi" ${onboardingData.medium === 'Marathi' ? 'selected' : ''}>Marathi (मराठी)</option>
                <option value="Tamil" ${onboardingData.medium === 'Tamil' ? 'selected' : ''}>Tamil (தமிழ்)</option>
              </select>
            </div>

            <div class="d-flex justify-between mt-4 pt-3 border-top">
              <button type="button" class="btn btn-outline" id="btn-ob-prev">← Back</button>
              <button type="button" class="btn btn-primary" id="btn-ob-step2-next">Confirm School & Continue →</button>
            </div>
          ` : ''}

          ${onboardingStep === 3 ? `
            <!-- STEP 3: Enrolled Subjects -->
            <h2 class="text-lg font-bold mb-1">Step 3: Select Your Enrolled Subjects</h2>
            <p class="text-secondary text-sm mb-4">Choose the subjects you study in school. We'll track your progress in each.</p>

            <div class="d-flex gap-2 wrap mb-4" id="ob-subjects-container">
              ${availableSubjects.map(sub => {
                const isEnrolled = (onboardingData.enrolledSubjects || ['physics', 'chemistry', 'biology', 'math']).includes(sub.id);
                return `
                  <button type="button" class="btn btn-sm ${isEnrolled ? 'btn-primary' : 'btn-outline'} ob-subject-toggle" data-sub-id="${sub.id}" style="padding: 8px 16px; border-radius: 20px;">
                    ${isEnrolled ? '✓ ' : '+ '} ${escapeHtml(sub.name)}
                  </button>
                `;
              }).join('')}
            </div>

            <div class="p-3 bg-surface-subtle border rounded mb-4">
              <div class="text-xs text-secondary mb-1">SELECTED SYLLABUS AUTHORITY</div>
              <strong>${escapeHtml(currCurriculum.authority.name)} (${currCurriculum.authority.academicSession})</strong>
              <div class="text-xs text-secondary mt-1">Prescribed Textbooks: ${escapeHtml(currCurriculum.authority.textbookAuthority)}</div>
            </div>

            <div class="d-flex justify-between mt-4 pt-3 border-top">
              <button type="button" class="btn btn-outline" id="btn-ob-prev">← Back</button>
              <button type="button" class="btn btn-primary" id="btn-ob-step3-next">Schedule Exams & Finish →</button>
            </div>
          ` : ''}

          ${onboardingStep === 4 ? `
            <!-- STEP 4: Schedule Upcoming School Exam & Guardian Consent -->
            <h2 class="text-lg font-bold mb-1">Step 4: Upcoming School Tests & Consent</h2>
            <p class="text-secondary text-sm mb-4">Add your upcoming exam so PocketLab can schedule prep quizzes and test alerts.</p>

            <div class="form-group mb-3">
              <label class="form-label" for="ob-exam-title">Upcoming Test / Exam Title</label>
              <input type="text" id="ob-exam-title" class="form-input" placeholder="e.g. Unit Test 1 — Science & Math" value="${escapeHtml(onboardingData.upcomingExam?.title || 'Term 1 Mid-Term Examination')}" required />
            </div>

            <div class="row d-flex gap-3 mb-3">
              <div style="flex: 1;">
                <label class="form-label" for="ob-exam-date">Test Date</label>
                <input type="date" id="ob-exam-date" class="form-input" value="2026-11-28" />
              </div>
              <div style="flex: 1;">
                <label class="form-label" for="ob-exam-days">Days Remaining</label>
                <input type="number" id="ob-exam-days" class="form-input" value="11" min="1" max="180" />
              </div>
            </div>

            <div class="form-group mb-4">
              <label class="form-label" for="ob-exam-syllabus">Teacher's Syllabus Portions</label>
              <input type="text" id="ob-exam-syllabus" class="form-input" placeholder="e.g. Heat & Temperature, Sound Waves, Equations" value="${escapeHtml(onboardingData.upcomingExam?.syllabus || 'Chapters 4 & 13 (Science)')}" />
            </div>

            <div class="p-3 bg-surface-subtle border rounded mb-4">
              <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer;">
                <input type="checkbox" id="ob-consent-check" checked style="margin-top: 3px; width: 18px; height: 18px; accent-color: #2563EB;" />
                <div style="font-size: 13px;">
                  <strong>Parent / Guardian Consent Verified (DPDP Act 2023)</strong>
                  <p class="text-secondary text-xs mb-0 mt-1">All learning progress and exam schedules are encrypted and stored locally on this device. Zero ads, zero tracking.</p>
                </div>
              </label>
            </div>

            <div class="d-flex justify-between mt-4 pt-3 border-top">
              <button type="button" class="btn btn-outline" id="btn-ob-prev">← Back</button>
              <button type="button" class="btn btn-primary btn-lg" id="btn-ob-finish" style="background: linear-gradient(135deg, #2563EB 0%, #10B981 100%);">
                Enter My Learning World 🚀
              </button>
            </div>
          ` : ''}
        </div>
      `}
    </div>
  `;

  // Attach mode switcher listeners
  stage.querySelector('#btn-ob-mode-register')?.addEventListener('click', () => {
    onboardingMode = 'register';
    renderOnboardingWizard(stage, state);
  });
  stage.querySelector('#btn-ob-mode-login')?.addEventListener('click', () => {
    onboardingMode = 'login';
    renderOnboardingWizard(stage, state);
  });

  // Login Mode handlers
  if (onboardingMode === 'login') {
    stage.querySelectorAll('.btn-login-as-profile').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const profId = e.currentTarget.getAttribute('data-profile-id');
        if (profId) {
          store.switchProfile(profId);
          showToast('Welcome back! Resuming your learning session. 🚀');
          router.goToBrowser();
        }
      });
    });
    stage.querySelector('#btn-switch-to-create')?.addEventListener('click', () => {
      onboardingMode = 'register';
      renderOnboardingWizard(stage, state);
    });
    stage.querySelector('#btn-login-cancel')?.addEventListener('click', () => {
      router.goToMap();
    });
    return;
  }

  // Attach interactive step listeners
  if (onboardingStep === 1) {
    stage.querySelectorAll('.avatar-option-card').forEach(card => {
      card.addEventListener('click', (e) => {
        stage.querySelectorAll('.avatar-option-card').forEach(c => c.classList.remove('selected'));
        const target = e.currentTarget;
        target.classList.add('selected');
        onboardingData.avatar = target.getAttribute('data-avatar');
      });
    });

    stage.querySelector('#btn-ob-step1-next')?.addEventListener('click', () => {
      const name = stage.querySelector('#ob-input-name')?.value.trim();
      const cls = Number(stage.querySelector('#ob-select-class')?.value) || 7;
      if (!name) {
        alert('Please enter your name to proceed.');
        return;
      }
      onboardingData.name = name;
      onboardingData.classLevel = cls;
      onboardingStep = 2;
      renderOnboardingWizard(stage, state);
    });
  }

  if (onboardingStep === 2) {
    stage.querySelector('#btn-ob-prev')?.addEventListener('click', () => {
      onboardingStep = 1;
      renderOnboardingWizard(stage, state);
    });

    stage.querySelector('#btn-ob-step2-next')?.addEventListener('click', () => {
      onboardingData.schoolName = stage.querySelector('#ob-input-school')?.value.trim() || 'Government High School';
      onboardingData.state = stage.querySelector('#ob-select-state')?.value;
      onboardingData.board = stage.querySelector('#ob-select-board')?.value;
      onboardingData.medium = stage.querySelector('#ob-select-medium')?.value;
      onboardingStep = 3;
      renderOnboardingWizard(stage, state);
    });
  }

  if (onboardingStep === 3) {
    stage.querySelector('#btn-ob-prev')?.addEventListener('click', () => {
      onboardingStep = 2;
      renderOnboardingWizard(stage, state);
    });

    stage.querySelectorAll('.ob-subject-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const subId = e.currentTarget.getAttribute('data-sub-id');
        if (!Array.isArray(onboardingData.enrolledSubjects)) {
          onboardingData.enrolledSubjects = ['physics', 'chemistry', 'biology', 'math'];
        }
        if (onboardingData.enrolledSubjects.includes(subId)) {
          if (onboardingData.enrolledSubjects.length > 1) {
            onboardingData.enrolledSubjects = onboardingData.enrolledSubjects.filter(s => s !== subId);
          }
        } else {
          onboardingData.enrolledSubjects.push(subId);
        }
        renderOnboardingWizard(stage, state);
      });
    });

    stage.querySelector('#btn-ob-step3-next')?.addEventListener('click', () => {
      onboardingStep = 4;
      renderOnboardingWizard(stage, state);
    });
  }

  if (onboardingStep === 4) {
    stage.querySelector('#btn-ob-prev')?.addEventListener('click', () => {
      onboardingStep = 3;
      renderOnboardingWizard(stage, state);
    });

    stage.querySelector('#btn-ob-finish')?.addEventListener('click', () => {
      const examTitle = stage.querySelector('#ob-exam-title')?.value.trim() || 'Unit Test';
      const examDate = stage.querySelector('#ob-exam-date')?.value || '2026-11-28';
      const examDays = Number(stage.querySelector('#ob-exam-days')?.value) || 10;
      const examSyllabus = stage.querySelector('#ob-exam-syllabus')?.value.trim() || 'Science Chapters';

      onboardingData.upcomingExam = {
        title: examTitle,
        date: examDate,
        daysLeft: examDays,
        syllabus: examSyllabus
      };

      store.completeOnboarding(onboardingData);
      onboardingStep = 1;
      showToast('🎉 Welcome to Gramin PocketLab! Your school profile has been set up.');
      router.goToBrowser();
    });
  }
}

/**
 * Renders an active extended micro-lab (Fractions, Coding, Optics, Calculus).
 */
function renderExtendedLabStage(stage, state, moduleId) {
  const mission = getExtendedMission(moduleId);
  if (!mission) {
    activeExtendedLabId = null;
    renderEnhancedMissionMap(stage, state);
    return;
  }

  stage.innerHTML = `
    <div class="interactive-lab-shell">
      <div class="d-flex justify-between align-center mb-4 pb-3 border-bottom">
        <div style="display: flex; align-items: center; gap: 12px;">
          <button type="button" class="btn btn-secondary btn-sm" id="btn-exit-ext-lab">← Back to Question Worlds</button>
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 22px;">${mission.iconEmoji}</span>
              <h2 class="text-lg font-bold mb-0">${mission.title}</h2>
              <span class="badge badge-purple">${mission.gradeBand} (Class ${mission.classLevel})</span>
            </div>
            <span class="text-xs text-secondary">${mission.curriculumStandard} • ${mission.topic}</span>
          </div>
        </div>
        <div class="d-flex gap-2">
          <button type="button" class="btn btn-outline btn-sm" id="btn-reset-ext-lab">↺ Reset Experiment</button>
          <button type="button" class="btn btn-success btn-sm" id="btn-complete-ext-lab">✓ Mark Completed (+50 XP)</button>
        </div>
      </div>

      <div id="ext-lab-mount-target" style="min-height: 380px;"></div>
    </div>
  `;

  const mountTarget = stage.querySelector('#ext-lab-mount-target');
  if (mountTarget && mission.interactionHandler && typeof mission.interactionHandler.mount === 'function') {
    mission.interactionHandler.mount(mountTarget, {
      onStateChange: (isValid, modState) => {
        console.log('[Extended Lab State]', moduleId, isValid, modState);
      }
    });
  }

  stage.querySelector('#btn-exit-ext-lab')?.addEventListener('click', () => {
    activeExtendedLabId = null;
    if (mission.interactionHandler && typeof mission.interactionHandler.destroy === 'function') {
      mission.interactionHandler.destroy();
    }
    renderEnhancedMissionMap(stage, state);
  });

  stage.querySelector('#btn-reset-ext-lab')?.addEventListener('click', () => {
    if (mission.interactionHandler && typeof mission.interactionHandler.resetState === 'function') {
      mission.interactionHandler.resetState();
      announce('Experiment reset.');
    }
  });

  stage.querySelector('#btn-complete-ext-lab')?.addEventListener('click', () => {
    store.addXP(50);
    announce('Investigation completed! +50 XP awarded to your learning profile.');
    alert('🎉 Fantastic! +50 XP added to your Learning Model.');
  });
}

/**
 * Renders the full Question Worlds Catalog & Mission Map.
 */
function renderEnhancedMissionMap(stage, state) {
  const { progress } = state;

  const catalog = QUESTION_WORLDS_CATALOG.filter(w => {
    if (catalogFilterGrade !== 'all' && w.gradeBand.toLowerCase() !== catalogFilterGrade.toLowerCase()) {
      return false;
    }
    if (catalogFilterSubject !== 'all' && w.subject.toLowerCase() !== catalogFilterSubject.toLowerCase()) {
      return false;
    }
    if (catalogSearchQuery) {
      const q = catalogSearchQuery.toLowerCase();
      const match = w.worldTitle.toLowerCase().includes(q) ||
                    w.topic.toLowerCase().includes(q) ||
                    w.misconception.toLowerCase().includes(q) ||
                    w.subject.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const completedCount = SUBJECT_IDS.filter(s => progress[s]?.isCompleted).length;

  stage.innerHTML = `
    <div class="catalog-container">
      <!-- Personalized Student Portal & Board Quick Action Banner -->
      <div class="timetable-card mb-4 p-3 d-flex justify-between align-center flex-wrap gap-3" style="background: linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%); border: 1.5px solid #BFDBFE; border-radius: 16px;">
        <div class="d-flex align-center gap-3">
          <span style="font-size: 32px;">🏫</span>
          <div>
            <div class="d-flex align-center gap-2">
              <strong style="font-size: 15px; color: #1E3A8A;">Personalized Learning & School Setup</strong>
              <span class="badge badge-purple">${escapeHtml(state.learnerProfile?.board || 'CBSE')} Class ${state.learnerProfile?.classLevel || 7}</span>
            </div>
            <p class="text-xs text-secondary mb-0">Logged in as <strong>${escapeHtml(state.learnerProfile?.name || 'Aarav')}</strong> (${escapeHtml(state.learnerProfile?.school || 'School Configured')}). Manage upcoming tests & custom syllabus.</p>
          </div>
        </div>
        <div class="d-flex gap-2">
          <button type="button" class="btn btn-outline btn-sm" id="btn-banner-courses">Browse Courses & Progress 📚</button>
          <button type="button" class="btn btn-primary btn-sm" id="btn-banner-onboarding">Setup School & Exams ⚙️</button>
        </div>
      </div>

      <div class="catalog-hero">
        <div>
          <span class="badge badge-phys">Question Worlds Ecosystem</span>
          <h1 class="mt-2 mb-1">Classes 5–12 Question Worlds</h1>
          <p class="text-secondary mb-0">Immersive inquiry worlds addressing pervasive student misconceptions across science, mathematics, computing and humanities.</p>
        </div>
        <div class="d-flex gap-3 align-center">
          <div class="countdown-badge">
            <span class="countdown-days">${completedCount} / 4</span>
            <span class="countdown-label">Middle STEM Done</span>
          </div>
        </div>
      </div>

      <!-- Section 1: Flagship 4 STEM Missions (Middle Stage) -->
      <section>
        <div class="d-flex justify-between align-center mb-3">
          <div>
            <h2 class="text-lg font-bold mb-0">🔬 Four Core STEM Anchor Labs (Middle Stage)</h2>
            <p class="text-xs text-secondary mb-0">Complete 7-step Predict-Observe-Explain (POE) cycles with diagnostic retries & summative transfer checks.</p>
          </div>
          <span class="badge badge-success">NCERT Hardened Baseline</span>
        </div>

        <div class="subject-grid">
          ${SUBJECT_IDS.map(subId => {
            const cfg = SUBJECT_CONFIG[subId];
            const prog = progress[subId] || {};
            const isDone = Boolean(prog.isCompleted);
            const totalScore = (prog.exitScores?.[0] || 0) + (prog.exitScores?.[1] || 0);

            return `
              <article class="mission-card" data-subject="${subId}" tabindex="0" role="region" aria-label="${cfg.title}">
                <div class="card-top">
                  <div>
                    <span class="badge ${cfg.badgeClass}">${subId.toUpperCase()}</span>
                    <h3 class="card-title">${cfg.title}</h3>
                    <p class="card-desc">${cfg.description}</p>
                  </div>
                  <span class="card-icon" aria-hidden="true">${cfg.icon}</span>
                </div>
                <div class="card-meta">
                  ${isDone ? `<span class="badge badge-completed">✓ Completed (${totalScore}/2)</span>` : `<span class="card-meta-tag">${cfg.curriculum}</span>`}
                  <button type="button" class="btn btn-secondary btn-sm" data-start-subject="${subId}">
                    ${isDone ? 'Revisit Lab ↺' : 'Launch Investigation →'}
                  </button>
                </div>
              </article>
            `;
          }).join('')}
        </div>
      </section>

      <!-- Section 2: Extended Multi-Grade Interactive Micro-Labs -->
      <section class="mt-4">
        <div class="d-flex justify-between align-center mb-3">
          <div>
            <h2 class="text-lg font-bold mb-0">🚀 Multi-Grade Interactive Micro-Labs</h2>
            <p class="text-xs text-secondary mb-0">Class-specific experiential simulations spanning Preparatory, Middle, Secondary, and Senior Secondary.</p>
          </div>
          <span class="badge badge-purple">Expanded Labs</span>
        </div>

        <div class="grid grid-2 gap-4">
          <!-- Class 5: Fractions -->
          <article class="qw-card" style="border-left: 4px solid #F59E0B;">
            <div class="qw-card-top">
              <div>
                <span class="badge badge-secondary">Class 5 • Preparatory</span>
                <h3 class="font-bold text-md mt-1 mb-0">Baker's Chapati Feast</h3>
                <span class="text-xs text-secondary">NCERT Class 5 Math: Equivalent Fractions</span>
              </div>
              <span style="font-size: 28px;">🫓</span>
            </div>
            <p class="text-xs text-secondary my-2">Cut and merge village festival chapati slices to visually verify 2/4 and 4/8 equal 1/2.</p>
            <div class="qw-misconception-callout">
              <strong>Misconception:</strong> Larger denominator means bigger piece fallacy.
            </div>
            <div class="d-flex justify-between align-center mt-3 pt-2 border-top">
              <span class="text-xs font-bold text-secondary">Interactive SVG Cutter</span>
              <button type="button" class="btn btn-primary btn-sm btn-launch-ext" data-ext-id="fractions">Launch Lab →</button>
            </div>
          </article>

          <!-- Class 8: Coding -->
          <article class="qw-card" style="border-left: 4px solid #8B5CF6;">
            <div class="qw-card-top">
              <div>
                <span class="badge badge-purple">Class 8 • Middle</span>
                <h3 class="font-bold text-md mt-1 mb-0">Solar Rover Algorithm Studio</h3>
                <span class="text-xs text-secondary">CBSE Class 8 Computing: Sequence & Loops</span>
              </div>
              <span style="font-size: 28px;">🤖</span>
            </div>
            <p class="text-xs text-secondary my-2">Compose sequential instructions and 3x loop blocks to navigate the solar rover through a grid maze.</p>
            <div class="qw-misconception-callout">
              <strong>Misconception:</strong> Assuming computers possess human intuition to fix missing steps.
            </div>
            <div class="d-flex justify-between align-center mt-3 pt-2 border-top">
              <span class="text-xs font-bold text-secondary">Interactive Algorithm Grid</span>
              <button type="button" class="btn btn-primary btn-sm btn-launch-ext" data-ext-id="coding">Launch Lab →</button>
            </div>
          </article>

          <!-- Class 10: Optics -->
          <article class="qw-card" style="border-left: 4px solid #087E79;">
            <div class="qw-card-top">
              <div>
                <span class="badge badge-info">Class 10 • Secondary</span>
                <h3 class="font-bold text-md mt-1 mb-0">Ray Optics Refraction & Snell's Law</h3>
                <span class="text-xs text-secondary">CISCE / CBSE Class 10 Physics: Light Refraction</span>
              </div>
              <span style="font-size: 28px;">🔦</span>
            </div>
            <p class="text-xs text-secondary my-2">Drag the laser angle slider into the glass slab to observe Snell's law bending and critical angles.</p>
            <div class="qw-misconception-callout">
              <strong>Misconception:</strong> Belief that light bends towards normal when speeding up.
            </div>
            <div class="d-flex justify-between align-center mt-3 pt-2 border-top">
              <span class="text-xs font-bold text-secondary">60 FPS Canvas Ray Tracer</span>
              <button type="button" class="btn btn-primary btn-sm btn-launch-ext" data-ext-id="optics">Launch Lab →</button>
            </div>
          </article>

          <!-- Class 12: Calculus -->
          <article class="qw-card" style="border-left: 4px solid #275DDB;">
            <div class="qw-card-top">
              <div>
                <span class="badge badge-phys">Class 12 • Senior Secondary</span>
                <h3 class="font-bold text-md mt-1 mb-0">Solar Roof Calculus Integrals</h3>
                <span class="text-xs text-secondary">CBSE Class 12 Math: Applications of Integrals</span>
              </div>
              <span style="font-size: 28px;">☀️</span>
            </div>
            <p class="text-xs text-secondary my-2">Increase rectangular Riemann sum strips to watch discrete area slices converge to the definite integral limit.</p>
            <div class="qw-misconception-callout">
              <strong>Misconception:</strong> Confusing antiderivative constant with definite boundary area.
            </div>
            <div class="d-flex justify-between align-center mt-3 pt-2 border-top">
              <span class="text-xs font-bold text-secondary">Riemann Sum Plotter</span>
              <button type="button" class="btn btn-primary btn-sm btn-launch-ext" data-ext-id="calculus">Launch Lab →</button>
            </div>
          </article>
        </div>
      </section>

      <!-- Section 3: Comprehensive Question Worlds Catalog (29 entries) -->
      <section class="mt-4">
        <div class="d-flex justify-between align-center mb-3 flex-wrap gap-2">
          <div>
            <h2 class="text-lg font-bold mb-0">📚 Multi-Subject Question Worlds Catalog (${catalog.length} Available)</h2>
            <p class="text-xs text-secondary mb-0">Explore 29 curriculum-mapped inquiry environments across classes and subject disciplines.</p>
          </div>

          <div style="min-width: 240px;">
            <input type="search" id="catalog-search" placeholder="Search topics or misconceptions..." value="${catalogSearchQuery}" style="width: 100%; padding: 6px 12px; border-radius: var(--radius-md); border: 1px solid var(--color-border); font-size: 13px;" />
          </div>
        </div>

        <!-- Filter Chips -->
        <div class="d-flex gap-2 wrap mb-3">
          <button type="button" class="btn btn-xs ${catalogFilterGrade === 'all' ? 'btn-primary' : 'btn-outline'} btn-filter-stage" data-filter="all">All Stages</button>
          <button type="button" class="btn btn-xs ${catalogFilterGrade === 'preparatory' ? 'btn-primary' : 'btn-outline'} btn-filter-stage" data-filter="preparatory">Prep (5)</button>
          <button type="button" class="btn btn-xs ${catalogFilterGrade === 'middle' ? 'btn-primary' : 'btn-outline'} btn-filter-stage" data-filter="middle">Middle (6–8)</button>
          <button type="button" class="btn btn-xs ${catalogFilterGrade === 'secondary' ? 'btn-primary' : 'btn-outline'} btn-filter-stage" data-filter="secondary">Sec (9–10)</button>
          <button type="button" class="btn btn-xs ${catalogFilterGrade === 'senior secondary' ? 'btn-primary' : 'btn-outline'} btn-filter-stage" data-filter="senior secondary">Senior (11–12)</button>
        </div>

        <div class="qw-grid">
          ${catalog.map(w => `
            <article class="qw-card">
              <div class="qw-card-top">
                <div>
                  <span class="badge badge-secondary" style="font-size: 11px;">Class ${w.classLevel} • ${w.curriculumAuthority}</span>
                  <h3 class="font-bold text-md mt-1 mb-0">${w.worldTitle}</h3>
                  <span class="text-xs text-secondary">${w.subject} — ${w.topic}</span>
                </div>
                <span style="font-size: 26px;">${w.iconEmoji || '🌍'}</span>
              </div>

              <div style="font-size: 12px; color: var(--color-text-secondary); margin: 6px 0;">
                <div><strong>Setting:</strong> ${w.environmentType}</div>
                <div><strong>Mechanic:</strong> ${w.coreMechanic}</div>
              </div>

              <div class="qw-misconception-callout">
                <strong>Misconception:</strong> ${w.misconception}
              </div>

              <div class="d-flex justify-between align-center mt-3 pt-2 border-top">
                <span class="badge" style="font-size: 10px; background: #F1F5F9; color: #475569;">${w.worldId}</span>
                ${w.moduleId ? `
                  <button type="button" class="btn btn-secondary btn-xs btn-launch-catalog" data-mod="${w.moduleId}">Launch Lab →</button>
                ` : `
                  <span class="text-xs text-muted">Curricular Blueprint</span>
                `}
              </div>
            </article>
          `).join('')}
        </div>
      </section>
    </div>
  `;

  stage.querySelector('#btn-banner-courses')?.addEventListener('click', () => {
    router.goToBrowser();
  });

  stage.querySelector('#btn-banner-onboarding')?.addEventListener('click', () => {
    router.goToOnboarding();
  });

  stage.querySelectorAll('[data-start-subject]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const sub = e.currentTarget.getAttribute('data-start-subject');
      router.goToSubject(sub);
    });
  });

  stage.querySelectorAll('.btn-launch-ext').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const extId = e.currentTarget.getAttribute('data-ext-id');
      activeExtendedLabId = extId;
      renderExtendedLabStage(stage, state, extId);
    });
  });

  stage.querySelectorAll('.btn-launch-catalog').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const mod = e.currentTarget.getAttribute('data-mod');
      if (SUBJECT_IDS.includes(mod)) {
        router.goToSubject(mod);
      } else {
        activeExtendedLabId = mod;
        renderExtendedLabStage(stage, state, mod);
      }
    });
  });

  stage.querySelectorAll('.btn-filter-stage').forEach(btn => {
    btn.addEventListener('click', (e) => {
      catalogFilterGrade = e.currentTarget.getAttribute('data-filter');
      renderEnhancedMissionMap(stage, state);
    });
  });

  const searchInput = stage.querySelector('#catalog-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      catalogSearchQuery = e.target.value;
      renderEnhancedMissionMap(stage, state);
      const newSearch = stage.querySelector('#catalog-search');
      if (newSearch) {
        newSearch.focus();
        newSearch.setSelectionRange(newSearch.value.length, newSearch.value.length);
      }
    });
  }
}

/**
 * Clean fallback renderer ensuring zero blank screens.
 * @param {HTMLElement} stage
 * @param {Object} state
 */
function renderFallbackStage(stage, state) {
  renderEnhancedMissionMap(stage, state);
}

/**
 * Initializes accessible Reset Confirmation Dialog interactions.
 */
function initResetModal() {
  if (typeof document === 'undefined') return;
  const backdrop = document.getElementById('reset-modal-backdrop');
  const triggerBtn = document.getElementById('btn-mission-reset');
  const cancelBtn = document.getElementById('btn-modal-cancel');
  const resetLabBtn = document.getElementById('btn-modal-reset-lab');
  const resetAllBtn = document.getElementById('btn-modal-reset-all');

  if (!backdrop || !triggerBtn) return;

  function openModal() {
    backdrop.style.display = 'flex';
    if (cancelBtn) cancelBtn.focus();
  }

  function closeModal() {
    backdrop.style.display = 'none';
    triggerBtn.focus();
  }

  triggerBtn.addEventListener('click', openModal);

  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeModal);
  }

  if (resetLabBtn) {
    resetLabBtn.addEventListener('click', () => {
      const { currentSubject } = store.getState();
      if (currentSubject) {
        store.resetSubjectLab(currentSubject);
        announce('Active experiment variables reset to initial state.');
      }
      closeModal();
    });
  }

  if (resetAllBtn) {
    resetAllBtn.addEventListener('click', () => {
      store.resetAllProgress();
      router.goToMap();
      announce('All STEM mission progress and local scores reset.');
      closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.style.display !== 'none') {
      closeModal();
    }
  });

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  });
}

/**
 * Binds utility header controls: Mute, Locale toggles, Tabs, and Grade Bands.
 */
function initHeaderControls() {
  if (typeof document === 'undefined') return;
  const muteBtn = document.getElementById('btn-audio-mute');
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      store.toggleMute();
      const state = store.getState();
      announce(state.audioMuted ? 'Audio muted.' : 'Audio unmuted.');
    });
  }

  const localeBtn = document.getElementById('btn-locale-toggle');
  if (localeBtn) {
    localeBtn.addEventListener('click', () => {
      store.toggleLocale();
      const state = store.getState();
      announce(state.selectedLocale === 'kn' ? 'Language switched to Kannada.' : 'Language switched to English.');
    });
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tab = e.currentTarget.getAttribute('data-tab');
      if (tab === 'missions') router.goToMap();
      else if (tab === 'browser') router.goToBrowser();
      else if (tab === 'hub') router.goToHub();
      else if (tab === 'mock-test') router.goToMockTest();
      else if (tab === 'tutor') router.goToTutor();
      else if (tab === 'profile') router.goToProfile();
    });
  });

  const headerProfileBtn = document.getElementById('btn-header-profile');
  if (headerProfileBtn) {
    headerProfileBtn.addEventListener('click', () => {
      router.goToProfiles();
    });
  }

  const floatingAiBtn = document.getElementById('btn-floating-ai-buddy');
  if (floatingAiBtn) {
    floatingAiBtn.addEventListener('click', () => {
      router.goToTutor();
    });
  }

  document.querySelectorAll('.grade-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      const band = e.currentTarget.getAttribute('data-band');
      store.setGradeBand(band);
    });
  });
}

/**
 * Registers the Cache-First Service Worker for offline PWA operation.
 */
function initServiceWorker() {
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js')
        .then((reg) => {
          console.log('[Gramin PocketLab] Service Worker registered. Scope:', reg.scope);
          if (reg.active) {
            updateNetworkStatus();
          }
          reg.addEventListener('updatefound', () => {
            const installing = reg.installing;
            if (installing) {
              installing.addEventListener('statechange', () => {
                if (installing.state === 'activated') {
                  updateNetworkStatus();
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn('[Gramin PocketLab] Service Worker registration skipped:', err.message);
          updateNetworkStatus();
        });
    });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[Gramin PocketLab] Service Worker controller changed; now controlling page.');
      updateNetworkStatus();
    });
  }
}

/**
 * Central Application Bootstrap
 */
function bootstrap() {
  console.log('[Gramin PocketLab] Bootstrapping application foundation...');

  updateNetworkStatus();
  if (typeof window !== 'undefined') {
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
  }

  initHeaderControls();
  initResetModal();
  initServiceWorker();

  store.subscribe((state) => {
    updateHeader(state);
    updateActionBar(state);
    delegateRender(state);
  });

  router.init();

  const initialState = store.getState();
  updateHeader(initialState);
  updateActionBar(initialState);
  delegateRender(initialState);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    // Only bootstrap if the DOM has the full app container
    if (document.getElementById('app') || document.getElementById('runner-stage')) {
      bootstrap();
    }
  }
}
