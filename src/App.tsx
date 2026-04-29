import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LiaisonLogo from './components/LiaisonLogo';
import Home from './pages/Home';
import Swap from './pages/Swap';
import Portfolio from './pages/Portfolio';
import Protocol from './pages/Protocol';
import { Web3ModalProvider } from './Web3ModalProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/react';

const CONTRACT = '0xa2f93b5333E82E281764005b88EEfdC9E1dEC921';
const SHORT_CONTRACT = '0xa2f93b53...C921';

// ── 404 Page ──────────────────────────────────────────────────
const NotFound = () => (
  <div style={{
    minHeight: 'calc(100vh - 72px)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    textAlign: 'center', padding: '40px 24px',
    position: 'relative', zIndex: 1,
  }}>
    <div style={{ marginBottom: '24px' }}><LiaisonLogo size={64} /></div>
    <h1 style={{
      fontSize: 'clamp(80px, 15vw, 140px)', fontWeight: 900,
      background: 'linear-gradient(135deg, var(--gold-primary), var(--gold-secondary))',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      lineHeight: 1, marginBottom: '16px',
    }}>404</h1>
    <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'white', marginBottom: '12px' }}>Route Obscured</h2>
    <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '400px' }}>
      The requested coordinates do not exist on the Liaison protocol. Return to the main portal or initialize a swap.
    </p>



    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <button className="btn-ghost">← Portal Home</button>
      </Link>
      <Link to="/swap" style={{ textDecoration: 'none' }}>
        <button className="btn-primary">Initialize Swap</button>
      </Link>
    </div>
  </div>
);

// ── Footer ────────────────────────────────────────────────────
const Footer = () => {
  const [copied, setCopied] = useState(false);
  const location = useLocation();

  if (location.pathname === '/swap') return null;

  const copy = () => {
    navigator.clipboard.writeText(CONTRACT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: 'rgba(5, 5, 5, 0.8)',
      backdropFilter: 'blur(12px)',
      position: 'relative', zIndex: 1,
      padding: '80px 32px 40px',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '60px', marginBottom: '60px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <LiaisonLogo size={32} />
              <span style={{ fontSize: '22px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>Liaison</span>
            </div>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '400px', marginBottom: '24px' }}>
              The premier modular algorithmic network protocol connecting institutional gold liquidity with autonomous agents and decentralized finance.
            </p>
            <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.15em', color: 'var(--gold-primary)', textTransform: 'uppercase', marginBottom: '12px' }}>
              Institutional Contract (ERC20)
            </p>
            <button
              onClick={copy}
              className="contract-box"
              style={{ 
                background: 'rgba(212, 175, 55, 0.05)', 
                border: '1px solid var(--border-gold)',
                color: 'var(--gold-primary)',
                padding: '10px 20px',
                borderRadius: '12px',
                fontFamily: 'monospace',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              {copied ? '✓ COPIED' : SHORT_CONTRACT}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </button>
          </div>

          <div>
            <p style={{ fontSize: '15px', fontWeight: 800, color: 'white', marginBottom: '24px', letterSpacing: '0.05em' }}>RESOURCES</p>
            {[
              { label: 'Technical Whitepaper', href: '/protocol' },
              { label: 'Tokenomics Framework', href: '/protocol' },
              { label: 'Strategic Roadmap', href: '/#roadmap' },
              { label: 'Developer Documentation', href: '/protocol' },
            ].map(l => (
              <div key={l.label} style={{ marginBottom: '14px' }}>
                <Link to={l.href} style={{ fontSize: '14px', color: 'var(--text-secondary)', transition: 'all 0.3s', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
                  {l.label}
                </Link>
              </div>
            ))}
          </div>

          <div>
            <p style={{ fontSize: '15px', fontWeight: 800, color: 'white', marginBottom: '24px', letterSpacing: '0.05em' }}>NETWORK</p>
            {[
              { label: 'Etherscan', href: `https://etherscan.io/token/${CONTRACT}` },
              { label: 'DexScreener', href: `https://dexscreener.com/ethereum/${CONTRACT}` },
              { label: 'Uniswap Portal', href: 'https://app.uniswap.org' },
              { label: 'Community Telegram', href: 'https://t.me/axionnofficial' },
            ].map(l => (
              <div key={l.label} style={{ marginBottom: '14px' }}>
                <a href={l.href} target="_blank" rel="noreferrer" style={{ fontSize: '14px', color: 'var(--text-secondary)', transition: 'all 0.3s', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
                  {l.label}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '32px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '20px',
        }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            © 2026 Liaison Protocol. All institutional rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Security Audited</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Gold Backed</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ── App ───────────────────────────────────────────────────────
function App() {
  return (
    <Web3ModalProvider>
      <Analytics />
      <Toaster 
        theme="dark" 
        position="top-right" 
        expand={false} 
        richColors 
        toastOptions={{
          style: {
            background: 'rgba(10, 10, 10, 0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--border-gold)',
            color: 'white',
            borderRadius: '16px',
          }
        }}
      />
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>
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
