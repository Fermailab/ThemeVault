---
name: themevault-contributing
description: >-
  Use this skill when developing, testing, styling, or submitting contributions to the ThemeVault
  browser extension for Invision Community. Covers local setup, fixture sanitization, testing workflows,
  dual-target building, and adding new curated themes.
---

# ThemeVault Contribution & Development Runbook

## Core Principles
1. **Zero External Dependencies**: ThemeVault uses native Node.js standard libraries (`node:fs`, `node:path`, `node:child_process`, `node:test`, `node:assert`). Do not introduce third-party npm packages without explicit maintainer agreement.
2. **Dual-Target MV3 Architecture**: Changes must build and operate seamlessly on both Chromium (`dist/chrome`) and Firefox (`dist/firefox`).
3. **Strict GPL & Privacy Standards**: Any test samples or fixture pages must be completely sanitized of external trademarks, private user handles, and telemetry before inclusion.

## Development & Testing Workflow

### 1. Verification & Testing
Before making commits:
```bash
# Run syntax, manifest integrity, and theme test suite
npm test

# Run unit tests individually if needed
npm run test:unit

# Build both Chrome and Firefox distributions
npm run build
```

### 2. Browser Testing
- **Chrome**: Load unpacked from `dist/chrome` in `chrome://extensions/`. Click reload on the card after running `npm run build:chrome`.
- **Firefox**: Load temporary add-on from `dist/firefox/manifest.json` in `about:debugging`.

### 3. Adding a New Theme or Feature
1. Define colors in `src/core/default-themes.js` under `THEME_DEFINITIONS`:
   - `bg`: Main page background
   - `surface`: Cards, posts, widgets
   - `surfaceElevated`: Category headers, dropdowns, popovers
   - `border`: Subtle dividers
   - `text`: Primary body text (ensure WCAG AA contrast against `surface` and `bg`)
   - `textMuted`: Secondary metadata and timestamps
   - `primary`: Accent/brand color for buttons, active links
   - `accent`: Hover state for buttons and highlights
2. Themes automatically receive complete IPS 4.x and 5.x CSS rules via `buildThemeCSS()`.
3. Verify that all IPS 5 header and box tokens are overridden to prevent unstyled brown/olive areas.
4. Run `npm test && npm run build` to verify that all automated assertions pass.

### 4. Contributing Sample Fixtures
When adding or updating mock HTML fixtures (in `tests/fixtures/`):
- Run sanitization to obscure all real user names (`Community_Member_01`, etc.).
- Replace proprietary logos with generic SVGs.
- Strip all external script tags and cookies.
- Add or update assertions in `tests/theme-switcher.test.js` to safeguard the fixture.

### 5. Commit Standards
Follow Conventional Commits:
- `feat(scope)`: New feature or tweak
- `fix(scope)`: Bug fix or CSS adjustment
- `theme`: New or updated color scheme
- `test`: New or updated automated tests
- `docs`: Documentation updates
- `chore`: Build script or CI maintenance
