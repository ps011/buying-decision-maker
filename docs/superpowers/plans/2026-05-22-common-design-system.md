# Common Design System Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace one-off local card, button, and badge implementations with direct `@prasheel/ui` primitives wherever the shared package already provides a matching primitive.

**Architecture:** This is a presentation-layer migration only. Feature components keep their current state, copy, conditional rendering, and calculations while importing `Card`, `CardContent`, `Button`, and `Badge` directly from `@prasheel/ui`.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, `@prasheel/ui@0.1.2`, lucide-react.

---

## File Map

- Modify: `src/features/Setup/IncomeSetup.tsx` — use shared `Card`, `CardContent`, and `Button` for the first-run income prompt.
- Modify: `src/features/Setup/IncomeChip.tsx` — use shared `Button` for the editable income chip trigger.
- Modify: `src/features/Item/ItemInput.tsx` — use shared `Card`, `CardContent`, and icon `Button` for the purchase input panel.
- Modify: `src/features/Item/Perspectives.tsx` — use shared `Card` and `CardContent` for the outer panel.
- Modify: `src/features/Item/BudgetImpact.tsx` — use shared `Card` and `CardContent` for the outer panel.
- Modify: `src/features/Item/CostPerHour.tsx` — use shared `Card`, `CardContent`, and `Badge`.
- Modify: `src/features/Decision/Checks.tsx` — use shared `Card`, `CardContent`, and `Button` while preserving `aria-pressed`.
- Modify: `src/features/Decision/Verdict.tsx` — use shared `Card`, `CardContent`, and `Badge`.
- Delete only if unused after migration: `src/components/Button.tsx`, `src/components/SectionCard.tsx`, `src/components/Chips.tsx`.
- Do not modify native input helpers unless an import audit proves they are part of this migration.

## Verification Commands

The repo has no test runner. Use command-based red/green checks for this migration:

```bash
npm run build
rg -n "from '../../components/(Button|SectionCard|Chips)'|from './components/(Button|SectionCard|Chips)'" src
rg -n "rounded-base border-2 border-border bg-secondary-background shadow-shadow p-5" src/features
```

Expected baseline:

- `npm run build` succeeds.
- The import audit should already have no matches for local primitive imports in current feature files.
- The class audit should find multiple feature panels before migration and fewer or no matches after each panel task.

Build output may generate `tsconfig*.tsbuildinfo`, `vite.config.js`, and `vite.config.d.ts`; remove those artifacts before committing.

---

### Task 1: Baseline Audit

**Files:**
- Read: `node_modules/@prasheel/ui/dist/components/button.d.ts`
- Read: `node_modules/@prasheel/ui/dist/components/card.d.ts`
- Read: `node_modules/@prasheel/ui/dist/components/badge.d.ts`
- Read: `src/features/**/*.tsx`

- [ ] **Step 1: Verify shared primitive APIs**

Run:

```bash
sed -n '1,220p' node_modules/@prasheel/ui/dist/components/button.d.ts
sed -n '1,220p' node_modules/@prasheel/ui/dist/components/card.d.ts
sed -n '1,220p' node_modules/@prasheel/ui/dist/components/badge.d.ts
```

Expected:

- `Button` supports `variant="default" | "neutral" | "destructive" | "noShadow" | "reverse"`.
- `Button` supports `size="default" | "sm" | "lg" | "icon"`.
- `Card`, `CardContent`, and `Badge` are exported.
- `Badge` supports `variant="default" | "neutral" | "success" | "destructive" | "warning"`.

- [ ] **Step 2: Run baseline build**

Run:

```bash
npm run build
```

Expected: build succeeds. Warnings about stale browser data are acceptable baseline warnings.

- [ ] **Step 3: Run baseline one-off panel audit**

Run:

```bash
rg -n "rounded-base border-2 border-border bg-secondary-background shadow-shadow p-5" src/features
```

Expected: matches in feature panel files such as `ItemInput.tsx`, `Perspectives.tsx`, `BudgetImpact.tsx`, `CostPerHour.tsx`, `Checks.tsx`, and `Verdict.tsx`. These matches are the red signal for the migration.

- [ ] **Step 4: Clean generated build artifacts**

Run:

```bash
rm -f tsconfig.node.tsbuildinfo tsconfig.tsbuildinfo vite.config.d.ts vite.config.js
git status --short --branch
```

Expected: no generated build artifacts remain. The branch should be clean before production edits.

---

### Task 2: Migrate Setup Surfaces

**Files:**
- Modify: `src/features/Setup/IncomeSetup.tsx`
- Modify: `src/features/Setup/IncomeChip.tsx`

