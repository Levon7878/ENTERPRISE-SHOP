import React from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { useToastStore } from '../../../app/store/useToastStore';

export const ToastHost: React.FC = () => {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[80] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:px-6"
      aria-live="polite"
      aria-relevant="additions"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className="pointer-events-auto animate-fade-in flex max-w-sm items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-2xl shadow-slate-900/10"
        >
          <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-500" aria-hidden="true" />
          <p className="flex-1 text-sm font-semibold leading-snug text-slate-800">{toast.message}</p>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            className="shrink-0 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
