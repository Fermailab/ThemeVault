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
const iconsDir = path.join(rootDir, 'src', 'icons');
const svgPath = path.join(iconsDir, 'icon.svg');

const sizes = [16, 32, 48, 128];

console.log('Generating PNG icons from SVG...');

if (!fs.existsSync(svgPath)) {
  console.error(`SVG source not found at: ${svgPath}`);
  process.exit(1);
}

// Check which command is available: magick or convert
let tool = null;
try {
  execSync('magick -version', { stdio: 'ignore' });
  tool = 'magick';
} catch {
  try {
    execSync('convert -version', { stdio: 'ignore' });
    tool = 'convert';
  } catch {
    console.error('Neither "magick" nor "convert" is available.');
    process.exit(1);
  }
}

for (const size of sizes) {
  const outputPath = path.join(iconsDir, `icon-${size}.png`);
  const cmd = `${tool} -background none -density 384 "${svgPath}" -resize ${size}x${size} "${outputPath}"`;
  console.log(`Rendering ${size}x${size} -> icon-${size}.png`);
  execSync(cmd);
}

console.log('All icons generated successfully!');
