import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TokenProvider } from './components/TokenContext.tsx';
import { CartProvider } from './cart/CartContext.tsx';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import {CurrentPageProvider} from "./components/Admin/AdminSPAContext.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TokenProvider>
      <CurrentPageProvider>
        <CartProvider>
            <App />
        </CartProvider>

      </CurrentPageProvider>
      </TokenProvider>
    </BrowserRouter>
  </StrictMode>,
);
