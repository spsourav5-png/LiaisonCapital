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

// ── Real Collection Fallbacks (Keeps Vercel live even without API keys!) ──

export const REAL_FALLBACK_NFTS: NFTItem[] = [
  {
    identifier: '3',
    name: 'Liaison Key',
    description: 'The Liaison NFT collection represents a fundamental pillar of the $LIA / $LIAC token ecosystem. Rather than serving purely as digital collectibles, these assets are strictly utility-driven digital keys. Holders of the Genesis Collection unlock exclusive community channels, professional trading insights, and high-level strategic opportunities.',
    image_url: 'https://i2c.seadn.io/ethereum/0xe63e055f8d1fd6fdffb1e874e3aeff2c9964fd77/0f6a7bc2bf04c4b8a999b581f94c13/190f6a7bc2bf04c4b8a999b581f94c13.png',
    opensea_url: `https://opensea.io/item/ethereum/0xe63e055f8d1fd6fdffb1e874e3aeff2c9964fd77/3`,
    rarity: 'Epic',
    category: 'Liquidity Portal',
    price: '1.00 USDC',
    traits: [
      { trait_type: 'Standard', value: 'ERC-1155' },
      { trait_type: 'Class', value: 'Genesis Access' },
      { trait_type: 'Blockchain', value: 'Ethereum' }
    ]
  },
  {
    identifier: '1',
    name: 'Liaison Genesis',
    description: 'Unlock the decentralized future. The Liaison Capital Genesis NFT is an exclusive ERC-721 digital key granting elite ecosystem access, strategic alpha, and proprietary market insights. Bridge traditional finance with DeFi and step into the next generation of modular protocols.',
    image_url: 'https://i2c.seadn.io/ethereum/0xe63e055f8d1fd6fdffb1e874e3aeff2c9964fd77/12e7087168c1a14c38519a9ecba3b1/2f12e7087168c1a14c38519a9ecba3b1.png',
    opensea_url: `https://opensea.io/item/ethereum/0xe63e055f8d1fd6fdffb1e874e3aeff2c9964fd77/1`,
    rarity: 'Legendary',
    category: 'Genesis Key',
    price: '10.00 USDC',
    traits: [
      { trait_type: 'Standard', value: 'ERC-1155' },
      { trait_type: 'Class', value: 'Genesis Access' },
      { trait_type: 'Blockchain', value: 'Ethereum' }
    ]
  }
];

export const REAL_FALLBACK_STATS: CollectionStats = {
  name: 'Liaison',
  description: 'The Liaison NFT collection represents a fundamental pillar of the $LIA / $LIAC token ecosystem. Rather than serving purely as digital collectibles, these assets are strictly utility-driven digital keys. Holders of the Genesis Collection unlock exclusive community channels, professional trading insights, and high-level strategic opportunities.',
  imageUrl: 'https://i2c.seadn.io/collection/liaison-669783293/image_type_logo/12e7087168c1a14c38519a9ecba3b1/2f12e7087168c1a14c38519a9ecba3b1.png',
  bannerUrl: 'https://i2c.seadn.io/collection/liaison-669783293/image_type_hero_desktop/1e7c7055dfbd3e557d0fb20aaaa1f0/131e7c7055dfbd3e557d0fb20aaaa1f0.jpeg?fit=inside',
  openseaUrl: `https://opensea.io/collection/${COLLECTION_SLUG}`,
  stats: {
    floorPrice: 0,
    totalVolume: 0,
    owners: 2,
    itemsCount: 40000,
  }
};

// ── OpenSea API Requests (Live with Real Fallback) ──────────────────

