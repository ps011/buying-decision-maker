# Buying Decision Maker — Simplification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace a 5-section complex app with a single reactive page: income setup once, then enter item + price to instantly see price perspectives, budget impact, and a live buy/wait/skip verdict.

**Architecture:** Simplified Context + useReducer state (5 fields, all persisted to localStorage). New `perspectives.ts` utility handles all price calculations. Components render reactively — no submit buttons, everything updates as the user types/toggles.

**Tech Stack:** React 18, TypeScript, Tailwind CSS v3, Vite. No test runner — `npm run build` (tsc + vite) is the type-check gate after each task.

---

## File Map

**Create:**
- `src/utils/perspectives.ts` — price perspective calculations + relatable lookup table
- `src/features/Setup/IncomeSetup.tsx` — full-screen first-visit income prompt
- `src/features/Setup/IncomeChip.tsx` — inline editable income chip shown after setup
- `src/features/Item/ItemInput.tsx` — name + price fields with clear button
- `src/features/Item/Perspectives.tsx` — hours of work, relatable equivalent, months to save card
- `src/features/Item/BudgetImpact.tsx` — budget bar + % of income + remaining amount card
- `src/features/Decision/Checks.tsx` — gut check yes/no + 3 value toggles in one block
- `src/features/Decision/Verdict.tsx` — live buy/wait/skip verdict card

**Modify:**
- `src/state/types.ts` — replace AppState with simplified 5-field version
- `src/state/store.tsx` — remove dead actions, update reducer
- `src/utils/rules.ts` — remove `getAdvisorGuidance`, simplify `calculateDecision`
- `src/utils/storage.ts` — update storage key
- `src/components/Header.tsx` — remove nav links to deleted sections, keep theme toggle
- `src/App.tsx` — rewrite layout using new components

**Delete** (after App.tsx is rewritten):
- `src/features/Decision/CurrentItem.tsx`
- `src/features/Decision/GutCheck.tsx`
- `src/features/Decision/ValueFilter.tsx`
- `src/features/Decision/Summary.tsx`
- `src/features/MoneyMap/Buckets.tsx`
- `src/features/Wishlist/WishlistForm.tsx`
- `src/features/Wishlist/WishlistList.tsx`
- `src/features/Advisor/Advisor.tsx`
- `src/features/Settings/Settings.tsx`
- `src/utils/time.ts`

---

## Task 1: Simplify state types and store

**Files:**
- Modify: `src/state/types.ts`
- Modify: `src/state/store.tsx`

- [ ] **Step 1: Replace `src/state/types.ts` entirely**

```typescript
export interface ValueFilter {
  useOften: boolean;
  improvesDay: boolean;
  affordable: boolean;
}

export interface Item {
  name: string;
  price: number;
}

export interface AppState {
  theme: 'light' | 'dark';
  monthlyIncome: number;
  item: Item;
  gutCheck: 'yes' | 'no' | null;
  valueFilter: ValueFilter;
}

export type AppAction =
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_MONTHLY_INCOME'; payload: number }
  | { type: 'SET_ITEM'; payload: Partial<Item> }
  | { type: 'SET_GUT_CHECK'; payload: 'yes' | 'no' | null }
  | { type: 'SET_VALUE_FILTER'; payload: Partial<ValueFilter> }
  | { type: 'CLEAR_ITEM' }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> };

export const initialState: AppState = {
  theme: 'light',
  monthlyIncome: 0,
  item: { name: '', price: 0 },
  gutCheck: null,
  valueFilter: { useOften: false, improvesDay: false, affordable: false },
};
```

- [ ] **Step 2: Replace `src/state/store.tsx` entirely**

