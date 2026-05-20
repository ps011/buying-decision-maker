import { useAppState } from '../../state/store';
import { calculateDecision } from '../../utils/rules';
import { calcCostPerHour, getTier, TIER_META } from '../../utils/costPerHour';

const badges = {
  buy: 'bg-green-500 text-white',
  wait: 'bg-amber-400 text-foreground',
  skip: 'bg-red-500 text-white',
};

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
    <div
      className="card-enter rounded-base border-2 border-border bg-secondary-background shadow-shadow p-5 space-y-3"
      role="status"
      aria-live="polite"
    >
      {/* Framework signal */}
      <div className="flex items-start gap-3 flex-wrap">
        <span className={`px-3.5 py-1.5 rounded-base border-2 border-border text-sm font-bold flex-shrink-0 shadow-shadow-sm ${badges[verdict]}`}>
          {labels[verdict]}
        </span>
        <p className="text-sm font-medium pt-1 leading-snug text-foreground">{reason}</p>
      </div>

      {/* CPHoJ signal */}
      {cph !== null && cphMeta && (
        <div className="flex items-center gap-3 flex-wrap pt-2 border-t-2 border-border">
          <span className={`px-3 py-1 rounded-base border-2 border-border text-xs font-bold flex-shrink-0 shadow-shadow-sm ${cphMeta.badge}`}>
            {cphMeta.label}
          </span>
          <p className="text-xs font-medium text-muted-foreground tabular-nums">
            {fmt(cph)}/hr of joy
          </p>
        </div>
      )}
    </div>
  );
}
