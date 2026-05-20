# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server (Vite, port 5173)
npm run build      # tsc type-check + Vite production build
npm run preview    # serve the production build locally
```

No test runner is configured. Type-checking is the primary correctness gate (`tsc -b` runs as part of `build`).

## Architecture

React 18 + TypeScript SPA built with Vite and styled with Tailwind CSS v3. No routing — the entire app is a single scrollable page rendered in `App.tsx`.

**State management** — `src/state/`
- `types.ts` defines `AppState`, `AppAction`, and `initialState`.
- `store.tsx` exposes a React Context + `useReducer` store (`AppProvider`, `useAppState`, `useAppDispatch`). State is persisted to `localStorage` with a 300 ms debounce via `src/utils/storage.ts`.
- Dark mode is stored in state and applied by toggling a `dark` class on `<html>`.

**Feature modules** — `src/features/`
Each subdirectory is a self-contained feature rendered inside a `<SectionCard>`:
- `Decision/` — evaluates a current item via gut check, value filter, and budget checks; `Summary` renders the verdict.
- `MoneyMap/` — income bucket allocation (essentials / future fund / freedom fund).
- `Wishlist/` — 48-hour waiting list with add/purchase/delete actions.
- `Advisor/` — keyword-based (no AI/network call) purchase advisor using `src/utils/rules.ts`.
- `Settings/` — luxury threshold, data export/import/clear.

**Decision logic** — `src/utils/rules.ts`
All purchase-decision logic lives here (`calculateDecision`, `getAdvisorGuidance`). The advisor uses keyword matching against the query string — it is entirely client-side with no external API calls.

**Deployment** — GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages. The `VITE_BASE` env var sets the Vite `base` path for the Pages subdirectory.

## Key conventions

- Currency is displayed in euros (€).
- `luxuryThreshold` (default €100) gates the 48-hour waiting rule.
- Prices are stored as plain numbers (euros); percentages in `buckets` sum to 100.
- All data is local-only — `localStorage` key `luxury-vs-basic-advisor`.
