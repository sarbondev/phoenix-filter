'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/shared/hooks';
import { removeToast } from '@/store/toastSlice';

const MAX_VISIBLE = 3;

const toneByType = {
  success: {
    icon: <CheckCircle2 className="h-5 w-5" />,
    iconWrap: 'bg-success-soft text-success',
    accentBar: 'bg-success',
  },
  error: {
    icon: <XCircle className="h-5 w-5" />,
    iconWrap: 'bg-danger-soft text-danger',
    accentBar: 'bg-danger',
  },
  info: {
    icon: <Info className="h-5 w-5" />,
    iconWrap: 'bg-info-soft text-info',
    accentBar: 'bg-info',
  },
};

export function ToastContainer() {
  const toasts = useAppSelector((s) => s.toast.toasts);
  const dispatch = useAppDispatch();
  // Newest first; cap to MAX_VISIBLE — older ones drop out as new ones arrive.
  const visible = toasts.slice(-MAX_VISIBLE);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 px-4 pb-4 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:items-end"
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence initial={false}>
        {visible.map((toast) => (
          <ToastItem
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onDismiss={() => dispatch(removeToast(toast.id))}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({
  id,
  message,
  type,
  onDismiss,
}: {
  id: string;
  message: string;
  type: keyof typeof toneByType;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const tone = toneByType[type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96, transition: { duration: 0.15 } }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.5}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 80) onDismiss();
      }}
      role="status"
      className="pointer-events-auto relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-xl border border-border bg-white pl-4 pr-3 py-3 shadow-lg ring-1 ring-black/5"
    >
      <span className={`absolute inset-y-0 left-0 w-1 ${tone.accentBar}`} />
      <span
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${tone.iconWrap}`}
      >
        {tone.icon}
      </span>
      <p className="flex-1 pt-1 text-sm font-medium leading-snug text-slate-800">
        {message}
      </p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="-m-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}
