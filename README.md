# Luxury vs Basic — Guilt-Free Spending Advisor

A fully client-side React app that helps you make guilt-free spending decisions using a systematic framework. No backend, no APIs—all your data stays in your browser's localStorage.

## Features

- **7-Second Gut Check**: Would you still want this if nobody ever saw it?
- **3-Part Value Filter**: Evaluate purchases based on frequency of use, impact on your day, and affordability
- **Money Map (Buckets)**: Allocate your income across Essentials, Future Fund, and Freedom Fund
- **48-Hour Wishlist**: Add items and let the initial excitement fade before deciding
- **Decision Summary**: Get a clear verdict (Buy/Wait/Defer) with reasoning
- **Ask the Advisor**: Rule-based guidance for tricky purchase decisions
- **Settings**: Customize luxury threshold, export/import data
- **Light/Dark Theme**: Automatic theme detection with manual toggle
- **Fully Offline**: Works completely offline after initial load

## Getting Started

### Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

1. Push this code to a GitHub repository
2. Ensure the default branch is `main`
3. Go to **Settings → Pages**
4. Set **Source** to "GitHub Actions"
5. Go to **Actions** and enable workflows if needed
6. Push to `main` branch or manually trigger the workflow
7. Wait for the deployment to complete
8. Your app will be live at `https://<username>.github.io/<repository-name>/`

The GitHub Actions workflow is already configured in `.github/workflows/deploy.yml`.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for styling
- **localStorage** for data persistence
- **GitHub Actions** for CI/CD
- **GitHub Pages** for hosting

## How It Works

### Decision Logic

The app uses a deterministic rule-based system to evaluate purchases:

1. **Affordability Check**: If it touches savings/debt, defer
2. **48-Hour Rule**: Items above luxury threshold must wait 48 hours
3. **Gut Check + Value Filter**: Need positive gut check and at least 2/3 value criteria
4. **Scoring**: 0 value filters = Defer, 1 = Wait, 2-3 = potential Buy

### Advisor Rules

The Advisor analyzes your text for signals:

- Risky finance keywords (credit, EMI, debt) → Defer
- Daily use + quality/durability → Buy (if affordable)
- Status/FOMO/peer pressure → Wait
- Sale/discount without value → Wait ("sale ≠ value")

### Data Structure

All data is stored in localStorage under the key `luxury-vs-basic-advisor`:

```typescript
{
  theme: 'light' | 'dark',
  gutCheck: 'yes' | 'no' | null,
  valueFilter: { useOften, improvesDay, affordable },
  buckets: { essentials, futureFund, freedomFund },
  monthlyIncome: number,
  wishlist: WishlistItem[],
  luxuryThreshold: number,
  currentItem: { name, price }
}
```

## Testing Scenarios

1. **Gut=No, Value=1/3, Price>threshold, Wishlist<48h** → Wait
2. **Gut=Yes, Value=3/3, Freedom Fund covers item, Wishlist≥48h** → Buy
3. **Advisor text mentions "credit card EMI"** → Defer
4. **"On sale 30% off but just for status"** → Wait

## License

MIT - Feel free to use this for your personal financial decision-making!

## Credits

Built with the "Luxury vs Basic" framework for guilt-free spending.