```typescript
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, AppAction, initialState } from './types';
import { loadState, saveState } from '../utils/storage';

const AppStateContext = createContext<AppState | undefined>(undefined);
const AppDispatchContext = createContext<React.Dispatch<AppAction> | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_MONTHLY_INCOME':
      return { ...state, monthlyIncome: action.payload };
    case 'SET_ITEM':
      return { ...state, item: { ...state.item, ...action.payload } };
    case 'SET_GUT_CHECK':
      return { ...state, gutCheck: action.payload };
    case 'SET_VALUE_FILTER':
      return { ...state, valueFilter: { ...state.valueFilter, ...action.payload } };
    case 'CLEAR_ITEM':
      return { ...state, item: { name: '', price: 0 }, gutCheck: null, valueFilter: initialState.valueFilter };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const saved = loadState();
    if (saved) dispatch({ type: 'LOAD_STATE', payload: saved });
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (!saved?.theme) dispatch({ type: 'SET_THEME', payload: prefersDark ? 'dark' : 'light' });
  }, []);

  useEffect(() => {
    const id = setTimeout(() => saveState(state), 300);
    return () => clearTimeout(id);
  }, [state]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}

export function useAppDispatch() {
  const ctx = useContext(AppDispatchContext);
  if (!ctx) throw new Error('useAppDispatch must be used within AppProvider');
  return ctx;
}
```

- [ ] **Step 3: Verify build passes**

```bash
npm run build
```
Expected: no TypeScript errors (other features will have errors — that's fine, they'll be deleted in a later task).

---

## Task 2: Create `src/utils/perspectives.ts`

**Files:**
- Create: `src/utils/perspectives.ts`

- [ ] **Step 1: Create the file**

```typescript
const LOOKUP: { name: string; price: number }[] = [
  { name: 'coffee', price: 3.5 },
  { name: 'lunch out', price: 15 },
  { name: 'dinner out', price: 25 },
  { name: 'week of groceries', price: 80 },
  { name: 'Spotify month', price: 10 },
  { name: 'Netflix month', price: 14 },
  { name: 'gym month', price: 40 },
  { name: 'phone bill month', price: 30 },
];

export interface Perspectives {
  hoursOfWork: number;
  monthsToSave: number;
  relatableCount: number;
  relatableName: string;
}

export function getPerspectives(price: number, monthlyIncome: number): Perspectives {
  const hourlyRate = monthlyIncome / 160;
  const hoursOfWork = price / hourlyRate;
  const monthsToSave = price / (monthlyIncome * 0.2);

  // Pick the lookup item whose count (price / item.price) is closest to 4
  const TARGET = 4;
  let best = LOOKUP[0];
  let bestDiff = Math.abs(price / best.price - TARGET);
  for (const item of LOOKUP) {
    const diff = Math.abs(price / item.price - TARGET);
    if (diff < bestDiff) {
      best = item;
      bestDiff = diff;
    }
  }
  const relatableCount = Math.max(1, Math.round(price / best.price));

  return { hoursOfWork, monthsToSave, relatableCount, relatableName: best.name };
}

export function getBudgetImpact(price: number, monthlyIncome: number) {
  const percentage = Math.min(100, (price / monthlyIncome) * 100);
  const remaining = monthlyIncome - price;
  const exceedsIncome = price > monthlyIncome;
  return { percentage, remaining, exceedsIncome };
}

export function formatHours(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours < 10) return `${hours.toFixed(1)} hrs`;
  return `${Math.round(hours)} hrs`;
}

export function formatMonths(months: number): string {
  if (months < 1) return `${Math.round(months * 30)} days`;
  if (months < 2) return '~1 month';
  return `${months.toFixed(1)} months`;
}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```
Expected: clean build (new file, no dependents yet).

---

## Task 3: Simplify `src/utils/rules.ts`

**Files:**
- Modify: `src/utils/rules.ts`

- [ ] **Step 1: Replace `src/utils/rules.ts` entirely**

Remove `getAdvisorGuidance` and the `AdvisorResult` type. Simplify `calculateDecision` to use the new `AppState` shape and remove all 48-hour / bucket-percentage logic.

```typescript
import { AppState } from '../state/types';

export interface DecisionResult {
  verdict: 'buy' | 'wait' | 'skip';
  reason: string;
}

export function calculateDecision(state: AppState): DecisionResult {
  const { gutCheck, valueFilter, item } = state;

  if (!item.name || item.price <= 0) {
    return { verdict: 'wait', reason: 'Enter an item name and price to get a verdict.' };
  }

  if (!valueFilter.affordable) {
    return { verdict: 'skip', reason: "You'd need to touch savings or go into debt." };
  }

  if (gutCheck === 'no') {
    return { verdict: 'skip', reason: "Gut check failed — this looks like external pressure, not genuine want." };
  }

  const valueScore = [valueFilter.useOften, valueFilter.improvesDay].filter(Boolean).length;

  if (gutCheck === null) {
    return { verdict: 'wait', reason: 'Answer the gut check to get a verdict.' };
  }

  // gutCheck === 'yes' from here
  if (valueScore === 2) {
    return { verdict: 'buy', reason: 'Gut check passed and all value criteria met.' };
  }

  if (valueScore === 1) {
    return { verdict: 'wait', reason: 'Gut check passed but only 1 of 2 value criteria met.' };
  }

  return { verdict: 'skip', reason: 'Gut check passed but no value criteria met.' };
}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```
Expected: errors only from old feature files that import removed symbols — those will be deleted in Task 8.

