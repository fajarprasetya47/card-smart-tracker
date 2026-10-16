import { useEffect, useId, useRef, type ReactNode } from 'react';
import { Icon } from './Icon';

interface DialogProps {
  title: string;
  message: string;
  onClose: () => void;
  actions: ReactNode;
}

export function Dialog({ title, message, onClose, actions }: DialogProps) {
  const titleId = useId();
  const messageId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialogRef.current?.querySelector<HTMLElement>('button')?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab' && dialogRef.current) {
        const buttons = dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled])');
        const firstButton = buttons[0];
        const lastButton = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === firstButton) {
          event.preventDefault();
          lastButton?.focus();
        } else if (!event.shiftKey && document.activeElement === lastButton) {
          event.preventDefault();
          firstButton?.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={messageId} ref={dialogRef}>
        <span className="dialog-symbol"><Icon name="sparkle" size={21} /></span>
        <h2 id={titleId}>{title}</h2>
        <p id={messageId}>{message}</p>
        <div className="dialog-actions">{actions}</div>
      </div>
    </div>
  );
}
