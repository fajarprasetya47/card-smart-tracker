import { useEffect, useId, useRef, useState } from 'react';
import {
  Link,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { cards, services } from './data';
import { getSubscription, useCardSummary, useSubscriptions } from './state/SubscriptionProvider';
import type { CreditCard } from './types';
import { formatCurrency, formatDate } from './utils';

type IconName =
  | 'card'
  | 'chart'
  | 'piggy'
  | 'wallet'
  | 'transfer'
  | 'qr'
  | 'bill'
  | 'bell'
  | 'logout'
  | 'sparkle'
  | 'arrow';

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></>,
    chart: <><path d="m3 17 6-6 4 3 8-9" /><path d="M15 5h6v6" /></>,
    piggy: <><path d="M19 8.5A7 7 0 0 0 7 7H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h1l2 3h2v-2h4v2h2l1.5-3A5 5 0 0 0 19 11h2V8.5z" /><path d="M15 8h.01" /></>,
    wallet: <><rect x="3" y="6" width="18" height="14" rx="2" /><path d="M3 9h18M16 14h2" /><path d="M6 6V4h12v2" /></>,
    transfer: <><path d="m5 12 6-6 6 6" /><path d="M11 6v12M19 12l-6 6-6-6" /></>,
    qr: <><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v6h-6v-2" /></>,
    bill: <><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" /><path d="M9 8h6M9 12h6M9 16h2" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" /></>,
    sparkle: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /><path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9zM5 3l.7 1.3L7 5l-1.3.7L5 7l-.7-1.3L3 5l1.3-.7z" /></>,
    arrow: <><path d="M19 12H5M12 19l-7-7 7-7" /></>,
  };

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

function App() {
  const { toast, dismissToast } = useSubscriptions();

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(dismissToast, 3000);
    return () => window.clearTimeout(timeout);
  }, [toast, dismissToast]);

  return (
    <>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/credit-cards" element={<CreditCardsPage />} />
        <Route path="/credit-cards/:cardId" element={<CardDetailPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <div className="toast-region" aria-live="polite" aria-atomic="true">
        {toast && <div className="toast"><span className="toast-check">✓</span>{toast}</div>}
      </div>
    </>
  );
}

function DashboardPage() {
  const serviceCards: { title: string; description: string; icon: IconName; target?: string; isNew?: boolean }[] = [
    {
      title: 'Credit Card',
      description: 'Manage cards & subscriptions',
      icon: 'card',
      target: '/credit-cards',
      isNew: true,
    },
    { title: 'Investments', description: 'Stocks · Reksadana', icon: 'chart' },
    { title: 'Savings Goal', description: 'Auto-save with AI', icon: 'piggy' },
    { title: 'E-Wallet', description: 'Top up & track', icon: 'wallet' },
  ];

  return (
    <main className="page-shell dashboard-page">
      <header className="dashboard-header">
        <div className="profile">
          <div className="avatar" aria-hidden="true">B</div>
          <div><span className="eyebrow">Good morning,</span><strong>Budi Hartono</strong></div>
        </div>
        <div className="header-actions">
          <button className="icon-button" type="button" aria-label="Notifications"><Icon name="bell" /></button>
          <button className="icon-button" type="button" aria-label="Sign out"><Icon name="logout" /></button>
        </div>
      </header>

      <section className="balance-panel" aria-label="Account balance overview">
        <div className="balance-heading"><Icon name="sparkle" size={17} /><span>TOTAL BALANCE</span></div>
        <p className="balance-amount">{formatCurrency(128_540_900)}</p>
        <p className="account-number">···· 4521 · Main Account</p>
        <div className="income-spending">
          <div><span className="income-label">↙ Income</span><strong>{formatCurrency(24_500_000)}</strong></div>
          <div><span className="spending-label">↗ Spending</span><strong>{formatCurrency(8_120_500)}</strong></div>
        </div>
      </section>

      <nav className="quick-actions" aria-label="Quick actions">
        {[
          { title: 'Transfer', icon: 'transfer' as const },
          { title: 'Scan QR', icon: 'qr' as const },
          { title: 'Pay Bills', icon: 'bill' as const },
          { title: 'Save', icon: 'piggy' as const },
        ].map((action) => (
          <button className="quick-action" type="button" key={action.title}>
            <span className="quick-icon"><Icon name={action.icon} /></span>
            <span>{action.title}</span>
          </button>
        ))}
      </nav>

      <section className="insight-panel">
        <span className="insight-icon"><Icon name="sparkle" size={20} /></span>
        <div><span className="insight-title">AI INSIGHT</span><p>You spend <strong>{formatCurrency(2_979_000)}/month</strong> on credit-card subscriptions across 8 services. Tap below to review.</p></div>
      </section>

      <section className="service-section">
        <h1>Services</h1>
        <div className="service-grid">
          {serviceCards.map((service) =>
            service.target ? (
              <Link className="service-tile service-tile-link" to={service.target} key={service.title}>
                <ServiceTileContent service={service} />
              </Link>
            ) : (
              <button className="service-tile service-tile-button" type="button" key={service.title} aria-label={`${service.title}, coming soon`}>
                <ServiceTileContent service={service} />
                <span className="coming-soon">Coming soon</span>
              </button>
            ),
          )}
        </div>
      </section>
    </main>
  );
}

