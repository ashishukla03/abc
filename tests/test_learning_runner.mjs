/**
 * Gramin PocketLab — Learning Runner Test Suite
 * File: tests/test_learning_runner.mjs
 * Tests the 7-step POE cycle execution (S0 through S6) in Node.js test environment.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { MockElement } from './mock_dom.mjs';
import { store, STEP_IDS, SUBJECT_IDS } from '../app/js/store.js';
import { router } from '../app/js/router.js';
import { learningRunner, LearningRunner } from '../app/engine/learning_runner.js';
import { MISSIONS } from '../app/content/missions_data.js';

// Setup minimal browser globals
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
    location: { hash: '' }
  };

  return { stage, announcer, subbar, badge, dots, navBack, navPrimary };
}

test('Suite 4: Learning Runner & 7-Step POE Cycle Execution', async (t) => {
  const env = setupEnvironment();
  store.resetAllProgress();

  await t.test('1. LearningRunner Initialization & S0 Map View', () => {
    learningRunner.init(env.stage);
    assert.equal(store.getState().currentStep, 's0_map', 'Default step should be s0_map');
    
    // Check that stage contains subject cards and map screen
    const html = env.stage.innerHTML;
    assert.ok(html.includes('screen-s0-map'), 'Renders screen-s0-map container');
    assert.ok(html.includes('btn-select-subject'), 'Renders subject selection buttons');
    assert.ok(html.includes('data-subject="physics"'), 'Physics card rendered');
    assert.ok(html.includes('data-subject="math"'), 'Math card rendered');
    assert.ok(html.includes('data-subject="biology"'), 'Biology card rendered');
    assert.ok(html.includes('data-subject="chemistry"'), 'Chemistry card rendered');
  });

  await t.test('2. S1 Mission Brief Screen Rendering', () => {
    store.setSubject('physics');
    store.setStep('s1_intro');
    learningRunner.render();

    const html = env.stage.innerHTML;
    assert.ok(html.includes('screen-s1-brief'), 'Contains screen-s1-brief container');
    assert.ok(html.includes('NCERT Class 8'), 'Contains NCERT Class reference');
    assert.ok(html.includes('callout callout-info'), 'Contains learning objective box');
    assert.ok(html.includes('btn-s1-start'), 'Contains Start Mission CTA');
  });

  await t.test('3. S2 Formative Prediction Screen Rendering & Selection', () => {
    store.setStep('s2_predict');
    learningRunner.render();

    const html = env.stage.innerHTML;
    assert.ok(html.includes('screen-s2-predict'), 'Contains screen-s2-predict container');
    assert.ok(html.includes('name="prediction-option"'), 'Contains radio inputs for hypothesis');
    assert.ok(html.includes('radio-card'), 'Contains accessible radio-card options');

    // Record prediction in store and verify state updates
    store.recordPrediction('opt_pitch_higher');
    assert.equal(store.getState().progress.physics.predictionChoiceId, 'opt_pitch_higher');
  });

  await t.test('4. S3 Micro-Lab Mounting & Interaction Lifecycle', () => {
    store.setStep('s3_explore');
    learningRunner.render();

    assert.ok(learningRunner._activeHandler !== null, 'Subject micro-lab handler should be mounted');
    assert.equal(typeof learningRunner._activeHandler.mount, 'function', 'Handler has mount()');
    assert.equal(typeof learningRunner._activeHandler.unmount, 'function', 'Handler has unmount()');

    // Mark lab completed
    store.setInteractiveCompleted(true);
    assert.equal(store.getState().progress.physics.interactiveCompleted, true, 'Interactive completed marked in store');
  });

  await t.test('5. S4 Concept Understanding Screen Rendering', () => {
    store.setStep('s4_understand');
    learningRunner.render();

    const html = env.stage.innerHTML;
    assert.ok(html.includes('screen-s4-concept'), 'Contains screen-s4-concept container');
    assert.ok(html.includes('callout callout-warning') || html.includes('Notebook Rule Box'), 'Contains notebook rule box');
    assert.ok(html.includes('Frequency') || html.includes('Hertz') || html.includes('Cycles'), 'Contains scientific principle terminology');
  });

  await t.test('6. S5 Feedback & Diagnostic Step Rendering', () => {
    store.setStep('s5_feedback_retry');
    learningRunner.render();

    const html = env.stage.innerHTML;
    assert.ok(html.includes('screen-s5-feedback'), 'Contains screen-s5-feedback container');
    assert.ok(html.includes('name="formative-diagnostic"'), 'Contains diagnostic question container');
  });

  await t.test('7. S6 Exit Check & Summative Scoring', () => {
    store.setStep('s6_exit_result');
    learningRunner.render();

    const html = env.stage.innerHTML;
    assert.ok(html.includes('screen-s6-exit'), 'Contains screen-s6-exit container');
    assert.ok(html.includes('name="exit-q1"'), 'Contains Q1 radio group');
    assert.ok(html.includes('name="exit-q2"'), 'Contains Q2 radio group');

    // Submit summative answers for physics (q0: 1, q1: 1)
    store.recordExitScore(0, 1);
    store.recordExitScore(1, 1);
    const progress = store.getState().progress.physics;
    assert.equal(progress.exitScores[0] + progress.exitScores[1], 2, 'Exit score total is 2/2');
    assert.equal(progress.isCompleted, true, 'Mission marked as completed');
    assert.equal(progress.earnedBadgeId, 'badge_physics_mastery', 'Mastery badge awarded');
  });

  await t.test('8. Runner Cleanup on Destroy', () => {
    learningRunner.destroy();
    assert.equal(learningRunner._unsubscribeStore, null, 'Unsubscribed from store updates');
    assert.equal(learningRunner._activeHandler, null, 'Active lab handler unmounted');
  });
});
