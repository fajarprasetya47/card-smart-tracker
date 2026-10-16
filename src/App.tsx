import { Route, Routes } from 'react-router-dom';
import { Toast } from './components/Toast';
import { CardDetailPage } from './pages/CardDetailPage';
import { CreditCardsPage } from './pages/CreditCardsPage';
import { DashboardPage } from './pages/DashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <>
      <Routes>
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
