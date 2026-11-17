/**
 * Gramin PocketLab — Local Development & Application Server
 * File: server.mjs
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 8000;
const APP_DIR = path.resolve(__dirname, 'app');
const OPENMOTION_DIR = path.resolve(__dirname, 'openmotion');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.vtt': 'text/vtt; charset=utf-8',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json; charset=utf-8'
};

const server = http.createServer((req, res) => {
  let reqUrl = decodeURI(req.url.split('?')[0]);
  let rootDir = APP_DIR;
  let targetPath = reqUrl;

  if (reqUrl.startsWith('/openmotion/')) {
    rootDir = OPENMOTION_DIR;
    targetPath = reqUrl.replace('/openmotion/', '/');
    if (targetPath === '/' || targetPath === '') {
      targetPath = '/projects/gramin_pocketlab_overview/player.html';
    }
  } else {
    if (targetPath === '/' || targetPath === '') {
      targetPath = '/index.html';
    }
  }

  const safePath = path.normalize(path.join(rootDir, targetPath));
  if (!safePath.startsWith(rootDir)) {
    res.writeHead(403);
    return res.end('403 Forbidden');
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found: ' + reqUrl);
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    const headers = {
      'Content-Type': contentType,
      'Service-Worker-Allowed': '/',
      'Access-Control-Allow-Origin': '*'
    };

    // Range support for video streaming (MP4/WebM)
    const range = req.headers.range;
    if (range && (ext === '.mp4' || ext === '.webm')) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunksize = (end - start) + 1;
      headers['Content-Range'] = `bytes ${start}-${end}/${stats.size}`;
      headers['Accept-Ranges'] = 'bytes';
      headers['Content-Length'] = chunksize;
      res.writeHead(206, headers);
      fs.createReadStream(safePath, { start, end }).pipe(res);
      return;
    }

    headers['Content-Length'] = stats.size;
    res.writeHead(200, headers);
    fs.createReadStream(safePath).pipe(res);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`======================================================================`);
  console.log(`GRAMIN POCKETLAB LOCAL APPLICATION SERVER ACTIVE`);
  console.log(`======================================================================`);
  console.log(`  Application:      http://localhost:${PORT}/`);
  console.log(`  OpenMotion Hub:   http://localhost:${PORT}/openmotion/`);
  console.log(`======================================================================`);
});

