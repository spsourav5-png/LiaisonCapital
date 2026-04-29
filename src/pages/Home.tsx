import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, ShieldCheck, X, CheckCircle2, ChevronRight, Lock, TrendingUp, Globe, BarChart3, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import CryptoTicker from '../components/CryptoTicker';

// ── Shared Modal Component ─────────────────────────────────────
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }} 
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          style={{ 
            position: 'relative', width: '100%', maxWidth: '680px', maxHeight: '90vh', 
            background: 'var(--bg-card)', border: '1px solid var(--border-md)', 
            borderRadius: '32px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
            boxShadow: '0 40px 100px rgba(0,0,0,0.8)'
          }}
        >
          <div style={{ padding: '32px 40px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>{title}</h3>
            <button onClick={onClose} className="btn-ghost" style={{ padding: '10px', borderRadius: '50%', minWidth: 'auto', border: 'none' }}>
              <X size={24} />
            </button>
          </div>
          <div style={{ padding: '40px', overflowY: 'auto' }}>
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// ── Roadmap Data ──────────────────────────────────────────────
const ROADMAP_PHASES = [
  {
    id: 'foundation',
    phase: 'Phase I',
    title: 'Security Genesis',
    date: 'Q1 2026',
    items: ['Multi-layer security audit completion', 'Institutional Gold-Vault integration', 'LiaisonSecurityHook V1 Deployment', 'Fixed Supply Cryptographic Lock'],
    status: 'current'
  },
  {
    id: 'launch',
    phase: 'Phase II',
    title: 'Market Expansion',
    date: 'Q2 2026',
    items: ['Tier-1 Liquidity initialization', 'Global RWA tokenization framework', 'Institutional Lending Dashboard', 'Strategic Partner Node Network'],
    status: 'upcoming'
  },
  {
    id: 'expansion',
    phase: 'Phase III',
    title: 'Algorithmic Maturity',
    date: 'Q3 2026',
    items: ['Autonomous Agent Protocol v2', 'Cross-chain Gold Interoperability', 'Revenue-funded Deflationary Burn', 'Enhanced LTV Management'],
    status: 'upcoming'
  },
  {
    id: 'governance',
    phase: 'Phase IV',
    title: 'Decentralized Sovereignty',
    date: 'Q4 2026+',
    items: ['DAO Governance Initialization', 'Global RWA Diversification', 'Sovereign Wealth Integration', 'Next-Gen Algorithmic Yields'],
    status: 'upcoming'
  }
];

const Home = () => {
  const [activeModal, setActiveModal] = useState<'whitepaper' | 'tokenomics' | null>(null);

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div className="page-bg" />
      
      {/* ── Hero Section ────────────────────────────────────── */}
      <section style={{ padding: '120px 24px 100px', textAlign: 'center', maxWidth: '1400px', margin: '0 auto' }}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '10px', 
            padding: '8px 20px', 
            borderRadius: '100px', 
            background: 'rgba(212, 175, 55, 0.08)', 
            border: '1px solid var(--border-gold)', 
            marginBottom: '40px',
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.1)'
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold-primary)', boxShadow: '0 0 10px var(--gold-primary)' }} />
            <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--gold-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Protocol Genesis Live
            </span>
          </div>
          
          <h1 style={{ fontSize: 'clamp(48px, 10vw, 92px)', fontWeight: 900, color: 'white', letterSpacing: '-0.04em', lineHeight: 1.0, marginBottom: '32px' }}>
            The Institutional<br />
            <span style={{ 
              background: 'linear-gradient(to right, #D4AF37, #F9E076, #C5A028)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.2))'
            }}>
              Benchmark Protocol
            </span>
          </h1>
          
          <p style={{ fontSize: '20px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '720px', margin: '0 auto 56px', fontWeight: 500 }}>
            Liaison bridges the gap between institutional gold reserves and decentralized modular networks. 
            Built for the era of autonomous agents and verifiable RWA liquidity.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <Link to="/swap" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ padding: '18px 48px', fontSize: '16px' }}>
                Initialize Portal <ArrowRight size={20} />
              </button>
            </Link>
            <button onClick={() => setActiveModal('whitepaper')} className="btn-ghost" style={{ padding: '18px 48px', fontSize: '16px' }}>
              <BookOpen size={20} /> Research Framework
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── Core Metrics ────────────────────────────────────── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 120px', padding: '0 24px' }}>
        <div className="card" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '40px', 
          padding: '60px 40px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border-md)',
          boxShadow: '0 30px 70px rgba(0,0,0,0.5)'
        }}>
          {[
            { label: 'Institutional TVL', value: '$240M+', icon: BarChart3 },
            { label: 'Network Agents', value: '18,500+', icon: Globe },
            { label: 'Modular Modules', value: '42', icon: Shield },
            { label: 'Security Score', value: '99.9%', icon: Lock },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <s.icon size={24} style={{ color: 'var(--gold-primary)', opacity: 0.6 }} />
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800 }}>{s.label}</p>
              <p style={{ fontSize: '36px', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>{s.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Strategic Roadmap ───────────────────────────────── */}
      <section id="roadmap" style={{ maxWidth: '1200px', margin: '0 auto 120px', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '72px' }}>
          <h2 style={{ fontSize: '42px', fontWeight: 900, color: 'white', marginBottom: '20px', letterSpacing: '-0.02em' }}>Strategic Trajectory</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>The multi-phase evolution of the Liaison institutional network protocol.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px' }}>
          {ROADMAP_PHASES.map((p, i) => (
            <motion.div 
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card" 
              style={{ 
                padding: '40px', 
                border: p.status === 'current' ? '1px solid var(--gold-primary)' : '1px solid var(--border)',
                background: p.status === 'current' ? 'rgba(212, 175, 55, 0.04)' : 'rgba(255, 255, 255, 0.01)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {p.status === 'current' && (
                <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--gold-primary)', color: '#000', fontSize: '10px', fontWeight: 900, padding: '4px 12px', borderBottomLeftRadius: '12px', textTransform: 'uppercase' }}>
                  Active
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{p.phase}</span>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'white', marginTop: '8px', letterSpacing: '-0.01em' }}>{p.title}</h3>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '6px 14px', borderRadius: '10px', border: '1px solid var(--border)' }}>{p.date}</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {p.items.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '14px', marginBottom: '16px', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.5, fontWeight: 500 }}>
                    <CheckCircle2 size={18} style={{ color: p.status === 'current' ? 'var(--gold-primary)' : 'var(--border-gold)', flexShrink: 0, marginTop: 2 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Tokenomics Overview ─────────────────────────────── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 140px', padding: '0 24px' }}>
        <div className="card" style={{ 
          padding: '80px 40px', 
          textAlign: 'center', 
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(0,0,0,0) 100%)',
          border: '1px solid var(--gold-glow)'
        }}>
          <ShieldCheck size={64} style={{ color: 'var(--gold-primary)', marginBottom: '32px', opacity: 0.8 }} />
          <h2 style={{ fontSize: '42px', fontWeight: 900, color: 'white', marginBottom: '24px', letterSpacing: '-0.02em' }}>Institutional Scarcity</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '700px', margin: '0 auto 48px', lineHeight: 1.7, fontWeight: 500 }}>
            The Liaison protocol maintains a strictly capped supply of 1,000,000 LIA tokens, algorithmically secured by institutional gold vault proofs and Uniswap V4 protocol hooks.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button onClick={() => setActiveModal('tokenomics')} className="btn-primary" style={{ padding: '16px 48px' }}>
              Framework Details
            </button>
          </div>
        </div>
      </section>

      {/* ── Modals ──────────────────────────────────────────── */}
      
      {/* Whitepaper Modal */}
      <Modal isOpen={activeModal === 'whitepaper'} onClose={() => setActiveModal(null)} title="Technical Framework V1.0">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <section>
            <h4 style={{ color: 'white', fontSize: '18px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Globe size={22} style={{ color: 'var(--gold-primary)' }} /> Protocol Architecture
            </h4>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              Liaison is the first decentralized RWA (Real World Asset) benchmark protocol. By tokenizing institutional gold reserves through a series of cryptographic proofs and smart contract hooks, we enable a borderless layer of high-fidelity liquidity.
            </p>
          </section>
          
          <section>
            <h4 style={{ color: 'white', fontSize: '18px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Lock size={22} style={{ color: 'var(--gold-primary)' }} /> Security Hooks
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                'LiaisonSecurityHook: Automated 300-second trade stabilization.',
                'Cross-chain vault synchronization via verified oracles.',
                'Algorithmic price floor maintenance through reserve rebalancing.',
                'Immutable supply cap: Mint functions permanently revoked.'
              ].map((item, i) => (
                <li key={i} style={{ fontSize: '15px', color: 'var(--text-secondary)', display: 'flex', gap: '12px', fontWeight: 500 }}>
                  <ChevronRight size={16} style={{ color: 'var(--gold-primary)', flexShrink: 0, marginTop: 4 }} /> {item}
                </li>
              ))}
            </ul>
          </section>

          <section style={{ background: 'rgba(212, 175, 55, 0.05)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-gold)' }}>
            <p style={{ fontSize: '14px', color: 'var(--gold-primary)', lineHeight: 1.6, fontWeight: 700 }}>
              "The Liaison protocol ensures that every 1,000 LIA in circulation is backed by a verifiable commitment to the global gold benchmark, creating a new standard for decentralized store of value."
            </p>
          </section>
        </div>
      </Modal>

      {/* Tokenomics Modal */}
      <Modal isOpen={activeModal === 'tokenomics'} onClose={() => setActiveModal(null)} title="Economic Framework">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '32px', borderRadius: '24px', textAlign: 'center', border: '1px solid var(--border)' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 800, letterSpacing: '0.1em' }}>Capped Supply</p>
            <p style={{ fontSize: '42px', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>1,000,000 LIA</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Public Liquidity (Locked)', pct: '40%', val: '400,000 LIA', color: '#D4AF37' },
              { label: 'Institutional Gold Reserve', pct: '25%', val: '250,000 LIA', color: '#C5A028' },
              { label: 'Network Incentives', pct: '15%', val: '150,000 LIA', color: '#8B7532' },
              { label: 'Treasury & R&D', pct: '10%', val: '100,000 LIA', color: '#444444' },
              { label: 'Strategic Core Team', pct: '10%', val: '100,000 LIA', color: '#222222' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: 12, height: 12, borderRadius: '4px', background: item.color, boxShadow: `0 0 10px ${item.color}` }} />
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: 800, color: 'white' }}>{item.label}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>{item.pct} Strategic Allocation</p>
                  </div>
                </div>
                <p style={{ fontSize: '16px', fontWeight: 900, color: 'white', fontFamily: 'monospace' }}>{item.val}</p>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', fontStyle: 'italic', fontWeight: 500 }}>
            Standard 24-month linear vesting applies to team and treasury allocations with an immediate 6-month cliff.
          </p>
        </div>
      </Modal>

      {/* ── Crypto Ticker Footer ────────────────────────────── */}
      <div style={{ position: 'sticky', bottom: 0, left: 0, right: 0, zIndex: 10 }}>
        <CryptoTicker />
      </div>
    </div>
  );
};

export default Home;
