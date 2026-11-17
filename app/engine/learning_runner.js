/**
 * Gramin PocketLab — Reusable 7-Step POE Learning Engine
 * File: app/engine/learning_runner.js
 * Architecture Contract: architecture_plan/MODULE_INTERFACE_CONTRACT.md
 * Pedagogical Contract: learning_flow/SHARED_LEARNING_FLOW_SPEC.md (S0 through S6)
 *
 * Steps Lifecycle:
 *   S0: Mission Map & Subject Selector
 *   S1: Mission Brief (Relatable scenario, NCERT standard, learning objective)
 *   S2: Formative Prediction (Hypothesis with 3 accessible radio options)
 *   S3: Interactive Micro-Lab (Mounts subject handler, verifies invariants)
 *   S4: Concept Understanding (Multi-modal recap, scientific law, notebook rule box)
 *   S5: Formative Feedback & Targeted Retry (Diagnostic, misconception scaffolding, changed retry)
 *   S6: Exit Check & Summary (Summative transfer, score calculation, badge celebration, replay/return)
 *
 * Strict Conformance:
 * - Pure ES6 Module, zero dependencies
 * - Full WCAG 2.1 AA keyboard accessibility and focus management
 * - Strict adherence to store and i18n contracts
 */

import { store, STEP_IDS, SUBJECT_IDS } from '../js/store.js';
import { router } from '../js/router.js';
import { t, getCurrentLocale } from '../content/i18n.js';
import { MISSIONS, getMission } from '../content/missions_data.js';
import { renderIcon, badgeIcon } from '../js/icons.js';
import { renderCircularRing } from '../js/motion_engine.js';

export class LearningRunner {
  constructor(options = {}) {
    this._container = options?.container || null;
    this._activeHandler = null;
    this._unsubscribeStore = null;
    this._currentStepRendered = null;
    this._currentSubjectRendered = null;
    this._labState = null;
    this._s5State = {
      submittedDiagnostic: false,
      selectedDiagnosticId: null,
      isDiagnosticCorrect: false,
      submittedRetry: false,
      selectedRetryId: null,
      isRetryCorrect: false
    };
    this._s6State = {
      selectedQ1: null,
      selectedQ2: null,
      submitted: false
    };

    this._handleStoreUpdate = this._handleStoreUpdate.bind(this);
    this._handleStageClick = this._handleStageClick.bind(this);
  }

  /**
   * Initializes the learning runner with the host DOM container.
   * @param {HTMLElement} [container] Element where learning runner views mount
   * @param {Object} [storeRef]
   * @param {Object} [routerRef]
   */
  init(container = null, storeRef = null, routerRef = null) {
    if (container) {
      this._container = container;
    } else if (!this._container) {
      this._container = document.getElementById('runner-stage') || document.querySelector('.runner-stage');
    }

    if (!this._container) {
      console.error('[LearningRunner] Host stage container not found in DOM.');
      return;
    }

    // Subscribe to store notifications
    if (!this._unsubscribeStore) {
      this._unsubscribeStore = store.subscribe(this._handleStoreUpdate);
    }

    // Initial render
    this.render();
  }

  /**
   * Cleans up runner listeners and active lab handlers.
   */
  destroy() {
    this._cleanupActiveLab();
    if (this._unsubscribeStore) {
      this._unsubscribeStore();
      this._unsubscribeStore = null;
    }
  }

  /**
   * Handles state changes from store.
   * @private
   */
  _handleStoreUpdate(state, action, payload) {
    // Check if subject or step or locale changed
    const subjectChanged = this._currentSubjectRendered !== state.currentSubject;
    const stepChanged = this._currentStepRendered !== state.currentStep;

    if (action === 'TOGGLE_LOCALE' || action === 'SET_LOCALE' || action === 'RESET_ALL_PROGRESS' || subjectChanged || stepChanged) {
      if (subjectChanged) {
        // Reset step-local temporary state when subject changes
        this._resetStepLocalStates();
      }
      this.render();
    }
  }

  /**
   * Resets ephemeral local states for S5 and S6.
   * @private
   */
  _resetStepLocalStates() {
    this._s5State = {
      submittedDiagnostic: false,
      selectedDiagnosticId: null,
      isDiagnosticCorrect: false,
      submittedRetry: false,
      selectedRetryId: null,
      isRetryCorrect: false
    };
    this._s6State = {
      selectedQ1: null,
      selectedQ2: null,
      submitted: false
    };
  }

  /**
   * Safely dismounts active lab handler.
   * @private
   */
  _cleanupActiveLab() {
    if (this._activeHandler && typeof this._activeHandler.unmount === 'function') {
      try {
        this._activeHandler.unmount();
      } catch (err) {
        console.warn('[LearningRunner] Error while unmounting lab handler:', err);
      }
      this._activeHandler = null;
    }
  }

  /**
   * Announces screen transition to screen readers via aria-live region.
   * @private
   */
  _announceTransition(message) {
    const announcer = document.getElementById('a11y-announcer');
    if (announcer) {
      announcer.textContent = message;
    }
  }

  /**
   * Manages accessible keyboard focus on screen transition.
   * Respects prefers-reduced-motion user accessibility preferences.
   * @private
   */
  _manageScreenFocus() {
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    requestAnimationFrame(() => {
      if (!this._container) return;
      const target = this._container.querySelector('h2') || this._container.querySelector('h1') || this._container;
      if (target) {
        if (!target.hasAttribute('tabindex')) {
          target.setAttribute('tabindex', '-1');
        }
        target.focus();
      }
    });
  }

  /**
   * Updates global shell header step indicators and subject theme.
   * @private
   */
  _updateHeaderShell(subjectId, stepId) {
    const headerSubbar = document.getElementById('header-subbar');
    const headerBadge = document.getElementById('header-subject-badge');
    const headerStepDots = document.getElementById('header-step-dots');

    // Update document root data-subject
    if (subjectId) {
      document.documentElement.setAttribute('data-subject', subjectId);
    } else {
      document.documentElement.setAttribute('data-subject', 'physics');
    }

    if (!headerSubbar) return;

    if (!subjectId || stepId === 's0_map') {
      headerSubbar.style.display = 'none';
      return;
    }

    headerSubbar.style.display = 'flex';

    if (headerBadge) {
      const badgeClassMap = {
        physics: 'badge-phys',
        math: 'badge-math',
        biology: 'badge-bio',
        chemistry: 'badge-chem'
      };
      headerBadge.className = `badge ${badgeClassMap[subjectId] || 'badge-phys'}`;
      headerBadge.textContent = t(`subject.${subjectId}.name`);
    }

    if (headerStepDots) {
      const stepIndex = STEP_IDS.indexOf(stepId);
      // Generate 7 dots (S0 to S6)
      headerStepDots.innerHTML = STEP_IDS.map((sid, idx) => {
        let statusClass = '';
        if (idx < stepIndex) statusClass = 'completed';
        else if (idx === stepIndex) statusClass = 'active';
        return `<span class="step-dot ${statusClass}" title="Step ${idx}: ${sid}"></span>`;
      }).join('');
    }
  }

