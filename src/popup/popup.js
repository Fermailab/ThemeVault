// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 ThemeVault Contributors

/**
 * Popup Controller for ThemeVault.
 * Provides instant live theming, Invision Community detection status, and quick QoL switches.
 */

document.addEventListener('DOMContentLoaded', async () => {
  'use strict';

  // Elements
  const siteMasterToggle = document.getElementById('site-master-toggle');
  const statusCard = document.getElementById('status-card');
  const statusDot = document.getElementById('status-dot');
  const statusLabel = document.getElementById('status-label');
  const statusDomain = document.getElementById('status-domain');
  const btnForceIPS = document.getElementById('btn-force-ips');
  const themeSelect = document.getElementById('theme-select');
  const themeCountBadge = document.getElementById('theme-count-badge');
  const mainControls = document.getElementById('main-controls');
  const btnOpenOptions = document.getElementById('btn-open-options');
  const btnResetAccent = document.getElementById('btn-reset-accent');
  const accentCustomColor = document.getElementById('accent-custom-color');
  const accentButtons = document.querySelectorAll('.accent-btn');

  // Swatches
  const swatchBg = document.getElementById('swatch-bg');
  const swatchSurface = document.getElementById('swatch-surface');
  const swatchPrimary = document.getElementById('swatch-primary');
  const swatchText = document.getElementById('swatch-text');

  // QoL Checkboxes
  const tweakSticky = document.getElementById('tweak-stickyHeader');
  const tweakClean = document.getElementById('tweak-cleanReading');
  const tweakCopy = document.getElementById('tweak-codeCopy');
  const tweakCompact = document.getElementById('tweak-compactCards');
  const tweakMedia = document.getElementById('tweak-darkMedia');

  let currentTab = null;
  let currentDomain = '';
  let siteConfig = null;
  let availableThemes = [];

  /**
   * Initialize popup state from active tab and storage.
   */
  async function init() {
    try {
      const [tab] = await webext.tabs.query({ active: true, currentWindow: true });
      currentTab = tab;

      if (!tab?.url || tab.url.startsWith('chrome://') || tab.url.startsWith('about:') || tab.url.startsWith('edge://')) {
        renderNonWebPage();
        return;
      }

      const urlObj = new URL(tab.url);
      currentDomain = urlObj.hostname;
      statusDomain.textContent = currentDomain;

      // Load configurations
      siteConfig = await StorageManager.getSiteConfig(currentDomain);
      availableThemes = await StorageManager.getAllThemes();

      // Populate theme select dropdown
      renderThemeOptions();

      // Set initial UI values
      siteMasterToggle.checked = siteConfig.enabled;
      applyQoLUIChecks(siteConfig.qolTweaks);
      updateAccentUI(siteConfig.accentOverride);

      // Probe active tab's content script for live Invision Community status
      try {
        const response = await webext.tabs.sendMessage(tab.id, { type: 'GET_STATUS' });
        if (response) {
          renderDetectionStatus(response);
        } else {
          renderFallbackStatus();
        }
      } catch {
        renderFallbackStatus();
      }
    } catch (err) {
      console.error('[ThemeVault Popup] Initialization error:', err);
      renderFallbackStatus();
    }
  }

  /**
   * Render state when on internal browser pages.
   */
  function renderNonWebPage() {
    statusDot.className = 'status-dot';
    statusLabel.textContent = 'Browser Internal Page';
    statusDomain.textContent = 'Active tab is not a website';
    mainControls.style.opacity = '0.5';
    mainControls.style.pointerEvents = 'none';
  }

  /**
   * Render detection result returned from content script.
   */
  function renderDetectionStatus(info) {
    if (info.isIPS) {
      statusDot.className = 'status-dot detected';
      statusLabel.textContent = info.versionLabel || 'Invision Community Detected';
      btnForceIPS.style.display = 'none';
    } else {
      statusDot.className = 'status-dot not-detected';
      statusLabel.textContent = 'Not Invision Community';
      btnForceIPS.style.display = 'inline-block';
    }
  }

  /**
   * Render fallback status if content script didn't reply directly.
   */
  function renderFallbackStatus() {
    if (siteConfig?.forceIPS) {
      statusDot.className = 'status-dot detected';
      statusLabel.textContent = 'Forced Invision Community Mode';
      btnForceIPS.style.display = 'none';
    } else {
      statusDot.className = 'status-dot not-detected';
      statusLabel.textContent = 'Standby / Manual Site';
      btnForceIPS.style.display = 'inline-block';
    }
  }

  /**
   * Populate theme select dropdown and update palette swatches.
   */
  function renderThemeOptions() {
    themeSelect.innerHTML = '';
    themeCountBadge.textContent = `${availableThemes.length} Themes`;

    availableThemes.forEach((t) => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = `${t.name}${t.isBuiltIn ? '' : ' (Custom)'}`;
      if (t.id === siteConfig.themeId) {
        opt.selected = true;
      }
      themeSelect.appendChild(opt);
    });

    updatePaletteSwatches(siteConfig.themeId);
  }

  /**
   * Update the preview palette swatches based on selected theme.
   */
  function updatePaletteSwatches(themeId) {
    const theme = availableThemes.find((t) => t.id === themeId) || availableThemes[0];
    if (theme?.colors) {
      swatchBg.style.backgroundColor = theme.colors.bg || '#1e1e2e';
      swatchSurface.style.backgroundColor = theme.colors.surface || '#282a36';
      swatchPrimary.style.backgroundColor = siteConfig.accentOverride || theme.colors.primary || '#38bdf8';
      swatchText.style.backgroundColor = theme.colors.text || '#ffffff';
    }
  }

  /**
   * Reflect current QoL tweaks in checkboxes.
   */
  function applyQoLUIChecks(tweaks = {}) {
    tweakSticky.checked = Boolean(tweaks.stickyHeader);
    tweakClean.checked = Boolean(tweaks.cleanReading);
    tweakCopy.checked = Boolean(tweaks.codeCopy);
    tweakCompact.checked = Boolean(tweaks.compactCards);
    tweakMedia.checked = Boolean(tweaks.darkMedia);
  }

  /**
   * Update accent picker button states.
   */
  function updateAccentUI(accent) {
    accentButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.color.toLowerCase() === accent?.toLowerCase());
    });
    if (accent) {
      accentCustomColor.value = accent;
    }
  }

  /**
   * Event Handlers
   */

  // Master Enable/Disable for current domain
  siteMasterToggle.addEventListener('change', async () => {
    const enabled = siteMasterToggle.checked;
    siteConfig.enabled = enabled;
    await StorageManager.saveSiteConfig(currentDomain, { enabled });

    if (currentTab?.id) {
      try {
        await webext.tabs.sendMessage(currentTab.id, {
          type: 'TOGGLE_SITE_ENABLED',
          enabled
        });
      } catch {}
    }
  });

  // Force Enable IPS Mode
  btnForceIPS.addEventListener('click', async () => {
    siteConfig.forceIPS = true;
    siteConfig.enabled = true;
    siteMasterToggle.checked = true;
    await StorageManager.saveSiteConfig(currentDomain, { forceIPS: true, enabled: true });

    statusDot.className = 'status-dot detected';
    statusLabel.textContent = 'Forced Invision Community Mode';
    btnForceIPS.style.display = 'none';

    if (currentTab?.id) {
      try {
        await webext.tabs.sendMessage(currentTab.id, {
          type: 'TOGGLE_SITE_ENABLED',
          enabled: true
        });
      } catch {}
    }
  });

  // Switch Theme
  themeSelect.addEventListener('change', async () => {
    const themeId = themeSelect.value;
    siteConfig.themeId = themeId;
    await StorageManager.saveSiteConfig(currentDomain, { themeId });
    updatePaletteSwatches(themeId);

    if (currentTab?.id) {
      try {
        await webext.tabs.sendMessage(currentTab.id, {
          type: 'APPLY_THEME_LIVE',
          themeId,
          customCss: siteConfig.customCss,
          accentOverride: siteConfig.accentOverride
        });
      } catch {}
    }
  });

  // Preset Accent buttons
  accentButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const color = btn.dataset.color;
      siteConfig.accentOverride = color;
      updateAccentUI(color);
      updatePaletteSwatches(siteConfig.themeId);
      await StorageManager.saveSiteConfig(currentDomain, { accentOverride: color });

      if (currentTab?.id) {
        try {
          await webext.tabs.sendMessage(currentTab.id, {
            type: 'APPLY_THEME_LIVE',
            themeId: siteConfig.themeId,
            customCss: siteConfig.customCss,
            accentOverride: color
          });
        } catch {}
      }
    });
  });

  // Custom Color Input
  accentCustomColor.addEventListener('input', async (e) => {
    const color = e.target.value;
    siteConfig.accentOverride = color;
    updateAccentUI(color);
    updatePaletteSwatches(siteConfig.themeId);
    await StorageManager.saveSiteConfig(currentDomain, { accentOverride: color });

    if (currentTab?.id) {
      try {
        await webext.tabs.sendMessage(currentTab.id, {
          type: 'APPLY_THEME_LIVE',
          themeId: siteConfig.themeId,
          customCss: siteConfig.customCss,
          accentOverride: color
        });
      } catch {}
    }
  });

  // Reset Accent Override
  btnResetAccent.addEventListener('click', async () => {
    siteConfig.accentOverride = null;
    updateAccentUI(null);
    updatePaletteSwatches(siteConfig.themeId);
    await StorageManager.saveSiteConfig(currentDomain, { accentOverride: null });

    if (currentTab?.id) {
      try {
        await webext.tabs.sendMessage(currentTab.id, {
          type: 'APPLY_THEME_LIVE',
          themeId: siteConfig.themeId,
          customCss: siteConfig.customCss,
          accentOverride: null
        });
      } catch {}
    }
  });

  // QoL Checkboxes Handler
  const qolInputs = [
    { el: tweakSticky, key: 'stickyHeader' },
    { el: tweakClean, key: 'cleanReading' },
    { el: tweakCopy, key: 'codeCopy' },
    { el: tweakCompact, key: 'compactCards' },
    { el: tweakMedia, key: 'darkMedia' }
  ];

  qolInputs.forEach(({ el, key }) => {
    el.addEventListener('change', async () => {
      siteConfig.qolTweaks[key] = el.checked;
      await StorageManager.saveSiteConfig(currentDomain, { qolTweaks: siteConfig.qolTweaks });

      if (currentTab?.id) {
        try {
          await webext.tabs.sendMessage(currentTab.id, {
            type: 'UPDATE_QOL_LIVE',
            qolTweaks: siteConfig.qolTweaks
          });
        } catch {}
      }
    });
  });

  // Open Full Options / Theme Vault Studio
  btnOpenOptions.addEventListener('click', async () => {
    await webext.runtime.openOptionsPage();
    window.close();
  });

  // Execute initialization
  await init();
});
