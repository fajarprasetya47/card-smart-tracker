import { Icon } from './Icon';

export function AuthBrand() {
  return (
    <header className="login-brand" aria-label="Nova Bank">
      <span className="login-brand-icon"><Icon name="sparkle" size={21} /></span>
      <span className="login-brand-name">Nova Bank</span>
      <span className="login-brand-ai">AI</span>
    </header>
  );
}
