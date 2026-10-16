import { useState } from 'react';
import { useSubscriptions } from '../state/SubscriptionProvider';
import type { CreditCard, Service } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { ConfirmDialog } from './ConfirmDialog';

interface SubscriptionItemProps {
  card: CreditCard;
  service: Service;
}

const billingLabels: Record<Service['billingPeriod'], string> = {
  monthly: 'month',
  yearly: 'year',
  weekly: 'week',
};

export function SubscriptionItem({ card, service }: SubscriptionItemProps) {
  const { subscribe, unsubscribe, clearError, pendingSubscriptionIds } = useSubscriptions();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionError, setActionError] = useState('');
  const isSubscribed = service.status === 'active';
  const isPending = pendingSubscriptionIds.includes(service.id);

  async function handleSubscribe() {
    clearError();
    setActionError('');
    try {
      await subscribe(service);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Subscription tidak dapat diaktifkan.');
    }
  }

  async function handleUnsubscribe() {
    clearError();
    setActionError('');
    try {
      await unsubscribe(service);
      setConfirmOpen(false);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Subscription tidak dapat dinonaktifkan.');
    }
  }

  return (
    <>
      <article className="subscription-item">
        <span className={`subscription-service-icon service-${service.id}`} aria-hidden="true">{service.icon}</span>
        <div className="subscription-description">
          <strong>{service.name}</strong>
          <span>
            {service.category}
            {isSubscribed && service.nextBillingDate ? ` · Next billing ${formatDate(service.nextBillingDate)}` : ''}
          </span>
        </div>
        <span className="subscription-price">
          {formatCurrency(service.monthlyPrice)}<small>/{billingLabels[service.billingPeriod]}</small>
        </span>
        <span className={`status-badge ${isSubscribed ? 'status-active' : 'status-inactive'}`}>
          {isSubscribed ? 'Subscribed' : 'Not subscribed'}
        </span>
        {isSubscribed ? (
          <button
            className="button-secondary"
            type="button"
            aria-label={`Unsubscribe ${service.name} from ${card.name}`}
            onClick={() => setConfirmOpen(true)}
            disabled={isPending}
          >
            Unsubscribe
          </button>
        ) : (
          <button
            className="button-primary"
            type="button"
            aria-label={`Subscribe ${service.name} on ${card.name}`}
            onClick={() => void handleSubscribe()}
            disabled={isPending}
          >
            {isPending ? 'Updating…' : 'Subscribe'}
          </button>
        )}
        {actionError && !confirmOpen && <p className="auth-error subscription-action-error" role="alert">{actionError}</p>}
      </article>
      {confirmOpen && (
        <ConfirmDialog
          title={`Unsubscribe ${service.name}?`}
          message="This updates the tracked status in Card Smart Tracker. It does not contact the service provider."
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => void handleUnsubscribe()}
          isSubmitting={isPending}
          error={actionError}
        />
      )}
    </>
  );
}
