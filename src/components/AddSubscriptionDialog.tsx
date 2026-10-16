import { useState, type FormEvent } from 'react';
import { Dialog } from './Dialog';
import type { CreateSubscriptionInput } from '../types';

interface AddSubscriptionDialogProps {
  cardName: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (input: CreateSubscriptionInput) => Promise<void>;
}

const categories: Array<{ value: CreateSubscriptionInput['category']; label: string }> = [
  { value: 'ENTERTAINMENT', label: 'Entertainment' },
  { value: 'MUSIC', label: 'Music' },
  { value: 'CLOUD_STORAGE', label: 'Cloud storage' },
  { value: 'TRANSPORTATION', label: 'Transportation' },
  { value: 'PRODUCTIVITY', label: 'Productivity' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'GAMING', label: 'Gaming' },
  { value: 'OTHER', label: 'Other' },
];

export function AddSubscriptionDialog({
  cardName,
  isSubmitting,
  onClose,
  onSubmit,
}: AddSubscriptionDialogProps) {
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    const selectedCategory = categories.find((category) => category.value === form.get('category'));
    const input: CreateSubscriptionInput = {
      serviceName: String(form.get('serviceName') ?? '').trim(),
      category: selectedCategory?.value ?? 'OTHER',
      billingAmount: Number(form.get('billingAmount')),
      billingPeriod: 'MONTHLY',
    };

    try {
      await onSubmit(input);
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Subscription tidak dapat ditambahkan.');
    }
  }

  return (
    <Dialog
      title="Add subscription"
      message={`Track a new monthly subscription on ${cardName}.`}
      onClose={isSubmitting ? () => undefined : onClose}
      actions={
        <>
          <button className="button-secondary dialog-action" type="button" onClick={onClose} disabled={isSubmitting}>Cancel</button>
          <button className="button-primary dialog-action" type="submit" form="add-subscription-form" disabled={isSubmitting}>
            {isSubmitting ? 'Adding…' : 'Add subscription'}
          </button>
        </>
      }
    >
      <form id="add-subscription-form" className="subscription-form" onSubmit={handleSubmit}>
        <label>
          Service name
          <input name="serviceName" type="text" maxLength={120} required autoFocus />
        </label>
        <label>
          Category
          <select name="category" defaultValue="ENTERTAINMENT">
            {categories.map((category) => (
              <option key={category.value} value={category.value}>{category.label}</option>
            ))}
          </select>
        </label>
        <label>
          Monthly amount (IDR)
          <input name="billingAmount" type="number" min="1000" step="1" required />
        </label>
        {error && <p className="auth-error" role="alert">{error}</p>}
      </form>
    </Dialog>
  );
}
