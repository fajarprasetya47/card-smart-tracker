import { Link } from 'react-router-dom';
import { Icon, type IconName } from './Icon';

export interface DashboardService {
  title: string;
  description: string;
  icon: IconName;
  target?: string;
  isNew?: boolean;
}

export function ServiceTile({ service }: { service: DashboardService }) {
  const content = (
    <>
      {service.isNew && <span className="new-badge">NEW</span>}
      <span className={`service-icon ${service.title === 'Credit Card' ? 'service-icon-featured' : ''}`}>
        <Icon name={service.icon} size={22} />
      </span>
      <span className="service-title">{service.title}</span>
      <span className="service-description">{service.description}</span>
    </>
  );

  if (service.target) {
    return (
      <Link className="service-tile service-tile-link" to={service.target}>
        {content}
      </Link>
    );
  }

  return (
    <button className="service-tile service-tile-button" type="button" aria-label={`${service.title}, coming soon`}>
      {content}
      <span className="coming-soon">Coming soon</span>
    </button>
  );
}
