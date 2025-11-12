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
    Header.tsx         # Sticky header with nav and theme toggle
    SectionCard.tsx    # Card wrapper for sections
    Button.tsx         # Button component
    Toggle.tsx         # Checkbox toggle
    NumberInput.tsx    # Number input with prefix
    PercentInput.tsx   # Percentage input (0-100)
    TextArea.tsx       # Textarea component
    Chips.tsx          # Status chips
    Modal.tsx          # Modal dialog
    
  /features            # Feature-specific components
    /Decision
      GutCheck.tsx     # Yes/No gut check buttons
      ValueFilter.tsx  # 3 checkboxes for value criteria
      CurrentItem.tsx  # Name + price input
      Summary.tsx      # Decision verdict card
    /MoneyMap
      Buckets.tsx      # Budget allocation with 3 buckets
    /Wishlist
      WishlistForm.tsx # Add items form
      WishlistList.tsx # List with age tracking
    /Advisor
      Advisor.tsx      # Q&A with rule-based guidance
    /Settings
      Settings.tsx     # Threshold, export, clear data
      
  /state               # State management
    types.ts           # TypeScript types
    store.tsx          # Context + Reducer
    
  /utils               # Utility functions
    storage.ts         # localStorage helpers
    time.ts            # Age calculation
    rules.ts           # Decision + advisor logic
    
  App.tsx              # Main app component
  main.tsx             # Entry point
  index.css            # Tailwind imports
```

## How to Use

### 1. Set Up Your Buckets

Go to the **Money Map** section and:
- Adjust percentages for Essentials, Future Fund, and Freedom Fund (must total 100%)
- Enter your monthly income
- See live calculations of absolute amounts

### 2. Evaluate a Purchase

In the **Decision Framework** section:
- Enter item name and price in "Current Item"
- Answer the gut check: "Would I still want this if nobody saw it?"
- Check the 3 value filters
- See your verdict (Buy/Wait/Defer) with reasoning

### 3. Add to Wishlist

For items you're not sure about:
- Use the **48-Hour Wishlist** section
- Add item with name, price, link, and notes
- Watch the age counter update every minute
- Items show "Waiting" (<48h) or "Ready" (≥48h) status
- Click "Evaluate" to load into Decision Framework

### 4. Ask the Advisor

Need guidance on a tricky decision?
- Go to **Ask the Advisor**
- Describe your situation or doubt
- Get a verdict (Buy/Wait/Defer) with reasons and next steps
- The advisor uses keyword detection to match framework rules

### 5. Customize Settings

- Adjust **Luxury Threshold** (default €100) to control 48-hour rule
- **Export Data** to download a JSON backup
- **Clear All Data** to reset everything (with confirmation)

## Deploy to GitHub Pages

1. Push to a GitHub repo
2. Enable GitHub Actions in repo settings
3. Go to Settings → Pages → Source: "GitHub Actions"
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
- **Expected**: Defer (status-seeking, no genuine value)

### Scenario 2: Daily Essential
- Item: Quality Backpack, €80
- Gut: Yes
- Value: 3/3 checks (use often, improves day, affordable)
- Monthly income: €2000, Freedom Fund: 20% (€400)
- **Expected**: Buy (under threshold, all checks pass)

### Scenario 3: Luxury Item
- Item: Laptop, €1200
- Gut: Yes
- Value: 3/3 checks
- Add to wishlist (just added)
- **Expected**: Wait (above threshold, <48h)

### Scenario 4: Advisor - Risky Finance
- Query: "I want to buy AirPods Max on EMI for 12 months"
- **Expected**: Defer (mentions EMI = debt for discretionary item)

### Scenario 5: Advisor - Sale Trap
- Query: "iPhone is 30% off but I just want it for status"
- **Expected**: Wait (sale + status keywords = external motivation)

## Theme Toggle

- Click 🌙/☀️ icon in header to toggle light/dark mode
- Theme preference is saved in localStorage
- Respects system preference on first load

## Data Persistence

All data is stored in localStorage under key `luxury-vs-basic-advisor`:
- Theme preference
- Gut check and value filter states
- Bucket allocations and monthly income
- Wishlist items with timestamps
- Luxury threshold
- Current item draft

Data persists across sessions. Use Export/Import for backups.

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
- **Live updates**: Wishlist ages update every 60 seconds
- **Copy verdict**: Click 📋 on decision summary to copy verdict text

Enjoy guilt-free spending! 🎯

