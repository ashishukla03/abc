/**
 * Gramin PocketLab — Real Browser & Offline Verification Runner via Chrome DevTools Protocol (CDP)
 * File: tests/run_real_browser_validation.mjs
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const CDP_PROFILE_DIR = path.resolve(ROOT_DIR, 'cdp_browser_profile');
const BASE_URL = 'http://localhost:8000/';

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.msgId = 1;
    this.pending = new Map();
    this.eventListeners = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.pending.has(msg.id)) {
          const { resolve, reject } = this.pending.get(msg.id);
          this.pending.delete(msg.id);
          if (msg.error) reject(new Error(msg.error.message));
          else resolve(msg.result);
        } else if (msg.method) {
          const listeners = this.eventListeners.get(msg.method) || [];
          for (const fn of listeners) fn(msg.params);
        }
      };
    });
  }

  send(method, params = {}) {
    const id = this.msgId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  on(method, fn) {
    if (!this.eventListeners.has(method)) {
      this.eventListeners.set(method, []);
    }
    this.eventListeners.get(method).push(fn);
  }

  async evaluate(expression, awaitPromise = true) {
    const wrapped = `(() => { ${expression} })()`;
    const res = await this.send('Runtime.evaluate', {
      expression: wrapped,
      awaitPromise,
      returnByValue: true
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.exception?.description || res.exceptionDetails.text);
    }
    return res.result?.value;
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('=== Gramin PocketLab Real-Browser & Offline Validation ===\n');

  const results = {
    browserValidation: {},
    offlineVerification: {},
    consoleErrors: []
  };

  if (!fs.existsSync(CDP_PROFILE_DIR)) fs.mkdirSync(CDP_PROFILE_DIR, { recursive: true });

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--no-sandbox',
    '--autoplay-policy=no-user-gesture-required',
    '--remote-debugging-port=9222',
    '--remote-debugging-address=127.0.0.1',
    `--user-data-dir=${CDP_PROFILE_DIR}`,
    BASE_URL
  ], { stdio: 'ignore' });

  await new Promise(r => setTimeout(r, 2000));

  let client = null;
  try {
    const targets = await fetchJson('http://127.0.0.1:9222/json/list');
    const pageTarget = targets.find(t => t.type === 'page');
    if (!pageTarget) throw new Error('No page target found in Chrome');

    client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('Network.enable');

    client.on('Runtime.consoleAPICalled', (params) => {
      const text = params.args.map(a => a.value || a.description || '').join(' ');
      if (params.type === 'error') {
        results.consoleErrors.push(`[Console Error] ${text}`);
      }
    });

    client.on('Runtime.exceptionThrown', (params) => {
      results.consoleErrors.push(`[Uncaught Exception] ${params.exceptionDetails?.text || ''}`);
    });

    // 1. Initial Load and Console Check
    console.log('1. Checking Initial Application Load & Console Errors...');
    await client.send('Page.navigate', { url: BASE_URL });
    await new Promise(r => setTimeout(r, 1500));

    const pageTitle = await client.evaluate('return document.title;');
    const hasConsoleErrors = results.consoleErrors.length > 0;
    results.browserValidation.initialLoad = {
      status: pageTitle.includes('Gramin PocketLab') && !hasConsoleErrors ? 'PASS' : 'FAIL',
      title: pageTitle,
      consoleErrorsCount: results.consoleErrors.length
    };
    console.log(`   Title: "${pageTitle}" | Console Errors: ${results.consoleErrors.length}`);

    // 2. Mission Map Viewport & Navigation
    console.log('2. Checking Mission Map & Navigation to Physics...');
    const cardsCount = await client.evaluate('return document.querySelectorAll(".mission-card").length;');
    const physicsCardExists = await client.evaluate('return Boolean(document.querySelector(".mission-card[data-subject=\\"physics\\"]"));');
    
    await client.evaluate(`
      const btn = document.querySelector(".mission-card[data-subject=\\"physics\\"] .btn-select-subject");
      if (btn) btn.click();
      return true;
    `);
    await new Promise(r => setTimeout(r, 500));
    const currentHashAfterClick = await client.evaluate('return window.location.hash;');
    results.browserValidation.mapNavigation = {
      status: cardsCount === 4 && physicsCardExists && currentHashAfterClick.includes('physics/s1_intro') ? 'PASS' : 'FAIL',
      cardsRendered: cardsCount,
      targetHash: currentHashAfterClick
    };
    console.log(`   Cards: ${cardsCount} | Navigated to: ${currentHashAfterClick}`);

    // 3. S1 -> S2 -> S3 Physics Learning Journey
    console.log('3. Navigating Physics S1 Brief -> S2 Prediction -> S3 Micro-Lab...');
    await client.evaluate(`
      const btnStart = document.getElementById("btn-s1-start") || document.getElementById("btn-nav-primary");
      if (btnStart) btnStart.click();
      return true;
    `);
    await new Promise(r => setTimeout(r, 500));
    const hashS2 = await client.evaluate('return window.location.hash;');

    // Select prediction option "opt-a" on S2 and enter lab
    await client.evaluate(`
      const radio = document.querySelector("input[value=\\"opt-a\\"]");
      if (radio) {
        radio.click();
        radio.dispatchEvent(new Event("change", { bubbles: true }));
      }
      const btnEnter = document.getElementById("btn-s2-enter-lab") || document.getElementById("btn-nav-primary");
      if (btnEnter) btnEnter.click();
      return true;
    `);
    await new Promise(r => setTimeout(r, 800));
    const hashS3 = await client.evaluate('return window.location.hash;');
    const canvasExists = await client.evaluate('return Boolean(document.querySelector("#phys-oscilloscope-canvas"));');
    results.browserValidation.journeyS1toS3 = {
      status: hashS2.includes('physics/s2_predict') && hashS3.includes('physics/s3_explore') && canvasExists ? 'PASS' : 'FAIL',
      hashS2,
      hashS3,
      canvasRendered: canvasExists
    };
    console.log(`   Hash: ${hashS3} | Canvas Mounted: ${canvasExists}`);

    // 4. Physics Audio Controls, Zero Autoplay & Gain Clamp
    console.log('4. Testing Physics Audio Engine & Controls...');
    // Click Play Tone 220Hz
    await client.evaluate(`
      const p220 = document.querySelector("#phys-preset-220");
      if (p220) p220.click();
      return true;
    `);
    await new Promise(r => setTimeout(r, 500));
    const isPlaying220 = await client.evaluate(`
      const badge = document.querySelector("#phys-state-badge");
      return badge ? badge.textContent.includes("Playing") : false;
    `);

    // Click Tone 440Hz
    await client.evaluate(`
      const p440 = document.querySelector("#phys-preset-440");
      if (p440) p440.click();
      return true;
    `);
    await new Promise(r => setTimeout(r, 500));
    const cyclesText = await client.evaluate(`
      const badge = document.querySelector("#phys-cycles-badge");
      return badge ? badge.textContent : "";
    `);

    // Click Stop Tone
    await client.evaluate(`
      const btnStop = document.querySelector("#phys-stop-btn");
      if (btnStop) btnStop.click();
      return true;
    `);
    await new Promise(r => setTimeout(r, 300));
    const isStopped = await client.evaluate(`
      const badge = document.querySelector("#phys-state-badge");
      return badge ? badge.textContent.includes("Stopped") : false;
    `);

    results.browserValidation.audioEngine = {
      status: isPlaying220 && cyclesText.includes('4.4') && isStopped ? 'PASS' : 'FAIL',
      tone220Started: isPlaying220,
      tone440Cycles: cyclesText,
      stoppedCorrectly: isStopped
    };
    console.log(`   Play 220Hz: ${isPlaying220} | 440Hz Cycles: "${cyclesText}" | Stopped: ${isStopped}`);

    // 5. Complete Lab S3 -> S4 -> S5 -> S6
    console.log('5. Completing S3 Lab -> S4 Concept -> S5 Diagnostic -> S6 Exit...');
    await client.evaluate(`
      const btnObs = document.querySelector("#btn-s3-observed") || document.getElementById("btn-nav-primary");
      if (btnObs) btnObs.click();
      return true;
    `);
    await new Promise(r => setTimeout(r, 500));

    // On S4 Concept
    await client.evaluate(`
      const btnNext = document.querySelector("#btn-s4-check") || document.getElementById("btn-nav-primary");
      if (btnNext) btnNext.click();
      return true;
    `);
    await new Promise(r => setTimeout(r, 500));

    // On S5 Diagnostic: select correct answer "opt-b" & submit
    await client.evaluate(`
      const diagOpt = document.querySelector("input[name=\\"formative-diagnostic\\"][value=\\"opt-b\\"]");
      if (diagOpt) {
        diagOpt.click();
        diagOpt.dispatchEvent(new Event("change", { bubbles: true }));
      }
      const btnDiagSubmit = document.querySelector("#btn-submit-diag");
      if (btnDiagSubmit) btnDiagSubmit.click();
      return true;
    `);
    await new Promise(r => setTimeout(r, 500));

    // Proceed to S6
    await client.evaluate(`
      const btnProc = document.querySelector("#btn-s5-proceed") || document.getElementById("btn-nav-primary");
      if (btnProc) btnProc.click();
      return true;
    `);
    await new Promise(r => setTimeout(r, 500));

    // On S6 Exit Check: answer Q1 and Q2, submit
    await client.evaluate(`
      const q1 = document.querySelector("input[name=\\"exit-q1\\"][value=\\"opt-a\\"]");
      if (q1) { q1.click(); q1.dispatchEvent(new Event("change", { bubbles: true })); }
      const q2 = document.querySelector("input[name=\\"exit-q2\\"][value=\\"opt-b\\"]");
      if (q2) { q2.click(); q2.dispatchEvent(new Event("change", { bubbles: true })); }
      const btnExit = document.querySelector("#btn-submit-exit");
      if (btnExit) btnExit.click();
      return true;
    `);
    await new Promise(r => setTimeout(r, 800));

    const isCompletedInStorage = await client.evaluate(`
      const raw = localStorage.getItem("pocketlab_progress");
      if (!raw) return false;
      const data = JSON.parse(raw);
      return Boolean(data.progress?.physics?.isCompleted && data.progress?.physics?.earnedBadgeId);
    `);

    results.browserValidation.endToEndJourney = {
      status: isCompletedInStorage ? 'PASS' : 'FAIL',
      scoreRecordedInStorage: isCompletedInStorage
    };
    console.log(`   Badge & Completion Saved to LocalStorage: ${isCompletedInStorage}`);

    // 6. Refresh Persistence
    console.log('6. Testing Refresh Persistence...');
    await client.send('Page.reload');
    await new Promise(r => setTimeout(r, 1500));

    const preservedStorage = await client.evaluate(`
      const raw = localStorage.getItem("pocketlab_progress");
      if (!raw) return false;
      const data = JSON.parse(raw);
      return data.progress?.physics?.isCompleted === true;
    `);
    results.browserValidation.refreshPersistence = {
      status: preservedStorage ? 'PASS' : 'FAIL',
      dataPreservedAfterReload: preservedStorage
    };
    console.log(`   State Preserved After Page Reload: ${preservedStorage}`);

    // 7. Mobile Viewport Layout Usability (360x640)
    console.log('7. Testing Mobile Viewport Usability (360x640)...');
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 360,
      height: 640,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 500));

    const viewportCheck = await client.evaluate(`
      return {
        bodyScrollWidth: document.body.scrollWidth,
        documentElementScrollWidth: document.documentElement.scrollWidth,
        hasHorizontalOverflow: document.documentElement.scrollWidth > 360
      };
    `);
    results.browserValidation.mobileViewport = {
      status: !viewportCheck.hasHorizontalOverflow ? 'PASS' : 'FAIL',
      details: viewportCheck
    };
    console.log(`   Horizontal Overflow (>360px): ${viewportCheck.hasHorizontalOverflow} (scrollWidth: ${viewportCheck.documentElementScrollWidth})`);

    // 8. Service Worker Installation & Offline Cache Verification
    console.log('8. Testing Service Worker & Offline Caching...');
    const swRegistered = await client.evaluate(`
      return Boolean(navigator.serviceWorker && navigator.serviceWorker.controller);
    `);
    const cachedAssetCount = await client.evaluate(`
      return (async () => {
        if (!window.caches) return 0;
        const cache = await caches.open('pocketlab-v2');
        const keys = await cache.keys();
        return keys.length;
      })();
    `);
    console.log(`   ServiceWorker Controller Active: ${swRegistered} | Cached Assets in Cache: ${cachedAssetCount}`);

    // Emulate completely offline network
    console.log('   Emulating Offline Network Mode in Chrome...');
    await client.send('Network.emulateNetworkConditions', {
      offline: true,
      latency: 0,
      downloadThroughput: 0,
      uploadThroughput: 0
    });

    // Reload page while completely offline
    await client.send('Page.reload');
    await new Promise(r => setTimeout(r, 1500));

    const offlineRenderedTitle = await client.evaluate('return document.title;');
    const offlineStageRendered = await client.evaluate(`
      return Boolean(document.querySelector("#runner-stage") && document.querySelector(".app-header"));
    `);
    results.offlineVerification = {
      status: offlineRenderedTitle.includes('Gramin PocketLab') && offlineStageRendered ? 'PASS' : 'FAIL',
      swRegistered,
      cachedAssetCount,
      offlineReloadSuccess: offlineStageRendered
    };
    console.log(`   Reloaded While Offline: ${offlineStageRendered} (Title: "${offlineRenderedTitle}")`);

  } catch (err) {
    console.error('Test Execution Error:', err);
  } finally {
    if (client) client.close();
    chromeProc.kill();
    try { fs.rmSync(CDP_PROFILE_DIR, { recursive: true, force: true }); } catch (_) {}
  }

  const reportPath = path.resolve(ROOT_DIR, 'audit/BROWSER_VERIFICATION_EVIDENCE.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`\nDetailed verification results written to: ${reportPath}`);
}

run();
