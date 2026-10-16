import { Dialog } from './Dialog';

interface ConfirmDialogProps {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({ title, message, onCancel, onConfirm }: ConfirmDialogProps) {
  return (
    <Dialog
      title={title}
      message={message}
      onClose={onCancel}
      actions={
        <>
          <button className="button-secondary dialog-action" type="button" onClick={onCancel} autoFocus>Cancel</button>
          <button className="button-danger dialog-action" type="button" onClick={onConfirm}>Unsubscribe</button>
        </>
      }
    />
  );
}
