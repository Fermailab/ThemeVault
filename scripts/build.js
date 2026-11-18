#!/usr/bin/env node
// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 ThemeVault Contributors

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');

const args = process.argv.slice(2);
const targetArg = args.find((a) => a.startsWith('--target='));
const target = targetArg ? targetArg.split('=')[1] : 'all';

console.log(`[ThemeVault Build] Building for target: ${target}`);

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

/**
 * Recursively copies a directory.
 */
function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Builds Chrome extension distribution.
 */
function buildChrome() {
  const outDir = path.join(distDir, 'chrome');
  console.log(` -> Building Chrome distribution in ${outDir}`);

  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true });
  }

  copyDirSync(srcDir, outDir);

  const manifestPath = path.join(outDir, 'manifest.json');
  const baseManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  // Ensure Chromium specific fields
  baseManifest.background = {
    service_worker: 'background/background.js'
  };

  fs.writeFileSync(manifestPath, JSON.stringify(baseManifest, null, 2));
  console.log('    ✓ Chrome build complete.');
}

/**
 * Builds Firefox extension distribution.
 */
function buildFirefox() {
  const outDir = path.join(distDir, 'firefox');
  console.log(` -> Building Firefox distribution in ${outDir}`);

  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true });
  }

  copyDirSync(srcDir, outDir);

  const manifestPath = path.join(outDir, 'manifest.json');
  const baseManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  // Firefox MV3 compatibility adjustments
  baseManifest.background = {
    scripts: ['background/background.js']
  };

  baseManifest.browser_specific_settings = {
    gecko: {
      id: 'themevault@invision-community.extension',
      strict_min_version: '109.0'
    }
  };

  fs.writeFileSync(manifestPath, JSON.stringify(baseManifest, null, 2));
  console.log('    ✓ Firefox build complete.');
}

if (target === 'chrome' || target === 'all') {
  buildChrome();
}

if (target === 'firefox' || target === 'all') {
  buildFirefox();
}

console.log('[ThemeVault Build] Done! Outputs available in ./dist');
