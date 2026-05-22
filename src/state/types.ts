export interface ValueFilter {
  useOften: boolean;
  improvesDay: boolean;
  affordable: boolean;
}

export interface Item {
  name: string;
  price: number;
}

export interface Usage {
  hoursPerWeek: number;
  lifespanYears: number;
}

export interface AppState {
  monthlyIncome: number;
  item: Item;
  gutCheck: 'yes' | 'no' | null;
  valueFilter: ValueFilter;
  usage: Usage;
}

export type AppAction =
  | { type: 'SET_MONTHLY_INCOME'; payload: number }
  | { type: 'SET_ITEM'; payload: Partial<Item> }
  | { type: 'SET_GUT_CHECK'; payload: 'yes' | 'no' | null }
  | { type: 'SET_VALUE_FILTER'; payload: Partial<ValueFilter> }
  | { type: 'SET_USAGE'; payload: Partial<Usage> }
  | { type: 'CLEAR_ITEM' }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> };

export const initialState: AppState = {
  monthlyIncome: 0,
  item: { name: '', price: 0 },
  gutCheck: null,
  valueFilter: { useOften: false, improvesDay: false, affordable: false },
  usage: { hoursPerWeek: 0, lifespanYears: 0 },
};
