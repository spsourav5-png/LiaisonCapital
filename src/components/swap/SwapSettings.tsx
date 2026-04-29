import React from 'react';
import { X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SwapSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  slippage: string;
  setSlippage: (val: string) => void;
  deadline: string;
  setDeadline: (val: string) => void;
}

const SwapSettings: React.FC<SwapSettingsProps> = ({
  isOpen,
  onClose,
  slippage,
  setSlippage,
  deadline,
  setDeadline,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'absolute', top: '40px', right: '0', zIndex: 100, width: '280px' }}>
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            style={{
              background: '#1c1c28',
              border: '1px solid var(--border-md)',
              borderRadius: '16px',
              padding: '16px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(20px)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>Settings</span>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Max. Slippage <Info size={12} style={{ opacity: 0.5 }} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setSlippage('Auto')}
                  style={{
                    flex: 1,
                    background: slippage === 'Auto' ? 'var(--purple-600)' : 'rgba(255,255,255,0.05)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px',
                    fontSize: '12px',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Auto
                </button>
                <div style={{ position: 'relative', flex: 2 }}>
                  <input
                    type="text"
                    value={slippage === 'Auto' ? '' : slippage}
                    placeholder="0.10"
                    onChange={(e) => setSlippage(e.target.value.replace(/[^0-9.]/g, ''))}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border-md)',
                      borderRadius: '8px',
                      padding: '6px 28px 6px 10px',
                      color: 'white',
                      fontSize: '12px',
                      textAlign: 'right',
                      outline: 'none'
                    }}
                  />
                  <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: 'var(--text-muted)' }}>%</span>
                </div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Transaction Deadline <Info size={12} style={{ opacity: 0.5 }} />
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value.replace(/[^0-9]/g, ''))}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-md)',
                    borderRadius: '8px',
                    padding: '6px 50px 6px 10px',
                    color: 'white',
                    fontSize: '12px',
                    textAlign: 'right',
                    outline: 'none'
                  }}
                />
                <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: 'var(--text-muted)' }}>minutes</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SwapSettings;
