import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wallet, Menu, X, ChevronRight } from 'lucide-react';
import LiaisonLogo from './LiaisonLogo';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers/react';

const NAV_LINKS = [
  { label: 'Home',      path: '/' },
  { label: 'Swap',      path: '/swap' },
  { label: 'Portfolio', path: '/portfolio' },
  { label: 'Protocol',  path: '/protocol' },
];

const Navbar = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = `/#${id}`;
    }
  };

  const walletAddrShort = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <nav className="navbar" style={{ 
      background: 'rgba(5, 5, 5, 0.7)', 
      backdropFilter: 'blur(16px)', 
      borderBottom: '1px solid var(--border)',
      height: '72px',
      padding: '0 32px'
    }}>
      {/* ── Left: Logo ────────────────────────────────────── */}
      <div style={{ flex: '1 0 0', display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <LiaisonLogo size={34} />
          <span style={{ 
            fontSize: '20px', 
            fontWeight: 800, 
            color: 'white', 
            letterSpacing: '-0.02em',
            background: 'linear-gradient(to right, #ffffff, #D4AF37)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Liaison</span>
        </Link>
      </div>

      {/* ── Center: Navigation Links ────────────────────────── */}
      <div className="nav-desktop">
        {NAV_LINKS.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: isActive(item.path) ? 700 : 500,
              color: isActive(item.path) ? 'var(--gold-primary)' : 'var(--text-secondary)',
              transition: 'all 0.3s',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            className="nav-link-hover"
          >
            {item.label}
            {isActive(item.path) && <motion.div layoutId="activeNav" style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--gold-primary)' }} />}
          </Link>
        ))}
        <a 
          href="#roadmap" 
          onClick={(e) => { e.preventDefault(); scrollToSection('roadmap'); }}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'color 0.3s',
            textDecoration: 'none'
          }}
          onMouseEnter={e => (e.target as HTMLElement).style.color = 'white'}
          onMouseLeave={e => (e.target as HTMLElement).style.color = 'var(--text-secondary)'}
        >
          Roadmap
        </a>
      </div>

      {/* ── Right: Wallet Connect ─────────────────────────── */}
      <div style={{ flex: '1 0 0', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px' }}>
        <button
          id="nav-connect-btn"
          onClick={() => open()}
          className="btn-primary"
          style={{ 
            padding: '10px 20px', 
            fontSize: '13px', 
            gap: '10px',
            textTransform: 'none'
          }}
        >
          <Wallet size={16} />
          <span style={{ fontWeight: 700 }}>
            {isConnected ? walletAddrShort : 'Connect Portal'}
          </span>
        </button>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ 
            background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', cursor: 'pointer', color: 'white',
            width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'absolute',
              top: '72px',
              left: '12px',
              right: '12px',
              background: 'rgba(10, 10, 10, 0.95)',
              backdropFilter: 'blur(24px)',
              border: '1px solid var(--border-md)',
              borderRadius: '24px',
              padding: '24px',
              zIndex: 99,
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {NAV_LINKS.map(item => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    borderRadius: '16px',
                    color: isActive(item.path) ? 'white' : 'var(--text-secondary)',
                    background: isActive(item.path) ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                    fontWeight: isActive(item.path) ? 700 : 500,
                    fontSize: '16px',
                    textDecoration: 'none',
                    border: isActive(item.path) ? '1px solid var(--border-gold)' : '1px solid transparent'
                  }}
                >
                  {item.label}
                  <ChevronRight size={18} opacity={isActive(item.path) ? 1 : 0.3} />
                </Link>
              ))}
              <a 
                href="#roadmap" 
                onClick={(e) => { e.preventDefault(); scrollToSection('roadmap'); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  color: 'var(--text-secondary)',
                  fontSize: '16px',
                  textDecoration: 'none'
                }}
              >
                Roadmap
                <ChevronRight size={18} opacity={0.3} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
