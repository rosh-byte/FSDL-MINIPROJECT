import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Navbar     from './components/Navbar';
import Home       from './pages/Home';
import AddListing from './pages/AddListing';
import Profile    from './pages/Profile';
import './App.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span className="footer__brand">♻ Junk<span>to</span>Gem</span>
        <span className="footer__tagline">Reuse · Reduce · Reimagine · SDG 12.5</span>
        <span className="footer__copy">© {new Date().getFullYear()} Community Exchange</span>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <div className="app-wrapper">
          <Navbar />
          <Routes>
            <Route path="/"        element={<Home />} />
            <Route path="/add"     element={<AddListing />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*"        element={<Home />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </StoreProvider>
  );
}
