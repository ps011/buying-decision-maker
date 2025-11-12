import { AppState } from '../state/types';

const STORAGE_KEY = 'luxury-vs-basic-advisor';

export function loadState(): Partial<AppState> | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized === null) {
      return null;
    }
    return JSON.parse(serialized);
  } catch (err) {
    console.error('Failed to load state:', err);
    return null;
  }
}

export function saveState(state: AppState): void {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    console.error('Failed to save state:', err);
  }
}

export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear storage:', err);
  }
}

export function exportData(state: AppState): void {
  const data = JSON.stringify(state, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `luxury-vs-basic-backup-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

