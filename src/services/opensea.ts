export interface NFTItem {
  identifier: string;
  name: string;
  description: string;
  image_url: string;
  opensea_url: string;
  traits: Array<{ trait_type: string; value: string | number }>;
  rarity: 'Legendary' | 'Epic' | 'Rare' | 'Premium';
  category: string;
  price: string;
}

export interface CollectionStats {
  name: string;
  description: string;
  imageUrl: string;
  bannerUrl: string;
  openseaUrl: string;
  stats: {
    floorPrice: number;
    totalVolume: number;
    owners: number;
    itemsCount: number;
  };
}

const COLLECTION_SLUG = 'liaison-669783293';

// ── Fallback Institutional Liaison NFTs ───────────────────────────
export const FALLBACK_NFTS: NFTItem[] = [
  {
    identifier: '1',
    name: 'Liaison Sovereign Membership #001',
    description: 'The ultimate on-chain identity for the Liaison Protocol ecosystem. Grants exclusive access to institutional vaults, VIP developer channels, governance multiplier, and high-frequency algorithmic liquidity lanes.',
    image_url: '/liaison_nft.png',
    opensea_url: `https://opensea.io/assets/ethereum/0xdb49fbb3ce99b2f7aa237be400200f67b5bd3f52/1`,
    rarity: 'Legendary',
    category: 'Membership',
    price: '1.50 ETH',
    traits: [
      { trait_type: 'Class', value: 'Sovereign' },
      { trait_type: 'Vault Access', value: 'Level 3' },
      { trait_type: 'Yield Multiplier', value: '2.5x' },
      { trait_type: 'Governance Weight', value: '500 votes' },
    ]
  },
  {
    identifier: '2',
    name: 'Liaison Institutional Liquidity Key #002',
    description: 'A mathematical proof-of-stake utility key. Unlocks complete DEX fee waivers on the Liaison Swap engine, prioritized Uniswap V4 hook execution, and early liquidity participation in modular debt pools.',
    image_url: '/liaison_nft.png',
    opensea_url: `https://opensea.io/assets/ethereum/0xdb49fbb3ce99b2f7aa237be400200f67b5bd3f52/2`,
    rarity: 'Legendary',
    category: 'Utility Key',
    price: '2.80 ETH',
    traits: [
      { trait_type: 'Class', value: 'Institutional' },
      { trait_type: 'DEX Fee Discount', value: '100%' },
      { trait_type: 'Priority Level', value: 'Apex' },
      { trait_type: 'Hook Co-processing', value: 'Enabled' },
    ]
  },
  {
    identifier: '3',
    name: 'Liaison Yield Accelerator Pass #003',
    description: 'Automates yield optimization routines across multiple Layer 2 scaling networks. Connects with autonomous arbitrage agents to maximize returns while insulating users from impermanent loss.',
    image_url: '/liaison_nft.png',
    opensea_url: `https://opensea.io/assets/ethereum/0xdb49fbb3ce99b2f7aa237be400200f67b5bd3f52/3`,
    rarity: 'Epic',
    category: 'Access Pass',
    price: '0.85 ETH',
    traits: [
      { trait_type: 'Class', value: 'Yield' },
      { trait_type: 'Yield Multiplier', value: '1.80x' },
      { trait_type: 'Max Capacity', value: '100k USDT' },
      { trait_type: 'Network Coverage', value: 'Arbitrum, Optimism, Base' },
    ]
  },
  {
    identifier: '4',
    name: 'Liaison Autonomous Agent Badge #004',
    description: 'Enables developers and funds to deploy advanced, on-chain autonomous trading scripts within the Liaison registry. Secures communication ports and enforces cryptographic isolation standards.',
    image_url: '/liaison_nft.png',
    opensea_url: `https://opensea.io/assets/ethereum/0xdb49fbb3ce99b2f7aa237be400200f67b5bd3f52/4`,
    rarity: 'Epic',
    category: 'Agent Badge',
    price: '0.75 ETH',
    traits: [
      { trait_type: 'Class', value: 'Agent Sandbox' },
      { trait_type: 'Script Concurrency', value: '5 Agents' },
      { trait_type: 'API Rate Allowance', value: '100/min' },
      { trait_type: 'Security Sandbox', value: 'Level 2' },
    ]
  },
  {
    identifier: '5',
    name: 'Liaison Gold Reserve Certificate #005',
    description: 'A cryptographic certificate representing physical, audit-verified gold bullion reserves held in institutional custody vaults. Can be staked to mint algorithmic LIAISON tokens.',
    image_url: '/liaison_nft.png',
    opensea_url: `https://opensea.io/assets/ethereum/0xdb49fbb3ce99b2f7aa237be400200f67b5bd3f52/5`,
    rarity: 'Rare',
    category: 'Asset Reserve',
    price: '0.45 ETH',
    traits: [
      { trait_type: 'Class', value: 'Asset Reserve' },
      { trait_type: 'Bullion Backing', value: '10oz Fine Gold' },
      { trait_type: 'Audit Integrity', value: 'Real-time Oracle' },
      { trait_type: 'Staking APY', value: '6.5%' },
    ]
  },
  {
    identifier: '6',
    name: 'Liaison Alpha Access Token #006',
    description: 'Exclusive community passport for alpha testing experimental algorithmic trading strategies, early governance proposals, and secret product announcements before mainnet deployment.',
    image_url: '/liaison_nft.png',
    opensea_url: `https://opensea.io/assets/ethereum/0xdb49fbb3ce99b2f7aa237be400200f67b5bd3f52/6`,
    rarity: 'Premium',
    category: 'Access Pass',
    price: '0.20 ETH',
    traits: [
      { trait_type: 'Class', value: 'Community' },
      { trait_type: 'Early Access', value: 'Yes' },
      { trait_type: 'Community Rank', value: 'Alpha Pioneer' },
    ]
  }
];

