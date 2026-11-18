# ThemeVault

> A GPL-licensed, browser-agnostic browser extension providing custom themes, layout tweaks, and theme vault management for **any** Invision Community forum (IPS 4.x, Invision Community 5, and legacy IP.Board).

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
[![CI](https://github.com/Fermailab/ThemeVault/actions/workflows/ci.yml/badge.svg)](https://github.com/Fermailab/ThemeVault/actions/workflows/ci.yml)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-success.svg)]()
[![Browsers](https://img.shields.io/badge/Browsers-Chrome%20%7C%20Firefox%20%7C%20Edge%20%7C%20Safari-orange.svg)]()

---

## Overview

**ThemeVault** is designed to seamlessly detect and beautify any forum powered by [Invision Community](https://invisioncommunity.com/) (formerly Invision Power Board / IPS Community Suite). Whether a forum runs custom third-party skins or stock templates, ThemeVault applies clean, modern color schemes and quality-of-life enhancements directly into the DOM without layout breaks or Flash of Unstyled Content (FOUC).

ThemeVault is **100% Free and Open Source Software (FOSS)** licensed under the [GNU General Public License v3.0](LICENSE).

---

## Key Features

### 1. Universal Invision Community Detection
- **Heuristic Scoring Engine**: Detects Invision Community sites automatically without relying on hardcoded domain lists. Inspects:
  - Meta tags (`meta[name="ipsApp"]`, `meta[name="generator"]`)
  - DOM landmarks (`body.ipsApp`, `#ipsLayout_header`, `#ipsLayout_contentArea`, `.ipsDataItem`, `.ipsComment`)
  - Framework controllers (`[data-controller^="core."]`, `[data-role="page"]`)
  - Modern Invision Community 5 design tokens (`--i-primary`, `--i-surface`)
- **Manual Override Support**: One-click "Force Enable" toggle allows enabling ThemeVault on customized or white-labeled forums.

### 2. Built-in Theme Vault
ThemeVault ships with professionally curated themes:
- **Nord Frost**: Arctic, north-bluish dark palette for relaxed reading.
- **Dracula**: Iconic gothic dark theme with vivid purple and pink highlights.
- **Midnight OLED**: Pure black (`#000000`) for OLED screens, high battery savings, and electric cyan accents.
- **Catppuccin Mocha**: Soothing warm pastel dark theme with mauve and lavender tones.
- **Forest Emerald**: Natural organic moss and deep pine tones with emerald green accents.
- **Clean Slate Light**: Minimalist, high-legibility light theme with crisp typography and subtle card borders.

### 3. Theme Studio & Live CSS Editor
- Built-in live CSS editor with Invision Community selector cheat sheet.
- Color token pickers for Background, Surface, Primary Accent, and Text colors.
- Dynamic accent color overrides on the fly from the popup.
- Save custom themes directly into your local vault.

### 4. Forum Quality-of-Life (QoL) Enhancements
- **Sticky Navigation Bar**: Keeps the forum header in view when reading long discussions.
- **Clean Reading Mode**: Hides user signatures and member rank badges, while centering content to an optimal reading container width.
- **Code Block Copy Button**: Adds a one-click "Copy" button to all forum code snippets (`pre.ipsCode`).
- **Compact User Cards**: Streamlines post author sidebars in topic views.
- **Dark Media Dimmer**: Softly dims bright embedded images and videos in dark themes until hovered.

### 5. Portability & Vault Backup
- Export your entire theme collection, site configurations, and custom CSS into portable JSON backup files.
- Import themes created by other users or restore your settings across browsers.
- Per-domain rules: assign different themes to different forums.

---

## Project Structure

```
ThemeVault/
├── LICENSE                     # GNU General Public License v3.0
├── README.md                    # Project documentation
├── package.json                 # Project manifest and scripts
├── scripts/
│   ├── build.js                 # Cross-browser build script (Chrome, Firefox, Safari)
│   ├── generate-icons.js        # Vector SVG to PNG multi-resolution icon generator
│   └── package.js               # Produces store-ready .zip packages
├── src/
│   ├── manifest.json            # Base Manifest V3 (Chromium)
│   ├── icons/                   # Multi-resolution extension icons
│   │   ├── icon.svg             # Master vector source
│   │   ├── icon-16.png
│   │   ├── icon-32.png
│   │   ├── icon-48.png
│   │   └── icon-128.png
│   ├── core/                    # Browser-agnostic engine
│   │   ├── browser-polyfill.js  # Universal Promise-based WebExtensions polyfill
│   │   ├── ips-detector.js      # Invision Community heuristic detector
│   │   ├── storage.js           # Typed storage manager (sync/local, custom themes)
│   │   └── default-themes.js    # Curated built-in theme definitions
│   ├── background/
│   │   └── background.js        # Background service worker (badge, context menus)
│   ├── content/
│   │   ├── content.js           # Content script (injection, event handling, copy button)
│   │   ├── style-injector.js    # FOUC-free stylesheet injector
│   │   └── content.css          # Injected element styles (copy button, toasts)
│   ├── popup/
│   │   ├── popup.html           # Quick switcher popup
│   │   ├── popup.css            # Popup styling
│   │   └── popup.js             # Quick theme & QoL toggle controller
│   └── options/
│       ├── options.html         # Full ThemeVault Dashboard & Studio
│       ├── options.css          # Dashboard styling
│       └── options.js           # Theme Vault manager, CSS editor, backup controller
```

---

## Installation & Development

### Prerequisites
- Node.js (v18 or higher recommended)
- `npm`

### 1. Build the Extension
```bash
npm run build
```
This generates:
- `dist/chrome/` — Optimized for Chromium-based browsers (Chrome, Edge, Brave, Opera, Vivaldi)
- `dist/firefox/` — Optimized for Mozilla Firefox (includes Gecko ID and background script configuration)

To build for a single target:
```bash
npm run build:chrome
npm run build:firefox
```

To generate store-ready zip archives:
```bash
npm run package
```
This produces `themevault-chrome.zip` and `themevault-firefox.zip`.

---

## Loading Unpacked into Browsers

### Google Chrome / Microsoft Edge / Brave
1. Open your browser and navigate to `chrome://extensions` (or `edge://extensions`).
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked**.
4. Select the `dist/chrome` folder (or the root `src` folder).

### Mozilla Firefox
1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on...**.
3. Select `dist/firefox/manifest.json`.

### Apple Safari
ThemeVault is standard Manifest V3 compliant and can be converted into a native Safari extension using Xcode:
```bash
xcrun safari-web-extension-converter dist/chrome --project-location ./safari-build
```

---

## How It Works

1. **Document Start Phase**: When any web page begins loading, `src/content/content.js` executes at `run_at: "document_start"`. It inspects stored site settings and runs a rapid pre-check (`IPSDetector.fastPreCheck()`). If recognized as an Invision Community forum, it immediately injects the active theme's CSS via `StyleInjector` to prevent unstyled flashes.
2. **DOM Ready Phase**: Once the DOM finishes parsing, `IPSDetector.detect()` computes a confidence score (0-100%) by analyzing meta tags, controller attributes, landmarks, and IC5 variables.
3. **Background Sync**: If detected, a notification is dispatched to the background worker (`background.js`), which badges the extension icon with `IPS` and sets the active theme in the tooltip.
4. **Interactive Controls**: Opening the popup allows switching themes with zero page reload, adjusting the primary accent hue, or toggling quality-of-life forum features.

---

## Contributing

We welcome community contributions, bug reports, and new Invision Community color schemes!

* **[Contributing Guidelines](CONTRIBUTING.md)**: Setup instructions, coding standards, and PR workflow.
* **[Code of Conduct](CODE_OF_CONDUCT.md)**: Community standards and reporting guidelines.
* **[Security Policy](SECURITY.md)**: Responsible vulnerability disclosure process.

---

## License

This project is licensed under the **GNU General Public License v3.0** (GPL-3.0-or-later). See the [LICENSE](LICENSE) file for the complete license terms.

```
ThemeVault - Browser-agnostic extension for Invision Community
Copyright (C) 2026 ThemeVault Contributors

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
```
