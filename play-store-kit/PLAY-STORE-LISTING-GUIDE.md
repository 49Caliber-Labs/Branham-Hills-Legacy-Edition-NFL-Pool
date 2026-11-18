# Google Play Store & Apple App Store Listing Kit — `com.caliber49labs.nflpool`

> **Release Target:** **Branham Hills NFL Pool ("Awesome Dawson" Legacy Edition)**  
> **Organization Publisher:** 49Caliber Labs (Solano County, CA • Register Play Console under **Organization + DUNS**, never Personal, to bypass the 14-day/12-tester requirement)  
> **Latest Signed Binary:** [`releases/branham-hills-nfl-pool-release.aab`](../releases/branham-hills-nfl-pool-release.aab) (`v1.0.1` • Package ID `com.caliber49labs.nflpool`)

---

## 1. Store Listing Metadata (Copy-Paste Ready)

| Field | Value (Respects Store Character Caps) |
| :--- | :--- |
| **App Name** *(30 chars max)* | `Branham Hills NFL Pool` *(22 chars)* |
| **Package ID / Bundle ID** | `com.caliber49labs.nflpool` |
| **Primary Category** | `Sports` *(Secondary / App Store: `Sports` or `Entertainment`)* |
| **Tags** | `Sports`, `Football`, `Score Tracker`, `League Manager` |
| **Default Language** | `English (United States) – en-US` |
| **Price / Monetization Model** | **Paid or Commercial Lifetime License** (\$9.99 Standard ≤20 Contenders / \$19.99 League ≤100 Contenders • Zero Ads • Zero Recurring Fees) |
| **Privacy Policy URL** | `https://49caliber.com/nfl-pool/privacy.html` |
| **App / Marketing Website** | `https://49caliber.com/nfl-pool/` |
| **Support Email** | `jthreet@49caliber.com` |

### Short Description *(80 chars max — 78 chars used)*
```text
Straight-up NFL weekly pick'em league tracker with classic lore & zero ads.
```

### Full Description *(Play Store 4000-char limit)*
```text
Run your family, office, or community NFL straight-up pick'em league with zero ads, zero recurring subscriptions, and 40 years of authentic Commissioner character.

Branham Hills NFL Pool ("Awesome Dawson" Legacy Edition) pairs a battle-tested weekly scoring engine with vintage carbon-copy scoresheet aesthetics, live Sunday standings, and one-tap cross-device league rooms.

KEY FEATURES
• Zero-Friction Straight-Up Weekly Picks: Contenders pick winners across the full NFL weekly slate with clear Thursday, Sunday, and Monday kickoff lockouts.
• Live Standings Matrix & MNF Tiebreaker: Track real-time Sunday leaderboard momentum plus Monday Night Football combined-points tiebreaker resolution.
• Commissioner Quote Vault & Consultant's Corner: Built-in hall-of-fame lore cards, classic dispatches, and league banter tools (100% configurable — toggle off anytime in the Setup Wizard).
• Automated Weekly Dispatches: Generate Friday Night Wire, Sunday Night Roast, and Tuesday Final standings recaps with one-tap PDF and Word (.docx) export.
• Elvis Consensus House Bot (Optional): Benchmark every contender against consensus spread favorites week after week.
• 32 NFL Team Color Themes & Printable Scoresheets: Personalize your matrix header or export clean landscape sheets in one tap.
• Shareable Multi-Device League Rooms: Create a custom league code (?league=YOUR-CODE) and text one link to invite 20 contenders (Standard Edition) or 100 contenders (League Edition).
• Zero Ads Forever: Built under 49Caliber Labs' lifetime commitment — free updates included, zero behavioral trackers, zero third-party ad networks.

STRICTLY FOR ENTERTAINMENT & BRAGGING RIGHTS
This application is strictly a recreational sports pick tracker and social league organizer. It processes zero real-money wagers, entry fees, cash escrow, or financial payouts.
```

---

## 2. Google Play Data Safety Questionnaire Matrix

