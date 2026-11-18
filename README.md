# Straight-Up NFL Football Pool — Commercial & Open-Source Release

A resilient, zero-login straight-up NFL football pick'em web application, installable PWA (iOS, iPadOS, Android, macOS, Windows), and Capacitor-ready mobile starter built with React, TypeScript, Express, and optional Firebase / Gemini AI enhancements.

**Zero Ads Ever • Lifetime Updates • Strictly Non-Gambling Entertainment & Bragging Rights Tracker**

---

## Editions & Licensing Tiers

Configure your instance cleanly inside the **Commissioner Setup Wizard** on first launch (without modifying application code):

| Edition Tier | Target Use Case | Contender Cap | Key Features |
| :--- | :--- | :--- | :--- |
| **Umpire Pool (Open-Source)** | Free MIT self-hosted leagues | Up to **20** human contenders | Straight-up scoring engine, kickoff autolock, optional Consensus Bot, B&W & team themes, neutral UI |
| **Awesome Dawson Standard (\$9.99 Lifetime)** | Small friend & family pools | Up to **20** human contenders | Everything above + full character/lore vault, AI Friday/Sunday/Tuesday dispatches, Umpire Penalty Jar, 32 NFL themes |
| **Awesome Dawson League (\$19.99 Lifetime)** | Office, club & community pools | Up to **100** human contenders | Full Commercial Edition scaled up to 100 contenders • Lifetime license • Free updates • Zero ads ever |

---

## Governance, Compliance & Setup Wizard

On initial boot, administrators are guided through the **Commissioner Setup Wizard (`⚙️ Setup`)**:
1. **Zero-Wagering & Entertainment Disclaimer + Commissioner Pact**: Confirms zero entry fees, wagers, or financial payouts, and records the administrator's commitment to maintain rosters and certify weekly results.
2. **Edition Tier & Pool Identity**: Configure Pool Name, Season Year, Admin Name/Email, Consultant Name, and 4-digit Admin PIN (default `2233`).
3. **Optional Autonomous Vegas Bot & Rule Variances**:
   - **Autonomous Bot ("Elvis" Slot)**: Toggle ON/OFF and customize bot display name & tagline.
   - **Monday Night Tiebreaker Rule**: Closest Combined MNF Points (Over or Under, exact ties crown Co-Champions) OR Price Is Right (Closest Without Going Over).
   - **Missed-Pick / Kickoff Policy**: Auto-Fill consensus Vegas Favorites with manual-submission podium priority, Equal Standing, or Hard Lockout (0 points).
   - **Non-Monetary Umpire Penalty Jar**: Comedic infractions tracked strictly in honorary **Penalty Flags / Citations** (zero monetary value).

---

## Quick Start (Local Web & PWA)

**Prerequisites:** Node.js 20+

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:3000` in your browser. Out of the box, the server persists all picks, schedules, scores, and audit ledgers locally to `data/pool-storage.json` with zero external database setup required.

### Optional Cloud Sync & AI Enhancements
- **Gemini AI Dispatches (Optional):** Set `GEMINI_API_KEY` in `.env` (or paste your key inside the Dispatches tab). Without an API key, the built-in deterministic dispatch generator runs 100% locally.
- **Firebase Cloud Firestore (Optional):** Copy your Firebase web configuration into `firebase-applet-config.json` and `firebase.json` if you want real-time multi-device cloud listeners in addition to local disk storage.

---

## Multi-Platform Mobile Deployment (PWA & Capacitor iOS / Android)

### Option A — 1-Tap Progressive Web App (iOS & Android, Zero App Store Fees)
Includes `public/manifest.webmanifest` and `public/sw.js`:
- **iPhone / iPad Safari:** Share button -> **Add to Home Screen**
- **Android Chrome:** Browser menu -> **Install App**
- **Desktop Chrome / Edge / macOS Safari:** Address-bar Install App icon or **File -> Add to Dock**

### Option B — Native iOS & Android Binaries via Capacitor
Helper scripts are included in `package.json`:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npm run cap:init
npm run cap:ios      # Opens Xcode project
npm run cap:android  # Opens Android Studio APK/AAB project
```
