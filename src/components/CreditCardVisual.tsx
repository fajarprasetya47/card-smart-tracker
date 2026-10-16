import type { CreditCard } from '../types';

interface CreditCardVisualProps {
  card: CreditCard;
  compact?: boolean;
}

export function CreditCardVisual({ card, compact = false }: CreditCardVisualProps) {
  const isMastercard = card.network === 'mastercard';
  const networkLabel = card.network === 'visa' ? 'VISA' : card.network.toUpperCase();

  return (
    <div className={`credit-card-visual ${isMastercard ? 'mastercard-card' : 'visa-card'} ${compact ? 'compact-card' : ''}`}>
      <div className="card-topline">
        <div>
          <span className="card-issuer">BRI {networkLabel}</span>
          <strong>{card.name}</strong>
        </div>
        <span className={`network-mark ${card.network}`}>
          {isMastercard ? <><i /><i /></> : networkLabel}
        </span>
      </div>
      <div className="card-chip" aria-hidden="true"><span /><span /><span /><span /></div>
      <div className="card-bottomline">
        <div>
          <span className="card-number">{card.maskedNumber}</span>
          <span className="cardholder">{card.cardholderName}</span>
        </div>
        <span className="card-expiry">EXP {card.expiry}</span>
      </div>
    </div>
  );
}