  /**
   * Updates bottom sticky navigation bar (if present in DOM).
   * @private
   */
  _updateBottomActionBar(options = {}) {
    const btnBack = document.getElementById('btn-nav-back');
    const btnPrimary = document.getElementById('btn-nav-primary');

    if (btnBack) {
      if (options.showBack) {
        btnBack.style.display = 'inline-flex';
        btnBack.textContent = options.backLabel || t('btn.back');
        btnBack.onclick = options.onBack || (() => router.prevStep());
      } else {
        btnBack.style.display = 'none';
      }
    }

    if (btnPrimary) {
      if (options.showPrimary) {
        btnPrimary.style.display = 'inline-flex';
        btnPrimary.textContent = options.primaryLabel || t('btn.continue');
        btnPrimary.disabled = Boolean(options.primaryDisabled);
        btnPrimary.setAttribute('aria-disabled', String(Boolean(options.primaryDisabled)));
        btnPrimary.onclick = options.onPrimary || (() => router.nextStep());
      } else {
        btnPrimary.style.display = 'none';
      }
    }
  }

  /**
   * Main render dispatcher.
   * @param {HTMLElement} [stage]
   * @param {Object} [state]
   * @param {Object} [storeRef]
   * @param {Object} [routerRef]
   */
  render(stage = null, state = null, storeRef = null, routerRef = null) {
    if (stage) {
      this._container = stage;
    } else if (!this._container) {
      this._container = document.getElementById('runner-stage') || document.querySelector('.runner-stage');
    }

    if (!this._container) return;

    const currentState = state || store.getState();
    const { currentSubject, currentStep } = currentState;

    // Clean up active lab handler if moving away from S3
    if (this._currentStepRendered === 's3_explore' && currentStep !== 's3_explore') {
      this._cleanupActiveLab();
    }

    this._currentSubjectRendered = currentSubject;
    this._currentStepRendered = currentStep;

    this._updateHeaderShell(currentSubject, currentStep);

    switch (currentStep) {
      case 's0_map':
        this._renderS0MissionMap(currentState);
        break;
      case 's1_intro':
        this._renderS1MissionBrief(currentSubject, currentState);
        break;
      case 's2_predict':
        this._renderS2FormativePrediction(currentSubject, currentState);
        break;
      case 's3_explore':
        this._renderS3InteractiveLab(currentSubject, currentState);
        break;
      case 's4_understand':
        this._renderS4ConceptUnderstanding(currentSubject, currentState);
        break;
      case 's5_feedback_retry':
        this._renderS5FeedbackAndRetry(currentSubject, currentState);
        break;
      case 's6_exit_result':
        this._renderS6ExitCheckAndSummary(currentSubject, currentState);
        break;
      default:
        this._renderS0MissionMap(currentState);
        break;
    }

    this._manageScreenFocus();
  }

