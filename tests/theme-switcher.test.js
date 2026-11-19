// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 ThemeVault Contributors

/**
 * @file theme-switcher.test.js
 * Automated test suite for ThemeVault theme generation, theme switching,
 * and Invision Community sample fixture verification.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load default themes from core module
const defaultThemesPath = path.resolve(__dirname, '../src/core/default-themes.js');
const defaultThemesContent = fs.readFileSync(defaultThemesPath, 'utf8');

// Evaluate in isolated vm context
const sandbox = {};
sandbox.globalThis = sandbox;
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(defaultThemesContent, sandbox);
const { DEFAULT_THEMES, buildThemeCSS } = sandbox;

describe('Theme CSS Generator & Tokens', () => {
  test('DEFAULT_THEMES array contains configured themes', () => {
    assert.ok(Array.isArray(DEFAULT_THEMES), 'DEFAULT_THEMES should be an array');
    assert.ok(DEFAULT_THEMES.length >= 5, 'Should provide at least 5 built-in themes');
  });

  test('Every theme generates complete CSS with IPS 4 and IPS 5 selectors', () => {
    for (const theme of DEFAULT_THEMES) {
      assert.ok(theme.id, 'Theme must have an id');
      assert.ok(theme.name, 'Theme must have a name');
      assert.ok(theme.colors, `Theme ${theme.id} must define colors`);

      const css = buildThemeCSS(theme.name, theme.colors, theme.isLight);
      assert.ok(typeof css === 'string' && css.length > 500, `CSS for ${theme.id} should be generated`);

      // Verify core CSS tokens
      assert.ok(css.includes(`--tv-bg: ${theme.colors.bg}`), `${theme.id} missing --tv-bg`);
      assert.ok(css.includes(`--tv-surface: ${theme.colors.surface}`), `${theme.id} missing --tv-surface`);
      assert.ok(css.includes(`--tv-primary: ${theme.colors.primary}`), `${theme.id} missing --tv-primary`);

      // Verify IPS 5 Dynamic Palette tokens (overrides brown/olive default palette)
      assert.ok(css.includes('--i-headerTop--ba-co: var(--tv-surface) !important;'), `${theme.id} missing --i-headerTop--ba-co`);
      assert.ok(css.includes('--i-headerPrimary--ba-co: var(--tv-surface) !important;'), `${theme.id} missing --i-headerPrimary--ba-co`);
      assert.ok(css.includes('--i-headerSecondary--ba-co: var(--tv-surface-elevated) !important;'), `${theme.id} missing --i-headerSecondary--ba-co`);
      assert.ok(css.includes('--i-boxHeader--ba-co: var(--tv-surface-elevated) !important;'), `${theme.id} missing --i-boxHeader--ba-co`);
      assert.ok(css.includes('--i-widget-header--ba-co: var(--tv-surface-elevated) !important;'), `${theme.id} missing --i-widget-header--ba-co`);
      assert.ok(css.includes('--i-box--ba-co: var(--tv-surface) !important;'), `${theme.id} missing --i-box--ba-co`);

      // Verify IPS 5 Selectors
      assert.ok(css.includes('.ipsHeader__primary'), `${theme.id} missing .ipsHeader__primary selector`);
      assert.ok(css.includes('.ipsHeader__secondary'), `${theme.id} missing .ipsHeader__secondary selector`);
      assert.ok(css.includes('.ipsBox__header'), `${theme.id} missing .ipsBox__header selector`);
      assert.ok(css.includes('.ipsWidget__header'), `${theme.id} missing .ipsWidget__header selector`);
      assert.ok(css.includes('.ipsSearchPseudo'), `${theme.id} missing .ipsSearchPseudo selector`);

      // Verify IPS 4 Selectors
      assert.ok(css.includes('#ipsLayout_header'), `${theme.id} missing #ipsLayout_header selector`);
      assert.ok(css.includes('.ipsType_sectionTitle'), `${theme.id} missing .ipsType_sectionTitle selector`);
      assert.ok(css.includes('.ipsButton_primary'), `${theme.id} missing .ipsButton_primary selector`);
    }
  });
});

describe('Sanitized Invision Community Sample Fixture', () => {
  const samplePath = path.resolve(__dirname, 'fixtures/sample_page.html');

  test('Sample fixture exists and contains required Invision Community elements', () => {
    assert.ok(fs.existsSync(samplePath), 'sample_page.html must exist in tests/fixtures/');
    const html = fs.readFileSync(samplePath, 'utf8');

    // Fixture structural elements
    assert.ok(html.includes('ipsHeader'), 'Fixture must include IPS 5 header');
    assert.ok(html.includes('ipsHeader__primary'), 'Fixture must include ipsHeader__primary');
    assert.ok(html.includes('ipsHeader__secondary'), 'Fixture must include ipsHeader__secondary');
    assert.ok(html.includes('ipsBox__header'), 'Fixture must include ipsBox__header');
    assert.ok(html.includes('ipsWidget__header'), 'Fixture must include ipsWidget__header');
    assert.ok(html.includes('ipsNavBar'), 'Fixture must include ipsNavBar');
  });

  test('Sample fixture is stripped of proprietary trademarks and tracking', () => {
    const html = fs.readFileSync(samplePath, 'utf8');

    // Proprietary society / site trademarks
    assert.ok(!html.includes('Duc In Altum'), 'Fixture must not contain "Duc In Altum" trademark');
    assert.ok(!html.includes('dias-journal'), 'Fixture must not contain "dias-journal"');
    assert.ok(!html.includes('OneTrust'), 'Fixture must not contain OneTrust tracking script');
    assert.ok(!html.includes('truffle-injected'), 'Fixture must not contain truffle injection marker');
    assert.ok(!html.includes('google-analytics.com'), 'Fixture must not contain Google Analytics');
  });

  test('Sample fixture has all real usernames obscured for GPL and privacy compliance', () => {
    const html = fs.readFileSync(samplePath, 'utf8');

    // Known scraped usernames that must NOT be present
    const scrapedUsernames = [
      'Dr. Draper Warren', 'Tess Brons', 'The Meter Maiden', 'ChartingGrace',
      'EmmaJ', 'John Henry Leonard', 'Trinity Vinton', 'E. H. Olivera, the First',
      'Anne Blythe', 'DaughterofMary_19', 'Phantom', 'emma_kate',
      'Danielle B.', 'Raven', 'Poland2018', 'Barney Collier',
      'Bridget OTuama', 'Erik F', 'master_uke', 'Danny Vinton',
      'Adelaide Myers', 'Eowyn13', 'Leprechaun12', 'Ravenclawed07'
    ];

    for (const name of scrapedUsernames) {
      assert.ok(!html.includes(`>${name}<`), `Username "${name}" must not appear in innerHTML`);
      assert.ok(!html.includes(`"${name}"`), `Username "${name}" must not appear in attribute values`);
    }

    // Verify all username tags use sanitized handles
    const usernameMatches = [...html.matchAll(/class="ipsUsername"[^>]*>([^<]+)<\/a>/g)].map(m => m[1].trim());
    for (const user of usernameMatches) {
      const isAllowed = user.startsWith('Community_Member_') ||
                        user === 'Admin_User' ||
                        user === 'Staff_Moderator' ||
                        user === 'DemoUser' ||
                        user === 'Journal Author';
      assert.ok(isAllowed, `Username "${user}" is not a recognized sanitized format`);
    }
  });
});

describe('Theme Switching Simulation', () => {
  test('Simulating theme switching cleanly updates DOM style tag without conflicts', () => {
    // Mock minimal DOM document environment
    class MockElement {
      constructor(tagName) {
        this.tagName = tagName;
        this.id = '';
        this.textContent = '';
      }
      remove() {
        this.parentNode = null;
      }
    }

    class MockDocument {
      constructor() {
        this.head = {
          children: [],
          appendChild: (el) => {
            el.parentNode = this.head;
            this.head.children.push(el);
            return el;
          }
        };
      }
      getElementById(id) {
        return this.head.children.find(el => el.id === id) || null;
      }
      createElement(tagName) {
        return new MockElement(tagName);
      }
    }

    const doc = new MockDocument();

    function applyTheme(theme) {
      let styleTag = doc.getElementById('themevault-active-theme');
      if (!styleTag) {
        styleTag = doc.createElement('style');
        styleTag.id = 'themevault-active-theme';
        doc.head.appendChild(styleTag);
      }
      styleTag.textContent = buildThemeCSS(theme.name, theme.colors, Boolean(theme.isLight));
      return styleTag;
    }

    function removeTheme() {
      const styleTag = doc.getElementById('themevault-active-theme');
      if (styleTag) {
        const index = doc.head.children.indexOf(styleTag);
        if (index !== -1) {
          doc.head.children.splice(index, 1);
        }
        styleTag.remove();
      }
    }

    // 1. Apply Nord Frost
    const nord = DEFAULT_THEMES.find(t => t.id === 'nord-frost');
    assert.ok(nord, 'nord-frost theme must exist');
    let activeStyle = applyTheme(nord);
    assert.equal(doc.head.children.length, 1);
    assert.ok(activeStyle.textContent.includes('ThemeVault: Nord Frost'));
    assert.ok(activeStyle.textContent.includes('--tv-primary: #88c0d0'));

    // 2. Switch to Dracula
    const dracula = DEFAULT_THEMES.find(t => t.id === 'dracula');
    assert.ok(dracula, 'dracula theme must exist');
    activeStyle = applyTheme(dracula);
    // Should still be exactly 1 style tag, not duplicated
    assert.equal(doc.head.children.length, 1);
    assert.ok(activeStyle.textContent.includes('ThemeVault: Dracula'));
    assert.ok(activeStyle.textContent.includes('--tv-primary: #bd93f9'));
    assert.ok(!activeStyle.textContent.includes('--tv-primary: #88c0d0'));

    // 3. Switch to Clean Slate Light
    const cleanSlate = DEFAULT_THEMES.find(t => t.id === 'clean-slate-light');
    assert.ok(cleanSlate, 'clean-slate-light theme must exist');
    activeStyle = applyTheme(cleanSlate);
    assert.equal(doc.head.children.length, 1);
    assert.ok(activeStyle.textContent.includes('ThemeVault: Clean Slate Light'));
    assert.ok(activeStyle.textContent.includes('--tv-bg: #f8fafc'));

    // 4. Disable theme
    removeTheme();
    assert.equal(doc.head.children.length, 0);
    assert.equal(doc.getElementById('themevault-active-theme'), null);
  });
});
