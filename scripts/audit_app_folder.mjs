import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

// Start a static server on port 3001 serving ./app
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(process.cwd(), 'app', reqPath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath);
    let contentType = 'text/html';
    if (ext === '.css') contentType = 'text/css';
    if (ext === '.js') contentType = 'application/javascript';
    if (ext === '.json') contentType = 'application/json';
    if (ext === '.svg') contentType = 'image/svg+xml';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(3001, () => {
  console.log('App folder server running at http://localhost:3001');
});

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`
];

let chromeExe = chromePaths.find(p => fs.existsSync(p));
const port = 9226;
const chromeProcess = spawn(chromeExe, [
  `--remote-debugging-port=${port}`,
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--window-size=1440,900',
  'http://localhost:3001'
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
      ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));

      setTimeout(() => {
        console.log('=== APP FOLDER BROWSER ERRORS ===');
        console.log('Errors:', JSON.stringify(errors, null, 2));
        console.log('Console entries:', logs.length);
        ws.close();
        chromeProcess.kill();
        server.close();
        process.exit(0);
      }, 2500);
    });

    ws.on('message', (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.method === 'Console.messageAdded' && msg.params.message.level === 'error') {
        errors.push(msg.params.message);
      }
      if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
        errors.push(msg.params);
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        errors.push(msg.params);
      }
    });

  } catch (err) {
    console.error('Audit app error:', err);
    chromeProcess.kill();
    server.close();
    process.exit(1);
  }
}, 1500);

