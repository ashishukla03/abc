import http from 'http';
import fs from 'fs';
import { spawn } from 'child_process';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--remote-debugging-port=9223',
  '--remote-debugging-address=127.0.0.1',
  '--user-data-dir=C:\\Users\\priya\\Downloads\\STEM\\cdp_test_profile',
  'http://127.0.0.1:8000/#/onboarding'
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9223/json/list');
    const tabs = await listRes.json();
    console.log('Opened Tab Title:', tabs[0].title);

    const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          expression: `JSON.stringify({
            title: document.title,
            hero: document.querySelector('.hub-hero h1')?.textContent,
            stepTitle: document.querySelector('.timetable-card h2')?.textContent,
            avatars: Array.from(document.querySelectorAll('.avatar-option-card .avatar-label')).map(el => el.textContent),
            dotsCount: document.querySelectorAll('.onboarding-step-dot').length
          })`
        }
      }));
    };
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === 1) {
        console.log('Onboarding DOM Result:', JSON.parse(msg.result?.result?.value));
        ws.close();
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error('Error:', err.message);
    chrome.kill();
    process.exit(1);
  }
}, 3000);
