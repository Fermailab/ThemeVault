# ThemeVault Agent Guidelines & Invariants

## 1. Git Authorship & Identity Protection
- **Invariant**: All Git commits, author info, and committer info must strictly be `Fermailab <git@fermailab.dev>`.
- **Zero Leakage**: Never introduce personal names, personal usernames, or personal/university email addresses into commit logs, code, or documentation.

## 2. Pre-Commit & Pre-Push Verification Invariant
- **Rule**: NEVER push changes to remote without explicitly verifying that the change works.
- **Verification Chain**:
  1. Run `npm test` (verifies JS syntax across all files, manifest integrity, and executes unit/fixture test suite).
  2. Run `npm run build` (ensures `dist/chrome` and `dist/firefox` build without errors).
  3. Validate functionality locally (e.g. testing with the browser tool, local preview, or automated test runners).

## 3. Git Staging & Repository Hygiene
- **Rule**: Never stage or commit temporary helper scripts, unneeded scratch files, or screenshot assets into Git.
- **Local Assets**: All store screenshots, promo tiles, and marketing graphics must reside in `docs/assets/` (which is `.gitignore`d). Test fixtures reside in `tests/fixtures/`.
- Keep `git status` clean and atomic.

## 4. GPL-3.0-or-Later & Privacy Compliance for Fixtures
- When adding HTML fixtures, test samples, or mocks:
  - **Trademarks & Logos**: Strip all proprietary brand names, logos, and custom slogans. Replace with generic open-source identifiers (e.g., "Open Community Forum", generic SVG vectors).
  - **Usernames & Identifiers**: Real scraped usernames from production forums must NEVER be committed. Anonymize all user handles to generic IDs (e.g., `Admin_User`, `Staff_Moderator`, `Community_Member_01`..`N`).
  - **Tracking & Telemetry**: Remove all third-party tracking scripts, cookies (e.g., OneTrust), and analytics pixels.

## 5. Invision Community CSS Architecture Standard
- When creating or modifying themes, always ensure 100% selector and variable coverage:
  - **IPS 4 Legacy**: `#ipsLayout_header`, `header`, `.ipsNavBar`, `#elUserNav`, `#elSearch`, `.ipsType_sectionTitle`, `.ipsBox_title`, `.ipsWidget_title`.
  - **IPS 5 BEM**: `.ipsHeader`, `.ipsHeader__top`, `.ipsHeader__primary`, `.ipsHeader__secondary`, `.ipsBox__header`, `.ipsWidget__header`, `.ipsSearchPseudo`, `.ipsBox--forumCategory`.
  - **IPS 5 Dynamic Custom Properties**: Override `--i-headerPrimary--ba-co`, `--i-headerTop--ba-co`, `--i-headerSecondary--ba-co`, `--i-boxHeader--ba-co`, `--i-widget-header--ba-co`, `--i-box--ba-co`, `--i-base_1`..`6`, and `--i-background_1`..`4` on `:root`.
  - **Gradient Elimination**: Always declare `background-image: none !important;` alongside `background: var(--tv-surface...) !important;` so custom skin brown/olive gradients do not bleed through.
