import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { useAppState, useAppDispatch } from '../../state/store';

export function IncomeChip() {
  const { monthlyIncome } = useAppState();
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('');

  const startEdit = () => {
    setValue(String(monthlyIncome));
    setEditing(true);
  };

  const save = () => {
    const n = parseFloat(value);
    if (n > 0) dispatch({ type: 'SET_MONTHLY_INCOME', payload: n });
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-base border-2 border-border bg-secondary-background text-sm shadow-shadow-sm">
        <span className="font-bold text-muted-foreground">€</span>
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false); }}
          onBlur={save}
          className="w-20 bg-transparent outline-none text-foreground font-bold focus-visible:outline-none"
          autoFocus
        />
        <span className="text-muted-foreground font-medium">/mo</span>
      </div>
    );
  }

  return (
    <button
      onClick={startEdit}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-base border-2 border-border bg-secondary-background text-sm font-bold text-foreground shadow-shadow-sm hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none active:translate-x-boxShadowX active:translate-y-boxShadowY active:shadow-none transition-all duration-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
      aria-label="Edit monthly income"
    >
      <span>€{monthlyIncome.toLocaleString()} /mo</span>
      <Pencil size={12} />
    </button>
  );
}
