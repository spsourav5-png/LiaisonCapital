import { ethers } from 'ethers';

async function main() {
  const p = new ethers.JsonRpcProvider("https://ethereum-rpc.publicnode.com");
  
  // NonfungiblePositionManager
  const positionManagerAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
  const positionManagerAbi = ["function positions(uint256 tokenId) view returns (uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)"];
  const pm = new ethers.Contract(positionManagerAddress, positionManagerAbi, p);

  const pos = await pm.positions(1253919);
  console.log("Position:", pos);
  console.log("token0:", pos[2]);
  console.log("token1:", pos[3]);
  console.log("fee:", pos[4]);
  
  const factoryAddress = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
  const factoryAbi = ["function getPool(address tokenA, address tokenB, uint24 fee) view returns (address pool)"];
  const factory = new ethers.Contract(factoryAddress, factoryAbi, p);
  
  const pool = await factory.getPool(pos[2], pos[3], pos[4]);
  console.log("Pool Address:", pool);
}

main().catch(console.error);
