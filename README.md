# TypeClash ⚡ Real-Time Multiplayer Typing Race

A fast-paced, cyber-neon multiplayer typing race game built with **Next.js 16 (App Router)** and designed to deploy smoothly to **Vercel** with zero external database or WebSocket setup required.

---

## 🎮 Features

- **Real-Time Multiplayer Racing**: Create a private room, copy a 5-character room code or 1-click shareable direct link, and invite friends to race.
- **Dynamic Multi-Lane Track**: Watch each racer's car glide smoothly down the track as they type, with real-time WPM, accuracy, and nitro trail animations.
- **Monkeytype-Style Typing HUD**: Smooth cursor caret, live character error highlighting, word-per-minute (WPM) calculations, and instant accuracy metrics.
- **Custom Cyber Vehicles**: Choose from 6 custom neon cars (Cyber Neon GT, Amber Blaze, Emerald Phantom, Crimson Fury, Solar Flare, and Violet Specter).
- **Web Audio API Sound Effects**: Zero external mp3 dependencies — custom audio synthesizers provide mechanical clacks, typo thuds, countdown beeps, nitro bursts, and victory fanfares.
- **AI Practice Bots**: Solo practice mode and host "Add AI Bot" support for instant action even when friends haven't joined yet.
- **Post-Race Podium & Rematch**: Confetti celebration, top 3 podium standings, full race statistics breakdown, and one-click rematch.
- **Vercel-Optimized**: Uses Next.js Serverless Route Handlers with intelligent delta polling (350ms during active race, 700ms in lobby), ensuring 100% compatibility with Vercel serverless limits without broken persistent WebSockets.

---

## 🚀 Getting Started Locally

```bash
# Navigate to project
cd d:/Projects/typeclash

# Install dependencies (already installed)
npm install

# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploying to Vercel

### Option 1: Via Vercel CLI (Fastest)

1. Open your terminal in the `typeclash` folder:
   ```bash
   cd d:/Projects/typeclash
   ```
2. Run:
   ```bash
   npx vercel
   ```
3. Follow the quick prompts (accept defaults). Vercel will build and output your live deployment URL!

### Option 2: Via GitHub + Vercel Dashboard

1. Initialize git and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - TypeClash game"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/typeclash.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your `typeclash` repository and click **Deploy**.
4. Send your Vercel URL to your friends and race!
