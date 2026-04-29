import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, ShieldCheck, X, CheckCircle2, ChevronRight, Lock, TrendingUp, Globe } from 'lucide-react';
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
          style={{ position: 'absolute', inset: 0, background: 'rgba(5,5,15,0.85)', backdropFilter: 'blur(8px)' }} 
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          style={{ 
            position: 'relative', width: '100%', maxWidth: '640px', maxHeight: '90vh', 
            background: 'var(--bg-card)', border: '1px solid var(--border-md)', 
            borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column'
          }}
        >
          <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'white' }}>{title}</h3>
            <button onClick={onClose} className="btn-ghost" style={{ padding: '8px', borderRadius: '50%' }}>
              <X size={20} />
            </button>
          </div>
          <div style={{ padding: '32px', overflowY: 'auto' }}>
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
    phase: 'Phase 1',
    title: 'Foundation',
    date: 'Q1 2026',
    items: ['Audit resolution & security proofs', 'LiaisonSecurityHook deployment', '1,000,000 LIA supply lock', 'Initial protocol parameters set'],
    status: 'current'
  },
  {
    id: 'launch',
    phase: 'Phase 2',
    title: 'RWA & Liquidity Launch',
    date: 'Q2 2026',
    items: ['Tier-1 gold vault establishment', 'Uniswap v4 pool initialization', 'Liaison Gateway NFT launch', '15% circulating supply unlock'],
    status: 'upcoming'
  },
  {
    id: 'expansion',
    phase: 'Phase 3',
    title: 'Ecosystem Expansion',
    date: 'Q3 2026',
    items: ['LIA staking for high LTV (up to 85%)', 'Institutional lending dashboard', 'Revenue-funded buyback & burn', 'Cross-chain bridging research'],
    status: 'upcoming'
  },
  {
    id: 'governance',
    phase: 'Phase 4',
    title: 'Governance & Scarcity',
    date: 'Q4 2026+',
    items: ['Governance V1 (1 LIA = 1 Vote)', 'RWA diversification (Silver/Estate)', 'Enhanced security hooks V2', 'Global liquidity expansion'],
    status: 'upcoming'
  }
];

