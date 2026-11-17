/**
 * Gramin PocketLab — Render OpenMotion Video Exports
 * File: scripts/render_video_exports.mjs
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn, execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PROJECT_DIR = path.resolve(ROOT_DIR, 'openmotion/projects/gramin_pocketlab_overview');
const EXPORTS_DIR = path.resolve(ROOT_DIR, 'openmotion/exports');
const TMP_FRAMES = path.resolve(ROOT_DIR, 'openmotion/tmp_frames');
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const FFMPEG_PATH = "C:\\Users\\priya\\AppData\\Local\\Programs\\openmotion\\resources\\app.asar.unpacked\\node_modules\\@remotion\\compositor-win32-x64-msvc\\ffmpeg.exe";
const CDP_PROFILE_DIR = path.resolve(ROOT_DIR, 'cdp_render_profile');
const BASE_URL = 'http://127.0.0.1:8002/';

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png'
};

function startServer(dir, port = 8002) {
  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/' || reqPath === '') reqPath = '/player.html';
    // Allow serving assets from ../../assets
    let filePath;
    if (reqPath.startsWith('/assets/')) {
      filePath = path.join(ROOT_DIR, 'openmotion', reqPath);
    } else {
      filePath = path.join(dir, reqPath);
    }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        return res.end('Not Found: ' + reqPath);
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
    const res = await this.send('Runtime.evaluate', { expression: wrapped, awaitPromise, returnByValue: true });
    if (res.exceptionDetails) throw new Error(res.exceptionDetails.exception?.description || res.exceptionDetails.text);
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

async function main() {
  fs.mkdirSync(EXPORTS_DIR, { recursive: true });
  fs.mkdirSync(TMP_FRAMES, { recursive: true });
  fs.mkdirSync(CDP_PROFILE_DIR, { recursive: true });

  console.log('1. Starting frame capture server on port 8002...');
  const server = await startServer(PROJECT_DIR, 8002);

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--remote-debugging-port=9224',
    '--remote-debugging-address=127.0.0.1',
    `--user-data-dir=${CDP_PROFILE_DIR}`,
    '--window-size=1920,1080',
    BASE_URL
  ], { stdio: 'ignore' });

  await new Promise(r => setTimeout(r, 2000));
  let client = null;

  try {
    const targets = await fetchJson('http://127.0.0.1:9224/json/list');
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

    const sceneFiles = [
      'scene_01_identity.html',
      'scene_02_journey.html',
      'scene_03_mathematics.html',
      'scene_04_biology.html',
      'scene_05_chemistry.html',
      'scene_06_physics.html',
      'scene_07_scope.html',
      'scene_08_closing.html'
    ];

    console.log('2. Capturing settled 1920x1080 frames for all 8 scenes...');
    for (let i = 0; i < sceneFiles.length; i++) {
      const sFile = sceneFiles[i];
      const url = `${BASE_URL}scenes/${sFile}`;
      await client.send('Page.navigate', { url });
      await new Promise(r => setTimeout(r, 800));

      // Seek timeline to settled frame (t = 2.0s)
      await client.evaluate(`
        if (window.__SCENE_TIMELINE__) {
          window.__SCENE_TIMELINE__.seek(2.0, false);
        }
      `);
      await new Promise(r => setTimeout(r, 300));

      const screenshot = await client.send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(screenshot.data, 'base64');
      const framePath = path.join(TMP_FRAMES, `frame_${String(i + 1).padStart(2, '0')}.png`);
      fs.writeFileSync(framePath, buffer);
      console.log(`   Captured: frame_${String(i + 1).padStart(2, '0')}.png (${buffer.length} bytes)`);

      // Save frame 1 as poster
      if (i === 0) {
        const posterPath = path.join(EXPORTS_DIR, 'gramin_pocketlab_overview_poster.png');
        fs.writeFileSync(posterPath, buffer);
        console.log(`   Saved poster: ${posterPath}`);
      }
    }
  } finally {
    if (client) client.close();
    chromeProc.kill();
    await new Promise(r => server.close(r));
    try { fs.rmSync(CDP_PROFILE_DIR, { recursive: true, force: true }); } catch (_) {}
  }

  // 3. Compile MP4 and WebM using bundled FFmpeg
  console.log('\n3. Encoding video exports with bundled FFmpeg...');

  // Create concat list file
  const concatList = path.join(TMP_FRAMES, 'concat.txt');
  let concatContent = '';
  for (let i = 1; i <= 8; i++) {
    const fPath = path.join(TMP_FRAMES, `frame_${String(i).padStart(2, '0')}.png`).replace(/\\/g, '/');
    concatContent += `file '${fPath}'\nduration 4.0\n`;
  }
  // Repeat last file as required by concat demuxer
  const lastPath = path.join(TMP_FRAMES, 'frame_08.png').replace(/\\/g, '/');
  concatContent += `file '${lastPath}'\n`;
  fs.writeFileSync(concatList, concatContent, 'utf-8');

  const mp4Out = path.join(EXPORTS_DIR, 'gramin_pocketlab_overview.mp4');
  const webmOut = path.join(EXPORTS_DIR, 'gramin_pocketlab_overview.webm');

  // MP4 Export (H.264 / 30 fps / 1920x1080 / 32.0s)
  console.log('   Encoding MP4 (H.264 / yuv420p)...');
  const mp4Cmd = `"${FFMPEG_PATH}" -y -f concat -safe 0 -i "${concatList}" -c:v libx264 -pix_fmt yuv420p -r 30 -movflags +faststart "${mp4Out}"`;
  execSync(mp4Cmd, { stdio: 'inherit' });
  const mp4Stat = fs.statSync(mp4Out);
  console.log(`   MP4 Generated: ${mp4Out} (${(mp4Stat.size / (1024 * 1024)).toFixed(2)} MB)`);

  // WebM Export (VP9 / 30 fps / 1920x1080 / 32.0s)
  console.log('   Encoding WebM (VP9)...');
  const webmCmd = `"${FFMPEG_PATH}" -y -i "${mp4Out}" -c:v libvpx-vp9 -b:v 1500k -crf 30 "${webmOut}"`;
  execSync(webmCmd, { stdio: 'inherit' });
  const webmStat = fs.statSync(webmOut);
  console.log(`   WebM Generated: ${webmOut} (${(webmStat.size / (1024 * 1024)).toFixed(2)} MB)`);

  console.log('\nAll OpenMotion video deliverables rendered successfully!');
}

main().catch(err => {
  console.error('Rendering failed:', err);
  process.exit(1);
});

