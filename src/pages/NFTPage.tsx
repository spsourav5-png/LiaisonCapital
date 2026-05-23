import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ExternalLink, 
  Info, 
  Coins, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  TrendingUp, 
  Layers, 
  X, 
  Wallet,
  Compass
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { 
  getCollectionDetails, 
  getCollectionNFTs
} from '../services/opensea';
import type { NFTItem, CollectionStats } from '../services/opensea';

// Mock price trend data for Liaison NFTs over the last 14 days
const PRICE_TREND_DATA = [
  { day: 'May 10', price: 0.12 },
  { day: 'May 12', price: 0.14 },
  { day: 'May 14', price: 0.13 },
  { day: 'May 16', price: 0.16 },
  { day: 'May 18', price: 0.18 },
  { day: 'May 20', price: 0.17 },
  { day: 'May 22', price: 0.20 }
];

const NFTPage = () => {
  const { isConnected, address } = useWeb3ModalAccount();
  const [stats, setStats] = useState<CollectionStats | null>(null);
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiveApi, setIsLiveApi] = useState(false);
  
  // Filtering & UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('id_asc');
  const [selectedNft, setSelectedNft] = useState<NFTItem | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const statsData = await getCollectionDetails();
        const nftsResult = await getCollectionNFTs();
        
        setStats(statsData);
        setNfts(nftsResult.items);
        setIsLiveApi(nftsResult.isLive);
      } catch (err) {
        console.error('Failed to load NFT data', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter and Sort NFTs
  const filteredNfts = nfts
    .filter(nft => {
      const matchesSearch = nft.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            nft.identifier.includes(searchQuery) ||
                            nft.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRarity = selectedRarity === 'All' || nft.rarity === selectedRarity;
      const matchesCategory = selectedCategory === 'All' || nft.category === selectedCategory;

      return matchesSearch && matchesRarity && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'id_asc') {
        return parseInt(a.identifier) - parseInt(b.identifier);
      }
      if (sortBy === 'id_desc') {
        return parseInt(b.identifier) - parseInt(a.identifier);
      }
      if (sortBy === 'price_asc') {
        return parseFloat(a.price) - parseFloat(b.price);
      }
      if (sortBy === 'price_desc') {
        return parseFloat(b.price) - parseFloat(a.price);
      }
      return 0;
    });

  // Unique categories for filters
  const categories = ['All', ...new Set(nfts.map(n => n.category))];

  // Simulated Web3 Actions
  const handlePurchase = (nft: NFTItem) => {
    if (!isConnected) {
      toast.error('Wallet not connected', {
        description: 'Please connect your decentralized wallet first using the Portal button.'
      });
      return;
    }
    toast.success('Simulation Successful', {
      description: `Purchase order initiated for ${nft.name} at ${nft.price}. Approve transaction in wallet.`
    });
  };

  const handleMintInteraction = (nft: NFTItem) => {
    if (!isConnected) {
      toast.error('Wallet not connected', {
        description: 'Please connect your decentralized wallet first to interact.'
      });
      return;
    }
    toast.info('Simulated Protocol Interaction', {
      description: `Delegating ${nft.name} permissions to the Liaison Yield Engine. Staking initiated!`
    });
  };

  return (
    <div style={{ position: 'relative', zIndex: 1, padding: '0 0 100px 0', minHeight: 'calc(100vh - 72px)' }}>
      <div className="page-bg" />

      {/* Decorative Shimmering Orbs */}
      <div className="glow" style={{ top: '10%', right: '15%', width: '350px', height: '350px', backgroundColor: 'rgba(212, 175, 55, 0.08)' }} />
      <div className="glow" style={{ bottom: '20%', left: '5%', width: '400px', height: '400px', backgroundColor: 'rgba(212, 175, 55, 0.04)' }} />

      {/* ── 1. Hero Collection Banner & Avatar ────────────────── */}
      <div style={{ position: 'relative', height: '240px', background: 'linear-gradient(135deg, #050505 0%, #151515 50%, #000000 100%)', borderBottom: '1px solid var(--border)' }}>
        {/* Shimmer overlay */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.15, background: 'radial-gradient(circle at 50% 50%, var(--gold-primary), transparent 60%)' }} />
        
        {/* Center Container for profile elements */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px', position: 'relative', height: '100%' }}>
          <div style={{ position: 'absolute', bottom: '-60px', left: '32px', display: 'flex', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap' }}>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              style={{
                width: '130px',
                height: '130px',
                borderRadius: '24px',
                background: 'var(--bg-card)',
                border: '3px solid var(--gold-primary)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.8), 0 0 20px var(--gold-glow)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px'
              }}
              className="animate-float"
            >
              <img 
                src={stats?.imageUrl || '/liaison_nft.png'} 
                alt="Liaison Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '18px' }} 
              />
            </motion.div>

            <div style={{ paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h1 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
                  {stats?.name || 'Liaison Institutional'}
                </h1>
                <div style={{ display: 'inline-flex', color: 'var(--gold-primary)', filter: 'drop-shadow(0 0 4px var(--gold-glow))' }}>
                  <ShieldCheck size={24} fill="rgba(212,175,55,0.2)" />
                </div>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Created by</span>
                <span style={{ color: 'white', fontWeight: 600 }}>Liaison Protocol</span>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--text-muted)' }} />
                <span style={{ fontFamily: 'monospace', color: 'var(--gold-primary)' }}>0xdb49...3F52</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '80px auto 0', padding: '0 32px' }}>
        
        {/* ── 2. Top Info Row: Description, API Badge, and Social Link ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginBottom: '48px', alignItems: 'start' }}>
          <div>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '20px' }}>
              {stats?.description || 'The official institutional non-fungible token collection of the Liaison Protocol.'}
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* API Live status badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '999px',
                background: isLiveApi ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${isLiveApi ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                fontSize: '12px',
                fontWeight: 700,
                color: isLiveApi ? '#10b981' : '#ef4444',
              }}>
                <span style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  backgroundColor: isLiveApi ? '#10b981' : '#ef4444',
                  boxShadow: isLiveApi ? '0 0 8px #10b981' : '0 0 8px #ef4444'
                }} />
                {isLiveApi ? 'OpenSea API Live' : 'OpenSea Connection Offline'}
              </div>

              <a 
                href={stats?.openseaUrl || 'https://opensea.io'} 
                target="_blank" 
                rel="noreferrer" 
                className="btn-ghost" 
                style={{ padding: '6px 16px', borderRadius: '999px', fontSize: '12px', gap: '6px' }}
              >
                <span>View Collection on OpenSea</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* ── 3. Stats Board ──────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'gridTemplateColumns: repeat(2, 1fr)', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px' }}>
            {[
              { 
                label: 'FLOOR PRICE', 
                value: stats?.stats?.floorPrice !== undefined ? `${stats.stats.floorPrice.toFixed(2)} ETH` : 'N/A', 
                desc: stats?.stats?.floorPrice ? `~$${(stats.stats.floorPrice * 3000).toFixed(2)} USD` : 'No active orders' 
              },
              { 
                label: 'TOTAL VOLUME', 
                value: stats?.stats?.totalVolume !== undefined ? `${stats.stats.totalVolume.toLocaleString()} ETH` : 'N/A', 
                desc: 'Secondary volume' 
              },
              { 
                label: 'OWNERS', 
                value: stats?.stats?.owners !== undefined ? stats.stats.owners.toString() : 'N/A', 
                desc: 'Unique items' 
              },
              { 
                label: 'ITEMS', 
                value: stats?.stats?.itemsCount !== undefined ? stats.stats.itemsCount.toLocaleString() : 'N/A', 
                desc: 'Total supply' 
              },
            ].map((s, idx) => (
              <div 
                key={idx} 
                className="card" 
                style={{ 
                  padding: '16px 20px', 
                  textAlign: 'center', 
                  position: 'relative', 
                  overflow: 'hidden', 
                  background: 'rgba(10, 10, 10, 0.4)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid var(--border)'
                }}
              >
                <p style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  {s.label}
                </p>
                <p style={{ fontSize: '20px', fontWeight: 800, color: 'white', letterSpacing: '-0.01em' }}>
                  {s.value}
                </p>
                <p style={{ fontSize: '11px', color: 'var(--gold-primary)', marginTop: '2px', fontWeight: 500 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. Recharts Floor Price Trend Graph ──────────────── */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
          style={{ padding: '24px 32px', marginBottom: '56px', background: 'rgba(10, 10, 10, 0.4)', backdropFilter: 'blur(16px)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.15em', color: 'var(--gold-primary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Market Analytics
              </p>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'white' }}>
                Floor Price Trajectory (14D)
              </h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '14px', fontWeight: 700 }}>
              <TrendingUp size={16} />
              <span>+66.7% Price Appreciation</span>
            </div>
          </div>

          <div style={{ width: '100%', height: '180px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PRICE_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--gold-primary)" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="var(--gold-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  stroke="rgba(255,255,255,0.2)" 
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.2)" 
                  fontSize={11}
                  tickLine={false}
                  domain={[0.08, 0.22]}
                />
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(10,10,10,0.9)',
                    border: '1px solid var(--border-gold)',
                    borderRadius: '12px',
                    color: 'white',
                    fontFamily: 'inherit',
                    fontSize: '12px'
                  }}
                  labelStyle={{ color: 'var(--text-muted)', fontWeight: 700 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="var(--gold-primary)" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* ── 5. Navigation Control Bar (Search, Filters, Sort) ── */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px', 
          marginBottom: '32px',
          padding: '20px 24px',
          background: 'rgba(10, 10, 10, 0.6)',
          borderRadius: '20px',
          border: '1px solid var(--border)',
          backdropFilter: 'blur(12px)'
        }}>
          {/* Top Row: Search & Sort */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div style={{ position: 'relative', flex: '1 1 300px' }}>
              <Search 
                size={18} 
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
              />
              <input 
                type="text"
                placeholder="Search by name, identifier, or property..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-card-2)',
                  border: '1px solid var(--border-md)',
                  borderRadius: '12px',
                  padding: '12px 16px 12px 48px',
                  fontSize: '14px',
                  color: 'white',
                  outline: 'none',
                  transition: 'all 0.3s'
                }}
                className="swap-box"
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>SORT BY</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{
                  background: 'var(--bg-card-2)',
                  border: '1px solid var(--border-md)',
                  borderRadius: '12px',
                  padding: '12px 20px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="id_asc">Token ID: Low to High</option>
                <option value="id_desc">Token ID: High to Low</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Filters */}
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Rarity Selector */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em', marginRight: '6px' }}>RARITY</span>
              {['All', 'Legendary', 'Epic', 'Rare', 'Premium'].map(rarity => (
                <button
                  key={rarity}
                  onClick={() => setSelectedRarity(rarity)}
                  className={`swap-tab ${selectedRarity === rarity ? 'active' : ''}`}
                  style={{ padding: '6px 14px', fontSize: '13px' }}
                >
                  {rarity}
                </button>
              ))}
            </div>

            <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border)', display: 'none', md: 'block' }} />

            {/* Category Selector */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em', marginRight: '6px' }}>CATEGORY</span>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`swap-tab ${selectedCategory === cat ? 'active' : ''}`}
                  style={{ padding: '6px 14px', fontSize: '13px' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── 6. NFT Cards Grid ────────────────────────────────── */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0', gap: '16px' }}>
            <div className="animate-spin-slow" style={{ width: '48px', height: '48px', border: '3px solid var(--border)', borderTopColor: 'var(--gold-primary)', borderRadius: '50%' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>Decrypting smart contract items...</p>
          </div>
        ) : filteredNfts.length === 0 ? (
          <div className="card" style={{ padding: '80px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(10, 10, 10, 0.3)' }}>
            <Compass size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
            <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>No items found</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '400px' }}>
              No certificates match your search query. Try broadening your keywords or resetting filters.
            </p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedRarity('All'); setSelectedCategory('All'); }} 
              className="btn-ghost" 
              style={{ marginTop: '20px', fontSize: '13px' }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div 
            layout 
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}
          >
            <AnimatePresence mode="popLayout">
              {filteredNfts.map((nft) => {
                // Determine glowing theme color based on rarity
                const isLegendary = nft.rarity === 'Legendary';
                const isEpic = nft.rarity === 'Epic';
                const isRare = nft.rarity === 'Rare';
                const glowColor = isLegendary ? 'rgba(212,175,55,0.3)' : isEpic ? 'rgba(167,139,250,0.15)' : isRare ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)';
                const tagGradient = isLegendary 
                  ? 'linear-gradient(135deg, var(--gold-primary), var(--gold-secondary))' 
                  : isEpic 
                    ? 'linear-gradient(135deg, #a78bfa, #8b5cf6)' 
                    : isRare 
                      ? 'linear-gradient(135deg, #60a5fa, #3b82f6)' 
                      : 'linear-gradient(135deg, #9ca3af, #4b5563)';
                const tagColor = isLegendary ? '#000000' : '#ffffff';

                return (
                  <motion.div
                    key={nft.identifier}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="card feature-card"
                    style={{ 
                      padding: 0, 
                      overflow: 'hidden', 
                      position: 'relative', 
                      display: 'flex', 
                      flexDirection: 'column',
                      cursor: 'pointer',
                      border: hoveredId === nft.identifier ? '1px solid var(--gold-primary)' : '1px solid var(--border)',
                      boxShadow: hoveredId === nft.identifier ? `0 12px 32px rgba(0,0,0,0.5), 0 0 15px ${glowColor}` : 'none',
                      transform: hoveredId === nft.identifier ? 'translateY(-4px)' : 'none'
                    }}
                    onMouseEnter={() => setHoveredId(nft.identifier)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => setSelectedNft(nft)}
                  >
                    {/* Visual Asset Container */}
                    <div style={{ position: 'relative', width: '100%', height: '240px', background: 'rgba(5, 5, 5, 0.9)', overflow: 'hidden' }}>
                      <img 
                        src={nft.image_url} 
                        alt={nft.name} 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          transition: 'all 0.5s ease',
                          transform: hoveredId === nft.identifier ? 'scale(1.08)' : 'scale(1)'
                        }} 
                      />

                      {/* Rarity Pill Badge */}
                      <span style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 800,
                        letterSpacing: '0.05em',
                        background: tagGradient,
                        color: tagColor,
                        zIndex: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                      }}>
                        {nft.rarity.toUpperCase()}
                      </span>

                      {/* Token ID Tag */}
                      <span style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: 'rgba(0,0,0,0.7)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.8)',
                        zIndex: 2
                      }}>
                        #{nft.identifier}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <p style={{ fontSize: '11px', fontWeight: 800, color: 'var(--gold-primary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
                        {nft.category}
                      </p>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'white', marginBottom: '8px', lineHeight: 1.4 }}>
                        {nft.name}
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '36px' }}>
                        {nft.description}
                      </p>

                      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
                        <div>
                          <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>PRICE</p>
                          <p style={{ fontSize: '14px', fontWeight: 800, color: 'white' }}>{nft.price}</p>
                        </div>
                        <button 
                          className="btn-ghost" 
                          style={{ padding: '8px 14px', fontSize: '12px', borderRadius: '8px', transition: 'all 0.2s' }}
                          onClick={(e) => { e.stopPropagation(); setSelectedNft(nft); }}
                        >
                          Acquire →
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

      </div>

      {/* ── 7. Detailed Interactive NFT Modal ─────────────────── */}
      <AnimatePresence>
        {selectedNft && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px'
            }}
            onClick={() => setSelectedNft(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              style={{
                width: '100%',
                maxWidth: '850px',
                maxHeight: 'calc(100vh - 48px)',
                background: 'rgba(10, 10, 10, 0.95)',
                border: '1px solid var(--border-gold)',
                boxShadow: '0 24px 60px rgba(0,0,0,0.8), 0 0 30px var(--gold-glow)',
                borderRadius: '24px',
                overflow: 'y-auto',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedNft(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border)',
                  color: 'white',
                  cursor: 'pointer',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                  zIndex: 10
                }}
              >
                <X size={18} />
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', overflowY: 'auto' }}>
                
                {/* Left Side: Large Visual */}
                <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(5, 5, 5, 0.9)', borderRight: '1px solid var(--border)' }}>
                  <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-md)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                    <img 
                      src={selectedNft.image_url} 
                      alt={selectedNft.name} 
                      style={{ width: '100%', height: 'auto', display: 'block' }} 
                    />
                    <span style={{
                      position: 'absolute',
                      bottom: '16px',
                      left: '16px',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 800,
                      background: 'rgba(0,0,0,0.8)',
                      color: 'var(--gold-primary)',
                      border: '1px solid var(--border-gold)'
                    }}>
                      {selectedNft.rarity.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Right Side: Attributes & Description */}
                <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <p style={{ fontSize: '11px', fontWeight: 800, color: 'var(--gold-primary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                    {selectedNft.category} · TOKEN #{selectedNft.identifier}
                  </p>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'white', marginBottom: '12px' }}>
                    {selectedNft.name}
                  </h2>
                  
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
                    {selectedNft.description}
                  </p>

                  {/* Properties/Traits Grid */}
                  <div style={{ marginBottom: '28px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 800, color: 'white', letterSpacing: '0.05em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={14} className="text-gold" style={{ color: 'var(--gold-primary)' }} />
                      <span>CRYPTOGRAPHIC PROPERTIES</span>
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                      {selectedNft.traits.map((t, idx) => (
                        <div 
                          key={idx} 
                          className="card-surface" 
                          style={{ 
                            padding: '10px 14px', 
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(212,175,55,0.1)',
                            borderRadius: '8px',
                            textAlign: 'center'
                          }}
                        >
                          <p style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {t.trait_type}
                          </p>
                          <p style={{ fontSize: '12px', fontWeight: 700, color: 'white', marginTop: '2px' }}>
                            {t.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700 }}>ACQUISITION PRICE</span>
                        <p style={{ fontSize: '20px', fontWeight: 800, color: 'white', marginTop: '2px' }}>
                          {selectedNft.price}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--gold-primary)', fontWeight: 700 }}>
                        <Coins size={14} />
                        <span>Ethereum Network</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button 
                        onClick={() => handlePurchase(selectedNft)}
                        className="btn-primary" 
                        style={{ flex: 1, padding: '12px', fontSize: '13px', display: 'flex', gap: '8px', justifyContent: 'center' }}
                      >
                        <Wallet size={16} />
                        <span>Acquire Asset</span>
                      </button>
                      <button 
                        onClick={() => handleMintInteraction(selectedNft)}
                        className="btn-ghost" 
                        style={{ flex: 1, padding: '12px', fontSize: '13px', display: 'flex', gap: '8px', justifyContent: 'center' }}
                      >
                        <Activity size={16} />
                        <span>Stake to Vault</span>
                      </button>
                    </div>

                    <a 
                      href={selectedNft.opensea_url} 
                      target="_blank" 
                      rel="noreferrer" 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '6px', 
                        fontSize: '11px', 
                        color: 'var(--text-secondary)', 
                        marginTop: '12px',
                        textDecoration: 'none',
                        transition: 'color 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--gold-primary)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                    >
                      <span>View Smart Contract on OpenSea</span>
                      <ExternalLink size={10} />
                    </a>
                  </div>

                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default NFTPage;
