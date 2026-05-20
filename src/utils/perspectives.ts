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

  // Pick the item whose count is closest to 4 (feels most human)
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
