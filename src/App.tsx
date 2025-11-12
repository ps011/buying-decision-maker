import { Header } from './components/Header';
import { SectionCard } from './components/SectionCard';
import { GutCheck } from './features/Decision/GutCheck';
import { ValueFilter } from './features/Decision/ValueFilter';
import { CurrentItem } from './features/Decision/CurrentItem';
import { Summary } from './features/Decision/Summary';
import { Buckets } from './features/MoneyMap/Buckets';
import { WishlistForm } from './features/Wishlist/WishlistForm';
import { WishlistList } from './features/Wishlist/WishlistList';
import { Advisor } from './features/Advisor/Advisor';
import { Settings } from './features/Settings/Settings';

export function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8 max-w-5xl">
        <SectionCard
          id="decision"
          title="Decision Framework"
          description="Evaluate your purchase decision systematically"
          tooltip="Use this section to analyze whether a purchase aligns with your values and budget"
        >
          <div className="space-y-6">
            <CurrentItem />
            <div className="border-t dark:border-gray-700 pt-6">
              <GutCheck />
            </div>
            <div className="border-t dark:border-gray-700 pt-6">
              <ValueFilter />
            </div>
            <div className="border-t dark:border-gray-700 pt-6">
              <Summary />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          id="buckets"
          title="Money Map"
          description="Allocate your income across three buckets"
          tooltip="Essentials: Bills & necessities. Future Fund: Savings & investments. Freedom Fund: Guilt-free spending"
        >
          <Buckets />
        </SectionCard>

        <SectionCard
          id="wishlist"
          title="48-Hour Wishlist"
          description="Add items and wait to ensure you truly want them"
          tooltip="For luxury items, waiting 48 hours helps distinguish genuine desire from impulse"
        >
          <div className="space-y-6">
            <WishlistForm />
            <div className="border-t dark:border-gray-700 pt-6">
              <WishlistList />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          id="advisor"
          title="Ask the Advisor"
          description="Get personalized guidance based on your situation"
          tooltip="Describe your purchase dilemma and get advice aligned with the framework"
        >
          <Advisor />
        </SectionCard>

        <SectionCard
          id="settings"
          title="Settings"
          description="Customize thresholds and manage your data"
        >
          <Settings />
        </SectionCard>
      </main>

      <footer className="border-t dark:border-gray-800 bg-white dark:bg-gray-900 py-6 mt-12 transition-colors">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Made for personal use · Runs fully offline · Data stored locally
        </div>
      </footer>
    </div>
  );
}

