import { useCallback, useState } from 'react';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

type ToastTone = 'success' | 'info' | 'warning';

interface ToastState {
  id: number;
  message: string;
  tone: ToastTone;
}

const TONE = {
  success: { icon: CheckCircle2, className: 'text-success' },
  info: { icon: Info, className: 'text-info' },
  warning: { icon: AlertTriangle, className: 'text-pending' },
};

/**
 * Toast cục bộ của trang. Render `toastNode` một lần trong trang.
 * Vùng aria-live luôn có mặt để trình đọc màn hình đọc được nội dung mới.
 * Trên mobile toast nằm trên thanh tab dưới đáy.
 */
export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);

  const show = useCallback((message: string, tone: ToastTone = 'success') => {
    const id = Date.now();
    setToast({ id, message, tone });
    window.setTimeout(() => setToast((t) => (t?.id === id ? null : t)), 3000);
  }, []);

  const tone = toast ? TONE[toast.tone] : null;

  const toastNode = (
    <div
      role="status"
      aria-live="polite"
      className="fixed z-[60] left-4 right-4 sm:left-auto sm:right-6 bottom-[calc(var(--spacing-tabbar)+env(safe-area-inset-bottom)+1rem)] lg:bottom-6"
    >
      {toast && tone && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-card shadow-overlay border border-line bg-surface text-body font-medium text-ink">
          <tone.icon className={clsx('w-5 h-5 shrink-0', tone.className)} aria-hidden="true" />
          {toast.message}
        </div>
      )}
    </div>
  );

  return { show, toastNode };
}
