# Buying Decision Maker — Simplification Design

**Date:** 2026-05-20

## Goal

Reduce a complex 5-section app into a single reactive page that gives instant, personal answers to "should I buy this?" The core insight: price becomes meaningful when shown as hours of work and budget impact, not abstract euros.

---

## User Flow

### First visit
A full-screen income prompt: "What's your monthly income?" One number field, one confirm button. Income is stored and the prompt never appears again.

### Every visit after
- Item name + price fields (always visible, always editable)
- Analysis cards appear as soon as price > 0
- Decision checks appear below the cards
- Verdict updates live as checks are answered
- A small editable chip at the top shows current income ("€4,000 /mo ✎") — tap to change

---

## Analysis Cards (appear when price > 0 and income is set)

Two cards side by side (stacked on mobile).

### Perspectives card
- **Hours of work** — `price / (monthlyIncome / 160)`
- **Relatable equivalent** — matched against lookup table, pick the closest:
  - Coffee: €3.50 · Lunch out: €15 · Dinner out: €25 · Week of groceries: €80
  - Spotify: €10 · Netflix: €14 · Gym month: €40 · Phone bill: €30
- **Months to save** — `price / (monthlyIncome * 0.20)`, labeled "saving 20% of income"

### Budget impact card
- Horizontal bar: monthly income split into "this purchase" (highlighted) vs. "everything else"
- "That's **X%** of your monthly income"
- "You'd have **€Y** left for the month"
- If price > monthlyIncome: red flag — "Exceeds one month's income"

---

## Decision Checks (appear when price > 0)

Single cohesive block, no sub-headings:

1. **Gut check** — "Would I still want this if nobody saw it?" → Yes / No (large tap targets)
2. **Value toggles** — three pill toggles:
   - "I'll use it often"
   - "It improves my day"
   - "I can afford it without touching savings"

---

## Verdict (live-updating)

Prominent card below the checks.

| Verdict | Condition | Color |
|---------|-----------|-------|
| **Buy** | Gut check yes + affordable + 2 or more value filters | Green |
| **Wait** | Partial signals — gut check yes but only 1 value filter, or no gut check yet | Amber |
| **Skip** | Gut check no, or affordable toggle off, or 0 value filters met | Red |

One short reason line: "Only 1 of 3 value checks passed" — no paragraph explanations.

---

## State

```typescript
interface AppState {
  theme: 'light' | 'dark';
  monthlyIncome: number;
  item: { name: string; price: number };
  gutCheck: 'yes' | 'no' | null;
  valueFilter: { useOften: boolean; improvesDay: boolean; affordable: boolean };
}
```

- All state persists to `localStorage` (key: `buying-decision-maker`)
- Item state, gut check, and value filter all survive page reloads — pick up mid-evaluation
- State debounced 300ms before write (same as current)
- Income persists indefinitely; item/checks reset only when user clears them manually (a small "clear" icon on the item inputs)

---

## What Gets Removed

| Removed | Reason |
|---------|--------|
| MoneyMap / Buckets feature | Replaced by budget impact card with 20% heuristic |
| Wishlist feature | User doesn't use it; conflicts with "instant results" goal |
| Advisor feature | Keyword matching adds complexity, not value |
| Settings section | Luxury threshold not needed; income editable inline |
| `src/utils/time.ts` | 48-hour rule removed |
| Advisor logic in `src/utils/rules.ts` | `getAdvisorGuidance` removed; `calculateDecision` simplified |

---

## File Structure After Simplification

```
src/
  features/
    Setup/
      IncomeSetup.tsx       # full-screen first-visit prompt
      IncomeChip.tsx        # inline editable chip after setup
    Item/
      ItemInput.tsx         # name + price fields
      Perspectives.tsx      # hours of work, equivalent, months to save
      BudgetImpact.tsx      # bar + percentage + remaining
    Decision/
      Checks.tsx            # gut check + 3 value toggles combined
      Verdict.tsx           # live verdict card
  state/
    types.ts                # simplified AppState
    store.tsx               # unchanged pattern, fewer actions
  utils/
    storage.ts              # unchanged
    rules.ts                # calculateDecision only (no advisor)
    perspectives.ts         # NEW: price perspective calculations + lookup table
  components/               # existing shared components, keep as-is
```

---

## Key Decisions

- **20% income heuristic** — used for both "months to save" in perspectives and the affordability boundary in verdict logic, so numbers are consistent across the page
- **Item state persists** — user may evaluate the same item across multiple sessions before deciding; wiping on reload creates friction
- **Relatable equivalent lookup** — hardcoded table of ~10 common expenses in euros; pick the one that makes the ratio most human (e.g. "same as 14 coffees" is more relatable than "same as 0.5 months of Spotify")
- **No luxury threshold config** — hardcoded at €100 internally; the 48-hour rule is removed so the threshold only affects verdict wording, not gating
