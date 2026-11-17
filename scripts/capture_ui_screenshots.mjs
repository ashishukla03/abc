/**
 * Visual Evidence Capture Script
 * Launches headless Chrome via CDP, navigates to each view, and captures full-page PNG screenshots.
 */
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.join(ROOT_DIR, 'audit', 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

class CDPClient {
  constructor(wsEndpoint) {
    this.wsEndpoint = wsEndpoint;
    this.ws = null;
    this.msgId = 1;
    this.pending = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsEndpoint);
    return new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.pending.has(msg.id)) {
          const { resolve, reject } = this.pending.get(msg.id);
          this.pending.delete(msg.id);
          if (msg.error) reject(new Error(msg.error.message));
          else resolve(msg.result);
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

  async evaluate(expression) {
    const wrapped = `(() => { ${expression} })()`;
    const res = await this.send('Runtime.evaluate', {
      expression: wrapped,
      awaitPromise: true,
      returnByValue: true
    });
    return res.result?.value;
  }

  async captureScreenshot(outputPath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    fs.writeFileSync(outputPath, Buffer.from(res.data, 'base64'));
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

function findChromePath() {
  const possiblePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe')
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return 'chrome';
}

async function main() {
  console.log('Capturing UI Evidence Screenshots...');
  const chromePath = findChromePath();
  const cdpPort = 9223;
  const userDataDir = path.join(ROOT_DIR, 'cdp_screenshot_profile');

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1280,900'
  ], { stdio: 'ignore' });

  // Wait for Chrome to spin up
  await new Promise(r => setTimeout(r, 1500));

  try {
    const targets = await fetchJson(`http://127.0.0.1:${cdpPort}/json`);
    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('DOM.enable');

    // 1. Question Worlds (Map)
    console.log('1. Navigating to Question Worlds...');
    await client.send('Page.navigate', { url: 'http://127.0.0.1:8000/#/map' });
    await new Promise(r => setTimeout(r, 1200));
    await client.captureScreenshot(path.join(SCREENSHOTS_DIR, '01_question_worlds_map.png'));

    // 2. Courses Tab
    console.log('2. Navigating to Courses Tab...');
    await client.evaluate(`document.querySelector('#tab-btn-browser')?.click()`);
    await new Promise(r => setTimeout(r, 1000));
    await client.captureScreenshot(path.join(SCREENSHOTS_DIR, '02_courses_tab.png'));

    // 3. School Hub Tab
    console.log('3. Navigating to School Hub Tab...');
    await client.evaluate(`document.querySelector('#tab-btn-hub')?.click()`);
    await new Promise(r => setTimeout(r, 1000));
    await client.captureScreenshot(path.join(SCREENSHOTS_DIR, '03_school_hub_tab.png'));

    // 4. Mock Exams Tab
    console.log('4. Navigating to Mock Exams Tab...');
    await client.evaluate(`document.querySelector('#tab-btn-mock')?.click()`);
    await new Promise(r => setTimeout(r, 1000));
    await client.captureScreenshot(path.join(SCREENSHOTS_DIR, '04_mock_exams_tab.png'));

    // 5. AI Tutor Tab
    console.log('5. Navigating to AI Tutor Tab...');
    await client.evaluate(`document.querySelector('#tab-btn-tutor')?.click()`);
    await new Promise(r => setTimeout(r, 1000));
    await client.captureScreenshot(path.join(SCREENSHOTS_DIR, '05_ai_tutor_tab.png'));

    // 6. Learner Model Tab
    console.log('6. Navigating to Learner Model Tab...');
    await client.evaluate(`document.querySelector('#tab-btn-profile')?.click()`);
    await new Promise(r => setTimeout(r, 1000));
    await client.captureScreenshot(path.join(SCREENSHOTS_DIR, '06_learner_model_tab.png'));

    client.close();
    console.log('Screenshots captured successfully into audit/screenshots/');
  } finally {
    chromeProc.kill('SIGKILL');
    try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch {}
  }
}

main().catch(err => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
