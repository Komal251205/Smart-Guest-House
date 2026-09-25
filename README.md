# 🏛️ Smart Guest House — Website

**Wedding & Event Venue · Nidauri Main Gate, Baraon, Karchana, Prayagraj, UP**

🌐 **Live Site:** [https://smart-guest-house.vercel.app/](https://smart-guest-house.vercel.app/)

---

## File Structure

```
Smart-Guest-House/
├── index.html        ← Main landing page (public)
├── upload.html       ← Owner-only photo manager (open locally)
├── styles.css        ← All styling
├── script.js         ← Gallery, lightbox, nav, scroll effects
├── gallery.json      ← Edit this to control the photo gallery
├── vercel.json       ← Vercel deployment config + security headers
├── images/
│   ├── hero.jpg      ← Hero section image (replace with real photo)
│   └── (add your venue photos here)
└── README.md         ← This file
```

---

## 🚀 Deploy to Vercel (Free — takes 2 minutes)

### Option A — Vercel CLI (recommended)

```bash
# Install once
npm install -g vercel

# Inside the Smart-Guest-House folder
vercel

# Follow the prompts (press Enter to accept defaults)
# You get a free HTTPS URL like: https://smart-guest-house.vercel.app
```

### Option B — Vercel Dashboard (no CLI)

1. Go to [vercel.com](https://vercel.com) → Sign up / Log in (GitHub, Google, or email)
2. Click **"Add New Project"**
3. Choose **"Deploy from Git"** (push the folder to a GitHub repo first)
   — OR —
   Install the [Vercel for GitHub](https://github.com/apps/vercel) app and import your repo directly
4. Vercel auto-detects a static site — no build settings needed
5. Click **Deploy** → Done!

> **HTTPS is automatic on Vercel.** All traffic is served over HTTPS with HTTP→HTTPS redirect enforced by the platform. `vercel.json` sets all security headers on every response.

### Adding a Custom Domain (e.g. `smartguesthouse.in`)
- Vercel Dashboard → your project → **Settings → Domains** → Add domain
- Update your domain's DNS records as instructed by Vercel (takes ~10 minutes to propagate)

---

## 📸 Adding Photos to the Gallery

No accounts, no internet service, no cloud storage needed.
Photos live in your own `images/` folder alongside the site files.

### Step 1 — Copy photos into the `images/` folder
Use simple filenames with no spaces:
- ✅ `stage.jpg`, `seating.jpg`, `decor-night.jpg`
- ❌ `My Photo (1).jpg`

> **Tip:** Compress photos to under 500 KB using [squoosh.app](https://squoosh.app) (free, browser-based) for fast mobile loading.

### Step 2 — Open `upload.html` locally
Double-click `upload.html` to open it in your browser. Select your photos, add captions, and click **"Generate gallery.json"**.

### Step 3 — Update `gallery.json`
Copy the generated JSON and paste it into `gallery.json` (replace all existing content). Or click **"Download gallery.json"** to get the file directly.

`gallery.json` example:
```json
[
  { "url": "images/hero.jpg",    "caption": "Grand Mandap & Stage Setup" },
  { "url": "images/stage.jpg",   "caption": "Decorated Stage Backdrop" },
  { "url": "images/seating.jpg", "caption": "Guest Seating Arrangement" }
]
```

### Step 4 — Re-deploy to Vercel
```bash
vercel --prod
```
Or push your updated files to GitHub — Vercel auto-deploys on every commit.

---

## 📞 Contacts
- **Niranjan Dev (Primary)** — [+91 92235 67100](tel:+919223567100)
- **Pramod Kumar Fauji** — [+91 74979 68233](tel:+917497968233)

---

## 🔒 Security
- All security headers in `vercel.json` (CSP, HSTS, X-Frame-Options, Referrer-Policy, etc.)
- No external services, no API keys, no third-party scripts
- `upload.html` is 100% local — no network calls, no uploads to the internet
