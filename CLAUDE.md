# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Gatsby 5 static site that simulates the Buenos Aires (CABA) driver's-license written test ("Test de Conducir"). It runs entirely client-side (no backend) and is deployed to GitHub Pages at `driver.bogomolov.tech` (see `static/CNAME`). Three study modes per category (A/B): practice (spaced repetition), mock exam (40 questions, 45 min, 34 to pass — see `lib/exam.js`), and review of past mistakes. The dashboard headlines an exam-readiness estimate.

## Commands

```bash
npm run develop   # local dev server at http://localhost:8000 (also `npm start`)
npm run build     # production build into public/
npm run serve     # serve the production build locally
npm run clean     # clear Gatsby .cache and public (run this after changing gatsby-config/data)
npm test          # node --test src/lib/  (unit tests for the lib modules)
```

Deployment is automatic: pushing/merging to `main` runs `.github/workflows/ci.yml`, which builds the site and publishes it to GitHub Pages (`driver.bogomolov.tech`) via the **GitHub Actions** Pages source — there is no `gh-pages` branch and no manual `npm run deploy` step.

There is **no linter or formatter** configured (`npm run lint` doesn't exist). Tests run via Node's built-in runner: test files are `src/lib/*.test.js` and the modules they cover are **CommonJS** (`module.exports`) so `node --test` can load them — webpack interops fine when components `import` them. Keep new testable lib modules CommonJS. CI (`.github/workflows/ci.yml`) runs `npm test` + `npm run build` on PRs; the build is what catches SSR violations.

## Architecture

### Page / state flow
- `src/pages/index.js` is an onboarding state machine with three states persisted in `localStorage['onboardState']`: language selection → category selection → dashboard. It renders `onboard/LanguageSelector`, `onboard/CategorySelector`, then `dashboard/Dashboard`.
- The six mode pages (`category-{a,b}.js`, `exam-{a,b}.js`, `review-{a,b}.js`) are generated one-liners around `components/ModeWrapper.js` (`mode="practice"|"exam"|"review"` + `category`), which owns the shared page chrome, the async question loading, and the `makeHead` title factory.
- `components/test/Test.js` is the practice drill engine; `components/exam/Exam.js` the timed mock exam; `components/review/Review.js` the mistakes deck.

### Persistence: localStorage is the entire data layer
There is no database or API. Every piece of state is a separate `localStorage` key. **Per-category key suffixes are built in `src/lib/keys.js`** — don't inline a `_cat_x` suffix string. Modules fronting the keys:
- `onboard-state.js` → `onboardState`
- `language.js` → `selectedLanguage` (`en`/`ru`), with an in-module `cachedLanguage` memo
- `category.js` → `selectedCategory` (`A`/`B`), with an in-module `cachedCategory` memo and validation
- `progress.js` → `state_cat_{a,b}` (practice state incl. mastery map)
- `mistakes.js` → `mistakes_cat_{a,b}`; `stats.js` → `acc_cat_{a,b}`, `studyStreak`
- `migrate.js` — idempotent schema migrations, run from `gatsby-browser.js` `onClientEntry` (so every entry point sees migrated data).

All of these are guarded with `typeof window !== 'undefined'` checks because Gatsby SSRs pages at build time — **any direct `localStorage`/`navigator` access must be guarded or deferred into `useEffect`**, or the build breaks.

### The practice engine (`components/test/Test.js`)
State is a single object persisted to `localStorage['state_cat_a' | 'state_cat_b']`:
- `queue` — shuffled array of remaining question keys (strings).
- `stat.questions[index]` — consecutive-correct counter; correct increments, wrong resets to 0; more than 3 (4×) deletes it from `stat` and splices it out of `queue` ("memorized").
- `mastery[id]` — per-question mastery estimates (`lib/mastery.js`), driving `lib/selection.js pickWeak` (weak-first weighted pick) and `lib/readiness.js` (the dashboard's pass-probability estimate).
- When `queue` is empty the user has finished; a reset button restores `getInitialState()`.

### Question data
Single source: `static/api/questions/category-{a,b}.json`, loaded **asynchronously** by `src/lib/questions.js` via dynamic `import()` so each ~600KB file is its own webpack chunk — don't switch back to top-level `require()` or both files land in every page's bundle. Each question and response carries inline `tran: { en, ru }`; `img` paths are local (`/img/...` from `static/img/`).

**Append-only invariant:** each question's `id` equals its array position, and all stored user progress (queue, mastery, mistakes) is keyed by it. Never reorder or delete entries — append new questions at the end.

### Two unrelated "language" concepts
Don't conflate them:
- App locale (`en`/`ru`) from `lib/language.js` — drives UI chrome copy via `lib/ui.js t()`. Use `t()` for any user-facing chrome string; don't inline `language === 'ru' ? … : …` ternaries.
- The in-test content locale (`es`/`en`/`ru`) from `lib/i18n.js` — `es` means "Spanish only, no translation" (legacy stored value `"0"` normalizes to `es`); `translate()` reads the JSON's inline `tran` fields.

### Analytics
`gatsby-plugin-google-gtag` tracks pageviews; custom events go through `lib/analytics.js track()` (onboarding completion, exam start/finish, review start). Keep events coarse — no per-question events.

### Styling
Tailwind via `gatsby-plugin-postcss` + `postcss.config.js`; global directives in `src/styles/global.css` imported through `gatsby-browser.js`. `tailwind.config.js` only scans `src/pages` and `src/components`. Some components also use inline `style={{}}` objects — the codebase mixes both. Dark mode is class-based: an inline script in `gatsby-ssr.js` sets the class before paint (intentionally duplicating `lib/theme.js` logic — keep them in sync).
