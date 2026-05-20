import { Clock, Repeat, PiggyBank } from 'lucide-react';
import { useAppState } from '../../state/store';
import { getPerspectives, formatHours, formatMonths } from '../../utils/perspectives';

export function Perspectives() {
  const { item, monthlyIncome } = useAppState();

  if (!item.price || item.price <= 0 || !monthlyIncome) return null;

  const { hoursOfWork, monthsToSave, relatableCount, relatableName } = getPerspectives(item.price, monthlyIncome);

  return (
    <div className="card-enter rounded-base border-2 border-border bg-secondary-background shadow-shadow p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-4">
        What it actually costs you
      </p>
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Clock, label: 'of work', value: formatHours(hoursOfWork), sub: null },
          { icon: Repeat, label: relatableName, value: `${relatableCount}×`, sub: null },
          { icon: PiggyBank, label: 'to save', value: formatMonths(monthsToSave), sub: 'at 20%' },
        ].map(({ icon: Icon, label, value, sub }) => (
          <div key={label} className="p-3 rounded-base border-2 border-border bg-background space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground min-h-[20px]">
              <Icon size={13} aria-hidden="true" />
              <span className="text-xs font-medium truncate">{label}</span>
            </div>
            <div className="text-xl font-bold text-foreground tabular-nums leading-tight">
              {value}
            </div>
            {sub && <div className="text-xs text-muted-foreground font-medium">{sub}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
