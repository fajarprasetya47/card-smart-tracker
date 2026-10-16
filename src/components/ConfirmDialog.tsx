import { Dialog } from './Dialog';

interface ConfirmDialogProps {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
  error?: string;
}

export function ConfirmDialog({
  title,
  message,
  onCancel,
  onConfirm,
  isSubmitting = false,
  error,
}: ConfirmDialogProps) {
  return (
    <Dialog
      title={title}
      message={message}
      onClose={isSubmitting ? () => undefined : onCancel}
      actions={
        <>
          <button className="button-secondary dialog-action" type="button" onClick={onCancel} autoFocus disabled={isSubmitting}>Cancel</button>
          <button className="button-danger dialog-action" type="button" onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? 'Unsubscribing…' : 'Unsubscribe'}
          </button>
        </>
      }
    >
      {error && <p className="auth-error" role="alert">{error}</p>}
    </Dialog>
  );
}
