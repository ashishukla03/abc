import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
];

let chromeExe = chromePaths.find((p) => fs.existsSync(p));
const port = 9245;

const tempUserDataDir = path.join(process.cwd(), '.chrome_temp_profile');
if (!fs.existsSync(tempUserDataDir)) {
  fs.mkdirSync(tempUserDataDir, { recursive: true });
}

console.log('Launching Chrome with clean profile on port', port);
const chromeProcess = spawn(
  chromeExe,
  [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tempUserDataDir}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--window-size=1440,960',
    'http://localhost:3000',
  ],
  { stdio: 'ignore' }
);

const outDir = path.join(process.cwd(), 'audit_screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  let page = null;
  for (let i = 0; i < 20; i++) {
    try {
      const list = await fetch(`http://127.0.0.1:${port}/json/list`).then((r) => r.json());
      page = list.find((p) => p.type === 'page');
      if (page) break;
    } catch (e) {
      await new Promise((r) => setTimeout(r, 400));
    }
  }

  if (!page) {
    console.error('Could not connect to Chrome on port', port);
    chromeProcess.kill();
    process.exit(1);
  }

  const { default: WebSocket } = await import('ws');
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let id = 1;
  const send = (method, params = {}) => {
    return new Promise((resolve, reject) => {
      const curId = id++;
      const handler = (data) => {
        const msg = JSON.parse(data.toString());
        if (msg.id === curId) {
          ws.off('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.on('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  };

  await new Promise((r) => ws.on('open', r));
  await send('Page.enable');
  await send('Runtime.enable');

  const capture = async (name) => {
    await new Promise((r) => setTimeout(r, 1500));
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    const filePath = path.join(outDir, `${name}.png`);
    fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
    console.log(`[Captured] ${name}.png saved (${Math.round(data.length / 1024)} KB)`);
  };

  const evaluate = async (expr) => {
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
    return res.result ? res.result.value : null;
  };

  // Ensure dark theme is forced in localStorage
  await send('Page.navigate', { url: 'http://localhost:3000/' });
  await new Promise((r) => setTimeout(r, 1000));
  await evaluate(`(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('pocketlab-app-store') || '{}');
      if (stored.state) {
        stored.state.theme = 'dark';
        localStorage.setItem('pocketlab-app-store', JSON.stringify(stored));
      }
    } catch(e) {}
  })()`);

  // Reload with dark theme
  await send('Page.navigate', { url: 'http://localhost:3000/' });
  await new Promise((r) => setTimeout(r, 2200));

  console.log('\n--- 1. CAPTURING DARK 3D DASHBOARD ---');
  await capture('01_dark_3d_dashboard');

  console.log('--- 2. SWITCHING 3D MODE TO DNA HELIX ---');
  await evaluate(`(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('DNA Helix'));
    if (btn) btn.click();
  })()`);
  await capture('02_3d_dna_helix_mode');

  console.log('--- 3. SWITCHING 3D MODE TO CRYSTAL LATTICE ---');
  await evaluate(`(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Crystal Lattice'));
    if (btn) btn.click();
  })()`);
  await capture('03_3d_crystal_lattice_mode');

  console.log('--- 4. OPENING OVERVIEW FILM MODAL (OpenMotion Skill) ---');
  await evaluate(`(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Overview Film'));
    if (btn) btn.click();
  })()`);
  await capture('04_cinematic_film_modal');

  // Close modal
  await evaluate(`(() => {
    const closeBtn = document.querySelector('button svg.lucide-x')?.parentElement;
    if (closeBtn) closeBtn.click();
  })()`);
  await new Promise((r) => setTimeout(r, 600));

  console.log('--- 5. CAPTURING SUBJECTS HUB (/courses) ---');
  await send('Page.navigate', { url: 'http://localhost:3000/courses' });
  await capture('05_dark_courses_bento_grid');

  console.log('--- 6. CAPTURING CHAPTER TIMELINE (/subject/...) ---');
  const subjectHref = await evaluate(`document.querySelector('a[href^="/subject/"]')?.getAttribute('href') || '/subject/math-10'`);
  await send('Page.navigate', { url: `http://localhost:3000${subjectHref}` });
  await capture('06_dark_subject_timeline');

  console.log('--- 7. CAPTURING STEM INQUIRY LAB (/lab/...) ---');
  const labHref = await evaluate(`document.querySelector('a[href^="/lab/"]')?.getAttribute('href') || '/lab/p10-ch12-t1'`);
  await send('Page.navigate', { url: `http://localhost:3000${labHref}` });
  await capture('07_dark_inquiry_lab');

  console.log('--- 8. EXPANDING 3-STEP GRADUATED HINTS ---');
  await evaluate(`(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Level 1'));
    if (btn) btn.click();
  })()`);
  await capture('08_dark_inquiry_hints_open');

  ws.close();
  chromeProcess.kill();
  console.log('\n✨ ALL DARK 3D GLASSMORPHIC MOTION GRAPHICS CAPTURED SUCCESSFULLY!\n');
}

run().catch((err) => {
  console.error('Error during verification:', err);
  chromeProcess.kill();
  process.exit(1);
});
