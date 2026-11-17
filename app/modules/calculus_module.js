/**
 * Gramin PocketLab — Senior Secondary Mathematics Module (Solar Roof Calculus Integrals)
 * File: app/modules/calculus_module.js
 * Class 12 CBSE / State Board: Applications of Integrals
 * Interactive Riemann sum slider demonstrating accumulation of infinitesimal strips
 * approaching the exact analytical area under a parabola f(x) = 4 - x^2 from -2 to +2.
 */

export const CalculusModule = {
  id: 'mission-math-calculus',
  subjectId: 'math',

  getInitialState() {
    return {
      stripCount: 4,
      exactArea: 10.667, // Integral of (4 - x^2) from -2 to 2 = 32/3 = 10.667
      approxArea: 10.0,
      hasInteracted: false
    };
  },

  validateInvariant(state) {
    if (!state) return { isValid: false, userFacingMessage: 'No calculus data available.' };
    return {
      isValid: state.hasInteracted,
      userFacingMessage: 'Observed Riemann sum approximation converging towards the exact definite integral limit (10.67 m²).'
    };
  },

  mount(container, options = {}) {
    this._container = container;
    this._options = options;
    this._state = this.getInitialState();

    container.innerHTML = `
      <div class="calculus-lab" style="display: flex; flex-direction: column; gap: 20px; align-items: center; max-width: 900px; margin: 0 auto;">
        <div style="background: #EBF1FD; border-left: 4px solid #275DDB; padding: 12px 16px; border-radius: 8px; width: 100%;">
          <strong style="color: #275DDB;">Solar Roof Area Calculation:</strong> To install solar panels on a curved village panchayat roof profile $f(x) = 4 - x^2$, increase the number of rectangular strips to see Riemann sums converge to the definite integral!
        </div>

        <div style="display: flex; gap: 30px; align-items: center; flex-wrap: wrap; justify-content: center; width: 100%;">
          <!-- Integral Canvas -->
          <div style="background: #0F172A; border-radius: 12px; padding: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
            <canvas id="calc-canvas" width="460" height="300" style="display: block; border-radius: 8px;"></canvas>
          </div>

          <!-- Controls & Readout -->
          <div style="background: #FFFFFF; border: 1px solid #D9E0EB; border-radius: 12px; padding: 24px; display: flex; flex-direction: column; gap: 16px; min-width: 300px; flex: 1;">
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <label style="font-weight: 700; color: #162033; font-size: 15px;">Number of Slices (n):</label>
                <span id="calc-strips-badge" style="font-weight: 800; color: #275DDB; font-size: 18px;">4 strips</span>
              </div>
              <input type="range" id="calc-slider" min="2" max="40" value="4" step="2" style="width: 100%; accent-color: #275DDB; height: 8px;" />
            </div>

            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px; font-size: 14px; line-height: 1.6;">
              <div style="display: flex; justify-content: space-between;">
                <span>Riemann Sum Area (&Sigma;):</span>
                <strong id="calc-approx-display" style="color: #275DDB; font-size: 16px;">10.00 m&sup2;</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-top: 4px;">
                <span>Exact Definite Integral (&int;):</span>
                <strong style="color: #0E472E; font-size: 16px;">10.67 m&sup2;</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-top: 6px; padding-top: 6px; border-top: 1px dashed #CBD5E1;">
                <span>Approximation Error:</span>
                <span id="calc-error-display" style="font-weight: 700; color: #B45309;">0.67 m&sup2; (6.3%)</span>
              </div>
            </div>

            <div id="calc-rule-status" style="background: #EBF1FD; color: #1A46A8; padding: 10px; border-radius: 8px; font-size: 13px; font-weight: 600; text-align: center;">
              As n &rarr; &infin;, width &Delta;x &rarr; 0, and &Sigma; f(x<sub>i</sub>)&Delta;x &rarr; &int;<sub>-2</sub><sup>2</sup> (4 - x&sup2;) dx.
            </div>
          </div>
        </div>
      </div>
    `;

    this._canvas = this._container.querySelector('#calc-canvas');
    this._ctx = this._canvas.getContext('2d');
    this._bindEvents();
    this._updateCalculations();
    this._draw();
  },

  _bindEvents() {
    const slider = this._container.querySelector('#calc-slider');
    slider.addEventListener('input', (e) => {
      this._state.stripCount = parseInt(e.target.value, 10);
      this._state.hasInteracted = true;
      this._updateCalculations();
      this._draw();
      if (this._options.onStateChange) this._options.onStateChange(true, this._state);
    });
  },

  _updateCalculations() {
    const n = this._state.stripCount;
    const a = -2;
    const b = 2;
    const dx = (b - a) / n;
    let sum = 0;

    for (let i = 0; i < n; i++) {
      const midX = a + (i + 0.5) * dx;
      const height = Math.max(0, 4 - midX * midX);
      sum += height * dx;
    }

    this._state.approxArea = sum;
    const error = Math.abs(this._state.exactArea - sum);
    const errPct = (error / this._state.exactArea) * 100;

    this._container.querySelector('#calc-strips-badge').textContent = `${n} strips`;
    this._container.querySelector('#calc-approx-display').textContent = `${sum.toFixed(2)} m²`;
    this._container.querySelector('#calc-error-display').textContent = `${error.toFixed(2)} m² (${errPct.toFixed(1)}%)`;
  },

  _draw() {
    const ctx = this._ctx;
    const w = this._canvas.width;
    const h = this._canvas.height;
    ctx.clearRect(0, 0, w, h);

    const padX = 40;
    const padY = 30;
    const plotW = w - padX * 2;
    const plotH = h - padY * 2;

    const toCanvasX = (x) => padX + ((x + 2.5) / 5) * plotW;
    const toCanvasY = (y) => (h - padY) - (y / 4.8) * plotH;

    // Axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padX, toCanvasY(0));
    ctx.lineTo(w - padX, toCanvasY(0));
    ctx.moveTo(toCanvasX(0), padY);
    ctx.lineTo(toCanvasX(0), h - padY);
    ctx.stroke();

    // Riemann Rectangles
    const n = this._state.stripCount;
    const a = -2;
    const b = 2;
    const dx = (b - a) / n;

    ctx.fillStyle = 'rgba(39, 93, 219, 0.45)';
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 1;

    for (let i = 0; i < n; i++) {
      const xLeft = a + i * dx;
      const midX = xLeft + dx / 2;
      const height = Math.max(0, 4 - midX * midX);

      const cx1 = toCanvasX(xLeft);
      const cx2 = toCanvasX(xLeft + dx);
      const cyTop = toCanvasY(height);
      const cyBottom = toCanvasY(0);

      ctx.fillRect(cx1, cyTop, cx2 - cx1, cyBottom - cyTop);
      ctx.strokeRect(cx1, cyTop, cx2 - cx1, cyBottom - cyTop);
    }

    // Parabola Curve f(x) = 4 - x^2
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = -2.4; px <= 2.4; px += 0.05) {
      const py = 4 - px * px;
      const canvasX = toCanvasX(px);
      const canvasY = toCanvasY(Math.max(-0.5, py));
      if (px === -2.4) ctx.moveTo(canvasX, canvasY);
      else ctx.lineTo(canvasX, canvasY);
    }
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#CBD5E1';
    ctx.font = '12px system-ui';
    ctx.fillText('f(x) = 4 - x²', toCanvasX(0.4), toCanvasY(3.8));
    ctx.fillText('x = -2', toCanvasX(-2) - 15, toCanvasY(0) + 18);
    ctx.fillText('x = +2', toCanvasX(2) - 15, toCanvasY(0) + 18);
  },

  resetState() {
    this._state = this.getInitialState();
    if (this._container) {
      const slider = this._container.querySelector('#calc-strips-slider');
      if (slider) slider.value = 4;
      this._updateCalculations(4);
      this._drawPlot();
    }
    return this._state;
  },

  destroy() {
    this._container = null;
  }
};
