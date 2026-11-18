// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 ThemeVault Contributors

/**
 * Background Service Worker / Background Script for ThemeVault.
 * Handles extension lifecycle, tab badges, context menus, and cross-tab synchronization.
 * Follows ephemeral best practices: all persistent state is maintained in chrome.storage.
 */

// Import polyfill and storage if inside an environment with importScripts
if (typeof importScripts === 'function') {
  try {
    importScripts('../core/browser-polyfill.js');
    importScripts('../core/default-themes.js');
    importScripts('../core/storage.js');
  } catch (err) {
    console.error('[ThemeVault] importScripts failed:', err);
  }
}

/**
 * Handle initial extension installation or update.
 */
webext.runtime.onInstalled.addListener(async (details) => {
  console.log('[ThemeVault] Installed or updated:', details.reason);

  // Initialize storage defaults if empty
  const current = await StorageManager.getGlobalSettings();
  if (!current.defaultThemeId) {
    await StorageManager.saveGlobalSettings({});
  }

  // Set default action badge styling
  try {
    await webext.action.setBadgeBackgroundColor({ color: '#4f46e5' });
  } catch (err) {
    // Action API might vary in early contexts
  }

  // Create context menus if API available
  if (typeof chrome !== 'undefined' && chrome.contextMenus) {
    chrome.contextMenus.removeAll(() => {
      chrome.contextMenus.create({
        id: 'tv-open-vault',
        title: 'ThemeVault: Open Theme Studio',
        contexts: ['page']
      });
      chrome.contextMenus.create({
        id: 'tv-toggle-mode',
        title: 'ThemeVault: Toggle Theme for this Forum',
        contexts: ['page']
      });
    });
  }
});

/**
 * Handle context menu item clicks.
 */
if (typeof chrome !== 'undefined' && chrome.contextMenus) {
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'tv-open-vault') {
      await webext.runtime.openOptionsPage();
    } else if (info.menuItemId === 'tv-toggle-mode' && tab?.id && tab?.url) {
      try {
        const urlObj = new URL(tab.url);
        const domain = urlObj.hostname;
        const config = await StorageManager.getSiteConfig(domain);
        const newEnabled = !config.enabled;
        await StorageManager.saveSiteConfig(domain, { enabled: newEnabled });

        // Inform content script
        await webext.tabs.sendMessage(tab.id, {
          type: 'TOGGLE_SITE_ENABLED',
          enabled: newEnabled
        });
      } catch (err) {
        console.warn('[ThemeVault] Context menu action failed:', err);
      }
    }
  });
}

/**
 * Handle incoming messages from content scripts and popups.
 */
webext.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    if (message.type === 'IPS_DETECTED' && sender.tab?.id) {
      const tabId = sender.tab.id;
      const details = message.details || {};

      try {
        // Set badge indicating detected Invision Community site
        await webext.action.setBadgeText({ tabId, text: 'IPS' });
        await webext.action.setBadgeBackgroundColor({ tabId, color: '#0ea5e9' });
        await webext.action.setTitle({
          tabId,
          title: `ThemeVault: ${details.versionLabel || 'Invision Community'} [Active: ${details.activeThemeName || 'Default'}]`
        });
      } catch (err) {
        // Tab might have closed
      }

      sendResponse({ acknowledged: true });
    } else if (message.type === 'OPEN_OPTIONS') {
      await webext.runtime.openOptionsPage();
      sendResponse({ success: true });
    } else {
      sendResponse({ ok: true });
    }
  })();
  return true; // Keep message port open for async handling
});
