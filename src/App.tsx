import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from './app/providers';
import { AppRouter } from './app/router';
import { Header } from './shared/components/layout/Header';
import { Footer } from './shared/components/layout/Footer';
import { CartDrawer } from './features/cart/CartDrawer';
import { ScrollToTop } from './shared/components/ScrollToTop';
import { ToastHost } from './shared/components/ui/ToastHost';

export const App: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <AppProviders>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
          <Header onOpenCart={() => setIsCartOpen(true)} />

          <main className="flex-1">
            <AppRouter />
          </main>

          <Footer />

          <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          <ToastHost />
        </div>
      </BrowserRouter>
    </AppProviders>
  );
};

export default App;
