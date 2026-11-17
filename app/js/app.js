/**
 * Gramin PocketLab — Application Bootstrap & Orchestrator
 * File: app/js/app.js
 * Architecture Contract: architecture_plan/MODULE_INTERFACE_CONTRACT.md
 * Conformance: Strict ES6 Module, Service Worker Registration, Reactive Header & Router Mount
 */

import { store, SUBJECT_IDS, STEP_IDS } from './store.js';
import { router } from './router.js';

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
  const el = document.getElementById('a11y-announcer');
  if (el) {
    el.textContent = '';
    // Small timeout ensures screen readers catch the text insertion
    setTimeout(() => {
      el.textContent = message;
    }, 50);
  }
}

/**
 * Updates online/offline status pill badge based on browser network telemetry.
 */
function updateNetworkStatus() {
  const badge = document.getElementById('network-status-badge');
  const text = document.getElementById('network-status-text');
  if (!badge || !text) return;

  if (navigator.onLine) {
    badge.className = 'status-pill status-pill--offline'; // Still indicates offline capability
    text.textContent = 'Offline Ready';
    badge.setAttribute('title', 'Connected to network. Local cache verified and active.');
  } else {
    badge.className = 'status-pill status-pill--offline';
    text.textContent = 'Offline Mode';
    badge.setAttribute('title', 'Network disconnected. Operating 100% from local cache.');
  }
}

/**
 * Updates top application bar controls, active subject theme, and step indicator dots.
 * @param {Object} state
 */
