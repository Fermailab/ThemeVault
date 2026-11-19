#!/usr/bin/env node
// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 ThemeVault Contributors

/**
 * @file serve-fixture.js
 * Zero-dependency local HTTP static server for testing ThemeVault
 * against the sanitized Invision Community sample fixture.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const fixturesDir = path.join(rootDir, 'tests', 'fixtures');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const defaultPort = parseInt(process.env.PORT || '3000', 10);

function createServer(port) {
  const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let reqPath = decodeURIComponent(parsedUrl.pathname);

    // Default root or alias to sample_page.html
    if (reqPath === '/' || reqPath === '/sample' || reqPath === '/sample_page' || reqPath === '/sample_page.html') {
      reqPath = '/tests/fixtures/sample_page.html';
    }

    // Resolve target path safely within rootDir
    let targetPath = path.normalize(path.join(rootDir, reqPath));
    if (!targetPath.startsWith(rootDir)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('403 Forbidden');
      return;
    }

    // If requested path doesn't exist, check inside tests/fixtures
    if (!fs.existsSync(targetPath)) {
      const altFixturePath = path.normalize(path.join(fixturesDir, reqPath));
      if (altFixturePath.startsWith(fixturesDir) && fs.existsSync(altFixturePath)) {
        targetPath = altFixturePath;
      }
    }

    fs.stat(targetPath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }

      const ext = path.extname(targetPath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*'
      });

      fs.createReadStream(targetPath).pipe(res);
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[ThemeVault Server] Port ${port} is in use, trying ${port + 1}...`);
      createServer(port + 1);
    } else {
      console.error('[ThemeVault Server] Error:', err);
    }
  });

  server.listen(port, () => {
    console.log(`\n[ThemeVault Fixture Server] Running!`);
    console.log(` -> Fixture URL: http://localhost:${port}/`);
    console.log(` -> Direct Path: http://localhost:${port}/tests/fixtures/sample_page.html`);
    console.log(` -> Press Ctrl+C to stop.\n`);
  });
}

createServer(defaultPort);