- [ ] **Step 1: Run setup audit before edits**

Run:

```bash
rg -n "rounded-base border-2 border-border bg-secondary-background|<button|shadow-shadow" src/features/Setup
```

Expected: matches in `IncomeSetup.tsx` and `IncomeChip.tsx`.

- [ ] **Step 2: Replace `IncomeSetup` shell and confirm button**

Edit `src/features/Setup/IncomeSetup.tsx` to import shared primitives:

```tsx
import { useState } from 'react';
import { Button, Card, CardContent } from '@prasheel/ui';
import { useAppDispatch } from '../../state/store';
```

Use this JSX shape for the return body:

```tsx
return (
  <div className="fixed inset-0 bg-background flex items-center justify-center z-50 px-6">
    <Card className="w-full max-w-sm">
      <CardContent className="p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">One quick thing</h2>
          <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
            What's your monthly take-home income? Stays on your device only — used to put prices in perspective.
          </p>
        </div>
        <div>
          <label htmlFor="income-setup" className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-3">
            Monthly income
          </label>
          <div className="flex items-center gap-2 border-b-2 border-border pb-2">
            <span className="text-xl font-bold text-muted-foreground">€</span>
            <input
              id="income-setup"
              type="number"
              inputMode="decimal"
              min="1"
              placeholder="3500"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && confirm()}
              className="flex-1 text-2xl font-bold bg-transparent outline-none text-foreground placeholder:text-muted-foreground/30 focus-visible:outline-none"
              autoFocus
            />
          </div>
        </div>
        <Button
          type="button"
          onClick={confirm}
          disabled={!value || parseFloat(value) <= 0}
          className="w-full"
        >
          Let's go
        </Button>
      </CardContent>
    </Card>
  </div>
);
```

- [ ] **Step 3: Replace `IncomeChip` trigger button**

Edit `src/features/Setup/IncomeChip.tsx` to import `Button`:

```tsx
import { Button } from '@prasheel/ui';
```

Replace the non-editing return button with:

```tsx
return (
  <Button
    type="button"
    variant="neutral"
    size="sm"
    onClick={startEdit}
    className="h-auto min-h-0 gap-1.5 px-3 py-1.5 text-sm font-bold"
    aria-label="Edit monthly income"
  >
    <span>€{monthlyIncome.toLocaleString()} /mo</span>
    <Pencil size={12} />
  </Button>
);
```

Keep the inline editing `<div>` and `<input>` unchanged because the shared package does not expose input primitives.

- [ ] **Step 4: Verify setup migration**

Run:

```bash
npm run build
rg -n "<button|rounded-base border-2 border-border bg-secondary-background shadow-shadow" src/features/Setup
```

Expected:

- Build succeeds.
- No raw `<button` remains in `src/features/Setup`.
- The edit-mode chip container may still match `rounded-base border-2 border-border bg-secondary-background`; that is acceptable because it wraps a native input.

- [ ] **Step 5: Clean artifacts and commit setup migration**

Run:

```bash
rm -f tsconfig.node.tsbuildinfo tsconfig.tsbuildinfo vite.config.d.ts vite.config.js
git add src/features/Setup/IncomeSetup.tsx src/features/Setup/IncomeChip.tsx
git commit -m "Migrate setup controls to shared UI primitives"
```

Expected: commit succeeds with only setup feature files staged.

---

### Task 3: Migrate Item And Analysis Cards

**Files:**
- Modify: `src/features/Item/ItemInput.tsx`
- Modify: `src/features/Item/Perspectives.tsx`
- Modify: `src/features/Item/BudgetImpact.tsx`

- [ ] **Step 1: Run item-card audit before edits**

Run:

```bash
rg -n "rounded-base border-2 border-border bg-secondary-background shadow-shadow p-5|<button" src/features/Item/ItemInput.tsx src/features/Item/Perspectives.tsx src/features/Item/BudgetImpact.tsx
```

Expected: matches in all three files. `ItemInput.tsx` should also show one raw clear `<button>`.

- [ ] **Step 2: Migrate `ItemInput` outer shell and clear action**

Edit `src/features/Item/ItemInput.tsx` imports:

```tsx
import { X } from 'lucide-react';
import { Button, Card, CardContent } from '@prasheel/ui';
import { useAppState, useAppDispatch } from '../../state/store';
```

Replace the opening outer wrapper:

```tsx
<Card className="card-enter">
  <CardContent className="p-5 space-y-5">
```

Move the existing `<div className="flex items-start gap-3">` block inside `CardContent`, then replace the final closing wrapper with:

```tsx
  </CardContent>
</Card>
```

Replace the clear action with:

```tsx
<Button
  type="button"
  variant="neutral"
  size="icon"
  onClick={() => dispatch({ type: 'CLEAR_ITEM' })}
  className="mt-1 size-8 min-h-0 min-w-0 shrink-0 shadow-shadow-sm"
  aria-label="Clear item"
>
  <X size={14} />
</Button>
```

Keep native text and number inputs unchanged except for any formatting required by JSX nesting.

- [ ] **Step 3: Migrate `Perspectives` outer shell**

Edit `src/features/Item/Perspectives.tsx` imports:

```tsx
import { Clock, Repeat, PiggyBank } from 'lucide-react';
import { Card, CardContent } from '@prasheel/ui';
import { useAppState } from '../../state/store';
import { getPerspectives, formatHours, formatMonths } from '../../utils/perspectives';
```

Replace the opening outer wrapper:

```tsx
<Card className="card-enter">
  <CardContent className="p-5">
    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-4">
      What it actually costs you
    </p>
    <div className="grid grid-cols-3 gap-3">
```

Keep the existing metric-tile map inside that grid, then close with:

```tsx
    </div>
  </CardContent>
</Card>
```

The inner metric tiles stay local because `@prasheel/ui` does not expose a metric tile primitive.

- [ ] **Step 4: Migrate `BudgetImpact` outer shell**

Edit `src/features/Item/BudgetImpact.tsx` imports:

```tsx
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@prasheel/ui';
import { useAppState } from '../../state/store';
import { getBudgetImpact } from '../../utils/perspectives';
```

Replace the opening outer wrapper:

```tsx
<Card className="card-enter">
  <CardContent className="p-5 space-y-4">
    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
      Budget impact
    </p>
```

Keep the existing conditional budget impact body below the heading, then close with:

```tsx
  </CardContent>
</Card>
```

Keep progressbar attributes and budget calculations unchanged.

- [ ] **Step 5: Verify item card migration**

Run:

```bash
npm run build
rg -n "rounded-base border-2 border-border bg-secondary-background shadow-shadow p-5|<button" src/features/Item/ItemInput.tsx src/features/Item/Perspectives.tsx src/features/Item/BudgetImpact.tsx
```

Expected:

- Build succeeds.
- No matches remain for the old outer shell in these three files.
- No raw `<button` remains in `ItemInput.tsx`.

- [ ] **Step 6: Clean artifacts and commit item-card migration**

Run:

```bash
rm -f tsconfig.node.tsbuildinfo tsconfig.tsbuildinfo vite.config.d.ts vite.config.js
git add src/features/Item/ItemInput.tsx src/features/Item/Perspectives.tsx src/features/Item/BudgetImpact.tsx
git commit -m "Migrate item cards to shared UI primitives"
```

Expected: commit succeeds with only the three item feature files staged.

---

### Task 4: Migrate Cost And Decision Surfaces

**Files:**
- Modify: `src/features/Item/CostPerHour.tsx`
- Modify: `src/features/Decision/Checks.tsx`
- Modify: `src/features/Decision/Verdict.tsx`

- [ ] **Step 1: Run decision-surface audit before edits**

Run:

```bash
rg -n "rounded-base border-2 border-border bg-secondary-background shadow-shadow p-5|<button|px-3.*rounded-base|px-3\\.5" src/features/Item/CostPerHour.tsx src/features/Decision/Checks.tsx src/features/Decision/Verdict.tsx
```

Expected: matches in all three files. `Checks.tsx` should show raw buttons; `Verdict.tsx` and `CostPerHour.tsx` should show hand-built badges.

- [ ] **Step 2: Migrate `CostPerHour` card and badge**

Edit `src/features/Item/CostPerHour.tsx` imports:

```tsx
import { Badge, Card, CardContent } from '@prasheel/ui';
import { useAppState } from '../../state/store';
```

Keep the existing cost utility imports unchanged.

Replace the outer wrapper with:

```tsx
<Card className="card-enter">
  <CardContent className="p-5 space-y-5">
  </CardContent>
</Card>
```

Move the existing header, comparison message, and bar-chart list into `CardContent` unchanged except for the tier badge replacement below.

Replace the tier label span with:

```tsx
<Badge className={`mt-1 flex-shrink-0 shadow-shadow-sm ${meta.badge}`}>
  {meta.label}
</Badge>
```

This keeps tier-specific colors from `TIER_META` until those mappings are available as shared design-system variants.

- [ ] **Step 3: Migrate `Checks` card and buttons**