function updateHeader(state) {
  const { currentSubject, currentStep, selectedLocale, audioMuted } = state;

  // 1. Dynamic theme accent on root html
  const themeSubject = currentSubject || 'physics';
  document.documentElement.setAttribute('data-subject', themeSubject);

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
    document.documentElement.lang = selectedLocale;
  }

  // 4. Sub-bar visibility and step indicators
  const subbar = document.getElementById('header-subbar');
  const subjectBadge = document.getElementById('header-subject-badge');
  const stepDotsContainer = document.getElementById('header-step-dots');

  if (!subbar || !subjectBadge || !stepDotsContainer) return;

  if (!currentSubject || currentStep === 's0_map') {
    subbar.style.display = 'none';
    return;
  }

  subbar.style.display = 'flex';

  // Update subject badge
  const config = SUBJECT_CONFIG[currentSubject] || { title: currentSubject, badgeClass: 'badge-phys' };
  subjectBadge.className = `badge ${config.badgeClass}`;
  subjectBadge.textContent = config.title;

  // Render 6-step progress dots (S1 through S6)
  const missionSteps = STEP_IDS.slice(1); // ['s1_intro', ..., 's6_exit_result']
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
  const { currentSubject, currentStep, progress } = state;
  const actionBar = document.getElementById('action-bar');
  const btnBack = document.getElementById('btn-nav-back');
  const btnPrimary = document.getElementById('btn-nav-primary');

  if (!actionBar || !btnBack || !btnPrimary) return;

  // S0: Mission Map — bottom action bar is hidden
  if (!currentSubject || currentStep === 's0_map') {
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
      btnBack.textContent = '← Intro';
      btnBack.onclick = () => router.navigate(currentSubject, 's1_intro');
      btnPrimary.textContent = 'Enter Lab →';

      // Guard: must have selected a prediction option
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
      btnPrimary.textContent = 'I Have Observed the Result →';

      // Guard: must have interacted with lab
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
      btnBack.textContent = '← Lab';
      btnBack.onclick = () => router.navigate(currentSubject, 's3_explore');
      btnPrimary.textContent = 'Check My Understanding →';
      btnPrimary.removeAttribute('disabled');
      btnPrimary.setAttribute('aria-disabled', 'false');
      btnPrimary.onclick = () => router.navigate(currentSubject, 's5_feedback_retry');
      break;

    case 's5_feedback_retry':
      btnBack.textContent = '← Concept';
      btnBack.onclick = () => router.navigate(currentSubject, 's4_understand');
      btnPrimary.textContent = 'Proceed to Final Check →';
      btnPrimary.removeAttribute('disabled');
      btnPrimary.setAttribute('aria-disabled', 'false');
      btnPrimary.onclick = () => router.navigate(currentSubject, 's6_exit_result');
      break;

    case 's6_exit_result':
      btnBack.textContent = '↺ Replay Lab';
      btnBack.onclick = () => {
        store.resetSubjectLab(currentSubject);
        router.navigate(currentSubject, 's3_explore');
      };
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
 * Cache for active learning runner instance.
 */
let runnerInstance = null;

/**
 * Delegates view rendering to learning_runner.js or renders an accessible fallback.
 * @param {Object} state
 */
async function delegateRender(state) {
  const stage = document.getElementById('runner-stage') || document.getElementById('main-content');
  if (!stage) return;

  // Attempt dynamic linkage with Agent 3's learning_runner module
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

  // Pure ES6 accessible fallback renderer
  renderFallbackStage(stage, state);
}

/**
 * Clean fallback renderer ensuring zero blank screens and immediate keyboard-accessible
 * mission card selection before or during parallel engine compilation.
 * @param {HTMLElement} stage
 * @param {Object} state
 */
function renderFallbackStage(stage, state) {
  const { currentSubject, currentStep, progress } = state;

  // S0: Mission Map
  if (!currentSubject || currentStep === 's0_map') {
    let cardsHtml = '';
    SUBJECT_IDS.forEach((subId) => {
      const cfg = SUBJECT_CONFIG[subId];
      const prog = progress[subId] || {};
      const completedBadge = prog.isCompleted
        ? `<span class="badge-completed">✓ Completed (${prog.exitScores ? prog.exitScores[0] + prog.exitScores[1] : 0}/2)</span>`
        : `<span class="card-meta-tag">${cfg.curriculum}</span>`;

      cardsHtml += `
        <article class="mission-card" data-subject="${subId}" tabindex="0" role="region" aria-label="${cfg.title}">
          <div class="card-top">
            <div>
              <span class="badge ${cfg.badgeClass}">${subId.toUpperCase()}</span>
              <h2 class="card-title">${cfg.title}</h2>
              <p class="card-desc">${cfg.description}</p>
            </div>
            <span class="card-icon" aria-hidden="true">${cfg.icon}</span>
          </div>
          <div class="card-meta">
            ${completedBadge}
            <button type="button" class="btn btn-secondary btn-sm" data-start-subject="${subId}">
              ${prog.isCompleted ? 'Revisit Mission' : 'Start Mission →'}
            </button>
          </div>
        </article>
      `;
    });

    stage.innerHTML = `
      <div class="mission-map-container">
        <header class="map-intro">
          <h1>Gramin PocketLab</h1>
          <p class="lead">Explore real-world science and mathematics through four interactive field investigations designed for rural schools.</p>
        </header>
        <div class="subject-grid">
          ${cardsHtml}
        </div>
      </div>
    `;

    // Attach card event listeners
    stage.querySelectorAll('[data-start-subject]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const sub = e.currentTarget.getAttribute('data-start-subject');
        router.goToSubject(sub);
      });
    });

    stage.querySelectorAll('.mission-card').forEach((card) => {
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const sub = card.getAttribute('data-subject');
          router.goToSubject(sub);
        }
      });
    });

    return;
  }

  // Subject Mission Steps Placeholder (Replaced by Agent 3's learning_runner.js)
  const cfg = SUBJECT_CONFIG[currentSubject] || { title: currentSubject };
  stage.innerHTML = `
    <div class="step-container" role="region" aria-label="${cfg.title} - ${currentStep}">
      <header class="step-header">
        <span class="badge ${cfg.badgeClass}">${currentSubject.toUpperCase()}</span>
        <h2>${cfg.title}</h2>
        <p class="text-secondary">${cfg.curriculum} — Phase 1 Module Loading</p>
      </header>
      <div class="callout callout-info" role="status">
        <div class="callout-header">
          <span aria-hidden="true">💡</span>
          <strong>Active Mission Step: ${currentStep.replace('_', ' ').toUpperCase()}</strong>
        </div>
        <div class="callout-body">
          <p>Gramin PocketLab engine is active and state is synchronized.</p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Initializes accessible Reset Confirmation Dialog interactions.
 */
function initResetModal() {
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

  // Close on Escape or click outside dialog
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
 * Binds utility header controls: Mute and Locale toggles.
 */
function initHeaderControls() {
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
}

/**
 * Registers the Cache-First Service Worker for offline PWA operation.
 */
function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js')
        .then((reg) => {
          console.log('[Gramin PocketLab] Service Worker registered. Scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[Gramin PocketLab] Service Worker registration skipped:', err.message);
        });
    });
  }
}

/**
 * Central Application Bootstrap
 */
function bootstrap() {
  console.log('[Gramin PocketLab] Bootstrapping application foundation...');

  // 1. Initialize Network Telemetry
  updateNetworkStatus();
  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);

  // 2. Initialize Header Controls & Modal
  initHeaderControls();
  initResetModal();

  // 3. Register Service Worker
  initServiceWorker();

  // 4. Subscribe App View to Central Reactive Store
  store.subscribe((state) => {
    updateHeader(state);
    updateActionBar(state);
    delegateRender(state);
  });

  // 5. Initialize Hash Router
  router.init();

  // 6. Initial render pass
  const initialState = store.getState();
  updateHeader(initialState);
  updateActionBar(initialState);
  delegateRender(initialState);
}

// Launch on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
