import { useState } from 'react';
import { AddSubscriptionDialog } from './AddSubscriptionDialog';
import type { CreditCard, CreateSubscriptionInput } from '../types';
import { useSubscriptions } from '../state/SubscriptionProvider';
import { SubscriptionItem } from './SubscriptionItem';

export function SubscriptionList({ card }: { card: CreditCard }) {
  const {
    subscriptionsByCard,
    loadingSubscriptions,
    pendingSubscriptionIds,
    error,
    clearError,
    refreshCards,
    loadSubscriptions,
    createSubscription,
  } = useSubscriptions();
  const [addOpen, setAddOpen] = useState(false);
  const subscriptions = subscriptionsByCard[card.id] ?? [];
  const activeCount = subscriptions.filter((subscription) => subscription.status === 'active').length;
  const isLoading = loadingSubscriptions[card.id] ?? false;
  const isCreating = pendingSubscriptionIds.includes(`new:${card.id}`);

  async function handleCreate(input: CreateSubscriptionInput) {
    await createSubscription(card.id, input);
  }

  async function handleRetry() {
    clearError();
    await Promise.all([refreshCards(), loadSubscriptions(card.id)]);
  }

  return (
    <section className="subscription-section">
      <div className="section-heading">
        <h2>Subscriptions</h2>
        <div className="subscription-heading-actions">
          <span>{activeCount} active</span>
          <button className="button-primary add-subscription-button" type="button" onClick={() => setAddOpen(true)}>
            + Add service
          </button>
        </div>
      </div>
      {error && (
        <div className="api-error" role="alert">
          <span>{error}</span>
          <button
            className="button-secondary"
            type="button"
            onClick={() => { void handleRetry().catch(() => undefined); }}
          >
            Retry
          </button>
        </div>
      )}
      {isLoading ? (
        <p className="api-loading" role="status">Loading subscriptions…</p>
      ) : (
        <>
          {subscriptions.length === 0 && (
            <p className="no-subscriptions">No subscriptions are tracked for this card. Add one to get started.</p>
          )}
          {subscriptions.length > 0 && activeCount === 0 && (
            <p className="no-subscriptions">No active subscriptions. Subscribe to an inactive service or add a new one.</p>
          )}
          <div className="subscription-list">
            {subscriptions.map((subscription) => (
              <SubscriptionItem card={card} service={subscription} key={subscription.id} />
            ))}
          </div>
        </>
      )}
      {addOpen && (
        <AddSubscriptionDialog
          cardName={card.name}
          isSubmitting={isCreating}
          onClose={() => setAddOpen(false)}
          onSubmit={handleCreate}
        />
      )}
    </section>
  );
}
