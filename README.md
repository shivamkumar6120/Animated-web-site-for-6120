# ✨ A Romantic Cinematic Universe for Her ✨

A breathtaking, premium animated single-page romantic universe designed for your girlfriend. Crafted entirely with **HTML, CSS, modern JavaScript animations, HTML5 Canvas, SVG vectors, and typography** — with **NO external photos or stock images**.

---

## 🌟 Key Features

1. **🌌 Tap to Begin Gateway**:
   - Deep cinematic dark screen that slowly reveals shimmering stardust, glowing nebula, and a beating crystal heart.
   - Unlocks the audio experience cleanly following modern browser autoplay policies.

2. **👑 Dramatic Name Reveal (`HER_NAME`)**:
   - Staggered letter-by-letter dramatic reveal with orbital sparkling stardust.
   - Triggers a grand heart-shaped particle explosion when the name appears.
   - Continuous gentle breathing chromatic neon glow.

3. **💓 Interactive Pulsing Heart**:
   - Centered anatomical rhythm pulse with dynamic neon glow.
   - Realistic heartbeat sound and crystalline audio chimes.
   - Explodes into dozens of glowing hearts and golden stardust when tapped or clicked.

4. **💫 60 FPS HTML5 Cosmic Canvas Engine**:
   - Breathing multi-color nebula layers (rose, magenta, violet, coral).
   - Twinkling multi-depth starfield with parallax mouse tracking and shooting stars.
   - Realistic 3D procedural rose petals drifting and tumbling gently down.
   - Sinusoidal floating fireflies and cursor light trails.

5. **📜 Words From My Soul**:
   - Cinematic glassmorphic message cards with frosted blurs (`backdrop-filter`) and glowing borders that reveal as you scroll.

6. **✨ Constellation Memory Timeline (Without Photos)**:
   - Illuminated starlight path with glowing interactive constellation nodes.
   - Tap each star node to activate personal memories, quotes, and starlight bursts.

7. **💎 Galaxy of Reasons**:
   - Holographic crystal cards highlighting why she is irreplaceable.

8. **🎆 Grand Finale & Endless Love Transmitter**:
   - Dramatic climax highlighting `HER_NAME` surrounded by cosmic rings and falling petals.
   - Reveals: *"My favorite story is the one that has you in it."*
   - Interactive **"Send Her My Endless Love"** button that fires celebratory particle fireworks across the cosmos.

9. **🎶 Celestial Ambient Audio Engine (Web Audio API)**:
   - Procedural, warm ambient synthesizer chords (F# major / Eb minor romantic progression) that loop indefinitely without requiring external MP3 files.
   - Built-in sound toggle with animated equalizer bars.
   - Also supports optional custom MP3 streaming if you want your song to play!

---

## 🚀 Quick Start & Development

### 1. Install dependencies
```bash
npm install
```

### 2. Run local development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.

---

## ✍️ How to Customize Her Name (`HER_NAME`)

There are 3 super easy ways to set her name:

### Method A: Edit the Config File (Permanent)
Open [`src/config.js`](./src/config.js) and change:
```javascript
export const CONFIG = {
  herName: 'Sophia', // <-- Put her actual name here!
  // ...
};
```

### Method B: Share with URL Parameter (Instant!)
You can share the website link directly with her name in the URL:
```
https://your-domain.vercel.app/?name=Sophia
```
The website will automatically load with her name everywhere!

### Method C: Live In-App Customizer
Click the **✍️ Her Name** button in the top right corner of the website to test or customize any name live in real-time.

---

## 🌐 How to Deploy Directly to Vercel

This repository is pre-configured for one-click deployment on **Vercel**.

### Option 1: Deploy via Vercel Dashboard (Recommended)
1. Push your code to a GitHub, GitLab, or Bitbucket repository:
   ```bash
   git add .
   git commit -m "feat: romantic cinematic experience for her"
   git push origin main
   ```
2. Go to [https://vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** -> **"Project"**.
4. Import your repository (`Animated-web-site-for-6120`).
5. Vercel will automatically detect **Vite**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Click **Deploy**! Your romantic website will be live in seconds with an SSL certificate.

### Option 2: Deploy via Vercel CLI
If you have Vercel CLI installed:
```bash
npx vercel
```
Follow the quick interactive prompts to deploy directly from your terminal.

---

## 📱 Mobile & Responsive Experience
- Full touch support: tapping anywhere creates heart sparkles.
- Scaled particle counts for smooth 60fps on mobile GPUs.
- Responsive typography with dynamic `clamp()` scaling.
- Respects `prefers-reduced-motion` settings.
