import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ExternalLink, Wallet, BarChart3, ShieldCheck, Shield, Coins } from 'lucide-react';
import { ethers } from 'ethers';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import CustomSwapWidget from '../components/swap/CustomSwapWidget';
import LiaisonChart from '../components/LiaisonChart';

const GECKO_TERMINAL_URL = 'https://www.geckoterminal.com/eth/pools/0xe9e3ebbc23869de7624dd37eb7f23f43fb1704ff938328b6f8db24808f70c236';

const LIAISON_TOKEN = {
  address: '0x61481d83965a494773087628874a2f8d44c27cc2',
};


const Swap = () => {
  const [liaisonPrice, setLiaisonPrice] = useState(1.4490);
  const [priceLoading, setPriceLoading] = useState(true);
  const { walletProvider } = useWeb3ModalProvider();

  // ── Fetch live price from GeckoTerminal public REST API ───
  const fetchPrices = useCallback(async () => {
    setPriceLoading(true);
    try {
      const res = await fetch(
        'https://api.geckoterminal.com/api/v2/networks/eth/pools/0xe9e3ebbc23869de7624dd37eb7f23f43fb1704ff938328b6f8db24808f70c236',
        { headers: { Accept: 'application/json;version=20230302' } }
      );
      if (!res.ok) throw new Error(`GeckoTerminal API error: ${res.status}`);
      const json = await res.json();
      const rawPrice = json?.data?.attributes?.base_token_price_usd;
      if (rawPrice) {
        setLiaisonPrice(parseFloat(rawPrice));
      } else {
        throw new Error('Price field missing in GeckoTerminal response');
      }
    } catch (err: unknown) {
      console.error('Failed to fetch price from GeckoTerminal:', err);
    }
    setPriceLoading(false);
  }, []);

  const addTokenToWallet = async () => {
    try {
      const providerToUse = (window as unknown as { ethereum?: ethers.Eip1193Provider }).ethereum || walletProvider;
      
      if (!providerToUse || typeof providerToUse.request !== 'function') {
        alert("No compatible Web3 wallet detected. Please connect your wallet first.");
        return;
      }

      await providerToUse.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: LIAISON_TOKEN.address,
            symbol: 'LIA',
            decimals: 18,
          },
        },
      });
      
    } catch (err: unknown) {
      const error = err as { code?: number, message?: string };
      console.error('Failed to add token to wallet', error);
      if (error?.code === 4001) {
        return;
      }
      const errMsg = error?.message || String(error);
      alert(`Could not add token automatically. Error: ${errMsg}\n\nPlease add it manually using address: ${LIAISON_TOKEN.address}`);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  const USDT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
  const uniswapDirectUrl = `https://app.uniswap.org/swap?chain=mainnet&inputCurrency=${USDT_ADDRESS}&outputCurrency=${LIAISON_TOKEN.address}`;

  return (
    <div style={{ position: 'relative', zIndex: 1, minHeight: 'calc(100vh - 72px)', padding: '60px 24px' }}>
      <div className="page-bg" />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Left Side: Intelligence & Chart */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ marginBottom: '32px' }}>
              <LiaisonChart />
            </div>

            {/* Token Intelligence Card */}
            <div className="card" style={{ 
              padding: '24px', borderRadius: '28px', 
              background: 'rgba(10, 10, 10, 0.7)', border: '1px solid var(--border-md)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <BarChart3 size={18} style={{ color: 'var(--gold-primary)' }} />
                  <span style={{ fontSize: '14px', fontWeight: 800, color: 'white', letterSpacing: '0.02em', textTransform: 'uppercase' }}>Protocol Market Intel</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <a
                    href={GECKO_TERMINAL_URL}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      fontSize: '10px', fontWeight: 800, color: '#00c57a',
                      background: 'rgba(0, 197, 122, 0.08)',
                      border: '1px solid rgba(0, 197, 122, 0.25)',
                      padding: '4px 8px', borderRadius: '8px',
                      textDecoration: 'none', letterSpacing: '0.05em',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0, 197, 122, 0.15)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0, 197, 122, 0.08)')}
                    title="View on GeckoTerminal"
                  >
                    🦎 GeckoTerminal <ExternalLink size={10} />
                  </a>
                  <button
                    onClick={fetchPrices}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text-secondary)', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <RefreshCw size={14} className={priceLoading ? 'animate-spin-slow' : ''} />
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <span style={{
                  fontSize: '10px', fontWeight: 800, color: '#00c57a',
                  background: 'rgba(0, 197, 122, 0.08)',
                  border: '1px solid rgba(0, 197, 122, 0.2)',
                  padding: '2px 8px', borderRadius: '6px',
                  letterSpacing: '0.08em', textTransform: 'uppercase'
                }}>
                  ✦ CoinGecko Price
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '24px' }}>
                <span style={{ fontSize: '36px', fontWeight: 900, color: 'white', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
                  ${liaisonPrice < 0.01 ? liaisonPrice.toFixed(5) : liaisonPrice.toFixed(4)}
                </span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gold-primary)' }}>LIA / USD</span>
              </div>

              <div style={{ gridTemplateColumns: '1fr 1fr', display: 'grid', gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '16px', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Market Cap (est.)</p>
                  <p style={{ fontSize: '16px', fontWeight: 800, color: 'white', fontVariantNumeric: 'tabular-nums' }}>
                    ${(liaisonPrice * 1_000_000).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '16px', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Liquidity Pool</p>
                  <p style={{ fontSize: '16px', fontWeight: 800, color: 'white' }}>$4.2M Locked</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '20px' }}>
                {[
                  { label: 'Etherscan', href: `https://etherscan.io/token/${LIAISON_TOKEN.address}`, gecko: false },
                  { label: 'DexScreener', href: `https://dexscreener.com/ethereum/${LIAISON_TOKEN.address}`, gecko: false },
                  { label: 'Uniswap', href: uniswapDirectUrl, gecko: false },
                  { label: 'Binance', href: `https://web3.binance.com/en-IN/token/eth/${LIAISON_TOKEN.address.toLowerCase()}`, gecko: false },
                  { label: 'Trust Wallet', href: `https://link.trustwallet.com/browser?url=${encodeURIComponent(window.location.href)}`, gecko: false },
                  { label: '🦎 GeckoTerminal', href: GECKO_TERMINAL_URL, gecko: true },
                ].map(link => (
                  <a key={link.label} href={link.href} target="_blank" rel="noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      padding: '10px', borderRadius: '12px',
                      background: link.gecko ? 'rgba(0, 197, 122, 0.05)' : 'rgba(255,255,255,0.02)',
                      border: link.gecko ? '1px solid rgba(0, 197, 122, 0.3)' : '1px solid var(--border)',
                      fontSize: '12px',
                      color: link.gecko ? '#00c57a' : 'var(--text-secondary)',
                      cursor: 'pointer', textDecoration: 'none', fontWeight: 600, transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = link.gecko ? '#00c57a' : 'var(--gold-primary)';
                      if (link.gecko) e.currentTarget.style.background = 'rgba(0, 197, 122, 0.12)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = link.gecko ? 'rgba(0, 197, 122, 0.3)' : 'var(--border)';
                      if (link.gecko) e.currentTarget.style.background = 'rgba(0, 197, 122, 0.05)';
                    }}
                  >
                    {link.label} <ExternalLink size={12} />
                  </a>
                ))}
              </div>

              <button 
                onClick={addTokenToWallet}
                style={{ 
                  width: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '10px', 
                  padding: '14px', 
                  borderRadius: '16px', 
                  background: 'rgba(212, 175, 55, 0.05)', 
                  border: '1px solid var(--border-gold)', 
                  fontSize: '14px', 
                  fontWeight: 800, 
                  color: 'var(--gold-primary)', 
                  cursor: 'pointer', 
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '12px'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)'; e.currentTarget.style.boxShadow = '0 0 20px var(--gold-glow)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <Wallet size={16} /> Add LIA to Institutional Wallet
              </button>

              <a 
                href="https://app.unvest.io/projects/1/0x61481d83965a494773087628874a2f8d44c27cc2/staking-pools/0xbb5cacceaefb51134a91ded8bee8473ee95626b2"
                target="_blank"
                rel="noreferrer"
                style={{ 
                  width: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '10px', 
                  padding: '14px', 
                  borderRadius: '16px', 
                  background: 'linear-gradient(135deg, var(--gold-primary), #b8972f)', 
                  border: 'none', 
                  fontSize: '14px', 
                  fontWeight: 800, 
                  color: 'black', 
                  cursor: 'pointer', 
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.boxShadow = '0 0 20px var(--gold-glow)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <Coins size={16} /> Access Liaison Staking Pool
              </a>
            </div>
          </motion.div>

          {/* Right Side: Swap Widget */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <CustomSwapWidget />
            
            {/* Institutional Alternatives Card */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                marginTop: '24px',
                width: '100%',
                maxWidth: '440px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-md)',
                borderRadius: '24px',
                padding: '24px',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Institutional Hubs</span>
                <span style={{ fontSize: '10px', color: 'var(--gold-primary)', fontWeight: 800, background: 'rgba(212, 175, 55, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>OFFICIAL PARTNERS</span>
              </div>

              {/* Binance Option */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ background: '#F3BA2F', width: '18px', height: '18px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '9px', fontWeight: 900, color: 'black' }}>B</span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>Binance Web3 Portal</span>
                </div>
                <a 
                  href="https://web3.binance.com/en-IN/token/eth/0x61481d83965a494773087628874a2f8d44c27cc2"
                  target="_blank"
                  rel="noreferrer"
                  style={{ 
                    background: '#F3BA2F', color: 'black', padding: '10px', borderRadius: '12px', 
                    textAlign: 'center', fontWeight: 900, fontSize: '12px', textDecoration: 'none',
                    textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.1)')}
                  onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
                >
                  Buy from Binance
                </a>
              </div>

              <div style={{ height: '1px', background: 'var(--border)', opacity: 0.5 }} />

              {/* Trust Wallet Option */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ background: '#3375BB', width: '18px', height: '18px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Shield size={10} color="white" />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>Trust Wallet Node</span>
                </div>
                <a 
                  href={`https://link.trustwallet.com/browser?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ 
                    background: '#3375BB', color: 'white', padding: '10px', borderRadius: '12px', 
                    textAlign: 'center', fontWeight: 900, fontSize: '12px', textDecoration: 'none',
                    textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.1)')}
                  onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
                >
                  Open in Trust Wallet
                </a>
              </div>
            </motion.div>
            
            <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: 0.6 }}>
              <ShieldCheck size={14} style={{ color: 'var(--gold-primary)' }} />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Secure Algorithmic Portal</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Swap;
