# Driver's License Test Simulator — Buenos Aires

A free simulator for the Buenos Aires (CABA) driver's-license written exam ("Test de Conducir"), live at **[driver.bogomolov.tech](https://driver.bogomolov.tech)**.

It mirrors the real exam format — 40 questions, 45 minutes, 34 correct to pass — for license categories A and B, with the official question pool in Spanish plus English and Russian translations.

## Features

- **Practice mode** — spaced repetition that favours the questions you're weakest on, until everything is memorized.
- **Mock exam** — a timed, Spanish-only simulation of the real exam, scored like the real thing.
- **Review mistakes** — a focused deck of every question you've missed and not yet corrected.
- **Exam readiness** — an estimate of your probability of passing the real exam right now.
- Dark mode, keyboard navigation, English/Russian UI, progress export/import.

Everything runs client-side: progress lives in your browser's localStorage, and there is no backend or account. Google Analytics collects anonymous pageviews and a few coarse usage events (e.g. "exam finished") — no personal data or per-question answers.

> **Disclaimer:** this is an unofficial practice tool. The question pool is based on published study material, but the questions on the real exam may differ — always check the official CABA resources before taking the test.

## Development

```bash
npm install
npm run develop   # dev server at http://localhost:8000
npm test          # unit tests (node --test src/lib/)
npm run build     # production build
npm run deploy    # publish to GitHub Pages
```

See [CLAUDE.md](CLAUDE.md) for an architecture overview.

## Contributing

Open source — issues and PRs welcome. If the simulator helped you pass, a ⭐ on the repo helps others find it.

Built by [Konstantin Bogomolov](https://bogomolov.tech).
