// app/modules/math_stub.js
/**
 * Gramin PocketLab — Mathematics Module (Water Share Challenge)
 * Phase 1 Architecture Stub conforming to SubjectInteractionHandler contract.
 * Full implementation scheduled for Phase 2.
 */

export const MathModule = {
  id: 'mission-math-water',
  subjectId: 'math',
  
  getInitialState() {
    return {
      targetTotal: 12,
      plotA: 0,
      plotB: 0,
      plotC: 0,
      isAllocated: false
    };
  },

  validateInvariant(state) {
    const sum = Number(state.plotA) + Number(state.plotB) + Number(state.plotC);
    if (sum !== state.targetTotal) {
      return {
        isValid: false,
        userFacingMessage: `Total allocated is ${sum} / ${state.targetTotal} units. Adjust plots to use exactly ${state.targetTotal} units.`,
        difference: state.targetTotal - sum
      };
    }
    // Invariant: 1:2:3 ratio for total 12 -> 2, 4, 6
    const isValid = (Number(state.plotA) === 2 && Number(state.plotB) === 4 && Number(state.plotC) === 6);
    return {
      isValid,
      userFacingMessage: isValid 
        ? 'Perfect! Plot B (4) is double Plot A (2), and Plot C (6) is triple Plot A (2).' 
        : `Total is 12, but ratio is not 1:2:3. Plot B must be twice Plot A, and Plot C must be three times Plot A.`
    };
  },

  resetState() {
    return this.getInitialState();
  },

  mount(container, state, onStateChange) {
    let currentState = { ...state };

    container.innerHTML = `
      <div class="interactive-lab-card" role="region" aria-label="Water Share Challenge Lab">
        <div class="lab-header">
          <div>
            <h3 class="lab-title">Water Share Challenge: Plot Allocation</h3>
            <p class="lab-subtitle">Allocate 12 total units among three plots in the ratio 1 : 2 : 3.</p>
          </div>
          <button id="math-reset-btn" class="btn btn-secondary btn-sm" aria-label="Reset allocation">↺ Reset</button>
        </div>

        <div class="status-badge status-neutral" id="math-tank-status" aria-live="polite">
          Total Water Tank: 12 Units | Currently Allocated: <strong id="math-total-alloc">${currentState.plotA + currentState.plotB + currentState.plotC}</strong> / 12
        </div>

        <div class="math-plots-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin: 20px 0;">
          <!-- Plot A -->
          <div class="card plot-card" style="padding: 16px; text-align: center; border: 1px solid var(--color-border); border-radius: var(--radius-card); background: #FFF;">
            <h4>Plot A (1 Part)</h4>
            <div style="font-size: 2rem; font-weight: 700; color: var(--color-math); margin: 12px 0;" id="val-plot-a">${currentState.plotA}</div>
            <div style="display: flex; justify-content: center; gap: 8px;">
              <button class="btn btn-secondary" id="btn-dec-a" style="min-width: 48px; min-height: 48px;" aria-label="Decrease Plot A">−</button>
              <button class="btn btn-primary" id="btn-inc-a" style="min-width: 48px; min-height: 48px; background: var(--color-math);" aria-label="Increase Plot A">+</button>
            </div>
          </div>

          <!-- Plot B -->
          <div class="card plot-card" style="padding: 16px; text-align: center; border: 1px solid var(--color-border); border-radius: var(--radius-card); background: #FFF;">
            <h4>Plot B (2 Parts)</h4>
            <div style="font-size: 2rem; font-weight: 700; color: var(--color-math); margin: 12px 0;" id="val-plot-b">${currentState.plotB}</div>
            <div style="display: flex; justify-content: center; gap: 8px;">
              <button class="btn btn-secondary" id="btn-dec-b" style="min-width: 48px; min-height: 48px;" aria-label="Decrease Plot B">−</button>
              <button class="btn btn-primary" id="btn-inc-b" style="min-width: 48px; min-height: 48px; background: var(--color-math);" aria-label="Increase Plot B">+</button>
            </div>
          </div>

          <!-- Plot C -->
          <div class="card plot-card" style="padding: 16px; text-align: center; border: 1px solid var(--color-border); border-radius: var(--radius-card); background: #FFF;">
            <h4>Plot C (3 Parts)</h4>
            <div style="font-size: 2rem; font-weight: 700; color: var(--color-math); margin: 12px 0;" id="val-plot-c">${currentState.plotC}</div>
            <div style="display: flex; justify-content: center; gap: 8px;">
              <button class="btn btn-secondary" id="btn-dec-c" style="min-width: 48px; min-height: 48px;" aria-label="Decrease Plot C">−</button>
              <button class="btn btn-primary" id="btn-inc-c" style="min-width: 48px; min-height: 48px; background: var(--color-math);" aria-label="Increase Plot C">+</button>
            </div>
          </div>
        </div>

        <div style="text-align: center; margin-top: 16px;">
          <button id="btn-check-math" class="btn btn-primary" style="background: var(--color-math); min-height: 48px; padding: 12px 24px;">Check Distribution</button>
        </div>

        <div id="math-feedback-box" class="callout-box" style="display: none; margin-top: 16px;" role="status" aria-live="polite"></div>
      </div>
    `;

    const updateUI = () => {
      container.querySelector('#val-plot-a').textContent = currentState.plotA;
      container.querySelector('#val-plot-b').textContent = currentState.plotB;
      container.querySelector('#val-plot-c').textContent = currentState.plotC;
      const total = currentState.plotA + currentState.plotB + currentState.plotC;
      container.querySelector('#math-total-alloc').textContent = total;
      onStateChange(currentState);
    };

    const attachStepper = (idDec, idInc, prop) => {
      container.querySelector(idDec).addEventListener('click', () => {
        if (currentState[prop] > 0) {
          currentState[prop]--;
          updateUI();
        }
      });
      container.querySelector(idInc).addEventListener('click', () => {
        const currentSum = currentState.plotA + currentState.plotB + currentState.plotC;
        if (currentSum < 12) {
          currentState[prop]++;
          updateUI();
        }
      });
    };

    attachStepper('#btn-dec-a', '#btn-inc-a', 'plotA');
    attachStepper('#btn-dec-b', '#btn-inc-b', 'plotB');
    attachStepper('#btn-dec-c', '#btn-inc-c', 'plotC');

    container.querySelector('#math-reset-btn').addEventListener('click', () => {
      currentState = this.resetState();
      updateUI();
      const fb = container.querySelector('#math-feedback-box');
      fb.style.display = 'none';
    });

    container.querySelector('#btn-check-math').addEventListener('click', () => {
      const result = this.validateInvariant(currentState);
      const fb = container.querySelector('#math-feedback-box');
      fb.style.display = 'block';
      fb.className = `callout-box ${result.isValid ? 'callout-success' : 'callout-warning'}`;
      fb.innerHTML = `<strong>${result.isValid ? '✓ Validated:' : '⚠ Notice:'}</strong> ${result.userFacingMessage}`;
      if (result.isValid) {
        currentState.isAllocated = true;
        onStateChange(currentState);
      }
    });
  },

  unmount() {
    // Zero background timers or audio in Math module
  }
};

