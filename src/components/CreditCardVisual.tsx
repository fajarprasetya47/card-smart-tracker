import type { CreditCard } from '../types';

interface CreditCardVisualProps {
  card: CreditCard;
  compact?: boolean;
}

export function CreditCardVisual({ card, compact = false }: CreditCardVisualProps) {
  return (
    <div className={`credit-card-visual ${card.network === 'mastercard' ? 'mastercard-card' : 'visa-card'} ${compact ? 'compact-card' : ''}`}>
      <div className="card-topline">
        <div>
          <span className="card-issuer">NOVA {card.network === 'visa' ? 'VISA' : 'MASTERCARD'}</span>
          <strong>{card.name}</strong>
        </div>
        <span className={`network-mark ${card.network}`}>
          {card.network === 'visa' ? 'VISA' : <><i /><i /></>}
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
