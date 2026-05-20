import { AppState } from '../state/types';

export interface DecisionResult {
  verdict: 'buy' | 'wait' | 'skip';
  reason: string;
}

export function calculateDecision(state: AppState): DecisionResult {
  const { gutCheck, valueFilter, item } = state;

  if (!item.name || item.price <= 0) {
    return { verdict: 'wait', reason: 'Enter an item name and price to get a verdict.' };
  }

  // Don't emit skip/buy until the user has actively answered the gut check
  if (gutCheck === null) {
    return { verdict: 'wait', reason: 'Answer the gut check above to continue.' };
  }

  if (gutCheck === 'no') {
    return { verdict: 'skip', reason: 'Gut check failed — looks like external pressure, not genuine want.' };
  }

  // gutCheck === 'yes' from here
  if (!valueFilter.affordable) {
    return { verdict: 'skip', reason: "You'd need to touch savings or go into debt." };
  }

  const valueScore = [valueFilter.useOften, valueFilter.improvesDay].filter(Boolean).length;

  if (valueScore === 2) {
    return { verdict: 'buy', reason: 'Gut check passed and all value criteria met.' };
  }

  if (valueScore === 1) {
    return { verdict: 'wait', reason: 'Only 1 of 2 value criteria met — keep evaluating.' };
  }

  return { verdict: 'wait', reason: 'Check the value criteria above to continue.' };
}
