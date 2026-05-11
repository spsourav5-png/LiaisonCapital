import { ethers } from 'ethers';
async function main() {
  const p = new ethers.JsonRpcProvider("https://ethereum-rpc.publicnode.com");
  const pool = new ethers.Contract("0x91D2cC80F8A26587D1858b25DD580531260D600B", ["function slot0() view returns (uint160 sqrtPriceX96)"], p);
  const slot0 = await pool.slot0();
  const sqrtPriceX96 = slot0.sqrtPriceX96;
  const price = (Number(sqrtPriceX96) / 2**96) ** 2 * 10**(18 - 6);
  console.log("Price:", price);
}
main();
