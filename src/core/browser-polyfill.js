// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 ThemeVault Contributors

/**
 * Universal browser API polyfill for ThemeVault.
 * Provides a standardized promise-based abstraction across Chromium (Chrome, Edge,
 * Brave, Opera), Mozilla Firefox, and Safari WebExtensions.
 */

(function (global) {
  'use strict';

  if (global.webext) {
    return;
  }

  const rawChrome = typeof chrome !== 'undefined' ? chrome : undefined;
  const rawBrowser = typeof browser !== 'undefined' ? browser : undefined;

  /**
   * Wraps a chrome callback-based or promise-based method into a reliable Promise.
   * @param {Object} target API namespace (e.g. chrome.storage.local)
   * @param {string} methodName Method name (e.g. 'get')
   * @param {Array} args Arguments array
   * @returns {Promise<any>}
   */
  function promisify(target, methodName, args) {
    if (!target || typeof target[methodName] !== 'function') {
      return Promise.reject(new Error(`API method ${methodName} is not available.`));
    }

    try {
      const result = target[methodName](...args);
      // Modern Chrome & Firefox return a Promise directly
      if (result && typeof result.then === 'function') {
        return result;
      }
    } catch (err) {
      // If passing no callback triggered an error, fall back to callback mode below
    }

    return new Promise((resolve, reject) => {
      try {
        target[methodName](...args, (...callbackArgs) => {
          const lastErr = rawChrome?.runtime?.lastError || rawBrowser?.runtime?.lastError;
          if (lastErr) {
            reject(new Error(lastErr.message || String(lastErr)));
          } else {
            resolve(callbackArgs.length <= 1 ? callbackArgs[0] : callbackArgs);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  const webext = {
    isFirefox: typeof navigator !== 'undefined' && /firefox/i.test(navigator.userAgent),
    isChromium: typeof navigator !== 'undefined' && /chrome|chromium|edg/i.test(navigator.userAgent),
    isSafari: typeof navigator !== 'undefined' && /safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent),

    storage: {
      local: {
        get: (keys) => promisify((rawBrowser?.storage?.local || rawChrome?.storage?.local), 'get', [keys]),
        set: (items) => promisify((rawBrowser?.storage?.local || rawChrome?.storage?.local), 'set', [items]),
        remove: (keys) => promisify((rawBrowser?.storage?.local || rawChrome?.storage?.local), 'remove', [keys]),
        clear: () => promisify((rawBrowser?.storage?.local || rawChrome?.storage?.local), 'clear', [])
      },
      sync: {
        get: async (keys) => {
          const target = (rawBrowser?.storage?.sync || rawChrome?.storage?.sync);
          if (!target) return webext.storage.local.get(keys);
          try {
            return await promisify(target, 'get', [keys]);
          } catch {
            return webext.storage.local.get(keys);
          }
        },
        set: async (items) => {
          const target = (rawBrowser?.storage?.sync || rawChrome?.storage?.sync);
          if (!target) return webext.storage.local.set(items);
          try {
            return await promisify(target, 'set', [items]);
          } catch {
            return webext.storage.local.set(items);
          }
        },
        remove: (keys) => {
          const target = (rawBrowser?.storage?.sync || rawChrome?.storage?.sync);
          return promisify(target || rawChrome?.storage?.local, 'remove', [keys]);
        },
        clear: () => {
          const target = (rawBrowser?.storage?.sync || rawChrome?.storage?.sync);
          return promisify(target || rawChrome?.storage?.local, 'clear', []);
        }
      }
    },

    tabs: {
      query: (queryInfo) => promisify((rawBrowser?.tabs || rawChrome?.tabs), 'query', [queryInfo]),
      sendMessage: (tabId, message, options = {}) => promisify((rawBrowser?.tabs || rawChrome?.tabs), 'sendMessage', [tabId, message, options]),
      create: (props) => promisify((rawBrowser?.tabs || rawChrome?.tabs), 'create', [props]),
      update: (tabId, props) => promisify((rawBrowser?.tabs || rawChrome?.tabs), 'update', [tabId, props])
    },

    runtime: {
      sendMessage: (message, options) => promisify((rawBrowser?.runtime || rawChrome?.runtime), 'sendMessage', options ? [message, options] : [message]),
      getURL: (path) => (rawBrowser?.runtime?.getURL || rawChrome?.runtime?.getURL)?.(path) || path,
      getManifest: () => (rawBrowser?.runtime?.getManifest || rawChrome?.runtime?.getManifest)?.() || {},
      onMessage: (rawBrowser?.runtime?.onMessage || rawChrome?.runtime?.onMessage),
      onInstalled: (rawBrowser?.runtime?.onInstalled || rawChrome?.runtime?.onInstalled),
      openOptionsPage: () => promisify((rawBrowser?.runtime || rawChrome?.runtime), 'openOptionsPage', [])
    },

    action: {
      setBadgeText: (details) => promisify((rawBrowser?.action || rawChrome?.action || rawBrowser?.browserAction || rawChrome?.browserAction), 'setBadgeText', [details]),
      setBadgeBackgroundColor: (details) => promisify((rawBrowser?.action || rawChrome?.action || rawBrowser?.browserAction || rawChrome?.browserAction), 'setBadgeBackgroundColor', [details]),
      setTitle: (details) => promisify((rawBrowser?.action || rawChrome?.action || rawBrowser?.browserAction || rawChrome?.browserAction), 'setTitle', [details]),
      setIcon: (details) => promisify((rawBrowser?.action || rawChrome?.action || rawBrowser?.browserAction || rawChrome?.browserAction), 'setIcon', [details])
    }
  };

  global.webext = webext;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = webext;
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
