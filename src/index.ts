import { ethers } from "hardhat";
import { WETH, ChainId, Token, Fetcher, Route } from "@uniswap/sdk";

const USDT = new Token(ChainId.MAINNET, "0xdac17f958d2ee523a2206206994597c13d831ec7", 6);

ethers.provider.on("block", async block => {
  const _latestBlock = await ethers.provider.getBlock("latest");
  // QUESTION: will we need any details of the latest block in order to assess an arbitrage?
  // console.log(latestBlock);
  console.log("BLOCK #" + _latestBlock.number + "\n");

  const uniswapPair = await Fetcher.fetchPairData(USDT, WETH[USDT.chainId]);
  console.log("\ttoken0Price: \t" + uniswapPair.token0Price.toSignificant(6));
  console.log("\ttoken1Price: \t" + uniswapPair.token1Price.toSignificant(6) + "\n");
  const route = new Route([uniswapPair], WETH[USDT.chainId]);
  console.log("\tMidprice method:\t1 ETH =\t" + route.midPrice.toSignificant(6) + " USDT\n");

  const gasEstimate = await ethers.provider.getGasPrice();
  const gasEstimateInEth = gasEstimate.toNumber() / 1000000000000000000;
  const gasEstimateInGwei = gasEstimate.toNumber() / 1000000000;
  console.log(
    "\tGAS estimate:\t " + `${gasEstimateInEth.toFixed(18)}` + " ETH\t" + `${gasEstimateInGwei.toFixed(9)}` + " Gwei",
  );

  console.log("------------------------------");
});
