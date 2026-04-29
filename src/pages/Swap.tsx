import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, RefreshCw, ExternalLink, Wallet } from 'lucide-react';
import { ethers } from 'ethers';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import CustomSwapWidget from '../components/swap/CustomSwapWidget';

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
      if (typeof window !== 'undefined' && window.ethereum) {
        providerToUse = window.ethereum;
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
    <div style={{ position: 'relative', zIndex: 1, minHeight: 'calc(100vh - 64px)', padding: '40px 24px' }}>
      <div className="page-bg" />
      
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Custom Uniswap UI */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <CustomSwapWidget />
          </div>

          {/* ── Token Price Display ────────────────────────── */}
          <div className="card" style={{ 
            padding: '20px', borderRadius: '20px', 
            background: 'rgba(19, 19, 31, 0.6)', border: '1px solid var(--border)',
            backdropFilter: 'blur(12px)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={16} color="var(--purple-500)" />
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>LIAISON Price</span>
              </div>
              <button 
                onClick={fetchPrices} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
              >
                <RefreshCw size={12} style={{ animation: priceLoading ? 'spin-slow 1s linear infinite' : 'none' }} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: 'white', fontVariantNumeric: 'tabular-nums' }}>
                ${liaisonPrice < 0.01 ? liaisonPrice.toFixed(5) : liaisonPrice.toFixed(4)}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>USD</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '12px' }}>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Market Cap (est.)</p>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'white', fontVariantNumeric: 'tabular-nums' }}>
                  ${(liaisonPrice * 1_000_000).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '12px' }}>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Total Supply</p>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>1,000,000</p>
              </div>
            </div>

            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
              <a href={`https://etherscan.io/token/${LIAISON_TOKEN.address}`} target="_blank" rel="noreferrer" 
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'none' }}>
                Etherscan <ExternalLink size={10} />
              </a>
              <a href={`https://dexscreener.com/ethereum/${LIAISON_TOKEN.address}`} target="_blank" rel="noreferrer"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'none' }}>
                DexScreener <ExternalLink size={10} />
              </a>
              <a href={uniswapDirectUrl} target="_blank" rel="noreferrer"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'none' }}>
                Uniswap <ExternalLink size={10} />
              </a>
            </div>

            <button 
              onClick={addTokenToWallet}
              style={{ width: '100%', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '10px', background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.3)', fontSize: '13px', fontWeight: 600, color: '#c4b5fd', cursor: 'pointer', transition: 'all 0.2s ease' }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(124, 58, 237, 0.2)'; e.currentTarget.style.color = '#fff'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(124, 58, 237, 0.1)'; e.currentTarget.style.color = '#c4b5fd'; }}
            >
              <Wallet size={14} /> Add Liaison to Wallet
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Swap;