---

## Task 4: Update storage and Header

**Files:**
- Modify: `src/utils/storage.ts`
- Modify: `src/components/Header.tsx`

- [ ] **Step 1: Update storage key in `src/utils/storage.ts`**

Change the `STORAGE_KEY` constant and remove unused `exportData` function (wishlist-specific). Replace the entire file:

```typescript
import { AppState } from '../state/types';

const STORAGE_KEY = 'buying-decision-maker';

export function loadState(): Partial<AppState> | null {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable — fail silently
  }
}

export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
```

- [ ] **Step 2: Simplify `src/components/Header.tsx`**

Remove the nav links (all target sections that no longer exist). Keep the title and theme toggle.

```typescript
import { useAppState, useAppDispatch } from '../state/store';

export function Header() {
  const state = useAppState();
  const dispatch = useAppDispatch();

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm transition-colors">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-2xl">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Should I buy it?
        </h1>
        <button
          onClick={() => dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' })}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          {state.theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Verify build passes**

```bash
npm run build
```

---

## Task 5: Create Setup components

**Files:**
- Create: `src/features/Setup/IncomeSetup.tsx`
- Create: `src/features/Setup/IncomeChip.tsx`

- [ ] **Step 1: Create `src/features/Setup/IncomeSetup.tsx`**

Full-screen prompt shown when `monthlyIncome === 0`.

```typescript
import { useState } from 'react';
import { useAppDispatch } from '../../state/store';

export function IncomeSetup() {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState('');

  const confirm = () => {
    const n = parseFloat(value);
    if (n > 0) dispatch({ type: 'SET_MONTHLY_INCOME', payload: n });
  };

  return (
    <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">One quick thing</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            What's your monthly take-home income? This stays on your device only.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-gray-500 dark:text-gray-400">€</span>
          <input
            type="number"
            min="1"
            placeholder="3500"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && confirm()}
            className="flex-1 text-2xl font-bold bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 outline-none py-2 text-gray-900 dark:text-white"
            autoFocus
          />
        </div>
        <button
          onClick={confirm}
          disabled={!value || parseFloat(value) <= 0}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition-colors"
        >
          Let's go
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/features/Setup/IncomeChip.tsx`**

Compact editable chip shown at top of main content when income is set.

```typescript
import { useState } from 'react';
import { useAppState, useAppDispatch } from '../../state/store';

export function IncomeChip() {
  const { monthlyIncome } = useAppState();
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('');

  const startEdit = () => {
    setValue(String(monthlyIncome));
    setEditing(true);
  };

  const save = () => {
    const n = parseFloat(value);
    if (n > 0) dispatch({ type: 'SET_MONTHLY_INCOME', payload: n });
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-500 dark:text-gray-400">€</span>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false); }}
          onBlur={save}
          className="w-24 bg-transparent border-b border-gray-400 dark:border-gray-500 outline-none text-gray-900 dark:text-white font-medium"
          autoFocus
        />
        <span className="text-gray-400 dark:text-gray-500">/mo</span>
      </div>
    );
  }

  return (
    <button
      onClick={startEdit}
      className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
    >
      <span>€{monthlyIncome.toLocaleString()} /mo</span>
      <span className="text-xs opacity-60">✎</span>
    </button>
  );
}
```

- [ ] **Step 3: Verify build passes**

```bash
npm run build
```

---

## Task 6: Create Item components

**Files:**
- Create: `src/features/Item/ItemInput.tsx`
- Create: `src/features/Item/Perspectives.tsx`
- Create: `src/features/Item/BudgetImpact.tsx`

- [ ] **Step 1: Create `src/features/Item/ItemInput.tsx`**

```typescript
import { useAppState, useAppDispatch } from '../../state/store';

