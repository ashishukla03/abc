// app/modules/chemistry_stub.js
/**
 * Gramin PocketLab — Chemistry Module (pH Color Lab)
 * Conforming to SubjectInteractionHandler contract.
 * Standardized 4 beakers: Lemon Juice (pH 2.2), Distilled Water (pH 7.0), Baking Soda (pH 8.5), Laundry Soap (pH 10.0).
 * Natural Turmeric Paper & Universal Indicator Paper.
 * Prominent mandatory water testing safety disclaimer.
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
    const isValid = state.hasTested;
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
      lemon_juice: { name: 'Lemon Juice', ph: 2.2, cat: 'Acidic (pH < 7)', universalColor: '#D9381E', turmericColor: '#F4B400' },
      distilled_water: { name: 'Distilled Water (Reference)', ph: 7.0, cat: 'Neutral (pH = 7)', universalColor: '#34A853', turmericColor: '#F4B400' },
      baking_soda: { name: 'Baking Soda Solution', ph: 8.5, cat: 'Basic / Alkaline (pH > 7)', universalColor: '#4285F4', turmericColor: '#8B2500' },
      laundry_soap: { name: 'Laundry Soap Solution', ph: 10.0, cat: 'Basic / Alkaline (pH > 7)', universalColor: '#673AB7', turmericColor: '#5C1D06' }
    };

    container.innerHTML = `
      <div class="interactive-lab-card" role="region" aria-label="pH Color Lab">
        <div class="lab-header">
          <div>
            <h3 class="lab-title">pH Color Lab: Acids, Bases & Indicators</h3>
            <p class="lab-subtitle">Test aqueous household solutions using Natural Turmeric Paper and Universal Indicator Paper.</p>
          </div>
          <button id="chem-reset-btn" class="btn btn-secondary btn-sm" aria-label="Reset lab">↺ Reset</button>
        </div>

        <!-- Mandatory Water Potability Notice -->
        <div class="callout-box callout-warning" style="margin-bottom: 16px;" role="note">
          <strong>Mandatory Safety Boundary:</strong> Virtual indicator simulation only. A pH test measures hydrogen ion activity; it does <em>not</em> detect pathogens (bacteria, viruses, or protozoa) or toxic dissolved chemicals. A neutral reading of pH 7.0 does NOT establish water potability or biological drinking safety.
        </div>

        <!-- Beakers Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; margin: 16px 0;">
          <button class="card beaker-btn active" data-sample="lemon_juice" style="padding: 12px; border: 2px solid var(--color-border); border-radius: var(--radius-card); background: #FFF; cursor: pointer; text-align: center; min-height: 48px;">
            <div style="font-size: 1.5rem;">🍋</div>
            <div style="font-weight: 600; font-size: 0.9rem;">Lemon Juice</div>
          </button>
          <button class="card beaker-btn" data-sample="distilled_water" style="padding: 12px; border: 2px solid var(--color-chem); border-radius: var(--radius-card); background: #FFF; cursor: pointer; text-align: center; min-height: 48px;">
            <div style="font-size: 1.5rem;">💧</div>
            <div style="font-weight: 600; font-size: 0.9rem;">Distilled Water</div>
          </button>
          <button class="card beaker-btn" data-sample="baking_soda" style="padding: 12px; border: 2px solid var(--color-border); border-radius: var(--radius-card); background: #FFF; cursor: pointer; text-align: center; min-height: 48px;">
            <div style="font-size: 1.5rem;">🧂</div>
            <div style="font-weight: 600; font-size: 0.9rem;">Baking Soda</div>
          </button>
          <button class="card beaker-btn" data-sample="laundry_soap" style="padding: 12px; border: 2px solid var(--color-border); border-radius: var(--radius-card); background: #FFF; cursor: pointer; text-align: center; min-height: 48px;">
            <div style="font-size: 1.5rem;">🧼</div>
            <div style="font-weight: 600; font-size: 0.9rem;">Soap Solution</div>
          </button>
        </div>

        <!-- Indicator Paper Selection -->
        <div style="display: flex; gap: 12px; justify-content: center; margin: 16px 0;">
          <button id="btn-ind-universal" class="btn btn-primary" style="background: var(--color-chem); min-height: 48px;">Universal Indicator Paper</button>
          <button id="btn-ind-turmeric" class="btn btn-secondary" style="min-height: 48px;">Natural Turmeric Paper</button>
        </div>

        <!-- Testing Stage & Paper Result -->
        <div style="background: #FFFFFF; border: 1px solid var(--color-border); border-radius: var(--radius-card); padding: 20px; text-align: center; margin-top: 16px;">
          <h4 id="chem-test-heading">Testing: Distilled Water with Universal Indicator</h4>
          <div style="margin: 20px auto; width: 60px; height: 120px; border-radius: 6px; border: 2px solid #333; background: #34A853; transition: background 0.4s ease;" id="indicator-strip" role="img" aria-label="Indicator strip showing test color"></div>
          
          <div style="font-size: 1.25rem; font-weight: 700; color: var(--color-chem);" id="chem-ph-readout">pH: 7.0</div>
          <div class="status-badge status-neutral" id="chem-cat-readout" style="display: inline-block; margin-top: 8px;">Neutral (pH = 7)</div>
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

    const updateDisplay = () => {
      const sample = samples[currentState.selectedSample];
      const heading = container.querySelector('#chem-test-heading');
      const strip = container.querySelector('#indicator-strip');
      const phReadout = container.querySelector('#chem-ph-readout');
      const catReadout = container.querySelector('#chem-cat-readout');

      const isTurmeric = (currentState.selectedIndicator === 'turmeric');
      heading.textContent = `Testing: ${sample.name} with ${isTurmeric ? 'Natural Turmeric Paper' : 'Universal Indicator Paper'}`;
      strip.style.background = isTurmeric ? sample.turmericColor : sample.universalColor;
      phReadout.textContent = `Illustrative pH: ${sample.ph}`;
      catReadout.textContent = sample.cat;

      currentState.hasTested = true;
      onStateChange(currentState);
    };

    container.querySelectorAll('.beaker-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.beaker-btn').forEach(b => b.style.borderColor = 'var(--color-border)');
        btn.style.borderColor = 'var(--color-chem)';
        currentState.selectedSample = btn.dataset.sample;
        updateDisplay();
      });
    });

    container.querySelector('#btn-ind-universal').addEventListener('click', (e) => {
      currentState.selectedIndicator = 'universal';
      e.target.className = 'btn btn-primary';
      e.target.style.background = 'var(--color-chem)';
      container.querySelector('#btn-ind-turmeric').className = 'btn btn-secondary';
      container.querySelector('#btn-ind-turmeric').style.background = '';
      updateDisplay();
    });

    container.querySelector('#btn-ind-turmeric').addEventListener('click', (e) => {
      currentState.selectedIndicator = 'turmeric';
      e.target.className = 'btn btn-primary';
      e.target.style.background = 'var(--color-chem)';
      container.querySelector('#btn-ind-universal').className = 'btn btn-secondary';
      container.querySelector('#btn-ind-universal').style.background = '';
      updateDisplay();
    });

    container.querySelector('#chem-reset-btn').addEventListener('click', () => {
      currentState = this.resetState();
      container.querySelectorAll('.beaker-btn').forEach(b => b.style.borderColor = 'var(--color-border)');
      updateDisplay();
    });

    updateDisplay();
  },

  unmount() {}
};

