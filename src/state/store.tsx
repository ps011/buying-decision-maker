import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, AppAction, initialState } from './types';
import { loadState, saveState } from '../utils/storage';

const AppStateContext = createContext<AppState | undefined>(undefined);
const AppDispatchContext = createContext<React.Dispatch<AppAction> | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_MONTHLY_INCOME':
      return { ...state, monthlyIncome: action.payload };
    case 'SET_ITEM':
      return { ...state, item: { ...state.item, ...action.payload } };
    case 'SET_GUT_CHECK':
      return { ...state, gutCheck: action.payload };
    case 'SET_VALUE_FILTER':
      return { ...state, valueFilter: { ...state.valueFilter, ...action.payload } };
    case 'SET_USAGE':
      return { ...state, usage: { ...state.usage, ...action.payload } };
    case 'CLEAR_ITEM':
      return { ...state, item: { name: '', price: 0 }, gutCheck: null, valueFilter: initialState.valueFilter, usage: initialState.usage };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const saved = loadState();
    if (saved) dispatch({ type: 'LOAD_STATE', payload: saved });
  }, []);

  useEffect(() => {
    const id = setTimeout(() => saveState(state), 300);
    return () => clearTimeout(id);
  }, [state]);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}

export function useAppDispatch() {
  const ctx = useContext(AppDispatchContext);
  if (!ctx) throw new Error('useAppDispatch must be used within AppProvider');
  return ctx;
}