export function ItemInput() {
  const { item } = useAppState();
  const dispatch = useAppDispatch();

  const hasContent = item.name || item.price > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex-1 space-y-3">
          <input
            type="text"
            placeholder="What do you want to buy?"
            value={item.name}
            onChange={(e) => dispatch({ type: 'SET_ITEM', payload: { name: e.target.value } })}
            className="w-full text-xl font-semibold bg-transparent border-b-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 outline-none py-2 text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 transition-colors"
          />
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium text-gray-400 dark:text-gray-500">€</span>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={item.price || ''}
              onChange={(e) => dispatch({ type: 'SET_ITEM', payload: { price: parseFloat(e.target.value) || 0 } })}
              className="w-36 text-2xl font-bold bg-transparent border-b-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 outline-none py-2 text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 transition-colors"
            />
          </div>
        </div>
        {hasContent && (
          <button
            onClick={() => dispatch({ type: 'CLEAR_ITEM' })}
            className="mt-2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Clear"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/features/Item/Perspectives.tsx`**

```typescript
import { useAppState } from '../../state/store';
import { getPerspectives, formatHours, formatMonths } from '../../utils/perspectives';

export function Perspectives() {
  const { item, monthlyIncome } = useAppState();

  if (!item.price || item.price <= 0 || !monthlyIncome) return null;

  const { hoursOfWork, monthsToSave, relatableCount, relatableName } = getPerspectives(item.price, monthlyIncome);

  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5 space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
        What it actually costs you
      </h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatHours(hoursOfWork)}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">of work</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{relatableCount}×</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{relatableName}</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatMonths(monthsToSave)}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">to save (20%)</div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create `src/features/Item/BudgetImpact.tsx`**

```typescript
import { useAppState } from '../../state/store';
import { getBudgetImpact } from '../../utils/perspectives';

export function BudgetImpact() {
  const { item, monthlyIncome } = useAppState();

  if (!item.price || item.price <= 0 || !monthlyIncome) return null;

  const { percentage, remaining, exceedsIncome } = getBudgetImpact(item.price, monthlyIncome);

  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5 space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
        Budget impact
      </h3>

      {exceedsIncome ? (
        <p className="text-sm font-semibold text-red-600 dark:text-red-400">
          ⚠ Exceeds one month's income
        </p>
      ) : (
        <>
          <div className="w-full h-3 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-400 transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-gray-900 dark:text-white">
              {percentage.toFixed(1)}% of monthly income
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              €{remaining.toLocaleString('en', { maximumFractionDigits: 0 })} left
            </span>
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Verify build passes**

```bash
npm run build
```

---

## Task 7: Create Decision components

**Files:**
- Create: `src/features/Decision/Checks.tsx`
- Create: `src/features/Decision/Verdict.tsx`

- [ ] **Step 1: Create `src/features/Decision/Checks.tsx`**

Gut check + 3 value toggles in one cohesive block, no sub-headings.

```typescript
import { useAppState, useAppDispatch } from '../../state/store';

export function Checks() {
  const { gutCheck, valueFilter, item } = useAppState();
  const dispatch = useAppDispatch();

  if (!item.price || item.price <= 0) return null;

  const toggle = (field: keyof typeof valueFilter) =>
    dispatch({ type: 'SET_VALUE_FILTER', payload: { [field]: !valueFilter[field] } });

  const gut = (val: 'yes' | 'no') =>
    dispatch({ type: 'SET_GUT_CHECK', payload: gutCheck === val ? null : val });

  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5 space-y-5">
      {/* Gut check */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Would I still want this if nobody ever saw it?
        </p>
        <div className="flex gap-3">
          {(['yes', 'no'] as const).map((val) => (
            <button
              key={val}
              onClick={() => gut(val)}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                gutCheck === val
                  ? val === 'yes'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-2 border-green-400'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-2 border-red-400'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              {val === 'yes' ? 'Yes' : 'No'}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 dark:border-gray-700" />

      {/* Value toggles */}
      <div className="space-y-3">
        {[
          { key: 'useOften' as const, label: "I'll use it often" },
          { key: 'improvesDay' as const, label: 'It improves my day' },
          { key: 'affordable' as const, label: "I can afford it without touching savings" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => toggle(key)}
            className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium transition-all text-left ${
              valueFilter[key]
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-transparent'
            }`}
          >
            <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs ${
              valueFilter[key]
                ? 'border-blue-500 bg-blue-500 text-white'
                : 'border-gray-300 dark:border-gray-500'
            }`}>
              {valueFilter[key] ? '✓' : ''}
            </span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/features/Decision/Verdict.tsx`**

```typescript
import { useAppState } from '../../state/store';
import { calculateDecision } from '../../utils/rules';

export function Verdict() {
  const state = useAppState();

  if (!state.item.price || state.item.price <= 0) return null;

  const { verdict, reason } = calculateDecision(state);

  const styles = {
    buy: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      label: 'text-green-700 dark:text-green-300',
      badge: 'bg-green-500',
      text: 'Buy it',
    },
    wait: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      label: 'text-amber-700 dark:text-amber-300',
      badge: 'bg-amber-500',
      text: 'Wait',
    },
    skip: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      label: 'text-red-700 dark:text-red-300',
      badge: 'bg-red-500',
      text: 'Skip it',
    },
  };

  const s = styles[verdict];

  return (
    <div className={`rounded-2xl border p-5 ${s.bg} ${s.border}`}>
      <div className="flex items-center gap-3">
        <span className={`px-3 py-1 rounded-full text-white text-sm font-bold ${s.badge}`}>
          {s.text}
        </span>
        <p className={`text-sm font-medium ${s.label}`}>{reason}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify build passes**

```bash
npm run build
```

---

## Task 8: Rewrite `src/App.tsx` and delete removed files

**Files:**
- Modify: `src/App.tsx`
- Delete: all legacy feature files and `src/utils/time.ts`

- [ ] **Step 1: Rewrite `src/App.tsx`**

```typescript
import { useAppState } from './state/store';
import { Header } from './components/Header';
import { IncomeSetup } from './features/Setup/IncomeSetup';
import { IncomeChip } from './features/Setup/IncomeChip';
import { ItemInput } from './features/Item/ItemInput';
import { Perspectives } from './features/Item/Perspectives';
import { BudgetImpact } from './features/Item/BudgetImpact';
import { Checks } from './features/Decision/Checks';
import { Verdict } from './features/Decision/Verdict';

export function App() {
  const { monthlyIncome } = useAppState();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {monthlyIncome === 0 && <IncomeSetup />}
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-4 max-w-2xl">
        {monthlyIncome > 0 && (
          <div className="flex justify-end">
            <IncomeChip />
          </div>
        )}
        <ItemInput />
        <Perspectives />
        <BudgetImpact />
        <Checks />
        <Verdict />
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Delete legacy feature files**

```bash
rm src/features/Decision/CurrentItem.tsx
rm src/features/Decision/GutCheck.tsx
rm src/features/Decision/ValueFilter.tsx
rm src/features/Decision/Summary.tsx
rm src/features/MoneyMap/Buckets.tsx
rm src/features/Wishlist/WishlistForm.tsx
rm src/features/Wishlist/WishlistList.tsx
rm src/features/Advisor/Advisor.tsx
rm src/features/Settings/Settings.tsx
rm src/utils/time.ts
```

- [ ] **Step 3: Remove empty directories**

```bash
rmdir src/features/MoneyMap
rmdir src/features/Wishlist
rmdir src/features/Advisor
rmdir src/features/Settings
```

- [ ] **Step 4: Final build — must be clean**

```bash
npm run build
```
Expected: zero TypeScript errors, successful Vite bundle.

- [ ] **Step 5: Run dev server and verify manually**

```bash
npm run dev
```

Open http://localhost:5173. Verify:
1. Income setup screen appears on first load
2. After entering income, main page shows
3. Typing item name + price makes perspectives and budget impact cards appear
4. Gut check and value toggles appear
5. Verdict updates live as toggles change
6. Income chip shows at top right, click to edit
7. Clear (✕) button resets item + checks
8. Reload — item, income, and toggle state all persist
9. Dark mode toggle works

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: simplify app to single reactive page with price perspectives"
```