export async function getCollectionDetails(): Promise<CollectionStats | null> {
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
    
    return {
      name: data.name || REAL_FALLBACK_STATS.name,
      description: data.description || REAL_FALLBACK_STATS.description,
      imageUrl: data.image_url || REAL_FALLBACK_STATS.imageUrl,
      bannerUrl: data.banner_image_url || REAL_FALLBACK_STATS.bannerUrl,
      openseaUrl: `https://opensea.io/collection/${COLLECTION_SLUG}`,
      stats: {
        floorPrice: data.floor_price !== undefined ? parseFloat(data.floor_price) : 0,
        totalVolume: data.total_volume !== undefined ? parseFloat(data.total_volume) : 0,
        owners: data.unique_item_count !== undefined ? parseInt(data.unique_item_count) : REAL_FALLBACK_STATS.stats.owners,
        itemsCount: data.total_supply !== undefined ? parseInt(data.total_supply) : REAL_FALLBACK_STATS.stats.itemsCount,
      }
    };
  } catch (error) {
    console.warn('OpenSea Details API call failed, using real fallback assets:', error);
    return REAL_FALLBACK_STATS;
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

  // 1. Fetch active listings first to get real-time price tags from Seaport
  let listingsMap: Record<string, string> = {};
  try {
    const listingsRes = await fetch(`/api/opensea/api/v2/listings/collection/${COLLECTION_SLUG}/all?limit=50`, {
      method: 'GET',
      headers,
    });
    if (listingsRes.ok) {
      const listingsData = await listingsRes.json();
      const listingsList = listingsData.listings || [];
      listingsList.forEach((listing: any) => {
        try {
          const offer = listing.protocol_data?.parameters?.offer?.[0];
          const tokenId = offer?.identifierOrCriteria;
          const currentPriceObj = listing.price?.current;
          
          if (tokenId && currentPriceObj) {
            const rawValue = currentPriceObj.value;
            const decimals = currentPriceObj.decimals || 18;
            const currency = currentPriceObj.currency || 'ETH';
            const valueFloat = parseFloat(rawValue) / Math.pow(10, decimals);
            
            // Divide total order price by bundle quantity (startAmount) to get the actual unit price!
            const quantity = parseFloat(offer?.startAmount || '1') || 1;
            const unitPrice = valueFloat / quantity;
            
            listingsMap[tokenId] = `${unitPrice.toFixed(2)} ${currency}`;
          }
        } catch (err) {
          console.warn('Failed parsing Seaport listing:', err);
        }
      });
    }
  } catch (error) {
    console.warn('OpenSea Listings API failed:', error);
  }

  // 2. Fetch the actual collection NFTs
  try {
    const res = await fetch(`/api/opensea/api/v2/collection/${COLLECTION_SLUG}/nfts?limit=20`, {
      method: 'GET',
      headers,
    });

    if (!res.ok) {
      throw new Error(`OpenSea API nfts returned status: ${res.status}`);
    }

    const data = await res.json();
    const rawItems = data.nfts || [];
    
    if (rawItems.length === 0) {
      return { items: REAL_FALLBACK_NFTS, isLive: false };
    }

    const items: NFTItem[] = rawItems.map((nft: any, index: number) => {
      const traits = (nft.traits || []).map((t: any) => ({
        trait_type: t.trait_type || t.name,
        value: t.value
      }));

      // Rarity tagging based on identifier / metadata
      let rarity: 'Legendary' | 'Epic' | 'Rare' | 'Premium' = 'Premium';
      if (nft.identifier === '1') rarity = 'Legendary';
      else if (nft.identifier === '3') rarity = 'Epic';

      // Match with Seaport listing price if available, otherwise map to proper listing price
      const livePrice = listingsMap[nft.identifier] || (nft.identifier === '1' ? '10.00 USDC' : '1.00 USDC');

      return {
        identifier: nft.identifier || String(index + 1),
        name: nft.name || (nft.identifier === '1' ? 'Liaison Genesis' : 'Liaison Key'),
        description: nft.description || 'Verified Liaison algorithmic protocol digital utility key.',
        image_url: nft.image_url || (nft.identifier === '1' 
          ? 'https://i2c.seadn.io/ethereum/0xe63e055f8d1fd6fdffb1e874e3aeff2c9964fd77/12e7087168c1a14c38519a9ecba3b1/2f12e7087168c1a14c38519a9ecba3b1.png'
          : 'https://i2c.seadn.io/ethereum/0xe63e055f8d1fd6fdffb1e874e3aeff2c9964fd77/0f6a7bc2bf04c4b8a999b581f94c13/190f6a7bc2bf04c4b8a999b581f94c13.png'),
        opensea_url: `https://opensea.io/item/ethereum/0xe63e055f8d1fd6fdffb1e874e3aeff2c9964fd77/${nft.identifier}`,
        traits,
        rarity,
        category: nft.identifier === '1' ? 'Genesis Key' : 'Liquidity Portal',
        price: livePrice,
      };
    });

    return { items, isLive: true };
  } catch (error) {
    console.error('OpenSea NFTs API query failed, falling back to real assets:', error);
    return { items: REAL_FALLBACK_NFTS, isLive: false };
  }
}
