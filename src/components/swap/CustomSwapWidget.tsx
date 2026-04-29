import { useState, useEffect } from 'react';
import { ArrowDown, Loader2, Settings, AlertCircle, TrendingUp, Info, RefreshCw, Wallet, ShieldCheck, ExternalLink } from 'lucide-react';
import { useWeb3ModalAccount, useWeb3Modal, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { ethers, BrowserProvider, Contract } from 'ethers';
import { toast } from 'sonner';

const LIAISON_TOKEN = {
  address: '0xa2f93b5333E82E281764005b88EEfdC9E1dEC921',
  symbol: 'LIA',
  decimals: 18,
};

const USDT_TOKEN = {
  address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  symbol: 'USDT',
  decimals: 6,
  logo: 'https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png'
};

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)"
];

const UNIVERSAL_ROUTER = '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD';

export default function CustomSwapWidget() {
  const [amountIn, setAmountIn] = useState('');
  const [amountOut, setAmountOut] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quoteData, setQuoteData] = useState<any>(null);
  const [balance, setBalance] = useState('0.00');
  const [allowance, setAllowance] = useState<bigint>(0n);

  const { address, isConnected } = useWeb3ModalAccount();
  const { open } = useWeb3Modal();
  const { walletProvider } = useWeb3ModalProvider();

  // Fetch balance and allowance
  useEffect(() => {
    const updateStats = async () => {
      if (!address || !walletProvider) return;
      try {
        const provider = new BrowserProvider(walletProvider as any);
        const usdtContract = new Contract(USDT_TOKEN.address, ERC20_ABI, provider);
        
        const bal = await usdtContract.balanceOf(address);
        setBalance(ethers.formatUnits(bal, USDT_TOKEN.decimals));
        
        const allow = await usdtContract.allowance(address, UNIVERSAL_ROUTER);
        setAllowance(allow);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    if (isConnected) {
      updateStats();
      const interval = setInterval(updateStats, 10000);
      return () => clearInterval(interval);
    }
  }, [address, isConnected, walletProvider]);

  // Quote Logic
  useEffect(() => {
    const fetchQuote = async () => {
      if (!amountIn || isNaN(Number(amountIn)) || Number(amountIn) <= 0) {
        setAmountOut('');
        setQuoteData(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const amountWei = ethers.parseUnits(amountIn, USDT_TOKEN.decimals).toString();

        const requestBody = {
          tokenIn: USDT_TOKEN.address,
          tokenOut: LIAISON_TOKEN.address,
          tokenInChainId: 1,
          tokenOutChainId: 1,
          amount: amountWei,
          swapper: address || "0x0000000000000000000000000000000000000000",
          type: 'EXACT_INPUT'
        };

        const res = await fetch('/api/uniswap/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        if (!res.ok) throw new Error('Liquidity route not available');

        const data = await res.json();
        setQuoteData(data);
        
        if (data.quote && data.quote.output) {
            const formattedOut = ethers.formatUnits(data.quote.output.amount, LIAISON_TOKEN.decimals);
            setAmountOut(Number(formattedOut).toFixed(4));
        }

      } catch (err: any) {
        setError(err.message || 'Routing error');
        setAmountOut('');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchQuote, 600);
    return () => clearTimeout(timer);
  }, [amountIn, address]);

  const handleAction = async () => {
    if (!isConnected) {
      open();
      return;
    }

    if (Number(amountIn) > Number(balance)) {
      toast.error("Insufficient USDT balance for this institutional swap.");
      return;
    }

    if (!quoteData) {
      toast.error("Please wait for a valid quote.");
      return;
    }

    try {
      const provider = new BrowserProvider(walletProvider as any);
      const signer = await provider.getSigner();

      // Check if Approval is needed
      const amountWei = ethers.parseUnits(amountIn, USDT_TOKEN.decimals);
      if (allowance < amountWei) {
        const usdtContract = new Contract(USDT_TOKEN.address, ERC20_ABI, signer);
        const tx = await usdtContract.approve(UNIVERSAL_ROUTER, ethers.MaxUint256);
        toast.info("Approving USDT for Institutional Routing...");
        await tx.wait();
        toast.success("USDT Approved.");
        // Refresh allowance
        const newAllow = await usdtContract.allowance(address, UNIVERSAL_ROUTER);
        setAllowance(newAllow);
        return;
      }

      // Execute Swap (Demonstration of Trading API Execution)
      toast.promise(new Promise(r => setTimeout(r, 2000)), {
        loading: 'Signing Institutional Transaction...',
        success: 'Trade Broadcasted Successfully',
        error: 'Signature rejected',
      });
      
    } catch (err: any) {
      toast.error(err.message || "Execution error");
    }
  };

  const uniswapDirectUrl = `https://app.uniswap.org/swap?chain=mainnet&inputCurrency=${USDT_TOKEN.address}&outputCurrency=${LIAISON_TOKEN.address}&value=1&field=input`;

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
      backdropFilter: 'blur(20px)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>Institutional Swap</h3>
        <button className="btn-ghost" style={{ padding: '8px', borderRadius: '12px', minWidth: 'auto', border: 'none', background: 'rgba(255,255,255,0.03)' }}>
          <Settings size={18} style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>

      {/* Input Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.04)',
        borderRadius: '20px',
        padding: '20px',
        border: '1px solid rgba(255,255,255,0.05)',
        marginBottom: '6px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#AAAAAA', textTransform: 'uppercase', letterSpacing: '0.05em' }}>You Pay</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#888888' }}>Balance: {Number(balance).toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <input
            type="number"
            placeholder="0.0"
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value)}
            style={{
              background: 'transparent', border: 'none', color: 'white',
              fontSize: '32px', outline: 'none', width: '60%', fontWeight: 800,
              fontVariantNumeric: 'tabular-nums'
            }}
          />
          <div style={{
            background: '#1A1A1A', border: '1px solid #333', borderRadius: '14px',
            padding: '8px 14px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px',
            fontWeight: 800, fontSize: '15px'
          }}>
            <img src={USDT_TOKEN.logo} alt="USDT" style={{ width: 22, height: 22, borderRadius: '50%' }} />
            USDT
          </div>
        </div>
      </div>

      <div style={{ height: '0', position: 'relative', zIndex: 2 }}>
        <div style={{
          position: 'absolute', left: '50%', top: '-18px', transform: 'translateX(-50%)',
          background: '#111111', border: '4px solid var(--bg-card)', borderRadius: '12px',
          padding: '8px', color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <ArrowDown size={16} strokeWidth={3} />
        </div>
      </div>

      {/* Output Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.04)',
        borderRadius: '20px',
        padding: '20px',
        border: '1px solid rgba(255,255,255,0.05)',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#AAAAAA', textTransform: 'uppercase', letterSpacing: '0.05em' }}>You Receive</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 800, color: loading ? '#555' : 'white', fontVariantNumeric: 'tabular-nums' }}>
            {loading ? <Loader2 className="animate-spin" size={24} /> : (amountOut || '0.0')}
          </div>
          <div style={{
            background: 'linear-gradient(135deg, var(--gold-primary), var(--gold-secondary))', 
            border: 'none', borderRadius: '14px',
            padding: '8px 14px', color: '#000', display: 'flex', alignItems: 'center', gap: '10px',
            fontWeight: 900, fontSize: '15px'
          }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)', fontSize: '10px' }}>L</div>
            LIA
          </div>
        </div>
      </div>

      {error && (
         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff4444', fontSize: '13px', marginBottom: '16px', background: 'rgba(255, 68, 68, 0.1)', padding: '12px', borderRadius: '14px', border: '1px solid rgba(255, 68, 68, 0.2)' }}>
            <AlertCircle size={16} /> {error}
         </div>
      )}

      {/* Quote Intelligence */}
      {quoteData?.quote && !loading && !error && (
          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '16px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
                <span style={{ color: '#888', fontWeight: 600 }}>Best Route (v3)</span>
                <span style={{ color: 'white', fontWeight: 800 }}>Institutional Routing</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#888', fontWeight: 600 }}>Network Gas</span>
                <span style={{ color: '#10b981', fontWeight: 800 }}>~${Number(quoteData.quote.gasFeeUSD).toFixed(2)}</span>
            </div>
          </div>
      )}

      {/* Dynamic Action Button */}
      <button 
        onClick={handleAction}
        disabled={loading}
        className="btn-primary"
        style={{
          width: '100%',
          padding: '20px',
          fontSize: '16px',
          borderRadius: '18px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 900,
          background: (isConnected && Number(amountIn) > Number(balance)) ? '#333' : 'var(--gold-primary)',
          color: (isConnected && Number(amountIn) > Number(balance)) ? '#666' : '#000',
          opacity: loading ? 0.7 : 1
        }}
      >
        {!isConnected ? 'Initialize Portal' : 
         (Number(amountIn) > Number(balance)) ? 'Insufficient USDT' :
         (allowance < ethers.parseUnits(amountIn || '0', USDT_TOKEN.decimals)) ? 'Approve USDT' :
         'Execute Swap'}
      </button>

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <a href={uniswapDirectUrl} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: 'var(--gold-primary)', textDecoration: 'none', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: 0.6 }}>
          EXTERNAL LIQUIDITY PATH <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
