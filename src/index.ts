import { ethers } from "hardhat";

ethers.provider.on("block", async () => {
  //   console.log(await ethers.provider.getBlock("latest"));
  const pairAddr = "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852";
  const pair = await ethers.getContractAt(["function getReserves() view returns (uint112, uint112, uint32)"], pairAddr);
  const reserves = await pair.getReserves();
  console.log(`${reserves[0].toString()} ----- ${reserves[1].toString()}`);
});
