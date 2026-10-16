import { Icon } from '../components/Icon';
import { ServiceTile, type DashboardService } from '../components/ServiceTile';
import { formatCurrency } from '../utils';

const serviceCards: DashboardService[] = [
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

const quickActions = [
  { title: 'Transfer', icon: 'transfer' as const },
  { title: 'Scan QR', icon: 'qr' as const },
  { title: 'Pay Bills', icon: 'bill' as const },
  { title: 'Save', icon: 'piggy' as const },
];

export function DashboardPage() {
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
        {quickActions.map((action) => (
          <button className="quick-action" type="button" key={action.title}>
            <span className="quick-icon"><Icon name={action.icon} /></span>
            <span>{action.title}</span>
          </button>
        ))}
      </nav>

      <section className="insight-panel">
        <span className="insight-icon"><Icon name="sparkle" size={20} /></span>
        <div>
          <span className="insight-title">AI INSIGHT</span>
          <p>You spend <strong>{formatCurrency(2_979_000)}/month</strong> on credit-card subscriptions across 8 services. Tap below to review.</p>
        </div>
      </section>

      <section className="service-section">
        <h1>Services</h1>
        <div className="service-grid">
          {serviceCards.map((service) => <ServiceTile service={service} key={service.title} />)}
        </div>
      </section>
    </main>
  );
}
