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

// ── OpenSea API Requests (Pure Live, No Simulation) ──────────────────

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
      name: data.name || 'Liaison',
      description: data.description || 'Verified Liaison algorithmic protocol digital collection.',
      imageUrl: data.image_url || '/liaison_nft.png',
      bannerUrl: data.banner_image_url || '/liaison_nft.png',
      openseaUrl: `https://opensea.io/collection/${COLLECTION_SLUG}`,
      stats: {
        floorPrice: data.floor_price !== undefined ? parseFloat(data.floor_price) : 0,
        totalVolume: data.total_volume !== undefined ? parseFloat(data.total_volume) : 0,
        owners: data.unique_item_count !== undefined ? parseInt(data.unique_item_count) : 0,
        itemsCount: data.total_supply !== undefined ? parseInt(data.total_supply) : 0,
      }
    };
  } catch (error) {
    console.error('OpenSea API collection details call failed:', error);
    return null;
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
            
            listingsMap[tokenId] = `${valueFloat.toFixed(2)} ${currency}`;
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
    
    const items: NFTItem[] = rawItems.map((nft: any, index: number) => {
      const traits = (nft.traits || []).map((t: any) => ({
        trait_type: t.trait_type || t.name,
        value: t.value
      }));

      // Rarity tagging based on identifier / metadata
      let rarity: 'Legendary' | 'Epic' | 'Rare' | 'Premium' = 'Premium';
      if (nft.identifier === '1') rarity = 'Legendary';
      else if (nft.identifier === '3') rarity = 'Epic';

      // Match with Seaport listing price if available, otherwise mark as Unlisted
      const livePrice = listingsMap[nft.identifier] || 'Unlisted';

      return {
        identifier: nft.identifier || String(index + 1),
        name: nft.name || `Liaison Genesis NFT #${nft.identifier}`,
        description: nft.description || 'Verified Liaison algorithmic protocol digital utility key.',
        image_url: nft.image_url || '/liaison_nft.png',
        opensea_url: nft.opensea_url || `https://opensea.io/assets/ethereum/0xe63e055f8d1fd6fdffb1e874e3aeff2c9964fd77/${nft.identifier}`,
        traits,
        rarity,
        category: traits.find((t: any) => t.trait_type === 'Class')?.value || 'Access Pass',
        price: livePrice,
      };
    });

    return { items, isLive: true };
  } catch (error) {
    console.error('OpenSea NFTs API query failed:', error);
    return { items: [], isLive: false };
  }
}
