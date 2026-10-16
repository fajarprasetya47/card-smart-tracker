import { useNavigate, useParams } from 'react-router-dom';
import { CardSummary } from '../components/CardSummary';
import { CreditCardVisual } from '../components/CreditCardVisual';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import { SubscriptionList } from '../components/SubscriptionList';
import { cards } from '../data';

export function CardDetailPage() {
  const { cardId = '' } = useParams();
  const card = cards.find((item) => item.id === cardId);
  const navigate = useNavigate();

  if (!card) {
    return (
      <main className="page-shell not-found-card">
        <div className="empty-state">
          <span className="empty-symbol"><Icon name="card" size={26} /></span>
          <h1>Card not found</h1>
          <p>This card does not exist in the prototype data.</p>
          <button className="button-primary" type="button" onClick={() => navigate('/credit-cards')}>
            Back to My Credit Cards
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell detail-page">
      <PageHeader title="Card Detail" onBack={() => navigate('/credit-cards')} />
      <CreditCardVisual card={card} />
      <CardSummary card={card} />
      <SubscriptionList card={card} />
    </main>
  );
}
