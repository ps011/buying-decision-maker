import { useAppState, useAppDispatch } from '../../state/store';

export function GutCheck() {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const handleSelect = (value: 'yes' | 'no') => {
    dispatch({ type: 'SET_GUT_CHECK', payload: state.gutCheck === value ? null : value });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
        7-Second Gut Check
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Would I still want this if nobody ever saw it?
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => handleSelect('yes')}
          className={`flex-1 py-4 px-6 rounded-lg border-2 font-medium transition-all ${
            state.gutCheck === 'yes'
              ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
          }`}
        >
          Yes
        </button>
        <button
          onClick={() => handleSelect('no')}
          className={`flex-1 py-4 px-6 rounded-lg border-2 font-medium transition-all ${
            state.gutCheck === 'no'
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
          }`}
        >
          No
        </button>
      </div>
    </div>
  );
}

