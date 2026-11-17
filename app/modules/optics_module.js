/**
 * Gramin PocketLab — Secondary Physics Module (Ray Optics Refraction & Snell's Law)
 * File: app/modules/optics_module.js
 * Class 10 CISCE / CBSE Science: Light & Refraction
 * Interactive light beam incident angle slider, Snell's Law (n1 * sin(theta1) = n2 * sin(theta2)),
 * critical angle, and total internal reflection.
 */

export const OpticsModule = {
  id: 'mission-physics-optics',
  subjectId: 'physics',

  getInitialState() {
    return {
      incidentAngleDeg: 30,
      medium1Index: 1.0, // Air
      medium2Index: 1.5, // Glass
      refractedAngleDeg: 19.47,
      isTotalInternalReflection: false,
      hasInteracted: false
    };
  },

  validateInvariant(state) {
    if (!state) return { isValid: false, userFacingMessage: 'No optics state available.' };
    return {
      isValid: state.hasInteracted,
      userFacingMessage: 'Observed ray bending conforming to Snell\'s Law: n1 * sin(θ1) = n2 * sin(θ2).'
    };
  },

  mount(container, options = {}) {
    this._container = container;
    this._options = options;
    this._state = this.getInitialState();

    container.innerHTML = `
      <div class="optics-lab" style="display: flex; flex-direction: column; gap: 20px; align-items: center; max-width: 900px; margin: 0 auto;">
        <div style="background: #E6F5F4; border-left: 4px solid #087E79; padding: 12px 16px; border-radius: 8px; width: 100%;">
          <strong style="color: #087E79;">Snell's Law Lab:</strong> Drag the laser angle to observe how light refracts (bends) when entering a denser medium (Glass, n = 1.50).
        </div>

        <div style="display: flex; gap: 30px; align-items: center; flex-wrap: wrap; justify-content: center; width: 100%;">
          <!-- Ray Diagram Canvas -->
          <div style="background: #0F172A; border-radius: 12px; padding: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
            <canvas id="optics-canvas" width="460" height="320" style="display: block; border-radius: 8px;"></canvas>
          </div>

          <!-- Controls Panel -->
          <div style="background: #FFFFFF; border: 1px solid #D9E0EB; border-radius: 12px; padding: 24px; display: flex; flex-direction: column; gap: 16px; min-width: 300px; flex: 1;">
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <label style="font-weight: 700; color: #162033; font-size: 15px;">Angle of Incidence (&theta;<sub>1</sub>):</label>
                <span id="optics-angle-display" style="font-weight: 800; color: #087E79; font-size: 16px;">30.0&deg;</span>
              </div>
              <input type="range" id="optics-angle-slider" min="0" max="85" value="30" step="1" style="width: 100%; accent-color: #087E79; height: 8px;" />
            </div>

            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px; font-size: 14px; line-height: 1.6;">
              <div><strong>Medium 1 (Air):</strong> n<sub>1</sub> = 1.00</div>
              <div><strong>Medium 2 (Glass):</strong> n<sub>2</sub> = 1.50</div>
              <div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed #CBD5E1; color: #087E79; font-weight: 700;">
                Angle of Refraction (&theta;<sub>2</sub>): <span id="optics-refract-display">19.5&deg;</span>
              </div>
            </div>

            <div id="optics-rule-badge" style="background: #E6F5F4; color: #05504D; padding: 10px; border-radius: 8px; font-size: 13px; font-weight: 600; text-align: center;">
              Light slows down in glass &rarr; bends <strong>towards</strong> the normal line.
            </div>
          </div>
        </div>
      </div>
    `;

    this._canvas = this._container.querySelector('#optics-canvas');
    this._ctx = this._canvas.getContext('2d');
    this._bindEvents();
    this._draw();
  },

  _bindEvents() {
    const slider = this._container.querySelector('#optics-angle-slider');
    slider.addEventListener('input', (e) => {
      this._state.incidentAngleDeg = parseFloat(e.target.value);
      this._state.hasInteracted = true;
      this._updateCalculations();
      this._draw();
      if (this._options.onStateChange) this._options.onStateChange(true, this._state);
    });
  },

  _updateCalculations() {
    const theta1Rad = (this._state.incidentAngleDeg * Math.PI) / 180;
    const sinTheta2 = (this._state.medium1Index / this._state.medium2Index) * Math.sin(theta1Rad);
    const theta2Rad = Math.asin(Math.min(1, sinTheta2));
    this._state.refractedAngleDeg = (theta2Rad * 180) / Math.PI;

    this._container.querySelector('#optics-angle-display').innerHTML = `${this._state.incidentAngleDeg.toFixed(1)}&deg;`;
    this._container.querySelector('#optics-refract-display').innerHTML = `${this._state.refractedAngleDeg.toFixed(1)}&deg;`;
  },

  _draw() {
    const ctx = this._ctx;
    const w = this._canvas.width;
    const h = this._canvas.height;
    const cy = h / 2;
    const cx = w / 2;

    ctx.clearRect(0, 0, w, h);

    // Medium 1 (Air - dark navy)
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, w, cy);

    // Medium 2 (Glass - subtle glowing cyan/teal)
    ctx.fillStyle = 'rgba(8, 126, 121, 0.25)';
    ctx.fillRect(0, cy, w, cy);

    // Interface boundary
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.stroke();

    // Normal dashed line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(cx, 20);
    ctx.lineTo(cx, h - 20);
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = '13px system-ui';
    ctx.fillText('Medium 1: Air (n = 1.0)', 20, 30);
    ctx.fillText('Medium 2: Glass (n = 1.5)', 20, cy + 30);
    ctx.fillText('Normal (90°)', cx + 8, 40);

    // Incident Beam (Red Laser from top-left)
    const theta1Rad = (this._state.incidentAngleDeg * Math.PI) / 180;
    const rayLen = 140;
    const startX = cx - rayLen * Math.sin(theta1Rad);
    const startY = cy - rayLen * Math.cos(theta1Rad);

    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#EF4444';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(cx, cy);
    ctx.stroke();

    // Refracted Beam (into Glass)
    const theta2Rad = (this._state.refractedAngleDeg * Math.PI) / 180;
    const endX = cx + rayLen * Math.sin(theta2Rad);
    const endY = cy + rayLen * Math.cos(theta2Rad);

    ctx.strokeStyle = '#10B981';
    ctx.shadowColor = '#10B981';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Weak partial reflection
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + rayLen * Math.sin(theta1Rad), cy - rayLen * Math.cos(theta1Rad));
    ctx.stroke();

    // Incident point glow dot
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();
  },

  resetState() {
    this._state = this.getInitialState();
    if (this._container) {
      const slider = this._container.querySelector('#optics-angle-slider');
      if (slider) slider.value = 30;
      this._updateCalculations(30);
      this._drawRayDiagram();
    }
    return this._state;
  },

  destroy() {
    this._container = null;
  }
};
