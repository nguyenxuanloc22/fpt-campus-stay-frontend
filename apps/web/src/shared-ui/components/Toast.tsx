import { useCallback, useState } from 'react';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

type ToastTone = 'success' | 'info' | 'warning';

interface ToastState {
  id: number;
  message: string;
  tone: ToastTone;
}

/** Lightweight page-local toast. Render `toastNode` once in the page. */
export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);

  const show = useCallback((message: string, tone: ToastTone = 'success') => {
    const id = Date.now();
    setToast({ id, message, tone });
    window.setTimeout(() => setToast((t) => (t?.id === id ? null : t)), 3000);
  }, []);

  const Icon = toast?.tone === 'warning' ? AlertTriangle : toast?.tone === 'info' ? Info : CheckCircle2;

  const toastNode = toast ? (
    <div className="fixed bottom-6 right-6 z-[60]">
      <div
        className={clsx(
          'flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-xs font-semibold border bg-white',
          toast.tone === 'success' && 'border-emerald-200 text-emerald-800',
          toast.tone === 'info' && 'border-blue-200 text-blue-800',
          toast.tone === 'warning' && 'border-amber-200 text-amber-800'
        )}
      >
        <Icon className="w-4 h-4 shrink-0" />
        {toast.message}
      </div>
    </div>
  ) : null;

  return { show, toastNode };
}
