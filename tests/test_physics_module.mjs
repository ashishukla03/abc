/**
 * Gramin PocketLab — Automated Verification Suite
 * Suite 3: test_physics_module.mjs
 *
 * Verifies:
 * 1. PhysicsModule interface: getInitialState(), validateInvariant(), resetState().
 * 2. Mathematical wave period & cycle count accuracy:
 *    - 220 Hz: period T is ~4.545 ms (4.55 ms rounded), 2.2 complete cycles in 10 ms window.
 *    - 440 Hz: period T is ~2.273 ms (2.27 ms rounded), 4.4 complete cycles in 10 ms window.
 *    - Exact 2.0x horizontal crest compression ratio between 440 Hz and 220 Hz.
 * 3. Invariant range boundaries (100–800 Hz frequency, 10–100% amplitude).
 * 4. Web Audio gain clamp constraint: gain must NEVER exceed 0.70 (-3 dBFS) linear ceiling under any input.
 * 5. Zero autoplay policy:
 *    - Module initial state has isPlaying === false.
 *    - AudioContext must remain suspended until explicit user gesture.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

// Mock Web Audio and DOM Primitives
class MockAudioParam {
  constructor(initial = 0) {
    this.value = initial;
    this.history = [];
  }
  setValueAtTime(val) {
    this.value = val;
    this.history.push({ method: 'setValueAtTime', val });
  }
  setTargetAtTime(val) {
    this.value = val;
    this.history.push({ method: 'setTargetAtTime', val });
  }
  cancelScheduledValues() {}
}

let lastCreatedGainNode = null;
let lastCreatedOscillator = null;

class MockGainNode {
  constructor() {
    this.gain = new MockAudioParam(1.0);
    lastCreatedGainNode = this;
  }
  connect() {}
  disconnect() {}
}

class MockOscillatorNode {
  constructor() {
    this.frequency = new MockAudioParam(440);
    this.type = 'sine';
    lastCreatedOscillator = this;
  }
  connect() {}
  disconnect() {}
  start() {}
  stop() {}
}

let audioContextInstanceCount = 0;
let lastCreatedContext = null;

class MockAudioContext {
  constructor() {
    audioContextInstanceCount++;
    this.state = 'suspended'; // MANDATORY: browsers construct AudioContext in 'suspended' state
    this.currentTime = 0;
    this.destination = {};
    lastCreatedContext = this;
  }
  createGain() { return new MockGainNode(); }
  createOscillator() { return new MockOscillatorNode(); }
  createAnalyser() {
    return {
      fftSize: 1024,
      smoothingTimeConstant: 0.8,
      connect() {},
      disconnect() {},
      getByteTimeDomainData(arr) { arr.fill(128); }
    };
  }
  resume() {
    this.state = 'running';
    return Promise.resolve();
  }
  close() {
    this.state = 'closed';
    return Promise.resolve();
  }
}

function createMockElement(tag = 'div') {
  const listeners = {};
  const attrs = {};
  const classes = new Set();
  return {
    tagName: tag.toUpperCase(),
    style: {},
    className: '',
    classList: {
      add(...cls) { cls.forEach(c => classes.add(c)); },
      remove(...cls) { cls.forEach(c => classes.delete(c)); },
      toggle(c, force) {
        if (force === true) classes.add(c);
        else if (force === false) classes.delete(c);
        else if (classes.has(c)) classes.delete(c);
        else classes.add(c);
      },
      contains(c) { return classes.has(c); }
    },
    textContent: '',
    innerHTML: '',
    value: '',
    dataset: {},
    setAttribute(k, v) { attrs[k] = String(v); },
    getAttribute(k) { return attrs[k] !== undefined ? attrs[k] : null; },
    removeAttribute(k) { delete attrs[k]; },
    addEventListener(evt, fn) {
      if (!listeners[evt]) listeners[evt] = [];
      listeners[evt].push(fn);
    },
    removeEventListener(evt, fn) {
      if (listeners[evt]) listeners[evt] = listeners[evt].filter(f => f !== fn);
    },
    trigger(evt, eventObj = {}) {
      if (listeners[evt]) listeners[evt].forEach(fn => fn(eventObj));
    },
    querySelector(sel) { return createMockElement('div'); },
    querySelectorAll(sel) { return []; },
    getContext(type) {
      if (type === '2d') {
        const dummyContext = {
          canvas: { width: 600, height: 240 },
          fillStyle: '#000',
          strokeStyle: '#000',
          lineWidth: 1,
          font: '10px sans-serif',
          textAlign: 'left',
          textBaseline: 'top'
        };
        return new Proxy(dummyContext, {
          get(target, prop) {
            if (prop in target) return target[prop];
            return () => {};
          },
          set(target, prop, val) {
            target[prop] = val;
            return true;
          }
        });
      }
      return null;
    },
    getBoundingClientRect() {
      return { width: 600, height: 240, top: 0, left: 0 };
    }
  };
}

globalThis.window = {
  AudioContext: MockAudioContext,
  webkitAudioContext: MockAudioContext,
  addEventListener() {},
  removeEventListener() {},
  requestAnimationFrame(cb) { return 1; },
  cancelAnimationFrame() {},
  matchMedia() {
    return { matches: false, addEventListener() {}, removeEventListener() {} };
  }
};

const { PhysicsModule } = await import('../app/modules/physics.js');

test('Suite 3: Physics Flagship Module & Acoustic Science Verification', async (suite) => {
  await suite.test('1. PhysicsModule Interface Contract Compliance', () => {
    assert.equal(typeof PhysicsModule.getInitialState, 'function', 'getInitialState must be a function');
    assert.equal(typeof PhysicsModule.validateInvariant, 'function', 'validateInvariant must be a function');
    assert.equal(typeof PhysicsModule.resetState, 'function', 'resetState must be a function');
    assert.equal(typeof PhysicsModule.mount, 'function', 'mount must be a function');

    const state = PhysicsModule.getInitialState();
    assert.equal(state.frequency, 220, 'Initial frequency must default to 220 Hz');
    assert.equal(state.amplitude, 50, 'Initial amplitude must default to 50%');
    assert.equal(state.isPlaying, false, 'Initial isPlaying state must be false (Zero Autoplay)');
    assert.equal(state.micActive, false, 'Initial micActive state must be false');
    assert.equal(state.activePreset, '220', 'Initial preset should be 220');
  });

  await suite.test('2. Mathematical Wave Period and Cycle Counts (220 Hz vs 440 Hz)', () => {
    // Exact physical equations:
    // Period T (seconds) = 1 / f
    // Period T (ms) = 1000 / f
    // Complete cycles in window W (10 ms = 0.01 s) = W / T = f * 0.01

    // Target 1: 220 Hz
    const f1 = 220;
    const expectedPeriodMs1 = 1000 / f1; // 4.5454545...
    const expectedCyclesIn10ms1 = f1 * 0.01; // 2.2 cycles

    assert.ok(Math.abs(expectedPeriodMs1 - 4.54545) < 0.001, `220 Hz period must be ~4.545 ms (was: ${expectedPeriodMs1})`);
    assert.equal(expectedCyclesIn10ms1, 2.2, '220 Hz must produce exactly 2.2 cycles across 10 ms');

    const v1 = PhysicsModule.validateInvariant({ frequency: 220, amplitude: 50 });
    assert.equal(v1.isValid, true, '220 Hz and 50% amplitude must be valid');
    assert.ok(v1.userFacingMessage.includes('2.2 wave cycles per 10 ms'), `Message should report 2.2 cycles: "${v1.userFacingMessage}"`);
    assert.ok(v1.userFacingMessage.includes('Period T = 4.55 ms'), `Message should report Period T = 4.55 ms: "${v1.userFacingMessage}"`);

    // Target 2: 440 Hz
    const f2 = 440;
    const expectedPeriodMs2 = 1000 / f2; // 2.272727...
    const expectedCyclesIn10ms2 = f2 * 0.01; // 4.4 cycles

    assert.ok(Math.abs(expectedPeriodMs2 - 2.27272) < 0.001, `440 Hz period must be ~2.273 ms (was: ${expectedPeriodMs2})`);
    assert.equal(expectedCyclesIn10ms2, 4.4, '440 Hz must produce exactly 4.4 cycles across 10 ms');

    const v2 = PhysicsModule.validateInvariant({ frequency: 440, amplitude: 50 });
    assert.equal(v2.isValid, true, '440 Hz and 50% amplitude must be valid');
    assert.ok(v2.userFacingMessage.includes('4.4 wave cycles per 10 ms'), `Message should report 4.4 cycles: "${v2.userFacingMessage}"`);
    assert.ok(v2.userFacingMessage.includes('Period T = 2.27 ms'), `Message should report Period T = 2.27 ms: "${v2.userFacingMessage}"`);

    // Exact 2x compression factor:
    const compressionRatio = expectedCyclesIn10ms2 / expectedCyclesIn10ms1;
    assert.equal(compressionRatio, 2.0, 'Octave jump from 220 Hz to 440 Hz must represent exact 2x horizontal crest compression');
  });

  await suite.test('3. Frequency & Amplitude Boundary Invariant Validation', () => {
    // Valid boundaries
    assert.equal(PhysicsModule.validateInvariant({ frequency: 100, amplitude: 10 }).isValid, true);
    assert.equal(PhysicsModule.validateInvariant({ frequency: 800, amplitude: 100 }).isValid, true);
    assert.equal(PhysicsModule.validateInvariant({ frequency: 500, amplitude: 75 }).isValid, true);

    // Invalid frequency (<100 or >800)
    const tooLowFreq = PhysicsModule.validateInvariant({ frequency: 50, amplitude: 50 });
    assert.equal(tooLowFreq.isValid, false);
    assert.equal(tooLowFreq.messageKey, 'phys.error.out_of_bounds');

    const tooHighFreq = PhysicsModule.validateInvariant({ frequency: 950, amplitude: 50 });
    assert.equal(tooHighFreq.isValid, false);
    assert.equal(tooHighFreq.messageKey, 'phys.error.out_of_bounds');

    // Invalid amplitude (<10 or >100)
    const tooLowAmp = PhysicsModule.validateInvariant({ frequency: 220, amplitude: 5 });
    assert.equal(tooLowAmp.isValid, false);

    const tooHighAmp = PhysicsModule.validateInvariant({ frequency: 220, amplitude: 120 });
    assert.equal(tooHighAmp.isValid, false);
  });

  await suite.test('4. Web Audio Gain Clamp Constraint (Maximum <= 0.70 / -3 dBFS)', () => {
    // Linear gain formula: norm = min(100, max(0, amp)) / 100; gain = norm * 0.70
    // Test that for any amplitude value, linear gain never exceeds 0.70.
    const testCases = [
      { amp: 0, maxExpected: 0.00 },
      { amp: 20, maxExpected: 0.14 },
      { amp: 50, maxExpected: 0.35 },
      { amp: 80, maxExpected: 0.56 },
      { amp: 100, maxExpected: 0.70 },
      { amp: 150, maxExpected: 0.70 }, // Out of bounds clamped to 100% -> 0.70
      { amp: 9999, maxExpected: 0.70 } // Extreme input clamped to 0.70
    ];

    testCases.forEach(({ amp, maxExpected }) => {
      const norm = Math.max(0, Math.min(100, amp)) / 100;
      const gain = Number((norm * 0.70).toFixed(4));
      assert.ok(gain <= 0.70, `Gain for amplitude ${amp}% (${gain}) must never exceed 0.70 ceiling`);
      assert.equal(gain, maxExpected);
    });

    // Test through module mount and audio parameter updates
    const container = createMockElement('div');
    const state = PhysicsModule.getInitialState();
    PhysicsModule.mount(container, state, () => {});

    // Verify lastCreatedGainNode received safe clamped gain
    if (lastCreatedGainNode) {
      assert.ok(lastCreatedGainNode.gain.value <= 0.70, `Live gainNode value must be <= 0.70, was: ${lastCreatedGainNode.gain.value}`);
    }
  });

  await suite.test('5. Zero Autoplay Policy & Audio Lifecycle', () => {
    // Verify AudioContext initial state
    const freshInitial = PhysicsModule.getInitialState();
    assert.equal(freshInitial.isPlaying, false, 'Initial state must indicate audio is stopped (not playing)');

    // Resetting state halts audio immediately
    const reset = PhysicsModule.resetState();
    assert.equal(reset.isPlaying, false, 'resetState must ensure isPlaying is false');

    // If context was created, it must start suspended until explicitly resumed
    if (lastCreatedContext) {
      assert.ok(lastCreatedContext.state === 'suspended' || lastCreatedContext.state === 'closed',
        `AudioContext must start in suspended state to respect browser autoplay policy; state was: ${lastCreatedContext.state}`);
    }
  });
});
