import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmedPage from './pages/OrderConfirmedPage';
import AdminPage from './pages/AdminPage';
import TrackOrderPage from './pages/TrackOrderPage';
import MyOrdersPage from './pages/MyOrdersPage';
import { CartProvider } from './context/CartContext';
import { UserAuthProvider } from './context/UserAuthContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <UserAuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
          <Route path="*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/products/:productId" element={<ProductDetailPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmed/:orderId" element={<OrderConfirmedPage />} />
                <Route path="/track-order" element={<TrackOrderPage />} />
              </Routes>
            </Layout>
          } />
        </Routes>
        </UserAuthProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
