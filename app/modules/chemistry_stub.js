// app/modules/chemistry_stub.js
/**
 * Gramin PocketLab — Chemistry Module (pH Color Lab)
 * Conforming to SubjectInteractionHandler contract.
 * Standardized 4 beakers: Lemon Juice (pH 2.2), Distilled Water (pH 7.0), Baking Soda (pH 8.5), Laundry Soap (pH 10.0).
 * Natural Turmeric Paper & Universal Indicator Paper.
 * Prominent mandatory water testing safety disclaimer.
 * Strict interaction gating: Initial mount renders in untested state; interaction required.
 */

export const ChemistryModule = {
  id: 'mission-chem-ph',
  subjectId: 'chemistry',

  getInitialState() {
    return {
      selectedSample: 'distilled_water',
      selectedIndicator: 'universal',
      hasTested: false
    };
  },

  validateInvariant(state) {
    const isValid = Boolean(state && state.hasTested);
    return {
      isValid,
      userFacingMessage: isValid 
        ? 'Chemical color shift observed! Notice the indicator color scale.'
        : 'Select a liquid beaker and test with an indicator paper strip.'
    };
  },

  resetState() {
    return this.getInitialState();
  },

  mount(container, state, onStateChange) {
    let currentState = { ...state };

    const samples = {
      lemon_juice: {
        name: 'Lemon Juice',
        ph: 2.2,
        cat: 'Acidic (pH < 7)',
        badgeClass: 'badge-incorrect',
        universalColor: '#D9381E',
        turmericColor: '#F4B400',
        emoji: '🍋'
      },
      distilled_water: {
        name: 'Distilled Water (Reference)',
        ph: 7.0,
        cat: 'Neutral (pH = 7)',
        badgeClass: 'badge-phys',
        universalColor: '#34A853',
        turmericColor: '#F4B400',
        emoji: '💧'
      },
      baking_soda: {
        name: 'Baking Soda Solution',
        ph: 8.5,
        cat: 'Basic / Alkaline (pH > 7)',
        badgeClass: 'badge-chem',
        universalColor: '#4285F4',
        turmericColor: '#8B2500',
        emoji: '🧂'
      },
      laundry_soap: {
        name: 'Laundry Soap Solution',
        ph: 10.0,
        cat: 'Basic / Alkaline (pH > 7)',
        badgeClass: 'badge-chem',
        universalColor: '#673AB7',
        turmericColor: '#5C1D06',
        emoji: '🧼'
      }
    };

    container.innerHTML = `
      <div class="interactive-lab-card" role="region" aria-label="pH Color Lab">
        <div class="lab-header">
          <div>
            <h3 class="lab-title">pH Color Lab: Acids, Bases & Indicators</h3>
            <p class="lab-subtitle">Test aqueous household solutions using Natural Turmeric Paper and Universal Indicator Paper.</p>
          </div>
          <button id="chem-reset-btn" class="btn btn-secondary btn-sm" aria-label="Reset lab" style="min-height: 48px;">↺ Reset</button>
        </div>

        <!-- Mandatory Water Potability Notice -->
        <div class="callout-box callout-warning" style="margin-bottom: 16px;" role="note">
          <strong>Mandatory Safety Boundary:</strong> Virtual indicator simulation only. A pH test measures hydrogen ion activity; it does <em>not</em> detect pathogens (bacteria, viruses, or protozoa) or toxic dissolved chemicals. A neutral reading of pH 7.0 does NOT establish water potability or biological drinking safety.
        </div>

        <!-- Beakers Grid -->
        <div style="margin-bottom: 8px;">
          <label id="beaker-selection-label" class="h4" style="font-weight: 600;">1. Select Household Solution Beaker:</label>
        </div>
        <div class="beaker-grid" role="group" aria-labelledby="beaker-selection-label" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; margin: 12px 0;">
          <button type="button" class="card beaker-btn" data-sample="lemon_juice" aria-pressed="false" style="padding: 12px; border: 2px solid var(--color-border); border-radius: var(--radius-card); background: #FFF; cursor: pointer; text-align: center; min-height: 56px;">
            <div style="font-size: 1.5rem;" aria-hidden="true">🍋</div>
            <div style="font-weight: 600; font-size: 0.9rem;">Lemon Juice</div>
          </button>
          <button type="button" class="card beaker-btn" data-sample="distilled_water" aria-pressed="true" style="padding: 12px; border: 2px solid var(--color-chem); border-radius: var(--radius-card); background: #FFF; cursor: pointer; text-align: center; min-height: 56px;">
            <div style="font-size: 1.5rem;" aria-hidden="true">💧</div>
            <div style="font-weight: 600; font-size: 0.9rem;">Distilled Water</div>
          </button>
          <button type="button" class="card beaker-btn" data-sample="baking_soda" aria-pressed="false" style="padding: 12px; border: 2px solid var(--color-border); border-radius: var(--radius-card); background: #FFF; cursor: pointer; text-align: center; min-height: 56px;">
            <div style="font-size: 1.5rem;" aria-hidden="true">🧂</div>
            <div style="font-weight: 600; font-size: 0.9rem;">Baking Soda</div>
          </button>
          <button type="button" class="card beaker-btn" data-sample="laundry_soap" aria-pressed="false" style="padding: 12px; border: 2px solid var(--color-border); border-radius: var(--radius-card); background: #FFF; cursor: pointer; text-align: center; min-height: 56px;">
            <div style="font-size: 1.5rem;" aria-hidden="true">🧼</div>
            <div style="font-weight: 600; font-size: 0.9rem;">Soap Solution</div>
          </button>
        </div>

        <!-- Indicator Paper Selection -->
        <div style="margin-top: 16px; margin-bottom: 8px;">
          <label id="indicator-selection-label" class="h4" style="font-weight: 600;">2. Select Indicator Paper Type:</label>
        </div>
        <div role="group" aria-labelledby="indicator-selection-label" style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin: 12px 0;">
          <button type="button" id="btn-ind-universal" class="btn btn-primary" aria-pressed="true" style="background: var(--color-chem); min-height: 48px;">Universal Indicator Paper</button>
          <button type="button" id="btn-ind-turmeric" class="btn btn-secondary" aria-pressed="false" style="min-height: 48px;">Natural Turmeric Paper</button>
        </div>

        <!-- Action: Perform Test -->
        <div style="text-align: center; margin: 16px 0;">
          <button type="button" id="btn-chem-dip" class="btn btn-primary" style="background: var(--color-chem); min-height: 48px; padding: 12px 28px; font-weight: 600;">
            🔬 Dip Indicator Strip into Solution
          </button>
        </div>

        <!-- Testing Stage & Paper Result -->
        <div id="chem-result-stage" style="background: #FFFFFF; border: 1px solid var(--color-border); border-radius: var(--radius-card); padding: 20px; text-align: center; margin-top: 16px;">
          <h4 id="chem-test-heading">Status: Ready to Test</h4>
          <p id="chem-test-subtext" style="color: var(--color-text-secondary); margin-bottom: 12px;">Click "Dip Indicator Strip" above to observe the chemical reaction.</p>
          
          <!-- Indicator Strip with smooth color diffusion (respects prefers-reduced-motion) -->
          <div style="margin: 20px auto; width: 64px; height: 120px; border-radius: 6px; border: 2px dashed #999; background: #F8F9FA; transition: background 0.4s ease, border 0.4s ease;" id="indicator-strip" role="img" aria-label="Indicator strip awaiting test"></div>
          
          <div style="font-size: 1.25rem; font-weight: 700; color: var(--color-text-main);" id="chem-ph-readout">Illustrative pH: —</div>
          <div class="status-badge status-neutral" id="chem-cat-readout" style="display: inline-block; margin-top: 8px;">Awaiting Test Dip</div>
        </div>

        <!-- Numerical Scale Visual -->
        <div style="margin-top: 20px; padding: 12px; background: #F5F7FB; border-radius: var(--radius-card);">
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 600;">
            <span style="color: #D9381E;">0 (Strong Acid)</span>
            <span style="color: #34A853;">7 (Neutral)</span>
            <span style="color: #673AB7;">14 (Strong Base)</span>
          </div>
          <div style="height: 12px; border-radius: 6px; background: linear-gradient(to right, #D9381E, #F4B400, #34A853, #4285F4, #673AB7); margin-top: 6px;"></div>
        </div>
      </div>
    `;

    const updateBeakerButtons = () => {
      container.querySelectorAll('.beaker-btn').forEach(b => {
        if (!b) return;
        const isSelected = b.dataset && b.dataset.sample === currentState.selectedSample;
        b.style.borderColor = isSelected ? 'var(--color-chem)' : 'var(--color-border)';
        if (b.setAttribute) b.setAttribute('aria-pressed', String(isSelected));
        if (b.classList) {
          if (isSelected) b.classList.add('active');
          else b.classList.remove('active');
        }
      });
    };

    const updateIndicatorButtons = () => {
      const isUniversal = currentState.selectedIndicator === 'universal';
      const btnUni = container.querySelector('#btn-ind-universal');
      const btnTur = container.querySelector('#btn-ind-turmeric');

      if (btnUni) {
        btnUni.className = isUniversal ? 'btn btn-primary' : 'btn btn-secondary';
        btnUni.style.background = isUniversal ? 'var(--color-chem)' : '';
        if (btnUni.setAttribute) btnUni.setAttribute('aria-pressed', String(isUniversal));
      }

      if (btnTur) {
        btnTur.className = isUniversal ? 'btn btn-secondary' : 'btn btn-primary';
        btnTur.style.background = isUniversal ? '' : 'var(--color-chem)';
        if (btnTur.setAttribute) btnTur.setAttribute('aria-pressed', String(!isUniversal));
      }
    };

    const renderTestResult = () => {
      const sample = samples[currentState.selectedSample] || samples.distilled_water;
      const heading = container.querySelector('#chem-test-heading');
      const subtext = container.querySelector('#chem-test-subtext');
      const strip = container.querySelector('#indicator-strip');
      const phReadout = container.querySelector('#chem-ph-readout');
      const catReadout = container.querySelector('#chem-cat-readout');

      const isTurmeric = (currentState.selectedIndicator === 'turmeric');
      const color = isTurmeric ? sample.turmericColor : sample.universalColor;

      if (heading) {
        heading.textContent = `Tested: ${sample.name} with ${isTurmeric ? 'Natural Turmeric Paper' : 'Universal Indicator Paper'}`;
      }
      if (subtext) {
        subtext.textContent = isTurmeric 
          ? (sample.ph > 7 ? 'Turmeric turned reddish-brown in alkaline solution.' : 'Turmeric remained yellow in neutral/acidic solution.')
          : 'Universal indicator matched color on calibrated pH scale.';
      }

      if (strip) {
        strip.style.background = color;
        strip.style.border = '2px solid #333';
        if (strip.setAttribute) {
          strip.setAttribute('aria-label', `Indicator strip colored ${isTurmeric ? 'turmeric tone' : 'universal tone'} for pH ${sample.ph}`);
        }
      }

      const phFormatted = Number(sample.ph).toFixed(1);
      if (phReadout) {
        phReadout.textContent = `Illustrative pH: ${phFormatted}`;
        phReadout.style.color = 'var(--color-chem)';
      }
      if (catReadout) {
        catReadout.textContent = sample.cat;
        catReadout.className = `status-badge ${sample.badgeClass || 'status-neutral'}`;
      }
    };

    const performTest = () => {
      currentState.hasTested = true;
      renderTestResult();
      onStateChange(currentState);
    };

    // Initial visual state setup (WITHOUT setting hasTested=true)
    updateBeakerButtons();
    updateIndicatorButtons();

    // Attach beaker selection listeners
    container.querySelectorAll('.beaker-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentState.selectedSample = btn.dataset.sample;
        updateBeakerButtons();
        // If already tested once, auto-update test result on change
        if (currentState.hasTested) {
          performTest();
        }
      });
    });

    // Attach indicator selection listeners
    container.querySelector('#btn-ind-universal').addEventListener('click', () => {
      currentState.selectedIndicator = 'universal';
      updateIndicatorButtons();
      if (currentState.hasTested) {
        performTest();
      }
    });

    container.querySelector('#btn-ind-turmeric').addEventListener('click', () => {
      currentState.selectedIndicator = 'turmeric';
      updateIndicatorButtons();
      if (currentState.hasTested) {
        performTest();
      }
    });

    // Explicit test dip button listener
    container.querySelector('#btn-chem-dip').addEventListener('click', () => {
      performTest();
    });

    // Reset button listener
    container.querySelector('#chem-reset-btn').addEventListener('click', () => {
      currentState = this.resetState();
      updateBeakerButtons();
      updateIndicatorButtons();

      const heading = container.querySelector('#chem-test-heading');
      const subtext = container.querySelector('#chem-test-subtext');
      const strip = container.querySelector('#indicator-strip');
      const phReadout = container.querySelector('#chem-ph-readout');
      const catReadout = container.querySelector('#chem-cat-readout');

      if (heading) heading.textContent = 'Status: Ready to Test';
      if (subtext) subtext.textContent = 'Click "Dip Indicator Strip" above to observe the chemical reaction.';
      if (strip) {
        strip.style.background = '#F8F9FA';
        strip.style.border = '2px dashed #999';
        if (strip.setAttribute) strip.setAttribute('aria-label', 'Indicator strip awaiting test');
      }
      if (phReadout) {
        phReadout.textContent = 'Illustrative pH: —';
        phReadout.style.color = 'var(--color-text-main)';
      }
      if (catReadout) {
        catReadout.textContent = 'Awaiting Test Dip';
        catReadout.className = 'status-badge status-neutral';
      }

      onStateChange(currentState);
    });
  },

  unmount() {}
};
