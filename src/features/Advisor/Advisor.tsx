import { useState } from 'react';
import { useAppState } from '../../state/store';
import { TextArea } from '../../components/TextArea';
import { Button } from '../../components/Button';
import { getAdvisorGuidance } from '../../utils/rules';

export function Advisor() {
  const state = useAppState();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<ReturnType<typeof getAdvisorGuidance> | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    const guidance = getAdvisorGuidance(query, state);
    setResult(guidance);
  };

  const verdictStyles = {
    buy: 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-200',
    wait: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-800 dark:text-yellow-200',
    defer: 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-200',
  };

  const verdictText = {
    buy: 'Buy',
    wait: 'Wait',
    defer: 'Defer',
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextArea
          label="Describe your doubt or ask a question..."
          value={query}
          onChange={setQuery}
          placeholder="e.g., I want to buy AirPods Max on EMI, they're on sale for 30% off..."
          rows={4}
        />
        <Button type="submit" disabled={!query.trim()}>
          Get Guidance
        </Button>
      </form>

      {result && (
        <div className={`border-2 rounded-lg p-6 ${verdictStyles[result.verdict]}`}>
          <h4 className="text-xl font-bold mb-4">
            Verdict: {verdictText[result.verdict]}
          </h4>
          
          <div className="mb-4">
            <h5 className="font-semibold mb-2">Why:</h5>
            <ul className="list-disc list-inside space-y-2 text-sm">
              {result.why.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-2">Next Step:</h5>
            <p className="text-sm">{result.nextStep}</p>
          </div>
        </div>
      )}
    </div>
  );
}

