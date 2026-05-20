import { Moon, Sun } from 'lucide-react';
import { useAppState, useAppDispatch } from '../state/store';

export function Header() {
  const state = useAppState();
  const dispatch = useAppDispatch();

  return (
    <header className="sticky top-0 z-50 bg-background border-b-2 border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-2xl">
        <h1 className="text-lg font-bold text-foreground tracking-tight">
          Should I buy it?
        </h1>
        <button
          onClick={() => dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' })}
          className="p-2 rounded-base border-2 border-border bg-secondary-background text-foreground shadow-shadow-sm hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none active:translate-x-boxShadowX active:translate-y-boxShadowY active:shadow-none transition-all duration-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
          aria-label="Toggle theme"
        >
          {state.theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </header>
  );
}