Edit `src/features/Decision/Checks.tsx` imports:

```tsx
import { Check } from 'lucide-react';
import { Button, Card, CardContent } from '@prasheel/ui';
import { useAppState, useAppDispatch } from '../../state/store';
```

Replace the outer wrapper:

```tsx
<Card className="card-enter">
  <CardContent className="p-5 space-y-5">
  </CardContent>
</Card>
```

Move the existing gut-check block, divider, and value-toggle block into `CardContent`, then apply the button replacements below.

Replace gut-check button elements with `Button` while preserving `aria-pressed`:

```tsx
<Button
  key={val}
  type="button"
  variant="neutral"
  onClick={() => gut(val)}
  aria-pressed={gutCheck === val}
  style={{ touchAction: 'manipulation' }}
  className={`flex-1 min-h-12 text-sm ${
    gutCheck === val
      ? val === 'yes'
        ? 'bg-green-500 text-white translate-x-boxShadowX translate-y-boxShadowY shadow-none'
        : 'bg-red-500 text-white translate-x-boxShadowX translate-y-boxShadowY shadow-none'
      : ''
  }`}
>
  {val === 'yes' ? 'Yes' : 'No'}
</Button>
```

Replace value-filter button elements with `Button` while preserving `aria-pressed`:

```tsx
<Button
  key={key}
  type="button"
  variant="neutral"
  onClick={() => toggle(key)}
  aria-pressed={valueFilter[key]}
  style={{ touchAction: 'manipulation' }}
  className={`w-full justify-start whitespace-normal min-h-12 py-3 px-4 text-left text-sm font-medium ${
    valueFilter[key]
      ? 'bg-main text-main-foreground translate-x-boxShadowX translate-y-boxShadowY shadow-none'
      : ''
  }`}
>
  <span
    className={`w-5 h-5 rounded-base border-2 flex-shrink-0 flex items-center justify-center transition-colors duration-100 ${
      valueFilter[key]
        ? 'border-main-foreground bg-main-foreground'
        : 'border-border bg-secondary-background'
    }`}
    aria-hidden="true"
  >
    {valueFilter[key] && <Check size={11} className="text-main" strokeWidth={3} />}
  </span>
  {label}
</Button>
```

- [ ] **Step 4: Migrate `Verdict` card and badges**

Edit `src/features/Decision/Verdict.tsx` imports:

```tsx
import { Badge, Card, CardContent } from '@prasheel/ui';
import { useAppState } from '../../state/store';
import { calculateDecision } from '../../utils/rules';
import { calcCostPerHour, getTier, TIER_META } from '../../utils/costPerHour';
```

Replace the `badges` object with shared badge variants:

```tsx
const badgeVariants = {
  buy: 'success',
  wait: 'warning',
  skip: 'destructive',
} as const;
```

Replace the outer wrapper:

```tsx
<Card className="card-enter" role="status" aria-live="polite">
  <CardContent className="p-5 space-y-3">
  </CardContent>
</Card>
```

Move the existing framework signal and cost-per-hour signal into `CardContent`, then apply the badge replacements below.

Replace the verdict label with:

```tsx
<Badge variant={badgeVariants[verdict]} className="px-3.5 py-1.5 text-sm font-bold flex-shrink-0 shadow-shadow-sm">
  {labels[verdict]}
</Badge>
```

Replace the cost-per-hour tier label with:

```tsx
<Badge className={`px-3 py-1 text-xs font-bold flex-shrink-0 shadow-shadow-sm ${cphMeta.badge}`}>
  {cphMeta.label}
</Badge>
```

- [ ] **Step 5: Verify cost and decision migration**

Run:

```bash
npm run build
rg -n "rounded-base border-2 border-border bg-secondary-background shadow-shadow p-5|<button" src/features/Item/CostPerHour.tsx src/features/Decision/Checks.tsx src/features/Decision/Verdict.tsx
```

Expected:

- Build succeeds.
- No matches remain for the old outer shell in these three files.
- No raw `<button` remains in `Checks.tsx`.

- [ ] **Step 6: Clean artifacts and commit decision migration**

Run:

```bash
rm -f tsconfig.node.tsbuildinfo tsconfig.tsbuildinfo vite.config.d.ts vite.config.js
git add src/features/Item/CostPerHour.tsx src/features/Decision/Checks.tsx src/features/Decision/Verdict.tsx
git commit -m "Migrate decision surfaces to shared UI primitives"
```

Expected: commit succeeds with only the three target feature files staged.

---

### Task 5: Remove Unused Local Primitive Files

