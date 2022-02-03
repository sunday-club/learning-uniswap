import { ethers } from "hardhat";
import { Pair, WETH, ChainId, Token, TokenAmount, Fetcher, Route } from "@uniswap/sdk";

const USDT = new Token(ChainId.MAINNET, "0xdac17f958d2ee523a2206206994597c13d831ec7", 6, "USDT", "Tether");

ethers.provider.on("block", async block => {
  const _latestBlock = await ethers.provider.getBlock("latest");
  // QUESTION: will we need any details of the latest block in order to assess an arbitrage?
  // console.log(latestBlock);
  console.log("\n" + "BLOCK #" + block + "\n");

  const uniswapPairAddr = "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852";
  const sushiSwapPaidAddr = "0x06da0fd433c1a5d7a4faa01111c044910a184553";

  // calculating price values using the uniswap pair contract
  const uniswapPairContract = await ethers.getContractAt(
    ["function getReserves() view returns (uint112, uint112, uint32)"],
    uniswapPairAddr,
  );
  console.log("UNISWAP PRICE VALUES (DERIVED FROM PAIR CONTRACT)\n");
  const uniReserves = await uniswapPairContract.getReserves();
  const weth_uni_reserve = uniReserves[0];
  const usdt_uni_reserve = uniReserves[1];
  const uni_constantProduct = weth_uni_reserve * usdt_uni_reserve;
  console.log("uni constant product = \t" + uni_constantProduct + "\n");
  console.log("rWETH/rUSDT == " + weth_uni_reserve / usdt_uni_reserve);
  console.log("rUSDT/rWETH == " + usdt_uni_reserve / weth_uni_reserve + "\n");
  console.log("Uniswap Reserve Values:\t" + uniReserves);

  // calculating price values using the sushi swap pair contract
  const sushiswapPairContract = await ethers.getContractAt(
    ["function getReserves() view returns (uint112, uint112, uint32)"],
    sushiSwapPaidAddr,
  );
  console.log("SUSHISWAP PRICE VALUES (DERIVED FROM PAIR CONTRACT)\n");
  const sushiReserves = await sushiswapPairContract.getReserves();
  const weth_sushi_reserve = sushiReserves[0];
  const usdt_sushi_reserve = sushiReserves[1];
  const sushi_constantProduct = weth_sushi_reserve * usdt_sushi_reserve;
  console.log("sushi constant product = \t" + sushi_constantProduct + "\n");
  console.log("rWETH/rUSDT == " + weth_sushi_reserve / usdt_sushi_reserve);
  console.log("rUSDT/rWETH == " + usdt_sushi_reserve / weth_sushi_reserve + "\n");
  console.log("Sushiswap Reserve Values:\t" + sushiReserves);

  console.log("UNISWAP SDK:");
  const uniswapPair = await Fetcher.fetchPairData(USDT, WETH[USDT.chainId]);

  const currPrice = uniswapPair.priceOf(WETH[USDT.chainId]);
  console.log("- Using priceOf() Pair method:\n\t - " + currPrice.toSignificant(6) + "USDT per WETH");

  const inputAmt = new TokenAmount(USDT, "3000");
  const outputAmount = uniswapPair.getOutputAmount(inputAmt);
  console.log("");

  console.log("- Using Pair object parameter tokenPrice:");
  console.log("\t" + uniswapPair.token0Price.toSignificant(6) + " USDT per WETH");
  console.log("\t" + uniswapPair.token1Price.toSignificant(6) + " WETH per USDT\n");

  const route = new Route([uniswapPair], WETH[USDT.chainId]);
  console.log("- Using Route midprice method:");
  console.log("\t" + route.midPrice.toSignificant(6) + " USDT per WETH\n");

  console.log("SUSHISWAP COMING SOON...\n\n");

  const _gasEstimate = await ethers.provider.getGasPrice();
  const gasEstimateInEth = _gasEstimate.toNumber() / 1000000000000000000;
  const gasEstimateInGwei = _gasEstimate.toNumber() / 1000000000;
  console.log(
    "= Gas Estimate:\n\t" +
      `${gasEstimateInEth.toFixed(18)}` +
      " ETH\n" +
      "\t" +
      `${gasEstimateInGwei.toFixed(3)}` +
      " Gwei",
  );

  console.log("------------------------------------------------------");
  console.log("------------------------------------------------------");

  // // do something with this later
  // const tradeData = {
  //   latestBlock : _latestBlock,
  //   token0Price : uniswapPair.token0Price,
  //   token1Price : uniswapPair.token1Price,
  //   gasEstimate : _gasEstimate
  // };
});
