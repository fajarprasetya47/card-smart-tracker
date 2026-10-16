import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiError } from '../api/client';
import { CardSummary } from '../components/CardSummary';
import { CreditCardVisual } from '../components/CreditCardVisual';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import { SubscriptionList } from '../components/SubscriptionList';
import { useSubscriptions } from '../state/SubscriptionProvider';

export function CardDetailPage() {
  const { cardId = '' } = useParams();
  const navigate = useNavigate();
  const { cards, loadCard, loadSubscriptions, error, clearError } = useSubscriptions();
  const card = cards.find((item) => item.id === cardId) ?? null;
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setNotFound(false);
    clearError();
    try {
      await loadCard(cardId);
      await loadSubscriptions(cardId);
    } catch (loadError) {
      if (loadError instanceof ApiError && loadError.status === 404) setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  }, [cardId, clearError, loadCard, loadSubscriptions]);

  useEffect(() => {
    void load();
  }, [load]);

  if (isLoading) {
    return (
      <main className="page-shell detail-page">
        <PageHeader title="Card Detail" onBack={() => navigate('/credit-cards')} />
        <p className="api-loading" role="status">Loading card details…</p>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="page-shell not-found-card">
        <div className="empty-state">
          <span className="empty-symbol"><Icon name="card" size={26} /></span>
          <h1>Card not found</h1>
          <p>This card does not exist or is not linked to your account.</p>
          <button className="button-primary" type="button" onClick={() => navigate('/credit-cards')}>
            Back to My Credit Cards
          </button>
        </div>
      </main>
    );
  }

  if (!card) {
    return (
      <main className="page-shell detail-page">
        <PageHeader title="Card Detail" onBack={() => navigate('/credit-cards')} />
        <div className="api-error" role="alert">
          <span>{error || 'Card details could not be loaded.'}</span>
          <button className="button-secondary" type="button" onClick={() => void load()}>Retry</button>
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
