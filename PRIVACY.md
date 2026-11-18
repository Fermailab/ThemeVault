# Privacy Policy for ThemeVault

**Last updated**: November 18, 2026

ThemeVault ("the extension") is a free and open-source browser extension designed to provide custom themes and viewing enhancements for Invision Community forums. Your privacy is paramount: ThemeVault is built on the principle that your browsing activity and customizations belong exclusively to you.

---

## 1. Zero Data Collection & Zero Tracking

- **No Personal Data Collected**: ThemeVault does not collect, record, track, or inspect your personal information, browsing history, usernames, passwords, forum posts, private messages, or account credentials.
- **No Analytics or Telemetry**: ThemeVault contains no third-party trackers, analytics libraries, advertising trackers, or telemetry beacons.
- **No External Servers**: ThemeVault does not operate a remote tracking server. The extension never sends your browsing data or forum interactions over the network to any external endpoint.

---

## 2. Local Device Storage

All configurations and user settings remain stored locally on your device using the browser's native `storage` API (`chrome.storage.local` and optional `chrome.storage.sync`):

- **Saved Preferences**: Your selected active theme, accent color overrides, font preferences, and layout toggles (e.g., sticky navigation, clean reading mode, code copy button).
- **Custom Themes**: Any custom styles or CSS rules you write or import into your local Theme Vault.
- **Site-Specific Rules**: Your custom theme assignments for specific forum domains.

You retain complete control over this data. You can export your data at any time as a JSON file, or wipe all stored data instantly by clicking "Reset Everything" in the extension settings or by uninstalling the extension.

---

## 3. Permissions & Why They Are Used

ThemeVault requests only the minimum permissions necessary to deliver its user-facing functionality:

- **Host Permissions (`http://*/*`, `https://*/*`)**: Invision Community forums run on thousands of independent, custom domain names worldwide. ThemeVault uses this access solely to inspect page headers to determine whether the visited website is an Invision Community forum, and to apply your selected stylesheet locally.
- **Storage**: Used strictly to save your theme selections and layout preferences locally on your computer.
- **Active Tab**: Used when you open the extension popup to identify the active forum domain and provide instant theme switching.
- **Context Menus**: Used to provide a convenient right-click shortcut to toggle theme styling or open the Theme Studio.

---

## 4. Third-Party Sharing

ThemeVault does not sell, rent, license, or share your data with any third party, marketing service, or data broker.

---

## 5. Open Source Transparency

ThemeVault is licensed under the **GNU General Public License v3.0 (GPL-3.0-or-later)**. The complete source code is open for inspection, review, and auditing.

---

## 6. Contact & Support

If you have questions or concerns regarding this Privacy Policy or ThemeVault, please open an issue on the project's repository.
