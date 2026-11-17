import { spawn } from 'child_process';
import fs from 'fs';

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`
];

let chromeExe = chromePaths.find(p => fs.existsSync(p));
const port = 9227;
const chromeProcess = spawn(chromeExe, [
  `--remote-debugging-port=${port}`,
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--window-size=1440,900',
  'http://localhost:3000'
], { stdio: 'ignore' });

setTimeout(async () => {
  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json/list`).then(r => r.json());
    const page = listRes.find(p => p.type === 'page');
    const { default: WebSocket } = await import('ws');
    const ws = new WebSocket(page.webSocketDebuggerUrl);

    ws.on('open', () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));

      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 2,
          method: 'Runtime.evaluate',
          params: {
            expression: `(() => {
              const issues = [];
              // Check missing image alt
              document.querySelectorAll('img').forEach(img => {
                if (!img.getAttribute('alt') && !img.hasAttribute('aria-hidden')) {
                  issues.push('Image missing alt: ' + img.src);
                }
              });
              // Check buttons without text or aria-label
              document.querySelectorAll('button').forEach(btn => {
                if (!btn.innerText.trim() && !btn.getAttribute('aria-label') && !btn.getAttribute('title')) {
                  issues.push('Button missing accessible label: ' + btn.className);
                }
              });
              // Check invalid links
              document.querySelectorAll('a').forEach(a => {
                if (!a.getAttribute('href')) {
                  issues.push('Link missing href: ' + a.className);
                }
              });
              return issues;
            })()`,
            returnByValue: true
          }
        }));
      }, 1500);
    });

    ws.on('message', (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.id === 2) {
        console.log('=== DOM AUDIT RESULTS ===');
        console.log('Issues found:', msg.result?.result?.value);
        ws.close();
        chromeProcess.kill();
        process.exit(0);
      }
    });

  } catch (err) {
    console.error('Audit error:', err);
    chromeProcess.kill();
    process.exit(1);
  }
}, 1500);

