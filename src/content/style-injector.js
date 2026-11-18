// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 ThemeVault Contributors

/**
 * Style Injector for ThemeVault.
 * Manages rapid, FOUC-free injection and real-time updates of theme styles and layout tweaks.
 */

(function (global) {
  'use strict';

  const STYLE_ELEMENT_IDS = {
    THEME: 'themevault-theme-style',
    QOL: 'themevault-qol-style',
    CUSTOM: 'themevault-custom-style',
    OVERRIDES: 'themevault-variable-overrides'
  };

  class StyleInjector {
    /**
     * Get or create a designated style tag in the head/documentElement.
     * @param {string} id 
     * @returns {HTMLStyleElement}
     */
    static getOrCreateStyleElement(id) {
      let el = document.getElementById(id);
      if (!el) {
        el = document.createElement('style');
        el.id = id;
        el.setAttribute('data-themevault', 'true');
        const target = document.head || document.documentElement;
        if (target) {
          target.appendChild(el);
        }
      }
      return el;
    }

    /**
     * Inject or update base theme CSS.
     * @param {string} css 
     */
    static applyThemeCSS(css) {
      if (!css) {
        this.removeStyle(STYLE_ELEMENT_IDS.THEME);
        return;
      }
      const el = this.getOrCreateStyleElement(STYLE_ELEMENT_IDS.THEME);
      el.textContent = css;
    }

    /**
     * Inject or update user's custom CSS rules.
     * @param {string} customCss 
     */
    static applyCustomCSS(customCss) {
      if (!customCss || !customCss.trim()) {
        this.removeStyle(STYLE_ELEMENT_IDS.CUSTOM);
        return;
      }
      const el = this.getOrCreateStyleElement(STYLE_ELEMENT_IDS.CUSTOM);
      el.textContent = `\n/* --- ThemeVault User Custom Rules --- */\n${customCss}\n`;
    }

    /**
     * Inject dynamic variable overrides (accent color, custom fonts).
     * @param {Object} options 
     */
    static applyVariableOverrides({ accentColor, fontFamily }) {
      if (!accentColor && !fontFamily) {
        this.removeStyle(STYLE_ELEMENT_IDS.OVERRIDES);
        return;
      }

      let overrides = ':root {\n';
      if (accentColor) {
        overrides += `  --tv-primary: ${accentColor} !important;\n`;
        overrides += `  --i-primary: ${accentColor} !important;\n`;
        overrides += `  --i-color--primary: ${accentColor} !important;\n`;
      }
      if (fontFamily) {
        overrides += `  --tv-font: ${fontFamily} !important;\n`;
        overrides += `  font-family: var(--tv-font) !important;\n`;
      }
      overrides += '}\n';

      const el = this.getOrCreateStyleElement(STYLE_ELEMENT_IDS.OVERRIDES);
      el.textContent = overrides;
    }

    /**
     * Generate and inject targeted QoL enhancement rules for Invision Community.
     * @param {Object} qolTweaks 
     */
    static applyQoLTweaks(qolTweaks = {}) {
      const rules = [];

      // 1. Sticky Navigation Bar
      if (qolTweaks.stickyHeader) {
        rules.push(`
          #ipsLayout_header {
            position: sticky !important;
            top: 0 !important;
            z-index: 5000 !important;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25) !important;
          }
        `);
      }

      // 2. Clean Reading Mode: Hide signatures & optimize container reading width
      if (qolTweaks.cleanReading) {
        rules.push(`
          .ipsSignature,
          .cAuthorPane_badge,
          [data-role="memberRank"] {
            display: none !important;
          }
          #ipsLayout_contentArea {
            max-width: 1240px !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
        `);
      }

      // 3. Compact Author Cards in topics
      if (qolTweaks.compactCards) {
        rules.push(`
          .cAuthorPane {
            padding: 8px !important;
            font-size: 0.88rem !important;
          }
          .cAuthorPane_photo {
            margin-bottom: 6px !important;
          }
          .cAuthorPane_info li {
            padding: 2px 0 !important;
          }
        `);
      }

      // 4. Subtle Media Dimming in dark mode
      if (qolTweaks.darkMedia) {
        rules.push(`
          .ipsType_richText img:not(.ipsUserPhoto_tiny):not(.ipsUserPhoto_mini):not(.ipsEmoji),
          .ipsType_richText iframe,
          .ipsType_richText video {
            opacity: 0.88;
            filter: brightness(0.92);
            transition: opacity 0.25s ease, filter 0.25s ease;
          }
          .ipsType_richText img:hover,
          .ipsType_richText iframe:hover,
          .ipsType_richText video:hover {
            opacity: 1;
            filter: brightness(1);
          }
        `);
      }

      // 5. Expand Quotes & Spoilers
      if (qolTweaks.expandQuotes) {
        rules.push(`
          .ipsQuote_contents {
            max-height: none !important;
          }
          .ipsQuote_citation + div {
            max-height: none !important;
          }
        `);
      }

      const css = rules.join('\n');
      if (!css.trim()) {
        this.removeStyle(STYLE_ELEMENT_IDS.QOL);
        return;
      }

      const el = this.getOrCreateStyleElement(STYLE_ELEMENT_IDS.QOL);
      el.textContent = `\n/* --- ThemeVault Invision Community QoL Tweaks --- */\n${css}\n`;
    }

    /**
     * Remove a specific style element from the document.
     * @param {string} id 
     */
    static removeStyle(id) {
      const el = document.getElementById(id);
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }

    /**
     * Remove all ThemeVault styles completely.
     */
    static removeAll() {
      for (const id of Object.values(STYLE_ELEMENT_IDS)) {
        this.removeStyle(id);
      }
    }
  }

  global.StyleInjector = StyleInjector;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = StyleInjector;
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
