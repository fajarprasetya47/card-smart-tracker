import type { ReactNode } from 'react';
import { Icon } from './Icon';

interface PageHeaderProps {
  title: string;
  onBack: () => void;
  action?: ReactNode;
}

export function PageHeader({ title, onBack, action }: PageHeaderProps) {
  return (
    <header className="page-header">
      <button className="icon-button back-button" type="button" aria-label="Go back" onClick={onBack}>
        <Icon name="arrow" />
      </button>
      <h1>{title}</h1>
      {action ?? <span className="header-spacer" />}
    </header>
  );
}
