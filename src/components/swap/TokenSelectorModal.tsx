import React, { useState } from 'react';
import { Search, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoUrl?: string;
}

const COMMON_TOKENS: Token[] = [
  { symbol: 'ETH', name: 'Ether', address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', decimals: 18, logoUrl: 'https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png' },
  { symbol: 'USDT', name: 'Tether USD', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, logoUrl: 'https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png' },
  { symbol: 'LIAISON', name: 'Liaison', address: '0xa2f93b5333E82E281764005b88EEfdC9E1dEC921', decimals: 18 },
  { symbol: 'WBTC', name: 'Wrapped BTC', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', decimals: 8, logoUrl: 'https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png' },
  { symbol: 'USDC', name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, logoUrl: 'https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png' },
];

interface TokenSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
  selectedToken?: Token | null;
}

const TokenSelectorModal: React.FC<TokenSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedToken,
}) => {
  const [search, setSearch] = useState('');

  const filteredTokens = COMMON_TOKENS.filter(t => 
    t.symbol.toLowerCase().includes(search.toLowerCase()) || 
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.address.toLowerCase() === search.toLowerCase()
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(5, 5, 15, 0.85)', backdropFilter: 'blur(8px)' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '420px',
              background: '#13131f',
              border: '1px solid var(--border-md)',
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '80vh',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ padding: '20px 24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'white' }}>Select a token</h3>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Search */}
            <div style={{ padding: '0 24px 16px' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search name or paste address"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-md)',
                    borderRadius: '16px',
                    padding: '12px 12px 12px 48px',
                    color: 'white',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--purple-600)'}
                  onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border-md)'}
                />
              </div>
            </div>

            {/* Common Tokens */}
            <div style={{ padding: '0 24px 16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {COMMON_TOKENS.slice(0, 5).map(t => (
                <button
                  key={t.symbol}
                  onClick={() => onSelect(t)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-md)',
                    borderRadius: '10px',
                    padding: '6px 10px',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                    (e.target as HTMLElement).style.borderColor = 'var(--purple-600)';
                  }}
                  onMouseLeave={e => {
                    (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                    (e.target as HTMLElement).style.borderColor = 'var(--border-md)';
                  }}
                >
                  {t.logoUrl ? <img src={t.logoUrl} style={{ width: '20px', height: '20px', borderRadius: '50%' }} alt="" /> : <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--purple-600)', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t.symbol[0]}</div>}
                  {t.symbol}
                </button>
              ))}
            </div>

            <div style={{ height: '1px', background: 'var(--border)', margin: '0 24px' }} />

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
              {filteredTokens.length > 0 ? (
                filteredTokens.map(t => (
                  <button
                    key={t.address}
                    onClick={() => onSelect(t)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {t.logoUrl ? (
                        <img src={t.logoUrl} style={{ width: '36px', height: '36px', borderRadius: '50%' }} alt="" />
                      ) : (
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--purple-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600 }}>
                          {t.symbol[0]}
                        </div>
                      )}
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ color: 'white', fontWeight: 600, fontSize: '15px' }}>{t.symbol}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{t.name}</div>
                      </div>
                    </div>
                    {selectedToken?.address === t.address && <Check size={18} color="var(--purple-500)" />}
                  </button>
                ))
              ) : (
                <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No tokens found.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TokenSelectorModal;
