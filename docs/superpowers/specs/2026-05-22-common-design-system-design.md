# Buying Decision Maker — Common Design System Migration

**Date:** 2026-05-22

## Goal

Move the app's reusable UI shells to the shared `@prasheel/ui` design system so cards, buttons, badges, theme tokens, focus states, borders, and shadows come from the common package instead of one-off local Tailwind implementations.

This pass is intentionally limited to primitives already exported by `@prasheel/ui`.

## Current State

The app already uses `@prasheel/ui` for:

- `ThemeProvider` in `src/main.tsx`
- `ThemeSwitcher` in `src/components/Header.tsx`
- The package stylesheet and Tailwind preset

Most feature surfaces still use local classes for card shells, buttons, status pills, and interactive controls. The repo also contains local components such as `Button`, `SectionCard`, and `Chips` that duplicate concepts available in the shared package.

## Scope

Migrate directly to these shared primitives where they map cleanly:

- `Card`, `CardContent`, and related card exports for repeated panel shells
- `Button` for clickable actions and two-choice controls
- `Badge` for verdict, status, and comparison labels

Keep native form fields local because `@prasheel/ui@0.1.2` does not expose input, textarea, select, checkbox, or switch primitives.

## Non-Goals

- Do not redesign the decision flow, copy, state model, or calculations.
- Do not introduce app-local wrapper components for shared primitives.
- Do not add new design-system primitives to `@prasheel/ui`.
- Do not migrate native inputs into custom abstractions.
- Do not change persisted `localStorage` behavior.

## Component Plan

### Cards

Replace hand-built panel wrappers in feature files with `Card` and `CardContent` from `@prasheel/ui`.

The migration should preserve current spacing and conditional rendering while allowing shared card border, radius, background, foreground, and shadow styles to come from the package.

### Buttons

Replace action buttons with shared `Button` where the existing behavior fits package variants:

- Primary confirmations use `variant="default"`
- Secondary or neutral controls use `variant="neutral"`
- Destructive actions use `variant="destructive"`
- Icon-only actions use `size="icon"` with an accessible label

Stateful pressed controls, such as gut-check and value-filter toggles, may still add app-specific selected-state classes on top of the shared `Button` primitive because the shared package does not expose toggle-button semantics.

### Badges

Replace hand-built pill labels with `Badge`:

- Buy / positive labels use `variant="success"`
- Wait / caution labels use `variant="warning"`
- Skip / destructive labels use `variant="destructive"`
- Neutral labels use `variant="neutral"` or the default badge style depending on context

## Local Components

Remove local primitives only after imports prove they are unused:

- `src/components/Button.tsx`
- `src/components/SectionCard.tsx`
- `src/components/Chips.tsx`

Leave native-input helpers in place if still used or useful:

- `NumberInput`
- `PercentInput`
- `TextArea`
- `Toggle`
- `Modal`

If a local file is already unused before the migration and has no replacement scope in this pass, leave it alone unless removing it is necessary to keep the tree accurate.

## Styling Rules

- Prefer design-system tokens: `background`, `secondary-background`, `foreground`, `muted-foreground`, `border`, `main`, `main-foreground`, and `ring`.
- Avoid reintroducing hard-coded gray/blue card and button styling where a shared primitive or token is available.
- Preserve the current compact single-page workflow and mobile layout.
- Preserve accessible names, labels, `aria-pressed`, `aria-live`, and progressbar attributes.

## Testing

The repo has no configured test runner. Verification for this pass is:

- `npm run build`
- Local browser smoke check of the main app flow
- Confirm no unused local primitive imports remain

Build output may generate TypeScript build artifacts; those should not be committed.

## Expected Result

The app should look and behave the same at a product level, but its core repeated surfaces should use `@prasheel/ui` primitives directly. Future design-system changes should then flow into this app through the shared package instead of requiring local card, button, and badge edits.
