import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { time: '00:00', price: 0.00812 },
  { time: '04:00', price: 0.00845 },
  { time: '08:00', price: 0.00832 },
  { time: '12:00', price: 0.00867 },
  { time: '16:00', price: 0.00891 },
  { time: '20:00', price: 0.00875 },
  { time: '23:59', price: 0.00845 },
];

const LiaisonChart = () => {
  return (
    <div style={{ 
      width: '100%', 
      height: '320px', 
      background: 'rgba(5, 5, 5, 0.4)',
      borderRadius: '24px',
      padding: '24px 12px 12px',
      border: '1px solid var(--border)',
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '0 12px' }}>
        <div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>LIA / USDT Performance</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px', fontWeight: 900, color: 'white' }}>$0.00845</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>+4.2%</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['1H', '1D', '1W', '1M'].map(t => (
            <button key={t} style={{ 
              background: t === '1D' ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
              border: t === '1D' ? '1px solid var(--gold-primary)' : '1px solid var(--border)',
              color: t === '1D' ? 'var(--gold-primary)' : 'var(--text-secondary)',
              fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '8px', cursor: 'pointer'
            }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 40 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--gold-primary)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--gold-primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.03)" />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 600 }}
            dy={10}
          />
          <YAxis 
            hide={true} 
            domain={['dataMin - 0.0005', 'dataMax + 0.0005']} 
          />
          <Tooltip 
            contentStyle={{ 
              background: '#0a0a0a', 
              border: '1px solid var(--border-gold)', 
              borderRadius: '12px',
              fontSize: '12px',
              color: 'white',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}
            itemStyle={{ color: 'var(--gold-primary)', fontWeight: 800 }}
            labelStyle={{ display: 'none' }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="var(--gold-primary)" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LiaisonChart;
