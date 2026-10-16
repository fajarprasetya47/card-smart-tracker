import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { SubscriptionProvider } from './state/SubscriptionProvider';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SubscriptionProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SubscriptionProvider>
  </React.StrictMode>,
);
