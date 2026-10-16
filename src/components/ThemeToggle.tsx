import { useTheme } from '../state/ThemeProvider';
import { Icon } from './Icon';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} theme`}
      title={`Switch to ${isLight ? 'dark' : 'light'} theme`}
    >
      <Icon name={isLight ? 'moon' : 'sun'} size={18} />
      <span>{isLight ? 'Light' : 'Dark'}</span>
    </button>
  );
}
