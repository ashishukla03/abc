import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`
];

let chromeExe = chromePaths.find(p => fs.existsSync(p));
const port = 9228;
const chromeProcess = spawn(chromeExe, [
  `--remote-debugging-port=${port}`,
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--window-size=1440,900',
  'http://localhost:3000'
], { stdio: 'ignore' });

const screenshotsDir = path.join(process.cwd(), 'audit_screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

setTimeout(async () => {
  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json/list`).then(r => r.json());
    const page = listRes.find(p => p.type === 'page');
    const { default: WebSocket } = await import('ws');
    const ws = new WebSocket(page.webSocketDebuggerUrl);

    let id = 1;
    const send = (method, params = {}) => {
      return new Promise((resolve) => {
        const curId = id++;
        const handler = (data) => {
          const msg = JSON.parse(data.toString());
          if (msg.id === curId) {
            ws.off('message', handler);
            resolve(msg.result);
          }
        };
        ws.on('message', handler);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    };

    ws.on('open', async () => {
      console.log('Connected to Chrome DevTools Protocol.');
      await send('Page.enable');
      await send('Runtime.enable');

      const capture = async (name, url) => {
        console.log(`Navigating to ${url}...`);
        await send('Page.navigate', { url });
        await new Promise(r => setTimeout(r, 1200)); // Allow animations to settle

        const { data } = await send('Page.captureScreenshot', { format: 'png' });
        const filePath = path.join(screenshotsDir, `${name}.png`);
        fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
        console.log(`Saved screenshot: ${filePath}`);

        // Analyze layout and DOM metrics
        const metrics = await send('Runtime.evaluate', {
          expression: `({
            url: window.location.href,
            viewportWidth: window.innerWidth,
            hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth,
            elementsCount: document.querySelectorAll('*').length,
            visibleTextNodesCount: document.body.innerText.split('\\n').filter(t => t.trim().length > 0).length,
            glassElementsCount: document.querySelectorAll('.glass-panel, .glass-header, .glass-royal-card').length
          })`,
          returnByValue: true
        });

        console.log(`Metrics for ${name}:`, JSON.stringify(metrics.result?.value, null, 2));
      };

      await capture('01_dashboard', 'http://localhost:3000/');
      await capture('02_courses', 'http://localhost:3000/class/10/subjects');
      await capture('03_subject_timeline', 'http://localhost:3000/subject/physics-10');
      await capture('04_inquiry_lab', 'http://localhost:3000/lab/p10-ch10-t1');
      await capture('05_school_hub', 'http://localhost:3000/hub');
      await capture('06_profile_radar', 'http://localhost:3000/profile');

      ws.close();
      chromeProcess.kill();
      console.log('Visual audit capture complete!');
      process.exit(0);
    });

  } catch (err) {
    console.error('Capture error:', err);
    chromeProcess.kill();
    process.exit(1);
  }
}, 1500);

