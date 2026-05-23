import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const POOL_ADDRESS = '0x0e85318d52f304bdc45cf00d386e6a93030a86cdfa3ae4a28438792dc3ee8516';
const GECKO_API = 'https://api.geckoterminal.com/api/v2';

type Timeframe = '1H' | '1D' | '1W' | '1M';

interface ChartPoint {
  time: string;
  price: number;
}

// Map UI timeframe → GeckoTerminal OHLCV params
const TIMEFRAME_PARAMS: Record<Timeframe, { timeframe: string; aggregate: string; limit: number; labelFn: (ts: number) => string }> = {
  '1H': {
    timeframe: 'minute',
    aggregate: '1',
    limit: 60,
    labelFn: (ts) => new Date(ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
  '1D': {
    timeframe: 'hour',
    aggregate: '1',
    limit: 24,
    labelFn: (ts) => new Date(ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
  '1W': {
    timeframe: 'hour',
    aggregate: '4',
    limit: 42,
    labelFn: (ts) => new Date(ts * 1000).toLocaleDateString([], { month: 'short', day: 'numeric' }),
  },
  '1M': {
    timeframe: 'day',
    aggregate: '1',
    limit: 30,
    labelFn: (ts) => new Date(ts * 1000).toLocaleDateString([], { month: 'short', day: 'numeric' }),
  },
};

const LiaisonChart = () => {
  const [activeFrame, setActiveFrame] = useState<Timeframe>('1D');
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetch_ = async () => {
      setLoading(true);
      const { timeframe, aggregate, limit, labelFn } = TIMEFRAME_PARAMS[activeFrame];
      try {
        const res = await fetch(
          `${GECKO_API}/networks/eth/pools/${POOL_ADDRESS}/ohlcv/${timeframe}?aggregate=${aggregate}&limit=${limit}&currency=usd&token=base`,
          { headers: { Accept: 'application/json;version=20230302' } }
        );
        if (!res.ok) throw new Error(`OHLCV fetch failed: ${res.status}`);
        const json = await res.json();
        // GeckoTerminal OHLCV: [ [timestamp, open, high, low, close, volume], ... ]
        const raw: number[][] = json?.data?.attributes?.ohlcv_list ?? [];
        if (cancelled || !raw.length) return;

        const points: ChartPoint[] = raw.map(([ts, , , , close]) => ({
          time: labelFn(ts),
          price: close,
        }));

        const first = points[0]?.price;
        const last = points[points.length - 1]?.price;
        const pct = first && last ? ((last - first) / first) * 100 : null;

        setChartData(points);
        setCurrentPrice(last ?? null);
        setPriceChange(pct);
      } catch (err) {
        console.error('LiaisonChart fetch error:', err);
      }
      if (!cancelled) setLoading(false);
    };
    fetch_();
    return () => { cancelled = true; };
  }, [activeFrame]);

  const priceLabel = currentPrice !== null
    ? `$${currentPrice < 0.01 ? currentPrice.toFixed(5) : currentPrice.toFixed(4)}`
    : '—';

  const changeLabel = priceChange !== null
    ? `${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}%`
    : null;

  const isPositive = (priceChange ?? 0) >= 0;

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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '0 12px' }}>
        <div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
            LIA / USDT Performance
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px', fontWeight: 900, color: 'white' }}>
              {loading ? <span style={{ opacity: 0.4, fontSize: '16px' }}>Loading…</span> : priceLabel}
            </span>
            {!loading && changeLabel && (
              <span style={{
                fontSize: '13px', fontWeight: 700,
                color: isPositive ? '#10b981' : '#ef4444',
                background: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                padding: '2px 8px', borderRadius: '6px'
              }}>
                {changeLabel}
              </span>
            )}
          </div>
        </div>

        {/* Timeframe buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['1H', '1D', '1W', '1M'] as Timeframe[]).map(t => (
            <button
              key={t}
              onClick={() => setActiveFrame(t)}
              style={{
                background: t === activeFrame ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                border: t === activeFrame ? '1px solid var(--gold-primary)' : '1px solid var(--border)',
                color: t === activeFrame ? 'var(--gold-primary)' : 'var(--text-secondary)',
                fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '8px', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 40 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--gold-primary)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--gold-primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.03)" />
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 600 }}
            dy={10}
            interval="preserveStartEnd"
          />
          <YAxis
            hide={true}
            domain={['dataMin * 0.995', 'dataMax * 1.005']}
          />
          <Tooltip
            contentStyle={{
              background: '#0a0a0a',
              border: '1px solid var(--border-gold)',
              borderRadius: '12px',
              fontSize: '12px',
              color: 'white',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}
            itemStyle={{ color: 'var(--gold-primary)', fontWeight: 800 }}
            labelStyle={{ color: 'var(--text-muted)', fontSize: '10px' }}
            formatter={(val: number) => [`$${val.toFixed(5)}`, 'LIA']}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="var(--gold-primary)"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorPrice)"
            animationDuration={1000}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LiaisonChart;
