#!/usr/bin/env node

/**
 * ThemeVault - Automated Validation Script
 * Verifies syntax of all JS files, manifest validity, and core default themes.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('[ThemeVault Validation] Running pre-flight checks...');

// 1. Validate JS syntax with node --check
function findJsFiles(dir, excludeDirs = []) {
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!excludeDirs.includes(entry.name)) {
        files.push(...findJsFiles(full, excludeDirs));
      }
    } else if (entry.name.endsWith('.js')) {
      files.push(full);
    }
  }
  return files;
}

const jsFiles = [
  ...findJsFiles(path.join(rootDir, 'src')),
  ...findJsFiles(path.join(rootDir, 'scripts')),
  ...(fs.existsSync(path.join(rootDir, 'tests')) ? findJsFiles(path.join(rootDir, 'tests'), ['fixtures']) : [])
];

let syntaxErrors = 0;
for (const file of jsFiles) {
  const relPath = path.relative(rootDir, file);
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  } catch (err) {
    console.error(` ✗ Syntax error in ${relPath}:`, err.message);
    syntaxErrors++;
  }
}

if (syntaxErrors > 0) {
  console.error(`[ThemeVault Validation] Failed: ${syntaxErrors} syntax error(s) found.`);
  process.exit(1);
}
console.log(` ✓ Syntax check passed for ${jsFiles.length} JavaScript files.`);

// 2. Validate manifest.json
const manifestPath = path.join(rootDir, 'src', 'manifest.json');
try {
  const raw = fs.readFileSync(manifestPath, 'utf8');
  const manifest = JSON.parse(raw);
  if (!manifest.name || !manifest.version || !manifest.manifest_version) {
    throw new Error('Missing core manifest fields (name, version, manifest_version)');
  }
  console.log(` ✓ Manifest validation passed (v${manifest.version}, MV${manifest.manifest_version}).`);
} catch (err) {
  console.error(' ✗ Manifest validation failed:', err.message);
  process.exit(1);
}

// 3. Validate default themes structure
try {
  const defaultThemesPath = path.join(rootDir, 'src', 'core', 'default-themes.js');
  const content = fs.readFileSync(defaultThemesPath, 'utf8');
  if (!content.includes('DEFAULT_THEMES')) {
    throw new Error('default-themes.js is missing DEFAULT_THEMES definition');
  }
  console.log(' ✓ Default themes configuration verified.');
} catch (err) {
  console.error(' ✗ Themes validation failed:', err.message);
  process.exit(1);
}

console.log('[ThemeVault Validation] All checks passed successfully! ✨');
