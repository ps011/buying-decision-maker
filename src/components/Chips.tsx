interface ChipProps {
  children: React.ReactNode;
  variant?: 'waiting' | 'ready' | 'purchased' | 'neutral';
}

export function Chip({ children, variant = 'neutral' }: ChipProps) {
  const variantStyles = {
    waiting: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    ready: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    purchased: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
    neutral: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]}`}>
      {children}
    </span>
  );
}

