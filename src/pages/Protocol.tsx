import { motion } from 'framer-motion';
import { BookOpen, Code2, FileText, Layers, Network, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const CONTRACT = '0xa2f93b5333E82E281764005b88EEfdC9E1dEC921';

const SPECS = [
  { label: 'Token Name',     value: 'Liaison' },
  { label: 'Symbol',         value: 'LIAISON' },
  { label: 'Standard',       value: 'ERC-20' },
  { label: 'Network',        value: 'Ethereum Mainnet' },
  { label: 'Total Supply',   value: '1,000,000 LIAISON' },
  { label: 'Decimals',       value: '18' },
  { label: 'Minting',        value: 'Disabled (fixed supply)' },
  { label: 'DEX',            value: 'Uniswap V3' },
];

const MODULES = [
  {
    icon: <Network size={20} />,
    title: 'Modular Core',
    desc: 'The Liaison network exposes a composable module interface. Third-party developers can plug into the protocol and extend its capabilities permissionlessly.',
  },
  {
    icon: <Zap size={20} />,
    title: 'Algorithmic Routing',
    desc: 'A smart routing engine aggregates on-chain liquidity sources to deliver best execution for every LIAISON/USDT swap with minimal price impact.',
  },
  {
    icon: <Shield size={20} />,
    title: 'Audit Framework',
    desc: 'All protocol modules pass through a standardized on-chain audit framework. Security proofs are published to Ethereum and verifiable by anyone.',
  },
  {
    icon: <Layers size={20} />,
    title: 'Agent Registry',
    desc: 'A decentralized registry of verified AI agents, each with an on-chain identity and reputation score — enabling trustless AI-to-AI coordination.',
  },
];

const Protocol = () => {
  return (
    <div style={{ position: 'relative', zIndex: 1, padding: '40px 24px 80px', minHeight: 'calc(100vh - 64px)' }}>
      <div className="page-bg" />
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '48px' }}
        >
          <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(139,92,246,0.8)', textTransform: 'uppercase', marginBottom: '12px' }}>
            Protocol
          </p>
          <h1 style={{ fontSize: 'clamp(30px, 5vw, 46px)', fontWeight: 800, color: 'white', letterSpacing: '-0.025em', marginBottom: '16px' }}>
            How Liaison Works
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.48)', lineHeight: 1.7, maxWidth: '560px' }}>
            Liaison is the first decentralized modular algorithmic network protocol — a benchmark layer for the AI era.
            It connects on-chain liquidity, autonomous agents, and verifiable compute into a unified infrastructure.
          </p>
        </motion.div>

        {/* Module grid */}
        <section style={{ marginBottom: '56px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(139,92,246,0.8)', textTransform: 'uppercase', marginBottom: '24px' }}>
            Core Modules
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>
            {MODULES.map((mod, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="feature-card"
                style={{ display: 'flex', gap: '16px' }}
              >
                <div style={{
                  width: '40px', height: '40px', flexShrink: 0,
                  borderRadius: '10px',
                  background: 'rgba(124,58,237,0.1)',
                  border: '1px solid rgba(124,58,237,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#a78bfa',
                }}>
                  {mod.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>{mod.title}</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>{mod.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Token specs */}
        <section style={{ marginBottom: '56px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(139,92,246,0.8)', textTransform: 'uppercase', marginBottom: '24px' }}>
            Token Specifications
          </p>
          <div className="card" style={{ overflow: 'hidden' }}>
            {SPECS.map((row, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '16px 24px',
                  borderBottom: i < SPECS.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>{row.label}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'white' }}>{row.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Contract address */}
        <section style={{ marginBottom: '56px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(139,92,246,0.8)', textTransform: 'uppercase', marginBottom: '24px' }}>
            Contract Address
          </p>
          <div className="card" style={{ padding: '20px 24px' }}>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Liaison Contract (ERC20 · Ethereum)
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <code style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                {CONTRACT}
              </code>
              <button
                onClick={() => { navigator.clipboard.writeText(CONTRACT); }}
                className="btn-ghost"
                style={{ padding: '6px 14px', fontSize: '12px' }}
              >
                Copy
              </button>
              <a href={`https://etherscan.io/token/${CONTRACT}`} target="_blank" rel="noopener noreferrer">
                <button className="btn-ghost" style={{ padding: '6px 14px', fontSize: '12px' }}>
                  Etherscan ↗
                </button>
              </a>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section>
          <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(139,92,246,0.8)', textTransform: 'uppercase', marginBottom: '24px' }}>
            Resources
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {[
              { icon: <FileText size={18} />, label: 'Whitepaper', sub: 'Technical specification', href: '#' },
              { icon: <BookOpen size={18} />, label: 'Read the Docs', sub: 'Developer documentation', href: '#' },
              { icon: <Code2 size={18} />, label: 'GitHub', sub: 'Open source contracts', href: '#' },
              { icon: <Network size={18} />, label: 'Uniswap Pool', sub: 'LIAISON/USDT liquidity', href: `https://app.uniswap.org/swap?chain=mainnet&inputCurrency=0xdAC17F958D2ee523a2206206994597C13D831ec7&outputCurrency=${CONTRACT}` },
            ].map((r, i) => (
              <a key={i} href={r.href} target="_blank" rel="noopener noreferrer">
                <div className="feature-card" style={{ cursor: 'pointer' }}>
                  <div style={{ color: '#a78bfa', marginBottom: '12px' }}>{r.icon}</div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'white', marginBottom: '4px' }}>{r.label}</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{r.sub}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginTop: '48px', textAlign: 'center' }}
        >
          <Link to="/swap">
            <button className="btn-primary" style={{ padding: '13px 36px', fontSize: '15px' }}>
              Launch Swap →
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Protocol;
