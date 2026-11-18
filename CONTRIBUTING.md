# Contributing to ThemeVault

Thank you for your interest in contributing to **ThemeVault**! We welcome community contributions of all kinds—from new Invision Community themes and layout tweaks to core bug fixes and documentation improvements.

ThemeVault is licensed under the [GNU General Public License v3.0 or later (GPL-3.0-or-later)](./LICENSE). By contributing to this project, you agree that your contributions will be licensed under the same terms.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How Can I Contribute?](#how-can-i-contribute)
   - [Reporting Bugs](#reporting-bugs)
   - [Suggesting Features](#suggesting-features)
   - [Submitting New Themes](#submitting-new-themes)
   - [Code Contributions](#code-contributions)
3. [Development Setup](#development-setup)
   - [Prerequisites](#prerequisites)
   - [Local Installation](#local-installation)
   - [Building the Extension](#building-the-extension)
   - [Loading in Chrome / Chromium](#loading-in-chrome--chromium)
   - [Loading in Firefox](#loading-in-firefox)
   - [Running Verification](#running-verification)
4. [Project Structure](#project-structure)
5. [Commit Message Conventions](#commit-message-conventions)
6. [Pull Request Workflow](#pull-request-workflow)
7. [Getting Help](#getting-help)

---

## Code of Conduct

All contributors and participants must adhere to our [Code of Conduct](./CODE_OF_CONDUCT.md). Please report any unacceptable behavior to [support@fermailab.dev](mailto:support@fermailab.dev).

---

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report, please check existing [Issues](https://github.com/Fermailab/ThemeVault/issues) to avoid duplicates.

When reporting a bug, use our [Bug Report Template](https://github.com/Fermailab/ThemeVault/issues/new?template=bug_report.yml) and include:
* Extension version (e.g., `v1.0.0`)
* Browser and version (e.g., Chrome 124, Firefox 125)
* Target Invision Community forum URL or version (e.g., IPS 4.7.x, IC 5.x)
* Steps to reproduce, observed behavior, and expected behavior
* Console error logs or screenshots if applicable

### Suggesting Features

We welcome ideas that make ThemeVault faster, more versatile, or more pleasant to use. Please open an issue using the [Feature Request Template](https://github.com/Fermailab/ThemeVault/issues/new?template=feature_request.yml).

### Submitting New Themes

One of the best ways to contribute is by designing and submitting new curated color schemes!

ThemeVault uses structured color palettes and scoped CSS overrides for Invision Community 4.x and 5.x. When submitting a new theme:
1. Use the [Submit New Theme Template](https://github.com/Fermailab/ThemeVault/issues/new?template=new_theme.yml) to propose the theme.
2. Ensure colors have sufficient contrast ratio (WCAG AA compliant).
3. Provide the 8 core color variables:
   * `bg` (page background)
   * `surface` (cards, containers, posts)
   * `surfaceElevated` (dropdowns, modals, popovers)
   * `border` (subtle dividers and borders)
   * `text` (primary readable text)
   * `textMuted` (timestamps, subtitles, secondary info)
   * `primary` (brand color, active links, primary buttons)
   * `accent` (highlights, badges, secondary focus)
4. Test the theme on both light and dark IPS forum installations to verify readability.

### Code Contributions

Whether fixing a CSS rendering glitch on custom forum skins or optimizing the IPS detector, we appreciate your pull requests!

---

## Development Setup

### Prerequisites

* **Node.js**: `v18.x` or later (tested up to Node 26)
* **npm**: Standard npm included with Node.js
* **Zero 3rd-party dependencies**: ThemeVault uses native Node.js standard libraries for builds and packaging. No `node_modules` installation is required!

### Local Installation

Clone your fork of the repository:
```bash
git clone https://github.com/<your-username>/ThemeVault.git
cd ThemeVault
```

### Building the Extension

Build for all browsers or a specific target:
```bash
# Build both Chrome and Firefox distributions
npm run build

# Or build individually:
npm run build:chrome
npm run build:firefox
```
Build outputs are placed in `./dist/chrome` and `./dist/firefox`.

To package zip archives ready for browser store upload:
```bash
npm run package
```

### Loading in Chrome / Chromium

1. Run `npm run build:chrome`.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked** and select the `dist/chrome` folder in your ThemeVault directory.
5. After modifying files, run `npm run build:chrome` and click the reload icon on the ThemeVault card in `chrome://extensions/`.

### Loading in Firefox

1. Run `npm run build:firefox`.
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on...**.
4. Select `dist/firefox/manifest.json`.
5. After modifying files, run `npm run build:firefox` and click **Reload** in `about:debugging`.

### Running Verification

Before submitting a PR, verify syntax and manifest integrity:
```bash
npm test
```

---

## Project Structure

```
ThemeVault/
├── .github/
│   ├── ISSUE_TEMPLATE/     # GitHub issue templates
│   ├── workflows/          # GitHub Actions CI workflows
│   └── pull_request_template.md
├── scripts/
│   ├── build.js            # Dual-target build pipeline (Chrome / Firefox)
│   ├── generate-icons.js   # SVG and canvas icon generator
│   ├── package.js          # Distribution zip packager
│   └── validate.js         # Pre-flight syntax and manifest validator
├── src/
│   ├── background/         # Background service worker / scripts
│   ├── content/            # Injected DOM content scripts & styles
│   ├── core/               # Browser polyfill, IPS detector, theme definitions, storage
│   ├── icons/              # Extension icons (SVG + PNG 16/32/48/128)
│   ├── options/            # Full-page options and theme manager UI
│   ├── popup/              # Quick-action popup UI
│   └── manifest.json       # Base Manifest V3 configuration
├── dist/                   # Built output for Chrome and Firefox
├── CONTRIBUTING.md         # This guide
├── CODE_OF_CONDUCT.md     # Community code of conduct
├── SECURITY.md            # Security vulnerability reporting
└── package.json            # Project manifest and scripts
```

---

## Commit Message Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short description>
```

### Common Types:
* `feat`: A new feature (e.g., `feat(options): add live theme preview`)
* `fix`: A bug fix (e.g., `fix(detector): improve confidence calculation on IPS 5.0`)
* `theme`: Adding or improving a preset theme (e.g., `theme: add Solarized Dark palette`)
* `docs`: Documentation updates (e.g., `docs: update Chrome Web Store guidelines`)
* `refactor`: Code reorganization with no functional changes
* `chore`: Maintenance, build scripts, or CI changes (e.g., `chore(ci): update workflow runner`)

---

## Pull Request Workflow

1. **Fork & Branch**: Create a feature branch off `main` in your fork:
   ```bash
   git checkout -b feat/my-enhancement
   ```
2. **Make Changes**: Keep changes focused and atomic.
3. **Verify Locally**:
   ```bash
   npm test
   npm run build
   ```
4. **Commit**: Use descriptive conventional commit messages.
5. **Open Pull Request**: Push to your fork and submit a PR to `Fermailab/ThemeVault`'s `main` branch. Fill out all sections of the [Pull Request Template](./.github/pull_request_template.md).
6. **Code Review**: Address feedback or questions during the review process.

---

## Getting Help

If you have questions or need assistance, feel free to open a [GitHub Discussion](https://github.com/Fermailab/ThemeVault/discussions) or contact [support@fermailab.dev](mailto:support@fermailab.dev).
