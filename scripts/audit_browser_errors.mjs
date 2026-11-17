import { spawn } from 'child_process';
import fs from 'fs';

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`
];

let chromeExe = chromePaths.find(p => fs.existsSync(p));
const port = 9225;
const chromeProcess = spawn(chromeExe, [
  `--remote-debugging-port=${port}`,
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--window-size=1440,900',
  'http://localhost:3000'
], { stdio: 'ignore' });

const logs = [];
const errors = [];

setTimeout(async () => {
  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json/list`).then(r => r.json());
    const page = listRes.find(p => p.type === 'page');
    const { default: WebSocket } = await import('ws');
    const ws = new WebSocket(page.webSocketDebuggerUrl);

    ws.on('open', () => {
      ws.send(JSON.stringify({ id: 1, method: 'Console.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Log.enable' }));
      ws.send(JSON.stringify({ id: 3, method: 'Runtime.enable' }));

      // Listen for errors for 3 seconds across pages
      setTimeout(async () => {
        // Navigate through all main views
        const routes = ['/', '/class/10/subjects', '/subject/physics-10', '/lab/p10-ch10-t1', '/hub', '/mock-exams', '/profile'];
        for (const route of routes) {
          ws.send(JSON.stringify({
            id: 10,
            method: 'Runtime.evaluate',
            params: {
              expression: `window.location.hash = ''; window.history.pushState({}, '', '${route}'); window.dispatchEvent(new PopStateEvent('popstate'));`
            }
          }));
          await new Promise(res => setTimeout(res, 600));
        }

        setTimeout(() => {
          console.log('=== COLLECTED BROWSER LOGS & ERRORS ===');
          console.log('Errors count:', errors.length);
          console.log(JSON.stringify(errors, null, 2));
          console.log('Total console entries:', logs.length);
          ws.close();
          chromeProcess.kill();
          process.exit(0);
        }, 1000);
      }, 1500);
    });

    ws.on('message', (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.method === 'Console.messageAdded') {
        const message = msg.params.message;
        logs.push(message);
        if (message.level === 'error') {
          errors.push(message);
        }
      }
      if (msg.method === 'Runtime.consoleAPICalled') {
        if (msg.params.type === 'error') {
          errors.push(msg.params);
        }
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        errors.push(msg.params);
      }
    });

  } catch (err) {
    console.error('Audit error:', err);
    chromeProcess.kill();
    process.exit(1);
  }
}, 1500);

