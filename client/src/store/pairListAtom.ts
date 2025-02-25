import { atom } from "jotai";
import { Contract, JsonRpcProvider } from "ethers";
import LiquidityPoolFactory from "@/abis/LiquidityPoolFactory.json";
import TokenPairAbi from "@/abis/TokenPair.json";
import WaveToken from "@/abis/WaveToken.json";
import AquaSwap from "@/abis/AquaSwap.json";

export const pairListAtom = atom(async () => {
  try {
    const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

    const pairFactory = new Contract(
      LiquidityPoolFactory.address,
      LiquidityPoolFactory.abi,
      provider
    );

    const allPairsLength = await pairFactory.allPairsLength();

    const allPairs = [];

    for (let i = 0; i < allPairsLength; i++) {
      // Get the pair contract address from LiquidityPoolFactory
      const pairAddress = await pairFactory.allPairs(i);

      // Create an instance of the pair contract
      const pairContract = new Contract(
        pairAddress,
        TokenPairAbi.abi,
        provider
      );

      // Fetch tokenA and tokenB from the pair contract
      const tokenA = await pairContract.tokenA();
      const tokenB = await pairContract.tokenB();

      // Fetch the token symbols from the AquaSwap contract
      const tokenAContract = new Contract(tokenA, AquaSwap.abi, provider);
      const tokenBContract = new Contract(tokenB, WaveToken.abi, provider);

      const tokenASymbol = await tokenAContract.symbol();
      const tokenBSymbol = await tokenBContract.symbol();

      console.log("Fetching token symbols...", tokenASymbol, tokenBSymbol);

      allPairs.push({
        pairAddress,
        tokenA: { symbol: tokenASymbol },
        tokenB: { symbol: tokenBSymbol },
      });
    }

    return allPairs;
  } catch (error: unknown) {
    console.error(
      "🚨 Error fetching pairs:",
      error instanceof Error ? error.message : String(error)
    );
    return [];
  }
});
