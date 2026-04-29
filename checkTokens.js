import { ethers } from 'ethers';
async function main() {
  const p = new ethers.JsonRpcProvider("https://ethereum-rpc.publicnode.com");
  const pool = new ethers.Contract("0x91D2cC80F8A26587D1858b25DD580531260D600B", ["function token0() view returns (address)", "function token1() view returns (address)"], p);
  console.log("Token0:", await pool.token0());
  console.log("Token1:", await pool.token1());
}
main();
