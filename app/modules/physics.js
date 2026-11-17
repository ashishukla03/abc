// app/modules/physics.js
/**
 * Gramin PocketLab — Physics Flagship Module: Sound Detective
 * NCERT Class 8 Science Chapter 13: Sound (Acoustics: Frequency, Pitch & Amplitude)
 *
 * Implements SubjectInteractionHandler interface contract from architecture_plan/MODULE_INTERFACE_CONTRACT.md.
 * 
 * Standards & Design Invariants:
 * 1. Pure native W3C Web Audio API (AudioContext, OscillatorNode, GainNode, AnalyserNode).
 * 2. Zero Autoplay: AudioContext initialized suspended and resumed synchronously on explicit user gesture.
 * 3. Software Clamping: Output gain strictly clamped to <= 0.70 (-3 dBFS) ceiling to prevent digital DAC clipping.
 * 4. Oscilloscope Canvas: High-DPI 2D canvas with standardized 0-10 ms time window.
 *    - At 220 Hz: exactly 2.2 complete sine wave cycles across 10 ms (T = 4.545 ms).
 *    - At 440 Hz: exactly 4.4 complete sine wave cycles across 10 ms (exact 2x horizontal crest compression).
 * 5. Invariant Separation:
 *    - Amplitude slider alters vertical wave height while horizontal crest spacing is invariant.
 *    - Frequency slider alters horizontal crest compression while vertical wave height is invariant.
 * 6. Progressive Microphone Enhancement: Optional real-time mic input with non-blocking graceful fallback.
 * 7. Accessibility: Full ARIA semantics, real-time status announcements, touch targets >= 48px,
 *    and respects prefers-reduced-motion media query.
 */

// Software gain ceiling: 0.70 linear (-3 dBFS)
const MAX_LINEAR_GAIN = 0.70;
// Default conservative amplitude percentage (20% - 30% or 50% initial)
const DEFAULT_AMPLITUDE = 50;
const DEFAULT_FREQUENCY = 220;

// Module-level audio & animation lifecycle state
let audioCtx = null;
let oscillatorNode = null;
let gainNode = null;
let analyserNode = null;
let micStream = null;
let micSourceNode = null;
let animFrameId = null;
let visualPhase = 0;
let lastAnimTimestamp = 0;
let resizeObserver = null;
let reducedMotionQuery = null;

/**
 * Creates or retrieves the singleton AudioContext.
 * AudioContext is kept suspended until explicit user gesture to obey browser autoplay policies.
 * @returns {AudioContext|null}
 */
function getAudioContext() {
  if (typeof window === 'undefined') return null;
  const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtxClass) return null;

  if (!audioCtx) {
    try {
      audioCtx = new AudioCtxClass();
    } catch (e) {
      console.warn('Gramin PocketLab: Failed to construct AudioContext:', e);
      return null;
    }
  }
  return audioCtx;
}

/**
 * Calculates clamped linear Web Audio gain from an amplitude percentage [10, 100].
 * Clamped strictly to MAX_LINEAR_GAIN (0.70 / -3 dBFS).
 * @param {number} amplitudePercent
 * @returns {number}
 */
function calculateClampedGain(amplitudePercent) {
  const norm = Math.max(0, Math.min(100, Number(amplitudePercent) || 0)) / 100;
  return Number((norm * MAX_LINEAR_GAIN).toFixed(4));
}

