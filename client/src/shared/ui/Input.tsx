'use client';

import { forwardRef, useId } from 'react';
import clsx from 'clsx';

type Size = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputSize?: Size;
  containerClassName?: string;
}

const sizes: Record<Size, string> = {
  sm: 'h-9 text-[13px] rounded-md',
  md: 'h-11 text-sm rounded-lg',
  lg: 'h-12 text-[15px] rounded-lg',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      icon,
      rightIcon,
      inputSize = 'md',
      containerClassName,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const reactId = useId();
    const inputId = id ?? reactId;
    const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

    return (
      <div className={containerClassName}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-[13px] font-semibold text-slate-700"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={describedBy}
            className={clsx(
              'w-full bg-white text-slate-900 placeholder:text-slate-400',
              'border border-border-strong/70',
              'transition-[border-color,box-shadow] duration-(--duration-fast) ease-(--ease-out-soft)',
              'focus:outline-none focus:ring-4 focus:ring-brand/15 focus:border-brand',
              'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
              sizes[inputSize],
              icon ? 'pl-10' : 'pl-3.5',
              rightIcon ? 'pr-10' : 'pr-3.5',
              error && 'border-danger focus:ring-danger/15 focus:border-danger',
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p id={`${inputId}-error`} className="mt-1.5 text-xs font-medium text-danger">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-slate-500">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = 'Input';
