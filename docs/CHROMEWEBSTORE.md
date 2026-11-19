# Chrome Web Store Listing — ThemeVault for Invision Community

> Last Updated: 2026-11-18

## Store Listing

**Extension Name** [REQUIRED]
ThemeVault for Invision Community

**Short Description** [REQUIRED]
Custom themes, dark modes, clean reading, and layout enhancements for any Invision Community forum.

**Detailed Description** [REQUIRED]
Transform any Invision Community forum into a beautiful, personalized, and distraction-free reading experience.

ThemeVault instantly upgrades your favorite discussion boards with curated dark palettes, high-contrast OLED black themes, custom accent colors, and refined reading layouts. Whether you are participating in gaming forums, technical communities, or hobbyist hubs, ThemeVault works across all Invision Community sites automatically.

Key Features:

- Curated Theme Vault: Choose from popular community palettes including Nord Frost, Dracula Dark, Midnight OLED, Catppuccin Mocha, Forest Emerald, and Clean Slate Light.
- Real-Time Accent Tuning: Adjust your favorite primary accent color on the fly with instant visual preview.
- Clean Reading Mode: Remove clutter by hiding distracting signatures and member badges, keeping your focus strictly on discussion content.
- Sticky Navigation Bar: Keep the forum navigation header accessible as you browse through long discussions.
- One-Click Code Snippet Copying: Instantly copy code blocks with an integrated copy button.
- Compact Author Layout: Streamline author profile headers in discussion topics to fit more conversation on your screen.
- Media Dimmer: Comfortably read at night with gentle dimming on bright embedded images and videos.
- Custom Theme Studio: Design your own color schemes and write custom style rules with the built-in live editor.
- Backup and Portability: Export your entire theme collection and preferences as a portable backup file to sync between devices.

How to Use:

1. Visit any forum powered by Invision Community.
2. Click the ThemeVault icon in your browser toolbar.
3. Select your preferred theme or toggle reading enhancements.
4. Your styling preferences save automatically for each forum.

Privacy and Local Control:

ThemeVault respects your privacy. All your theme selections and layout options are stored locally on your device. The extension does not collect, track, or transmit your personal data or browsing activity.

Support and Feedback:

ThemeVault is free, open source software licensed under GPLv3. If you have suggestions or encounter an issue, please report it via the project repository.


**Category** [REQUIRED]
Productivity

**Single Purpose** [REQUIRED]
Customizes themes, reading modes, and viewing layouts on Invision Community forums.

**Primary Language** [REQUIRED]
English


## Graphics & Assets

| Asset | Dimensions | Status | Filename |
|---|---|---|---|
| Store Icon [REQUIRED] | 128×128 PNG | ✅ Ready | `src/icons/icon-128.png` |
| Screenshot 1 [REQUIRED] | 1280×800 | ✅ Ready | `docs/assets/screenshot-vault-1280x800.png` |
| Screenshot 2 [RECOMMENDED] | 1280×800 | ✅ Ready | `docs/assets/screenshot-studio-1280x800.png` |
| Small Promo Tile [RECOMMENDED] | 440×280 PNG | ✅ Ready | `docs/assets/promo-440x280.png` |
| Marquee Promo Tile | 1400×560 PNG | ⬜ Optional | Wide banner showcase |

### Screenshot Notes
- **Screenshot 1**: An Invision Community topic view styled with the "Nord Frost" theme, highlighting readable typography and dark cards.
- **Screenshot 2**: The extension popup open on top of a forum, showing the theme selector, accent picker, and QoL checkboxes.
- **Screenshot 3**: The Theme Studio options tab showing the live color token pickers and custom CSS editor.
- **Screenshot 4**: Side-by-side comparison showing standard forum view vs Clean Reading Mode with signatures hidden.


## Permissions Justification

| Permission | Type | Justification |
|---|---|---|
| `storage` | permissions | Saves user theme selections, custom CSS rules, and quality-of-life layout preferences locally on the user's device. |
| `activeTab` | permissions | Allows the popup to detect the active forum domain and preview selected themes in real time upon user request. |
| `contextMenus` | permissions | Adds convenient right-click options to quickly open the Theme Studio or toggle theme styling directly from any forum page. |
| `http://*/*` | host_permissions | Required because Invision Community forums run on thousands of independent, self-hosted web domains. The extension checks page headers to detect Invision Community forums and injects the user's chosen styling locally. |
| `https://*/*` | host_permissions | Required because Invision Community forums run on thousands of independent, self-hosted web domains. The extension checks page headers to detect Invision Community forums and injects the user's chosen styling locally. |


## Privacy & Data Use

### Data Collection

**Does the extension collect user data?** No

| Data Type | Collected? | Transmitted Off-Device? | Purpose | Shared with Third Parties? |
|---|---|---|---|---|
| Personally identifiable info | No | No | N/A | No |
| Health info | No | No | N/A | No |
| Financial info | No | No | N/A | No |
| Authentication info | No | No | N/A | No |
| Personal communications | No | No | N/A | No |
| Location | No | No | N/A | No |
| Web history | No | No | N/A | No |
| User activity | No | No | N/A | No |
| Website content | No | No | N/A | No |

### Data Use Certification
- [x] Data is NOT sold to third parties
- [x] Data is NOT used for purposes unrelated to the extension's core functionality
- [x] Data is NOT used for creditworthiness or lending purposes


## Privacy Policy

**Privacy Policy URL** [REQUIRED]
`https://github.com/Fermailab/ThemeVault/blob/main/PRIVACY.md`


## Distribution

**Visibility**: Public
**Regions**: All regions


## Developer Info

**Publisher Name** [REQUIRED]
Fermailab

**Contact Email** [REQUIRED]
support@fermailab.dev

**Support URL / Email** [RECOMMENDED]
https://github.com/Fermailab/ThemeVault/issues

**Homepage URL** [RECOMMENDED]
https://github.com/Fermailab/ThemeVault


## Version History

| Version | Date | Changes |
|---|---|---|
| 1.0.0 | 2026-11-18 | Initial release: Universal Invision Community detection, 6 curated themes, live Theme Studio, forum QoL tweaks, and full JSON backup/restore. |
