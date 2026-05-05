import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
  /** Visual variant. `text` adds rounded-full + h-3 defaults. */
  as?: 'box' | 'text' | 'circle';
}

/**
 * Skeleton uses a shared shimmer animation registered via globals.css
 * (@theme --animate-shimmer). The base is a soft slate tint; the shimmer
 * sweeps a translucent highlight over it.
 */
export function Skeleton({ className, as = 'box' }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={clsx(
        'relative overflow-hidden bg-slate-100/90',
        'before:absolute before:inset-0 before:animate-shimmer before:bg-[linear-gradient(100deg,transparent_30%,rgba(255,255,255,0.55)_50%,transparent_70%)] before:bg-[length:200%_100%] before:bg-no-repeat',
        as === 'box' && 'rounded-lg',
        as === 'text' && 'h-3 rounded-full',
        as === 'circle' && 'rounded-full',
        className,
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-xs">
      <Skeleton className="h-56 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton as="text" className="w-20" />
        <Skeleton as="text" className="h-4 w-3/4" />
        <Skeleton as="text" className="w-full" />
        <Skeleton as="text" className="w-2/3" />
        <Skeleton className="mt-3 h-10 w-full" />
      </div>
    </div>
  );
}

export function OrderRowSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-white shadow-xs overflow-hidden">
      <div className="flex items-center justify-between gap-4 bg-surface px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5" />
          <div className="space-y-1.5">
            <Skeleton as="text" className="h-3.5 w-24" />
            <Skeleton as="text" className="w-16" />
          </div>
        </div>
        <Skeleton as="text" className="h-4 w-20" />
      </div>
      <div className="p-6 flex gap-3">
        <Skeleton className="h-14 w-14 rounded-xl" />
        <div className="space-y-2 flex-1">
          <Skeleton as="text" className="h-3.5 w-1/2" />
          <Skeleton as="text" className="w-1/3" />
        </div>
      </div>
    </div>
  );
}
