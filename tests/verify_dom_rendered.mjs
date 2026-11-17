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
  'http://127.0.0.1:8000/#/browser'
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
            mascotDialogue: document.querySelector('.mascot-bubble p')?.textContent?.trim(),
            progressHeading: document.querySelector('.timetable-card h2')?.textContent,
            skillMarkersCount: document.querySelectorAll('.skill-node-marker').length,
            aiCompanionPill: Boolean(document.querySelector('#btn-floating-ai-buddy')),
            topicTestButtons: document.querySelectorAll('.btn-trigger-topic-test').length
          })`
        }
      }));
    };
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === 1) {
        console.log('Browser View DOM Result:', JSON.parse(msg.result?.result?.value));
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
