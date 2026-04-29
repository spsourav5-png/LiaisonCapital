import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, RefreshCw, ExternalLink, Wallet, BarChart3, ShieldCheck } from 'lucide-react';
import { ethers } from 'ethers';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import CustomSwapWidget from '../components/swap/CustomSwapWidget';
import LiaisonChart from '../components/LiaisonChart';

const LIAISON_TOKEN = {
  address: '0xa2f93b5333E82E281764005b88EEfdC9E1dEC921',
};

const USDT_TOKEN = {
  address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
};

const Swap = () => {
  const [liaisonPrice, setLiaisonPrice] = useState(0.01766);
  const [priceLoading, setPriceLoading] = useState(true);
  const { walletProvider } = useWeb3ModalProvider();

  // ── Fetch live prices ──────────────────────────────────────
  const fetchPrices = useCallback(async () => {
    setPriceLoading(true);
    try {
      const p = new ethers.JsonRpcProvider("https://ethereum-rpc.publicnode.com");
      const poolAddress = "0x91D2cC80F8A26587D1858b25DD580531260D600B";
      const poolAbi = ["function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)"];
      const poolContract = new ethers.Contract(poolAddress, poolAbi, p);
      
      const slot0 = await poolContract.slot0();
      const sqrtPriceX96 = slot0[0];
      
      const price = (Number(sqrtPriceX96) / 2**96) ** 2 * 10**(18 - 6);
      
      if (price > 0) {
        setLiaisonPrice(price);
      }
    } catch (err) {
      console.error('Failed to fetch price from Uniswap pool:', err);
    }
    setPriceLoading(false);
  }, []);

  const addTokenToWallet = async () => {
    try {
      let providerToUse: any = null;
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        providerToUse = (window as any).ethereum;
      } else if (walletProvider) {
        providerToUse = walletProvider;
      }
      
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
      
    } catch (error: any) {
      console.error('Failed to add token to wallet', error);
      if (error?.code === 4001) {
        return;
      }
      const errMsg = error?.message || String(error);
      alert(`Could not add token automatically. Error: ${errMsg}\n\nPlease add it manually using address: ${LIAISON_TOKEN.address}`);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  const uniswapDirectUrl = `https://app.uniswap.org/swap?chain=mainnet&inputCurrency=${USDT_TOKEN.address}&outputCurrency=${LIAISON_TOKEN.address}`;

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
                <button 
                  onClick={fetchPrices} 
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text-secondary)', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <RefreshCw size={14} className={priceLoading ? 'animate-spin-slow' : ''} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '24px' }}>
                <span style={{ fontSize: '36px', fontWeight: 900, color: 'white', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
                  ${liaisonPrice < 0.01 ? liaisonPrice.toFixed(5) : liaisonPrice.toFixed(4)}
                </span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gold-primary)' }}>USD / LIA</span>
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
                  { label: 'Etherscan', href: `https://etherscan.io/token/${LIAISON_TOKEN.address}` },
                  { label: 'DexScreener', href: `https://dexscreener.com/ethereum/${LIAISON_TOKEN.address}` },
                  { label: 'Uniswap', href: uniswapDirectUrl },
                ].map(link => (
                  <a key={link.label} href={link.href} target="_blank" rel="noreferrer" 
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'none', fontWeight: 600, transition: 'all 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--gold-primary)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
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
                  letterSpacing: '0.05em'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)'; e.currentTarget.style.boxShadow = '0 0 20px var(--gold-glow)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <Wallet size={16} /> Add LIA to Institutional Wallet
              </button>
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
