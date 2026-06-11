# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Gatsby 5 static site that simulates the Buenos Aires driver's-license written test ("Test de Conducir"). It runs entirely client-side (no backend) and is deployed to GitHub Pages at `driver.bogomolov.tech` (see `static/CNAME`). All questions are multiple-choice; users drill them until "memorized."

## Commands

```bash
npm run develop   # local dev server at http://localhost:8000 (also `npm start`)
npm run build     # production build into public/
npm run serve     # serve the production build locally
npm run clean     # clear Gatsby .cache and public (run this after changing gatsby-config/data)
npm run deploy    # gatsby build --prefix-paths && gh-pages -d public  (publishes to GitHub Pages)
```

There is **no test runner, linter, or formatter** configured. Don't reach for `npm test`/`npm run lint` — they don't exist.

## Architecture

### Page / state flow
- `src/pages/index.js` is an onboarding state machine with three states persisted in `localStorage['onboardState']`: language selection → category selection → dashboard. It renders `onboard/LanguageSelector`, `onboard/CategorySelector`, then `dashboard/Dashboard`.
- `src/pages/category-a.js` and `category-b.js` are thin wrappers that render `components/test/TestWrapper` with `category="A"|"B"`. The dashboard links here (`/category-a`, `/category-b`).
- `components/test/Test.js` is the core drill engine (see below).

### Persistence: localStorage is the entire data layer
There is no database or API. Every piece of state is a separate `localStorage` key, each fronted by a small module in `src/lib/`:
- `onboard-state.js` → `onboardState`
- `language.js` → `selectedLanguage` (`en`/`ru`), with an in-module `cachedLanguage` memo
- `category.js` → `selectedCategory` (`A`/`B`), with an in-module `cachedCategory` memo and validation
- `progress.js` → `state<postfix>` (the SRS queue/stats, see below)

All of these are guarded with `typeof window !== 'undefined'` checks because Gatsby SSRs pages at build time — **any direct `localStorage`/`navigator` access must be guarded or deferred into `useEffect`**, or the build breaks.

### The spaced-repetition engine (`components/test/Test.js`)
State is a single object persisted to `localStorage['state_cat_a' | 'state_cat_b']` (the `postfix` prop from `TestWrapper`):
- `queue` — shuffled array of remaining question keys.
- `stat.questions[index]` — consecutive-correct counter for each question.
- Answering correctly increments the counter; a wrong answer resets it to 0. Once a question is answered correctly **more than 3 times** (4×), it is deleted from `stat` and spliced out of `queue` ("memorized").
- When `queue` is empty the user has finished; a reset button restores `getInitialState()`.
- Note `onNext` picks a random index from the queue, so questions repeat in random order until memorized.

### Question data — two parallel representations (mid-migration)
There are **two** sources of question data and they are NOT interchangeable:
1. **Canonical / live:** `static/api/questions/category-{a,b}.json`, loaded by `src/lib/questions.js` via `require()`. Each question and each response carries inline `tran: { en, ru }` translations, and `img` paths are local (`/img/...`, served from `static/img/`). **This is what the running app reads.**
2. **Legacy:** `src/questions/category-{a,b}.js` (Spanish-only, external `testdeconducir.com.ar` image URLs) plus `src/questions/translations.js` (a flat Spanish-phrase → Russian-string lookup). The live UI components `QuestionText.js` and `Answers.js` still call `getTranslation()` from this legacy file rather than the JSON's inline `tran` fields.

When adding/editing questions, update the **JSON files in `static/api/`**. The translation story is inconsistent — be aware which path a given component uses before touching translations.

### Two unrelated "language" concepts
Don't conflate them:
- App locale (`en`/`ru`) from `lib/language.js` — drives onboarding and Settings UI copy.
- The in-test language toggle (`components/SelectLanguage.js`, `Header.js`, `Test.js`) uses a string `"0"` to mean "no translation shown" (Spanish only) vs. a selected translation. This `state.language` is separate from the stored app locale.

### Styling
Tailwind via `gatsby-plugin-postcss` + `postcss.config.js`; global directives in `src/styles/global.css` imported through `gatsby-browser.js`. `tailwind.config.js` only scans `src/pages` and `src/components`. Some components also use inline `style={{}}` objects — the codebase mixes both.

## Repo state caveats
The working tree is mid-refactor: `src/components/test/`, `src/components/dashboard/`, `src/components/onboard/`, `src/lib/`, and `static/api/` are newer/untracked, while the old flat `src/components/Test.js` was deleted in favor of `src/components/test/Test.js`. Prefer the nested `test/`, `dashboard/`, `onboard/` and `lib/` modules; treat `src/questions/*` as legacy.
