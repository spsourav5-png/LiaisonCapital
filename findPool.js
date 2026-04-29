import { ethers } from 'ethers';

async function main() {
  const p = new ethers.JsonRpcProvider("https://ethereum-rpc.publicnode.com");
  
  // Uniswap V3 Factory
  const factoryAddress = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
  const factoryAbi = ["function getPool(address tokenA, address tokenB, uint24 fee) view returns (address pool)"];
  const factory = new ethers.Contract(factoryAddress, factoryAbi, p);

  const LIAISON = "0xa2f93b5333E82E281764005b88EEfdC9E1dEC921";
  const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

  // Check common fees: 100, 500, 3000, 10000
  const fees = [100, 500, 3000, 10000];
  
  for (let fee of fees) {
    let poolUsdt = await factory.getPool(LIAISON, USDT, fee);
    if (poolUsdt !== "0x0000000000000000000000000000000000000000") {
      console.log(`Found LIAISON/USDT pool at fee ${fee}: ${poolUsdt}`);
    }
    
    let poolWeth = await factory.getPool(LIAISON, WETH, fee);
    if (poolWeth !== "0x0000000000000000000000000000000000000000") {
      console.log(`Found LIAISON/WETH pool at fee ${fee}: ${poolWeth}`);
    }
  }
}

main().catch(console.error);
