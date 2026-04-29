import React from 'react';
import { Info, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SwapDetailsProps {
  quote: any;
  sellAmt: string;
  buyAmt: string;
  sellSymbol: string;
  buySymbol: string;
  priceImpact?: string;
  slippage?: string;
}

const SwapDetails: React.FC<SwapDetailsProps> = ({
  quote,
  sellAmt,
  buyAmt,
  sellSymbol,
  buySymbol,
  priceImpact,
  slippage = 'Auto',
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  if (!quote) return null;

  const rate = parseFloat(buyAmt) / parseFloat(sellAmt);
  const isUniswapX = ['DUTCH_V2', 'DUTCH_V3', 'PRIORITY'].includes(quote.routing);

  return (
    <div style={{ padding: '4px 8px' }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          fontSize: '13px', 
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          padding: '8px 0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>1 {sellSymbol} = {rate.toFixed(6)} {buySymbol}</span>
          <span style={{ color: 'var(--text-muted)' }}>(${((rate * 1)).toFixed(2)})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Zap size={14} color={isUniswapX ? '#4ade80' : 'var(--text-muted)'} fill={isUniswapX ? '#4ade80' : 'none'} />
          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '12px 0', display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                  Price Impact <Info size={12} style={{ opacity: 0.5 }} />
                </div>
                <span style={{ color: parseFloat(priceImpact || '0') > 2 ? '#f87171' : 'white' }}>
                  {priceImpact ? `${priceImpact}%` : '< 0.01%'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                  Max. Slippage <Info size={12} style={{ opacity: 0.5 }} />
                </div>
                <span style={{ color: 'white' }}>{slippage}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                  Network Cost <Info size={12} style={{ opacity: 0.5 }} />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: isUniswapX ? '#4ade80' : 'white' }}>
                    {isUniswapX ? 'Gasless' : `$${parseFloat(quote.quote.gasFeeUSD || '0').toFixed(2)}`}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                  Order Routing <Info size={12} style={{ opacity: 0.5 }} />
                </div>
                <span style={{ color: 'white' }}>{quote.routing}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SwapDetails;
