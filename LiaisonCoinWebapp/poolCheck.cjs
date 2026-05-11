const { ethers } = require("ethers");

async function main() {
    const provider = new ethers.JsonRpcProvider("https://ethereum-rpc.publicnode.com");
    const pool = "0x91D2cC80F8A26587D1858b25DD580531260D600B";
    const poolContract = new ethers.Contract(pool, ["function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)"], provider);
    const slot0 = await poolContract.slot0();
    
    const sqrtPriceX96 = slot0.sqrtPriceX96;
    const price = (Number(sqrtPriceX96) / 2**96) ** 2 * 10**(18 - 6);
    console.log(`Price of LIAISON: ${price} USDT`);
}

main().catch(console.error);