export const FALLBACK_STATS: CollectionStats = {
  name: 'Liaison Institutional NFTs',
  description: 'The official non-fungible token collection of the Liaison Protocol. Bridging physical gold reserves, sovereign smart contracts, and verified AI agent registries into the decentralized era.',
  imageUrl: '/liaison_nft.png',
  bannerUrl: '/liaison_nft.png',
  openseaUrl: `https://opensea.io/collection/${COLLECTION_SLUG}`,
  stats: {
    floorPrice: 0.20,
    totalVolume: 1485.45,
    owners: 642,
    itemsCount: 1000,
  }
};

// ── OpenSea API Requests ──────────────────────────────────────────
export async function getCollectionDetails(): Promise<CollectionStats> {
  const apiKey = import.meta.env.VITE_OPENSEA_API_KEY;
  const headers: HeadersInit = {
    'Accept': 'application/json',
  };
  if (apiKey) {
    headers['x-api-key'] = apiKey;
  }

  try {
    const res = await fetch(`/api/opensea/api/v2/collections/${COLLECTION_SLUG}`, {
      method: 'GET',
      headers,
    });

    if (!res.ok) {
      throw new Error(`OpenSea API collections returned: ${res.status}`);
    }

    const data = await res.json();
    
    // Process standard OpenSea stats
    return {
      name: data.name || FALLBACK_STATS.name,
      description: data.description || FALLBACK_STATS.description,
      imageUrl: data.image_url || FALLBACK_STATS.imageUrl,
      bannerUrl: data.banner_image_url || FALLBACK_STATS.bannerUrl,
      openseaUrl: `https://opensea.io/collection/${COLLECTION_SLUG}`,
      stats: {
        floorPrice: data.floor_price !== undefined ? parseFloat(data.floor_price) : FALLBACK_STATS.stats.floorPrice,
        totalVolume: data.total_volume !== undefined ? parseFloat(data.total_volume) : FALLBACK_STATS.stats.totalVolume,
        owners: data.num_owners !== undefined ? parseInt(data.num_owners) : FALLBACK_STATS.stats.owners,
        itemsCount: data.total_supply !== undefined ? parseInt(data.total_supply) : FALLBACK_STATS.stats.itemsCount,
      }
    };
  } catch (error) {
    console.warn('OpenSea API failed, using premium Fallback Stats:', error);
    return FALLBACK_STATS;
  }
}

export async function getCollectionNFTs(): Promise<{ items: NFTItem[]; isLive: boolean }> {
  const apiKey = import.meta.env.VITE_OPENSEA_API_KEY;
  const headers: HeadersInit = {
    'Accept': 'application/json',
  };
  if (apiKey) {
    headers['x-api-key'] = apiKey;
  }

  try {
    const res = await fetch(`/api/opensea/api/v2/collection/${COLLECTION_SLUG}/nfts?limit=20`, {
      method: 'GET',
      headers,
    });

    if (!res.ok) {
      throw new Error(`OpenSea API nfts returned: ${res.status}`);
    }

    const data = await res.json();
    const rawItems = data.nfts || [];
    
    if (rawItems.length === 0) {
      return { items: FALLBACK_NFTS, isLive: false };
    }

    const items: NFTItem[] = rawItems.map((nft: any, index: number) => {
      // Extract traits
      const traits = (nft.traits || []).map((t: any) => ({
        trait_type: t.trait_type || t.name,
        value: t.value
      }));

      // Rarity assessment based on index / details
      let rarity: 'Legendary' | 'Epic' | 'Rare' | 'Premium' = 'Premium';
      if (index === 0 || index === 1) rarity = 'Legendary';
      else if (index < 5) rarity = 'Epic';
      else if (index < 10) rarity = 'Rare';

      // Custom price tags for display
      const priceList = ['1.50 ETH', '2.80 ETH', '0.85 ETH', '0.75 ETH', '0.45 ETH', '0.20 ETH'];
      const price = priceList[index % priceList.length];

      return {
        identifier: nft.identifier || String(index + 1),
        name: nft.name || `Liaison Agent Asset #${nft.identifier}`,
        description: nft.description || 'Verified Liaison algorithmic protocol digital collection item.',
        image_url: nft.image_url || '/liaison_nft.png',
        opensea_url: nft.opensea_url || `https://opensea.io/assets/ethereum/0xdb49fbb3ce99b2f7aa237be400200f67b5bd3f52/${nft.identifier}`,
        traits,
        rarity,
        category: traits.find((t: any) => t.trait_type === 'Class')?.value || 'Asset',
        price,
      };
    });

    return { items, isLive: true };
  } catch (error) {
    console.warn('OpenSea API failed, using premium Fallback NFTs:', error);
    return { items: FALLBACK_NFTS, isLive: false };
  }
}