export const PhysicsModule = {
  id: 'mission-physics-sound',
  subjectId: 'physics',
  titleKey: 'phys.title',
  scopeSummaryKey: 'phys.scope',

  /**
   * Returns pristine initial state for the Physics Micro-Lab.
   * Conforms to SubjectInteractionHandler contract.
   */
  getInitialState() {
    return {
      frequency: DEFAULT_FREQUENCY,
      amplitude: DEFAULT_AMPLITUDE,
      frequencyHz: DEFAULT_FREQUENCY,       // Alias for compatibility
      amplitudePercent: DEFAULT_AMPLITUDE, // Alias for compatibility
      isPlaying: false,
      activePreset: '220',
      micActive: false
    };
  },

  /**
   * Validates whether the lab parameters satisfy physical and pedagogical invariants.
   * @param {Object} state
   * @returns {{ isValid: boolean, messageKey: string, userFacingMessageKey?: string, userFacingMessage?: string }}
   */
  validateInvariant(state) {
    const freq = Number(state.frequency || state.frequencyHz || 220);
    const amp = Number(state.amplitude || state.amplitudePercent || 50);

    const isFreqValid = freq >= 100 && freq <= 800;
    const isAmpValid = amp >= 10 && amp <= 100;
    const isValid = isFreqValid && isAmpValid;

    if (!isValid) {
      return {
        isValid: false,
        messageKey: 'phys.error.out_of_bounds',
        userFacingMessageKey: 'phys.error.out_of_bounds',
        userFacingMessage: 'Frequency must be between 100 Hz and 800 Hz, and amplitude between 10% and 100%.'
      };
    }

    const cyclesIn10ms = (freq * 0.01).toFixed(1);
    const periodMs = (1000 / freq).toFixed(2);

    return {
      isValid: true,
      messageKey: 'phys.success.valid',
      userFacingMessageKey: 'phys.success.valid',
      userFacingMessage: `Valid acoustic state: ${freq} Hz vibration produces ${cyclesIn10ms} wave cycles per 10 ms (Period T = ${periodMs} ms). Wave height reflects ${amp}% amplitude.`
    };
  },

  /**
   * Resets lab state to initial values, stopping all active audio and microphone tracks.
   * @returns {Object} Pristine initial state
   */
  resetState() {
    this.stopAudio();
    this.stopMicrophone();
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
    visualPhase = 0;
    return this.getInitialState();
  },

  /**
   * Stops Web Audio synthesis immediately.
   */
  stopAudio() {
    if (gainNode && audioCtx && audioCtx.state !== 'closed') {
      try {
        gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      } catch (e) {
        // Ignore scheduling errors on stopped contexts
      }
    }
    if (oscillatorNode) {
      try {
        oscillatorNode.stop();
        oscillatorNode.disconnect();
      } catch (e) {
        // Oscillator may already have been stopped
      }
      oscillatorNode = null;
    }
  },

  /**
   * Halts all active microphone media stream tracks.
   */
  stopMicrophone() {
    if (micStream) {
      try {
        micStream.getTracks().forEach(track => track.stop());
      } catch (e) {
        console.warn('Gramin PocketLab: Error stopping mic track:', e);
      }
      micStream = null;
    }
    if (micSourceNode) {
      try {
        micSourceNode.disconnect();
      } catch (e) {
        // Ignore disconnect errors
      }
      micSourceNode = null;
    }
  },

  /**
   * Mounts the interactive micro-lab widget inside the provided DOM container.
   * @param {HTMLElement} container
   * @param {Object} state
   * @param {Function} onStateChange
   */
  mount(container, state, onStateChange) {
    // Clean up any stale handles before mounting anew
    this.unmount();

    let currentState = {
      ...this.getInitialState(),
      ...state
    };
    currentState.frequency = Number(currentState.frequency || currentState.frequencyHz || DEFAULT_FREQUENCY);
    currentState.amplitude = Number(currentState.amplitude || currentState.amplitudePercent || DEFAULT_AMPLITUDE);

    // Render HTML structure conforming to WCAG 2.1 AA and main.css design system
    container.innerHTML = `
      <div class="interactive-lab-card" role="region" aria-label="Sound Detective: Frequency, Pitch and Amplitude Investigation">
        <!-- Lab Header -->
        <div class="lab-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-3); gap: var(--space-2);">
          <div>
            <h3 class="lab-title" style="margin-bottom: var(--space-1); font-size: var(--font-size-lg); color: var(--color-text-main);">Sound Detective: Acoustic Waveform Lab</h3>
            <p class="lab-subtitle" style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin: 0;">Observe how vibration frequency sets pitch and wave amplitude sets loudness.</p>
          </div>
          <button type="button" id="phys-reset-btn" class="btn btn-secondary btn-sm" style="min-height: 48px; min-width: 80px;" aria-label="Reset sound investigation">↺ Reset</button>
        </div>

        <!-- Acoustic Safety & Software Clamping Notice -->
        <div class="callout callout-warning" style="margin-bottom: var(--space-3); padding: var(--space-3); border-radius: var(--radius-md);" role="note">
          <div style="font-weight: var(--font-weight-bold); margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
            <span>🛡 Acoustic Notice & Digital Clamping:</span>
          </div>
          <div style="font-size: var(--font-size-xs); line-height: 1.4;">
            Synthetic tone output is strictly software-clamped to a digital ceiling of ≤ 0.70 (-3 dBFS) to prevent DAC distortion. Please keep headphone volume comfortable. Digital limiters mitigate clipping and do not claim calibrated decibel SPL meters.
          </div>
        </div>

        <!-- Real-Time Screen Reader Status Badge (Non-Visual Equivalent) -->
        <div class="status-badge status-neutral" id="phys-status-badge" role="status" aria-live="polite" style="margin-bottom: var(--space-3); width: 100%; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; padding: 8px 12px; font-size: var(--font-size-xs);">
          <span id="phys-status-text">Oscilloscope: Frequency ${currentState.frequency} Hz (2.2 cycles per 10 ms), Amplitude ${currentState.amplitude}% (Gain ≤ ${(calculateClampedGain(currentState.amplitude)).toFixed(2)}) | Audio Stopped</span>
          <span id="phys-motion-indicator" style="color: var(--color-text-muted); font-style: italic;"></span>
        </div>

        <!-- Oscilloscope Display Wrapper -->
        <div class="oscilloscope-wrapper" style="position: relative; width: 100%; background-color: var(--color-surface-dark); border: 2px solid var(--color-border-control); border-radius: var(--radius-md); overflow: hidden; margin-bottom: var(--space-3);">
          <canvas id="phys-oscilloscope-canvas" class="oscilloscope-canvas" width="600" height="240" aria-label="Educational Oscilloscope: Displays displacement waveform across a calibrated 0 to 10 millisecond window" role="img" style="width: 100%; height: 240px; display: block;"></canvas>
          <div class="oscilloscope-overlay" style="position: absolute; top: var(--space-2); right: var(--space-2); display: flex; gap: var(--space-2); pointer-events: none;">
            <span class="oscilloscope-badge" id="phys-cycles-badge" style="background-color: rgba(15, 23, 42, 0.85); color: #38BDF8; font-family: var(--font-family-mono); font-size: var(--font-size-xs); padding: 4px 8px; border-radius: var(--radius-sm); border: 1px solid #0369A1;">2.2 cycles / 10 ms</span>
            <span class="oscilloscope-badge" id="phys-state-badge" style="background-color: rgba(15, 23, 42, 0.85); color: #94A3B8; font-family: var(--font-family-mono); font-size: var(--font-size-xs); padding: 4px 8px; border-radius: var(--radius-sm); border: 1px solid #334155;">Stopped</span>
          </div>
        </div>

        <!-- Presets Row: 220 Hz vs 440 Hz (Octave Jump) -->
        <div style="margin-bottom: var(--space-3);">
          <div style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-2); color: var(--color-text-main);">Reference Note Presets:</div>
          <div class="preset-buttons" style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
            <button type="button" class="btn btn-secondary preset-btn" id="phys-preset-220" style="flex: 1 1 calc(50% - var(--space-2)); min-height: 48px; border: 2px solid var(--color-phys);" aria-label="Play 220 Hertz Low Tone (Festival Drum note)">
              🎵 Play 220 Hz (Low Tone)
            </button>
            <button type="button" class="btn btn-secondary preset-btn" id="phys-preset-440" style="flex: 1 1 calc(50% - var(--space-2)); min-height: 48px; border: 2px solid var(--color-phys);" aria-label="Play 440 Hertz High Tone (Bamboo Flute note, 1 octave higher)">
              🎶 Play 440 Hz (High Tone)
            </button>
          </div>
        </div>

        <!-- Continuous Controls Grid -->
        <div class="audio-controls" style="display: flex; flex-direction: column; gap: var(--space-3); margin-bottom: var(--space-3);">
          <!-- Frequency Continuous Slider (100 Hz - 800 Hz) -->
          <div class="slider-group">
            <div class="slider-label-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <label for="phys-freq-slider" style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-main);">
                Vibration Frequency (Pitch):
              </label>
              <span class="slider-val-readout" id="phys-freq-val" style="font-family: var(--font-family-mono); font-weight: var(--font-weight-bold); color: var(--color-phys);">${currentState.frequency} Hz</span>
            </div>
            <div class="range-slider-wrap" style="min-height: 48px; display: flex; align-items: center;">
              <input type="range" class="accessible-slider" id="phys-freq-slider" min="100" max="800" step="10" value="${currentState.frequency}" aria-valuemin="100" aria-valuemax="800" aria-valuenow="${currentState.frequency}" aria-valuetext="${currentState.frequency} Hertz" style="width: 100%; cursor: pointer;" />
            </div>
            <div style="display: flex; justify-content: space-between; font-size: var(--font-size-xs); color: var(--color-text-muted); padding: 0 4px;">
              <span>100 Hz (Deep rumble)</span>
              <span>440 Hz (Octave)</span>
              <span>800 Hz (High pitch)</span>
            </div>
          </div>

          <!-- Amplitude Continuous Slider (10% - 100%) -->
          <div class="slider-group">
            <div class="slider-label-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <label for="phys-amp-slider" style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-main);">
                Wave Amplitude (Loudness Gain):
              </label>
              <span class="slider-val-readout" id="phys-amp-val" style="font-family: var(--font-family-mono); font-weight: var(--font-weight-bold); color: var(--color-phys);">${currentState.amplitude}%</span>
            </div>
            <div class="range-slider-wrap" style="min-height: 48px; display: flex; align-items: center;">
              <input type="range" class="accessible-slider" id="phys-amp-slider" min="10" max="100" step="5" value="${currentState.amplitude}" aria-valuemin="10" aria-valuemax="100" aria-valuenow="${currentState.amplitude}" aria-valuetext="${currentState.amplitude} percent" style="width: 100%; cursor: pointer;" />
            </div>
            <div style="display: flex; justify-content: space-between; font-size: var(--font-size-xs); color: var(--color-text-muted); padding: 0 4px;">
              <span>10% (Quiet)</span>
              <span>50% (Default)</span>
              <span>100% (Max software gain 0.70)</span>
            </div>
          </div>
        </div>

        <!-- Master Playback & Microphone Action Row -->
        <div style="display: flex; gap: var(--space-2); flex-wrap: wrap; margin-bottom: var(--space-3);">
          <button type="button" class="btn btn-primary" id="phys-play-btn" style="flex: 1 1 calc(50% - var(--space-2)); min-height: 48px; background-color: var(--color-phys); color: #FFF; font-weight: var(--font-weight-bold);" aria-label="Start audio tone synthesis">
            🔊 Play Tone
          </button>
          <button type="button" class="btn btn-secondary" id="phys-stop-btn" style="flex: 1 1 calc(50% - var(--space-2)); min-height: 48px; font-weight: var(--font-weight-bold);" aria-label="Stop audio tone synthesis">
            ⏹ Stop Tone
          </button>
          <button type="button" class="btn btn-secondary" id="phys-mic-btn" style="flex: 1 1 100%; min-height: 48px;" aria-label="Optional: Test microphone input">
            🎙 Optional: Test Mic
          </button>
        </div>

        <!-- Non-Blocking Toast Container for Microphone & Notifications -->
        <div id="phys-toast" class="toast" style="display: none; margin-bottom: var(--space-3); background-color: var(--color-surface-dark); color: #FFF; padding: var(--space-3); border-radius: var(--radius-md); border-left: 4px solid var(--color-warning);" role="alert" aria-live="assertive"></div>

        <!-- Dynamic Pedagogical Observation Callout -->
        <div id="phys-observation-box" class="callout callout-success" style="padding: var(--space-3); border-radius: var(--radius-md);" role="status" aria-live="polite">
          <div style="font-weight: var(--font-weight-bold); margin-bottom: 4px;">💡 Scientific Observation:</div>
          <div id="phys-observation-text" style="font-size: var(--font-size-sm); line-height: 1.4;">
            Tap <strong>[ Play 220 Hz ]</strong> then <strong>[ Play 440 Hz ]</strong> to compare the low drum hum with the high flute note. Observe how 440 Hz packs exactly twice as many wave crests across the 10 ms window (2.2 vs 4.4 cycles)!
          </div>
        </div>
      </div>
    `;

    // DOM References
    const canvas = container.querySelector('#phys-oscilloscope-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    const playBtn = container.querySelector('#phys-play-btn');
    const stopBtn = container.querySelector('#phys-stop-btn');
    const micBtn = container.querySelector('#phys-mic-btn');
    const preset220Btn = container.querySelector('#phys-preset-220');
    const preset440Btn = container.querySelector('#phys-preset-440');
    const resetBtn = container.querySelector('#phys-reset-btn');
    const freqSlider = container.querySelector('#phys-freq-slider');
    const ampSlider = container.querySelector('#phys-amp-slider');
    const freqVal = container.querySelector('#phys-freq-val');
    const ampVal = container.querySelector('#phys-amp-val');
    const cyclesBadge = container.querySelector('#phys-cycles-badge');
    const stateBadge = container.querySelector('#phys-state-badge');
    const statusText = container.querySelector('#phys-status-text');
    const motionIndicator = container.querySelector('#phys-motion-indicator');
    const observationText = container.querySelector('#phys-observation-text');
    const toastBox = container.querySelector('#phys-toast');

    let toastTimer = null;
    const showToast = (message) => {
      if (!toastBox) return;
      toastBox.textContent = message;
      toastBox.style.display = 'block';
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        if (toastBox) toastBox.style.display = 'none';
      }, 5000);
    };

    // Reduced Motion Detection
    const checkReducedMotion = () => {
      try {
        reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        return reducedMotionQuery.matches;
      } catch (e) {
        return false;
      }
    };
    let isReducedMotion = checkReducedMotion();

    if (reducedMotionQuery) {
      try {
        reducedMotionQuery.addEventListener('change', (e) => {
          isReducedMotion = e.matches;
          updateStatusAndBadges();
          drawFrame();
        });
      } catch (e) {
        // Fallback for older Safari
      }
    }

    /**
     * Updates screen-reader status, visible badges, and observation copy.
     */
    const updateStatusAndBadges = () => {
      const freq = currentState.frequency;
      const amp = currentState.amplitude;
      const cycles = (freq * 0.01).toFixed(1);
      const gainLinear = calculateClampedGain(amp);

      if (freqVal) freqVal.textContent = `${freq} Hz`;
      if (ampVal) ampVal.textContent = `${amp}%`;
      if (freqSlider) {
        freqSlider.value = freq;
        freqSlider.setAttribute('aria-valuenow', freq);
        freqSlider.setAttribute('aria-valuetext', `${freq} Hertz`);
      }
      if (ampSlider) {
        ampSlider.value = amp;
        ampSlider.setAttribute('aria-valuenow', amp);
        ampSlider.setAttribute('aria-valuetext', `${amp} percent`);
      }

      if (cyclesBadge) {
        cyclesBadge.textContent = `${cycles} cycles / 10 ms`;
      }

      if (stateBadge) {
        if (currentState.micActive) {
          stateBadge.textContent = '🎙 Mic Active';
          stateBadge.style.color = '#34D399';
          stateBadge.style.borderColor = '#059669';
        } else if (currentState.isPlaying) {
          stateBadge.textContent = '🔊 Tone Playing';
          stateBadge.style.color = '#38BDF8';
          stateBadge.style.borderColor = '#0284C7';
        } else {
          stateBadge.textContent = '⏹ Stopped';
          stateBadge.style.color = '#94A3B8';
          stateBadge.style.borderColor = '#334155';
        }
      }

      if (statusText) {
        const playState = currentState.micActive
          ? 'Microphone Active'
          : currentState.isPlaying
          ? 'Audio Playing'
          : 'Audio Stopped';
        statusText.textContent = `Oscilloscope: Frequency ${freq} Hz (${cycles} cycles per 10 ms), Amplitude ${amp}% (Gain ≤ ${gainLinear.toFixed(2)}) | ${playState}`;
      }

      if (motionIndicator) {
        motionIndicator.textContent = isReducedMotion ? '(Reduced motion active: static render)' : '';
      }

      // Highlight active preset button if applicable
      if (preset220Btn && preset440Btn) {
        if (freq === 220 && currentState.activePreset === '220') {
          preset220Btn.classList.remove('btn-secondary');
          preset220Btn.classList.add('btn-primary');
          preset220Btn.style.backgroundColor = 'var(--color-phys)';
          preset220Btn.style.color = '#FFF';

          preset440Btn.classList.remove('btn-primary');
          preset440Btn.classList.add('btn-secondary');
          preset440Btn.style.backgroundColor = '';
          preset440Btn.style.color = '';
        } else if (freq === 440 && currentState.activePreset === '440') {
          preset440Btn.classList.remove('btn-secondary');
          preset440Btn.classList.add('btn-primary');
          preset440Btn.style.backgroundColor = 'var(--color-phys)';
          preset440Btn.style.color = '#FFF';

          preset220Btn.classList.remove('btn-primary');
          preset220Btn.classList.add('btn-secondary');
          preset220Btn.style.backgroundColor = '';
          preset220Btn.style.color = '';
        } else {
          preset220Btn.classList.remove('btn-primary');
          preset220Btn.classList.add('btn-secondary');
          preset220Btn.style.backgroundColor = '';
          preset220Btn.style.color = '';

          preset440Btn.classList.remove('btn-primary');
          preset440Btn.classList.add('btn-secondary');
          preset440Btn.style.backgroundColor = '';
          preset440Btn.style.color = '';
        }
      }

      // Contextual observation notes
      if (observationText) {
        if (currentState.micActive) {
          observationText.innerHTML = `<strong>Live Mic Input:</strong> Speak or whistle into the microphone to see real-world sound waves! Note how pitch and volume shape the crests.`;
        } else if (freq === 220) {
          observationText.innerHTML = `<strong>220 Hz (Low Tone):</strong> In 10 ms, the wave makes exactly <strong>2.2 cycles</strong> (T = 4.55 ms). Notice the wide, relaxed spacing between wave peaks.`;
        } else if (freq === 440) {
          observationText.innerHTML = `<strong>440 Hz (High Tone):</strong> In 10 ms, the wave makes exactly <strong>4.4 cycles</strong> (T = 2.27 ms). Peak spacing is <strong>exactly 2× compressed</strong> compared to 220 Hz!`;
        } else {
          observationText.innerHTML = `<strong>Continuous Frequency (${freq} Hz):</strong> As frequency rises, wave peaks pack tighter horizontally (higher pitch), while adjusting amplitude slider (${amp}%) only scales vertical wave height without changing horizontal crest compression.`;
        }
      }

      // Propagate state update
      onStateChange({
        ...currentState,
        frequencyHz: currentState.frequency,
        amplitudePercent: currentState.amplitude
      });
    };

    /**
     * Starts or updates Web Audio synthesizer with synchronous user gesture unblock.
     */
    const startAudioSynthesizer = async (freq, amp) => {
      const ctx = getAudioContext();
      if (!ctx) return;

      // Autoplay safeguard: resume context synchronously on user gesture
      if (ctx.state === 'suspended') {
        try {
          await ctx.resume();
        } catch (e) {
          console.warn('Gramin PocketLab: Failed to resume AudioContext:', e);
        }
      }

      const clampedGain = calculateClampedGain(amp);

      // Create AnalyserNode if absent
      if (!analyserNode) {
        try {
          analyserNode = ctx.createAnalyser();
          analyserNode.fftSize = 1024;
          analyserNode.smoothingTimeConstant = 0.8;
        } catch (e) {
          // Analyser fallback
        }
      }

      // Create GainNode if absent
      if (!gainNode) {
        try {
          gainNode = ctx.createGain();
          gainNode.gain.setValueAtTime(0, ctx.currentTime);
          if (analyserNode) {
            gainNode.connect(analyserNode);
            analyserNode.connect(ctx.destination);
          } else {
            gainNode.connect(ctx.destination);
          }
        } catch (e) {
          console.warn('Gramin PocketLab: Error setting up GainNode:', e);
        }
      }

      // Create or update OscillatorNode
      if (!oscillatorNode) {
        try {
          oscillatorNode = ctx.createOscillator();
          oscillatorNode.type = 'sine';
          oscillatorNode.frequency.setValueAtTime(freq, ctx.currentTime);
          oscillatorNode.connect(gainNode);
          oscillatorNode.start();
        } catch (e) {
          console.warn('Gramin PocketLab: Error starting OscillatorNode:', e);
        }
      } else {
        try {
          oscillatorNode.frequency.setTargetAtTime(freq, ctx.currentTime, 0.015);
        } catch (e) {
          oscillatorNode.frequency.setValueAtTime(freq, ctx.currentTime);
        }
      }

      // Smooth ramp to prevent audible digital click
      if (gainNode) {
        try {
          gainNode.gain.cancelScheduledValues(ctx.currentTime);
          gainNode.gain.setTargetAtTime(clampedGain, ctx.currentTime, 0.02);
        } catch (e) {
          gainNode.gain.setValueAtTime(clampedGain, ctx.currentTime);
        }
      }

      currentState.isPlaying = true;
      currentState.micActive = false;
      updateStatusAndBadges();
      startAnimationLoop();
    };

    /**
     * Smoothly updates synthesizer parameters without restarting nodes.
     */
    const updateSynthesizerParameters = (freq, amp) => {
      if (!currentState.isPlaying || !gainNode || !audioCtx) return;
      const clampedGain = calculateClampedGain(amp);

      if (oscillatorNode) {
        try {
          oscillatorNode.frequency.setTargetAtTime(freq, audioCtx.currentTime, 0.015);
        } catch (e) {
          oscillatorNode.frequency.setValueAtTime(freq, audioCtx.currentTime);
        }
      }
      try {
        gainNode.gain.setTargetAtTime(clampedGain, audioCtx.currentTime, 0.015);
      } catch (e) {
        gainNode.gain.setValueAtTime(clampedGain, audioCtx.currentTime);
      }
    };

    /**
     * Stops the tone generator and mic.
     */
    const stopAudioAndVisuals = () => {
      this.stopAudio();
      this.stopMicrophone();
      currentState.isPlaying = false;
      currentState.micActive = false;
      updateStatusAndBadges();
      stopAnimationLoop();
      drawFrame(); // Draw stationary paused state
    };

    /**
     * Starts optional microphone stream with progressive non-blocking fallback.
     */
    const toggleMicrophone = async () => {
      if (currentState.micActive) {
        this.stopMicrophone();
        currentState.micActive = false;
        currentState.isPlaying = false;
        updateStatusAndBadges();
        stopAnimationLoop();
        drawFrame();
        return;
      }

      // Stop any active synth oscillator before switching to mic
      this.stopAudio();

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showToast('Microphone optional. Built-in tone generator active.');
        currentState.micActive = false;
        updateStatusAndBadges();
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const ctx = getAudioContext();
        if (!ctx) {
          showToast('Microphone optional. Built-in tone generator active.');
          return;
        }
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }

        micStream = stream;
        if (!analyserNode) {
          analyserNode = ctx.createAnalyser();
          analyserNode.fftSize = 1024;
          analyserNode.smoothingTimeConstant = 0.8;
        }

        micSourceNode = ctx.createMediaStreamSource(stream);
        // Connect mic solely to analyserNode (NEVER to ctx.destination to eliminate feedback howling)
        micSourceNode.connect(analyserNode);

        currentState.micActive = true;
        currentState.isPlaying = true;
        updateStatusAndBadges();
        startAnimationLoop();
      } catch (err) {
        // Graceful non-blocking catch: user denied permission or device lacks microphone
        showToast('Microphone optional. Built-in tone generator active.');
        currentState.micActive = false;
        updateStatusAndBadges();
      }
    };

    /**
     * Canvas 2D Oscilloscope Renderer
     * Labeled 0 - 10 ms horizontal window with High-DPI devicePixelRatio scaling.
     */
    const drawFrame = (timestamp = 0) => {
      if (!canvas || !ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const cssW = Math.floor(rect.width || 600);
      const cssH = Math.floor(rect.height || 240);

      // Handle retina / high-DPI scaling
      if (canvas.width !== cssW * dpr || canvas.height !== cssH * dpr) {
        canvas.width = cssW * dpr;
        canvas.height = cssH * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Layout geometry: Margins for axes labels
      const padLeft = 48;
      const padRight = 20;
      const padTop = 24;
      const padBottom = 34;
      const plotW = Math.max(10, cssW - padLeft - padRight);
      const plotH = Math.max(10, cssH - padTop - padBottom);
      const centerY = padTop + plotH / 2;

      // 1. Canvas Background
      ctx.fillStyle = '#0F172A'; // Dark oscilloscope CRT surface
      ctx.fillRect(0, 0, cssW, cssH);

      // 2. Subtle Coordinate Grid Lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#1E293B'; // Grid line color

      // Vertical grid lines at 0, 2, 4, 6, 8, 10 ms
      const timeSteps = [0, 2, 4, 6, 8, 10];
      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      timeSteps.forEach((ms) => {
        const x = padLeft + (ms / 10) * plotW;
        ctx.beginPath();
        ctx.moveTo(x, padTop);
        ctx.lineTo(x, padTop + plotH);
        ctx.stroke();

        // X-axis numeric labels
        ctx.fillText(`${ms}ms`, x, padTop + plotH + 6);
      });

      // Horizontal grid lines at +1.0, +0.5, 0.0, -0.5, -1.0
      const ampSteps = [
        { val: 1.0, label: '+1.0' },
        { val: 0.5, label: '+0.5' },
        { val: 0.0, label: '0.0' },
        { val: -0.5, label: '-0.5' },
        { val: -1.0, label: '-1.0' }
      ];

      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ampSteps.forEach((step) => {
        const y = centerY - step.val * (plotH / 2 * 0.85);
        ctx.beginPath();
        if (step.val === 0.0) {
          ctx.strokeStyle = '#334155'; // Brighter center axis
        } else {
          ctx.strokeStyle = '#1E293B';
        }
        ctx.moveTo(padLeft, y);
        ctx.lineTo(padLeft + plotW, y);
        ctx.stroke();

        // Y-axis numeric labels
        ctx.fillText(step.label, padLeft - 8, y);
      });

      // Plot border
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(padLeft, padTop, plotW, plotH);

      // Axis Titles
      ctx.fillStyle = '#64748B';
      ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Time (0 to 10 ms window)', padLeft + plotW / 2, cssH - 10);

      ctx.save();
      ctx.translate(14, centerY);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Displacement (-1.0 to +1.0)', 0, 0);
      ctx.restore();

      // 3. Waveform Plotting
      const freq = currentState.frequency;
      const ampPercent = currentState.amplitude;
      const normAmp = ampPercent / 100; // 0.10 to 1.00
      const maxPlotHeight = (plotH / 2) * 0.85;

      ctx.save();
      // Clip rendering strictly to plot bounds
      ctx.beginPath();
      ctx.rect(padLeft, padTop, plotW, plotH);
      ctx.clip();

      if (currentState.micActive && analyserNode) {
        // Live microphone wave plotting
        const timeData = new Uint8Array(analyserNode.frequencyBinCount);
        analyserNode.getByteTimeDomainData(timeData);

        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#34D399'; // Emerald-green for microphone
        ctx.beginPath();

        const sliceWidth = plotW / timeData.length;
        let x = padLeft;

        for (let i = 0; i < timeData.length; i++) {
          const v = (timeData[i] - 128) / 128; // -1 to +1
          const y = centerY - v * maxPlotHeight;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }
        ctx.stroke();
      } else {
        // Standardized 0-10 ms Synthetic Sine Wave Plotting
        // Formula: y(t) = A * sin(2 * pi * f * t - phase)
        // t(x) = (x / plotW) * 0.010 seconds
        // At 220 Hz: 220 * 0.010 = 2.2 complete cycles across plotW
        // At 440 Hz: 440 * 0.010 = 4.4 complete cycles across plotW
        const windowDurationSec = 0.010; // Exactly 10 milliseconds

        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#2DD4BF'; // Vibrant high-contrast teal sine wave
        ctx.shadowColor = 'rgba(45, 212, 191, 0.45)';
        ctx.shadowBlur = 6;
        ctx.beginPath();

        const stepPx = 1;
        for (let px = 0; px <= plotW; px += stepPx) {
          const t = (px / plotW) * windowDurationSec;
          // Sine wave formula: 2 * pi * frequency * time
          const angle = 2 * Math.PI * freq * t - visualPhase;
          const displacement = Math.sin(angle);
          const y = centerY - (normAmp * displacement * maxPlotHeight);
          const x = padLeft + px;

          if (px === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      ctx.restore();
      ctx.restore();
    };

    /**
     * Animation Loop (pauses when audio stops or reduced-motion is requested)
     */
    const animate = (timestamp) => {
      if (!currentState.isPlaying || isReducedMotion) {
        stopAnimationLoop();
        drawFrame();
        return;
      }

      if (!lastAnimTimestamp) lastAnimTimestamp = timestamp;
      const dt = (timestamp - lastAnimTimestamp) / 1000;
      lastAnimTimestamp = timestamp;

      // Smooth visual drift that preserves clear cycle counting
      // Standardized slow drift speed of 3.5 radians/sec
      visualPhase = (visualPhase + dt * 3.5) % (2 * Math.PI);

      drawFrame(timestamp);
      animFrameId = requestAnimationFrame(animate);
    };

    const startAnimationLoop = () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (isReducedMotion) {
        visualPhase = 0;
        drawFrame();
        return;
      }
      lastAnimTimestamp = performance.now();
      animFrameId = requestAnimationFrame(animate);
    };

    const stopAnimationLoop = () => {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
      lastAnimTimestamp = 0;
    };

    // Responsive Canvas Resize Observer
    if (typeof ResizeObserver !== 'undefined' && canvas) {
      resizeObserver = new ResizeObserver(() => {
        drawFrame();
      });
      resizeObserver.observe(canvas);
    }

    // Event Listeners: Presets
    if (preset220Btn) {
      preset220Btn.addEventListener('click', () => {
        currentState.frequency = 220;
        currentState.activePreset = '220';
        currentState.amplitude = DEFAULT_AMPLITUDE;
        startAudioSynthesizer(220, DEFAULT_AMPLITUDE);
      });
    }

    if (preset440Btn) {
      preset440Btn.addEventListener('click', () => {
        currentState.frequency = 440;
        currentState.activePreset = '440';
        currentState.amplitude = DEFAULT_AMPLITUDE;
        startAudioSynthesizer(440, DEFAULT_AMPLITUDE);
      });
    }

    // Play & Stop Toggles
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        startAudioSynthesizer(currentState.frequency, currentState.amplitude);
      });
    }

    if (stopBtn) {
      stopBtn.addEventListener('click', () => {
        stopAudioAndVisuals();
      });
    }

    // Microphone Toggle
    if (micBtn) {
      micBtn.addEventListener('click', () => {
        toggleMicrophone();
      });
    }

    // Reset Button
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentState = this.resetState();
        updateStatusAndBadges();
        drawFrame();
        if (toastBox) toastBox.style.display = 'none';
      });
    }

    // Frequency Continuous Slider (100 Hz - 800 Hz)
    if (freqSlider) {
      freqSlider.addEventListener('input', (e) => {
        currentState.frequency = Number(e.target.value);
        currentState.activePreset = 'custom';
        updateSynthesizerParameters(currentState.frequency, currentState.amplitude);
        updateStatusAndBadges();
        if (!currentState.isPlaying) drawFrame();
      });
    }

    // Amplitude Continuous Slider (10% - 100%)
    if (ampSlider) {
      ampSlider.addEventListener('input', (e) => {
        currentState.amplitude = Number(e.target.value);
        updateSynthesizerParameters(currentState.frequency, currentState.amplitude);
        updateStatusAndBadges();
        if (!currentState.isPlaying) drawFrame();
      });
    }

    // Initial render
    updateStatusAndBadges();
    drawFrame();
  },

  /**
   * Cleans up all audio contexts, nodes, streams, and animation frames.
   */
  unmount() {
    this.stopAudio();
    this.stopMicrophone();

    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }

    if (resizeObserver) {
      try {
        resizeObserver.disconnect();
      } catch (e) {
        // Ignore disconnect errors
      }
      resizeObserver = null;
    }

    visualPhase = 0;
    lastAnimTimestamp = 0;
  }
};

export default PhysicsModule;
