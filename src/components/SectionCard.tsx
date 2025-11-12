import { ReactNode } from 'react';

interface SectionCardProps {
  id?: string;
  title: string;
  description?: string;
  tooltip?: string;
  children: ReactNode;
}

export function SectionCard({ id, title, description, tooltip, children }: SectionCardProps) {
  return (
    <section id={id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors scroll-mt-24">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          {tooltip && (
            <span
              className="inline-flex items-center justify-center w-5 h-5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full cursor-help"
              title={tooltip}
            >
              i
            </span>
          )}
        </div>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

