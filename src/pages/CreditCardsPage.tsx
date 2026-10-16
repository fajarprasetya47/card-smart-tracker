import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCardListItem } from '../components/CreditCardListItem';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import { SimpleDialog } from '../components/SimpleDialog';
import { useSubscriptions } from '../state/SubscriptionProvider';

export function CreditCardsPage() {
  const navigate = useNavigate();
  const [addCardOpen, setAddCardOpen] = useState(false);
  const { cards, cardsLoading, error, refreshCards, clearError } = useSubscriptions();

  return (
    <main className="page-shell cards-page">
      <PageHeader
        title="My Credit Cards"
        onBack={() => navigate('/')}
        action={
          <button className="icon-button add-button" type="button" aria-label="Add card" onClick={() => setAddCardOpen(true)}>
            +
          </button>
        }
      />
      <div className="tip-banner">
        <Icon name="sparkle" size={18} />
        <p><strong>AI tip:</strong> tap any card to view linked subscriptions and manage the services you use.</p>
      </div>
      {error && (
        <div className="api-error" role="alert">
          <span>{error}</span>
          <button className="button-secondary" type="button" onClick={() => { clearError(); void refreshCards().catch(() => undefined); }}>
            Retry
          </button>
        </div>
      )}
      {cardsLoading ? (
        <p className="api-loading" role="status">Loading your cards…</p>
      ) : cards.length === 0 && !error ? (
        <section className="empty-state">
          <span className="empty-symbol"><Icon name="card" size={26} /></span>
          <h1>No cards yet</h1>
          <p>There are no credit cards linked to this account.</p>
        </section>
      ) : (
        <section className="cards-list" aria-label="Credit cards">
          {cards.map((card) => <CreditCardListItem card={card} key={card.id} />)}
        </section>
      )}
      {addCardOpen && (
        <SimpleDialog
          title="Add card"
          message="The backend does not provide an endpoint to add a card yet. Please contact your bank to link a card to this account."
          onClose={() => setAddCardOpen(false)}
        />
      )}
    </main>
  );
}
