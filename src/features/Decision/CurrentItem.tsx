import { useAppState, useAppDispatch } from '../../state/store';
import { NumberInput } from '../../components/NumberInput';

export function CurrentItem() {
  const state = useAppState();
  const dispatch = useAppDispatch();

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
        Current Item
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Item Name</label>
          <input
            type="text"
            value={state.currentItem.name}
            onChange={(e) => dispatch({ type: 'SET_CURRENT_ITEM', payload: { name: e.target.value } })}
            placeholder="e.g., Leather Jacket"
            className="w-full mt-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
          />
        </div>
        <NumberInput
          label="Price"
          value={state.currentItem.price}
          onChange={(value) => dispatch({ type: 'SET_CURRENT_ITEM', payload: { price: value } })}
          min={0}
          prefix="€"
        />
      </div>
    </div>
  );
}

