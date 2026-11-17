/**
 * Gramin PocketLab — Service Worker & Offline Caching Contract Test Suite
 * File: tests/test_service_worker_contract.mjs
 *
 * Verifies:
 * 1. sw.js file existence and cache versioning.
 * 2. Precache manifest: confirms all static asset paths exist on disk and are non-empty.
 * 3. Zero external dependencies / CDN links in precache manifest.
 * 4. Cache-First Strategy with Stale-While-Revalidate network update.
 * 5. Offline fallback handling (index.html shell for navigation, 503 response for uncached resources).
 * 6. Installation & activation lifecycle hooks (skipWaiting, clients.claim, stale cache purging).
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const APP_DIR = path.resolve(__dirname, '../app');
const SW_PATH = path.resolve(APP_DIR, 'sw.js');

test('Suite 5: Service Worker & Offline Caching Contract', async (t) => {
  const swContent = fs.readFileSync(SW_PATH, 'utf-8');

  await t.test('1. Service Worker File & Cache Version Exists', () => {
    assert.ok(fs.existsSync(SW_PATH), 'sw.js file exists in app directory');
    const versionMatch = swContent.match(/const\s+CACHE_NAME\s*=\s*['"]([^'"]+)['"]/);
    assert.ok(versionMatch, 'CACHE_NAME is defined in sw.js');
    assert.match(versionMatch[1], /^pocketlab-v\d+$/, 'CACHE_NAME follows pocketlab-v* naming pattern');
  });

  await t.test('2. PRECACHE_ASSETS Manifest Integrity: All Files Physically Exist', () => {
    const precacheMatch = swContent.match(/const\s+PRECACHE_ASSETS\s*=\s*\[([\s\S]*?)\];/);
    assert.ok(precacheMatch, 'PRECACHE_ASSETS array found in sw.js');

    const assetUrls = precacheMatch[1]
      .split('\n')
      .map(line => line.trim().replace(/[',"]/g, ''))
      .filter(line => line.startsWith('./'));

    assert.ok(assetUrls.length >= 10, `Expected at least 10 assets, found ${assetUrls.length}`);

    for (const relUrl of assetUrls) {
      if (relUrl === './') {
        const indexHtmlPath = path.resolve(APP_DIR, 'index.html');
        assert.ok(fs.existsSync(indexHtmlPath), `Target for './' (index.html) exists`);
        const stats = fs.statSync(indexHtmlPath);
        assert.ok(stats.size > 0, `Target for './' must not be empty`);
        continue;
      }
      const diskPath = path.resolve(APP_DIR, relUrl.replace(/^\.\//, ''));
      assert.ok(
        fs.existsSync(diskPath),
        `Precached file must exist on disk: ${relUrl} -> ${diskPath}`
      );
      const stats = fs.statSync(diskPath);
      assert.ok(stats.size > 0, `Precached file must not be empty: ${diskPath}`);
    }
  });

  await t.test('3. Zero External Dependencies in Service Worker Manifest', () => {
    const precacheMatch = swContent.match(/const\s+PRECACHE_ASSETS\s*=\s*\[([\s\S]*?)\];/);
    const content = precacheMatch[1];
    assert.ok(!content.includes('http://'), 'No insecure http external links in precache');
    assert.ok(!content.includes('https://'), 'No external https links in precache');
    assert.ok(!content.includes('cdn'), 'No CDN references in precache');
  });

  await t.test('4. Cache-First Strategy with Stale-While-Revalidate Implementation', () => {
    // 1. Checks cache first
    assert.ok(swContent.includes('cache.match(request)'), 'sw.js checks cache first before network');
    // 2. Returns cached response immediately if present
    assert.match(swContent, /if\s*\(\s*cachedResponse\s*\)\s*\{[\s\S]*?return\s+cachedResponse;/,
      'Returns cached copy immediately on cache hit');
    // 3. Stale-while-revalidate background update writes to cache
    assert.ok(swContent.includes('cache.put(request, networkResponse.clone())'),
      'Background network fetch updates cache store');
    // 4. Offline navigation fallback to index shell
    assert.ok(swContent.includes("request.mode === 'navigate'"),
      'Provides fallback shell for navigation requests when offline');
    assert.ok(swContent.includes("match('./index.html')"),
      'Navigational fallback serves cached index.html');
    // 5. Offline non-navigation fallback returns 503
    assert.ok(swContent.includes('status: 503'),
      'Returns clean 503 Service Unavailable when resource unavailable offline');
  });

  await t.test('5. Service Worker Lifecycle Hooks & Stale Cache Purging', () => {
    assert.ok(swContent.includes("addEventListener('install'"), 'Install handler registered');
    assert.ok(swContent.includes("addEventListener('activate'"), 'Activate handler registered');
    assert.ok(swContent.includes("addEventListener('fetch'"), 'Fetch handler registered');
    assert.ok(swContent.includes('skipWaiting()'), 'Calls self.skipWaiting() on install');
    assert.ok(swContent.includes('clients.claim()'), 'Calls self.clients.claim() on activate');
    assert.ok(swContent.includes('caches.delete(existingCache)'), 'Purges stale cache buckets upon activation');
    assert.ok(swContent.includes('Promise.allSettled'), 'Uses resilient Promise.allSettled for precaching');
  });
});