| Play Console Prompt | Exact Selection / Response |
| :--- | :--- |
| **Does your app collect or share any of the required user data types?** | **Yes** *(only when the Commissioner enables remote league room cloud sync for contender display names, weekly team picks, and optional Locker Room messages)* |
| **Is all of the user data collected by your app encrypted in transit?** | **Yes** *(All network traffic uses HTTPS / TLS)* |
| **Do you provide a way for users to request that their data is deleted?** | **Yes** — Commissioners can delete records directly in Admin Hub, and anyone can email `jthreet@49caliber.com` via `https://49caliber.com/nfl-pool/privacy.html` |
| **Data Type: Personal info → Name (Display Name / Contender Handle)** | Collected (Optional / User-provided league nickname) • App functionality • Not shared with third parties • Encrypted in transit |
| **Data Type: Messages → Other in-app messages (Locker Room chat)** | Collected (Optional) • App functionality • Not shared with third parties • Encrypted in transit |
| **Data Type: App info and performance / Device IDs / Advertising ID** | **None collected, none shared** *(Zero third-party ad SDKs)* |
| **Financial info / Gambling / Payment data** | **None collected inside the app** |

---

## 3. IARC Content Rating Questionnaire Guide

> Answering accurately ensures **Everyone (`E`) / PEGI 3** classification and prevents erroneous "Real-Money Gambling" flags.

| Questionnaire Section | Exact Answer |
| :--- | :--- |
| **Category** | `Utility, Productivity, Communication, or Other` (or `Sports Reference / Organizer`) |
| **Violence, Fear, Sexuality, Profanity** | **No** *(or mild comedic sports banter only; zero graphic content)* |
| **Controlled Substances / Crude Humor** | **No** |
| **Simulated Gambling / Real-Money Gambling, Games, or Contests?** | **No** *(Confirm the app does NOT facilitate real-money betting, wagering, lotteries, cash entry fees, or cash/monetary prize payouts — picks are strictly straight-up entertainment tracking)* |
| **Users Interact / Share Info Online?** | **Yes** *(Only within private user-configured league rooms — Locker Room messages and picks)* |

---

## 4. Visual Store Assets Included in This Directory

| Asset | File | Target Play Console Slot | Dimensions |
| :--- | :--- | :--- | :--- |
| **App Icon (Vector)** | [`app-icon-512x512.svg`](./app-icon-512x512.svg) | Source Master | `512 × 512 px` |
| **App Icon (PNG)** | [`app-icon-512x512.png`](./app-icon-512x512.png) | Play Console → Store listing → App icon | `512 × 512 px` (`32-bit PNG`) |
| **Feature Graphic (Vector)** | [`feature-graphic-1024x500.svg`](./feature-graphic-1024x500.svg) | Source Master | `1024 × 500 px` |
| **Feature Graphic (PNG)** | [`feature-graphic-1024x500.png`](./feature-graphic-1024x500.png) | Play Console → Store listing → Feature graphic | `1024 × 500 px` (`24/32-bit PNG`) |

---

## 5. Production Release Upload Steps (`v1.0.1`)

1. Sign in to [Google Play Console](https://play.google.com/console/) under your verified **Organization (`49Caliber Labs`)** account using `jthreet@49caliber.com`.
2. Click **Create app** → Name: `Branham Hills NFL Pool` → App → **Paid** or **Free (with commercial license key activation)** → Accept declarations → **Create app**.
3. Under **App content** (left sidebar), complete:
   - **Privacy policy:** `https://49caliber.com/nfl-pool/privacy.html`
   - **Ads:** Select **"No, my app does not contain ads"**
   - **App access:** *"All functionality is available without special login; users can enter the default pool or create a local/cloud league room directly via the initial Setup Wizard."*
   - **Data safety** & **Content ratings:** Use Sections 2 & 3 above.
4. Under **Main store listing**, paste the Title, Short Description, Full Description, and upload [`app-icon-512x512.png`](./app-icon-512x512.png) + [`feature-graphic-1024x500.png`](./feature-graphic-1024x500.png) plus phone/tablet screenshots.
5. Under **Release → Production → Create new release**, opt into **Play App Signing**, and upload [`releases/branham-hills-nfl-pool-release.aab`](../releases/branham-hills-nfl-pool-release.aab) (built & signed with [`releases/49caliber-nflpool-upload.keystore`](../releases/49caliber-nflpool-upload.keystore) via CI release `v1.0.1`).
