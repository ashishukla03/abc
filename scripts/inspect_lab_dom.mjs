import { spawn } from 'child_process';
import fs from 'fs';

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`
];

let chromeExe = chromePaths.find(p => fs.existsSync(p));
const port = 9224;
const chromeProcess = spawn(chromeExe, [
  `--remote-debugging-port=${port}`,
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--window-size=1440,900',
  'http://localhost:3000/lab/p7-ch13-t1'
], { stdio: 'ignore' });

setTimeout(async () => {
  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json/list`).then(r => r.json());
    const page = listRes.find(p => p.type === 'page');
    const { default: WebSocket } = await import('ws');
    const ws = new WebSocket(page.webSocketDebuggerUrl);

    ws.on('open', () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'DOM.enable' }));

      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 3,
          method: 'Runtime.evaluate',
          params: {
            expression: `({
              url: window.location.href,
              labTitle: document.querySelector('h1')?.innerText,
              hasOscilloscopeSvg: !!document.querySelector('svg path'),
              hasAudioToneButton: Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('Sine Tone')),
              rangeSlidersCount: document.querySelectorAll('input[type="range"]').length,
              finishLabButtonPresent: Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('Finish & Log Lab'))
            })`,
            returnByValue: true
          }
        }));
      }, 1500);
    });

    ws.on('message', (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.id === 3 && msg.result?.result?.value) {
        console.log('=== STEM INQUIRY LAB DOM VERIFICATION ===');
        console.log(JSON.stringify(msg.result.result.value, null, 2));

        // Click Finish Lab button
        ws.send(JSON.stringify({
          id: 4,
          method: 'Runtime.evaluate',
          params: {
            expression: `(() => {
              const finishBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Finish & Log Lab'));
              if (finishBtn) {
                finishBtn.click();
                return 'Clicked Finish Lab';
              }
              return 'Button not found';
            })()`,
            returnByValue: true
          }
        }));

        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 5,
            method: 'Runtime.evaluate',
            params: {
              expression: `({
                hasCompletedBadge: Array.from(document.querySelectorAll('div')).some(d => d.innerText.includes('Lab Completed (+150 XP)')),
                totalXpText: document.querySelector('header')?.innerText.includes('XP')
              })`,
              returnByValue: true
            }
          }));
        }, 1000);
      }

      if (msg.id === 5 && msg.result?.result?.value) {
        console.log('=== LAB INTERACTION & XP REWARD VERIFIED ===');
        console.log(JSON.stringify(msg.result.result.value, null, 2));

        setTimeout(() => {
          ws.close();
          chromeProcess.kill();
          process.exit(0);
        }, 500);
      }
    });

  } catch (err) {
    console.error('Lab inspection error:', err);
    chromeProcess.kill();
    process.exit(1);
  }
}, 1500);

