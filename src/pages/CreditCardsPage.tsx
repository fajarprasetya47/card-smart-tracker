import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCardListItem } from '../components/CreditCardListItem';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import { SimpleDialog } from '../components/SimpleDialog';
import { cards } from '../data';

export function CreditCardsPage() {
  const navigate = useNavigate();
  const [addCardOpen, setAddCardOpen] = useState(false);

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
      {cards.length === 0 ? (
        <section className="empty-state">
          <span className="empty-symbol"><Icon name="card" size={26} /></span>
          <h1>No cards yet</h1>
          <p>Add a card to see it here.</p>
        </section>
      ) : (
        <section className="cards-list" aria-label="Credit cards">
          {cards.map((card) => <CreditCardListItem card={card} key={card.id} />)}
        </section>
      )}
      {addCardOpen && (
        <SimpleDialog
          title="Add card"
          message="Add card is not available in this prototype."
          onClose={() => setAddCardOpen(false)}
        />
      )}
    </main>
  );
}
