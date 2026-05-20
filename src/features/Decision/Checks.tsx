import { Check } from 'lucide-react';
import { useAppState, useAppDispatch } from '../../state/store';

export function Checks() {
  const { gutCheck, valueFilter, item } = useAppState();
  const dispatch = useAppDispatch();

  if (!item.price || item.price <= 0) return null;

  const toggle = (field: keyof typeof valueFilter) =>
    dispatch({ type: 'SET_VALUE_FILTER', payload: { [field]: !valueFilter[field] } });

  const gut = (val: 'yes' | 'no') =>
    dispatch({ type: 'SET_GUT_CHECK', payload: gutCheck === val ? null : val });

  return (
    <div className="card-enter rounded-base border-2 border-border bg-secondary-background shadow-shadow p-5 space-y-5">
      {/* Gut check */}
      <div className="space-y-3">
        <p className="text-sm font-bold text-foreground leading-snug">
          Would I still want this if nobody ever saw it?
        </p>
        <div className="flex gap-3" role="group" aria-label="Gut check">
          {(['yes', 'no'] as const).map((val) => (
            <button
              key={val}
              onClick={() => gut(val)}
              aria-pressed={gutCheck === val}
              style={{ touchAction: 'manipulation' }}
              className={`flex-1 min-h-[48px] rounded-base border-2 border-border font-bold text-sm cursor-pointer transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground ${
                gutCheck === val
                  ? val === 'yes'
                    ? 'bg-green-500 text-white translate-x-boxShadowX translate-y-boxShadowY shadow-none'
                    : 'bg-red-500 text-white translate-x-boxShadowX translate-y-boxShadowY shadow-none'
                  : 'bg-secondary-background text-foreground shadow-shadow-sm hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none active:translate-x-boxShadowX active:translate-y-boxShadowY active:shadow-none'
              }`}
            >
              {val === 'yes' ? 'Yes' : 'No'}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t-2 border-border" />

      {/* Value toggles */}
      <div className="space-y-2" role="group" aria-label="Value criteria">
        {[
          { key: 'useOften' as const, label: "I'll use it often" },
          { key: 'improvesDay' as const, label: 'It improves my day' },
          { key: 'affordable' as const, label: "I can afford it without touching savings" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => toggle(key)}
            aria-pressed={valueFilter[key]}
            style={{ touchAction: 'manipulation' }}
            className={`w-full flex items-center gap-3 min-h-[48px] py-3 px-4 rounded-base border-2 border-border text-sm font-medium cursor-pointer text-left transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground ${
              valueFilter[key]
                ? 'bg-main text-main-foreground translate-x-boxShadowX translate-y-boxShadowY shadow-none'
                : 'bg-secondary-background text-foreground shadow-shadow-sm hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none active:translate-x-boxShadowX active:translate-y-boxShadowY active:shadow-none'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-base border-2 flex-shrink-0 flex items-center justify-center transition-colors duration-100 ${
                valueFilter[key]
                  ? 'border-main-foreground bg-main-foreground'
                  : 'border-border bg-secondary-background'
              }`}
              aria-hidden="true"
            >
              {valueFilter[key] && <Check size={11} className="text-main" strokeWidth={3} />}
            </span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
