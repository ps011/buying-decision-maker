import { useAppState } from './state/store';
import { Header } from './components/Header';
import { IncomeSetup } from './features/Setup/IncomeSetup';
import { IncomeChip } from './features/Setup/IncomeChip';
import { ItemInput } from './features/Item/ItemInput';
import { Perspectives } from './features/Item/Perspectives';
import { BudgetImpact } from './features/Item/BudgetImpact';
import { CostPerHour } from './features/Item/CostPerHour';
import { Checks } from './features/Decision/Checks';
import { Verdict } from './features/Decision/Verdict';

export function App() {
  const { monthlyIncome } = useAppState();

  return (
    <div className="min-h-dvh bg-background">
      {monthlyIncome === 0 && <IncomeSetup />}
      <Header />
      <main className="container mx-auto px-4 pt-6 pb-20 space-y-4 max-w-2xl">
        {monthlyIncome > 0 && (
          <div className="flex justify-end">
            <IncomeChip />
          </div>
        )}
        <ItemInput />
        <Perspectives />
        <BudgetImpact />
        <CostPerHour />
        <Checks />
        <Verdict />
      </main>
    </div>
  );
}
