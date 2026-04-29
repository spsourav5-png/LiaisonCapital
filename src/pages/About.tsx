import { motion } from 'framer-motion';
import { Shield, Zap, Globe, FileText, ExternalLink, GitBranch } from 'lucide-react';
import LiaisonLogo from '../components/LiaisonLogo';

const TEAM = [
  { name: 'Protocol Lead', role: 'Architecture & Smart Contracts', avatar: '🔷' },
  { name: 'DeFi Engineer', role: 'Uniswap V3 Integration',         avatar: '⚡' },
  { name: 'AI Researcher', role: 'Modular Algorithm Design',       avatar: '🤖' },
  { name: 'Security Lead', role: 'Audit & Risk Management',        avatar: '🛡️' },
];

const MILESTONES = [
  { date: 'Q1 2025', title: 'Protocol Conception',     desc: 'Initial whitepaper and tokenomics design completed.', done: true },
  { date: 'Q2 2025', title: 'Smart Contract Audit',    desc: 'Full security audit by independent firm.', done: true },
  { date: 'Q3 2025', title: 'Mainnet Launch',          desc: 'LIAISON token deployed on Ethereum mainnet.', done: true },
  { date: 'Q4 2025', title: 'Uniswap V3 Listing',      desc: 'LIAISON/USDT pool live with deep liquidity.', done: true },
  { date: 'Q1 2026', title: 'Governance Launch',       desc: 'On-chain voting and proposal system active.', done: false },
  { date: 'Q2 2026', title: 'Cross-chain Bridge',      desc: 'LIAISON bridging to Base and Arbitrum.', done: false },
];

const About = () => {
  const CONTRACT = '0xa2f93b5333E82E281764005b88EEfdC9E1dEC921';

  return (
    <div className="relative overflow-hidden">
      <div className="grid-bg" />

      {/* Hero */}
      <section className="section text-center z-10">
        <div className="glow-orb" style={{ top: '-20%', left: '20%', opacity: 0.4 }} />
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <LiaisonLogo size={96} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold font-grotesk mb-5"
          >
            About <span className="gold-text">Liaison</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            Liaison is the first decentralized modular algorithmic network protocol engineered
            for the AI era. Built on Ethereum, LIAISON provides institutional-grade liquidity,
            transparent on-chain governance, and smart yield — all in a permissionless,
            borderless ecosystem.
          </motion.p>
        </div>
      </section>

      {/* Mission Cards */}
      <section className="section-sm z-10">
        <div className="max-w-5xl mx-auto">
          <div className="divider mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: <Shield size={24} />, color: '#D4AF37', bg: 'rgba(212,175,55,0.08)',
                title: 'Our Mission',
                desc: 'To democratize access to institutional-grade DeFi infrastructure through modular, AI-driven protocol design.' },
              { icon: <Globe size={24} />, color: '#6ec8ff', bg: 'rgba(110,200,255,0.08)',
                title: 'Our Vision',
                desc: 'A global benchmark protocol that serves as the liquidity backbone for AI-native financial applications.' },
              { icon: <Zap size={24} />, color: '#c084fc', bg: 'rgba(192,132,252,0.08)',
                title: 'Our Approach',
                desc: 'Modular smart contracts, deep Uniswap V3 pools, and algorithmic yield optimization at scale.' },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="glass-card p-7"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl mb-5"
                  style={{ background: card.bg, color: card.color }}>
                  {card.icon}
                </div>
                <h3 className="font-bold mb-3 font-grotesk text-white">{card.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="section z-10">
        <div className="max-w-4xl mx-auto">
          <div className="divider mb-12" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="badge badge-gold mb-4">Roadmap</span>
            <h2 className="text-3xl md:text-4xl font-bold font-grotesk">
              Protocol <span className="gold-text">Milestones</span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[18px] md:left-1/2 top-0 bottom-0 w-px"
              style={{ background: 'linear-gradient(180deg, rgba(212,175,55,0.4), rgba(212,175,55,0.05))' }} />

            <div className="space-y-6">
              {MILESTONES.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative flex gap-4 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Dot */}
                  <div className="absolute left-[10px] md:left-1/2 top-4 w-4 h-4 rounded-full -translate-x-1/2 z-10 flex items-center justify-center"
                    style={{
                      background: m.done ? '#D4AF37' : 'rgba(255,255,255,0.1)',
                      border: m.done ? '2px solid rgba(212,175,55,0.5)' : '2px solid rgba(255,255,255,0.15)',
                      boxShadow: m.done ? '0 0 12px rgba(212,175,55,0.5)' : 'none',
                    }} />

                  {/* Content */}
                  <div className={`ml-10 md:ml-0 md:w-5/12 ${i % 2 === 0 ? 'md:pr-10 md:text-right' : 'md:pl-10 md:text-left md:ml-auto'}`}>
                    <div className="glass-card p-5">
                      <span className="text-xs font-bold mb-1 block" style={{ color: m.done ? '#D4AF37' : 'rgba(255,255,255,0.3)' }}>
                        {m.date}
                      </span>
                      <h3 className="font-bold mb-1 font-grotesk text-white">{m.title}</h3>
                      <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        {m.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-sm z-10">
        <div className="max-w-4xl mx-auto">
          <div className="divider mb-12" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="badge badge-blue mb-4">Team</span>
            <h2 className="text-3xl font-bold font-grotesk">
              Core <span className="gold-text">Contributors</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TEAM.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5 text-center"
              >
                <div className="text-4xl mb-3">{member.avatar}</div>
                <p className="font-bold text-sm text-white font-grotesk mb-1">{member.name}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Links */}
      <section className="section-sm z-10">
        <div className="max-w-3xl mx-auto">
          <div className="divider mb-12" />
          <div className="glass rounded-3xl p-10 text-center" style={{ borderColor: 'rgba(212,175,55,0.2)' }}>
            <h2 className="text-2xl font-bold font-grotesk mb-6">
              Protocol <span className="gold-text">Resources</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { label: 'Whitepaper', icon: <FileText size={15} />, href: '#' },
                { label: 'Etherscan',  icon: <ExternalLink size={15} />, href: `https://etherscan.io/token/${CONTRACT}` },
                { label: 'Uniswap',   icon: <ExternalLink size={15} />, href: `https://app.uniswap.org/#/tokens/ethereum/${CONTRACT}` },
                { label: 'GitHub',    icon: <GitBranch size={15} />,  href: '#' },
              ].map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.7)',
                    }}
                  >
                    {link.icon} {link.label}
                  </button>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
