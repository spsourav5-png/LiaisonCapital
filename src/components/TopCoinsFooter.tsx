import { useState, useEffect, useRef } from 'react';

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap_rank: number;
}

const COINGECKO_API = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false&price_change_percentage=24h';

const TopCoinsFooter = () => {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch(COINGECKO_API);
        if (!res.ok) throw new Error(`CoinGecko API error: ${res.status}`);
        const data: CoinData[] = await res.json();
        setCoins(data);
        setError(false);
      } catch (err) {
        console.error('Failed to fetch top coins:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
    const interval = setInterval(fetchCoins, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number): string => {
    if (price >= 1000) return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (price >= 1) return price.toFixed(2);
    if (price >= 0.01) return price.toFixed(4);
    return price.toFixed(6);
  };

  const formatChange = (change: number | null): string => {
    if (change === null || change === undefined) return '0.00';
    return Math.abs(change).toFixed(2);
  };

  if (loading) {
    return (
      <div style={{
        width: '100%',
        overflow: 'hidden',
        borderTop: '1px solid var(--border)',
        background: 'rgba(5, 5, 10, 0.95)',
        backdropFilter: 'blur(16px)',
        padding: '14px 0',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: '0 24px',
        }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: 'var(--gold-primary)',
            animation: 'pulse-gold 1.5s infinite',
          }} />
          <span style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            letterSpacing: '0.05em',
          }}>
            Loading market data...
          </span>
        </div>
      </div>
    );
  }

  if (error || coins.length === 0) return null;

  // Duplicate the list for seamless infinite scroll
  const duplicatedCoins = [...coins, ...coins];

  return (
    <div style={{
      width: '100%',
      overflow: 'hidden',
      borderTop: '1px solid var(--border)',
      background: 'linear-gradient(180deg, rgba(5, 5, 10, 0.95) 0%, rgba(10, 10, 15, 0.98) 100%)',
      backdropFilter: 'blur(16px)',
      position: 'relative',
    }}>
      {/* GeckoTerminal Attribution Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '10px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
      }}>
        <span style={{
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--text-muted)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          Market Data Powered by
        </span>
        <a
          href="https://www.geckoterminal.com"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none',
            transition: 'all 0.3s',
            opacity: 0.8,
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '0.8'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {/* GeckoTerminal Logo — official gecko mascot */}
          <img
            src="/geckoterminal-logo.svg"
            alt="GeckoTerminal"
            style={{
              width: 24,
              height: 24,
              borderRadius: '6px',
              flexShrink: 0,
            }}
          />
          <span style={{
            fontSize: '13px',
            fontWeight: 800,
            letterSpacing: '-0.01em',
          }}>
            <span style={{ color: '#7556F6' }}>Gecko</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Terminal</span>
          </span>
        </a>
        <span style={{
          fontSize: '11px',
          color: 'var(--text-muted)',
          fontWeight: 500,
        }}>
          &
        </span>
        <a
          href="https://www.coingecko.com"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            textDecoration: 'none',
            transition: 'all 0.3s',
            opacity: 0.8,
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '0.8'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="#8DC63F" fillOpacity="0.15" stroke="#8DC63F" strokeWidth="1"/>
            <circle cx="12" cy="13" r="2.5" fill="#8DC63F"/>
            <circle cx="12" cy="13" r="1" fill="white"/>
            <circle cx="20" cy="14" r="2" fill="#8DC63F"/>
            <path d="M10 20c1.5 2 3.5 3 6 3s4.5-1 6-3" stroke="#8DC63F" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span style={{
            fontSize: '12px',
            fontWeight: 800,
            color: '#8DC63F',
            letterSpacing: '-0.01em',
          }}>
            CoinGecko
          </span>
        </a>
      </div>

      {/* Scrolling coins ticker */}
      <div
        ref={scrollRef}
        style={{
          padding: '12px 0',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Gradient fade edges */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '60px',
          background: 'linear-gradient(90deg, rgba(5,5,10,0.98) 0%, transparent 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '60px',
          background: 'linear-gradient(270deg, rgba(5,5,10,0.98) 0%, transparent 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }} />

        <div
          className="coins-scroll-track"
          style={{
            display: 'flex',
            width: 'max-content',
            animation: 'scroll-coins 90s linear infinite',
          }}
        >
          {duplicatedCoins.map((coin, index) => {
            const isPositive = (coin.price_change_percentage_24h ?? 0) >= 0;
            return (
              <div
                key={`${coin.id}-${index}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '6px 24px',
                  borderRight: '1px solid rgba(255,255,255,0.03)',
                  transition: 'background 0.2s',
                  cursor: 'default',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                {/* Rank */}
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  minWidth: '16px',
                  textAlign: 'right',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {coin.market_cap_rank}
                </span>

                {/* Coin icon */}
                <img
                  src={coin.image}
                  alt={coin.name}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    flexShrink: 0,
                  }}
                  loading="lazy"
                />

                {/* Symbol */}
                <span style={{
                  fontWeight: 700,
                  color: 'white',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                }}>
                  {coin.symbol}
                </span>

                {/* Price */}
                <span style={{
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: 500,
                  fontVariantNumeric: 'tabular-nums',
                  fontFamily: "'Inter', monospace",
                }}>
                  ${formatPrice(coin.current_price)}
                </span>

                {/* 24h Change */}
                <span style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: isPositive ? '#4ade80' : '#f87171',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: isPositive ? 'rgba(74, 222, 128, 0.08)' : 'rgba(248, 113, 113, 0.08)',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {isPositive ? '▲' : '▼'} {formatChange(coin.price_change_percentage_24h)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopCoinsFooter;
