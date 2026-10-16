import { useState } from 'react';
import { useSubscriptions } from '../state/SubscriptionProvider';
import type { CreditCard, Service, Subscription } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { ConfirmDialog } from './ConfirmDialog';

interface SubscriptionItemProps {
  card: CreditCard;
  service: Service;
  subscription: Subscription;
}

export function SubscriptionItem({ card, service, subscription }: SubscriptionItemProps) {
  const { subscribe, unsubscribe } = useSubscriptions();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const isSubscribed = subscription.status === 'subscribed';

  return (
    <>
      <article className="subscription-item">
        <span className={`subscription-service-icon service-${service.id}`} aria-hidden="true">{service.icon}</span>
        <div className="subscription-description">
          <strong>{service.name}</strong>
          <span>{service.category}{isSubscribed && subscription.nextBillingDate ? ` · Next billing ${formatDate(subscription.nextBillingDate)}` : ''}</span>
        </div>
        <span className="subscription-price">{formatCurrency(service.monthlyPrice)}<small>/month</small></span>
        <span className={`status-badge ${isSubscribed ? 'status-active' : 'status-inactive'}`}>{isSubscribed ? 'Subscribed' : 'Not subscribed'}</span>
        {isSubscribed ? (
          <button className="button-secondary" type="button" aria-label={`Unsubscribe ${service.name} from ${card.name}`} onClick={() => setConfirmOpen(true)}>
            Unsubscribe
          </button>
        ) : (
          <button className="button-primary" type="button" aria-label={`Subscribe ${service.name} on ${card.name}`} onClick={() => subscribe(card.id, service.id, card.name, service.name)}>
            Subscribe
          </button>
        )}
      </article>
      {confirmOpen && (
        <ConfirmDialog
          title={`Unsubscribe ${service.name}?`}
          message="This only updates the app (prototype). No real subscription is cancelled."
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => {
            unsubscribe(card.id, service.id, card.name, service.name);
            setConfirmOpen(false);
          }}
        />
      )}
    </>
  );
}
