import { spawn } from 'child_process';
import fs from 'fs';

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`
];

let chromeExe = chromePaths.find(p => fs.existsSync(p));

console.log('Using Chrome:', chromeExe);
const port = 9223;
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
    console.log('Chrome Debugger attached to pages:', listRes.length);
    const page = listRes.find(p => p.type === 'page');
    if (!page) {
      console.error('No page target found!');
      chromeProcess.kill();
      process.exit(1);
    }

    const { default: WebSocket } = await import('ws');
    const ws = new WebSocket(page.webSocketDebuggerUrl);

    ws.on('open', () => {
      console.log('WebSocket connected to Chrome DevTools Protocol!');
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'DOM.enable' }));

      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 3,
          method: 'Runtime.evaluate',
          params: {
            expression: `({
              title: document.title,
              h1: document.querySelector('h1')?.innerText,
              hasCanvas: !!document.querySelector('canvas'),
              hasAuroraCanvas: !!document.querySelector('.royal-futuristic-canvas'),
              hasCyberGrid: !!document.querySelector('.cyber-grid'),
              hasRadarBeam: !!document.querySelector('.radar-beam'),
              cardsCount: document.querySelectorAll('article').length,
              navLinksCount: document.querySelectorAll('nav a').length,
              headerClasses: document.querySelector('header > div')?.className,
              stageButtonsCount: document.querySelectorAll('header button').length
            })`,
            returnByValue: true
          }
        }));
      }, 1500);
    });

    ws.on('message', (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.id === 3 && msg.result?.result?.value) {
        console.log('=== LIVE BROWSER DOM INSPECTION RESULT ===');
        console.log(JSON.stringify(msg.result.result.value, null, 2));

        // Test Navigation to Course
        ws.send(JSON.stringify({
          id: 4,
          method: 'Runtime.evaluate',
          params: {
            expression: `(() => {
              const firstCard = document.querySelector('article');
              if (firstCard) {
                firstCard.click();
                return 'Clicked first subject card';
              }
              return 'No card found';
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
                currentUrl: window.location.href,
                chapterHeader: document.querySelector('h2')?.innerText,
                exploreButtons: document.querySelectorAll('button').length
              })`,
              returnByValue: true
            }
          }));
        }, 1000);
      }

      if (msg.id === 5 && msg.result?.result?.value) {
        console.log('=== NAVIGATION & TIMELINE VERIFICATION ===');
        console.log(JSON.stringify(msg.result.result.value, null, 2));

        setTimeout(() => {
          ws.close();
          chromeProcess.kill();
          process.exit(0);
        }, 500);
      }
    });

  } catch (err) {
    console.error('Inspection error:', err);
    chromeProcess.kill();
    process.exit(1);
  }
}, 1500);
