import { ethers } from 'ethers';
async function main() {
  const p = new ethers.JsonRpcProvider("https://ethereum-rpc.publicnode.com");
  const pool = new ethers.Contract("0x91D2cC80F8A26587D1858b25DD580531260D600B", ["function slot0() view returns (uint160, int24, uint16, uint16, uint16, uint8, bool)"], p);
  const slot0 = await pool.slot0();
  console.log(slot0);
  const sqrtPriceX96 = slot0[0];
  console.log("sqrtPriceX96:", sqrtPriceX96.toString());
  const price = (Number(sqrtPriceX96) / 2**96) ** 2 * 10**(18 - 6);
  console.log("Price:", price);
}
main();
