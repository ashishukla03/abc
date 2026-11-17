/**
 * Gramin PocketLab — Capture Genuine Application Screenshots for OpenMotion
 * File: scripts/capture_real_app_screenshots.mjs
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const APP_DIR = path.resolve(ROOT_DIR, 'app');
const ASSETS_OUT = path.resolve(ROOT_DIR, 'openmotion/assets');
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const CDP_PROFILE_DIR = path.resolve(ROOT_DIR, 'cdp_capture_profile');
const BASE_URL = 'http://127.0.0.1:8001/';

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webmanifest': 'application/manifest+json; charset=utf-8'
};

function startServer(dir, port = 8001) {
  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
    const filePath = path.join(dir, reqPath);
    if (!filePath.startsWith(dir)) {
      res.writeHead(403);
      return res.end('Forbidden');
    }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        return res.end('Not Found');
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      res.end(data);
    });
  });
  return new Promise((resolve, reject) => {
    server.listen(port, '127.0.0.1', () => resolve(server));
    server.on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.msgId = 1;
    this.pending = new Map();
  }
  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
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
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function capture() {
  fs.mkdirSync(ASSETS_OUT, { recursive: true });
  fs.mkdirSync(CDP_PROFILE_DIR, { recursive: true });

  console.log('Starting screenshot server on port 8001...');
  const server = await startServer(APP_DIR, 8001);

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--remote-debugging-port=9223',
    '--remote-debugging-address=127.0.0.1',
    `--user-data-dir=${CDP_PROFILE_DIR}`,
    '--window-size=1920,1080',
    BASE_URL
  ], { stdio: 'ignore' });

  await new Promise(r => setTimeout(r, 2000));
  let client = null;

  try {
    const targets = await fetchJson('http://127.0.0.1:9223/json/list');
    const pageTarget = targets.find(t => t.type === 'page');
    if (!pageTarget) throw new Error('No page target found');

    client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();
    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false
    });

    const routes = [
      { name: 'screenshot_01_map.png', hash: '#/map', subject: null },
      { name: 'screenshot_02_math.png', hash: '#/math/s3_explore', subject: 'math' },
      { name: 'screenshot_03_biology.png', hash: '#/biology/s3_explore', subject: 'biology' },
      { name: 'screenshot_04_chemistry.png', hash: '#/chemistry/s3_explore', subject: 'chemistry' },
      { name: 'screenshot_05_physics.png', hash: '#/physics/s3_explore', subject: 'physics' }
    ];

    // Seed mock predictions so router guard allows direct S3 exploration view
    await client.evaluate(`
      const existing = JSON.parse(localStorage.getItem('pocketlab_progress') || '{}');
      const progress = existing.progress || {};
      ['math', 'biology', 'chemistry', 'physics'].forEach(s => {
        progress[s] = progress[s] || {};
        progress[s].predictionChoiceId = 'opt-a';
      });
      localStorage.setItem('pocketlab_progress', JSON.stringify({
        ...existing,
        progress
      }));
    `);

    for (const r of routes) {
      console.log(`Navigating to ${r.hash}...`);
      await client.evaluate(`
        window.location.hash = '${r.hash}';
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      `);
      await new Promise(res => setTimeout(res, 1200));

      const screenshot = await client.send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(screenshot.data, 'base64');
      const outPath = path.join(ASSETS_OUT, r.name);
      fs.writeFileSync(outPath, buffer);
      console.log(`Captured: ${outPath} (${buffer.length} bytes)`);
    }

    console.log('All real app screenshots captured successfully!');
  } finally {
    if (client) client.close();
    chromeProc.kill();
    await new Promise(r => server.close(r));
    try { fs.rmSync(CDP_PROFILE_DIR, { recursive: true, force: true }); } catch (_) {}
  }
}

capture().catch(err => {
  console.error('Capture failed:', err);
  process.exit(1);
});

