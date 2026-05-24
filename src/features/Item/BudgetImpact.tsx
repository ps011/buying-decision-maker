import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@prasheel/ui';
import { useAppState } from '../../state/store';
import { getBudgetImpact } from '../../utils/perspectives';

export function BudgetImpact() {
  const { item, monthlyIncome } = useAppState();

  if (!item.price || item.price <= 0 || !monthlyIncome) return null;

  const { percentage, remaining, exceedsIncome } = getBudgetImpact(item.price, monthlyIncome);

  const barColor = exceedsIncome || percentage > 50
    ? 'bg-red-500'
    : percentage > 25
    ? 'bg-amber-400'
    : 'bg-main';

  return (
    <Card className="card-enter">
      <CardContent className="p-5 space-y-4">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Budget impact
        </p>

        {exceedsIncome ? (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle size={16} aria-hidden="true" />
            <span className="text-sm font-bold">Exceeds one month's income</span>
          </div>
        ) : (
          <>
            <div
              className="w-full h-4 border-2 border-border bg-background overflow-hidden"
              role="progressbar"
              aria-valuenow={Math.round(percentage)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${percentage.toFixed(1)}% of monthly income`}
            >
              <div
                className={`h-full transition-all duration-300 motion-reduce:transition-none ${barColor}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex justify-between items-baseline gap-4">
              <span className="text-sm font-bold text-foreground tabular-nums">
                {percentage.toFixed(1)}%{' '}
                <span className="font-normal text-muted-foreground">of monthly income</span>
              </span>
              <span className="text-sm text-muted-foreground tabular-nums whitespace-nowrap font-medium">
                €{remaining.toLocaleString('en', { maximumFractionDigits: 0 })} left
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
