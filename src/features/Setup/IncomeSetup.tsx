import { useState } from 'react';
import { Button, Card, CardContent } from '@prasheel/ui';
import { useAppDispatch } from '../../state/store';

export function IncomeSetup() {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState('');

  const confirm = () => {
    const n = parseFloat(value);
    if (n > 0) dispatch({ type: 'SET_MONTHLY_INCOME', payload: n });
  };

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50 px-6">
      <Card className="w-full max-w-sm">
        <CardContent className="p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">One quick thing</h2>
            <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
              What's your monthly take-home income? Stays on your device only — used to put prices in perspective.
            </p>
          </div>
          <div>
            <label htmlFor="income-setup" className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-3">
              Monthly income
            </label>
            <div className="flex items-center gap-2 border-b-2 border-border pb-2">
              <span className="text-xl font-bold text-muted-foreground">€</span>
              <input
                id="income-setup"
                type="number"
                inputMode="decimal"
                min="1"
                placeholder="3500"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && confirm()}
                className="flex-1 text-2xl font-bold bg-transparent outline-none text-foreground placeholder:text-muted-foreground/30 focus-visible:outline-none"
                autoFocus
              />
            </div>
          </div>
          <Button
            type="button"
            onClick={confirm}
            disabled={!value || parseFloat(value) <= 0}
            className="w-full"
          >
            Let's go
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
