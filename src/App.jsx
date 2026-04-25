import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Admin from './pages/Admin';
import { FallingPattern } from './components/FallingPattern';

export default function App() {
  return (
    <BrowserRouter>
      {/* Full-page falling pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <FallingPattern
          color="#34d399"
          backgroundColor="#0a0a0f"
          duration={120}
          blurIntensity="0.5em"
          density={1}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(10,10,15,0.6)' }} />
      </div>

      <div className="relative z-10 w-full">
        <Sidebar />
        <div
          style={{
            paddingLeft: 'var(--sb-width)',
            transition: 'padding-left 0.22s ease',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <main className="flex-1 w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/success" element={<Success />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}
