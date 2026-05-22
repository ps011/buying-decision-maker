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
- Theme switching is handled by the shared `@prasheel/ui` `ThemeSwitcher` in `src/components/Header.tsx`.

**Feature modules** — `src/features/`
Each subdirectory contains standalone panels/cards rendered by `App.tsx`, using shared `@prasheel/ui` primitives where available:
- `Setup/` — captures and edits monthly income.
- `Item/` — captures the purchase, shows perspective metrics, budget impact, and cost-per-hour comparisons.
- `Decision/` — collects gut/value checks and renders the final verdict.

**Decision logic** — `src/utils/rules.ts`
The purchase-decision verdict logic lives here (`calculateDecision`). Perspective and cost-per-hour helpers live in `src/utils/perspectives.ts` and `src/utils/costPerHour.ts`.

**Deployment** — GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages. The `VITE_BASE` env var sets the Vite `base` path for the Pages subdirectory.

## Key conventions

- Currency is displayed in euros (€).
- Prices and monthly income are stored as plain numbers (euros).
- All data is local-only — `localStorage` key `buying-decision-maker`.