function ServiceTileContent({ service }: { service: { title: string; description: string; icon: IconName; isNew?: boolean } }) {
  return (
    <>
      {service.isNew && <span className="new-badge">NEW</span>}
      <span className={`service-icon ${service.title === 'Credit Card' ? 'service-icon-featured' : ''}`}><Icon name={service.icon} size={22} /></span>
      <span className="service-title">{service.title}</span>
      <span className="service-description">{service.description}</span>
    </>
  );
}

function CreditCardsPage() {
  const navigate = useNavigate();
  const [addCardOpen, setAddCardOpen] = useState(false);

  return (
    <main className="page-shell cards-page">
      <PageHeader title="My Credit Cards" onBack={() => navigate('/')} action={
        <button className="icon-button add-button" type="button" aria-label="Add card" onClick={() => setAddCardOpen(true)}>+</button>
      } />
      <div className="tip-banner"><Icon name="sparkle" size={18} /><p><strong>AI tip:</strong> tap any card to view linked subscriptions and manage the services you use.</p></div>
      {cards.length === 0 ? (
        <section className="empty-state"><span className="empty-symbol"><Icon name="card" size={26} /></span><h1>No cards yet</h1><p>Add a card to see it here.</p></section>
      ) : (
        <section className="cards-list" aria-label="Credit cards">
          {cards.map((card) => <CreditCardListItem card={card} key={card.id} />)}
        </section>
      )}
      {addCardOpen && <SimpleDialog title="Add card" message="Add card is not available in this prototype." onClose={() => setAddCardOpen(false)} />}
    </main>
  );
}

