import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wallet, Menu, X } from 'lucide-react';
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
    <nav className="navbar" style={{ padding: '0 24px', position: 'sticky', top: 0, zIndex: 100 }}>
      {/* ── Left: Logo ────────────────────────────────────── */}
      <div style={{ flex: '1 0 0', display: 'flex', alignItems: 'center' }}>
        <Link to="/" className="flex items-center gap-2.5">
          <LiaisonLogo size={32} />
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'white' }}>Liaison</span>
        </Link>
      </div>

      {/* ── Center: Navigation Links (Hidden on Mobile via CSS) ────── */}
      <div className="nav-desktop">
        {NAV_LINKS.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: isActive(item.path) ? 600 : 400,
              color: isActive(item.path) ? 'white' : 'rgba(255,255,255,0.5)',
              transition: 'color 0.2s',
            }}
          >
            {item.label}
          </Link>
        ))}
        <a 
          href="#roadmap" 
          onClick={(e) => { e.preventDefault(); scrollToSection('roadmap'); }}
          style={{
            padding: '6px 14px',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.5)',
            cursor: 'pointer',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.target as HTMLElement).style.color = 'white'}
          onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.5)'}
        >
          Roadmap
        </a>
      </div>

      {/* ── Right: Wallet Connect ─────────────────────────── */}
      <div style={{ flex: '1 0 0', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
        <button
          id="nav-connect-btn"
          onClick={() => open()}
          className="btn-primary"
          style={{ 
            padding: '8px 20px', 
            fontSize: '13px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            borderRadius: '10px'
          }}
        >
          <Wallet size={14} />
          <span>
            {isConnected ? walletAddrShort : 'Connect'}
          </span>
        </button>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ 
            background: 'none', border: 'none', cursor: 'pointer', color: 'white',
            padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'absolute',
              top: '64px',
              left: 0,
              right: 0,
              background: 'rgba(11,11,20,0.98)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              padding: '20px 24px',
              zIndex: 99,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {NAV_LINKS.map(item => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    color: isActive(item.path) ? 'white' : 'rgba(255,255,255,0.6)',
                    background: isActive(item.path) ? 'rgba(124,58,237,0.1)' : 'transparent',
                    fontWeight: isActive(item.path) ? 600 : 400,
                    fontSize: '15px',
                  }}
                >
                  {item.label}
                </Link>
              ))}
              <a 
                href="#roadmap" 
                onClick={(e) => { e.preventDefault(); scrollToSection('roadmap'); }}
                style={{
                  display: 'block',
                  padding: '12px 16px',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '15px',
                }}
              >
                Roadmap
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
