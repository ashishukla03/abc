/**
 * Gramin PocketLab — Chemistry Module Verification Suite
 * File: tests/test_chemistry_module.mjs
 * Testing: pH Color Lab (Class 7 NCERT Ch 5)
 * Requirements: Strict interaction gating, 4 standardized samples, 2 indicators, permanent water potability boundary.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ChemistryModule } from '../app/modules/chemistry_stub.js';

test('Suite 8: Chemistry Module (pH Color Lab) Verification', async (suite) => {

  await suite.test('1. Initial State Contract & Strict Invariant Gating', () => {
    const initialState = ChemistryModule.getInitialState();
    assert.deepEqual(initialState, {
      selectedSample: 'distilled_water',
      selectedIndicator: 'universal',
      hasTested: false
    });

    const check = ChemistryModule.validateInvariant(initialState);
    assert.equal(check.isValid, false, 'Initial state must NOT be valid before learner tests');
    assert.ok(check.userFacingMessage.includes('Select a liquid beaker and test'));
  });

  await suite.test('2. DOM Mount Does NOT Auto-Complete Lab (Fix for Mount Gating Bug)', () => {
    function createMockElem(id = '', data = {}) {
      return {
        id,
        style: {},
        textContent: '',
        innerHTML: '',
        className: '',
        dataset: { ...data },
        listeners: {},
        attributes: {},
        classList: {
          classes: new Set(),
          add(c) { this.classes.add(c); },
          remove(c) { this.classes.delete(c); },
          contains(c) { return this.classes.has(c); }
        },
        addEventListener(event, fn) {
          this.listeners[event] = this.listeners[event] || [];
          this.listeners[event].push(fn);
        },
        click() {
          if (this.listeners.click) {
            this.listeners.click.forEach(fn => fn({ target: this }));
          }
        },
        setAttribute(k, v) { this.attributes[k] = String(v); },
        getAttribute(k) { return this.attributes[k]; }
      };
    }

    const elemMap = new Map();
    const getElem = (id, data = {}) => {
      if (!elemMap.has(id)) {
        elemMap.set(id, createMockElem(id, data));
      }
      return elemMap.get(id);
    };

    const beakers = [
      getElem('btn-lemon', { sample: 'lemon_juice' }),
      getElem('btn-distilled', { sample: 'distilled_water' }),
      getElem('btn-baking', { sample: 'baking_soda' }),
      getElem('btn-soap', { sample: 'laundry_soap' })
    ];

    const mockContainer = {
      innerHTML: '',
      querySelector(selector) {
        const id = selector.replace('#', '').split(' ')[0];
        return getElem(id);
      },
      querySelectorAll(selector) {
        if (selector === '.beaker-btn') return beakers;
        return [];
      }
    };

    let observedState = null;
    // Mount the module
    ChemistryModule.mount(mockContainer, ChemistryModule.getInitialState(), (state) => {
      observedState = state;
    });

    // CRITICAL ASSERTION: Mounting must NOT trigger onStateChange with hasTested = true
    if (observedState !== null) {
      assert.equal(observedState.hasTested, false, 'Mount callback must not report hasTested = true');
    }

    // Check beaker active state matches selectedSample (distilled_water)
    assert.equal(beakers[1].getAttribute('aria-pressed'), 'true', 'Distilled water button must be aria-pressed=true');
    assert.equal(beakers[0].getAttribute('aria-pressed'), 'false', 'Lemon juice button must be aria-pressed=false');
  });

  await suite.test('3. Testing Four Samples with Universal and Turmeric Indicators', () => {
    function createMockElem(id = '', data = {}) {
      return {
        id,
        style: {},
        textContent: '',
        innerHTML: '',
        className: '',
        dataset: { ...data },
        listeners: {},
        attributes: {},
        classList: {
          classes: new Set(),
          add(c) { this.classes.add(c); },
          remove(c) { this.classes.delete(c); },
          contains(c) { return this.classes.has(c); }
        },
        addEventListener(event, fn) {
          this.listeners[event] = this.listeners[event] || [];
          this.listeners[event].push(fn);
        },
        click() {
          if (this.listeners.click) {
            this.listeners.click.forEach(fn => fn({ target: this }));
          }
        },
        setAttribute(k, v) { this.attributes[k] = String(v); },
        getAttribute(k) { return this.attributes[k]; }
      };
    }

    const elemMap = new Map();
    const getElem = (id, data = {}) => {
      if (!elemMap.has(id)) {
        elemMap.set(id, createMockElem(id, data));
      }
      return elemMap.get(id);
    };

    const beakers = [
      getElem('btn-lemon', { sample: 'lemon_juice' }),
      getElem('btn-distilled', { sample: 'distilled_water' }),
      getElem('btn-baking', { sample: 'baking_soda' }),
      getElem('btn-soap', { sample: 'laundry_soap' })
    ];

    const mockContainer = {
      innerHTML: '',
      querySelector(selector) {
        const id = selector.replace('#', '').split(' ')[0];
        return getElem(id);
      },
      querySelectorAll(selector) {
        if (selector === '.beaker-btn') return beakers;
        return [];
      }
    };

    let latestState = null;
    ChemistryModule.mount(mockContainer, ChemistryModule.getInitialState(), (state) => {
      latestState = state;
    });

    // 1. Click "Dip Indicator Strip" button for Distilled Water + Universal
    const btnDip = getElem('btn-chem-dip');
    btnDip.click();
    assert.ok(latestState !== null);
    assert.equal(latestState.hasTested, true);
    assert.equal(latestState.selectedSample, 'distilled_water');

    const phReadout = getElem('chem-ph-readout');
    assert.ok(phReadout.textContent.includes('7.0'), 'Distilled water pH must be 7.0');

    const strip = getElem('indicator-strip');
    assert.equal(strip.style.background, '#34A853', 'Universal indicator for neutral pH 7 must be green (#34A853)');

    // 2. Select Turmeric Indicator
    const btnTurmeric = getElem('btn-ind-turmeric');
    btnTurmeric.click();
    assert.equal(latestState.selectedIndicator, 'turmeric');
    assert.equal(strip.style.background, '#F4B400', 'Turmeric in neutral solution must remain yellow (#F4B400)');

    // 3. Select Lemon Juice (Acidic)
    beakers[0].click(); // lemon_juice
    assert.equal(latestState.selectedSample, 'lemon_juice');
    assert.ok(phReadout.textContent.includes('2.2'), 'Lemon juice illustrative pH must be 2.2');
    assert.equal(strip.style.background, '#F4B400', 'Turmeric in acid must remain yellow (#F4B400)');

    // Switch back to Universal for Lemon Juice
    const btnUni = getElem('btn-ind-universal');
    btnUni.click();
    assert.equal(strip.style.background, '#D9381E', 'Universal in acid pH 2.2 must be red/orange (#D9381E)');

    // 4. Select Baking Soda (Alkaline pH 8.5)
    beakers[2].click(); // baking_soda
    assert.ok(phReadout.textContent.includes('8.5'), 'Baking soda illustrative pH must be 8.5');
    assert.equal(strip.style.background, '#4285F4', 'Universal in pH 8.5 must be blue (#4285F4)');

    btnTurmeric.click();
    assert.equal(strip.style.background, '#8B2500', 'Turmeric in alkaline pH 8.5 must turn reddish-brown (#8B2500)');

    // 5. Select Laundry Soap (Stronger Alkaline pH 10.0)
    beakers[3].click(); // laundry_soap
    assert.ok(phReadout.textContent.includes('10.0'), 'Soap solution illustrative pH must be 10.0');
    assert.equal(strip.style.background, '#5C1D06', 'Turmeric in pH 10.0 must turn deep reddish-brown (#5C1D06)');

    btnUni.click();
    assert.equal(strip.style.background, '#673AB7', 'Universal in pH 10.0 must be purple/violet (#673AB7)');
  });

  await suite.test('4. Mandatory Water Potability & Safety Boundary Text is Preserved', () => {
    const chemCode = fs.readFileSync(path.resolve('./app/modules/chemistry_stub.js'), 'utf-8');

    // Assert exact mandatory water testing disclaimer components
    assert.ok(chemCode.includes('Mandatory Safety Boundary:'), 'Must include safety boundary header');
    assert.ok(chemCode.includes('A pH test measures hydrogen ion activity'), 'Must explain pH definition');
    assert.ok(chemCode.includes('pathogens (bacteria, viruses, or protozoa) or toxic dissolved chemicals'), 'Must explain pathogen non-detection');
    assert.ok(chemCode.includes('A neutral reading of pH 7.0 does NOT establish water potability or biological drinking safety.'), 'Must state pH 7 does NOT establish potability');

    // Strict prohibition of word "cysts"
    assert.ok(!chemCode.toLowerCase().includes('cyst'), 'Word "cysts" must NOT be present in Chemistry module');
  });

  await suite.test('5. Reset Behavior Restores Untested State and Disables Advance', () => {
    function createMockElem(id = '', data = {}) {
      return {
        id,
        style: {},
        textContent: '',
        innerHTML: '',
        className: '',
        dataset: { ...data },
        listeners: {},
        attributes: {},
        classList: { classes: new Set(), add() {}, remove() {}, contains() {} },
        addEventListener(event, fn) {
          this.listeners[event] = this.listeners[event] || [];
          this.listeners[event].push(fn);
        },
        click() {
          if (this.listeners.click) {
            this.listeners.click.forEach(fn => fn({ target: this }));
          }
        },
        setAttribute(k, v) { this.attributes[k] = String(v); },
        getAttribute(k) { return this.attributes[k]; }
      };
    }

    const elemMap = new Map();
    const getElem = (id, data = {}) => {
      if (!elemMap.has(id)) {
        elemMap.set(id, createMockElem(id, data));
      }
      return elemMap.get(id);
    };

    const mockContainer = {
      innerHTML: '',
      querySelector(selector) {
        const id = selector.replace('#', '').split(' ')[0];
        return getElem(id);
      },
      querySelectorAll() { return []; }
    };

    let latestState = null;
    ChemistryModule.mount(mockContainer, ChemistryModule.getInitialState(), (state) => {
      latestState = state;
    });

    // Perform test first
    getElem('btn-chem-dip').click();
    assert.equal(latestState.hasTested, true);
    assert.equal(ChemistryModule.validateInvariant(latestState).isValid, true);

    // Now reset
    getElem('chem-reset-btn').click();
    assert.equal(latestState.hasTested, false, 'Reset must restore hasTested = false');
    assert.equal(ChemistryModule.validateInvariant(latestState).isValid, false, 'Invariant must be invalid after reset');
  });
});
