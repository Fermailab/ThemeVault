// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 ThemeVault Contributors

/**
 * Options and Dashboard Controller for ThemeVault.
 * Full theme studio, custom CSS editor, per-site rule management, and vault backup.
 */

document.addEventListener('DOMContentLoaded', async () => {
  'use strict';

  // Navigation Tabs
  const navItems = document.querySelectorAll('.nav-item');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const viewTitle = document.getElementById('view-title');
  const viewDesc = document.getElementById('view-desc');
  const optionsToast = document.getElementById('options-toast');

  // Vault Tab Elements
  const themesGrid = document.getElementById('themes-grid');
  const searchThemes = document.getElementById('search-themes');
  const globalDefaultSelect = document.getElementById('global-default-select');
  const btnCreateTheme = document.getElementById('btn-create-theme');

  // Studio Elements
  const studioName = document.getElementById('studio-name');
  const studioDesc = document.getElementById('studio-desc');
  const studioAuthor = document.getElementById('studio-author');
  const tokenBg = document.getElementById('token-bg');
  const tokenSurface = document.getElementById('token-surface');
  const tokenPrimary = document.getElementById('token-primary');
  const tokenText = document.getElementById('token-text');
  const hexBg = document.getElementById('hex-bg');
  const hexSurface = document.getElementById('hex-surface');
  const hexPrimary = document.getElementById('hex-primary');
  const hexText = document.getElementById('hex-text');
  const studioCss = document.getElementById('studio-css');
  const btnSaveStudioTheme = document.getElementById('btn-save-studio-theme');
  const btnInsertBoilerplate = document.getElementById('btn-insert-boilerplate');

  // Site Rules Elements
  const sitesTableBody = document.getElementById('sites-table-body');
  const newSiteDomain = document.getElementById('new-site-domain');
  const btnAddSite = document.getElementById('btn-add-site');

  // Backup Elements
  const btnExportVault = document.getElementById('btn-export-vault');
  const importVaultFile = document.getElementById('import-vault-file');
  const btnResetFactory = document.getElementById('btn-reset-factory');

  let globalSettings = null;
  let allThemes = [];
  let siteOverrides = {};
  let currentEditingThemeId = null;

  /**
   * Show notification toast.
   */
  function showToast(msg) {
    optionsToast.textContent = msg;
    optionsToast.classList.add('show');
    setTimeout(() => {
      optionsToast.classList.remove('show');
    }, 2800);
  }

  /**
   * Switch active tab.
   */
  function switchTab(tabId) {
    navItems.forEach((btn) => btn.classList.toggle('active', btn.dataset.tab === tabId));
    tabPanes.forEach((pane) => pane.classList.toggle('active', pane.id === tabId));

    if (tabId === 'tab-vault') {
      viewTitle.textContent = 'Theme Vault';
      viewDesc.textContent = 'Browse, apply, and manage community themes across any Invision Community forum.';
    } else if (tabId === 'tab-studio') {
      viewTitle.textContent = 'Theme Studio & CSS Editor';
      viewDesc.textContent = 'Design custom themes, tweak color tokens, and write targeted CSS overrides for IPS forums.';
    } else if (tabId === 'tab-sites') {
      viewTitle.textContent = 'Managed Site Rules';
      viewDesc.textContent = 'Configure per-domain theme overrides, custom CSS, and forced IPS activation.';
    } else if (tabId === 'tab-backup') {
      viewTitle.textContent = 'Backup & Portability';
      viewDesc.textContent = 'Export, import, or reset your vault presets and forum configurations.';
    }
  }

  navItems.forEach((item) => {
    item.addEventListener('click', () => switchTab(item.dataset.tab));
  });

  btnCreateTheme.addEventListener('click', () => {
    resetStudioForm();
    switchTab('tab-studio');
  });

  /**
   * Load data from storage.
   */
  async function loadData() {
    globalSettings = await StorageManager.getGlobalSettings();
    allThemes = await StorageManager.getAllThemes();
    siteOverrides = await StorageManager.getSiteOverrides();

    renderVault();
    renderSitesTable();
  }

  /**
   * Render Theme Vault Tab
   */
  function renderVault(filterQuery = '') {
    themesGrid.innerHTML = '';
    globalDefaultSelect.innerHTML = '';

    const query = filterQuery.toLowerCase().trim();
    const filteredThemes = allThemes.filter((t) => {
      if (!query) return true;
      return (t.name?.toLowerCase().includes(query) || t.author?.toLowerCase().includes(query) || t.description?.toLowerCase().includes(query));
    });

    // Populate Default Select dropdown
    allThemes.forEach((t) => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = `${t.name}${t.isBuiltIn ? '' : ' (Custom)'}`;
      if (t.id === globalSettings.defaultThemeId) {
        opt.selected = true;
      }
      globalDefaultSelect.appendChild(opt);
    });

    filteredThemes.forEach((t) => {
      const isDefault = t.id === globalSettings.defaultThemeId;
      const card = document.createElement('div');
      card.className = `theme-card ${isDefault ? 'is-active-default' : ''}`;

      const bg = t.colors?.bg || '#1e1e2e';
      const surface = t.colors?.surface || '#282a36';
      const primary = t.colors?.primary || '#38bdf8';
      const text = t.colors?.text || '#ffffff';

      card.innerHTML = `
        <div class="theme-card-banner" style="background: linear-gradient(135deg, ${bg} 0%, ${surface} 100%);">
          <div class="theme-swatches">
            <span class="card-swatch" style="background: ${bg};" title="Background"></span>
            <span class="card-swatch" style="background: ${surface};" title="Surface"></span>
            <span class="card-swatch" style="background: ${primary};" title="Primary Accent"></span>
            <span class="card-swatch" style="background: ${text};" title="Text"></span>
          </div>
          <span class="theme-badge ${isDefault ? 'default-badge' : ''}">${isDefault ? 'Global Default' : (t.isBuiltIn ? 'Built-in' : 'Custom')}</span>
        </div>
        <div class="theme-card-body">
          <div class="theme-card-header">
            <h3 class="theme-name">${t.name}</h3>
          </div>
          <p class="theme-desc">${t.description || 'No description provided.'}</p>
          <span class="theme-meta">By ${t.author || 'Anonymous'}</span>
        </div>
        <div class="theme-card-footer">
          <button type="button" class="btn btn-sm btn-secondary btn-duplicate" data-id="${t.id}">Duplicate & Edit</button>
          <div>
            ${!isDefault ? `<button type="button" class="btn btn-sm btn-primary btn-set-default" data-id="${t.id}">Set Default</button>` : ''}
            ${!t.isBuiltIn ? `<button type="button" class="btn btn-sm btn-danger btn-delete-theme" data-id="${t.id}">Delete</button>` : ''}
          </div>
        </div>
      `;

      // Event Listeners for Card buttons
      card.querySelector('.btn-duplicate').addEventListener('click', () => {
        duplicateAndEditTheme(t);
      });

      const btnSetDefault = card.querySelector('.btn-set-default');
      if (btnSetDefault) {
        btnSetDefault.addEventListener('click', async () => {
          globalSettings.defaultThemeId = t.id;
          await StorageManager.saveGlobalSettings({ defaultThemeId: t.id });
          showToast(`"${t.name}" set as global default theme.`);
          renderVault(searchThemes.value);
        });
      }

      const btnDelete = card.querySelector('.btn-delete-theme');
      if (btnDelete) {
        btnDelete.addEventListener('click', async () => {
          if (confirm(`Are you sure you want to delete custom theme "${t.name}"?`)) {
            await StorageManager.deleteCustomTheme(t.id);
            allThemes = await StorageManager.getAllThemes();
            showToast(`Theme "${t.name}" deleted.`);
            renderVault(searchThemes.value);
          }
        });
      }

      themesGrid.appendChild(card);
    });
  }

  // Search input handler
  searchThemes.addEventListener('input', (e) => {
    renderVault(e.target.value);
  });

  // Global default dropdown change
  globalDefaultSelect.addEventListener('change', async (e) => {
    const themeId = e.target.value;
    globalSettings.defaultThemeId = themeId;
    await StorageManager.saveGlobalSettings({ defaultThemeId: themeId });
    showToast('Global default theme updated.');
    renderVault(searchThemes.value);
  });

  /**
   * Theme Studio Logic
   */
  function syncColorPickers() {
    hexBg.textContent = tokenBg.value;
    hexSurface.textContent = tokenSurface.value;
    hexPrimary.textContent = tokenPrimary.value;
    hexText.textContent = tokenText.value;
  }

  [tokenBg, tokenSurface, tokenPrimary, tokenText].forEach((input) => {
    input.addEventListener('input', syncColorPickers);
  });

  function resetStudioForm() {
    currentEditingThemeId = null;
    studioName.value = '';
    studioDesc.value = '';
    studioAuthor.value = '';
    tokenBg.value = '#1e1e2e';
    tokenSurface.value = '#282a36';
    tokenPrimary.value = '#38bdf8';
    tokenText.value = '#f8fafc';
    studioCss.value = '';
    syncColorPickers();
  }

  function duplicateAndEditTheme(theme) {
    currentEditingThemeId = null; // New clone
    studioName.value = `${theme.name} (Copy)`;
    studioDesc.value = theme.description || '';
    studioAuthor.value = theme.author || '';
    if (theme.colors) {
      tokenBg.value = theme.colors.bg || '#1e1e2e';
      tokenSurface.value = theme.colors.surface || '#282a36';
      tokenPrimary.value = theme.colors.primary || '#38bdf8';
      tokenText.value = theme.colors.text || '#f8fafc';
    }
    studioCss.value = theme.css || '';
    syncColorPickers();
    switchTab('tab-studio');
    showToast(`Loaded "${theme.name}" into Theme Studio.`);
  }

  btnInsertBoilerplate.addEventListener('click', () => {
    const name = studioName.value.trim() || 'Custom Theme';
    const colors = {
      bg: tokenBg.value || '#181825',
      surface: tokenSurface.value || '#1e1e2e',
      surfaceElevated: '#313244',
      border: 'rgba(255, 255, 255, 0.12)',
      text: tokenText.value || '#cdd6f4',
      textMuted: '#a6adc8',
      primary: tokenPrimary.value || '#cba6f7',
      accent: tokenPrimary.value || '#f5c2e7'
    };

    if (typeof buildThemeCSS === 'function') {
      studioCss.value = buildThemeCSS(name, colors).trim();
    } else {
      studioCss.value = `:root {\n  --tv-bg: ${colors.bg};\n  --tv-surface: ${colors.surface};\n  --tv-primary: ${colors.primary};\n  --tv-text: ${colors.text};\n}\nbody.ipsApp { background: var(--tv-bg) !important; color: var(--tv-text) !important; }`;
    }
  });

  btnSaveStudioTheme.addEventListener('click', async () => {
    const name = studioName.value.trim();
    if (!name) {
      alert('Please enter a theme name.');
      return;
    }

    const newTheme = {
      id: currentEditingThemeId || 'custom-' + Date.now().toString(36),
      name,
      description: studioDesc.value.trim(),
      author: studioAuthor.value.trim() || 'Custom Author',
      isBuiltIn: false,
      colors: {
        bg: tokenBg.value,
        surface: tokenSurface.value,
        primary: tokenPrimary.value,
        text: tokenText.value
      },
      css: studioCss.value.trim()
    };

    await StorageManager.saveCustomTheme(newTheme);
    allThemes = await StorageManager.getAllThemes();
    showToast(`Theme "${name}" saved to vault!`);
    renderVault();
    switchTab('tab-vault');
  });

  /**
   * Site Rules Management
   */
  function renderSitesTable() {
    sitesTableBody.innerHTML = '';
    const domains = Object.keys(siteOverrides);

    if (domains.length === 0) {
      sitesTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 24px;">
            No forum site rules registered yet. Any detected Invision Community site will use your global default theme automatically.
          </td>
        </tr>
      `;
      return;
    }

    domains.forEach((dom) => {
      const config = siteOverrides[dom] || {};
      const row = document.createElement('tr');

      row.innerHTML = `
        <td><strong>${dom}</strong></td>
        <td>
          <select class="select-inline site-theme-select" data-domain="${dom}">
            ${allThemes.map((t) => `<option value="${t.id}" ${t.id === (config.themeId || globalSettings.defaultThemeId) ? 'selected' : ''}>${t.name}</option>`).join('')}
          </select>
        </td>
        <td>
          <label class="switch" style="transform: scale(0.85); transform-origin: left center;">
            <input type="checkbox" class="site-enabled-check" data-domain="${dom}" ${config.enabled !== false ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </td>
        <td>
          <input type="checkbox" class="site-force-check" data-domain="${dom}" ${config.forceIPS ? 'checked' : ''}>
        </td>
        <td>
          <button type="button" class="btn btn-sm btn-danger btn-remove-site" data-domain="${dom}">Remove</button>
        </td>
      `;

      row.querySelector('.site-theme-select').addEventListener('change', async (e) => {
        await StorageManager.saveSiteConfig(dom, { themeId: e.target.value });
        showToast(`Theme for ${dom} updated.`);
      });

      row.querySelector('.site-enabled-check').addEventListener('change', async (e) => {
        await StorageManager.saveSiteConfig(dom, { enabled: e.target.checked });
        showToast(`${dom} ${e.target.checked ? 'enabled' : 'disabled'}.`);
      });

      row.querySelector('.site-force-check').addEventListener('change', async (e) => {
        await StorageManager.saveSiteConfig(dom, { forceIPS: e.target.checked });
        showToast(`Forced IPS mode ${e.target.checked ? 'activated' : 'deactivated'} for ${dom}.`);
      });

      row.querySelector('.btn-remove-site').addEventListener('click', async () => {
        if (confirm(`Remove custom rules for ${dom}? It will revert to global settings.`)) {
          await StorageManager.removeSiteConfig(dom);
          siteOverrides = await StorageManager.getSiteOverrides();
          renderSitesTable();
          showToast(`Rules for ${dom} removed.`);
        }
      });

      sitesTableBody.appendChild(row);
    });
  }

  btnAddSite.addEventListener('click', async () => {
    let domain = newSiteDomain.value.trim().toLowerCase();
    if (!domain) return;
    try {
      if (domain.startsWith('http://') || domain.startsWith('https://')) {
        domain = new URL(domain).hostname;
      }
    } catch {}

    await StorageManager.saveSiteConfig(domain, {
      enabled: true,
      forceIPS: true,
      themeId: globalSettings.defaultThemeId
    });

    newSiteDomain.value = '';
    siteOverrides = await StorageManager.getSiteOverrides();
    renderSitesTable();
    showToast(`Added rule for ${domain}`);
  });

  /**
   * Backup & Sync Logic
   */
  btnExportVault.addEventListener('click', async () => {
    const jsonStr = await StorageManager.exportVault();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `themevault-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Vault backup downloaded!');
  });

  importVaultFile.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      await StorageManager.importVault(text, true);
      await loadData();
      showToast('Vault backup imported successfully!');
    } catch (err) {
      alert(`Import failed: ${err.message}`);
    }
  });

  btnResetFactory.addEventListener('click', async () => {
    if (confirm('Are you sure you want to reset ThemeVault to factory defaults? All custom themes and site rules will be cleared.')) {
      await webext.storage.local.clear();
      await loadData();
      showToast('ThemeVault reset to factory defaults.');
    }
  });

  // Initial load
  await loadData();
});
