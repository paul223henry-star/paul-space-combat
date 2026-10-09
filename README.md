# Paul Space Combat

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-cyan?logo=tailwindcss)](https://tailwindcss.com/)
[![Canvas](https://img.shields.io/badge/Rendering-HTML5_Canvas-orange)](#)
[![Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7?logo=netlify)](https://www.netlify.com/)

A polished, fast-paced browser-based 2D arcade space shooter built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **HTML5 Canvas**.

---

## 🚀 Overview

In **Paul Space Combat**, the player controls an advanced starfighter through deep space hostile sectors. Destroy incoming enemy squadrons, gather tactical power-ups, chain kill combos, survive escalating waves, and challenge multi-phase titan bosses like the **Void Destroyer**.

> **Core Loop:** Move → Aim/Position → Shoot → Dodge → Destroy → Collect → Upgrade → Survive → Defeat Boss

---

## ✨ Features

- **Real-Time 60 FPS Canvas Engine**: High-performance rendering pipeline with clamped delta-time physics, high-DPI (Retina) scaling, and zero frame-rate stutter.
- **Dynamic Parallax Starfield & Nebula Shaders**: 3-layer parallax scrolling starfield with vibrant galactic nebulae.
- **Futuristic Spacecraft & Arsenal**: Procedural vector starships, plasma engine thrusters, and animated energy shields.
- **5 Distinct Enemy Classes**:
  - **Scout**: High-speed interceptor executing oscillating dive attacks.
  - **Fighter**: Tactical fighter with forward plasma cannons.
  - **Tank**: Heavy armored dreadnought with dual heavy artillery.
  - **Shooter**: Long-range sniper maintaining upper-screen perimeter and tracking the player.
  - **Elite**: Aggressive marauder with sweeping 3-way plasma spread barrages.
- **Multi-Phase Boss Battles**:
  - **Void Destroyer** emerges on milestone waves with 4 evolving phases (Orbital Suppression, Radial Nova Barrage, Hyper-Velocity Pulse, and Core Meltdown bullet hell).
  - Dedicated Boss HUD bar with phase alarms and sirens.
- **6 Tactical Power-Up Capsules**:
  - ⚡ **Rapid Fire**: 100% weapon fire rate boost.
  - 🛡️ **Shield Matrix**: Energy shield recharge (+50 shield).
  - 💥 **Plasma Overcharge**: 2x laser projectile damage.
  - 💚 **Nanite Repair**: Hull HP restoration (+35 HP).
  - 🔱 **Triple Cannon**: 3-way spread laser barrage.
  - ⭐ **Quantum Catalyst**: 2x score and combo multiplier.
- **Combo Multiplier System**: Chain rapid kills for up to **x10 combo points** with a real-time decay meter.
- **Zero-Dependency Procedural Web Audio Synthesizer**: Complete 8-bit/cyberpunk sound synthesis for lasers, plasma shots, explosions, shield impacts, power-up arpeggios, boss klaxon sirens, and a looping synthwave soundtrack with volume sliders and mute toggles.
- **Modern Sci-Fi React HUD**: Glassmorphic HUD overlay, hull/shield status telemetry, active power-up timers, and intuitive modal interfaces.
- **Local Persistence**: Saves High Score, Best Wave, and Total Kills across game sessions via `localStorage`.
- **Netlify Ready**: Pre-configured `netlify.toml` and Next.js standalone export for instant zero-config continuous deployment.

---

## 🎮 Controls

| Key | Action |
|:---|:---|
| **`↑` `↓` `←` `→`** or **`W` `A` `S` `D`** | Move Spaceship |
| **`SPACE`** | Fire Lasers |
| **`P`** | Pause / Resume Game |
| **`R`** | Quick Restart after Game Over |
| **`ESC`** | Close Modals |

---

## 🛠️ Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3
- **Graphics / Physics:** HTML5 Canvas API (Vector Graphics & 60 FPS RequestAnimationFrame Loop)
- **Audio:** Web Audio API (Procedural Oscillator & Noise Synthesizers)
- **Icons:** Lucide React
- **Storage:** HTML5 LocalStorage API
- **Version Control:** Git & GitHub
- **Deployment Platform:** Netlify

---

## 💻 Getting Started & Development

### 1. Prerequisites
- **Node.js** (v18+ or v20+)
- **npm** or **pnpm** or **yarn**

### 2. Clone the Repository
```bash
git clone https://github.com/<your-username>/space-combat.git
cd space-combat
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to launch the game.

### 5. Type-Checking
```bash
npm run type-check
```

### 6. Production Build
```bash
npm run build
npm start
```

---

## 🚀 Deployment to Netlify

This project is configured for Netlify:

1. Push your repository to **GitHub**.
2. Log in to [Netlify](https://app.netlify.com/) and select **"Add new site"** > **"Import an existing project"**.
3. Connect your GitHub repository.
4. Netlify will automatically detect the settings from `netlify.toml`:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `.next`
5. Click **Deploy Site**.

---

## 👤 Author

**Paul Oyeleye**  
Project: Space Combat  
Version: 1.0.0
