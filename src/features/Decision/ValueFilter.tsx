import { useAppState, useAppDispatch } from '../../state/store';
import { Toggle } from '../../components/Toggle';

export function ValueFilter() {
  const state = useAppState();
  const dispatch = useAppDispatch();

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
        3-Part Value Filter
      </h3>
      <div className="flex flex-col gap-3">
        <Toggle
          label="I'll use it often or for a long time."
          checked={state.valueFilter.useOften}
          onChange={(checked) => dispatch({ type: 'SET_VALUE_FILTER', payload: { useOften: checked } })}
        />
        <Toggle
          label="It meaningfully improves my day (comfort/joy/productivity)."
          checked={state.valueFilter.improvesDay}
          onChange={(checked) => dispatch({ type: 'SET_VALUE_FILTER', payload: { improvesDay: checked } })}
        />
        <Toggle
          label="I can buy it without touching savings or going into debt."
          checked={state.valueFilter.affordable}
          onChange={(checked) => dispatch({ type: 'SET_VALUE_FILTER', payload: { affordable: checked } })}
        />
      </div>
    </div>
  );
}

