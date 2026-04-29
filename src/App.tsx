import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import LiaisonLogo from './components/LiaisonLogo';
import Home from './pages/Home';
import Swap from './pages/Swap';
import Portfolio from './pages/Portfolio';
import Protocol from './pages/Protocol';
import { useLocation } from 'react-router-dom';

const CONTRACT = '0xa2f93b5333E82E281764005b88EEfdC9E1dEC921';
const SHORT_CONTRACT = '0xa2f93b53...C921';

import { Web3ModalProvider } from './Web3ModalProvider';

// ── 404 Page ──────────────────────────────────────────────────
const NotFound = () => (
  <div style={{
    minHeight: 'calc(100vh - 64px)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    textAlign: 'center', padding: '40px 24px',
    position: 'relative', zIndex: 1,
  }}>
    <div style={{ marginBottom: '24px' }}><LiaisonLogo size={48} /></div>
    <h1 style={{
      fontSize: 'clamp(80px, 15vw, 140px)', fontWeight: 800,
      background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      lineHeight: 1, marginBottom: '16px',
    }}>404</h1>
    <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'white', marginBottom: '12px' }}>Page not found</h2>
    <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)', marginBottom: '32px', maxWidth: '360px' }}>
      That route does not exist on the Liaison protocol. Head back to the home page or jump straight to the swap.
    </p>
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <Link to="/">
        <button className="btn-ghost" style={{ padding: '12px 24px' }}>← Back home</button>
      </Link>
      <Link to="/swap">
        <button className="btn-primary" style={{ padding: '12px 24px' }}>Open Swap</button>
      </Link>
    </div>
  </div>
);

// ── Footer ────────────────────────────────────────────────────
const Footer = () => {
  const [copied, setCopied] = useState(false);
  const location = useLocation();

  // Don't show footer on swap page (matches reference)
  if (location.pathname === '/swap') return null;

  const copy = () => {
    navigator.clipboard.writeText(CONTRACT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.07)',
      background: 'rgba(11,11,20,0.95)',
      position: 'relative', zIndex: 1,
      padding: '56px 32px 32px',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Top row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          {/* Brand column */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <LiaisonLogo size={28} />
              <span style={{ fontSize: '17px', fontWeight: 700, color: 'white' }}>Liaison</span>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: '320px', marginBottom: '20px' }}>
              Liaison is the first benchmark protocol on the modular algorithmic network — a decentralized layer connecting AI, on-chain liquidity, and autonomous agents.
            </p>
            <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: '8px' }}>
              LIAISON CONTRACT (ERC20 (ETHEREUM))
            </p>
            <button
              onClick={copy}
              className="contract-box"
              id="footer-copy-contract"
            >
              {copied ? '✓ Copied!' : SHORT_CONTRACT}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </button>
          </div>

          {/* Resources */}
          <div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'white', marginBottom: '20px' }}>Resources</p>
            {[
              { label: 'Whitepaper', href: '/protocol' },
              { label: 'Tokenomics', href: '/protocol' },
              { label: 'Roadmap', href: '/#roadmap' },
              { label: 'Read the Docs', href: '/protocol' },
            ].map(l => (
              <div key={l.label} style={{ marginBottom: '12px' }}>
                {l.href.startsWith('/') ? (
                  <Link to={l.href} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(139,92,246,0.9)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}>
                    {l.label}
                  </Link>
                ) : (
                  <a href={l.href} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(139,92,246,0.9)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}>
                    {l.label}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Community */}
          <div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'white', marginBottom: '20px' }}>Community</p>
            {[
              { label: 'Telegram', href: 'https://t.me/axionnofficial', icon: '✈' },
            ].map(l => (
              <div key={l.label} style={{ marginBottom: '12px' }}>
                <a href={l.href} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(139,92,246,0.9)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}>
                  <span style={{ fontSize: '14px' }}>{l.icon}</span>
                  {l.label}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '12px',
        }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
            © 2026 Liaison Protocol. All rights reserved.
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
            Built for the modular AI ecosystem.
          </p>
        </div>
      </div>
    </footer>
  );
};

// ── App ───────────────────────────────────────────────────────
function App() {
  return (
    <Web3ModalProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0b0b14' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/"          element={<Home />} />
              <Route path="/swap"      element={<Swap />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/protocol"  element={<Protocol />} />
              <Route path="*"          element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Web3ModalProvider>
  );
}

export default App;
