// app/modules/math_stub.js
/**
 * Gramin PocketLab — Mathematics Module (Water Share Challenge)
 * Conforming to SubjectInteractionHandler contract.
 * Class 6 NCERT Ch 12: Ratios and Proportions.
 * Irrigation allocation: 12 units distributed in 1:2:3 ratio -> Plot A = 2, Plot B = 4, Plot C = 6.
 * Enforces sum invariant (sum === 12) AND ratio invariant (1:2:3), with negative input protection.
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
    if (!state) {
      return { isValid: false, userFacingMessage: 'No allocation data available.', difference: 12 };
    }

    const a = Number(state.plotA);
    const b = Number(state.plotB);
    const c = Number(state.plotC);
    const target = Number(state.targetTotal) || 12;

    // Protection against NaN, non-finite, or negative numbers
    if (isNaN(a) || isNaN(b) || isNaN(c) || !isFinite(a) || !isFinite(b) || !isFinite(c) || a < 0 || b < 0 || c < 0) {
      return {
        isValid: false,
        userFacingMessage: 'Plot allocations must be non-negative whole numbers.',
        difference: target
      };
    }

    const sum = a + b + c;

    // 1. Total Sum Invariant
    if (sum !== target) {
      return {
        isValid: false,
        userFacingMessage: `Total allocated is ${sum} / ${target} units. Adjust plots to use exactly ${target} units.`,
        difference: target - sum
      };
    }

    // 2. Ratio Invariant: 1 : 2 : 3 (Plot A = 2, Plot B = 4, Plot C = 6)
    const isRatio = (a > 0 && b === 2 * a && c === 3 * a);
    const isValid = (sum === target && isRatio && a === 2 && b === 4 && c === 6);

    return {
      isValid,
      userFacingMessage: isValid 
        ? 'Perfect! Plot B (4 units) is double Plot A (2 units), and Plot C (6 units) is triple Plot A (2 units).' 
        : `Total is ${target} units, but the ratio is not 1 : 2 : 3. Plot B must be twice Plot A (${a * 2}), and Plot C must be three times Plot A (${a * 3}).`
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
            <p class="lab-subtitle">Allocate exactly 12 total units among three farmland plots in the ratio 1 : 2 : 3.</p>
          </div>
          <button type="button" id="math-reset-btn" class="btn btn-secondary btn-sm" aria-label="Reset allocation" style="min-height: 48px;">↺ Reset</button>
        </div>

        <div class="status-badge status-neutral" id="math-tank-status" aria-live="polite" style="margin-bottom: 16px;">
          Total Water Tank: 12 Units | Currently Allocated: <strong id="math-total-alloc">${currentState.plotA + currentState.plotB + currentState.plotC}</strong> / 12
        </div>

        <div class="math-plots-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin: 20px 0;">
          <!-- Plot A -->
          <div class="card plot-card" style="padding: 16px; text-align: center; border: 1px solid var(--color-border); border-radius: var(--radius-card); background: #FFF;">
            <h4 style="margin-bottom: 4px;">Plot A (1 Part)</h4>
            <div style="font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 8px;">Small Nursery Bed</div>
            <div style="font-size: 2.2rem; font-weight: 700; color: var(--color-math); margin: 8px 0;" id="val-plot-a">${currentState.plotA}</div>
            <div style="display: flex; justify-content: center; gap: 8px;">
              <button type="button" class="btn btn-secondary" id="btn-dec-a" style="min-width: 48px; min-height: 48px; font-size: 1.25rem;" aria-label="Decrease Plot A water allocation">−</button>
              <button type="button" class="btn btn-primary" id="btn-inc-a" style="min-width: 48px; min-height: 48px; font-size: 1.25rem; background: var(--color-math);" aria-label="Increase Plot A water allocation">+</button>
            </div>
          </div>

          <!-- Plot B -->
          <div class="card plot-card" style="padding: 16px; text-align: center; border: 1px solid var(--color-border); border-radius: var(--radius-card); background: #FFF;">
            <h4 style="margin-bottom: 4px;">Plot B (2 Parts)</h4>
            <div style="font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 8px;">Vegetable Garden</div>
            <div style="font-size: 2.2rem; font-weight: 700; color: var(--color-math); margin: 8px 0;" id="val-plot-b">${currentState.plotB}</div>
            <div style="display: flex; justify-content: center; gap: 8px;">
              <button type="button" class="btn btn-secondary" id="btn-dec-b" style="min-width: 48px; min-height: 48px; font-size: 1.25rem;" aria-label="Decrease Plot B water allocation">−</button>
              <button type="button" class="btn btn-primary" id="btn-inc-b" style="min-width: 48px; min-height: 48px; font-size: 1.25rem; background: var(--color-math);" aria-label="Increase Plot B water allocation">+</button>
            </div>
          </div>

          <!-- Plot C -->
          <div class="card plot-card" style="padding: 16px; text-align: center; border: 1px solid var(--color-border); border-radius: var(--radius-card); background: #FFF;">
            <h4 style="margin-bottom: 4px;">Plot C (3 Parts)</h4>
            <div style="font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 8px;">Main Grain Field</div>
            <div style="font-size: 2.2rem; font-weight: 700; color: var(--color-math); margin: 8px 0;" id="val-plot-c">${currentState.plotC}</div>
            <div style="display: flex; justify-content: center; gap: 8px;">
              <button type="button" class="btn btn-secondary" id="btn-dec-c" style="min-width: 48px; min-height: 48px; font-size: 1.25rem;" aria-label="Decrease Plot C water allocation">−</button>
              <button type="button" class="btn btn-primary" id="btn-inc-c" style="min-width: 48px; min-height: 48px; font-size: 1.25rem; background: var(--color-math);" aria-label="Increase Plot C water allocation">+</button>
            </div>
          </div>
        </div>

        <div style="text-align: center; margin-top: 16px;">
          <button type="button" id="btn-check-math" class="btn btn-primary" style="background: var(--color-math); min-height: 48px; padding: 12px 28px; font-weight: 600;">
            ✓ Check Ratio Distribution
          </button>
        </div>

        <div id="math-feedback-box" class="callout-box" style="display: none; margin-top: 16px;" role="status" aria-live="polite"></div>
      </div>
    `;

    const updateUI = () => {
      const aElem = container.querySelector('#val-plot-a');
      const bElem = container.querySelector('#val-plot-b');
      const cElem = container.querySelector('#val-plot-c');
      const totalElem = container.querySelector('#math-total-alloc');
      const tankStatus = container.querySelector('#math-tank-status');

      if (aElem) aElem.textContent = currentState.plotA;
      if (bElem) bElem.textContent = currentState.plotB;
      if (cElem) cElem.textContent = currentState.plotC;
      const total = currentState.plotA + currentState.plotB + currentState.plotC;
      if (totalElem) totalElem.textContent = total;

      if (tankStatus) {
        if (total === 12) {
          tankStatus.className = 'status-badge status-phys';
          tankStatus.textContent = `Total Water Tank: 12 Units | Tank Fully Allocated (12 / 12)`;
        } else if (total > 12) {
          tankStatus.className = 'status-badge status-alert';
          tankStatus.textContent = `Total Water Tank: 12 Units | Tank Exceeded: ${total} / 12 Units!`;
        } else {
          tankStatus.className = 'status-badge status-neutral';
          tankStatus.textContent = `Total Water Tank: 12 Units | Currently Allocated: ${total} / 12 Units`;
        }
      }

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
      onStateChange(currentState);
    });

    container.querySelector('#btn-check-math').addEventListener('click', () => {
      const result = this.validateInvariant(currentState);
      const fb = container.querySelector('#math-feedback-box');
      fb.style.display = 'block';
      fb.className = `callout-box ${result.isValid ? 'callout-success' : 'callout-warning'}`;
      fb.innerHTML = `<strong>${result.isValid ? '✓ Validated:' : '⚠ Allocation Notice:'}</strong> ${result.userFacingMessage}`;
      currentState.isAllocated = result.isValid;
      onStateChange(currentState);
    });
  },

  unmount() {}
};
