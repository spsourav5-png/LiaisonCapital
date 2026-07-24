import { Settings, ExternalLink } from 'lucide-react';

export default function CustomSwapWidget() {
  // Transit Finance Web Widget URL targeting Ethereum, default USDT -> LIA
  const transitWidgetUrl = 'https://swap.transit.finance/?inputChain=ETH&outputChain=ETH&inputCurrency=0xdAC17F958D2ee523a2206206994597C13D831ec7&outputCurrency=0x61481d83965a494773087628874a2f8d44c27cc2';

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-md)',
      borderRadius: '28px',
      padding: '24px',
      width: '100%',
      maxWidth: '440px',
      boxShadow: '0 24px 80px rgba(0, 0, 0, 0.7)',
      position: 'relative',
      zIndex: 1,
      backdropFilter: 'blur(20px)',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>Institutional Swap</h3>
        <button className="btn-ghost" style={{ padding: '8px', borderRadius: '12px', minWidth: 'auto', border: 'none', background: 'rgba(255,255,255,0.03)' }}>
          <Settings size={18} style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>

      <div style={{
        width: '100%',
        height: '600px',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.05)',
        background: '#0d1117' // Default dark bg for better blending
      }}>
        <iframe
          src={transitWidgetUrl}
          width="100%"
          height="100%"
          style={{ border: 'none', minHeight: '600px' }}
          title="Transit Finance Widget"
          allow="clipboard-read; clipboard-write"
        />
      </div>

      <div style={{ textAlign: 'center' }}>
        <a href="https://app.uniswap.org/swap?chain=mainnet&inputCurrency=0xdAC17F958D2ee523a2206206994597C13D831ec7&outputCurrency=0x61481d83965a494773087628874a2f8d44c27cc2&value=1&field=input" target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: 'var(--gold-primary)', textDecoration: 'none', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: 0.6 }}>
          EXTERNAL LIQUIDITY PATH <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
