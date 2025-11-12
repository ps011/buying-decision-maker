import { useAppState, useAppDispatch } from '../state/store';

export function Header() {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const toggleTheme = () => {
    dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' });
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md transition-colors">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Luxury vs Basic — Guilt-Free Spending Advisor
          </h1>
          
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-4">
              <button onClick={() => scrollToSection('decision')} className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Decision
              </button>
              <button onClick={() => scrollToSection('buckets')} className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Buckets
              </button>
              <button onClick={() => scrollToSection('wishlist')} className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Wishlist
              </button>
              <button onClick={() => scrollToSection('advisor')} className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Advisor
              </button>
              <button onClick={() => scrollToSection('settings')} className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Settings
              </button>
            </nav>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {state.theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

