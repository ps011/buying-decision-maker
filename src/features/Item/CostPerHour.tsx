import { useAppState } from '../../state/store';
import {
  calcCostPerHour,
  getTier,
  TIER_META,
  BENCHMARKS,
  getCheaperThanPercent,
} from '../../utils/costPerHour';

export function CostPerHour() {
  const { item, usage } = useAppState();

  if (!item.price || item.price <= 0 || !usage.hoursPerWeek || !usage.lifespanYears) return null;

  const cph = calcCostPerHour(item.price, usage.hoursPerWeek, usage.lifespanYears);
  const tier = getTier(cph);
  const meta = TIER_META[tier];
  const cheaperThan = getCheaperThanPercent(cph);

  const rows = [
    ...BENCHMARKS.map(b => ({ name: b.name, cph: b.costPerHour, isUser: false })),
    { name: item.name || 'This purchase', cph, isUser: true },
  ].sort((a, b) => a.cph - b.cph);

  const maxCph = Math.max(...rows.map(r => r.cph));

  const fmt = (n: number) => n < 1 ? `€${n.toFixed(2)}` : `€${n.toFixed(n < 10 ? 1 : 0)}`;

  return (
    <div className="card-enter rounded-base border-2 border-border bg-secondary-background shadow-shadow p-5 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">
            Cost per hour of joy
          </p>
          <p className="text-3xl font-bold text-foreground tabular-nums leading-tight">
            {fmt(cph)}
            <span className="text-lg font-medium text-muted-foreground whitespace-nowrap">/hr</span>
          </p>
        </div>
        <span className={`mt-1 px-3 py-1.5 rounded-base border-2 border-border text-xs font-bold flex-shrink-0 shadow-shadow-sm ${meta.badge}`}>
          {meta.label}
        </span>
      </div>

      {cheaperThan > 0 && (
        <p className="text-sm text-green-600 dark:text-green-400 font-bold">
          Cheaper than {cheaperThan}% of typical entertainment
        </p>
      )}

      {/* Bar chart */}
      <div className="space-y-3" role="list" aria-label="Cost per hour comparison">
        {rows.map((row) => (
          <div key={row.name} role="listitem" className="space-y-1">
            <div className="flex justify-between items-baseline gap-2">
              <span className={`text-xs truncate ${
                row.isUser ? 'text-main font-bold' : 'text-muted-foreground font-medium'
              }`}>
                {row.isUser ? `→ ${row.name}` : row.name}
              </span>
              <span className={`text-xs tabular-nums flex-shrink-0 font-bold ${
                row.isUser ? 'text-main' : 'text-muted-foreground'
              }`}>
                {fmt(row.cph)}/hr
              </span>
            </div>
            <div
              className="w-full h-3 border-2 border-border bg-background overflow-hidden"
              role="progressbar"
              aria-valuenow={Math.round(row.cph)}
              aria-valuemax={Math.round(maxCph)}
              aria-label={`${row.name}: ${fmt(row.cph)} per hour`}
            >
              <div
                className={`h-full transition-all duration-500 motion-reduce:transition-none ${
                  row.isUser ? 'bg-main' : 'bg-gray-400 dark:bg-blue-200'
                }`}
                style={{ width: `${Math.max(2, (row.cph / maxCph) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
