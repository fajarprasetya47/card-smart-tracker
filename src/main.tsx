import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './state/AuthProvider';
import { SubscriptionProvider } from './state/SubscriptionProvider';
import { ThemeProvider } from './state/ThemeProvider';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <SubscriptionProvider>
        <ThemeProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </SubscriptionProvider>
    </AuthProvider>
  </React.StrictMode>,
);
