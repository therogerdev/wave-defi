/**
 * Fetches a list of all available liquidity pools from the AquaSwap protocol.
 *
 * @returns {Promise<Pool[]>} An array of `Pool` objects, each representing a liquidity pool.
 * @throws {Error} If there is an error fetching the pool data.
 */

// const fetchPools = async (): Promise<Pool[]> => {
//    Implementation details omitted for brevity
// };

/**
 * An atom that automatically fetches and refreshes the list of available liquidity pools.
  export const pairListAtom = atomWithRefresh(fetchPools);
 */

import AquaSwap from "@/abis/AquaSwap.json";
import LiquidityPoolFactory from "@/abis/LiquidityPoolFactory.json";
import TokenPairAbi from "@/abis/TokenPair.json";
import WaveToken from "@/abis/WaveToken.json";
import { Contract, JsonRpcProvider } from "ethers";
import { atomWithRefresh } from "jotai/utils";
const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

export interface Token {
  symbol: string;
  address: `0x${string}`;
}

export interface Pool {
  pairAddress: `0x${string}`;
  tokenA: Token;
  tokenB: Token;
}

const fetchPools = async (): Promise<Pool[]> => {
  try {
    const pairFactory = new Contract(
      LiquidityPoolFactory.address,
      LiquidityPoolFactory.abi,
      provider
    );

    const allPairsLength = await pairFactory.allPairsLength();
    const allPairs: Pool[] = [];

    for (let i = 0; i < allPairsLength; i++) {
      const pairAddress = await pairFactory.allPairs(i);
      const pairContract = new Contract(
        pairAddress,
        TokenPairAbi.abi,
        provider
      );

      const tokenA = await pairContract.tokenA();
      const tokenB = await pairContract.tokenB();

      const tokenAContract = new Contract(tokenA, AquaSwap.abi, provider);
      const tokenBContract = new Contract(tokenB, WaveToken.abi, provider);

      const tokenASymbol = await tokenAContract.symbol();
      const tokenBSymbol = await tokenBContract.symbol();

      allPairs.push({
        pairAddress,
        tokenA: { symbol: tokenASymbol, address: tokenA },
        tokenB: { symbol: tokenBSymbol, address: tokenB },
      });
    }

    return allPairs;
  } catch (error: unknown) {
    console.error(
      "🚨 Error fetching pools:",
      error instanceof Error ? error.message : String(error)
    );
    return [];
  }
};

export const pairListAtom = atomWithRefresh(fetchPools);
