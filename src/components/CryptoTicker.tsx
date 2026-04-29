import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TOKENS = [
  { symbol: 'BTC', pair: 'BTCUSDT', name: 'Bitcoin', logo: 'https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png' },
  { symbol: 'ETH', pair: 'ETHUSDT', name: 'Ethereum', logo: 'https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png' },
  { symbol: 'BNB', pair: 'BNBUSDT', name: 'Binance Coin', logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/info/logo.png' },
  { symbol: 'SOL', pair: 'SOLUSDT', name: 'Solana', logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png' },
  { symbol: 'XRP', pair: 'XRPUSDT', name: 'XRP', logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ripple/info/logo.png' },
  { symbol: 'ADA', pair: 'ADAUSDT', name: 'Cardano', logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/cardano/info/logo.png' },
  { symbol: 'DOGE', pair: 'DOGEUSDT', name: 'Dogecoin', logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/doge/info/logo.png' }
];

const CryptoTicker = () => {
  const [prices, setPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const pairs = TOKENS.map(t => `"${t.pair}"`).join(',');
        const url = `https://api.binance.com/api/v3/ticker/price?symbols=[${pairs}]`;
        const res = await fetch(url);
        const data = await res.json();
        
        if (Array.isArray(data)) {
          const newPrices: Record<string, number> = {};
          data.forEach((item: any) => {
            const token = TOKENS.find(t => t.pair === item.symbol);
            if (token) {
              newPrices[token.symbol] = parseFloat(item.price);
            }
          });
          setPrices(newPrices);
        }
      } catch (err) {
        console.error('Failed to fetch Binance prices', err);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      width: '100%',
      overflow: 'hidden',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      background: 'rgba(5,5,15,0.6)',
      backdropFilter: 'blur(10px)',
      padding: '12px 0',
      position: 'relative'
    }}>
      <motion.div 
        animate={{ x: ['0%', '-50%'] }}
        transition={{ ease: 'linear', duration: 25, repeat: Infinity }}
        style={{ display: 'flex', width: 'max-content' }}
      >
        {/* Render the list twice to create a seamless loop */}
        {[...TOKENS, ...TOKENS].map((token, index) => (
          <div key={`${token.symbol}-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 32px' }}>
            <img src={token.logo} alt={token.symbol} style={{ width: 24, height: 24, borderRadius: '50%' }} />
            <span style={{ fontWeight: 600, color: 'white', fontSize: '14px' }}>{token.symbol}</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontVariantNumeric: 'tabular-nums' }}>
              ${prices[token.symbol] ? prices[token.symbol].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: prices[token.symbol] < 1 ? 4 : 2 }) : '...'}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default CryptoTicker;
