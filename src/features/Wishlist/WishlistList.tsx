import { useState, useEffect } from 'react';
import { useAppState, useAppDispatch } from '../../state/store';
import { Chip } from '../../components/Chips';
import { Button } from '../../components/Button';
import { getAgeString, hasPassedThreshold } from '../../utils/time';

export function WishlistList() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const loadIntoCurrentItem = (name: string, price: number) => {
    dispatch({ type: 'SET_CURRENT_ITEM', payload: { name, price } });
    document.getElementById('decision')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (state.wishlist.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No items in your wishlist yet. Add one above!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {state.wishlist.map((item) => {
        const isPastWaiting = hasPassedThreshold(item.createdAt);
        const isPurchased = !!item.purchasedAt;

        return (
          <div
            key={item.id}
            className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{item.name}</h4>
                  <Chip variant={isPurchased ? 'purchased' : isPastWaiting ? 'ready' : 'waiting'}>
                    {isPurchased ? 'Purchased' : isPastWaiting ? 'Ready' : 'Waiting'}
                  </Chip>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div>Price: €{item.price}</div>
                  <div>Added {getAgeString(item.createdAt)}</div>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View link →
                    </a>
                  )}
                  {item.notes && <div className="italic">"{item.notes}"</div>}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {!isPurchased && (
                  <>
                    <Button
                      variant="secondary"
                      onClick={() => loadIntoCurrentItem(item.name, item.price)}
                    >
                      Evaluate
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => dispatch({ type: 'MARK_PURCHASED', payload: item.id })}
                    >
                      Mark Purchased
                    </Button>
                  </>
                )}
                <Button
                  variant="danger"
                  onClick={() => dispatch({ type: 'REMOVE_WISHLIST_ITEM', payload: item.id })}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