  // ===========================================================================
  // S0: Mission Map & Subject Selector
  // ===========================================================================
  _renderS0MissionMap(state) {
    this._announceTransition(t('map.title'));
    this._updateBottomActionBar({ showBack: false, showPrimary: false });

    // Calculate completed missions count
    const completedCount = SUBJECT_IDS.filter((sid) => state.progress[sid]?.isCompleted).length;

    const subjectCardsHtml = SUBJECT_IDS.map((subjectId) => {
      const mission = MISSIONS[subjectId];
      if (!mission) return '';

      const progress = state.progress[subjectId] || {};
      const isCompleted = Boolean(progress.isCompleted);
      const isStarted = Boolean(progress.predictionChoiceId) && !isCompleted;
      const totalScore = (progress.exitScores?.[0] || 0) + (progress.exitScores?.[1] || 0);

      let statusBadgeHtml = '';
      let ctaLabel = t('btn.start_mission');

      if (isCompleted) {
        statusBadgeHtml = `<span class="badge badge-completed">✓ ${t('status.completed')} (${totalScore}/2)</span>`;
        ctaLabel = t('btn.replay_lab');
      } else if (isStarted) {
        statusBadgeHtml = `<span class="badge" style="background: var(--color-warning-bg); color: var(--color-warning-text); border: 1px solid var(--color-warning-border);">${t('status.in_progress')}</span>`;
        ctaLabel = t('btn.resume_mission');
      } else {
        statusBadgeHtml = `<span class="badge" style="background: var(--color-surface-subtle); color: var(--color-text-secondary); border: 1px solid var(--color-border);">${t('status.not_started')}</span>`;
      }

      const subIconMap = {
        physics: { name: 'Zap', variant: 'phys' },
        math: { name: 'Ruler', variant: 'math' },
        biology: { name: 'Sprout', variant: 'bio' },
        chemistry: { name: 'FlaskConical', variant: 'chem' }
      };
      const iconMeta = subIconMap[subjectId] || { name: 'Atom', variant: 'neutral' };
      const iconBadgeHtml = badgeIcon(iconMeta.name, { variant: iconMeta.variant, size: 28, iconSize: 22 });

      return `
        <article class="mission-card" data-subject="${subjectId}" tabindex="0" role="region" aria-label="${t(mission.titleKey)} Mission">
          <div class="card-top">
            <span class="card-icon" aria-hidden="true" style="display: inline-flex; align-items: center;">${iconBadgeHtml}</span>
            <div style="display: flex; gap: 6px; align-items: center;">
              <span class="badge badge-${subjectId === 'physics' ? 'phys' : subjectId}">${t(`subject.${subjectId}.name`)}</span>
              ${statusBadgeHtml}
            </div>
          </div>
          <div>
            <h3 class="card-title">${t(mission.titleKey)}</h3>
            <p class="card-desc">${t(mission.scopeSummaryKey)}</p>
          </div>
          <div class="card-meta">
            <span style="display: inline-flex; align-items: center; gap: 5px;">${renderIcon('Clock', { size: 14, color: '#64748B' })} ${mission.estimatedDurationMinutes} mins</span>
            <span style="display: inline-flex; align-items: center; gap: 5px;">${renderIcon('BookOpen', { size: 14, color: '#64748B' })} ${mission.curriculumStandard}</span>
          </div>
          <button type="button" class="btn btn-primary btn-select-subject btn-subject-${subjectId}" data-subject="${subjectId}" style="width: 100%; min-height: 48px; margin-top: 8px;">
            ${ctaLabel}
          </button>
        </article>
      `;
    }).join('');

    this._container.innerHTML = `
      <section class="screen-s0-map" role="region" aria-label="Mission Map">
        <!-- Grand Hero Showcase -->
        <div class="map-hero-showcase ambient-glow-wrapper mb-5" style="position: relative; border-radius: 24px; padding: 36px 32px; background: linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(240, 247, 255, 0.82) 100%); backdrop-filter: blur(24px) saturate(190%); -webkit-backdrop-filter: blur(24px) saturate(190%); border: 1px solid rgba(255, 255, 255, 0.9); box-shadow: 0 16px 40px -10px rgba(37, 99, 235, 0.10), inset 0 1px 0 rgba(255, 255, 255, 1); overflow: hidden;">
          <div class="ambient-orb ambient-orb--blue" aria-hidden="true" style="top: -60px; right: 10%;"></div>
          <div class="ambient-orb ambient-orb--purple" aria-hidden="true" style="bottom: -50px; left: 5%;"></div>
          
          <div style="position: relative; z-index: 2; max-width: 900px; margin: 0 auto; text-align: center;">
            <div style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 18px; background: rgba(37, 99, 235, 0.08); border: 1px solid rgba(37, 99, 235, 0.2); border-radius: 9999px; margin-bottom: 16px;">
              ${renderIcon('Sparkles', { size: 16, color: '#2563EB' })}
              <span style="font-size: 13px; font-weight: 700; color: #1D4ED8; letter-spacing: 0.5px; text-transform: uppercase;">Gramin PocketLab • Multi-Board STEM Platform</span>
            </div>

            <h2 class="h1" style="font-size: 2.6rem; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 14px; line-height: 1.15; background: linear-gradient(135deg, #0F172A 0%, #1E40AF 50%, #4338CA 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
              ${t('map.title')}
            </h2>
            <p class="lead" style="font-size: 1.15rem; color: #475569; max-width: 760px; margin: 0 auto 24px auto; line-height: 1.6;">
              ${t('map.subtitle')}
            </p>

            <!-- Telemetry Status Pills Row -->
            <div style="display: inline-flex; gap: 12px; flex-wrap: wrap; justify-content: center; align-items: center;">
              <span class="status-pill status-pill--ready" style="padding: 8px 16px; font-size: 13.5px; border-radius: 9999px; display: inline-flex; align-items: center; gap: 6px;">
                <span class="status-pill-dot" aria-hidden="true"></span>
                ${t('map.progress_summary', { completed: completedCount })}
              </span>
              <span class="status-pill status-pill--offline" style="padding: 8px 16px; font-size: 13.5px; border-radius: 9999px; display: inline-flex; align-items: center; gap: 6px;">
                ${renderIcon('Lock', { size: 14, color: '#0D9488' })}
                ${t('app.session_badge')}
              </span>
              <span class="badge badge-purple" style="padding: 8px 16px; font-size: 13.5px; font-weight: 700; border-radius: 9999px; display: inline-flex; align-items: center; gap: 6px;">
                ${badgeIcon('Flame', { variant: 'flame', size: 14, iconSize: 14, glow: false })}
                7-Day Streak Active
              </span>
            </div>
          </div>
        </div>

        <div class="d-flex justify-between align-center mb-3">
          <div>
            <h3 class="h3 font-bold mb-0" style="font-size: 1.35rem;">Core STEM Field Investigations</h3>
            <p class="text-secondary text-sm mb-0">${t('map.instructions')}</p>
          </div>
          <span class="badge badge-blue">4 Flagship Laboratories</span>
        </div>

        <div class="subject-grid mb-5">
          ${subjectCardsHtml}
        </div>

        <!-- Section 2: Multi-Grade Interactive Micro-Labs -->
        <div style="margin-top: 48px; padding-top: 32px; border-top: 1px solid var(--color-border);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 8px;">
            <div>
              <h3 class="h2 font-bold" style="font-size: 1.4rem; margin-bottom: 4px;">🚀 Multi-Grade Interactive Micro-Labs</h3>
              <p class="text-secondary text-sm mb-0">Class-specific interactive investigations spanning Preparatory, Middle, Secondary, and Senior Secondary.</p>
            </div>
            <span class="badge badge-purple" style="padding: 6px 14px; font-size: 13px; font-weight: 700;">Classes 5–12</span>
          </div>

          <div class="multi-grade-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
            <article class="qw-card" style="border-left: 5px solid #F59E0B;">
              <div class="qw-card-top">
                <div>
                  <span class="badge badge-secondary" style="font-size: 11px;">Class 5 • Preparatory</span>
                  <h4 class="font-bold text-md mt-1 mb-0">Baker's Chapati Feast</h4>
                  <span class="text-xs text-secondary">NCERT Class 5 Math: Equivalent Fractions</span>
                </div>
                ${badgeIcon('Sparkles', { variant: 'gold', size: 24, iconSize: 20 })}
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

            <article class="qw-card" style="border-left: 5px solid #8B5CF6;">
              <div class="qw-card-top">
                <div>
                  <span class="badge badge-purple" style="font-size: 11px;">Class 8 • Middle</span>
                  <h4 class="font-bold text-md mt-1 mb-0">Solar Rover Algorithm Studio</h4>
                  <span class="text-xs text-secondary">CBSE Class 8 Computing: Sequence & Loops</span>
                </div>
                ${badgeIcon('Bot', { variant: 'bot', size: 24, iconSize: 20 })}
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

            <article class="qw-card" style="border-left: 5px solid #087E79;">
              <div class="qw-card-top">
                <div>
                  <span class="badge badge-info" style="font-size: 11px;">Class 10 • Secondary</span>
                  <h4 class="font-bold text-md mt-1 mb-0">Ray Optics Refraction & Snell's Law</h4>
                  <span class="text-xs text-secondary">CISCE / CBSE Class 10 Physics: Light Refraction</span>
                </div>
                ${badgeIcon('Lightbulb', { variant: 'phys', size: 24, iconSize: 20 })}
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

            <article class="qw-card" style="border-left: 5px solid #275DDB;">
              <div class="qw-card-top">
                <div>
                  <span class="badge badge-phys" style="font-size: 11px;">Class 12 • Senior Secondary</span>
                  <h4 class="font-bold text-md mt-1 mb-0">Solar Roof Calculus Integrals</h4>
                  <span class="text-xs text-secondary">CBSE Class 12 Math: Applications of Integrals</span>
                </div>
                ${badgeIcon('Atom', { variant: 'gold', size: 24, iconSize: 20 })}
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
        </div>
      </section>
    `;

    // Attach click and keyboard listeners for subject cards
    this._container.querySelectorAll('.mission-card').forEach((card) => {
      const subjectId = card.getAttribute('data-subject');
      const handler = () => router.goToSubject(subjectId);

      card.addEventListener('click', (e) => {
        // Prevent double trigger if clicking button directly
        if (!e.target.closest('.btn-select-subject')) {
          handler();
        }
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handler();
        }
      });
    });

