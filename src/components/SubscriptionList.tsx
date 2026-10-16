import { getSubscription, useSubscriptions } from '../state/SubscriptionProvider';
import type { CreditCard } from '../types';
import { services } from '../data';
import { SubscriptionItem } from './SubscriptionItem';

export function SubscriptionList({ card }: { card: CreditCard }) {
  const { subscriptions } = useSubscriptions();
  const activeCount = services.filter(
    (service) => getSubscription(subscriptions, card.id, service.id).status === 'subscribed',
  ).length;

  return (
    <section className="subscription-section">
      <div className="section-heading"><h2>Subscriptions</h2><span>{activeCount} active</span></div>
      {activeCount === 0 && <p className="no-subscriptions">No active subscriptions. Subscribe to a service below to get started.</p>}
      <div className="subscription-list">
        {services.map((service) => (
          <SubscriptionItem
            card={card}
            service={service}
            subscription={getSubscription(subscriptions, card.id, service.id)}
            key={service.id}
          />
        ))}
      </div>
    </section>
  );
}