const Home = () => {
  const [activeModal, setActiveModal] = useState<'whitepaper' | 'tokenomics' | null>(null);

  return (
    <div style={{ position: 'relative', zIndex: 1, paddingBottom: '100px' }}>
      <div className="page-bg" />
      
      {/* ── Hero Section ────────────────────────────────────── */}
      <section style={{ padding: '100px 24px 80px', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '100px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', marginBottom: '32px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aed' }} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#a78bfa', letterSpacing: '0.02em' }}>
              Liaison Protocol v1.0 Live
            </span>
          </div>
          
          <h1 style={{ fontSize: 'clamp(40px, 8vw, 72px)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '24px' }}>
            Liaison — The first<br />
            <span style={{ background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              benchmark protocol
            </span>
          </h1>
          
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto 40px' }}>
            A decentralized modular algorithmic network protocol built for the AI era. 
            Connecting on-chain liquidity, autonomous agents, and verifiable compute.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/swap">
              <button className="btn-primary" style={{ padding: '14px 32px', fontSize: '16px' }}>
                Launch Swap <ArrowRight size={18} />
              </button>
            </Link>
            <button onClick={() => setActiveModal('whitepaper')} className="btn-ghost" style={{ padding: '14px 32px', fontSize: '16px' }}>
              <BookOpen size={18} /> Read Whitepaper
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── Stats ───────────────────────────────────────────── */}
      <section style={{ maxWidth: '1000px', margin: '0 auto 100px', padding: '0 24px' }}>
        <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', padding: '40px' }}>
          {[
            { label: 'Total Value Locked', value: '$182M+' },
            { label: 'Verified Agents', value: '14,200+' },
            { label: 'Network Modules', value: '36' },
            { label: 'Avg. Settle Time', value: '1.4s' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
              <p style={{ fontSize: '28px', fontWeight: 800, color: 'white' }}>{s.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Roadmap Section ─────────────────────────────────── */}
      <section id="roadmap" style={{ maxWidth: '1000px', margin: '0 auto 100px', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'white', marginBottom: '16px' }}>Strategic Roadmap</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '16px' }}>The evolution of the Liaison network protocol (2026–2027)</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
          {ROADMAP_PHASES.map((p, i) => (
            <motion.div 
              key={p.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card" 
              style={{ 
                padding: '32px', 
                borderLeft: p.status === 'current' ? '4px solid #7c3aed' : '1px solid var(--border-md)',
                background: p.status === 'current' ? 'rgba(124,58,237,0.03)' : 'var(--bg-card)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{p.phase}</span>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'white', marginTop: '4px' }}>{p.title}</h3>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.04)', padding: '4px 10px', borderRadius: '6px' }}>{p.date}</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {p.items.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '12px', fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                    <CheckCircle2 size={16} style={{ color: p.status === 'current' ? '#7c3aed' : 'rgba(255,255,255,0.15)', flexShrink: 0, marginTop: 2 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Tokenomics Section ──────────────────────────────── */}
      <section style={{ maxWidth: '1000px', margin: '0 auto 100px', padding: '0 24px' }}>
        <div className="card" style={{ padding: '48px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(124,58,237,0.05) 0%, rgba(5,5,15,0) 100%)' }}>
          <ShieldCheck size={48} style={{ color: '#7c3aed', marginBottom: '24px', opacity: 0.8 }} />
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'white', marginBottom: '16px' }}>Secured Tokenomics</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '16px', maxWidth: '600px', margin: '0 auto 32px', lineHeight: 1.65 }}>
            Liaison maintains a strictly capped supply of 1,000,000 LIA tokens, backed by institutional gold reserves and secured by Uniswap v4 protocol hooks.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <button onClick={() => setActiveModal('tokenomics')} className="btn-primary" style={{ padding: '12px 32px' }}>
              Detailed Tokenomics
            </button>
          </div>
        </div>
      </section>

      {/* ── Modals ──────────────────────────────────────────── */}
      
      {/* Whitepaper Modal */}
      <Modal isOpen={activeModal === 'whitepaper'} onClose={() => setActiveModal(null)} title="Technical Whitepaper">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <section>
            <h4 style={{ color: 'white', fontSize: '16px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={18} style={{ color: '#a78bfa' }} /> Protocol Architecture
            </h4>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
              Liaison is a decentralized RWA (Real World Asset) protocol designed to tokenize institutional-grade physical gold. By utilizing Ethereum's security and Uniswap v4's composability, we enable borderless gold-backed lending and liquidity.
            </p>
          </section>
          
          <section>
            <h4 style={{ color: 'white', fontSize: '16px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={18} style={{ color: '#a78bfa' }} /> Security Framework
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'LiaisonSecurityHook: 5-minute mandatory trade cooldown.',
                'MEV & Sandwich Protection via Uniswap v4 hooks.',
                'Automated price floor maintenance through gold reserves.',
                'Fixed supply lock: Supply cannot be minted.'
              ].map((item, i) => (
                <li key={i} style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', display: 'flex', gap: '10px' }}>
                  <ChevronRight size={14} style={{ color: '#7c3aed', flexShrink: 0, marginTop: 4 }} /> {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h4 style={{ color: 'white', fontSize: '16px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} style={{ color: '#a78bfa' }} /> Economic Flywheel
            </h4>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
              20% of all gold-lending interest revenue is automatically routed to a permanent buy-back and burn contract. This creates constant buy pressure and deflationary mechanics as protocol adoption grows.
            </p>
          </section>
        </div>
      </Modal>

      {/* Tokenomics Modal */}
      <Modal isOpen={activeModal === 'tokenomics'} onClose={() => setActiveModal(null)} title="LIA Tokenomics">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '4px' }}>Total Supply</p>
            <p style={{ fontSize: '32px', fontWeight: 800, color: 'white' }}>1,000,000 LIA</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Public Liquidity (LP)', pct: '40%', val: '400,000 LIA', color: '#7c3aed' },
              { label: 'Gold Reserve Fund', pct: '25%', val: '250,000 LIA', color: '#8b5cf6' },
              { label: 'Ecosystem Rewards', pct: '15%', val: '150,000 LIA', color: '#a78bfa' },
              { label: 'Strategic Treasury', pct: '10%', val: '100,000 LIA', color: '#c4b5fd' },
              { label: 'Founding Team', pct: '10%', val: '100,000 LIA', color: '#ddd6fe' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>{item.label}</p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{item.pct} Allocation</p>
                  </div>
                </div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'white', fontFamily: 'monospace' }}>{item.val}</p>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', fontStyle: 'italic' }}>
            Note: Team allocation is subject to a 24-month linear vesting period with a 6-month cliff to ensure long-term alignment.
          </p>
        </div>
      </Modal>

      {/* ── Crypto Ticker Footer ────────────────────────────── */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <CryptoTicker />
      </div>
    </div>
  );
};

export default Home;
