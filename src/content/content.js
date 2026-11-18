// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 ThemeVault Contributors

/**
 * Main Content Script for ThemeVault.
 * Orchestrates Invision Community detection, early FOUC-free theme injection,
 * and dynamic quality-of-life enhancements.
 */

(async function () {
  'use strict';

  const domain = window.location.hostname;
  let isIPSActive = false;
  let activeTheme = null;
  let currentConfig = null;

  /**
   * Display a non-intrusive on-screen notification.
   * @param {string} message 
   */
  function showToast(message) {
    let toast = document.getElementById('tv-toast-message');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'tv-toast-message';
      toast.className = 'tv-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  /**
   * Fast early initialization at document_start to prevent FOUC.
   */
  async function earlyInit() {
    try {
      currentConfig = await StorageManager.getSiteConfig(domain);
      const isEarlyCandidate = IPSDetector.fastPreCheck() || currentConfig.forceIPS;

      if (currentConfig.enabled && isEarlyCandidate) {
        activeTheme = await StorageManager.getThemeById(currentConfig.themeId);
        if (activeTheme?.css) {
          StyleInjector.applyThemeCSS(activeTheme.css);
          StyleInjector.applyCustomCSS(currentConfig.customCss);
          StyleInjector.applyVariableOverrides({
            accentColor: currentConfig.accentOverride,
            fontFamily: currentConfig.fontOverride
          });
          StyleInjector.applyQoLTweaks(currentConfig.qolTweaks);
          isIPSActive = true;
        }
      }
    } catch (err) {
      console.warn('[ThemeVault] Early init error:', err);
    }
  }

  // Trigger early init immediately
  await earlyInit();

  /**
   * Comprehensive initialization after DOM is ready.
   */
  async function fullInit() {
    try {
      currentConfig = await StorageManager.getSiteConfig(domain);
      const detection = IPSDetector.detect();

      const shouldActivate = currentConfig.enabled && (detection.isIPS || currentConfig.forceIPS);

      if (shouldActivate) {
        isIPSActive = true;
        activeTheme = await StorageManager.getThemeById(currentConfig.themeId);

        if (activeTheme?.css) {
          StyleInjector.applyThemeCSS(activeTheme.css);
          StyleInjector.applyCustomCSS(currentConfig.customCss);
          StyleInjector.applyVariableOverrides({
            accentColor: currentConfig.accentOverride,
            fontFamily: currentConfig.fontOverride
          });
          StyleInjector.applyQoLTweaks(currentConfig.qolTweaks);
        }

        // Setup Invision Community interactive enhancements
        if (currentConfig.qolTweaks?.codeCopy) {
          setupCodeCopyButtons();
        }

        // Notify background service worker of detected Invision Community site
        try {
          await webext.runtime.sendMessage({
            type: 'IPS_DETECTED',
            details: {
              ...detection,
              domain,
              activeThemeName: activeTheme?.name || 'Default'
            }
          });
        } catch {
          // Background script might be waking up; ignore message error
        }
      } else {
        // Not an IPS site and not force-enabled
        if (!currentConfig.forceIPS) {
          StyleInjector.removeAll();
        }
      }
    } catch (err) {
      console.error('[ThemeVault] Full init failed:', err);
    }
  }

  /**
   * Injects copy buttons on all Invision Community code blocks.
   * Batched with requestAnimationFrame to prevent main thread blocking (Skill Rule #6).
   */
  function setupCodeCopyButtons() {
    const codeBlocks = Array.from(document.querySelectorAll('pre.ipsCode, div.ipsCode, pre > code'));
    if (codeBlocks.length === 0) return;

    const BATCH_SIZE = 15;
    let index = 0;

    function processBatch() {
      const end = Math.min(index + BATCH_SIZE, codeBlocks.length);
      for (let i = index; i < end; i++) {
        const block = codeBlocks[i];
        const container = block.parentElement?.tagName === 'PRE' ? block.parentElement : block;

        if (container.classList.contains('tv-code-container')) continue;
        container.classList.add('tv-code-container');

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tv-copy-btn';
        btn.setAttribute('aria-label', 'Copy code snippet');
        btn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span>Copy</span>
        `;

        btn.addEventListener('click', async (e) => {
          e.preventDefault();
          e.stopPropagation();
          const codeText = block.innerText || block.textContent || '';
          try {
            await navigator.clipboard.writeText(codeText.trim());
            btn.classList.add('copied');
            btn.querySelector('span').textContent = 'Copied!';
            setTimeout(() => {
              btn.classList.remove('copied');
              btn.querySelector('span').textContent = 'Copy';
            }, 1800);
          } catch (err) {
            console.error('[ThemeVault] Clipboard write failed:', err);
          }
        });

        container.appendChild(btn);
      }

      index = end;
      if (index < codeBlocks.length) {
        requestAnimationFrame(processBatch);
      }
    }

    requestAnimationFrame(processBatch);
  }

  // Hook into DOM ready state
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fullInit, { once: true });
  } else {
    fullInit();
  }

  /**
   * Listen for messages from popup or options page (e.g. live preview, theme switch).
   */
  webext.runtime.onMessage.addListener((message, sender, sendResponse) => {
    (async () => {
      switch (message.type) {
        case 'GET_STATUS': {
          const detection = IPSDetector.detect();
          const config = await StorageManager.getSiteConfig(domain);
          const allThemes = await StorageManager.getAllThemes();
          const currentTheme = allThemes.find((t) => t.id === config.themeId) || allThemes[0];
          sendResponse({
            isIPS: detection.isIPS || config.forceIPS,
            isForceEnabled: config.forceIPS,
            confidence: detection.confidence,
            version: detection.version,
            versionLabel: detection.versionLabel,
            domain,
            activeTheme: currentTheme,
            config,
            allThemes
          });
          break;
        }

        case 'APPLY_THEME_LIVE': {
          const theme = await StorageManager.getThemeById(message.themeId);
          if (theme?.css) {
            StyleInjector.applyThemeCSS(theme.css);
            StyleInjector.applyCustomCSS(message.customCss);
            StyleInjector.applyVariableOverrides({
              accentColor: message.accentOverride
            });
            activeTheme = theme;
            showToast(`Applied "${theme.name}"`);
          }
          sendResponse({ success: true });
          break;
        }

        case 'UPDATE_QOL_LIVE': {
          StyleInjector.applyQoLTweaks(message.qolTweaks);
          if (message.qolTweaks?.codeCopy) {
            setupCodeCopyButtons();
          }
          sendResponse({ success: true });
          break;
        }

        case 'TOGGLE_SITE_ENABLED': {
          if (message.enabled) {
            await fullInit();
            showToast('ThemeVault Enabled');
          } else {
            StyleInjector.removeAll();
            showToast('ThemeVault Disabled on this site');
          }
          sendResponse({ success: true });
          break;
        }

        default:
          sendResponse({ unknown: true });
      }
    })();
    return true; // Keep channel open for async response
  });
})();
