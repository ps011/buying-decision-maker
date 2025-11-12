import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, AppAction, initialState } from './types';
import { loadState, saveState } from '../utils/storage';

const AppStateContext = createContext<AppState | undefined>(undefined);
const AppDispatchContext = createContext<React.Dispatch<AppAction> | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_GUT_CHECK':
      return { ...state, gutCheck: action.payload };
    case 'SET_VALUE_FILTER':
      return { ...state, valueFilter: { ...state.valueFilter, ...action.payload } };
    case 'SET_BUCKETS':
      return { ...state, buckets: { ...state.buckets, ...action.payload } };
    case 'SET_MONTHLY_INCOME':
      return { ...state, monthlyIncome: action.payload };
    case 'ADD_WISHLIST_ITEM':
      return { ...state, wishlist: [action.payload, ...state.wishlist] };
    case 'REMOVE_WISHLIST_ITEM':
      return { ...state, wishlist: state.wishlist.filter(item => item.id !== action.payload) };
    case 'MARK_PURCHASED':
      return {
        ...state,
        wishlist: state.wishlist.map(item =>
          item.id === action.payload ? { ...item, purchasedAt: Date.now() } : item
        ),
      };
    case 'SET_LUXURY_THRESHOLD':
      return { ...state, luxuryThreshold: action.payload };
    case 'SET_CURRENT_ITEM':
      return { ...state, currentItem: { ...state.currentItem, ...action.payload } };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    case 'CLEAR_ALL_DATA':
      return { ...initialState, theme: state.theme };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const savedState = loadState();
    if (savedState) {
      dispatch({ type: 'LOAD_STATE', payload: savedState });
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (!savedState?.theme) {
      dispatch({ type: 'SET_THEME', payload: prefersDark ? 'dark' : 'light' });
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveState(state);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [state]);

  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
}

export function useAppDispatch() {
  const context = useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error('useAppDispatch must be used within an AppProvider');
  }
  return context;
}

