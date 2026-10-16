import type { CreditCard } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { useCardSummary } from '../state/SubscriptionProvider';
import { Icon } from './Icon';

export function CardSummary({ card }: { card: CreditCard }) {
  const { activeCount, monthlyTotal, availableLimit, usagePercent } = useCardSummary(card.id);
  const usageWidth = Math.min(Math.max(usagePercent, 0), 100);

  return (
    <>
      <section className="detail-summary-grid" aria-label="Card summary">
        <div className="summary-panel limit-panel">
          <span className="summary-label">AVAILABLE LIMIT</span>
          <strong className="summary-value">{formatCurrency(availableLimit)}</strong>
          <div className="usage-meter" role="progressbar" aria-label="Credit limit used" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(usagePercent)}>
            <span style={{ width: `${usageWidth}%` }} />
          </div>
          <span className="usage-caption">{usagePercent.toFixed(1)}% of {formatCurrency(card.creditLimit)} used</span>
        </div>
        <div className="summary-panel balance-detail-panel">
          <span className="summary-label">CURRENT BALANCE</span>
          <strong className="summary-value balance-red">{formatCurrency(card.currentBalance)}</strong>
          <span className="due-date">Due {formatDate(card.dueDate)}</span>
        </div>
        <div className="summary-panel subscription-total-panel">
          <span className="summary-label">ACTIVE SUBSCRIPTIONS</span>
          <strong className="summary-value">{activeCount}</strong>
          <span className="subscription-total">{formatCurrency(monthlyTotal)}<small>/month</small></span>
        </div>
      </section>
      <div className="detail-insight">
        <Icon name="sparkle" size={19} />
        <p>This card has <strong>{activeCount} active {activeCount === 1 ? 'subscription' : 'subscriptions'}</strong> totaling <strong>{formatCurrency(monthlyTotal)}/month</strong>. Manage your services below.</p>
      </div>
    </>
  );
}
