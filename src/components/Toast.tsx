import { useEffect } from 'react';
import { useSubscriptions } from '../state/SubscriptionProvider';

export function Toast() {
  const { toast, dismissToast } = useSubscriptions();

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(dismissToast, 3000);
    return () => window.clearTimeout(timeout);
  }, [toast, dismissToast]);

  return (
    <div className="toast-region" aria-live="polite" aria-atomic="true">
      {toast && <div className="toast"><span className="toast-check">✓</span>{toast}</div>}
    </div>
  );
}
