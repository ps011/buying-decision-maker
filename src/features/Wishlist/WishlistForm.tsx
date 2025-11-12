import { useState } from 'react';
import { useAppDispatch } from '../../state/store';
import { NumberInput } from '../../components/NumberInput';
import { Button } from '../../components/Button';

export function WishlistForm() {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price <= 0) return;

    dispatch({
      type: 'ADD_WISHLIST_ITEM',
      payload: {
        id: Date.now().toString(),
        name,
        price,
        url: url || undefined,
        notes: notes || undefined,
        createdAt: Date.now(),
      },
    });

    setName('');
    setPrice(0);
    setUrl('');
    setNotes('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Item Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Wireless Headphones"
            required
            className="w-full mt-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
          />
        </div>
        <NumberInput
          label="Price *"
          value={price}
          onChange={setPrice}
          min={0}
          prefix="€"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Link (optional)</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          className="w-full mt-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Why do I want this?"
          rows={2}
          className="w-full mt-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors resize-none"
        />
      </div>

      <Button type="submit" disabled={!name || price <= 0}>
        Add to Wishlist
      </Button>
    </form>
  );
}