**Files:**
- Delete if unused: `src/components/Button.tsx`
- Delete if unused: `src/components/SectionCard.tsx`
- Delete if unused: `src/components/Chips.tsx`

- [ ] **Step 1: Prove local primitive files are unused**

Run:

```bash
rg -n "from ['\"]\\.\\.?/.*/components/(Button|SectionCard|Chips)['\"]|from ['\"]\\.\\.?/components/(Button|SectionCard|Chips)['\"]|<Button|<SectionCard|<Chip" src
```

Expected: no imports from the three local primitive files. If `<Button`, `<SectionCard`, or `<Chip` appears only as shared `@prasheel/ui` usage after imports have changed, inspect manually before deletion.

- [ ] **Step 2: Delete unused local primitive files**

Run:

```bash
rm -f src/components/Button.tsx src/components/SectionCard.tsx src/components/Chips.tsx
```

- [ ] **Step 3: Verify deletion is safe**

Run:

```bash
npm run build
rg -n "Button\\.tsx|SectionCard\\.tsx|Chips\\.tsx|from ['\"].*components/(Button|SectionCard|Chips)['\"]" src QUICKSTART.md README.md docs
```

Expected:

- Build succeeds.
- No source imports reference deleted files.
- Documentation references may remain in older historical design docs, but current user-facing docs should not describe deleted files as active app structure.

- [ ] **Step 4: Update current docs only if they describe deleted active files**

If `QUICKSTART.md` still lists deleted files as active structure, edit that section so `/src/components` lists only active files:

```text
Header.tsx         # Sticky header with theme switcher
Modal.tsx          # Modal dialog
NumberInput.tsx    # Number input with prefix
PercentInput.tsx   # Percentage input (0-100)
TextArea.tsx       # Textarea component
Toggle.tsx         # Checkbox toggle
```

Do not edit old spec or plan documents just because they mention historical files.

- [ ] **Step 5: Clean artifacts and commit deletion**

Run:

```bash
rm -f tsconfig.node.tsbuildinfo tsconfig.tsbuildinfo vite.config.d.ts vite.config.js
git add src/components/Button.tsx src/components/SectionCard.tsx src/components/Chips.tsx QUICKSTART.md
git commit -m "Remove unused local UI primitives"
```

Expected: commit succeeds. If `QUICKSTART.md` did not need edits, Git ignores it or reports no pathspec change; stage only the deleted files instead.

---

### Task 6: Final Verification And Browser Smoke Check

**Files:**
- Verify: all modified source files
- Verify: generated build output is not staged

- [ ] **Step 1: Run full build**

Run:

```bash
npm run build
```

Expected: build succeeds. Existing browser-data warnings are acceptable.

- [ ] **Step 2: Run final primitive audit**

Run:

```bash
rg -n "from ['\"].*components/(Button|SectionCard|Chips)['\"]|rounded-base border-2 border-border bg-secondary-background shadow-shadow p-5|<button" src/features src/components
```

Expected:

- No imports from deleted local primitives.
- No old feature-panel shell matches.
- No raw `<button` in migrated feature surfaces. `ThemeSwitcher` from the package may render buttons internally; that is outside this source audit.

- [ ] **Step 3: Start dev server**

Run:

```bash
npm run dev -- --host 127.0.0.1
```

Expected: Vite prints a local URL, usually `http://127.0.0.1:5173/`. Keep the server running for the browser smoke check.

- [ ] **Step 4: Browser smoke check**

Open the local Vite URL and verify:

- Income setup appears if localStorage has no income.
- Entering income dismisses the setup prompt.
- Header theme switcher still works.
- Item name and price inputs still accept values.
- Perspective, budget, cost-per-hour, checks, and verdict cards appear in the same order as before.
- Gut-check and value-filter buttons preserve selected state and `aria-pressed` behavior.
- Verdict badge changes among buy, wait, and skip states.
- No obvious overlapping text or broken mobile layout at a narrow viewport.

- [ ] **Step 5: Stop dev server and clean artifacts**

Stop the dev server, then run:

```bash
rm -f tsconfig.node.tsbuildinfo tsconfig.tsbuildinfo vite.config.d.ts vite.config.js
git status --short --branch
```

Expected: only intentional source/doc changes from the implementation commits remain, or the tree is clean if every task was committed.

- [ ] **Step 6: Final summary**

Run:

```bash
git log --oneline --max-count=6
git status --short --branch
```

Expected: the branch contains the design spec commit, this implementation plan if committed, and the implementation commits. Working tree should be clean except for any explicitly deferred docs change.