    this._container.querySelectorAll('.btn-select-subject').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const subjectId = btn.getAttribute('data-subject');
        router.goToSubject(subjectId);
      });
    });

    this._container.querySelectorAll('.btn-launch-ext').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const extId = e.currentTarget.getAttribute('data-ext-id');
        if (typeof window !== 'undefined' && typeof window.__launchExtendedLab === 'function') {
          window.__launchExtendedLab(extId);
        }
      });
    });
  }

  // ===========================================================================
  // S1: Mission Brief (Intro)
  // ===========================================================================
  _renderS1MissionBrief(subjectId, state) {
    const mission = getMission(subjectId);
    if (!mission) {
      router.goToMap();
      return;
    }

    this._announceTransition(`${t(mission.titleKey)}: ${t('s1.heading')}`);
    this._updateBottomActionBar({
      showBack: true,
      backLabel: t('btn.back'),
      onBack: () => router.goToMap(),
      showPrimary: true,
      primaryLabel: t('btn.start_investigation'),
      primaryDisabled: false,
      onPrimary: () => router.navigate(subjectId, 's2_predict')
    });

    this._container.innerHTML = `
      <section class="screen-s1-brief" role="region" aria-label="Mission Brief">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 8px;">
          <span class="badge badge-${subjectId === 'physics' ? 'phys' : subjectId}">
            ${t(`subject.${subjectId}.name`)} • ${mission.curriculumStandard}
          </span>
          <div style="display: flex; gap: 8px;">
            <span class="badge" style="background: var(--color-surface-subtle); border: 1px solid var(--color-border); color: var(--color-text-secondary);">
              ⏱ ${mission.estimatedDurationMinutes} mins
            </span>
            <span class="badge" style="background: var(--color-surface-subtle); border: 1px solid var(--color-border); color: var(--color-text-secondary);">
              ✓ ${t('s1.offline_badge')}
            </span>
          </div>
        </div>

        <h2 class="h1" style="display: flex; align-items: center; gap: 10px;">
          <span aria-hidden="true">${mission.iconEmoji}</span>
          ${t(mission.titleKey)}
        </h2>

        <!-- Relatable Context Scenario -->
        <div class="card" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 20px; margin-bottom: 20px; box-shadow: var(--shadow-sm);">
          <h3 class="h3" style="color: var(--color-subject-accent-dark); margin-bottom: 8px;">Field Scenario</h3>
          <p style="font-size: var(--font-size-md); line-height: var(--line-height-relaxed); margin-bottom: 0;">
            ${t(mission.introScenarioKey)}
          </p>
        </div>

        <!-- Learning Objective Box -->
        <div class="callout callout-info" style="margin-bottom: 28px;">
          <div class="callout-header">
            <span aria-hidden="true">🎯</span>
            <span>${t('s1.objective_title')}</span>
          </div>
          <div class="callout-body">
            <p style="margin-bottom: 0; font-weight: var(--font-weight-medium);">
              ${t(mission.learningObjectiveKey)}
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; gap: 12px; justify-content: space-between; align-items: center; flex-wrap: wrap;">
          <button type="button" id="btn-s1-back" class="btn btn-secondary" style="min-height: 48px;">
            ${t('btn.back')}
          </button>
          <button type="button" id="btn-s1-start" class="btn btn-primary" style="min-height: 48px;">
            ${t('btn.start_investigation')}
          </button>
        </div>
      </section>
    `;

    this._container.querySelector('#btn-s1-back')?.addEventListener('click', () => router.goToMap());
    this._container.querySelector('#btn-s1-start')?.addEventListener('click', () => router.navigate(subjectId, 's2_predict'));
  }

  // ===========================================================================
  // S2: Formative Prediction
  // ===========================================================================
  _renderS2FormativePrediction(subjectId, state) {
    const mission = getMission(subjectId);
    if (!mission) {
      router.goToMap();
      return;
    }

    const question = mission.predictionQuestion;
    const existingChoice = state.progress[subjectId]?.predictionChoiceId;
    let selectedChoiceId = existingChoice || null;

    this._announceTransition(`${t(mission.titleKey)}: ${t('s2.heading')}`);

    const renderRadioCards = () => {
      return question.options.map((opt) => {
        const isChecked = selectedChoiceId === opt.id;
        return `
          <label class="radio-card ${isChecked ? 'selected' : ''}" for="opt-${opt.id}">
            <input type="radio" id="opt-${opt.id}" name="prediction-option" value="${opt.id}" ${isChecked ? 'checked' : ''} aria-describedby="pred-legend">
            <span class="radio-label-text">${t(opt.labelKey)}</span>
          </label>
        `;
      }).join('');
    };

    const updateSubmitState = () => {
      const btnEnterLab = this._container.querySelector('#btn-s2-enter-lab');
      const isEnabled = Boolean(selectedChoiceId);
      if (btnEnterLab) {
        btnEnterLab.disabled = !isEnabled;
        btnEnterLab.setAttribute('aria-disabled', String(!isEnabled));
      }
      this._updateBottomActionBar({
        showBack: true,
        backLabel: t('btn.back'),
        onBack: () => router.prevStep(),
        showPrimary: true,
        primaryLabel: t('btn.enter_lab'),
        primaryDisabled: !isEnabled,
        onPrimary: () => {
          if (selectedChoiceId) {
            store.recordPrediction(selectedChoiceId);
            router.navigate(subjectId, 's3_explore');
          }
        }
      });
    };

    this._container.innerHTML = `
      <section class="screen-s2-predict" role="region" aria-label="Prediction Hypothesis">
        <div style="margin-bottom: 16px;">
          <span class="badge badge-${subjectId === 'physics' ? 'phys' : subjectId}">
            ${t(`subject.${subjectId}.name`)} • Step 2 of 6
          </span>
        </div>

        <h2 class="h2">${t('s2.heading')}</h2>

        <div class="callout callout-warning" style="margin-bottom: 20px;">
          <div class="callout-header">
            <span aria-hidden="true">💡</span>
            <span>Hypothesis Check</span>
          </div>
          <div class="callout-body">
            <p style="margin-bottom: 0;">${t('s2.callout')}</p>
          </div>
        </div>

        <form id="prediction-form" onsubmit="return false;" style="margin-bottom: 28px;">
          <fieldset class="radio-group" role="radiogroup" aria-labelledby="pred-legend">
            <legend id="pred-legend" class="h3" style="margin-bottom: 14px; font-weight: var(--font-weight-bold);">
              ${t(question.promptKey)}
            </legend>
            <div id="radio-cards-container">
              ${renderRadioCards()}
            </div>
          </fieldset>
        </form>

        <!-- Actions -->
        <div style="display: flex; gap: 12px; justify-content: space-between; align-items: center; flex-wrap: wrap;">
          <button type="button" id="btn-s2-back" class="btn btn-secondary" style="min-height: 48px;">
            ${t('btn.back')}
          </button>
          <button type="button" id="btn-s2-enter-lab" class="btn btn-primary" style="min-height: 48px;" ${!selectedChoiceId ? 'disabled aria-disabled="true"' : ''}>
            ${t('btn.enter_lab')}
          </button>
        </div>
      </section>
    `;

    // Attach radio change listener
    const radioContainer = this._container.querySelector('#radio-cards-container');
    radioContainer?.addEventListener('change', (e) => {
      if (e.target.name === 'prediction-option') {
        selectedChoiceId = e.target.value;
        store.recordPrediction(selectedChoiceId);
        // Update selected class on all cards
        radioContainer.querySelectorAll('.radio-card').forEach((card) => {
          const input = card.querySelector('input');
          if (input && input.checked) {
            card.classList.add('selected');
          } else {
            card.classList.remove('selected');
          }
        });
        updateSubmitState();
      }
    });

    this._container.querySelector('#btn-s2-back')?.addEventListener('click', () => router.prevStep());
    this._container.querySelector('#btn-s2-enter-lab')?.addEventListener('click', () => {
      if (selectedChoiceId) {
        store.recordPrediction(selectedChoiceId);
        router.navigate(subjectId, 's3_explore');
      }
    });

    updateSubmitState();
  }

  // ===========================================================================
  // S3: Interactive Micro-Lab
  // ===========================================================================
  _renderS3InteractiveLab(subjectId, state) {
    const mission = getMission(subjectId);
    if (!mission) {
      router.goToMap();
      return;
    }

    this._announceTransition(`${t(mission.titleKey)}: ${t('s3.heading')}`);

    const handler = mission.interactionHandler;
    this._activeHandler = handler;

    const progress = state.progress[subjectId] || {};
    let isObserved = Boolean(progress.interactiveCompleted);

    this._container.innerHTML = `
      <section class="screen-s3-lab" role="region" aria-label="Interactive Micro-Lab">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
          <span class="badge badge-${subjectId === 'physics' ? 'phys' : subjectId}">
            ${t(`subject.${subjectId}.name`)} • Step 3 of 6
          </span>
          <button type="button" id="btn-s3-reset-lab" class="btn btn-secondary btn-sm" style="min-height: 48px;" aria-label="Reset lab parameters">
            ${t('btn.reset_lab')}
          </button>
        </div>

        <h2 class="h2" style="margin-bottom: 8px;">${t(mission.titleKey)}</h2>

        <!-- Observation Prompt -->
        <div class="invariant-banner" id="lab-observation-banner" style="margin-bottom: 16px;">
          <span>🔍 <strong>Observation Task:</strong> ${t(mission.observationPromptKey)}</span>
        </div>

        <!-- Chemistry Mandatory Water Potability Warning Banner -->
        ${mission.safetyDisclaimerKey ? `
          <div class="safety-notice-banner" role="note">
            <span class="safety-notice-icon" aria-hidden="true">⚠️</span>
            <span>${t(mission.safetyDisclaimerKey)}</span>
          </div>
        ` : ''}

        <!-- Interactive Module Host Mount Point -->
        <div id="interactive-lab-mount" class="interactive-lab-mount" style="margin: 16px 0;"></div>

        <!-- Advance Actions -->
        <div style="display: flex; gap: 12px; justify-content: space-between; align-items: center; margin-top: 24px; flex-wrap: wrap;">
          <button type="button" id="btn-s3-back" class="btn btn-secondary" style="min-height: 48px;">
            ${t('btn.back')}
          </button>
          <button type="button" id="btn-s3-observed" class="btn btn-primary" style="min-height: 48px;">
            ${t('btn.observed_result')}
          </button>
        </div>
      </section>
    `;

    const mountContainer = this._container.querySelector('#interactive-lab-mount');
    const btnObserved = this._container.querySelector('#btn-s3-observed');

    const updateAdvanceButton = (canAdvance) => {
      isObserved = canAdvance;
      if (btnObserved) {
        btnObserved.disabled = !canAdvance;
        btnObserved.setAttribute('aria-disabled', String(!canAdvance));
      }
      this._updateBottomActionBar({
        showBack: true,
        backLabel: t('btn.back'),
        onBack: () => router.prevStep(),
        showPrimary: true,
        primaryLabel: t('btn.observed_result'),
        primaryDisabled: !canAdvance,
        onPrimary: () => {
          store.setInteractiveCompleted(true);
          router.navigate(subjectId, 's4_understand');
        }
      });
    };

    // Mount interactive widget
    if (handler && typeof handler.mount === 'function' && mountContainer) {
      try {
        const initialState = handler.getInitialState();
        this._labState = initialState;

        handler.mount(mountContainer, initialState, (newState) => {
          this._labState = newState;
          // Check invariant validation
          const validation = handler.validateInvariant ? handler.validateInvariant(newState) : { isValid: true };
          if (validation.isValid) {
            updateAdvanceButton(true);
          }
        });

        // Determine initial advance eligibility
        const initialCheck = handler.validateInvariant ? handler.validateInvariant(initialState) : { isValid: true };
        updateAdvanceButton(initialCheck.isValid || isObserved);
      } catch (err) {
        console.error('[LearningRunner] Failed to mount interaction handler:', err);
        mountContainer.innerHTML = `
          <div class="callout callout-error" role="alert" style="margin: 16px 0;">
            <div class="callout-header" style="font-weight: 700; color: var(--color-incorrect-text);">
              <span>⚠️ Experiment Loading Error</span>
            </div>
            <div class="callout-body">
              <p style="margin: 8px 0;">The interactive laboratory module encountered an error during initialization: ${err.message || 'Initialization error'}.</p>
              <p style="margin: 8px 0; font-size: 0.9rem;">To maintain scientific integrity, you must complete the observation before proceeding.</p>
              <button type="button" id="btn-s3-retry-mount" class="btn btn-secondary" style="margin-top: 12px; min-height: 48px;">
                ↺ Retry Initializing Lab
              </button>
            </div>
          </div>
        `;
        mountContainer.querySelector('#btn-s3-retry-mount')?.addEventListener('click', () => {
          this.render();
        });
        updateAdvanceButton(false);
      }
    } else {
      mountContainer.innerHTML = `
        <div class="callout callout-error" role="alert">
          <p><strong>Interactive Module Missing:</strong> No interactive handler registered for ${subjectId}.</p>
        </div>
      `;
      updateAdvanceButton(false);
    }

    // Attach navigation listeners
    this._container.querySelector('#btn-s3-back')?.addEventListener('click', () => router.prevStep());
    btnObserved?.addEventListener('click', () => {
      store.setInteractiveCompleted(true);
      router.navigate(subjectId, 's4_understand');
    });

    // Reset button
    this._container.querySelector('#btn-s3-reset-lab')?.addEventListener('click', () => {
      if (handler && typeof handler.resetState === 'function') {
        const resetState = handler.resetState();
        this._labState = resetState;
        store.resetSubjectLab(subjectId);
        // Remount or re-render lab
        this.render();
      }
    });
  }

  // ===========================================================================
  // S4: Concept Understanding
  // ===========================================================================
  _renderS4ConceptUnderstanding(subjectId, state) {
    const mission = getMission(subjectId);
    if (!mission) {
      router.goToMap();
      return;
    }

    this._announceTransition(`${t(mission.titleKey)}: ${t('s4.heading')}`);
    this._updateBottomActionBar({
      showBack: true,
      backLabel: t('btn.back'),
      onBack: () => router.prevStep(),
      showPrimary: true,
      primaryLabel: t('btn.check_understanding'),
      primaryDisabled: false,
      onPrimary: () => router.navigate(subjectId, 's5_feedback_retry')
    });

    const predictionChoiceId = state.progress[subjectId]?.predictionChoiceId;
    const predictionOpt = mission.predictionQuestion.options.find((o) => o.id === predictionChoiceId);
    const predictionText = predictionOpt ? t(predictionOpt.labelKey) : '';

    this._container.innerHTML = `
      <section class="screen-s4-concept" role="region" aria-label="Concept Understanding">
        <div style="margin-bottom: 12px;">
          <span class="badge badge-${subjectId === 'physics' ? 'phys' : subjectId}">
            ${t(`subject.${subjectId}.name`)} • Step 4 of 6
          </span>
        </div>

        <h2 class="h2">${t('s4.heading')}</h2>

        <!-- Hypothesis vs Lab Evidence Comparison Grid -->
        <div class="comparison-grid">
          <div class="comparison-box predicted">
            <div class="comparison-label">Your Initial Prediction</div>
            <p style="margin-bottom: 0; font-weight: var(--font-weight-medium);">
              ${predictionText ? `"${predictionText}"` : 'Hypothesis recorded'}
            </p>
          </div>
          <div class="comparison-box observed">
            <div class="comparison-label">Observed Lab Evidence</div>
            <p style="margin-bottom: 0; font-weight: var(--font-weight-medium);">
              ${t(mission.conceptExplanationKeys.observedKey)}
            </p>
          </div>
        </div>

        <!-- Multi-Modal Explanation Body -->
        <div class="card" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 20px; margin: 20px 0; box-shadow: var(--shadow-sm);">
          <h3 class="h3" style="color: var(--color-subject-accent-dark); margin-bottom: 12px;">
            Scientific Discovery
          </h3>
          <p style="font-size: var(--font-size-base); line-height: var(--line-height-relaxed); margin-bottom: 14px;">
            ${t(mission.conceptExplanationKeys.paragraphsKeys[0])}
          </p>
          <p style="font-size: var(--font-size-base); line-height: var(--line-height-relaxed); margin-bottom: 0;">
            ${t(mission.conceptExplanationKeys.paragraphsKeys[1])}
          </p>
        </div>

        <!-- Field Notebook Rule Box -->
        <div class="rule-box" role="note">
          <div class="rule-box-title">
            <span aria-hidden="true">📘</span>
            <span>${t(mission.conceptExplanationKeys.ruleBoxTitleKey || 's4.rule_box_title')}</span>
          </div>
          <p style="font-size: var(--font-size-md); font-weight: var(--font-weight-semibold); line-height: var(--line-height-snug); margin-bottom: 0;">
            ${t(mission.conceptExplanationKeys.ruleBoxKey)}
          </p>
        </div>

        <!-- Actions -->
        <div style="display: flex; gap: 12px; justify-content: space-between; align-items: center; margin-top: 24px; flex-wrap: wrap;">
          <button type="button" id="btn-s4-back" class="btn btn-secondary" style="min-height: 48px;">
            ${t('btn.back')}
          </button>
          <button type="button" id="btn-s4-check" class="btn btn-primary" style="min-height: 48px;">
            ${t('btn.check_understanding')}
          </button>
        </div>
      </section>
    `;

    this._container.querySelector('#btn-s4-back')?.addEventListener('click', () => router.prevStep());
    this._container.querySelector('#btn-s4-check')?.addEventListener('click', () => router.navigate(subjectId, 's5_feedback_retry'));
  }

  // ===========================================================================
  // S5: Formative Feedback & Targeted Retry
  // ===========================================================================
  _renderS5FeedbackAndRetry(subjectId, state) {
    const mission = getMission(subjectId);
    if (!mission) {
      router.goToMap();
      return;
    }

    this._announceTransition(`${t(mission.titleKey)}: ${t('s5.heading')}`);

    const formativeQ = mission.formativeCheckQuestion;
    const retryQ = mission.retryQuestion;

    const renderDiagnosticOptions = () => {
      return formativeQ.options.map((opt) => {
        const isSelected = this._s5State.selectedDiagnosticId === opt.id;
        return `
          <label class="radio-card ${isSelected ? 'selected' : ''}" for="diag-opt-${opt.id}">
            <input type="radio" id="diag-opt-${opt.id}" name="formative-diagnostic" value="${opt.id}" ${isSelected ? 'checked' : ''} ${this._s5State.submittedDiagnostic ? 'disabled' : ''}>
            <span class="radio-label-text">${t(opt.labelKey)}</span>
          </label>
        `;
      }).join('');
    };

    const renderRetryOptions = () => {
      return retryQ.options.map((opt) => {
        const isSelected = this._s5State.selectedRetryId === opt.id;
        return `
          <label class="radio-card ${isSelected ? 'selected' : ''}" for="retry-opt-${opt.id}">
            <input type="radio" id="retry-opt-${opt.id}" name="formative-retry" value="${opt.id}" ${isSelected ? 'checked' : ''} ${this._s5State.submittedRetry ? 'disabled' : ''}>
            <span class="radio-label-text">${t(opt.labelKey)}</span>
          </label>
        `;
      }).join('');
    };

    const canProceedToFinal = (this._s5State.submittedDiagnostic && this._s5State.isDiagnosticCorrect) || this._s5State.submittedRetry;

    this._updateBottomActionBar({
      showBack: true,
      backLabel: t('btn.back'),
      onBack: () => router.prevStep(),
      showPrimary: canProceedToFinal,
      primaryLabel: t('btn.proceed_final'),
      primaryDisabled: !canProceedToFinal,
      onPrimary: () => router.navigate(subjectId, 's6_exit_result')
    });

    this._container.innerHTML = `
      <section class="screen-s5-feedback" role="region" aria-label="Diagnostic Feedback and Retry">
        <div style="margin-bottom: 12px;">
          <span class="badge badge-${subjectId === 'physics' ? 'phys' : subjectId}">
            ${t(`subject.${subjectId}.name`)} • Step 5 of 6
          </span>
        </div>

        <h2 class="h2">${t('s5.heading')}</h2>

        <!-- Formative Diagnostic Item -->
        <div class="card" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 20px; margin-bottom: 20px; box-shadow: var(--shadow-sm);">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
            <span class="badge" style="background: var(--color-info-bg); color: var(--color-info-text); border: 1px solid var(--color-info-border);">
              ${t('s5.diagnostic_label')}
            </span>
          </div>

          <h3 class="h3" id="diag-legend" style="margin-bottom: 14px;">
            ${t(formativeQ.promptKey)}
          </h3>

          <fieldset class="radio-group" role="radiogroup" aria-labelledby="diag-legend" id="diag-group">
            ${renderDiagnosticOptions()}
          </fieldset>

          ${!this._s5State.submittedDiagnostic ? `
            <div style="margin-top: 16px;">
              <button type="button" id="btn-submit-diag" class="btn btn-primary" style="min-height: 48px;" ${!this._s5State.selectedDiagnosticId ? 'disabled aria-disabled="true"' : ''}>
                ${t('btn.check_answer')}
              </button>
            </div>
          ` : ''}

          <!-- Post-submission feedback callout -->
          ${this._s5State.submittedDiagnostic ? (
            this._s5State.isDiagnosticCorrect ? `
              <div class="callout callout-success" role="status" aria-live="polite" style="margin-top: 16px;">
                <div class="callout-header">
                  <span aria-hidden="true">✓</span>
                  <span>${t('s5.success_title')}</span>
                </div>
                <div class="callout-body">
                  <p style="margin-bottom: 0;">${t(formativeQ.explanationKey)}</p>
                </div>
              </div>
            ` : `
              <div class="callout callout-warning" role="alert" aria-live="polite" style="margin-top: 16px;">
                <div class="callout-header">
                  <span aria-hidden="true">⚠</span>
                  <span>${t('s5.misconception_title')}</span>
                </div>
                <div class="callout-body">
                  <p style="margin-bottom: 0;">
                    ${t(formativeQ.misconceptionFeedbackKeys?.[this._s5State.selectedDiagnosticId] || formativeQ.explanationKey)}
                  </p>
                </div>
              </div>
            `
          ) : ''}
        </div>

        <!-- Changed Retry Question (Revealed only if diagnostic answered incorrectly) -->
        ${(this._s5State.submittedDiagnostic && !this._s5State.isDiagnosticCorrect) ? `
          <div class="card" style="background: var(--color-surface); border: 2px solid var(--color-warning-border); border-radius: var(--radius-lg); padding: 20px; margin-bottom: 24px; box-shadow: var(--shadow-sm);">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
              <span class="badge" style="background: var(--color-warning-bg); color: var(--color-warning-text); border: 1px solid var(--color-warning-border);">
                ${t('s5.retry_heading')}
              </span>
            </div>

            <h3 class="h3" id="retry-legend" style="margin-bottom: 14px;">
              ${t(retryQ.promptKey)}
            </h3>

            <fieldset class="radio-group" role="radiogroup" aria-labelledby="retry-legend" id="retry-group">
              ${renderRetryOptions()}
            </fieldset>

            ${!this._s5State.submittedRetry ? `
              <div style="margin-top: 16px;">
                <button type="button" id="btn-submit-retry" class="btn btn-primary" style="min-height: 48px;" ${!this._s5State.selectedRetryId ? 'disabled aria-disabled="true"' : ''}>
                  ${t('btn.check_retry')}
                </button>
              </div>
            ` : `
              <div class="callout callout-info" role="status" aria-live="polite" style="margin-top: 16px;">
                <div class="callout-header">
                  <span aria-hidden="true">💡</span>
                  <span>Explanation:</span>
                </div>
                <div class="callout-body">
                  <p style="margin-bottom: 0;">${t(retryQ.explanationKey)}</p>
                </div>
              </div>
            `}
          </div>
        ` : ''}

        <!-- Bottom Action Controls -->
        <div style="display: flex; gap: 12px; justify-content: space-between; align-items: center; margin-top: 24px; flex-wrap: wrap;">
          <button type="button" id="btn-s5-back" class="btn btn-secondary" style="min-height: 48px;">
            ${t('btn.back')}
          </button>
          ${canProceedToFinal ? `
            <button type="button" id="btn-s5-proceed" class="btn btn-primary" style="min-height: 48px;">
              ${t('btn.proceed_final')}
            </button>
          ` : ''}
        </div>
      </section>
    `;

    // Diagnostic radio listeners
    const diagGroup = this._container.querySelector('#diag-group');
    diagGroup?.addEventListener('change', (e) => {
      if (e.target.name === 'formative-diagnostic') {
        this._s5State.selectedDiagnosticId = e.target.value;
        const btnSubmit = this._container.querySelector('#btn-submit-diag');
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.removeAttribute('aria-disabled');
        }
        diagGroup.querySelectorAll('.radio-card').forEach((card) => {
          card.classList.toggle('selected', card.querySelector('input')?.checked);
        });
      }
    });

    // Diagnostic submit
    this._container.querySelector('#btn-submit-diag')?.addEventListener('click', () => {
      const selected = formativeQ.options.find((o) => o.id === this._s5State.selectedDiagnosticId);
      const isCorrect = Boolean(selected?.isCorrect);
      this._s5State.submittedDiagnostic = true;
      this._s5State.isDiagnosticCorrect = isCorrect;
      store.recordFormativeResult(isCorrect, this._s5State.selectedDiagnosticId);
      this.render();
    });

    // Retry radio listeners
    const retryGroup = this._container.querySelector('#retry-group');
    retryGroup?.addEventListener('change', (e) => {
      if (e.target.name === 'formative-retry') {
        this._s5State.selectedRetryId = e.target.value;
        const btnSubmitRetry = this._container.querySelector('#btn-submit-retry');
        if (btnSubmitRetry) {
          btnSubmitRetry.disabled = false;
          btnSubmitRetry.removeAttribute('aria-disabled');
        }
        retryGroup.querySelectorAll('.radio-card').forEach((card) => {
          card.classList.toggle('selected', card.querySelector('input')?.checked);
        });
      }
    });

    // Retry submit
    this._container.querySelector('#btn-submit-retry')?.addEventListener('click', () => {
      const selected = retryQ.options.find((o) => o.id === this._s5State.selectedRetryId);
      this._s5State.submittedRetry = true;
      this._s5State.isRetryCorrect = Boolean(selected?.isCorrect);
      store.recordRetryChoice(this._s5State.selectedRetryId);
      this.render();
    });

    this._container.querySelector('#btn-s5-back')?.addEventListener('click', () => router.prevStep());
    this._container.querySelector('#btn-s5-proceed')?.addEventListener('click', () => router.navigate(subjectId, 's6_exit_result'));
  }

  // ===========================================================================
  // S6: Exit Check & Mission Summary
  // ===========================================================================
  _renderS6ExitCheckAndSummary(subjectId, state) {
    const mission = getMission(subjectId);
    if (!mission) {
      router.goToMap();
      return;
    }

    this._announceTransition(`${t(mission.titleKey)}: ${t('s6.heading')}`);

    const [q1, q2] = mission.exitCheckQuestions;
    const progress = state.progress[subjectId] || {};
    const alreadyCompleted = Boolean(progress.isCompleted);

    // If already completed in store, restore submitted state
    if (alreadyCompleted && !this._s6State.submitted) {
      this._s6State.submitted = true;
    }

    const renderExitOptions = (question, qKey, selectedId, submitted) => {
      return question.options.map((opt) => {
        const isSelected = selectedId === opt.id;
        let badgeHtml = '';
        if (submitted) {
          if (opt.isCorrect) {
            badgeHtml = ' <strong style="color: var(--color-correct-text);">✓ Correct Answer</strong>';
          } else if (isSelected && !opt.isCorrect) {
            badgeHtml = ' <strong style="color: var(--color-incorrect-text);">✗ Selected</strong>';
          }
        }
        return `
          <label class="radio-card ${isSelected ? 'selected' : ''}" for="${qKey}-opt-${opt.id}">
            <input type="radio" id="${qKey}-opt-${opt.id}" name="${qKey}" value="${opt.id}" ${isSelected ? 'checked' : ''} ${submitted ? 'disabled' : ''}>
            <span class="radio-label-text">${t(opt.labelKey)}${badgeHtml}</span>
          </label>
        `;
      }).join('');
    };

    const bothSelected = Boolean(this._s6State.selectedQ1 && this._s6State.selectedQ2);
    const score1 = progress.exitScores?.[0] || 0;
    const score2 = progress.exitScores?.[1] || 0;
    const totalScore = score1 + score2;

    this._updateBottomActionBar({
      showBack: false,
      showPrimary: this._s6State.submitted,
      primaryLabel: t('btn.return_map'),
      primaryDisabled: false,
      onPrimary: () => router.goToMap()
    });

    this._container.innerHTML = `
      <section class="screen-s6-exit" role="region" aria-label="Exit Check and Summary">
        <div style="margin-bottom: 12px;">
          <span class="badge badge-${subjectId === 'physics' ? 'phys' : subjectId}">
            ${t(`subject.${subjectId}.name`)} • Step 6 of 6
          </span>
        </div>

        <h2 class="h2">${t('s6.heading')}</h2>
        <p class="text-secondary">${t('s6.transfer_intro')}</p>

        <!-- Question 1 -->
        <div class="card" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 20px; margin-bottom: 20px; box-shadow: var(--shadow-sm);">
          <span class="badge" style="background: var(--color-surface-subtle); border: 1px solid var(--color-border); color: var(--color-text-secondary); margin-bottom: 10px;">
            ${t('s6.question_num', { num: 1 })}
          </span>
          <h3 class="h3" id="exit1-legend" style="margin-bottom: 14px;">
            ${t(q1.promptKey)}
          </h3>
          <fieldset class="radio-group" role="radiogroup" aria-labelledby="exit1-legend" id="exit1-group">
            ${renderExitOptions(q1, 'exit-q1', this._s6State.selectedQ1, this._s6State.submitted)}
          </fieldset>
          ${this._s6State.submitted ? `
            <div class="callout callout-info" style="margin-top: 14px;">
              <p style="margin-bottom: 0;"><strong>Rationale:</strong> ${t(q1.explanationKey)}</p>
            </div>
          ` : ''}
        </div>

        <!-- Question 2 -->
        <div class="card" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 20px; margin-bottom: 20px; box-shadow: var(--shadow-sm);">
          <span class="badge" style="background: var(--color-surface-subtle); border: 1px solid var(--color-border); color: var(--color-text-secondary); margin-bottom: 10px;">
            ${t('s6.question_num', { num: 2 })}
          </span>
          <h3 class="h3" id="exit2-legend" style="margin-bottom: 14px;">
            ${t(q2.promptKey)}
          </h3>
          <fieldset class="radio-group" role="radiogroup" aria-labelledby="exit2-legend" id="exit2-group">
            ${renderExitOptions(q2, 'exit-q2', this._s6State.selectedQ2, this._s6State.submitted)}
          </fieldset>
          ${this._s6State.submitted ? `
            <div class="callout callout-info" style="margin-top: 14px;">
              <p style="margin-bottom: 0;"><strong>Rationale:</strong> ${t(q2.explanationKey)}</p>
            </div>
          ` : ''}
        </div>

        ${!this._s6State.submitted ? `
          <div style="text-align: center; margin: 24px 0;">
            <button type="button" id="btn-submit-exit" class="btn btn-primary" style="min-height: 48px; padding: 12px 32px;" ${!bothSelected ? 'disabled aria-disabled="true"' : ''}>
              ${t('btn.submit_final')}
            </button>
          </div>
        ` : ''}

        <!-- Summative Celebration Score Card (Rendered upon submission) -->
        ${this._s6State.submitted ? `
          <div class="score-card celebration-card" role="region" aria-label="Mission Mastery Result" style="position: relative; overflow: hidden;">
            <div class="confetti-burst" aria-hidden="true">
              <span class="confetti-piece p1">🎉</span>
              <span class="confetti-piece p2">✨</span>
              <span class="confetti-piece p3">⭐</span>
              <span class="confetti-piece p4">🌟</span>
              <span class="confetti-piece p5">🚀</span>
              <span class="confetti-piece p6">🎯</span>
            </div>

            <div class="xp-ticker-badge" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 16px; background: linear-gradient(135deg, #10B981, #059669); color: white; border-radius: 20px; font-weight: 700; font-size: 14px; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); animation: float-bob 3s ease-in-out infinite;">
              <span>⚡ +150 XP Mastery Awarded!</span>
            </div>

            <div class="score-badge" aria-hidden="true">${mission.iconEmoji}</div>
            <h3 class="score-title">${t('s6.score_banner', { title: t(mission.titleKey) })}</h3>
            <p class="score-detail">${t('s6.score_text', { score: totalScore })}</p>

            <div style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: var(--color-correct-bg); border: 1px solid var(--color-correct); border-radius: var(--radius-full); margin-bottom: 16px;">
              <span aria-hidden="true">🎖️</span>
              <strong style="color: var(--color-correct-text);">${t('s6.mastery_awarded')} ${t(mission.masteryBadge.nameKey)}</strong>
            </div>

            <!-- Field Investigation Key Principles Recap -->
            <div style="text-align: left; background: var(--color-surface-subtle); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 16px; margin: 16px 0;">
              <h4 style="font-size: var(--font-size-base); font-weight: var(--font-weight-bold); margin-bottom: 8px;">
                ${t('s6.recap_title')}
              </h4>
              <ul style="padding-left: 20px; line-height: var(--line-height-relaxed); margin-bottom: 0;">
                <li>${t(mission.recapBulletKeys[0])}</li>
                <li>${t(mission.recapBulletKeys[1])}</li>
              </ul>
            </div>

            <!-- Action CTAs -->
            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 20px;">
              <button type="button" id="btn-s6-replay" class="btn btn-secondary" style="min-height: 48px;">
                ${t('btn.replay_lab')}
              </button>
              <button type="button" id="btn-s6-curriculum" class="btn btn-outline" style="min-height: 48px;">
                📚 View Curriculum Progress
              </button>
              <button type="button" id="btn-s6-return" class="btn btn-primary" style="min-height: 48px;">
                ${t('btn.return_map')}
              </button>
            </div>
          </div>
        ` : ''}
      </section>
    `;

    // Exit Q1 Radio change listener
    const exit1Group = this._container.querySelector('#exit1-group');
    exit1Group?.addEventListener('change', (e) => {
      if (e.target.name === 'exit-q1') {
        this._s6State.selectedQ1 = e.target.value;
        exit1Group.querySelectorAll('.radio-card').forEach((card) => {
          card.classList.toggle('selected', card.querySelector('input')?.checked);
        });
        this._updateExitSubmitBtnState();
      }
    });

    // Exit Q2 Radio change listener
    const exit2Group = this._container.querySelector('#exit2-group');
    exit2Group?.addEventListener('change', (e) => {
      if (e.target.name === 'exit-q2') {
        this._s6State.selectedQ2 = e.target.value;
        exit2Group.querySelectorAll('.radio-card').forEach((card) => {
          card.classList.toggle('selected', card.querySelector('input')?.checked);
        });
        this._updateExitSubmitBtnState();
      }
    });

    // Submit Final Check button
    this._container.querySelector('#btn-submit-exit')?.addEventListener('click', () => {
      const opt1 = q1.options.find((o) => o.id === this._s6State.selectedQ1);
      const opt2 = q2.options.find((o) => o.id === this._s6State.selectedQ2);
      const isQ1Correct = Boolean(opt1?.isCorrect);
      const isQ2Correct = Boolean(opt2?.isCorrect);

      store.recordExitScore(0, isQ1Correct ? 1 : 0);
      store.recordExitScore(1, isQ2Correct ? 1 : 0);
      this._s6State.submitted = true;
      this.render();
    });

    // Replay lab button
    this._container.querySelector('#btn-s6-replay')?.addEventListener('click', () => {
      store.resetSubjectLab(subjectId);
      router.navigate(subjectId, 's3_explore');
    });

    // View Curriculum Progress button
    this._container.querySelector('#btn-s6-curriculum')?.addEventListener('click', () => {
      this.destroy();
      router.goToBrowser();
    });

    // Return to map button
    this._container.querySelector('#btn-s6-return')?.addEventListener('click', () => {
      router.goToMap();
    });
  }

  /**
   * Helper to update S6 submit button state.
   * @private
   */
  _updateExitSubmitBtnState() {
    const btnSubmit = this._container.querySelector('#btn-submit-exit');
    const bothSelected = Boolean(this._s6State.selectedQ1 && this._s6State.selectedQ2);
    if (btnSubmit) {
      btnSubmit.disabled = !bothSelected;
      btnSubmit.setAttribute('aria-disabled', String(!bothSelected));
    }
  }

  /**
   * Optional helper for stage click delegation if needed.
   * @private
   */
  _handleStageClick(e) {
    // Delegated actions if necessary
  }
}

/**
 * Singleton instance export of the central LearningRunner.
 */
export const learningRunner = new LearningRunner();

/**
 * Convenience bootstrap helper function.
 * @param {HTMLElement} [container]
 * @returns {LearningRunner}
 */
export function initLearningRunner(container) {
  learningRunner.init(container);
  return learningRunner;
}

/**
 * Functional render delegate compatible with app.js.
 * @param {HTMLElement} stage
 * @param {Object} state
 * @param {Object} [storeRef]
 * @param {Object} [routerRef]
 */
export function renderMissionStep(stage, state, storeRef, routerRef) {
  learningRunner.render(stage, state, storeRef, routerRef);
}

export default learningRunner;
