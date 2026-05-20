export const BENCHMARKS = [
  { name: 'Streaming', costPerHour: 0.5 },
  { name: 'Sports / activities', costPerHour: 3 },
  { name: 'Cinema', costPerHour: 12 },
  { name: 'Dining out', costPerHour: 20 },
] as const;

export type Tier = 'exceptional' | 'good' | 'fair' | 'expensive';

export function calcCostPerHour(price: number, hoursPerWeek: number, lifespanYears: number): number {
  return price / (hoursPerWeek * 52 * lifespanYears);
}

export function getTier(cph: number): Tier {
  if (cph <= 3) return 'exceptional';
  if (cph <= 12) return 'good';
  if (cph <= 20) return 'fair';
  return 'expensive';
}

export const TIER_META: Record<Tier, { label: string; badge: string }> = {
  exceptional: {
    label: 'Exceptional value',
    badge: 'bg-green-500 text-white',
  },
  good: {
    label: 'Good value',
    badge: 'bg-main text-main-foreground',
  },
  fair: {
    label: 'Fair',
    badge: 'bg-amber-400 text-foreground',
  },
  expensive: {
    label: 'Expensive',
    badge: 'bg-red-500 text-white',
  },
};

export function getCheaperThanPercent(cph: number): number {
  const cheaper = BENCHMARKS.filter(b => cph <= b.costPerHour).length;
  return Math.round((cheaper / BENCHMARKS.length) * 100);
}
