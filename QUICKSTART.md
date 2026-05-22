# Quick Start Guide

## Installation & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

## Project Structure

```
/src
  /components          # Reusable UI components
    Header.tsx         # Sticky header with theme switcher
    Modal.tsx          # Modal dialog
    NumberInput.tsx    # Number input with prefix
    PercentInput.tsx   # Percentage input (0-100)
    TextArea.tsx       # Textarea component
    Toggle.tsx         # Checkbox toggle
    
  /features            # Feature-specific components
    /Setup
      IncomeSetup.tsx  # First-run monthly income prompt
      IncomeChip.tsx   # Compact income editor
    /Item
      ItemInput.tsx    # Item, price, and usage inputs
      Perspectives.tsx # Work/time/savings perspective metrics
      BudgetImpact.tsx # Monthly income impact meter
      CostPerHour.tsx  # Cost-per-hour comparison
    /Decision
      Checks.tsx       # Gut check and value criteria
      Verdict.tsx      # Buy/wait/skip result
      
  /state               # State management
    types.ts           # TypeScript types
    store.tsx          # Context + Reducer
    
  /utils               # Utility functions
    storage.ts         # localStorage helpers
    rules.ts           # Verdict decision logic
    perspectives.ts    # Work/time/savings perspective helpers
    costPerHour.ts     # Cost-per-hour calculation and benchmarks
    
  App.tsx              # Main app component
  main.tsx             # Entry point
  index.css            # Tailwind imports
```

## How to Use

### 1. Set Monthly Income

On first launch, enter your monthly take-home income. Use the income chip near the top of the app to edit it later.

### 2. Evaluate a Purchase

In the main form:
- Enter the item name and price.
- Add expected hours per week and lifespan in years to see cost per hour.
- Review work/time/savings perspective metrics and monthly budget impact.
- Answer the gut check and value criteria.
- See the verdict: Buy it, Wait, or Skip it.

## Deploy to GitHub Pages

1. Push to a GitHub repo
2. Enable GitHub Actions in repo settings
3. Configure GitHub Pages to use source "GitHub Actions"
4. Push to `main` branch
5. Wait for deployment (check Actions tab)
6. Access at `https://<username>.github.io/<repo-name>/`

The workflow is already configured in `.github/workflows/deploy.yml`.

## Testing Scenarios

Try these to see the framework in action:

### Scenario 1: Impulse Buy
- Item: Designer Sneakers, €250
- Gut: No
- Value: 0/3 checks
- **Expected**: Skip it (external pressure, not genuine want)

### Scenario 2: Daily Essential
- Item: Quality Backpack, €80
- Gut: Yes
- Value: 3/3 checks (use often, improves day, affordable)
- Monthly income: €2000
- **Expected**: Buy it (all checks pass)

### Scenario 3: Needs More Thought
- Item: Laptop, €1200
- Gut: Yes
- Value: 1/3 checks
- **Expected**: Wait (only one value criterion met)

## Theme Toggle

- Click 🌙/☀️ icon in header to toggle light/dark mode

## Data Persistence

All app data is stored in localStorage under key `buying-decision-maker`:
- Monthly income
- Current item draft
- Gut check and value filter states
- Usage estimates

Data persists across sessions.

## Browser Support

Works in all modern browsers that support:
- localStorage
- ES2020+ JavaScript
- CSS custom properties
- Flexbox/Grid

## Offline Use

After initial load, the app works completely offline. All logic runs client-side with no API calls.

## Tips

- **Mobile responsive**: Works great on phones/tablets
- **Keyboard accessible**: All inputs have proper labels and focus states
- **Auto-save**: Changes are saved automatically with 300ms debounce
- **Cost perspective**: Add usage estimates to compare cost per hour against common entertainment benchmarks

Enjoy guilt-free spending! 🎯