function CreditCardListItem({ card }: { card: CreditCard }) {
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

function CreditCardVisual({ card, compact = false }: { card: CreditCard; compact?: boolean }) {
  return (
    <div className={`credit-card-visual ${card.network === 'mastercard' ? 'mastercard-card' : 'visa-card'} ${compact ? 'compact-card' : ''}`}>
      <div className="card-topline"><div><span className="card-issuer">NOVA {card.network === 'visa' ? 'VISA' : 'MASTERCARD'}</span><strong>{card.name}</strong></div><span className={`network-mark ${card.network}`}>{card.network === 'visa' ? 'VISA' : <><i /><i /></>}</span></div>
      <div className="card-chip" aria-hidden="true"><span /><span /><span /><span /></div>
      <div className="card-bottomline">
        <div><span className="card-number">{card.maskedNumber}</span><span className="cardholder">{card.cardholderName}</span></div>
        <span className="card-expiry">EXP {card.expiry}</span>
      </div>
    </div>
  );
}

function CardDetailPage() {
  const { cardId = '' } = useParams();
  const card = cards.find((item) => item.id === cardId);
  const navigate = useNavigate();

  if (!card) {
    return (
      <main className="page-shell not-found-card">
        <div className="empty-state"><span className="empty-symbol"><Icon name="card" size={26} /></span><h1>Card not found</h1><p>This card does not exist in the prototype data.</p><button className="button-primary" type="button" onClick={() => navigate('/credit-cards')}>Back to My Credit Cards</button></div>
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

function CardSummary({ card }: { card: CreditCard }) {
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
      <div className="detail-insight"><Icon name="sparkle" size={19} /><p>This card has <strong>{activeCount} active {activeCount === 1 ? 'subscription' : 'subscriptions'}</strong> totaling <strong>{formatCurrency(monthlyTotal)}/month</strong>. Manage your services below.</p></div>
    </>
  );
}

function SubscriptionList({ card }: { card: CreditCard }) {
  const { subscriptions } = useSubscriptions();
  const activeCount = services.filter((service) => getSubscription(subscriptions, card.id, service.id).status === 'subscribed').length;

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

function SubscriptionItem({ card, service, subscription }: {
  card: CreditCard;
  service: (typeof services)[number];
  subscription: ReturnType<typeof getSubscription>;
}) {
  const { subscribe, unsubscribe } = useSubscriptions();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const isSubscribed = subscription.status === 'subscribed';

  return (
    <>
      <article className="subscription-item">
        <span className={`subscription-service-icon service-${service.id}`} aria-hidden="true">{service.icon}</span>
        <div className="subscription-description">
          <strong>{service.name}</strong>
          <span>{service.category}{isSubscribed && subscription.nextBillingDate ? ` · Next billing ${formatDate(subscription.nextBillingDate)}` : ''}</span>
        </div>
        <span className="subscription-price">{formatCurrency(service.monthlyPrice)}<small>/month</small></span>
        <span className={`status-badge ${isSubscribed ? 'status-active' : 'status-inactive'}`}>{isSubscribed ? 'Subscribed' : 'Not subscribed'}</span>
        {isSubscribed ? (
          <button className="button-secondary" type="button" aria-label={`Unsubscribe ${service.name} from ${card.name}`} onClick={() => setConfirmOpen(true)}>Unsubscribe</button>
        ) : (
          <button className="button-primary" type="button" aria-label={`Subscribe ${service.name} on ${card.name}`} onClick={() => subscribe(card.id, service.id, card.name, service.name)}>Subscribe</button>
        )}
      </article>
      {confirmOpen && (
        <ConfirmDialog
          title={`Unsubscribe ${service.name}?`}
          message="This only updates the app (prototype). No real subscription is cancelled."
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => {
            unsubscribe(card.id, service.id, card.name, service.name);
            setConfirmOpen(false);
          }}
        />
      )}
    </>
  );
}

function PageHeader({ title, onBack, action }: { title: string; onBack: () => void; action?: React.ReactNode }) {
  return (
    <header className="page-header">
      <button className="icon-button back-button" type="button" aria-label="Go back" onClick={onBack}><Icon name="arrow" /></button>
      <h1>{title}</h1>
      {action ?? <span className="header-spacer" />}
    </header>
  );
}

function ConfirmDialog({ title, message, onCancel, onConfirm }: { title: string; message: string; onCancel: () => void; onConfirm: () => void }) {
  return <Dialog title={title} message={message} onClose={onCancel} actions={
    <>
      <button className="button-secondary dialog-action" type="button" onClick={onCancel} autoFocus>Cancel</button>
      <button className="button-danger dialog-action" type="button" onClick={onConfirm}>Unsubscribe</button>
    </>
  } />;
}

function SimpleDialog({ title, message, onClose }: { title: string; message: string; onClose: () => void }) {
  return <Dialog title={title} message={message} onClose={onClose} actions={
    <button className="button-primary dialog-action" type="button" onClick={onClose} autoFocus>Close</button>
  } />;
}

function Dialog({ title, message, onClose, actions }: { title: string; message: string; onClose: () => void; actions: React.ReactNode }) {
  const titleId = useId();
  const messageId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialogRef.current?.querySelector<HTMLElement>('button')?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab' && dialogRef.current) {
        const buttons = dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled])');
        const firstButton = buttons[0];
        const lastButton = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === firstButton) {
          event.preventDefault();
          lastButton?.focus();
        } else if (!event.shiftKey && document.activeElement === lastButton) {
          event.preventDefault();
          firstButton?.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={messageId} ref={dialogRef}>
        <span className="dialog-symbol"><Icon name="sparkle" size={21} /></span>
        <h2 id={titleId}>{title}</h2>
        <p id={messageId}>{message}</p>
        <div className="dialog-actions">{actions}</div>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <main className="page-shell not-found-card">
      <div className="empty-state"><span className="empty-symbol">404</span><h1>Page not found</h1><p>The page you are looking for doesn't exist.</p><Link className="button-primary button-link" to="/">Back to Dashboard</Link></div>
    </main>
  );
}

export default App;
