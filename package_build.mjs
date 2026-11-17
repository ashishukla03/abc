import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';

const dest = path.resolve('..', 'STEM_COMPLETE_BUILD.zip');
if (fs.existsSync(dest)) fs.unlinkSync(dest);

// Collect all directories and files except test browser profiles, node_modules, and .git
const items = fs.readdirSync('.')
  .filter(item => !item.startsWith('cdp_') && item !== '.git' && item !== 'node_modules')
  .map(item => `'${item}'`)
  .join(', ');

console.log('Compressing build archive into:', dest);
const cmd = `powershell -NoProfile -Command "Compress-Archive -Path ${items} -DestinationPath '${dest}' -Force"`;
execSync(cmd, { stdio: 'inherit', maxBuffer: 1024 * 1024 * 50 });

const fileBuffer = fs.readFileSync(dest);
const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
console.log('SUCCESS! Archive created at:', dest);
console.log('Archive size:', fileBuffer.length, 'bytes');
console.log('SHA-256:', hash);

fs.writeFileSync('STEM_COMPLETE_BUILD_SHA256.txt', `${hash}  STEM_COMPLETE_BUILD.zip\n`, 'utf8');
