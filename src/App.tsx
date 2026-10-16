import { Route, Routes } from 'react-router-dom';
import { Toast } from './components/Toast';
import { ThemeToggle } from './components/ThemeToggle';
import { CardDetailPage } from './pages/CardDetailPage';
import { CreditCardsPage } from './pages/CreditCardsPage';
import { DashboardPage } from './pages/DashboardPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SignUpPage } from './pages/SignUpPage';
import { ProtectedRoutes } from './ProtectedRoutes';
import { useTheme } from './state/ThemeProvider';

function App() {
  const { theme } = useTheme();

  return (
    <div className="app-root" data-theme={theme}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/credit-cards" element={<CreditCardsPage />} />
          <Route path="/credit-cards/:cardId" element={<CardDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toast />
      <ThemeToggle />
    </div>
  );
}

export default App;
