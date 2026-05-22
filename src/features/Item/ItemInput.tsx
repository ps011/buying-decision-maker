import { X } from 'lucide-react';
import { Button, Card, CardContent } from '@prasheel/ui';
import { useAppState, useAppDispatch } from '../../state/store';

const inputClass = "w-full bg-transparent border-b-2 border-border focus:border-main outline-none py-2 text-foreground placeholder:text-muted-foreground/30 transition-colors focus-visible:outline-none";

export function ItemInput() {
  const { item, usage } = useAppState();
  const dispatch = useAppDispatch();

  const hasContent = item.name || item.price > 0;

  return (
    <Card className="card-enter">
      <CardContent className="p-5 space-y-5">
        <div className="flex items-start gap-3">
          <div className="flex-1 space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="item-name" className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
                What do you want to buy?
              </label>
              <input
                id="item-name"
                type="text"
                placeholder="PS5, 4K TV, drone…"
                value={item.name}
                onChange={(e) => dispatch({ type: 'SET_ITEM', payload: { name: e.target.value } })}
                className={`text-2xl font-bold ${inputClass}`}
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="item-price" className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
                Price
              </label>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-muted-foreground">€</span>
                <input
                  id="item-price"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  placeholder="0"
                  value={item.price || ''}
                  onChange={(e) => dispatch({ type: 'SET_ITEM', payload: { price: parseFloat(e.target.value) || 0 } })}
                  className={`w-40 text-2xl font-bold ${inputClass}`}
                />
              </div>
            </div>

            {/* Usage — appears when price is set */}
            {item.price > 0 && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-border">
                <div>
                  <label htmlFor="hours-per-week" className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
                    Hours / week
                  </label>
                  <input
                    id="hours-per-week"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    placeholder="0"
                    value={usage.hoursPerWeek || ''}
                    onChange={(e) => dispatch({ type: 'SET_USAGE', payload: { hoursPerWeek: parseFloat(e.target.value) || 0 } })}
                    className={`text-xl font-bold ${inputClass}`}
                  />
                </div>
                <div>
                  <label htmlFor="lifespan-years" className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
                    Lifespan (years)
                  </label>
                  <input
                    id="lifespan-years"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    placeholder="0"
                    value={usage.lifespanYears || ''}
                    onChange={(e) => dispatch({ type: 'SET_USAGE', payload: { lifespanYears: parseFloat(e.target.value) || 0 } })}
                    className={`text-xl font-bold ${inputClass}`}
                  />
                </div>
              </div>
            )}
          </div>

          {hasContent && (
            <Button
              type="button"
              variant="neutral"
              size="icon"
              onClick={() => dispatch({ type: 'CLEAR_ITEM' })}
              className="mt-1 size-8 min-h-0 min-w-0 shrink-0 shadow-shadow-sm"
              aria-label="Clear item"
            >
              <X size={14} />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
