import { Route, Routes } from 'react-router-dom';
import { Toast } from './components/Toast';
import { CardDetailPage } from './pages/CardDetailPage';
import { CreditCardsPage } from './pages/CreditCardsPage';
import { DashboardPage } from './pages/DashboardPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SignUpPage } from './pages/SignUpPage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/" element={<DashboardPage />} />
        <Route path="/credit-cards" element={<CreditCardsPage />} />
        <Route path="/credit-cards/:cardId" element={<CardDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toast />
    </>
  );
}

export default App;
