import http from 'http';
import fs from 'fs';
import { spawn } from 'child_process';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--remote-debugging-port=9224',
  '--remote-debugging-address=127.0.0.1',
  '--user-data-dir=C:\\Users\\priya\\Downloads\\STEM\\cdp_test_profile_flows',
  'http://127.0.0.1:8000/#/browser'
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9224/json/list');
    const tabs = await listRes.json();
    console.log('Opened Tab:', tabs[0].title);

    const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);

    let step = 1;

    ws.onopen = () => {
      // Step 1: Check Browser View DOM
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          expression: `JSON.stringify({
            title: document.title,
            hero: document.querySelector('.hub-hero h1')?.textContent,
            mascotDialogue: document.querySelector('.mascot-bubble p')?.textContent?.trim(),
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
        console.log('1. Curriculum & Course Hub DOM:', JSON.parse(msg.result?.result?.value));
        // Step 2: Navigate to Onboarding (Register mode)
        ws.send(JSON.stringify({
          id: 2,
          method: 'Runtime.evaluate',
          params: {
            expression: `window.location.hash = '#/onboarding';`
          }
        }));
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 3,
            method: 'Runtime.evaluate',
            params: {
              expression: `JSON.stringify({
                hash: window.location.hash,
                hero: document.querySelector('.hub-hero h1')?.textContent,
                stepperDots: document.querySelectorAll('.onboarding-step-dot').length,
                avatarCards: document.querySelectorAll('.avatar-option-card').length,
                nameInput: Boolean(document.querySelector('#ob-input-name')),
                modeButtons: document.querySelectorAll('.onboarding-mode-toggle button').length
              })`
            }
          }));
        }, 600);
      } else if (msg.id === 3) {
        console.log('2. Onboarding Wizard (Register Mode) DOM:', JSON.parse(msg.result?.result?.value));
        // Step 3: Click Sign In mode
        ws.send(JSON.stringify({
          id: 4,
          method: 'Runtime.evaluate',
          params: {
            expression: `document.querySelector('#btn-ob-mode-login')?.click();`
          }
        }));
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 5,
            method: 'Runtime.evaluate',
            params: {
              expression: `JSON.stringify({
                loginHeading: document.querySelector('.timetable-card h2')?.textContent,
                profileCards: document.querySelectorAll('.login-profile-card').length,
                signInButtonText: document.querySelector('.btn-login-as-profile')?.textContent?.trim()
              })`
            }
          }));
        }, 600);
      } else if (msg.id === 5) {
        console.log('3. Onboarding Wizard (Sign In Mode) DOM:', JSON.parse(msg.result?.result?.value));
        // Step 4: Test S6 Exit Result Celebration Card
        ws.send(JSON.stringify({
          id: 6,
          method: 'Runtime.evaluate',
          params: {
            expression: `window.location.hash = '#/physics/s6_exit_result';`
          }
        }));
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 7,
            method: 'Runtime.evaluate',
            params: {
              expression: `JSON.stringify({
                hash: window.location.hash,
                s6Section: Boolean(document.querySelector('.screen-s6-exit')),
                hasCelebrationCard: Boolean(document.querySelector('.celebration-card')),
                hasConfetti: Boolean(document.querySelector('.confetti-burst')),
                hasCurriculumButton: Boolean(document.querySelector('#btn-s6-curriculum')),
                hasReturnButton: Boolean(document.querySelector('#btn-s6-return'))
              })`
            }
          }));
        }, 800);
      } else if (msg.id === 7) {
        console.log('4. S6 Exit Result Celebration DOM:', JSON.parse(msg.result?.result?.value));
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

