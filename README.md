# Habitly — Habit Tracker

A habit tracker web app: onboarding, a Today view, a Habits grid, a Stats view
with a heatmap and trend chart, and an Account/profile screen. All data is
stored in your browser's `localStorage` — there is no backend and no fake
seed data. Everything you see (streaks, completion %, heatmap, trends) is
computed live from the habits and check-ins you actually enter.

## Run it locally

You need [Node.js](https://nodejs.org) 18+ installed.

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

## Deploy to Vercel (from GitHub)

1. Create a new GitHub repository and push this project to it:
   ```bash
   git init
   git add .
   git commit -m "Habitly habit tracker"
   git branch -M main
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com), click **Add New → Project**, and
   import that GitHub repo.
3. Vercel auto-detects Vite. Leave the defaults:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Click **Deploy**. That's it.

## Project structure

```
src/
  store.jsx           localStorage persistence, React context, streak/stat math
  App.jsx             switches between onboarding and the tabbed app
  components/TabBar.jsx
  pages/
    Onboarding.jsx    welcome → name → add first habits
    Today.jsx         today's focus, streaks, weekly overview, checklist
    Habits.jsx        habit grid, add/delete habits
    Stats.jsx         heatmap, completion ring, 6-month trend, best streak
    Account.jsx       profile, quick stats, export data (JSON), reset data
```

## Notes

- Data lives entirely in `localStorage` under the key `habitly-data-v1`.
- Use the **Export your data** button on the Account screen to download a
  JSON backup at any time.
- **Reset all data** on the Account screen permanently clears everything.
