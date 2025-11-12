export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  url?: string;
  notes?: string;
  createdAt: number;
  purchasedAt?: number;
}

export interface ValueFilter {
  useOften: boolean;
  improvesDay: boolean;
  affordable: boolean;
}

export interface Buckets {
  essentials: number;
  futureFund: number;
  freedomFund: number;
}

export interface CurrentItem {
  name: string;
  price: number;
}

export interface AppState {
  theme: 'light' | 'dark';
  gutCheck: 'yes' | 'no' | null;
  valueFilter: ValueFilter;
  buckets: Buckets;
  monthlyIncome: number;
  wishlist: WishlistItem[];
  luxuryThreshold: number;
  currentItem: CurrentItem;
}

export type AppAction =
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_GUT_CHECK'; payload: 'yes' | 'no' | null }
  | { type: 'SET_VALUE_FILTER'; payload: Partial<ValueFilter> }
  | { type: 'SET_BUCKETS'; payload: Partial<Buckets> }
  | { type: 'SET_MONTHLY_INCOME'; payload: number }
  | { type: 'ADD_WISHLIST_ITEM'; payload: WishlistItem }
  | { type: 'REMOVE_WISHLIST_ITEM'; payload: string }
  | { type: 'MARK_PURCHASED'; payload: string }
  | { type: 'SET_LUXURY_THRESHOLD'; payload: number }
  | { type: 'SET_CURRENT_ITEM'; payload: Partial<CurrentItem> }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> }
  | { type: 'CLEAR_ALL_DATA' };

export const initialState: AppState = {
  theme: 'light',
  gutCheck: null,
  valueFilter: {
    useOften: false,
    improvesDay: false,
    affordable: false,
  },
  buckets: {
    essentials: 50,
    futureFund: 30,
    freedomFund: 20,
  },
  monthlyIncome: 0,
  wishlist: [],
  luxuryThreshold: 100,
  currentItem: {
    name: '',
    price: 0,
  },
};

