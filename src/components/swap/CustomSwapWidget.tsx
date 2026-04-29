import { useState, useEffect } from 'react';
import { ArrowDown, Loader2, Settings, AlertCircle } from 'lucide-react';
import { useWeb3ModalAccount, useWeb3Modal } from '@web3modal/ethers/react';
import { ethers } from 'ethers';

const LIAISON_TOKEN = {
  address: '0xa2f93b5333E82E281764005b88EEfdC9E1dEC921',
  symbol: 'LIA',
  decimals: 18,
  logo: 'https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/0xa2f93b5333E82E281764005b88EEfdC9E1dEC921/logo.png' // fallback if none
};

const USDT_TOKEN = {
  address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  symbol: 'USDT',
  decimals: 6,
  logo: 'https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png'
};

export default function CustomSwapWidget() {
  const [amountIn, setAmountIn] = useState('');
  const [amountOut, setAmountOut] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quoteData, setQuoteData] = useState<any>(null);

  const { isConnected } = useWeb3ModalAccount();
  const { open } = useWeb3Modal();

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
        // Convert to smallest unit (6 decimals for USDT)
        const amountWei = ethers.parseUnits(amountIn, USDT_TOKEN.decimals).toString();

        const requestBody = {
          tokenIn: USDT_TOKEN.address,
          tokenOut: LIAISON_TOKEN.address,
          tokenInChainId: 1,
          tokenOutChainId: 1,
          amount: amountWei,
          type: 'EXACT_INPUT'
        };

        const res = await fetch('/api/uniswap/quote', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!res.ok) {
          throw new Error('Failed to fetch quote from Uniswap Trading API');
        }

        const data = await res.json();
        setQuoteData(data);
        
        if (data.quote && data.quote.output) {
            // Format output based on LIA decimals (18)
            const formattedOut = ethers.formatUnits(data.quote.output.amount, LIAISON_TOKEN.decimals);
            setAmountOut(Number(formattedOut).toFixed(4));
        }

      } catch (err: any) {
        console.error('Quote fetch error:', err);
        setError(err.message || 'Error fetching best price');
        setAmountOut('');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchQuote, 500); // Debounce
    return () => clearTimeout(timer);
  }, [amountIn]);

  return (
    <div style={{
      background: '#13131f',
      border: '1px solid #2d2d3d',
      borderRadius: '24px',
      padding: '16px',
      width: '100%',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 8px 16px', color: 'white' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Swap</h3>
        <button style={{ background: 'transparent', border: 'none', color: '#a78bfa', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <Settings size={18} />
        </button>
      </div>

      {/* Input Token (USDT) */}
      <div style={{
        background: '#1a1a24',
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '4px',
        border: '1px solid transparent',
        transition: 'border-color 0.2s',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <input
            type="number"
            placeholder="0.0"
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value)}
            style={{
              background: 'transparent', border: 'none', color: 'white',
              fontSize: '28px', outline: 'none', width: '60%', fontWeight: 500
            }}
          />
          <button style={{
            background: '#2d2d3d', border: '1px solid #3f3f5a', borderRadius: '18px',
            padding: '4px 12px', color: 'white', display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '14px', fontWeight: 600, cursor: 'pointer'
          }}>
            <img src={USDT_TOKEN.logo} alt="USDT" width={20} height={20} style={{ borderRadius: '50%' }} />
            USDT
          </button>
        </div>
      </div>

      {/* Divider */}
      <div style={{ position: 'relative', height: '0px', display: 'flex', justifyContent: 'center', zIndex: 2 }}>
        <div style={{
          position: 'absolute', top: '-16px', background: '#1a1a24', border: '4px solid #13131f',
          borderRadius: '12px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <ArrowDown size={14} color="#a78bfa" />
        </div>
      </div>

      {/* Output Token (LIA) */}
      <div style={{
        background: '#1a1a24',
        borderRadius: '16px',
        padding: '16px',
        marginTop: '4px',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', minHeight: '34px' }}>
          {loading ? (
             <div style={{ display: 'flex', alignItems: 'center', color: '#a78bfa' }}>
                <Loader2 size={20} style={{ animation: 'spin-slow 1s linear infinite' }} />
             </div>
          ) : (
            <input
              type="text"
              readOnly
              placeholder="0.0"
              value={amountOut}
              style={{
                background: 'transparent', border: 'none', color: error ? '#ef4444' : 'white',
                fontSize: '28px', outline: 'none', width: '60%', fontWeight: 500
              }}
            />
          )}
          <button style={{
            background: '#7c3aed', border: 'none', borderRadius: '18px',
            padding: '4px 12px', color: 'white', display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '14px', fontWeight: 600, cursor: 'pointer'
          }}>
            LIA
          </button>
        </div>
      </div>

      {error && (
         <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontSize: '13px', padding: '0 8px 16px' }}>
            <AlertCircle size={14} /> {error}
         </div>
      )}

      {/* Quote Info */}
      {quoteData?.quote && !loading && !error && (
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px 16px', fontSize: '13px', color: '#8b8b9e' }}>
              <span>Network Cost</span>
              <span>~${quoteData.quote.gasFeeUSD}</span>
          </div>
      )}

      {/* Action Button */}
      <button 
        onClick={() => !isConnected ? open() : console.log("Swap Execution Not Implemented Yet")}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '16px',
          border: 'none',
          background: isConnected ? 'rgba(124, 58, 237, 0.1)' : '#7c3aed',
          color: isConnected ? '#c4b5fd' : 'white',
          fontSize: '16px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          borderStyle: 'solid',
          borderWidth: '1px',
          borderColor: isConnected ? 'rgba(124, 58, 237, 0.3)' : '#7c3aed'
        }}
      >
        {!isConnected ? 'Connect Wallet' : 'Execute Swap (Dev)'}
      </button>
    </div>
  );
}
