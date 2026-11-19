#!/usr/bin/env node
// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 ThemeVault Contributors

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

console.log('[ThemeVault Package] Generating distribution zip bundles...');

// Ensure builds exist
execSync('node scripts/build.js --target=all', { cwd: rootDir, stdio: 'inherit' });

const targets = ['chrome', 'firefox'];

for (const target of targets) {
  const targetDir = path.join(distDir, target);
  const zipName = `themevault-${target}.zip`;
  const zipPath = path.join(distDir, zipName);

  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }

  console.log(`Packaging ${target} into ${zipName}...`);
  execSync(`zip -r "${zipPath}" .`, { cwd: targetDir, stdio: 'ignore' });
  console.log(` ✓ Created ${zipName}`);
}

console.log('[ThemeVault Package] Packaging complete!');
