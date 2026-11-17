import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`
];

let chromeExe = chromePaths.find(p => fs.existsSync(p));
const port = 9230;

// Use a temporary user-data-dir so Chrome reliably launches on Windows
const tempUserDataDir = path.join(process.cwd(), '.chrome_temp_profile');
if (!fs.existsSync(tempUserDataDir)) {
  fs.mkdirSync(tempUserDataDir, { recursive: true });
}

console.log('Launching Chrome with clean profile on port', port);
const chromeProcess = spawn(chromeExe, [
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${tempUserDataDir}`,
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--window-size=1440,900',
  'http://localhost:3000'
], { stdio: 'ignore' });

const screenshotsDir = path.join(process.cwd(), 'live_chrome_screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function run() {
  // Retry fetch until Chrome is ready
  let page = null;
  for (let i = 0; i < 15; i++) {
    try {
      const list = await fetch(`http://127.0.0.1:${port}/json/list`).then(r => r.json());
      page = list.find(p => p.type === 'page');
      if (page) break;
    } catch (e) {
      await new Promise(r => setTimeout(r, 400));
    }
  }

  if (!page) {
    console.error('Could not connect to Chrome on port', port);
    chromeProcess.kill();
    process.exit(1);
  }

  console.log('Target page found:', page.webSocketDebuggerUrl);
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
    console.log('Connected to DevTools WebSocket!');
    await send('Page.enable');
    await send('Runtime.enable');
    await send('DOM.enable');

    const captureAndAnalyze = async (name, url = null, interactionFn = null) => {
      if (url) {
        console.log(`Navigating to ${url}...`);
        await send('Page.navigate', { url });
        await new Promise(r => setTimeout(r, 1200));
      }

      if (interactionFn) {
        console.log(`Executing interaction for ${name}...`);
        await send('Runtime.evaluate', { expression: `(${interactionFn.toString()})()` });
        await new Promise(r => setTimeout(r, 800));
      }

      const { data } = await send('Page.captureScreenshot', { format: 'png' });
      const filePath = path.join(screenshotsDir, `${name}.png`);
      fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
      console.log(`Saved screenshot: ${filePath}`);

      const domInfo = await send('Runtime.evaluate', {
        expression: `({
          url: window.location.href,
          heading: document.querySelector('h1, h2')?.innerText,
          buttonCount: document.querySelectorAll('button').length,
          hasModal: !!document.querySelector('[role="dialog"], .glass-header'),
          hasCanvas: !!document.querySelector('canvas')
        })`,
        returnByValue: true
      });

      console.log(`DOM info [${name}]:`, JSON.stringify(domInfo.result?.value, null, 2));
    };

    // 1. Initial Dashboard
    await captureAndAnalyze('01_live_dashboard', 'http://localhost:3000/');

    // 2. Click Stage 'Middle (6-8)'
    await captureAndAnalyze('02_stage_middle_clicked', null, () => {
      const btns = Array.from(document.querySelectorAll('header button'));
      const btn = btns.find(b => b.innerText.includes('Middle'));
      if (btn) btn.click();
    });

    // 3. Click first subject card
    await captureAndAnalyze('03_subject_timeline_entered', null, () => {
      const card = document.querySelector('article');
      if (card) card.click();
    });

    // 4. Open Quiz Modal
    await captureAndAnalyze('04_topic_test_modal_opened', null, () => {
      const testBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Topic Test'));
      if (testBtn) testBtn.click();
    });

    // 5. Select radio in modal
    await captureAndAnalyze('05_quiz_option_selected', null, () => {
      const radio = document.querySelector('input[type="radio"]');
      if (radio) radio.click();
    });

    // 6. Navigate to inquiry lab
    await captureAndAnalyze('06_inquiry_lab_active', 'http://localhost:3000/lab/p7-ch13-t1');

    // 7. Adjust frequency slider
    await captureAndAnalyze('07_lab_slider_adjusted', null, () => {
      const slider = document.querySelector('input[type="range"]');
      if (slider) {
        slider.value = '700';
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    console.log('All live interactive Chromium sessions completed successfully!');
    ws.close();
    chromeProcess.kill();
    process.exit(0);
  });
}

run().catch(err => {
  console.error('Run failure:', err);
  chromeProcess.kill();
  process.exit(1);
});
