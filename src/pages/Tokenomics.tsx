import { motion } from 'framer-motion';
import LiaisonLogo from '../components/LiaisonLogo';

const TOKENOMICS = [
  { label: 'Public Sale',        pct: 40, amount: '4,000,000', color: '#D4AF37', desc: 'Available via DEX from launch. No vesting.' },
  { label: 'Liquidity Pool',     pct: 25, amount: '2,500,000', color: '#6ec8ff', desc: 'Locked in Uniswap V3 LIAISON/USDT pair.' },
  { label: 'Team & Development', pct: 15, amount: '1,500,000', color: '#c084fc', desc: '24-month linear vesting with 6-month cliff.' },
  { label: 'Ecosystem Fund',     pct: 12, amount: '1,200,000', color: '#4ade80', desc: 'Reserved for grants, partnerships, and integrations.' },
  { label: 'Advisors',           pct: 8,  amount: '800,000',   color: '#fb923c', desc: '12-month vesting with 3-month cliff.' },
];

const SUPPLY_DETAILS = [
  { label: 'Token Name',        value: 'Liaison' },
  { label: 'Token Symbol',      value: 'LIAISON' },
  { label: 'Total Supply',      value: '10,000,000' },
  { label: 'Token Standard',    value: 'ERC-20' },
  { label: 'Network',           value: 'Ethereum Mainnet' },
  { label: 'Decimal Places',    value: '18' },
  { label: 'Minting',           value: 'Disabled (Fixed Supply)' },
  { label: 'Governance',        value: 'On-chain (Planned)' },
];

const Tokenomics = () => {
  // SVG donut
  const r = 80;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="relative overflow-hidden">
      <div className="grid-bg" />
      <div className="glow-orb" style={{ top: '-10%', left: '15%', opacity: 0.4 }} />
      <div className="glow-orb-blue" style={{ bottom: '5%', right: '5%', opacity: 0.35 }} />

      {/* Hero */}
      <section className="section text-center z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="badge badge-gold mb-6">Token Economics</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold font-grotesk mb-5"
          >
            <span className="gold-text">LIAISON</span> Tokenomics
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            A fixed supply of 10,000,000 LIAISON tokens designed for long-term sustainability,
            community ownership, and protocol growth.
          </motion.p>
        </div>
      </section>

      {/* Main Donut + Breakdown */}
      <section className="section-sm z-10">
        <div className="max-w-6xl mx-auto">
          <div className="divider mb-14" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            {/* Donut chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex items-center justify-center"
            >
              <div className="relative w-72 h-72 md:w-80 md:h-80">
                {/* Spin rings */}
                <div className="animate-spin-slow absolute inset-0 rounded-full"
                  style={{ border: '1.5px dashed rgba(212,175,55,0.18)' }} />
                <div className="animate-spin-reverse absolute inset-6 rounded-full"
                  style={{ border: '1px dashed rgba(110,200,255,0.12)' }} />

                {/* SVG Donut */}
                <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full -rotate-90">
                  {TOKENOMICS.map((item, i) => {
                    const dash = (item.pct / 100) * circ;
                    const gap = circ - dash;
                    const el = (
                      <circle
                        key={i}
                        cx="100" cy="100" r={r}
                        fill="none"
                        stroke={item.color}
                        strokeWidth="24"
                        strokeDasharray={`${dash - 4} ${gap + 4}`}
                        strokeDashoffset={-offset}
                        opacity="0.88"
                        strokeLinecap="round"
                      />
                    );
                    offset += dash;
                    return el;
                  })}
                </svg>

                {/* Center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <LiaisonLogo size={56} />
                  <p className="text-lg font-bold font-grotesk gold-text mt-1">10M</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Fixed Supply</p>
                </div>
              </div>
            </motion.div>

            {/* Breakdown */}
            <div className="space-y-4">
              {TOKENOMICS.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                      <span className="font-semibold text-sm text-white">{item.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-lg font-grotesk" style={{ color: item.color }}>
                        {item.pct}%
                      </span>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{item.amount} LIAISON</p>
                    </div>
                  </div>
                  <div className="token-bar mb-2">
                    <motion.div
                      className="token-bar-fill"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.3, delay: i * 0.12, ease: 'easeOut' }}
                      style={{ background: `linear-gradient(90deg, ${item.color}55, ${item.color})` }}
                    />
                  </div>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Token Details */}
      <section className="section-sm z-10">
        <div className="max-w-3xl mx-auto">
          <div className="divider mb-12" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold font-grotesk">
              Token <span className="gold-text">Specifications</span>
            </h2>
          </motion.div>
          <div className="glass rounded-2xl overflow-hidden">
            {SUPPLY_DETAILS.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex justify-between items-center px-6 py-4"
                style={{
                  borderBottom: i < SUPPLY_DETAILS.length - 1
                    ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}
              >
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{row.label}</span>
                <span className="text-sm font-semibold text-white font-grotesk">{row.value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tokenomics;
