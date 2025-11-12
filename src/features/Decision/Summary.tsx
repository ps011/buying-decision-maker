import { useState } from 'react';
import { useAppState } from '../../state/store';
import { calculateDecision } from '../../utils/rules';

export function Summary() {
  const state = useAppState();
  const [showDetails, setShowDetails] = useState(false);
  const decision = calculateDecision(state);

  const verdictStyles = {
    buy: 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-200',
    wait: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-800 dark:text-yellow-200',
    defer: 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-200',
  };

  const verdictEmoji = {
    buy: '✅',
    wait: '⏳',
    defer: '🚫',
  };

  const verdictText = {
    buy: 'Buy it guilt-free',
    wait: 'Wait 48 hours & revisit',
    defer: 'Defer; doesn\'t meet rules yet',
  };

  const copyToClipboard = () => {
    const text = `Verdict: ${verdictText[decision.verdict]} — ${decision.reason}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
        Decision Summary
      </h3>
      <div className={`border-2 rounded-lg p-6 ${verdictStyles[decision.verdict]}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{verdictEmoji[decision.verdict]}</span>
            <div>
              <h4 className="text-2xl font-bold">{verdictText[decision.verdict]}</h4>
              <p className="text-sm mt-1 opacity-90">{decision.reason}</p>
            </div>
          </div>
          <button
            onClick={copyToClipboard}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title="Copy verdict"
          >
            📋
          </button>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm font-medium underline hover:no-underline"
        >
          {showDetails ? 'Hide' : 'Show'} details
        </button>

        {showDetails && (
          <div className="mt-4 pt-4 border-t border-current/20">
            <h5 className="font-semibold mb-2">Why?</h5>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {decision.details.map((detail, idx) => (
                <li key={idx}>{detail}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

