import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TokenProvider } from './components/TokenContext.tsx';
import { CartProvider } from './cart/CartContext.tsx';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TokenProvider>
        <CartProvider>
            <App />
        </CartProvider>
      </TokenProvider>
    </BrowserRouter>
  </StrictMode>,
);
