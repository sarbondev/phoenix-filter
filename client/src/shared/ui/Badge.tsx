import clsx from 'clsx';

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'primary' | 'info';
type Tone = 'soft' | 'solid' | 'outline';
type Size = 'sm' | 'md';

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  tone?: Tone;
  size?: Size;
  dot?: boolean;
  className?: string;
}

const palette: Record<Variant, { soft: string; solid: string; outline: string; dot: string }> = {
  default: {
    soft: 'bg-slate-100 text-slate-700',
    solid: 'bg-slate-700 text-white',
    outline: 'border border-slate-300 text-slate-700',
    dot: 'bg-slate-400',
  },
  primary: {
    soft: 'bg-brand-soft text-brand',
    solid: 'bg-brand text-white',
    outline: 'border border-brand/40 text-brand',
    dot: 'bg-brand',
  },
  success: {
    soft: 'bg-success-soft text-success',
    solid: 'bg-success text-white',
    outline: 'border border-success/40 text-success',
    dot: 'bg-success',
  },
  warning: {
    soft: 'bg-warning-soft text-warning',
    solid: 'bg-warning text-white',
    outline: 'border border-warning/40 text-warning',
    dot: 'bg-warning',
  },
  danger: {
    soft: 'bg-danger-soft text-danger',
    solid: 'bg-danger text-white',
    outline: 'border border-danger/40 text-danger',
    dot: 'bg-danger',
  },
  info: {
    soft: 'bg-info-soft text-info',
    solid: 'bg-info text-white',
    outline: 'border border-info/40 text-info',
    dot: 'bg-info',
  },
};

const sizes: Record<Size, string> = {
  sm: 'px-1.5 py-0.5 text-[10.5px] gap-1',
  md: 'px-2 py-0.5 text-xs gap-1.5',
};

const dotSize: Record<Size, string> = {
  sm: 'h-1.5 w-1.5',
  md: 'h-2 w-2',
};

export function Badge({
  children,
  variant = 'default',
  tone = 'soft',
  size = 'md',
  dot = false,
  className,
}: BadgeProps) {
  const tones = palette[variant];
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-md font-semibold',
        sizes[size],
        tones[tone],
        className,
      )}
    >
      {dot && <span className={clsx('inline-block rounded-full', tones.dot, dotSize[size])} />}
      {children}
    </span>
  );
}
