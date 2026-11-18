// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 ThemeVault Contributors

/**
 * Invision Community (IPS / IPB) Site Detector.
 * Identifies whether the current page is running Invision Community (v4.x, v5.x, or legacy IPB).
 * Employs heuristic scoring across meta tags, DOM landmarks, controllers, and script signatures.
 */

(function (global) {
  'use strict';

  class IPSDetector {
    /**
     * Rapid synchronous pre-check designed to run at document_start.
     * Checks early elements like head, meta tags, and root attributes before full DOM parses.
     * @returns {boolean}
     */
    static fastPreCheck() {
      if (typeof document === 'undefined') return false;

      // Meta tag check
      if (document.querySelector('meta[name="ipsApp"], meta[name="generator*=\'Invision\' i]')) {
        return true;
      }

      // Root HTML/Body attributes
      const body = document.body;
      if (body && (body.classList.contains('ipsApp') || body.hasAttribute('data-controller'))) {
        return true;
      }

      return false;
    }

    /**
     * Comprehensive detection check. Runs across DOM, meta tags, script content, and landmarks.
     * @returns {Object} Detailed detection result with confidence score and version info.
     */
    static detect() {
      if (typeof document === 'undefined' || typeof window === 'undefined') {
        return { isIPS: false, confidence: 0, version: 'unknown', signals: [] };
      }

      const signals = [];
      let score = 0;
      let detectedVersion = 'unknown';
      let versionLabel = 'Unknown';

      // 1. Meta tag inspection
      const metaIpsApp = document.querySelector('meta[name="ipsApp"]');
      if (metaIpsApp) {
        score += 45;
        signals.push('meta[name="ipsApp"] detected');
      }

      const metaGenerator = document.querySelector('meta[name="generator"]');
      if (metaGenerator) {
        const content = (metaGenerator.getAttribute('content') || '').toLowerCase();
        if (content.includes('invision community') || content.includes('ips community suite')) {
          score += 45;
          signals.push(`meta[name="generator"]: ${metaGenerator.getAttribute('content')}`);
          if (content.includes(' 5') || content.includes('v5')) {
            detectedVersion = 'ips5';
            versionLabel = 'Invision Community 5';
          } else if (content.includes(' 4') || content.includes('v4')) {
            detectedVersion = 'ips4';
            versionLabel = 'Invision Community 4.x';
          }
        } else if (content.includes('invision power board') || content.includes('ip.board')) {
          score += 40;
          detectedVersion = 'legacy';
          versionLabel = 'IP.Board (Legacy)';
          signals.push(`legacy generator: ${metaGenerator.getAttribute('content')}`);
        }
      }

      // 2. DOM Classes and landmarks (IPS 4.x & 5.x)
      const body = document.body;
      if (body) {
        if (body.classList.contains('ipsApp') || body.classList.contains('ipsApp_front') || body.classList.contains('ipsApp_admin')) {
          score += 35;
          signals.push('body.ipsApp class present');
        }
        if (body.classList.contains('ipsJS_has')) {
          score += 15;
          signals.push('ipsJS_has present');
        }
      }

      // 3. Landmark IDs and specific structural containers
      const landmarks = [
        '#ipsLayout_header',
        '#ipsLayout_contentArea',
        '#ipsLayout_mainArea',
        '#ipsLayout_footer',
        '.ipsLayout_container',
        '.ipsNavBar_primary',
        '.ipsPageHeader',
        '.ipsBox',
        '.ipsDataItem',
        '.ipsType_richText'
      ];

      let landmarkHits = 0;
      for (const sel of landmarks) {
        if (document.querySelector(sel)) {
          landmarkHits++;
        }
      }

      if (landmarkHits > 0) {
        const points = Math.min(landmarkHits * 10, 40);
        score += points;
        signals.push(`Found ${landmarkHits} IPS landmark selector(s)`);
      }

      // 4. Data controllers and data roles
      const controllers = document.querySelectorAll('[data-controller^="core."], [data-controller^="forums."], [data-role="page"], [data-role="contentArea"]');
      if (controllers.length > 0) {
        score += 25;
        signals.push(`Found ${controllers.length} IPS data-controller/data-role element(s)`);
      }

      // 5. Invision Community 5 CSS Variable tokens
      const rootStyles = getComputedStyle(document.documentElement);
      if (rootStyles.getPropertyValue('--i-primary') || rootStyles.getPropertyValue('--i-color--primary')) {
        score += 30;
        detectedVersion = 'ips5';
        versionLabel = 'Invision Community 5';
        signals.push('IC5 CSS custom properties detected (--i-primary)');
      }

      // 6. Script tag heuristic (ipsSettings)
      const scripts = document.getElementsByTagName('script');
      for (let i = 0; i < Math.min(scripts.length, 25); i++) {
        const text = scripts[i].textContent || '';
        if (text.includes('ipsSettings') || text.includes('ips.setSetting') || text.includes('ips.createModel')) {
          score += 30;
          signals.push('Inline script contains ipsSettings');
          break;
        }
      }

      // Final classification
      const confidence = Math.min(score, 100);
      const isIPS = confidence >= 35;

      if (isIPS && detectedVersion === 'unknown') {
        detectedVersion = 'ips4';
        versionLabel = 'Invision Community (IPS 4.x/5.x)';
      }

      return {
        isIPS,
        confidence,
        version: detectedVersion,
        versionLabel,
        signals,
        domain: window.location.hostname,
        url: window.location.href,
        siteTitle: document.title || window.location.hostname
      };
    }
  }

  global.IPSDetector = IPSDetector;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = IPSDetector;
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
