# Buying Decision Maker

A fully client-side React app that helps you evaluate whether a purchase is worth it. No backend, no APIs - your income, item draft, usage estimates, and decision inputs stay in your browser's localStorage.

## Features

- **Income Prompt**: Capture monthly take-home income on first launch and edit it later from the header area
- **Item Input**: Enter item name, price, expected hours per week, and expected lifespan
- **Perspective Metrics**: See the purchase as hours of work, comparable repeated purchases, and time to save
- **Budget Impact**: View how much of one month's income the purchase consumes
- **Cost Per Hour**: Compare estimated cost per hour of use against common entertainment benchmarks
- **7-Second Gut Check**: Would you still want this if nobody ever saw it?
- **3-Part Value Filter**: Evaluate purchases based on frequency of use, impact on your day, and affordability
- **Verdict**: Get a clear Buy it, Wait, or Skip it result with reasoning
- **Shared UI Theme**: Uses shared `@prasheel/ui` primitives and theme switcher
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
3. Configure GitHub Pages for the repository
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

1. **Item Required**: Enter an item name and price before a verdict is produced.
2. **Gut Check Required**: Answer whether you would still want it if nobody saw it.
3. **Affordability Check**: If it would require savings or debt, the verdict is Skip it.
4. **Value Criteria**: If it is affordable and both use/value checks pass, the verdict is Buy it. If only one passes, the verdict is Wait.

The perspective, budget impact, and cost-per-hour panels do not change the verdict directly. They give extra context before you answer the checks.

### Data Structure

All app data is stored in localStorage under the key `buying-decision-maker`:

```typescript
{
  monthlyIncome: number,
  item: { name: string, price: number },
  gutCheck: 'yes' | 'no' | null,
  valueFilter: { useOften, improvesDay, affordable },
  usage: { hoursPerWeek: number, lifespanYears: number }
}
```

## Testing Scenarios

1. **Gut=No, any value checks** → Skip it
2. **Gut=Yes, affordable=false** → Skip it
3. **Gut=Yes, affordable=true, useOften=true, improvesDay=true** → Buy it
4. **Gut=Yes, affordable=true, only one of useOften/improvesDay=true** → Wait

## License

MIT - Feel free to use this for your personal financial decision-making!

## Credits

Built as a local-first purchase decision helper.
