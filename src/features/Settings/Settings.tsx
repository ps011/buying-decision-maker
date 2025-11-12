import { useState } from 'react';
import { useAppState, useAppDispatch } from '../../state/store';
import { NumberInput } from '../../components/NumberInput';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { exportData, clearStorage } from '../../utils/storage';

export function Settings() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [showClearModal, setShowClearModal] = useState(false);

  const handleExport = () => {
    exportData(state);
  };

  const handleClearAll = () => {
    clearStorage();
    dispatch({ type: 'CLEAR_ALL_DATA' });
    setShowClearModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="max-w-md">
        <NumberInput
          label="Luxury Threshold (price)"
          value={state.luxuryThreshold}
          onChange={(value) => dispatch({ type: 'SET_LUXURY_THRESHOLD', payload: Math.max(0, value) })}
          min={0}
          prefix="€"
        />
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Items at or above this price trigger the 48-hour waiting rule.
        </p>
      </div>

      <div className="flex gap-4">
        <Button variant="secondary" onClick={handleExport}>
          Export Data
        </Button>
        <Button variant="danger" onClick={() => setShowClearModal(true)}>
          Clear All Data
        </Button>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        App Version: 1.0.0
      </div>

      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Clear All Data?"
        actions={
          <>
            <Button variant="secondary" onClick={() => setShowClearModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleClearAll}>
              Clear All
            </Button>
          </>
        }
      >
        <p>
          This will permanently delete all your data including wishlist items, settings, and preferences. 
          This action cannot be undone.
        </p>
        <p className="mt-2 font-semibold">
          Consider exporting your data first if you want to keep a backup.
        </p>
      </Modal>
    </div>
  );
}

