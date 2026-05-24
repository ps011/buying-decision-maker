import { Badge, Card, CardContent } from '@prasheel/ui';
import { useAppState } from '../../state/store';
import { calculateDecision } from '../../utils/rules';
import { calcCostPerHour, getTier, TIER_META } from '../../utils/costPerHour';

const badgeVariants = {
  buy: 'success',
  wait: 'warning',
  skip: 'destructive',
} as const;

const labels = {
  buy: 'Buy it',
  wait: 'Wait',
  skip: 'Skip it',
};

export function Verdict() {
  const state = useAppState();

  if (!state.item.price || state.item.price <= 0) return null;

  const { verdict, reason } = calculateDecision(state);

  const hasCph = state.usage.hoursPerWeek > 0 && state.usage.lifespanYears > 0;
  const cph = hasCph
    ? calcCostPerHour(state.item.price, state.usage.hoursPerWeek, state.usage.lifespanYears)
    : null;
  const cphTier = cph !== null ? getTier(cph) : null;
  const cphMeta = cphTier ? TIER_META[cphTier] : null;

  const fmt = (n: number) => n < 1 ? `€${n.toFixed(2)}` : `€${n.toFixed(n < 10 ? 1 : 0)}`;

  return (
    <Card
      className="card-enter"
      role="status"
      aria-live="polite"
    >
      <CardContent className="p-5 space-y-3">
        {/* Framework signal */}
        <div className="flex items-start gap-3 flex-wrap">
          <Badge variant={badgeVariants[verdict]} className="px-3.5 py-1.5 text-sm font-bold flex-shrink-0 shadow-shadow-sm">
            {labels[verdict]}
          </Badge>
          <p className="text-sm font-medium pt-1 leading-snug text-foreground">{reason}</p>
        </div>

        {/* CPHoJ signal */}
        {cph !== null && cphMeta && (
          <div className="flex items-center gap-3 flex-wrap pt-2 border-t-2 border-border">
            <Badge className={`px-3 py-1 text-xs font-bold flex-shrink-0 shadow-shadow-sm ${cphMeta.badge}`}>
              {cphMeta.label}
            </Badge>
            <p className="text-xs font-medium text-muted-foreground tabular-nums">
              {fmt(cph)}/hr of joy
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
