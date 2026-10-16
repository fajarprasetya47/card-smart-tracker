import { Link } from 'react-router-dom';
import type { CreditCard } from '../types';
import { formatCurrency } from '../utils';
import { useCardSummary } from '../state/SubscriptionProvider';
import { CreditCardVisual } from './CreditCardVisual';

export function CreditCardListItem({ card }: { card: CreditCard }) {
  const { activeCount, monthlyTotal } = useCardSummary(card.id);

  return (
    <article className="credit-card-list-item">
      <Link className="credit-card-link" to={`/credit-cards/${card.id}`} aria-label={`View ${card.name} details`}>
        <CreditCardVisual card={card} />
        <div className="list-summary">
          <div className="list-subscription-summary">
            <strong>{activeCount} {activeCount === 1 ? 'active subscription' : 'active subscriptions'}</strong>
            <span>{formatCurrency(monthlyTotal)}<small>/month</small></span>
          </div>
          <div className="list-card-metrics">
            <span>Balance <strong>{formatCurrency(card.currentBalance)}</strong></span>
            <span>Credit limit <strong>{formatCurrency(card.creditLimit)}</strong></span>
          </div>
          <span className="view-card-link">View card details <span aria-hidden="true">→</span></span>
        </div>
      </Link>
    </article>
  );
}
