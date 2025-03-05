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
import { atom } from "jotai";
import { atomWithRefresh } from "jotai/utils";
import { useAccount } from "wagmi";
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

type PoolDetail = {
  pairAddress: string;
  tokenA: Token;
  tokenB: Token;
  reserves: { reserveA: bigint; reserveB: bigint };
  allowance: { tokenA: bigint; tokenB: bigint };
  totalSupply: bigint;
};

export const poolDetailAtom = atom({
  key: "poolDetail",
  default: null,
});
export const fetchPoolDetail = async (
  pairAddress: `0x${string}`,
  walletAddress: `0x${string}`
): Promise<PoolDetail | null> => {
  try {
    const pairContract = new Contract(pairAddress, TokenPairAbi.abi, provider);

    // Fetch token addresses
    const tokenA = await pairContract.tokenA();
    const tokenB = await pairContract.tokenB();

    // Create contract instances for tokens
    const tokenAContract = new Contract(tokenA, AquaSwap.abi, provider);
    const tokenBContract = new Contract(tokenB, WaveToken.abi, provider);

    // Fetch symbols
    const tokenASymbol = await tokenAContract.symbol();
    const tokenBSymbol = await tokenBContract.symbol();

    // Fetch reserves
    const { _reserveA, _reserveB } = await pairContract.getReserves();

    // Fetch Total Supply
    const totalSupply = await pairContract.totalSupply();

    // Fetch allowances
    const allowanceTokenA = await tokenAContract.allowance(
      pairAddress,
      walletAddress
    );
    const allowanceTokenB = await tokenBContract.allowance(
      pairAddress,
      walletAddress
    );

    return {
      pairAddress,
      tokenA: { symbol: tokenASymbol, address: tokenA },
      tokenB: { symbol: tokenBSymbol, address: tokenB },
      reserves: {
        reserveA: _reserveA.toString(),
        reserveB: _reserveB.toString(),
      },
      allowance: {
        tokenA: allowanceTokenA,
        tokenB: allowanceTokenB,
      },
      totalSupply: totalSupply,
    };
  } catch (error) {
    console.error(
      "🚨 Error fetching pool details:",
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
};

export const pairListAtom = atomWithRefresh(fetchPools);
