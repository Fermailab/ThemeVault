// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 ThemeVault Contributors

/**
 * Built-in Curated Themes for Invision Community.
 * Every theme provides atomic CSS tokens and targeted selector rules for IPS 4.x and 5.x.
 */

(function (global) {
  'use strict';

  const DEFAULT_THEMES = [
    {
      id: 'nord-frost',
      name: 'Nord Frost',
      description: 'An arctic, north-bluish clean dark palette for calm reading.',
      author: 'ThemeVault Curators',
      isBuiltIn: true,
      colors: {
        bg: '#242933',
        surface: '#2e3440',
        surfaceElevated: '#3b4252',
        border: '#434c5e',
        text: '#eceff4',
        textMuted: '#d8dee9',
        primary: '#88c0d0',
        accent: '#81a1c1'
      },
      css: `
/* ========================================================
   ThemeVault: Nord Frost for Invision Community
   ======================================================== */
:root {
  --tv-bg: #242933;
  --tv-surface: #2e3440;
  --tv-surface-elevated: #3b4252;
  --tv-border: #434c5e;
  --tv-text: #eceff4;
  --tv-text-muted: #d8dee9;
  --tv-primary: #88c0d0;
  --tv-accent: #81a1c1;

  /* IPS 5 Token Compatibility */
  --i-primary: var(--tv-primary);
  --i-color--primary: var(--tv-primary);
  --i-surface: var(--tv-surface);
  --i-background: var(--tv-bg);
}

body.ipsApp,
body.ipsApp_front,
#ipsLayout_body,
#ipsLayout_contentArea,
#ipsLayout_mainArea {
  background-color: var(--tv-bg) !important;
  color: var(--tv-text) !important;
}

/* Header & Navigation */
#ipsLayout_header,
.ipsNavBar_primary,
.ipsNavBar_secondary,
.ipsBreadcrumb {
  background-color: var(--tv-surface) !important;
  border-color: var(--tv-border) !important;
  color: var(--tv-text) !important;
}

.ipsNavBar_primary > ul > li > a {
  color: var(--tv-text) !important;
}

.ipsNavBar_primary > ul > li.ipsNavBar_active > a {
  background-color: var(--tv-surface-elevated) !important;
  color: var(--tv-primary) !important;
  border-bottom: 3px solid var(--tv-primary) !important;
}

/* Content Boxes, Comments, Data Items */
.ipsBox,
.ipsWidget,
.ipsPageHeader,
.ipsAreaBackground,
.ipsAreaBackground_light,
.ipsAreaBackground_reset,
.ipsDataItem,
.ipsComment,
.ipsBox_alt,
.cAuthorPane {
  background-color: var(--tv-surface) !important;
  border-color: var(--tv-border) !important;
  color: var(--tv-text) !important;
}

.ipsDataItem:hover {
  background-color: var(--tv-surface-elevated) !important;
}

.ipsDataItem_title a,
.ipsType_pageTitle,
.ipsType_sectionHead,
.ipsType_large {
  color: var(--tv-text) !important;
}

.ipsDataItem_title a:hover {
  color: var(--tv-primary) !important;
}

.ipsType_light,
.ipsType_minorHeading,
.ipsDataItem_stats,
.ipsComment_meta {
  color: var(--tv-text-muted) !important;
}

/* Rich Text & Post Body */
.ipsType_richText,
.ipsType_richText p {
  color: var(--tv-text) !important;
  line-height: 1.68 !important;
}

.ipsType_richText a {
  color: var(--tv-primary) !important;
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* Quotes and Spoilers */
blockquote.ipsQuote,
.ipsQuote_citation {
  background-color: var(--tv-surface-elevated) !important;
  border-left: 4px solid var(--tv-primary) !important;
  border-color: var(--tv-border) !important;
  color: var(--tv-text) !important;
}

/* Code Blocks */
pre.ipsCode,
code {
  background-color: #1e222a !important;
  border: 1px solid var(--tv-border) !important;
  color: #88c0d0 !important;
  border-radius: 6px !important;
  font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace !important;
}

/* Buttons and Controls */
.ipsButton_primary {
  background-color: var(--tv-primary) !important;
  color: #242933 !important;
  border: none !important;
  font-weight: 600 !important;
}

.ipsButton_primary:hover {
  background-color: var(--tv-accent) !important;
  color: #1e222a !important;
}

.ipsButton_light,
.ipsButton_normal {
  background-color: var(--tv-surface-elevated) !important;
  color: var(--tv-text) !important;
  border: 1px solid var(--tv-border) !important;
}

/* Pagination */
.ipsPagination .ipsPagination_page.ipsPagination_active a {
  background-color: var(--tv-primary) !important;
  color: #242933 !important;
}
`
    },
    {
      id: 'dracula',
      name: 'Dracula',
      description: 'The legendary high-contrast gothic dark theme with vibrant accents.',
      author: 'ThemeVault Curators',
      isBuiltIn: true,
      colors: {
        bg: '#1e1f29',
        surface: '#282a36',
        surfaceElevated: '#44475a',
        border: '#6272a4',
        text: '#f8f8f2',
        textMuted: '#b0b5c9',
        primary: '#bd93f9',
        accent: '#ff79c6'
      },
      css: `
/* ========================================================
   ThemeVault: Dracula for Invision Community
   ======================================================== */
:root {
  --tv-bg: #1e1f29;
  --tv-surface: #282a36;
  --tv-surface-elevated: #44475a;
  --tv-border: #6272a4;
  --tv-text: #f8f8f2;
  --tv-text-muted: #b0b5c9;
  --tv-primary: #bd93f9;
  --tv-accent: #ff79c6;

  --i-primary: var(--tv-primary);
  --i-surface: var(--tv-surface);
  --i-background: var(--tv-bg);
}

body.ipsApp,
body.ipsApp_front,
#ipsLayout_body,
#ipsLayout_contentArea {
  background-color: var(--tv-bg) !important;
  color: var(--tv-text) !important;
}

#ipsLayout_header,
.ipsNavBar_primary,
.ipsNavBar_secondary,
.ipsBreadcrumb {
  background-color: var(--tv-surface) !important;
  border-color: var(--tv-border) !important;
  color: var(--tv-text) !important;
}

.ipsNavBar_primary > ul > li.ipsNavBar_active > a {
  background-color: var(--tv-surface-elevated) !important;
  color: var(--tv-accent) !important;
  border-bottom: 3px solid var(--tv-accent) !important;
}

.ipsBox,
.ipsWidget,
.ipsPageHeader,
.ipsAreaBackground,
.ipsDataItem,
.ipsComment,
.cAuthorPane {
  background-color: var(--tv-surface) !important;
  border-color: #3b3e52 !important;
  color: var(--tv-text) !important;
}

.ipsDataItem:hover {
  background-color: #333646 !important;
}

.ipsDataItem_title a,
.ipsType_pageTitle {
  color: var(--tv-text) !important;
}

.ipsDataItem_title a:hover {
  color: var(--tv-accent) !important;
}

.ipsType_richText,
.ipsType_richText p {
  color: var(--tv-text) !important;
}

.ipsType_richText a {
  color: var(--tv-primary) !important;
}

blockquote.ipsQuote {
  background-color: #333646 !important;
  border-left: 4px solid var(--tv-accent) !important;
  color: var(--tv-text) !important;
}

pre.ipsCode, code {
  background-color: #171821 !important;
  border: 1px solid var(--tv-border) !important;
  color: #50fa7b !important;
}

.ipsButton_primary {
  background-color: var(--tv-primary) !important;
  color: #1e1f29 !important;
  font-weight: 600 !important;
}

.ipsButton_primary:hover {
  background-color: var(--tv-accent) !important;
  color: #ffffff !important;
}
`
    },
    {
      id: 'midnight-oled',
      name: 'Midnight OLED',
      description: 'True pure black (#000000) for OLED screens, deep battery savings, and electric cyan.',
      author: 'ThemeVault Curators',
      isBuiltIn: true,
      colors: {
        bg: '#000000',
        surface: '#0f1013',
        surfaceElevated: '#1b1d22',
        border: '#2a2e38',
        text: '#f1f5f9',
        textMuted: '#94a3b8',
        primary: '#38bdf8',
        accent: '#06b6d4'
      },
      css: `
/* ========================================================
   ThemeVault: Midnight OLED for Invision Community
   ======================================================== */
:root {
  --tv-bg: #000000;
  --tv-surface: #0e0f12;
  --tv-surface-elevated: #181a20;
  --tv-border: #232731;
  --tv-text: #f1f5f9;
  --tv-text-muted: #94a3b8;
  --tv-primary: #38bdf8;
  --tv-accent: #06b6d4;

  --i-primary: var(--tv-primary);
  --i-surface: var(--tv-surface);
  --i-background: var(--tv-bg);
}

body.ipsApp,
body.ipsApp_front,
#ipsLayout_body,
#ipsLayout_contentArea {
  background-color: #000000 !important;
  color: var(--tv-text) !important;
}

#ipsLayout_header,
.ipsNavBar_primary,
.ipsBreadcrumb,
.ipsBox,
.ipsWidget,
.ipsPageHeader,
.ipsAreaBackground,
.ipsDataItem,
.ipsComment,
.cAuthorPane {
  background-color: var(--tv-surface) !important;
  border-color: var(--tv-border) !important;
  color: var(--tv-text) !important;
}

.ipsDataItem:hover {
  background-color: var(--tv-surface-elevated) !important;
}

.ipsDataItem_title a {
  color: #ffffff !important;
}

.ipsDataItem_title a:hover {
  color: var(--tv-primary) !important;
}

.ipsType_richText a {
  color: var(--tv-primary) !important;
}

blockquote.ipsQuote {
  background-color: var(--tv-surface-elevated) !important;
  border-left: 3px solid var(--tv-primary) !important;
}

pre.ipsCode, code {
  background-color: #000000 !important;
  border: 1px solid var(--tv-border) !important;
  color: #38bdf8 !important;
}

.ipsButton_primary {
  background-color: var(--tv-primary) !important;
  color: #000000 !important;
  font-weight: 700 !important;
}
`
    },
    {
      id: 'catppuccin-mocha',
      name: 'Catppuccin Mocha',
      description: 'Soothing warm pastel dark theme with mauve and lavender highlights.',
      author: 'ThemeVault Curators',
      isBuiltIn: true,
      colors: {
        bg: '#181825',
        surface: '#1e1e2e',
        surfaceElevated: '#313244',
        border: '#45475a',
        text: '#cdd6f4',
        textMuted: '#a6adc8',
        primary: '#cba6f7',
        accent: '#f5c2e7'
      },
      css: `
/* ========================================================
   ThemeVault: Catppuccin Mocha for Invision Community
   ======================================================== */
:root {
  --tv-bg: #181825;
  --tv-surface: #1e1e2e;
  --tv-surface-elevated: #313244;
  --tv-border: #45475a;
  --tv-text: #cdd6f4;
  --tv-text-muted: #a6adc8;
  --tv-primary: #cba6f7;
  --tv-accent: #f5c2e7;

  --i-primary: var(--tv-primary);
  --i-surface: var(--tv-surface);
  --i-background: var(--tv-bg);
}

body.ipsApp,
body.ipsApp_front,
#ipsLayout_body,
#ipsLayout_contentArea {
  background-color: var(--tv-bg) !important;
  color: var(--tv-text) !important;
}

#ipsLayout_header,
.ipsNavBar_primary,
.ipsBreadcrumb,
.ipsBox,
.ipsWidget,
.ipsPageHeader,
.ipsDataItem,
.ipsComment,
.cAuthorPane {
  background-color: var(--tv-surface) !important;
  border-color: var(--tv-border) !important;
  color: var(--tv-text) !important;
}

.ipsDataItem:hover {
  background-color: var(--tv-surface-elevated) !important;
}

.ipsDataItem_title a:hover {
  color: var(--tv-primary) !important;
}

.ipsType_richText a {
  color: var(--tv-primary) !important;
}

blockquote.ipsQuote {
  background-color: var(--tv-surface-elevated) !important;
  border-left: 4px solid var(--tv-primary) !important;
}

pre.ipsCode, code {
  background-color: #11111b !important;
  border: 1px solid var(--tv-border) !important;
  color: #a6e3a1 !important;
}

.ipsButton_primary {
  background-color: var(--tv-primary) !important;
  color: #11111b !important;
  font-weight: 600 !important;
}
`
    },
    {
      id: 'forest-emerald',
      name: 'Forest Emerald',
      description: 'Earthy organic moss & deep pine tones with vivid emerald green accents.',
      author: 'ThemeVault Curators',
      isBuiltIn: true,
      colors: {
        bg: '#0c1412',
        surface: '#13211e',
        surfaceElevated: '#1a2e2a',
        border: '#2a443e',
        text: '#ecfdf5',
        textMuted: '#a7f3d0',
        primary: '#34d399',
        accent: '#10b981'
      },
      css: `
/* ========================================================
   ThemeVault: Forest Emerald for Invision Community
   ======================================================== */
:root {
  --tv-bg: #0c1412;
  --tv-surface: #13211e;
  --tv-surface-elevated: #1a2e2a;
  --tv-border: #2a443e;
  --tv-text: #ecfdf5;
  --tv-text-muted: #99f6e4;
  --tv-primary: #34d399;
  --tv-accent: #10b981;

  --i-primary: var(--tv-primary);
  --i-surface: var(--tv-surface);
  --i-background: var(--tv-bg);
}

body.ipsApp,
body.ipsApp_front,
#ipsLayout_body,
#ipsLayout_contentArea {
  background-color: var(--tv-bg) !important;
  color: var(--tv-text) !important;
}

#ipsLayout_header,
.ipsNavBar_primary,
.ipsBreadcrumb,
.ipsBox,
.ipsWidget,
.ipsDataItem,
.ipsComment,
.cAuthorPane {
  background-color: var(--tv-surface) !important;
  border-color: var(--tv-border) !important;
  color: var(--tv-text) !important;
}

.ipsDataItem:hover {
  background-color: var(--tv-surface-elevated) !important;
}

.ipsDataItem_title a:hover {
  color: var(--tv-primary) !important;
}

.ipsType_richText a {
  color: var(--tv-primary) !important;
}

blockquote.ipsQuote {
  background-color: var(--tv-surface-elevated) !important;
  border-left: 4px solid var(--tv-primary) !important;
}

pre.ipsCode, code {
  background-color: #080d0c !important;
  border: 1px solid var(--tv-border) !important;
  color: #34d399 !important;
}

.ipsButton_primary {
  background-color: var(--tv-primary) !important;
  color: #0c1412 !important;
  font-weight: 600 !important;
}
`
    },
    {
      id: 'clean-slate-light',
      name: 'Clean Slate Light',
      description: 'Crisp, high-legibility minimalist light theme with soft card surfaces and indigo accents.',
      author: 'ThemeVault Curators',
      isBuiltIn: true,
      colors: {
        bg: '#f8fafc',
        surface: '#ffffff',
        surfaceElevated: '#f1f5f9',
        border: '#e2e8f0',
        text: '#0f172a',
        textMuted: '#64748b',
        primary: '#4f46e5',
        accent: '#6366f1'
      },
      css: `
/* ========================================================
   ThemeVault: Clean Slate Light for Invision Community
   ======================================================== */
:root {
  --tv-bg: #f8fafc;
  --tv-surface: #ffffff;
  --tv-surface-elevated: #f1f5f9;
  --tv-border: #e2e8f0;
  --tv-text: #0f172a;
  --tv-text-muted: #64748b;
  --tv-primary: #4f46e5;
  --tv-accent: #6366f1;

  --i-primary: var(--tv-primary);
  --i-surface: var(--tv-surface);
  --i-background: var(--tv-bg);
}

body.ipsApp,
body.ipsApp_front,
#ipsLayout_body,
#ipsLayout_contentArea {
  background-color: var(--tv-bg) !important;
  color: var(--tv-text) !important;
}

#ipsLayout_header,
.ipsNavBar_primary,
.ipsBreadcrumb,
.ipsBox,
.ipsWidget,
.ipsDataItem,
.ipsComment,
.cAuthorPane {
  background-color: var(--tv-surface) !important;
  border-color: var(--tv-border) !important;
  color: var(--tv-text) !important;
}

.ipsDataItem:hover {
  background-color: var(--tv-surface-elevated) !important;
}

.ipsDataItem_title a {
  color: #0f172a !important;
}

.ipsDataItem_title a:hover {
  color: var(--tv-primary) !important;
}

.ipsType_richText a {
  color: var(--tv-primary) !important;
}

blockquote.ipsQuote {
  background-color: var(--tv-surface-elevated) !important;
  border-left: 4px solid var(--tv-primary) !important;
}

pre.ipsCode, code {
  background-color: #f1f5f9 !important;
  border: 1px solid var(--tv-border) !important;
  color: #334155 !important;
}

.ipsButton_primary {
  background-color: var(--tv-primary) !important;
  color: #ffffff !important;
  font-weight: 600 !important;
}
`
    }
  ];

  global.DEFAULT_THEMES = DEFAULT_THEMES;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DEFAULT_THEMES;
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
