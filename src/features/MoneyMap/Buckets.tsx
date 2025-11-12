import { useAppState, useAppDispatch } from '../../state/store';
import { PercentInput } from '../../components/PercentInput';
import { NumberInput } from '../../components/NumberInput';

export function Buckets() {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const total = state.buckets.essentials + state.buckets.futureFund + state.buckets.freedomFund;
  const isValid = total === 100;

  const essentialsAmount = (state.monthlyIncome * state.buckets.essentials) / 100;
  const futureFundAmount = (state.monthlyIncome * state.buckets.futureFund) / 100;
  const freedomFundAmount = (state.monthlyIncome * state.buckets.freedomFund) / 100;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          Money Map (Buckets)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PercentInput
            label="Essentials"
            value={state.buckets.essentials}
            onChange={(value) => dispatch({ type: 'SET_BUCKETS', payload: { essentials: value } })}
            error={!isValid ? 'Total must equal 100%' : ''}
          />
          <PercentInput
            label="Future Fund"
            value={state.buckets.futureFund}
            onChange={(value) => dispatch({ type: 'SET_BUCKETS', payload: { futureFund: value } })}
            error={!isValid ? 'Total must equal 100%' : ''}
          />
          <PercentInput
            label="Freedom Fund"
            value={state.buckets.freedomFund}
            onChange={(value) => dispatch({ type: 'SET_BUCKETS', payload: { freedomFund: value } })}
            error={!isValid ? 'Total must equal 100%' : ''}
          />
        </div>
        {!isValid && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
            ⚠️ Total is {total}%. Adjust percentages to equal exactly 100%.
          </div>
        )}
      </div>

      <div>
        <NumberInput
          label="Monthly Income"
          value={state.monthlyIncome}
          onChange={(value) => dispatch({ type: 'SET_MONTHLY_INCOME', payload: Math.max(0, value) })}
          min={0}
          prefix="€"
        />
      </div>

      {state.monthlyIncome > 0 && isValid && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Essentials</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">€{essentialsAmount.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Future Fund</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">€{futureFundAmount.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Freedom Fund</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">€{freedomFundAmount.toFixed(2)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

