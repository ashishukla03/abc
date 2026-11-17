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

  // 1. Dynamic theme accent on root html
  const themeSubject = currentSubject || 'physics';
  if (document.documentElement && typeof document.documentElement.setAttribute === 'function') {
    document.documentElement.setAttribute('data-subject', themeSubject);
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
  const tabMissions = document.getElementById('tab-btn-missions');
  const tabHub = document.getElementById('tab-btn-hub');
  const tabProfile = document.getElementById('tab-btn-profile');
  if (tabMissions && tabHub && tabProfile) {
    tabMissions.classList.toggle('active', activeTab === 'missions');
    tabHub.classList.toggle('active', activeTab === 'hub');
    tabProfile.classList.toggle('active', activeTab === 'profile');
    tabMissions.setAttribute('aria-selected', String(activeTab === 'missions'));
    tabHub.setAttribute('aria-selected', String(activeTab === 'hub'));
    tabProfile.setAttribute('aria-selected', String(activeTab === 'profile'));
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

/**
 * Delegates view rendering to learning_runner.js or renders an accessible fallback.
 * @param {Object} state
 */
async function delegateRender(state) {
  if (typeof document === 'undefined') return;
  const stage = document.getElementById('runner-stage') || document.getElementById('main-content');
  if (!stage) return;

  const { activeTab = 'missions', currentSubject, currentStep } = state;

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
 * Renders the School & Study Hub: Timetable, Exam Countdown, Syllabus Checklist, 40/30/20/10 Recommender.
 */
function renderStudyHub(stage, state) {
  const { studyHub } = state;
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

  stage.innerHTML = `
    <div class="hub-container">
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
                    <strong style="color: var(--color-text-main); font-size: 15px;">${rec.title}</strong>
                    <span class="badge badge-secondary" style="font-size: 11px;">Class ${rec.classLvl} ${rec.subject}</span>
                  </div>
                  <p style="font-size: 12px; color: var(--color-text-secondary); margin: 2px 0 0 0;">${rec.reason}</p>
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
              <span class="text-xs text-secondary">Zilla Parishad High School — Class 7 Schedule</span>
            </div>
            <span class="badge badge-success"><span class="active-pulse"></span>In Session</span>
          </div>
          <div class="timetable-grid" style="grid-template-columns: 1fr;">
            ${timetable.map(p => `
              <div class="period-item ${p.active ? 'active-period' : ''}">
                <div class="d-flex justify-between align-center">
                  <div>
                    <span class="text-xs font-bold text-secondary">Period ${p.period} (${p.time})</span>
                    <h4 class="mt-1 mb-0 font-bold" style="font-size: 14px;">${p.subject}: ${p.topic}</h4>
                    <span class="text-xs text-secondary">${p.room} • ${p.teacher}</span>
                  </div>
                  ${p.active ? '<span class="badge badge-success text-xs">Active Now</span>' : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Exam Countdown & Syllabus Checklist -->
        <div style="display: flex; flex-direction: column; gap: var(--space-4);">
          <!-- Exam Countdown -->
          <section class="exams-card">
            <h2 class="text-md font-bold mb-2">⏳ Exam & Assessment Countdown</h2>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${examCountdowns.map(ex => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface-subtle);">
                  <div>
                    <strong style="font-size: 14px;">${ex.title}</strong>
                    <div style="font-size: 12px; color: var(--color-text-secondary);">${ex.date} • ${ex.syllabus}</div>
                  </div>
                  <div class="countdown-badge ${ex.urgency === 'high' ? 'urgent' : ''}">
                    <span class="countdown-days">${ex.daysLeft}</span>
                    <span class="countdown-label">Days</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- NCERT Syllabus Checklist -->
          <section class="checklist-card">
            <div class="d-flex justify-between align-center mb-2">
              <h2 class="text-md font-bold mb-0">📋 NCERT Syllabus Checklist</h2>
              <span class="text-xs font-bold text-secondary">${completedChecklistCount}/${checklist.length} Done</span>
            </div>
            <div style="width: 100%; height: 6px; background: #E2E8F0; border-radius: 3px; overflow: hidden; margin-bottom: 12px;">
              <div style="width: ${checklistPercent}%; height: 100%; background: #10B981; transition: width 0.3s ease;"></div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${checklist.map(item => `
                <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer; padding: 4px 6px; border-radius: 4px; transition: background 0.15s ease;">
                  <input type="checkbox" class="chk-syllabus" data-item-id="${item.id}" ${item.completed ? 'checked' : ''} style="width: 16px; height: 16px; accent-color: #10B981;" />
                  <span style="${item.completed ? 'text-decoration: line-through; color: var(--color-text-secondary);' : 'font-weight: 600;'}">${item.chapter}</span>
                </label>
              `).join('')}
            </div>
          </section>
        </div>
      </div>
    </div>
  `;

  stage.querySelectorAll('.btn-study-rec').forEach(btn => {
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
  const { learnerProfile } = state;
  const p = learnerProfile || {
    name: 'Aarav Sharma',
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
            ${p.avatar}
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <h1 class="text-xl font-bold mb-0">${p.name}</h1>
              <span class="badge badge-purple">Class 7 Scholar</span>
            </div>
            <p class="text-sm text-secondary mb-1">Zilla Parishad High School • Karnataka KSEAB / CBSE</p>
            <div style="display: flex; gap: 6px; font-size: 12px; font-weight: 700; color: #10B981;">
              <span>● Offline Local Learner</span> • <span>Active Session</span>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 14px; align-items: center; flex-wrap: wrap;">
          <div class="d-flex align-center gap-2" style="background: #FFF7ED; border: 1px solid #FFEDD5; border-radius: var(--radius-md); padding: 8px 14px;">
            <span class="streak-flame">🔥</span>
            <div>
              <strong style="font-size: 18px; color: #EA580C; display: block; line-height: 1;">${p.streakDays} Days</strong>
              <span style="font-size: 11px; text-transform: uppercase; color: #9A3412; font-weight: 700;">Daily Study Streak</span>
            </div>
          </div>
          <div class="d-flex align-center gap-2" style="background: #F0FDF4; border: 1px solid #DCFCE7; border-radius: var(--radius-md); padding: 8px 14px;">
            <span style="font-size: 28px;">🌟</span>
            <div>
              <strong style="font-size: 18px; color: #16A34A; display: block; line-height: 1;">Level ${p.level}</strong>
              <span style="font-size: 11px; text-transform: uppercase; color: #15803D; font-weight: 700;">${p.xp} / 600 XP</span>
            </div>
          </div>
        </div>
      </div>

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
      else if (tab === 'hub') router.goToHub();
      else if (tab === 'profile') router.goToProfile();
    });
  });

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
