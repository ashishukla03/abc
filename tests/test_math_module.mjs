/**
 * Gramin PocketLab — Mathematics Module Verification Suite
 * File: tests/test_math_module.mjs
 * Testing: Ratio invariants (1:2:3), sum invariant (12), negative input protection, steppers, and reset.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { MathModule } from '../app/modules/math_stub.js';

test('Suite 6: Mathematics Module (Water Share Challenge) Verification', async (suite) => {

  await suite.test('1. Initial State Contract & Invariants', () => {
    const initialState = MathModule.getInitialState();
    assert.equal(initialState.targetTotal, 12);
    assert.equal(initialState.plotA, 0);
    assert.equal(initialState.plotB, 0);
    assert.equal(initialState.plotC, 0);
    assert.equal(initialState.isAllocated, false);

    const initialCheck = MathModule.validateInvariant(initialState);
    assert.equal(initialCheck.isValid, false, 'Initial state (0,0,0) must not be valid');
    assert.equal(initialCheck.difference, 12);
  });

  await suite.test('2. Valid Allocation (2, 4, 6) Validates Ratio and Sum', () => {
    const validState = {
      targetTotal: 12,
      plotA: 2,
      plotB: 4,
      plotC: 6,
      isAllocated: false
    };

    const result = MathModule.validateInvariant(validState);
    assert.equal(result.isValid, true, 'Allocation (2, 4, 6) must be valid');
    assert.ok(result.userFacingMessage.includes('Perfect!'), 'Must include success confirmation');
    assert.ok(result.userFacingMessage.includes('Plot B (4 units) is double Plot A (2 units)'));
    assert.ok(result.userFacingMessage.includes('Plot C (6 units) is triple Plot A (2 units)'));
  });

  await suite.test('3. Total-Correct but Ratio-Wrong Allocations Must Fail', () => {
    const testCases = [
      { a: 1, b: 5, c: 6, label: '1, 5, 6 (Sum 12, wrong ratio)' },
      { a: 3, b: 3, c: 6, label: '3, 3, 6 (Sum 12, wrong ratio)' },
      { a: 4, b: 4, c: 4, label: '4, 4, 4 (Equal division, wrong ratio)' },
      { a: 1, b: 2, c: 9, label: '1, 2, 9 (Sum 12, wrong ratio)' },
      { a: 0, b: 6, c: 6, label: '0, 6, 6 (Sum 12, Plot A zero)' }
    ];

    testCases.forEach(({ a, b, c, label }) => {
      const state = { targetTotal: 12, plotA: a, plotB: b, plotC: c };
      const res = MathModule.validateInvariant(state);
      assert.equal(res.isValid, false, `Failed test case: ${label}`);
      assert.ok(res.userFacingMessage.includes('ratio is not 1 : 2 : 3'), `Error message for ${label} must explain ratio mismatch`);
    });
  });

  await suite.test('4. Under-Allocation and Over-Allocation Sum Invariants', () => {
    // Under-allocation (sum < 12)
    const underState = { targetTotal: 12, plotA: 1, plotB: 2, plotC: 3 }; // sum = 6
    const underRes = MathModule.validateInvariant(underState);
    assert.equal(underRes.isValid, false);
    assert.equal(underRes.difference, 6);
    assert.ok(underRes.userFacingMessage.includes('Total allocated is 6 / 12'));

    // Over-allocation (sum > 12)
    const overState = { targetTotal: 12, plotA: 3, plotB: 6, plotC: 9 }; // sum = 18
    const overRes = MathModule.validateInvariant(overState);
    assert.equal(overRes.isValid, false);
    assert.equal(overRes.difference, -6);
    assert.ok(overRes.userFacingMessage.includes('Total allocated is 18 / 12'));
  });

  await suite.test('5. Negative Input & Non-Finite Protection', () => {
    const negativeCases = [
      { a: -2, b: 4, c: 10, label: 'Negative Plot A' },
      { a: 2, b: -4, c: 14, label: 'Negative Plot B' },
      { a: 2, b: 4, c: -6, label: 'Negative Plot C' },
      { a: NaN, b: 4, c: 6, label: 'NaN input' },
      { a: Infinity, b: 4, c: 6, label: 'Infinity input' }
    ];

    negativeCases.forEach(({ a, b, c, label }) => {
      const state = { targetTotal: 12, plotA: a, plotB: b, plotC: c };
      const res = MathModule.validateInvariant(state);
      assert.equal(res.isValid, false, `Negative/Invalid input must be rejected: ${label}`);
      assert.ok(res.userFacingMessage.includes('non-negative'), `Must report non-negative requirement for ${label}`);
    });
  });

  await suite.test('6. Reset State Restores Initial State', () => {
    const reset = MathModule.resetState();
    assert.deepEqual(reset, {
      targetTotal: 12,
      plotA: 0,
      plotB: 0,
      plotC: 0,
      isAllocated: false
    });
  });

  await suite.test('7. DOM Mount and Interactive Stepper Invariants', () => {
    const elementStore = new Map();
    function createMockElem(id = '') {
      return {
        id,
        style: {},
        textContent: '',
        className: '',
        innerHTML: '',
        listeners: {},
        addEventListener(event, fn) {
          this.listeners[event] = this.listeners[event] || [];
          this.listeners[event].push(fn);
        },
        click() {
          if (this.listeners.click) {
            this.listeners.click.forEach(fn => fn({ target: this }));
          }
        },
        setAttribute(k, v) { this[k] = v; },
        getAttribute(k) { return this[k]; }
      };
    }

    const mockContainer = {
      innerHTML: '',
      elements: {},
      querySelector(selector) {
        const id = selector.replace('#', '');
        if (!this.elements[id]) {
          this.elements[id] = createMockElem(id);
        }
        return this.elements[id];
      },
      querySelectorAll() { return []; }
    };

    let observedState = null;
    MathModule.mount(mockContainer, MathModule.getInitialState(), (state) => {
      observedState = state;
    });

    assert.ok(mockContainer.innerHTML.includes('Water Share Challenge'));
    assert.ok(mockContainer.innerHTML.includes('Plot A'));
    assert.ok(mockContainer.innerHTML.includes('Plot B'));
    assert.ok(mockContainer.innerHTML.includes('Plot C'));

    // Test clicking Stepper Increase for Plot A
    const btnIncA = mockContainer.querySelector('#btn-inc-a');
    btnIncA.click();
    assert.equal(observedState.plotA, 1, 'Plot A should increase to 1');
  });
});

