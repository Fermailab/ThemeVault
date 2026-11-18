// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 ThemeVault Contributors

/**
 * Storage Manager for ThemeVault.
 * Provides typed persistence for global preferences, site profiles, and the custom theme vault.
 */

(function (global) {
  'use strict';

  const STORAGE_KEYS = {
    GLOBAL_SETTINGS: 'tv_global_settings',
    SITE_OVERRIDES: 'tv_site_overrides',
    CUSTOM_THEMES: 'tv_custom_themes'
  };

  const DEFAULT_SETTINGS = {
    enabled: true,
    defaultThemeId: 'nord-frost',
    autoDetect: true,
    accentOverride: null,
    fontOverride: null,
    qolTweaks: {
      cleanReading: false,
      stickyHeader: true,
      compactCards: false,
      codeCopy: true,
      darkMedia: false,
      expandQuotes: false
    }
  };

  class StorageManager {
    static get api() {
      if (global.webext?.storage?.local) return global.webext.storage.local;
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        return {
          get: (keys) => new Promise((resolve) => chrome.storage.local.get(keys, resolve)),
          set: (items) => new Promise((resolve) => chrome.storage.local.set(items, resolve)),
          remove: (keys) => new Promise((resolve) => chrome.storage.local.remove(keys, resolve)),
          clear: () => new Promise((resolve) => chrome.storage.local.clear(resolve))
        };
      }
      // In-memory fallback
      return {
        _mem: {},
        get: async (keys) => {
          if (typeof keys === 'string') return { [keys]: this._mem?.[keys] };
          return this._mem || {};
        },
        set: async (items) => Object.assign(this._mem || (this._mem = {}), items),
        remove: async (key) => delete this._mem?.[key],
        clear: async () => { this._mem = {}; }
      };
    }

    /**
     * Retrieve global settings merged with defaults.
     * @returns {Promise<Object>}
     */
    static async getGlobalSettings() {
      const data = await this.api.get(STORAGE_KEYS.GLOBAL_SETTINGS);
      const saved = data[STORAGE_KEYS.GLOBAL_SETTINGS] || {};
      return {
        ...DEFAULT_SETTINGS,
        ...saved,
        qolTweaks: {
          ...DEFAULT_SETTINGS.qolTweaks,
          ...(saved.qolTweaks || {})
        }
      };
    }

    /**
     * Save updates to global settings.
     * @param {Object} patch 
     * @returns {Promise<Object>} Updated settings
     */
    static async saveGlobalSettings(patch) {
      const current = await this.getGlobalSettings();
      const updated = {
        ...current,
        ...patch,
        qolTweaks: {
          ...current.qolTweaks,
          ...(patch.qolTweaks || {})
        }
      };
      await this.api.set({ [STORAGE_KEYS.GLOBAL_SETTINGS]: updated });
      return updated;
    }

    /**
     * Retrieve site overrides map.
     * @returns {Promise<Object>}
     */
    static async getSiteOverrides() {
      const data = await this.api.get(STORAGE_KEYS.SITE_OVERRIDES);
      return data[STORAGE_KEYS.SITE_OVERRIDES] || {};
    }

    /**
     * Retrieve active configuration for a specific domain.
     * @param {string} domain 
     * @returns {Promise<Object>}
     */
    static async getSiteConfig(domain) {
      const globalSettings = await this.getGlobalSettings();
      const overrides = await this.getSiteOverrides();
      const site = overrides[domain] || {};

      return {
        domain,
        enabled: site.enabled !== undefined ? site.enabled : globalSettings.enabled,
        themeId: site.themeId || globalSettings.defaultThemeId,
        forceIPS: Boolean(site.forceIPS),
        customCss: site.customCss || '',
        qolTweaks: {
          ...globalSettings.qolTweaks,
          ...(site.qolTweaks || {})
        },
        accentOverride: site.accentOverride !== undefined ? site.accentOverride : globalSettings.accentOverride,
        hasSiteSpecificRules: Boolean(overrides[domain])
      };
    }

    /**
     * Save site-specific configuration.
     * @param {string} domain 
     * @param {Object} patch 
     */
    static async saveSiteConfig(domain, patch) {
      if (!domain) return;
      const overrides = await this.getSiteOverrides();
      overrides[domain] = {
        ...(overrides[domain] || {}),
        ...patch,
        updatedAt: Date.now()
      };
      await this.api.set({ [STORAGE_KEYS.SITE_OVERRIDES]: overrides });
    }

    /**
     * Remove site-specific configuration (reverts to global).
     * @param {string} domain 
     */
    static async removeSiteConfig(domain) {
      if (!domain) return;
      const overrides = await this.getSiteOverrides();
      delete overrides[domain];
      await this.api.set({ [STORAGE_KEYS.SITE_OVERRIDES]: overrides });
    }

    /**
     * Retrieve all custom themes stored in the vault.
     * @returns {Promise<Array>}
     */
    static async getCustomThemes() {
      const data = await this.api.get(STORAGE_KEYS.CUSTOM_THEMES);
      return data[STORAGE_KEYS.CUSTOM_THEMES] || [];
    }

    /**
     * Retrieve all available themes (built-in + custom vault themes).
     * @returns {Promise<Array>}
     */
    static async getAllThemes() {
      const builtIns = global.DEFAULT_THEMES || [];
      const custom = await this.getCustomThemes();
      return [...builtIns, ...custom];
    }

    /**
     * Look up theme by ID.
     * @param {string} themeId 
     * @returns {Promise<Object|null>}
     */
    static async getThemeById(themeId) {
      const all = await this.getAllThemes();
      return all.find((t) => t.id === themeId) || all[0] || null;
    }

    /**
     * Save or update a custom theme in the vault.
     * @param {Object} theme 
     */
    static async saveCustomTheme(theme) {
      if (!theme.id) {
        theme.id = 'custom-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
      }
      theme.isBuiltIn = false;
      theme.updatedAt = Date.now();

      const customThemes = await this.getCustomThemes();
      const existingIdx = customThemes.findIndex((t) => t.id === theme.id);

      if (existingIdx >= 0) {
        customThemes[existingIdx] = theme;
      } else {
        customThemes.push(theme);
      }

      await this.api.set({ [STORAGE_KEYS.CUSTOM_THEMES]: customThemes });
      return theme;
    }

    /**
     * Delete a custom theme from the vault.
     * @param {string} themeId 
     */
    static async deleteCustomTheme(themeId) {
      const customThemes = await this.getCustomThemes();
      const filtered = customThemes.filter((t) => t.id !== themeId);
      await this.api.set({ [STORAGE_KEYS.CUSTOM_THEMES]: filtered });
    }

    /**
     * Export all user vault data as a clean JSON backup.
     * @returns {Promise<string>} JSON string
     */
    static async exportVault() {
      const globalSettings = await this.getGlobalSettings();
      const siteOverrides = await this.getSiteOverrides();
      const customThemes = await this.getCustomThemes();

      const exportPayload = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        application: 'ThemeVault',
        license: 'GPL-3.0-or-later',
        globalSettings,
        siteOverrides,
        customThemes
      };

      return JSON.stringify(exportPayload, null, 2);
    }

    /**
     * Import vault data from a JSON string.
     * @param {string} jsonString 
     * @param {boolean} merge If true, merges instead of full overwrite
     */
    static async importVault(jsonString, merge = true) {
      const payload = JSON.parse(jsonString);

      if (!payload.application || payload.application !== 'ThemeVault') {
        throw new Error('Invalid ThemeVault backup file format.');
      }

      if (merge) {
        if (payload.globalSettings) {
          await this.saveGlobalSettings(payload.globalSettings);
        }
        if (payload.siteOverrides) {
          const current = await this.getSiteOverrides();
          await this.api.set({ [STORAGE_KEYS.SITE_OVERRIDES]: { ...current, ...payload.siteOverrides } });
        }
        if (Array.isArray(payload.customThemes)) {
          const current = await this.getCustomThemes();
          const map = new Map(current.map((t) => [t.id, t]));
          for (const theme of payload.customThemes) {
            map.set(theme.id, theme);
          }
          await this.api.set({ [STORAGE_KEYS.CUSTOM_THEMES]: Array.from(map.values()) });
        }
      } else {
        await this.api.set({
          [STORAGE_KEYS.GLOBAL_SETTINGS]: payload.globalSettings || DEFAULT_SETTINGS,
          [STORAGE_KEYS.SITE_OVERRIDES]: payload.siteOverrides || {},
          [STORAGE_KEYS.CUSTOM_THEMES]: payload.customThemes || []
        });
      }
    }
  }

  global.StorageManager = StorageManager;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
