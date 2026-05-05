'use client';

import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-brand text-white shadow-sm hover:bg-brand-hover active:bg-brand-active focus-visible:ring-brand/40',
  secondary:
    'bg-slate-900/[0.04] text-slate-800 hover:bg-slate-900/[0.08] active:bg-slate-900/[0.12] focus-visible:ring-slate-500/30',
  outline:
    'border border-border-strong bg-white text-slate-700 hover:border-brand hover:text-brand hover:bg-brand-soft active:bg-brand/10 focus-visible:ring-brand/30',
  ghost:
    'text-slate-600 hover:bg-slate-900/[0.06] active:bg-slate-900/[0.10] focus-visible:ring-slate-500/30',
  danger:
    'bg-danger text-white shadow-sm hover:bg-danger/90 active:bg-danger/80 focus-visible:ring-danger/40',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[13px] gap-1.5 rounded-md',
  md: 'h-11 px-5 text-sm gap-2 rounded-lg',
  lg: 'h-12 px-6 text-[15px] gap-2.5 rounded-lg',
  icon: 'h-10 w-10 rounded-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading,
      icon,
      rightIcon,
      fullWidth,
      children,
      className,
      disabled,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const showLeading = loading || icon;
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={clsx(
          'inline-flex items-center justify-center font-semibold select-none',
          'transition-[background-color,border-color,color,box-shadow,transform] duration-(--duration-base) ease-(--ease-out-soft)',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-0',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          'active:translate-y-px',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {showLeading &&
          (loading ? (
            <Loader2 className={clsx('animate-spin', size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4')} />
          ) : (
            icon
          ))}
        {children}
        {!loading && rightIcon}
      </button>
    );
  },
);
Button.displayName = 'Button';
