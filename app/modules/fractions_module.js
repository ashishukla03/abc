/**
 * Gramin PocketLab — Preparatory Mathematics Module (Baker's Chapati Feast)
 * File: app/modules/fractions_module.js
 * Class 5 NCERT Mathematics: Equivalent Fractions
 * Interactive circle fraction cutter and visual slice merger (1/2 == 2/4 == 4/8).
 */

export const FractionsModule = {
  id: 'mission-math-fractions',
  subjectId: 'math',

  getInitialState() {
    return {
      totalSlices: 4,
      selectedSlices: 2,
      isEquivalent: true,
      hasInteracted: false
    };
  },

  validateInvariant(state) {
    if (!state) return { isValid: false, userFacingMessage: 'No fraction data available.' };
    const num = Number(state.selectedSlices);
    const den = Number(state.totalSlices);
    const value = num / den;
    const isHalf = Math.abs(value - 0.5) < 0.001;
    return {
      isValid: isHalf,
      userFacingMessage: isHalf
        ? `Correct! ${num}/${den} is exactly equal to 1/2 of the chapati.`
        : `${num}/${den} equals ${(value).toFixed(2)}, which is not equal to half (1/2). Try matching 1/2!`
    };
  },

  mount(container, options = {}) {
    this._container = container;
    this._options = options;
    this._state = this.getInitialState();

    container.innerHTML = `
      <div class="fractions-lab" style="display: flex; flex-direction: column; gap: 20px; align-items: center; max-width: 800px; margin: 0 auto;">
        <div style="background: #EBF1FD; border-left: 4px solid #275DDB; padding: 12px 16px; border-radius: 8px; width: 100%;">
          <strong style="color: #275DDB;">Baker's Challenge:</strong> Cut the village festival chapati into slices and serve exactly <strong>half (1/2)</strong> to the guests!
        </div>

        <div style="display: flex; gap: 30px; align-items: center; flex-wrap: wrap; justify-content: center;">
          <!-- SVG Chapati Visualizer -->
          <div style="position: relative; width: 280px; height: 280px;">
            <svg id="chapati-svg" viewBox="-110 -110 220 220" style="width: 100%; height: 100%; transform: rotate(-90deg); filter: drop-shadow(0 6px 12px rgba(0,0,0,0.1));">
              <!-- Base background circle -->
              <circle cx="0" cy="0" r="100" fill="#E2E8F0" stroke="#CBD5E1" stroke-width="4" />
              <!-- Slices dynamically rendered -->
              <g id="chapati-slices"></g>
            </svg>
            <div id="chapati-label" style="position: absolute; bottom: -30px; left: 0; right: 0; text-align: center; font-weight: 800; font-size: 20px; color: #162033;">
              Fraction: 2/4 = 1/2
            </div>
          </div>

          <!-- Interactive Controls -->
          <div style="background: #FFFFFF; border: 1px solid #D9E0EB; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 16px; min-width: 280px;">
            <div>
              <label style="font-weight: 700; color: #162033; font-size: 15px; display: block; margin-bottom: 8px;">1. Number of Slices (Cuts):</label>
              <div style="display: flex; gap: 8px;">
                <button type="button" class="btn btn-secondary slice-cut-btn" data-cuts="2">2 Slices</button>
                <button type="button" class="btn btn-secondary slice-cut-btn" data-cuts="4" style="border-color: #275DDB; font-weight: 700;">4 Slices</button>
                <button type="button" class="btn btn-secondary slice-cut-btn" data-cuts="8">8 Slices</button>
              </div>
            </div>

            <div>
              <label style="font-weight: 700; color: #162033; font-size: 15px; display: block; margin-bottom: 8px;">2. Slices to Serve:</label>
              <div style="display: flex; align-items: center; gap: 12px;">
                <input type="range" id="slice-slider" min="0" max="4" value="2" style="flex: 1; accent-color: #275DDB; height: 8px;" />
                <span id="slice-count-badge" style="font-weight: 800; font-size: 18px; color: #275DDB; width: 40px; text-align: center;">2</span>
              </div>
            </div>

            <div id="fraction-status" style="padding: 10px; border-radius: 8px; font-weight: 600; font-size: 14px; background: #E8F5EE; color: #0E472E; text-align: center;">
              ✓ Exactly 1/2 of the chapati served!
            </div>
          </div>
        </div>
      </div>
    `;

    this._bindEvents();
    this._renderSlices();
  },

  _bindEvents() {
    const cutButtons = this._container.querySelectorAll('.slice-cut-btn');
    const slider = this._container.querySelector('#slice-slider');

    cutButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        cutButtons.forEach(b => { b.style.borderColor = '#D9E0EB'; b.style.fontWeight = '500'; });
        btn.style.borderColor = '#275DDB';
        btn.style.fontWeight = '700';

        const cuts = parseInt(btn.dataset.cuts, 10);
        this._state.totalSlices = cuts;
        slider.max = cuts;
        if (this._state.selectedSlices > cuts) {
          this._state.selectedSlices = Math.floor(cuts / 2);
        }
        slider.value = this._state.selectedSlices;
        this._updateState();
      });
    });

    slider.addEventListener('input', (e) => {
      this._state.selectedSlices = parseInt(e.target.value, 10);
      this._state.hasInteracted = true;
      this._updateState();
    });
  },

  _updateState() {
    const label = this._container.querySelector('#chapati-label');
    const countBadge = this._container.querySelector('#slice-count-badge');
    const status = this._container.querySelector('#fraction-status');
    const num = this._state.selectedSlices;
    const den = this._state.totalSlices;

    countBadge.textContent = num;
    this._renderSlices();

    const inv = this.validateInvariant(this._state);
    if (inv.isValid) {
      status.style.background = '#E8F5EE';
      status.style.color = '#0E472E';
      status.textContent = `✓ Perfect! ${num}/${den} is exactly equal to 1/2!`;
      label.textContent = `Fraction: ${num}/${den} = 1/2`;
      if (this._options.onStateChange) this._options.onStateChange(true, this._state);
    } else {
      status.style.background = '#FEF3C7';
      status.style.color = '#78350F';
      status.textContent = `Adjust to serve half (1/2). Currently ${num}/${den}.`;
      label.textContent = `Fraction: ${num}/${den}`;
      if (this._options.onStateChange) this._options.onStateChange(false, this._state);
    }
  },

  _renderSlices() {
    const group = this._container.querySelector('#chapati-slices');
    if (!group) return;
    group.innerHTML = '';

    const den = this._state.totalSlices;
    const num = this._state.selectedSlices;
    const anglePerSlice = 360 / den;

    for (let i = 0; i < den; i++) {
      const isSelected = i < num;
      const startAngle = (i * anglePerSlice) * (Math.PI / 180);
      const endAngle = ((i + 1) * anglePerSlice) * (Math.PI / 180);

      const x1 = 100 * Math.cos(startAngle);
      const y1 = 100 * Math.sin(startAngle);
      const x2 = 100 * Math.cos(endAngle);
      const y2 = 100 * Math.sin(endAngle);

      const largeArc = anglePerSlice > 180 ? 1 : 0;
      const d = `M 0 0 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} Z`;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', isSelected ? '#F59E0B' : '#FCD34D');
      path.setAttribute('stroke', '#FFFFFF');
      path.setAttribute('stroke-width', '2.5');
      path.style.transition = 'fill 0.25s ease';
      group.appendChild(path);
    }
  },

  resetState() {
    this._state = this.getInitialState();
    if (this._container) {
      this._updateVisuals();
    }
    return this._state;
  },

  destroy() {
    this._container = null;
  }
};
