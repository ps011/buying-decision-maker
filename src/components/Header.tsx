import { ThemeSwitcher } from '@prasheel/ui';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background border-b-2 border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-2xl">
        <h1 className="text-lg font-bold text-foreground tracking-tight">
          Should I buy it?
        </h1>
        <ThemeSwitcher />
      </div>
    </header>
  );
}
