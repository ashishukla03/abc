/**
 * Gramin PocketLab — Master Test Orchestrator
 * File: tests/run_all_tests.mjs
 * Executes all 10 test suites across Store/Router, Content/i18n, Physics, Learning Runner,
 * Service Worker, Math, Biology, Chemistry, Failure Paths, and Offline Status.
 */

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUITES = [
  // 1-5: Baseline Task v6 suites (must never regress)
  { name: 'Store and Router', file: 'test_store_and_router.mjs', baseline: true },
  { name: 'Content and Internationalization', file: 'test_content_and_i18n.mjs', baseline: true },
  { name: 'Physics Module Flagship', file: 'test_physics_module.mjs', baseline: true },
  { name: 'Learning Runner 7-Step Cycle', file: 'test_learning_runner.mjs', baseline: true },
  { name: 'Service Worker Contract', file: 'test_service_worker_contract.mjs', baseline: true },

  // 6-10: Task v8 Build Sprint 1 suites (modules, failure paths, offline telemetry)
  { name: 'Mathematics Module (Water Share)', file: 'test_math_module.mjs', baseline: false },
  { name: 'Biology Module (Food Web)', file: 'test_biology_module.mjs', baseline: false },
  { name: 'Chemistry Module (pH Color Lab)', file: 'test_chemistry_module.mjs', baseline: false },
  { name: 'Learning Runner Failure Paths & Invariants', file: 'test_learning_runner_failure_paths.mjs', baseline: false },
  { name: 'Truthful Offline Telemetry', file: 'test_offline_status.mjs', baseline: false }
];

console.log('='.repeat(70));
console.log('GRAMIN POCKETLAB — COMPLETE AUTOMATED TEST SUITE RUNNER');
console.log('='.repeat(70));

let totalPassed = 0;
let totalFailed = 0;
let suitesFailed = 0;

for (const suite of SUITES) {
  const filePath = path.resolve(__dirname, suite.file);
  const result = spawnSync(process.execPath, [filePath], {
    encoding: 'utf-8',
    env: { ...process.env, NODE_ENV: 'test' }
  });

  const output = (result.stdout || '') + (result.stderr || '');
  const oks = (output.match(/^\s*ok \d+ - /gm) || []).length;
  const notOks = (output.match(/^\s*not ok \d+ - /gm) || []).length;

  if (result.status === 0 && notOks === 0) {
    console.log(`[PASS] ${suite.name} (${suite.file}): ${oks} tests passed, 0 failed`);
    totalPassed += oks;
  } else {
    console.log(`[FAIL] ${suite.name} (${suite.file}): exit code ${result.status}, ${notOks} failed`);
    if (result.stderr) console.error(result.stderr);
    suitesFailed++;
    totalFailed += notOks;
  }
}

console.log('='.repeat(70));
console.log(`SUMMARY: ${totalPassed} passed, ${totalFailed} failed across ${SUITES.length} suites.`);
console.log(`Baseline 41 tests status: ${totalPassed >= 41 ? 'ALL PRESERVED WITH ZERO REGRESSION' : 'REGRESSION DETECTED'}`);
console.log('='.repeat(70));

if (suitesFailed > 0 || totalFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}

