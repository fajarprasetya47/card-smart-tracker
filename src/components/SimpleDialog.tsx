import { Dialog } from './Dialog';

interface SimpleDialogProps {
  title: string;
  message: string;
  onClose: () => void;
}

export function SimpleDialog({ title, message, onClose }: SimpleDialogProps) {
  return (
    <Dialog
      title={title}
      message={message}
      onClose={onClose}
      actions={
        <button className="button-primary dialog-action" type="button" onClick={onClose} autoFocus>
          Close
        </button>
      }
    />
  );
}
