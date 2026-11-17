/**
 * Gramin PocketLab — Truthful Offline Telemetry Test Suite
 * File: tests/test_offline_status.mjs
 * Testing: Truthful distinction between Online Caching, Offline Ready, Offline Mode, and Uncached states.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { updateNetworkStatus } from '../app/js/app.js';

test('Suite 10: Truthful Offline Telemetry Verification', async (suite) => {

  function setupMockDOM() {
    const badge = {
      className: '',
      title: '',
      setAttribute(k, v) { this[k] = v; },
      getAttribute(k) { return this[k]; }
    };

    const text = {
      textContent: ''
    };

    globalThis.document = {
      getElementById(id) {
        if (id === 'network-status-badge') return badge;
        if (id === 'network-status-text') return text;
        return null;
      }
    };

    return { badge, text };
  }

  await suite.test('1. First Visit Online with No Controller Displays "Online (Caching)"', () => {
    const { badge, text } = setupMockDOM();
    updateNetworkStatus({ onLine: true, hasActiveSw: false });

    assert.equal(text.textContent, 'Online (Caching)');
    assert.equal(badge.className, 'status-pill status-pill--caching');
    assert.ok(badge.title.includes('caching in progress'), 'Must explain initial caching in progress');
  });

  await suite.test('2. Online with Active Controller Displays "Offline Ready"', () => {
    const { badge, text } = setupMockDOM();
    updateNetworkStatus({ onLine: true, hasActiveSw: true });

    assert.equal(text.textContent, 'Offline Ready');
    assert.equal(badge.className, 'status-pill status-pill--offline');
    assert.ok(badge.title.includes('Local cache verified'), 'Must confirm cache verified');
  });

  await suite.test('3. Disconnected with Active Controller Displays "Offline Mode"', () => {
    const { badge, text } = setupMockDOM();
    updateNetworkStatus({ onLine: false, hasActiveSw: true });

    assert.equal(text.textContent, 'Offline Mode');
    assert.equal(badge.className, 'status-pill status-pill--offline');
    assert.ok(badge.title.includes('Operating 100% from verified local cache'));
  });

  await suite.test('4. Disconnected with No Controller Displays "Offline (Uncached)" Alert', () => {
    const { badge, text } = setupMockDOM();
    updateNetworkStatus({ onLine: false, hasActiveSw: false });

    assert.equal(text.textContent, 'Offline (Uncached)');
    assert.equal(badge.className, 'status-pill status-pill--alert');
    assert.ok(badge.title.includes('was not pre-cached'));
  });

  await suite.test('5. Invariant: Raw navigator.onLine=true Without Controller Does NOT Report "Offline Ready"', () => {
    const { text } = setupMockDOM();
    updateNetworkStatus({ onLine: true, hasActiveSw: false });

    assert.notEqual(text.textContent, 'Offline Ready', 'Must NEVER promise Offline Ready without active controller');
  });
});
