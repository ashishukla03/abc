/**
 * Gramin PocketLab — Learning Runner Failure Paths & Invariant Verification Suite
 * File: tests/test_learning_runner_failure_paths.mjs
 * Testing: S3 module-mount fail-closed error recovery, interaction gating across all 4 subjects,
 * and navigation guard enforcement.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { MockElement } from './mock_dom.mjs';
import { store } from '../app/js/store.js';
import { router } from '../app/js/router.js';
import { learningRunner } from '../app/engine/learning_runner.js';
import { MISSIONS } from '../app/content/missions_data.js';

let _currentHash = '#/map';
const _windowListeners = new Map();

function setupEnvironment() {
  const root = new MockElement('HTML');
  const body = new MockElement('BODY', root);
  root.children.push(body);

  const docEl = root;
  const stage = new MockElement('MAIN', body);
  stage.setAttribute('id', 'runner-stage');
  stage.className = 'runner-stage';

  const announcer = new MockElement('DIV', body);
  announcer.setAttribute('id', 'a11y-announcer');

  const subbar = new MockElement('DIV', body);
  subbar.setAttribute('id', 'header-subbar');

  const badge = new MockElement('SPAN', subbar);
  badge.setAttribute('id', 'header-subject-badge');

  const dots = new MockElement('DIV', subbar);
  dots.setAttribute('id', 'header-step-dots');

  const navBack = new MockElement('BUTTON', body);
  navBack.setAttribute('id', 'btn-nav-back');

  const navPrimary = new MockElement('BUTTON', body);
  navPrimary.setAttribute('id', 'btn-nav-primary');

  body.children.push(stage, announcer, subbar, navBack, navPrimary);

  globalThis.document = {
    documentElement: docEl,
    getElementById: (id) => {
      const search = (node) => {
        if (node.id === id) return node;
        for (const c of node.children) {
          const res = search(c);
          if (res) return res;
        }
        return null;
      };
      return search(root);
    },
    querySelector: (sel) => root.querySelector(sel),
    querySelectorAll: (sel) => root.querySelectorAll(sel),
    createElement: (tag) => new MockElement(tag)
  };

  globalThis.requestAnimationFrame = (fn) => fn();

  globalThis.window = {
    location: {
      get hash() { return _currentHash; },
      set hash(val) {
        _currentHash = val;
        const listeners = _windowListeners.get('hashchange') || [];
        listeners.forEach(fn => fn());
      },
      href: 'http://localhost/#/map',
      replace(url) {
        const hashIndex = url.indexOf('#');
        this.hash = hashIndex !== -1 ? url.slice(hashIndex) : '';
      }
    },
    addEventListener(event, fn) {
      if (!_windowListeners.has(event)) {
        _windowListeners.set(event, []);
      }
      _windowListeners.get(event).push(fn);
    },
    removeEventListener(event, fn) {
      if (_windowListeners.has(event)) {
        const list = _windowListeners.get(event).filter(f => f !== fn);
        _windowListeners.set(event, list);
      }
    }
  };

  return { stage, announcer, subbar, badge, dots, navBack, navPrimary };
}

test('Suite 9: Learning Runner Failure Paths & Gate Invariants', async (suite) => {
  const env = setupEnvironment();
  router.init();

  suite.beforeEach(() => {
    store.resetAllProgress();
    env.stage.innerHTML = '';
  });

  await suite.test('1. S3 Module-Mount Fail-Closed Error Path (Advance Disabled on Error)', () => {
    learningRunner.init(env.stage);

    const faultyHandler = {
      id: 'faulty-module',
      subjectId: 'physics',
      getInitialState() { return { crash: true }; },
      validateInvariant() { return { isValid: false }; },
      mount() {
        throw new Error('Simulation WebGL/WebAudio context crash');
      }
    };

    const originalHandler = MISSIONS.physics.interactionHandler;
    MISSIONS.physics.interactionHandler = faultyHandler;

    try {
      store.setSubject('physics');
      store.setStep('s2_predict');
      store.recordPrediction('opt-a');
      store.setStep('s3_explore');

      learningRunner.render();

      const mountContainer = env.stage.querySelector('#interactive-lab-mount');
      assert.ok(mountContainer, 'interactive-lab-mount must be present');
      assert.ok(mountContainer.innerHTML.includes('Experiment Loading Error'), 'Must render error callout UI');
      assert.ok(mountContainer.innerHTML.includes('Simulation WebGL/WebAudio context crash'), 'Must render error detail');
      assert.ok(mountContainer.innerHTML.includes('Retry Initializing Lab'), 'Must provide retry button');

      const btnObserved = env.stage.querySelector('#btn-s3-observed');
      assert.equal(btnObserved.disabled, true, 'Advance button must be disabled on mount error (Fail-Closed)');
    } finally {
      MISSIONS.physics.interactionHandler = originalHandler;
    }
  });

  await suite.test('2. Chemistry Lab Gating: S3 Initial Mount Does Not Allow S4 Advance', () => {
    learningRunner.init(env.stage);

    store.setSubject('chemistry');
    store.setStep('s2_predict');
    store.recordPrediction('opt-b');
    store.setStep('s3_explore');

    learningRunner.render();

    const btnObserved = env.stage.querySelector('#btn-s3-observed');

    // On initial mount before test action, advance button must be disabled
    assert.equal(btnObserved.disabled, true, 'Chemistry advance button must be disabled on initial S3 mount');
    assert.equal(store.getState().progress.chemistry?.interactiveCompleted, false);

    // Attempting to advance via router to S4 must be blocked by router guard
    router.navigate('chemistry', 's4_understand');
    assert.equal(store.getState().currentStep, 's3_explore', 'Router guard must block S4 before S3 interaction');

    // Perform deliberate test in Chemistry lab
    const btnDip = env.stage.querySelector('#btn-chem-dip');
    assert.ok(btnDip, 'Must have Dip Indicator button');
    btnDip.click();

    // Now advance button should become enabled
    assert.equal(btnObserved.disabled, false, 'Advance button must enable after test');
  });

  await suite.test('3. Mathematics Lab Gating: Requires 2,4,6 Allocation to Advance', () => {
    learningRunner.init(env.stage);

    store.setSubject('math');
    store.setStep('s2_predict');
    store.recordPrediction('opt-b');
    store.setStep('s3_explore');

    learningRunner.render();

    const btnObserved = env.stage.querySelector('#btn-s3-observed');
    assert.equal(btnObserved.disabled, true, 'Math advance button must be disabled initially');

    // Set invalid allocation (1, 5, 6 -> sum 12 but wrong ratio)
    const btnIncA = env.stage.querySelector('#btn-inc-a');
    const btnIncB = env.stage.querySelector('#btn-inc-b');
    const btnIncC = env.stage.querySelector('#btn-inc-c');
    const btnCheck = env.stage.querySelector('#btn-check-math');

    if (btnIncA) btnIncA.click(); // Plot A = 1
    if (btnIncB) { for (let i = 0; i < 5; i++) btnIncB.click(); } // Plot B = 5
    if (btnIncC) { for (let i = 0; i < 6; i++) btnIncC.click(); } // Plot C = 6

    if (btnCheck) btnCheck.click();
    assert.equal(btnObserved.disabled, true, 'Advance button must still be disabled when ratio is wrong');

    // Reset and allocate correct ratio 2, 4, 6
    const btnReset = env.stage.querySelector('#math-reset-btn');
    if (btnReset) btnReset.click();

    if (btnIncA) { btnIncA.click(); btnIncA.click(); } // Plot A = 2
    if (btnIncB) { for (let i = 0; i < 4; i++) btnIncB.click(); } // Plot B = 4
    if (btnIncC) { for (let i = 0; i < 6; i++) btnIncC.click(); } // Plot C = 6

    if (btnCheck) btnCheck.click();
    assert.equal(btnObserved.disabled, false, 'Advance button must enable after correct 2,4,6 allocation');
  });

  await suite.test('4. Biology Lab Gating: Requires Scenario Interaction to Advance', () => {
    learningRunner.init(env.stage);

    store.setSubject('biology');
    store.setStep('s2_predict');
    store.recordPrediction('opt-c');
    store.setStep('s3_explore');

    learningRunner.render();

    const btnObserved = env.stage.querySelector('#btn-s3-observed');
    assert.equal(btnObserved.disabled, true, 'Biology advance button must be disabled initially');

    // Click "Remove Snakes" scenario
    env.stage.querySelector('#btn-bio-remove-snakes').click();
    assert.equal(btnObserved.disabled, false, 'Advance button must enable after scenario interaction');
  });

  await suite.test('5. Complete End-to-End S0 to S6 Journey for All 4 Subjects', () => {
    learningRunner.init(env.stage);
    const subjects = ['physics', 'math', 'biology', 'chemistry'];

    for (const sub of subjects) {
      store.resetSubjectProgress(sub);
      store.setSubject(sub);
      store.setStep('s0_map');

      // S0 -> S1
      store.setStep('s1_intro');
      learningRunner.render();
      assert.equal(store.getState().currentStep, 's1_intro');

      // S1 -> S2
      store.setStep('s2_predict');
      learningRunner.render();
      assert.equal(store.getState().currentStep, 's2_predict');

      // S2 prediction choice
      const mission = MISSIONS[sub];
      const optId = mission.predictionQuestion.options[0].id;
      store.recordPrediction(optId);

      // S2 -> S3
      store.setStep('s3_explore');
      learningRunner.render();
      assert.equal(store.getState().currentStep, 's3_explore');

      // Satisfy S3 interaction
      store.setInteractiveCompleted(true);

      // S3 -> S4
      store.setStep('s4_understand');
      learningRunner.render();
      assert.equal(store.getState().currentStep, 's4_understand');

      // S4 -> S5
      store.setStep('s5_feedback_retry');
      learningRunner.render();
      assert.equal(store.getState().currentStep, 's5_feedback_retry');

      // S5 -> S6
      store.setStep('s6_exit_result');
      learningRunner.render();
      assert.equal(store.getState().currentStep, 's6_exit_result');

      const s6Html = env.stage.innerHTML;
      assert.ok(s6Html.includes('Exit Check') || s6Html.includes('Complete') || s6Html.includes('Investigation Summary'), `Subject ${sub} must render S6 summative screen`);
    }
  });
});
