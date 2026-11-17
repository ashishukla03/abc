/**
 * Gramin PocketLab — Biology Module Verification Suite
 * File: tests/test_biology_module.mjs
 * Testing: Food Web Explorer (Class 7 NCERT Ch 10)
 * Scenarios: Balanced, Remove Snakes, Severe Drought, directional energy flow arrows, and qualitative tendencies.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { BiologyModule } from '../app/modules/biology_stub.js';

test('Suite 7: Biology Module (Food Web Explorer) Verification', async (suite) => {

  await suite.test('1. Initial State Contract & Invariant Gating', () => {
    const initialState = BiologyModule.getInitialState();
    assert.deepEqual(initialState, {
      scenario: 'balanced',
      hasInteracted: false
    });

    const check = BiologyModule.validateInvariant(initialState);
    assert.equal(check.isValid, false, 'Initial state without learner interaction must not be valid');
    assert.ok(check.userFacingMessage.includes('Select an ecological scenario button'));
  });

  await suite.test('2. Validating State After Interaction Satisfies Invariant', () => {
    const interactedState = {
      scenario: 'remove_snakes',
      hasInteracted: true
    };

    const check = BiologyModule.validateInvariant(interactedState);
    assert.equal(check.isValid, true, 'Interacted state must be valid');
    assert.ok(check.userFacingMessage.includes('Ecosystem disturbance observed!'));
  });

  await suite.test('3. Reset State Restores Pristine Un-interacted State', () => {
    const reset = BiologyModule.resetState();
    assert.deepEqual(reset, {
      scenario: 'balanced',
      hasInteracted: false
    });
  });

  await suite.test('4. DOM Mount & Scenario Switching Behavioral Verification', () => {
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

    const elements = new Map();
    const getElem = (id) => {
      if (!elements.has(id)) {
        elements.set(id, createMockElem(id));
      }
      return elements.get(id);
    };

    const mockContainer = {
      innerHTML: '',
      querySelector(selector) {
        const id = selector.replace('#', '').split(' ')[0];
        return getElem(id);
      },
      querySelectorAll() {
        return [];
      }
    };

    let observedState = null;
    BiologyModule.mount(mockContainer, BiologyModule.getInitialState(), (state) => {
      observedState = state;
    });

    // Verify SVG and semantic elements rendered in markup
    assert.ok(mockContainer.innerHTML.includes('Food Web Explorer: Farm Ecosystem'));
    assert.ok(mockContainer.innerHTML.includes('Paddy Crops'));
    assert.ok(mockContainer.innerHTML.includes('Grasshopper'));
    assert.ok(mockContainer.innerHTML.includes('Field Mice'));
    assert.ok(mockContainer.innerHTML.includes('Frogs'));
    assert.ok(mockContainer.innerHTML.includes('Rat Snakes'));

    // Verify directional energy flow statement
    assert.ok(mockContainer.innerHTML.includes('Energy Flow Direction:'));
    assert.ok(mockContainer.innerHTML.includes('organic food energy from the organism consumed to the feeding consumer'));

    // Verify Accessible Table
    assert.ok(mockContainer.innerHTML.includes('Accessible Food Web Relationship Table'));

    // Test Clicking "Remove Snakes" button
    const btnSnakes = getElem('btn-bio-remove-snakes');
    btnSnakes.click();
    assert.ok(observedState !== null);
    assert.equal(observedState.scenario, 'remove_snakes');
    assert.equal(observedState.hasInteracted, true);

    const obsPanel = getElem('bio-observation-panel');
    assert.ok(obsPanel.innerHTML.includes('Simplified Model Tendency (Apex Predator Removed)'));
    assert.ok(obsPanel.innerHTML.includes('frog numbers face reduced predation and tend to surge'));
    assert.ok(obsPanel.innerHTML.includes('causes grasshopper numbers to decline'));

    // Test Clicking "Severe Drought" button
    const btnDrought = getElem('btn-bio-drought');
    btnDrought.click();
    assert.equal(observedState.scenario, 'drought');
    assert.ok(obsPanel.innerHTML.includes('Simplified Model Tendency (Primary Producers Withered)'));
    assert.ok(obsPanel.innerHTML.includes('all herbivore and predator populations face sharp decline'));

    // Test Clicking "Balanced" button
    const btnBalanced = getElem('btn-bio-balanced');
    btnBalanced.click();
    assert.equal(observedState.scenario, 'balanced');
    assert.ok(obsPanel.innerHTML.includes('Observed Status (Balanced Baseline)'));
  });
});

