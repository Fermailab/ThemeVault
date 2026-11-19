// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 ThemeVault Contributors

/**
 * Built-in Curated Themes for Invision Community.
 * Every theme provides atomic CSS tokens and targeted selector rules for IPS 4.x and 5.x.
 */

(function (global) {
  'use strict';

  /**
   * Generates a complete, robust stylesheet covering all Invision Community elements.
   * Handles IPS 4.x, IPS 5.x, header wrappers, category banners, widgets, and controls.
   *
   * @param {string} themeName
   * @param {Object} colors
   * @param {boolean} isLight
   * @returns {string}
   */
  function buildThemeCSS(themeName, colors, isLight = false) {
    const textColorOnPrimary = isLight ? '#ffffff' : (colors.bg || '#11111b');
    const codeBg = isLight ? '#f1f5f9' : '#11111b';
    const codeColor = isLight ? '#334155' : (colors.primary || '#88c0d0');

    return `
/* ========================================================
   ThemeVault: ${themeName} for Invision Community
   Universal IPS 4.x & IPS 5.x Complete Skinning Architecture
   ======================================================== */
:root {
  --tv-bg: ${colors.bg};
  --tv-surface: ${colors.surface};
  --tv-surface-elevated: ${colors.surfaceElevated};
  --tv-border: ${colors.border};
  --tv-text: ${colors.text};
  --tv-text-muted: ${colors.textMuted};
  --tv-primary: ${colors.primary};
  --tv-accent: ${colors.accent};

  /* IPS 5 and Modern Framework Design Tokens */
  --i-primary: var(--tv-primary);
  --i-color--primary: var(--tv-primary);
  --i-surface: var(--tv-surface);
  --i-surface--elevated: var(--tv-surface-elevated);
  --i-surface--sunken: var(--tv-bg);
  --i-background: var(--tv-bg);
  --i-background--header: var(--tv-surface);
  --i-background--surface: var(--tv-surface);
  --i-background--surface-elevated: var(--tv-surface-elevated);
  --i-background--section-header: var(--tv-surface-elevated);
  --i-color--section-title: var(--tv-text);
  --i-color--text: var(--tv-text);
  --i-color--text-muted: var(--tv-text-muted);
  --i-color--border: var(--tv-border);
  --header--background: var(--tv-surface);
  --header--color: var(--tv-text);
  --nav--background: var(--tv-surface);

  /* IPS 5 Dynamic Palette & Header Custom Properties */
  --i-headerTop--ba-co: var(--tv-surface) !important;
  --i-headerTop--co: var(--tv-text) !important;
  --i-headerPrimary--ba-co: var(--tv-surface) !important;
  --i-headerPrimary--co: var(--tv-text) !important;
  --i-headerSecondary--ba-co: var(--tv-surface-elevated) !important;
  --i-headerSecondary--co: var(--tv-text) !important;
  --i-boxHeader--ba-co: var(--tv-surface-elevated) !important;
  --i-boxHeader--co: var(--tv-text) !important;
  --i-widget-header--ba-co: var(--tv-surface-elevated) !important;
  --i-widget-header--co: var(--tv-text) !important;
  --i-box--ba-co: var(--tv-surface) !important;
  --i-box--bo-co: var(--tv-border) !important;
  --i-background_1: var(--tv-bg) !important;
  --i-background_2: var(--tv-surface) !important;
  --i-background_3: var(--tv-surface-elevated) !important;
  --i-background_4: var(--tv-border) !important;
  --i-base_1: var(--tv-bg) !important;
  --i-base_2: var(--tv-surface-elevated) !important;
  --i-base_3: var(--tv-surface) !important;
  --i-base_4: var(--tv-border) !important;
  --i-base_5: var(--tv-border) !important;
  --i-base_6: var(--tv-border) !important;
  --i-color_hard: var(--tv-text) !important;
  --i-color_soft: var(--tv-text-muted) !important;
  --i-color_contrast: var(--tv-text) !important;
  --dark__i-boxHeader--ba-co: var(--tv-surface-elevated) !important;
  --dark__i-widget-header--ba-co: var(--tv-surface-elevated) !important;
  --dark__i-headerTop--ba-co: var(--tv-surface) !important;
  --dark__i-headerPrimary--ba-co: var(--tv-surface) !important;
  --dark__i-headerSecondary--ba-co: var(--tv-surface-elevated) !important;
  --light__i-boxHeader--ba-co: var(--tv-surface-elevated) !important;
  --light__i-widget-header--ba-co: var(--tv-surface-elevated) !important;
  --light__i-headerTop--ba-co: var(--tv-surface) !important;
  --light__i-headerPrimary--ba-co: var(--tv-surface) !important;
  --light__i-headerSecondary--ba-co: var(--tv-surface-elevated) !important;
}

/* 1. Global Page Background & Shell */
html,
body.ipsApp,
body.ipsApp_front,
body[data-pageapp],
#ipsLayout_body,
#ipsLayout_contentArea,
#ipsLayout_mainArea,
.ipsLayout_container {
  background-color: var(--tv-bg) !important;
  color: var(--tv-text) !important;
}

/* 2. Header, Navigation, User Bar & Search */
#ipsLayout_header,
#ipsLayout_header header,
#ipsLayout_header nav,
#ipsLayout_navBar,
#elNav,
#elNavigation,
.ipsHeader,
.ipsHeader__top,
.ipsHeader__primary,
.ipsHeader__align,
.ipsResponsive_header--desktop,
.ipsResponsive_header--mobile,
.ipsMobileHeader,
.ipsNavBar,
.ipsNavBar_primary,
.ipsNavBar_secondary,
.ipsNavBar_user,
#elUserNav,
.ipsUserNav,
#elSearch,
#ipsLayout_search,
.ipsSearch,
.ipsSearchPseudo,
.ipsBreadcrumb,
ul.ipsBreadcrumb {
  background: var(--tv-surface) !important;
  background-color: var(--tv-surface) !important;
  background-image: none !important;
  border-color: var(--tv-border) !important;
  color: var(--tv-text) !important;
}

.ipsHeader__secondary {
  background: var(--tv-surface-elevated) !important;
  background-color: var(--tv-surface-elevated) !important;
  background-image: none !important;
  border-color: var(--tv-border) !important;
  color: var(--tv-text) !important;
}

.ipsNavBar_primary > ul > li > a,
.ipsNavBar_secondary > ul > li > a,
.ipsNavBar__label,
.ipsNavBar__item a,
.ipsUserNav__link,
#elUserNav a,
.ipsBreadcrumb a,
.ipsBreadcrumb li {
  color: var(--tv-text) !important;
}

.ipsNavBar_primary > ul > li.ipsNavBar_active > a,
.ipsNavBar_secondary > ul > li.ipsNavBar_active > a,
.ipsNavBar__item.ipsNavBar__item--active > a {
  background: var(--tv-surface-elevated) !important;
  background-color: var(--tv-surface-elevated) !important;
  background-image: none !important;
  color: var(--tv-primary) !important;
  border-bottom: 3px solid var(--tv-primary) !important;
}

#elSearch input,
.ipsSearch input,
.ipsSearchPseudo input,
.ipsSearch input[type="search"],
.ipsSearch input[type="text"],
.ipsSearchDialog__input {
  background: var(--tv-surface-elevated) !important;
  background-color: var(--tv-surface-elevated) !important;
  color: var(--tv-text) !important;
  border: 1px solid var(--tv-border) !important;
}

/* 3. Category Headers, Section Titles & Box Headers */
.ipsType_sectionTitle,
h2.ipsType_sectionTitle,
h3.ipsType_sectionTitle,
.ipsType_secondaryTitle,
.ipsBox_title,
.ipsBox_header,
.ipsBox__header,
header.ipsBox__header,
h2.ipsBox__header,
h3.ipsBox__header,
.ipsBox > h2,
.ipsBox > header,
.ipsBox--forumCategory > .ipsBox__header,
.ipsWidget_title,
h2.ipsWidget_title,
h3.ipsWidget_title,
.ipsWidget_header,
.ipsWidget__header,
header.ipsWidget__header,
.ipsInnerBox__header,
.ipsTable_wrap th,
.cForumTable th,
.ipsTable th,
.ipsDataItem_header,
.cFeaturedTopic_header,
.cFeaturedTopic > div:first-child,
.cCmsDatabaseHeader,
.cCmsRecord_header,
.cCmsArticle_header {
  background: var(--tv-surface-elevated) !important;
  background-color: var(--tv-surface-elevated) !important;
  background-image: none !important;
  color: var(--tv-text) !important;
  border-color: var(--tv-border) !important;
}

/* 4. Content Boxes, Forums, Posts, Widgets & Data Items */
.ipsBox,
.ipsBox--forumCategory,
.ipsBox__content,
.ipsWidget,
.ipsWidget__content,
.ipsInnerBox,
.ipsPageHeader,
.ipsAreaBackground,
.ipsAreaBackground_light,
.ipsAreaBackground_reset,
.ipsDataItem,
.ipsData__item,
.ipsComment,
.ipsBox_alt,
.cAuthorPane,
.cTopic,
.cForumRow,
.cFeaturedTopic,
.cCmsArticle,
.cCmsRecord,
.cWidgetContainer {
  background: var(--tv-surface) !important;
  background-color: var(--tv-surface) !important;
  background-image: none !important;
  border-color: var(--tv-border) !important;
  color: var(--tv-text) !important;
}

.ipsDataItem:hover,
.cForumRow:hover {
  background-color: var(--tv-surface-elevated) !important;
}

/* 5. Headings & Typography */
.ipsDataItem_title a,
.ipsType_pageTitle,
.ipsType_sectionHead,
.ipsType_large,
.ipsType_break,
h1, h2, h3, h4, h5, h6 {
  color: var(--tv-text) !important;
}

.ipsDataItem_title a:hover,
.ipsType_pageTitle:hover {
  color: var(--tv-primary) !important;
}

.ipsType_light,
.ipsType_minorHeading,
.ipsDataItem_stats,
.ipsComment_meta,
.ipsType_desc,
.cAuthorPane_info {
  color: var(--tv-text-muted) !important;
}

/* 6. Post Content, Rich Text & Links */
.ipsType_richText,
.ipsType_richText p,
.ipsType_richText span,
.ipsType_richText div {
  color: var(--tv-text) !important;
  line-height: 1.68 !important;
}

.ipsType_richText a {
  color: var(--tv-primary) !important;
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* 7. Quotes, Spoilers & Citations */
blockquote.ipsQuote,
.ipsQuote_citation,
.ipsSpoiler,
.ipsSpoiler_header {
  background: var(--tv-surface-elevated) !important;
  background-image: none !important;
  border-left: 4px solid var(--tv-primary) !important;
  border-color: var(--tv-border) !important;
  color: var(--tv-text) !important;
}

/* 8. Code Blocks */
pre.ipsCode,
code {
  background-color: ${codeBg} !important;
  border: 1px solid var(--tv-border) !important;
  color: ${codeColor} !important;
  border-radius: 6px !important;
  font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace !important;
}

/* 9. Buttons, Actions & Badges */
.ipsButton_primary {
  background: var(--tv-primary) !important;
  background-image: none !important;
  color: ${textColorOnPrimary} !important;
  border: none !important;
  font-weight: 600 !important;
}

.ipsButton_primary:hover {
  background: var(--tv-accent) !important;
  color: ${textColorOnPrimary} !important;
}

.ipsButton_light,
.ipsButton_normal,
.ipsButton_secondary {
  background: var(--tv-surface-elevated) !important;
  background-image: none !important;
  color: var(--tv-text) !important;
  border: 1px solid var(--tv-border) !important;
}

/* 10. Dropdown Menus, Dialogs & Modals */
.ipsMenu,
.ipsMenu_innerContent,
.ipsMenu_header,
.ipsMenu_footer,
.ipsDialog,
.ipsDialog_content,
.ipsDialog_title {
  background: var(--tv-surface) !important;
  background-image: none !important;
  color: var(--tv-text) !important;
  border-color: var(--tv-border) !important;
}

.ipsMenu_item > a {
  color: var(--tv-text) !important;
}

.ipsMenu_item > a:hover,
.ipsMenu_item.ipsMenu_itemActive > a {
  background: var(--tv-surface-elevated) !important;
  color: var(--tv-primary) !important;
}

/* 11. Form Inputs & Textareas */
input[type="text"],
input[type="search"],
input[type="password"],
input[type="email"],
textarea,
select {
  background: var(--tv-surface-elevated) !important;
  color: var(--tv-text) !important;
  border: 1px solid var(--tv-border) !important;
}

/* 12. Tabs & Pagination */
.ipsTabs,
.ipsTabs_item {
  background: var(--tv-surface) !important;
  color: var(--tv-text) !important;
}

.ipsTabs_activeItem {
  background: var(--tv-surface-elevated) !important;
  color: var(--tv-primary) !important;
  border-bottom: 2px solid var(--tv-primary) !important;
}

.ipsPagination .ipsPagination_page a {
  background: var(--tv-surface-elevated) !important;
  color: var(--tv-text) !important;
  border: 1px solid var(--tv-border) !important;
}

.ipsPagination .ipsPagination_page.ipsPagination_active a {
  background: var(--tv-primary) !important;
  color: ${textColorOnPrimary} !important;
  border-color: var(--tv-primary) !important;
}
`;
  }

  const THEME_DEFINITIONS = [
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
      }
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
      }
    },
    {
      id: 'midnight-oled',
      name: 'Midnight OLED',
      description: 'Pure black (#000000) for OLED panels, high battery efficiency, and electric cyan accents.',
      author: 'ThemeVault Curators',
      isBuiltIn: true,
      colors: {
        bg: '#000000',
        surface: '#0a0a0a',
        surfaceElevated: '#161616',
        border: '#262626',
        text: '#ededed',
        textMuted: '#888888',
        primary: '#00f0ff',
        accent: '#7000ff'
      }
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
      }
    },
    {
      id: 'forest-emerald',
      name: 'Forest Emerald',
      description: 'Earthy, deep woodland green tones with crisp emerald accents.',
      author: 'ThemeVault Curators',
      isBuiltIn: true,
      colors: {
        bg: '#111a16',
        surface: '#17231e',
        surfaceElevated: '#23342d',
        border: '#2f463d',
        text: '#e2ece7',
        textMuted: '#9cb2a8',
        primary: '#10b981',
        accent: '#34d399'
      }
    },
    {
      id: 'clean-slate-light',
      name: 'Clean Slate Light',
      description: 'Minimalist high-contrast light theme engineered for daytime readability.',
      author: 'ThemeVault Curators',
      isBuiltIn: true,
      isLight: true,
      colors: {
        bg: '#f8fafc',
        surface: '#ffffff',
        surfaceElevated: '#f1f5f9',
        border: '#e2e8f0',
        text: '#0f172a',
        textMuted: '#64748b',
        primary: '#0284c7',
        accent: '#38bdf8'
      }
    }
  ];

  // Attach pre-generated CSS to each theme definition
  const DEFAULT_THEMES = THEME_DEFINITIONS.map((def) => ({
    ...def,
    css: buildThemeCSS(def.name, def.colors, Boolean(def.isLight))
  }));

  global.DEFAULT_THEMES = DEFAULT_THEMES;
  global.buildThemeCSS = buildThemeCSS;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DEFAULT_THEMES;
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
