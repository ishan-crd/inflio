<div align="center">

<img src="./.github/assets/logo.png" width="120" alt="Inflio" />

# Inflio

**Where brands and creators do deals — campaigns, barter, and payouts in one place.**

Inflio is a creator–brand marketplace: brands launch campaigns and discover verified creators, creators find paid gigs and barter deals, and Instagram analytics flow in automatically to keep every profile honest.

<br />

![Web](https://img.shields.io/badge/web-Next.js%2015-000000?style=flat-square&logo=nextdotjs)
![Mobile](https://img.shields.io/badge/mobile-Expo%2055-000020?style=flat-square&logo=expo)
![Extension](https://img.shields.io/badge/extension-Chrome%20MV3-4285F4?style=flat-square&logo=googlechrome)
![Backend](https://img.shields.io/badge/backend-Convex-EE342F?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)

</div>

---

## ✨ Overview

Inflio connects the two sides of the creator economy in a single platform:

- 🏢 **For brands** — launch campaigns, browse and shortlist verified creators, review applications, and approve submissions.
- 🎬 **For creators** — discover campaigns and barter deals, apply in a tap, submit deliverables, and track earnings in an in-app wallet.
- 📊 **Verified data** — a companion browser extension pulls real Instagram analytics into creator profiles, so brands see trustworthy numbers instead of screenshots.

---

## 🧱 Monorepo Structure

Inflio is a [pnpm](https://pnpm.io) workspace with three apps sharing one [Convex](https://convex.dev) backend:

```
inflio/
├── apps/
│   ├── web/           # Next.js 15 — brand dashboard, marketplace & admin
│   ├── mobile/        # Expo / React Native — creator app
│   └── ig-extractor/  # Chrome MV3 extension — Instagram analytics extractor
├── pnpm-workspace.yaml
└── package.json
```

### 🌐 `apps/web` — Brand & Admin Platform

Next.js 15 (React 19) app for the brand side and operations.

- **Marketplace & creators** — discover, filter, and shortlist creators
- **Dashboard** — campaigns, applications, and submission review
- **Admin** — creator verifications and platform management
- **Auth** — [Better Auth](https://better-auth.com) with email (Resend) + Postgres

### 📱 `apps/mobile` — Creator App

Expo Router app (React Native 0.83, React 19) for creators on the go.

- **Tabs** — campaigns, barter, wallet, and profile
- **Flows** — OTP login, onboarding, campaign & barter detail
- **Native polish** — bottom sheets, blur, gradients, and Reanimated

### 🧩 `apps/ig-extractor` — Instagram Analytics Extractor

A Manifest V3 Chrome extension that extracts Instagram analytics for creator profiles, feeding verified reach and engagement data back into Inflio.

---

## 🛠 Tech Stack

| Area | Technology |
| --- | --- |
| **Web** | Next.js 15, React 19, Tailwind CSS 4 |
| **Mobile** | Expo 55, React Native 0.83, Expo Router, Reanimated |
| **Extension** | Chrome Manifest V3 (service worker + content scripts) |
| **Backend** | Convex (realtime DB & functions) |
| **Auth** | Better Auth, Postgres, Resend |
| **Language** | TypeScript |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (LTS) and [pnpm](https://pnpm.io)
- A [Convex](https://convex.dev) project
- [Expo Go](https://expo.dev/go) or a simulator (for the mobile app)

### Install

```bash
# From the repo root
pnpm install
```

### Run the web app

```bash
cd apps/web
pnpm dev
```

### Run the mobile app

```bash
cd apps/mobile
pnpm start
```

### Load the extension

1. Open `chrome://extensions` and enable **Developer mode**
2. Click **Load unpacked** and select `apps/ig-extractor`

---

## 📄 License

Private — all rights reserved.

<div align="center">
<br />

Built with 💚 by [@ishan-crd](https://github.com/ishan-crd)

</div>
