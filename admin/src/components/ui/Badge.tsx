import clsx from 'clsx';

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  dot?: boolean;
  className?: string;
}

const palette: Record<Variant, { soft: string; dot: string }> = {
  default: { soft: 'bg-slate-100 text-slate-700', dot: 'bg-slate-400' },
  success: { soft: 'bg-success-soft text-success', dot: 'bg-success' },
  warning: { soft: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  danger: { soft: 'bg-danger-soft text-danger', dot: 'bg-danger' },
  info: { soft: 'bg-info-soft text-info', dot: 'bg-info' },
};

export function Badge({ children, variant = 'default', dot, className }: BadgeProps) {
  const tones = palette[variant];
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold',
        tones.soft,
        className,
      )}
    >
      {dot && <span className={clsx('h-2 w-2 rounded-full', tones.dot)} />}
      {children}
    </span>
  );
}
