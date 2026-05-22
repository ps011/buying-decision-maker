import { Check } from 'lucide-react';
import { Button, Card, CardContent } from '@prasheel/ui';
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
    <Card className="card-enter">
      <CardContent className="p-5 space-y-5">
        {/* Gut check */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-foreground leading-snug">
            Would I still want this if nobody ever saw it?
          </p>
          <div className="flex gap-3" role="group" aria-label="Gut check">
            {(['yes', 'no'] as const).map((val) => (
              <Button
                key={val}
                type="button"
                variant="neutral"
                onClick={() => gut(val)}
                aria-pressed={gutCheck === val}
                style={{ touchAction: 'manipulation' }}
                className={`flex-1 min-h-[48px] font-bold text-sm ${
                  gutCheck === val
                    ? val === 'yes'
                      ? 'bg-green-500 text-white translate-x-boxShadowX translate-y-boxShadowY shadow-none'
                      : 'bg-red-500 text-white translate-x-boxShadowX translate-y-boxShadowY shadow-none'
                    : ''
                }`}
              >
                {val === 'yes' ? 'Yes' : 'No'}
              </Button>
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
            <Button
              key={key}
              type="button"
              variant="neutral"
              onClick={() => toggle(key)}
              aria-pressed={valueFilter[key]}
              style={{ touchAction: 'manipulation' }}
              className={`w-full justify-start whitespace-normal h-auto min-h-12 py-3 px-4 text-left text-sm font-medium gap-3 ${
                valueFilter[key]
                  ? 'bg-main text-main-foreground translate-x-boxShadowX translate-y-boxShadowY shadow-none'
                  : ''
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
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
