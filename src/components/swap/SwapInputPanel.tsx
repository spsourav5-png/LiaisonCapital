import React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoUrl?: string;
}

interface SwapInputPanelProps {
  label: string;
  value: string;
  onValueChange: (val: string) => void;
  token: Token | null;
  onTokenClick: () => void;
  balance?: string;
  onMaxClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  usdValue?: string;
}

const SwapInputPanel: React.FC<SwapInputPanelProps> = ({
  label,
  value,
  onValueChange,
  token,
  onTokenClick,
  balance,
  onMaxClick,
  isLoading = false,
  disabled = false,
  usdValue,
}) => {
  return (
    <div className="swap-box" style={{ background: 'var(--bg-card-2)', borderRadius: '16px', border: '1px solid var(--border-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</span>
        {balance && (
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Balance: {isLoading ? '...' : parseFloat(balance).toFixed(4)}
            </span>
            {onMaxClick && !disabled && (
              <button
                onClick={onMaxClick}
                style={{
                  background: 'rgba(124, 58, 237, 0.1)',
                  border: 'none',
                  color: '#a78bfa',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => (e.target as HTMLElement).style.background = 'rgba(124, 58, 237, 0.2)'}
                onMouseLeave={e => (e.target as HTMLElement).style.background = 'rgba(124, 58, 237, 0.1)'}
              >
                MAX
              </button>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <input
          type="text"
          className="swap-input"
          placeholder="0.0"
          value={value}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9.]/g, '');
            if (val.split('.').length <= 2) onValueChange(val);
          }}
          disabled={disabled}
          style={{ 
            fontSize: '28px', 
            fontWeight: 600, 
            color: value ? 'white' : 'var(--text-muted)',
            textAlign: 'left'
          }}
        />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onTokenClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-md)',
            borderRadius: '12px',
            padding: '6px 12px',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}
        >
          {token?.logoUrl ? (
            <img src={token.logoUrl} alt={token.symbol} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
          ) : (
            <div style={{ width: '24px', height: '24px', background: 'var(--purple-600)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
              {token?.symbol?.[0] || '?'}
            </div>
          )}
          <span style={{ fontWeight: 600, fontSize: '16px' }}>{token?.symbol || 'Select'}</span>
          <ChevronDown size={16} color="rgba(255,255,255,0.6)" />
        </motion.button>
      </div>

      {usdValue && value && (
        <div style={{ marginTop: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          ${parseFloat(usdValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      )}
    </div>
  );
};

export default SwapInputPanel;
