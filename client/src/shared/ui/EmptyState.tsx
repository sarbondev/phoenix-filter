import clsx from 'clsx';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  /** Wash the icon container with brand-soft instead of slate */
  tone?: 'neutral' | 'brand';
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  tone = 'neutral',
}: EmptyStateProps) {
  return (
    <div
      className={clsx(
        'mx-auto flex max-w-md flex-col items-center justify-center text-center',
        'py-16 px-6',
        className,
      )}
    >
      {icon && (
        <div
          className={clsx(
            'mb-5 flex h-16 w-16 items-center justify-center rounded-2xl',
            tone === 'brand' ? 'bg-brand-soft text-brand' : 'bg-slate-100 text-slate-400',
          )}
        >
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      {description && (
        <p className="mt-1.5 text-sm text-slate-500 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
