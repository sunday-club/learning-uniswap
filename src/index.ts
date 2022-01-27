import { ethers } from "hardhat";

ethers.provider.on("block", async block => {
  const blockNumber = await ethers.provider.getBlock("latest");
  // console.log(await ethers.provider.getBlock("latest"));
  const uniswapPairAddr = "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852";
  const uniswapPair = await ethers.getContractAt(
    ["function getReserves() view returns (uint112, uint112, uint32)"],
    uniswapPairAddr,
  );
  const reserves = await uniswapPair.getReserves();
  console.log(
    `\nBLOCK # ${
      blockNumber.number
    }\n  UniSwap Pair Reserves:\n\t ${reserves[0].toString()} ----- ${reserves[1].toString()}\n`,
  );

  const sushiSwapPairAddr = "0x06da0fd433C1A5d7a4faa01111c044910A184553";
  const sushiSwapPair = await ethers.getContractAt(
    ["function getReserves() view returns (uint112, uint112, uint32)"],
    sushiSwapPairAddr,
  );
  const reservesSushiSwap = await sushiSwapPair.getReserves();
  console.log(
    `  SushiSwap Pair Reverves:\n\t ${reservesSushiSwap[0].toString()} ---- ${reservesSushiSwap[1].toString()}\n===================================================`,
  );
});
