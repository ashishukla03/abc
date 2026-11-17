/**
 * Gramin PocketLab — Motion Graphics & Kinetic Choreography Engine
 * Offline-first, GPU-accelerated, WCAG 2.2.2/2.3.3 reduced-motion compliant.
 */

export function isReducedMotion() {
  return typeof window !== 'undefined' && 
    window.matchMedia && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Animate numerical counter smoothly from current to target
 */
export function animateCounter(element, targetValue, duration = 800) {
  if (!element) return;
  if (isReducedMotion()) {
    element.textContent = targetValue;
    return;
  }
  const start = parseInt(element.textContent, 10) || 0;
  const startTime = performance.now();

  function update(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Spring-like ease out cubic
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (targetValue - start) * easeOut);
    element.textContent = current;
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = targetValue;
    }
  }
  requestAnimationFrame(update);
}

/**
 * Generates an animated circular progress ring SVG with specular glass glow
 */
export function renderCircularRing({ value = 0, max = 100, size = 52, strokeWidth = 5, color = '#2563EB', trackColor = 'rgba(226, 232, 240, 0.6)' } = {}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(Math.max(value / max, 0), 1);
  const strokeDashoffset = circumference - (percent * circumference);

  return `
    <div class="circular-progress-wrap" style="position: relative; width: ${size}px; height: ${size}px; display: inline-flex; align-items: center; justify-content: center;">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform: rotate(-90deg); overflow: visible;">
        <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="none" stroke="${trackColor}" stroke-width="${strokeWidth}" />
        <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round"
          stroke-dasharray="${circumference}" stroke-dashoffset="${strokeDashoffset}"
          style="transition: stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1);" />
      </svg>
      <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: ${Math.round(size * 0.25)}px; font-weight: 800; font-family: ui-monospace, monospace;">
        ${Math.round(percent * 100)}%
      </div>
    </div>
  `;
}

/**
 * Live Animated Sine Wave Oscilloscope SVG Visualizer Header
 */
export function renderLiveSineWaveSvg({ id = 'sine-wave-header', frequency = 440, amplitude = 28, width = 600, height = 70, strokeColor = '#0D9488' } = {}) {
  // Generates points for smooth sine wave
  const points = [];
  const cycles = 5;
  const step = 4;
  for (let x = 0; x <= width; x += step) {
    const y = (height / 2) + Math.sin((x / width) * cycles * 2 * Math.PI) * amplitude;
    points.push(`${x},${y.toFixed(1)}`);
  }
  const d = `M ${points.join(' L ')}`;

  return `
    <div class="sine-wave-visualizer-container" style="position: relative; width: 100%; height: ${height}px; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(16px); border-radius: 14px; border: 1px solid rgba(255, 255, 255, 0.12); overflow: hidden; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);">
      <!-- Oscilloscope grid lines -->
      <svg width="100%" height="100%" style="position: absolute; inset: 0; pointer-events: none; opacity: 0.25;">
        <defs>
          <pattern id="grid-pattern-${id}" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#38BDF8" stroke-width="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern-${id})" />
      </svg>

      <!-- Active Animated Waveform -->
      <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" style="position: relative; z-index: 2;">
        <path d="${d}" fill="none" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round" style="filter: drop-shadow(0 0 8px ${strokeColor});" />
      </svg>

      <!-- Waveform telemetry readout -->
      <div style="position: absolute; bottom: 6px; right: 12px; z-index: 3; display: flex; gap: 8px; font-family: ui-monospace, monospace; font-size: 11px; color: #38BDF8; font-weight: 600;">
        <span>FREQ: ${frequency} Hz</span>
        <span>AMP: ${amplitude} dB</span>
        <span style="color: #10B981;">● LIVE SIGNAL</span>
      </div>
    </div>
  `;
}
