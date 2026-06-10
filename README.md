# YouMatter — A Mental Health Website

> _You don't have to face it alone._

YouMatter is a calm, supportive web app for mental wellbeing. Read curated
articles, follow guided breathing and mindful videos, track your mood over time,
and watch your emotional trends unfold.

## 🧩 How it's built (no database, no server to manage)

- **Frontend:** React 18 + Vite, React Router, CSS Modules, Framer Motion, Chart.js.
- **Content:** articles & videos ship with the app as data files — no backend needed.
- **Accounts, mood history & diary cards:** saved in the browser with
  **localStorage**, so they persist per device without any server.
- **Deploys to Vercel in one click** as a static site — zero config, no env vars.

## ✨ Features

- **Home** — hero, supportive tools, and a quote carousel (20s autoplay, fade/slide, prev/next, pause-on-hover).
- **Articles** — preview cards with animated category filtering; **Read More opens a dedicated article page** with a Back button and Related Articles.
- **Videos & Exercises** — a guided breathing exercise plus a filterable library; videos **play in an in-site modal** with an embedded player and real thumbnails (never leaves the site).
- **Auth** — register & login with validation, loading states and toast feedback.
- **Mood Tracker** — greeting, daily 5-mood check-in with a reflection note, a 7-day emotional-trend bar chart, and a recent journal.
- **Diary Card** — weekly emotion + skills tracker with autosave and past-week history.
- Fully responsive (320 → 1440px), accessible, soft shadows, smooth transitions.

## 📁 Structure

```
You-matter/
├── public/
│   └── images/           ← drop your images here (see images/README.md)
├── src/
│   ├── components/        Navbar, cards, BreathingCircle, MoodChart, VideoModal, …
│   ├── context/           Auth + Toast providers
│   ├── data/              articles, videos, quotes, moods, diary options
│   ├── pages/             Home, Articles, ArticleDetail, Videos, Login, MoodTracker, DiaryCard, …
│   ├── services/          localStorage-backed auth / moods / diary + content helpers
│   ├── utils/             YouTube + week-date helpers
│   └── styles/            Global CSS + CSS Modules
├── index.html
├── vite.config.js
├── vercel.json            SPA routing for Vercel
└── package.json
```

## 🚀 Run it locally (VS Code)

Requires [Node.js](https://nodejs.org) 18+.

```bash
npm install        # install once
npm run dev        # starts the app on http://localhost:5173
```

## ☁️ Deploy to Vercel

1. Push this project to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import your repo.
3. Vercel auto-detects Vite. Leave the defaults and click **Deploy**.

That's it — `vercel.json` serves the single-page app. No environment variables or
database needed.

## ✏️ Customizing content & images

- **Article text / video links:** edit `src/data/articles.js` and `src/data/videos.js`.
- **Images:** drop files into `public/images/` using the names listed in
  [`public/images/README.md`](public/images/README.md). Missing images fall back
  to stock photos automatically.
- **Quotes:** edit `src/data/quotes.js`.
- **Colors / fonts:** all design tokens live in `src/styles/global.css`.

## ⚠️ A note on wellbeing

YouMatter is a supportive tool, not a substitute for professional care. If you
are in crisis, please contact a local helpline or emergency services. You matter.
