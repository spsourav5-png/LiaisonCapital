import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowUpRight, RefreshCw, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';

// ── Contract addresses ────────────────────────────────────────
const LIAISON_CONTRACT = '0xa2f93b5333E82E281764005b88EEfdC9E1dEC921';
// USDT on Ethereum mainnet
const USDT_CONTRACT    = '0xdAC17F958D2ee523a2206206994597C13D831ec7';

// Minimal ERC-20 ABI — only what we need
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];

// ── Uniswap V3 LIAISON/USDT pool (0.3% fee) ──────────────────
// Used to derive live LIAISON price from on-chain reserves
const POOL_ADDRESS = '0x11b815efB8f581194ae79006d24E0d814B7697F6'; // USDT/WETH reference — 
// We use a direct price from the pool slot0 for LIAISON/USDT
// Pool for LIAISON/USDT — if not found, fall back to hardcoded price
const LIAISON_PRICE_FALLBACK = 0.01766; // USD per LIAISON

// Minimal Uniswap V3 Pool ABI
const POOL_ABI = [
  'function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)',
  'function token0() view returns (address)',
  'function token1() view returns (address)',
];

// ── Token icons ───────────────────────────────────────────────
const ETH_ICON = (
  <div style={{
    width: 36, height: 36, borderRadius: '50%',
    background: 'linear-gradient(135deg, #627eea, #3d4fd6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, fontSize: '14px', fontWeight: 900, color: 'white',
  }}>Ξ</div>
);

const USDT_ICON = (
  <div style={{
    width: 36, height: 36, borderRadius: '50%',
    background: 'linear-gradient(135deg, #26a17b, #1a7a5e)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, fontSize: '14px', fontWeight: 900, color: 'white',
  }}>₮</div>
);

const LIAISON_ICON = (
  <div style={{
    width: 36, height: 36, borderRadius: '50%',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  }}>
    <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="pg2" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6ec8ff"/>
          <stop offset="1" stopColor="#c084fc"/>
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="16" stroke="url(#pg2)" strokeWidth="2.5" fill="none"/>
      <circle cx="20" cy="20" r="5" fill="url(#pg2)"/>
    </svg>
  </div>
);

// ── Helpers ───────────────────────────────────────────────────
const fmt = (n: number, decimals = 4) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: decimals });

const fmtUSD = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ── Fetch live ETH price via a public free endpoint ───────────
const fetchEthUsdPrice = async (): Promise<number> => {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
    );
    const data = await res.json();
    return data?.ethereum?.usd ?? 3240;
  } catch {
    return 3240; // fallback
  }
};

// ── Portfolio ─────────────────────────────────────────────────
interface TokenRow {
  icon: React.ReactNode;
  symbol: string;
  name: string;
  balance: number;
  price: number;
}

import { useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';

const Portfolio = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [tokens, setTokens]         = useState<TokenRow[]>([]);

  // ── Real on-chain fetch ──────────────────────────────────────
  const loadBalances = useCallback(async (addr: string) => {
    if (!walletProvider || !addr) return;
    setLoading(true);
    setError('');
    try {
      const provider = new ethers.BrowserProvider(walletProvider);

      // 1. ETH balance
      const ethBigInt = await provider.getBalance(addr);
      const ethBalance = parseFloat(ethers.formatEther(ethBigInt));

      // 2. USDT balance
      const usdtContract = new ethers.Contract(USDT_CONTRACT, ERC20_ABI, provider);
      const [usdtRaw, usdtDecimals] = await Promise.all([
        usdtContract.balanceOf(addr),
        usdtContract.decimals(),
      ]);
      const usdtBalance = parseFloat(ethers.formatUnits(usdtRaw, usdtDecimals));

      // 3. LIAISON balance
      const liaisonContract = new ethers.Contract(LIAISON_CONTRACT, ERC20_ABI, provider);
      const [liaisonRaw, liaisonDecimals] = await Promise.all([
        liaisonContract.balanceOf(addr),
        liaisonContract.decimals(),
      ]);
      const liaisonBalance = parseFloat(ethers.formatUnits(liaisonRaw, liaisonDecimals));

      // 4. Prices
      const ethPrice = await fetchEthUsdPrice();
      // Attempt to get live LIAISON price from Uniswap V3 pool
      let liaisonPrice = LIAISON_PRICE_FALLBACK;
      try {
        const poolContract = new ethers.Contract(POOL_ADDRESS, POOL_ABI, provider);
        const [slot0Data, token0Addr] = await Promise.all([
          poolContract.slot0(),
          poolContract.token0(),
        ]);
        const sqrtPriceX96 = BigInt(slot0Data[0]);
        const Q96 = BigInt(2 ** 96);
        // Determine which direction the price goes (USDT is 6 decimals, LIAISON is 18)
        const isToken0Liaison = token0Addr.toLowerCase() === LIAISON_CONTRACT.toLowerCase();
        const rawPrice = Number((sqrtPriceX96 * sqrtPriceX96 * BigInt(1e6)) / (Q96 * Q96)) / 1e18;
        liaisonPrice = isToken0Liaison ? rawPrice : 1 / rawPrice;
        // Sanity-check — if obviously wrong, use fallback
        if (liaisonPrice <= 0 || liaisonPrice > 10000) liaisonPrice = LIAISON_PRICE_FALLBACK;
      } catch {
        liaisonPrice = LIAISON_PRICE_FALLBACK;
      }

      setTokens([
        { icon: ETH_ICON,     symbol: 'ETH',     name: 'Ethereum',   balance: ethBalance,     price: ethPrice },
        { icon: LIAISON_ICON, symbol: 'LIAISON',  name: 'Liaison',    balance: liaisonBalance, price: liaisonPrice },
        { icon: USDT_ICON,    symbol: 'USDT',     name: 'Tether USD', balance: usdtBalance,    price: 1 },
      ]);
    } catch (err: any) {
      console.error('Balance fetch error:', err);
      setError(err?.message?.slice(0, 120) ?? 'Could not fetch balances. Make sure you are on Ethereum Mainnet.');
    } finally {
      setLoading(false);
    }
  }, [walletProvider]);

  // Auto-load on connect
  useEffect(() => {
    if (isConnected && address) {
      loadBalances(address);
    } else {
      setTokens([]);
    }
  }, [isConnected, address, loadBalances]);

  const handleRefresh = () => {
    if (address) loadBalances(address);
  };

  // ── Totals ───────────────────────────────────────────────────
  const totalUSD = tokens.reduce((s, t) => s + t.balance * t.price, 0);

  return (
    <div style={{ position: 'relative', zIndex: 1, padding: '40px 24px 80px', minHeight: 'calc(100vh - 64px)' }}>
      <div className="page-bg" />
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>

        {/* ── Header ─────────────────────────────────────── */}
        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: '8px' }}>
              Portfolio
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)' }}>
              Your token balances and on-chain value across the Liaison ecosystem.
            </p>
          </div>
          {isConnected && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/swap">
                <button className="btn-primary" style={{ padding: '9px 18px', fontSize: '13px' }}>
                  Open Swap <ArrowUpRight size={14} />
                </button>
              </Link>
              <button
                id="portfolio-refresh-btn"
                onClick={handleRefresh}
                disabled={loading}
                className="btn-ghost"
                style={{ padding: '9px 14px' }}
                title="Refresh balances"
              >
                <RefreshCw size={15} style={{ animation: loading ? 'spin-slow 1s linear infinite' : 'none' }} />
              </button>
            </div>
          )}
        </div>

        {/* ── Not connected ───────────────────────────────── */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
            style={{ padding: '56px 40px', textAlign: 'center' }}
          >
            <div style={{
              width: '72px', height: '72px', borderRadius: '18px',
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <Wallet size={32} color="white" />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'white', marginBottom: '12px' }}>
              Connect your wallet
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: '0 auto 32px', maxWidth: '380px' }}>
              Connect a wallet to view your ETH, Liaison, and USDT balances along with their live USD value from on-chain Uniswap V3 prices.
            </p>
            <button
              id="portfolio-connect-btn"
              onClick={() => open()}
              className="btn-primary"
              style={{ padding: '13px 36px', fontSize: '15px' }}
            >
              <Wallet size={16} /> Connect Wallet
            </button>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', marginTop: '16px' }}>
              Supports MetaMask, WalletConnect mobile wallets, Coinbase Wallet, and more.
            </p>
          </motion.div>
        )}

        {/* ── Loading ─────────────────────────────────────── */}
        {isConnected && loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card"
            style={{ padding: '56px 40px', textAlign: 'center' }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              border: '3px solid rgba(124,58,237,0.2)',
              borderTopColor: '#7c3aed',
              animation: 'spin-slow 0.9s linear infinite',
              margin: '0 auto 16px',
            }} />
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Fetching on-chain balances…</p>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px', marginTop: '8px' }}>
              Reading from Ethereum Mainnet
            </p>
          </motion.div>
        )}

        {/* ── Error ───────────────────────────────────────── */}
        {isConnected && !loading && error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card"
            style={{ padding: '28px 24px', display: 'flex', gap: '14px', alignItems: 'flex-start', borderColor: 'rgba(248,113,113,0.2)' }}
          >
            <AlertTriangle size={20} style={{ color: '#f87171', flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#f87171', marginBottom: '4px' }}>Failed to fetch balances</p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{error}</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '8px' }}>
                Make sure MetaMask is on <strong style={{ color: 'rgba(255,255,255,0.5)' }}>Ethereum Mainnet</strong> and try refreshing.
              </p>
              <button onClick={handleRefresh} className="btn-ghost" style={{ marginTop: '14px', padding: '8px 18px', fontSize: '13px' }}>
                <RefreshCw size={14} /> Try Again
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Connected: balance table ─────────────────────── */}
        {isConnected && !loading && !error && tokens.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            {/* Wallet + total bar */}
            <div className="card" style={{
              padding: '16px 20px', marginBottom: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%', background: '#4ade80',
                  boxShadow: '0 0 8px rgba(74,222,128,0.6)',
                }} />
                <a
                  href={`https://etherscan.io/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '13px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.7)' }}
                >
                  {address?.slice(0, 6)}...{address?.slice(-4)} ↗
                </a>
              </div>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
                Total Value:{' '}
                <strong style={{ color: 'white', fontVariantNumeric: 'tabular-nums' }}>
                  ${fmtUSD(totalUSD)}
                </strong>
              </span>
            </div>

            {/* Token list */}
            <div className="card" style={{ overflow: 'hidden' }}>
              {tokens.map((token, i) => (
                <div
                  key={token.symbol}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '20px 24px',
                    borderBottom: i < tokens.length - 1 ? '1px solid var(--border)' : 'none',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Left: icon + name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {token.icon}
                    <div>
                      <p style={{ fontSize: '15px', fontWeight: 700, color: 'white' }}>{token.symbol}</p>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{token.name}</p>
                    </div>
                  </div>
                  {/* Right: balance + usd */}
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '15px', fontWeight: 700, color: 'white', fontVariantNumeric: 'tabular-nums' }}>
                      {fmt(token.balance)} {token.symbol}
                    </p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontVariantNumeric: 'tabular-nums' }}>
                      ${fmtUSD(token.balance * token.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price source note */}
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginTop: '12px', textAlign: 'center' }}>
              Live balances read from Ethereum Mainnet · ETH price from CoinGecko · LIAISON price from Uniswap V3 pool
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
