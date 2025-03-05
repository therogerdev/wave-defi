import TokenPair from "@/abis/TokenPair.json";
import { tokenListAtom } from "@/store/tokensAtom";
import { Contract, JsonRpcProvider } from "ethers";
import { useAtomValue } from "jotai";
import { Abi } from "viem";

const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

export const fetchPoolDetail = async (
  pairAddress: `0x${string}`,
  walletAddress: `0x${string}`,
  tokenList: Record<string, { address: string; abi: Abi }>
) => {
  try {
    const pairContract = new Contract(pairAddress, TokenPair.abi, provider);

    // Fetch token addresses
    const tokenA = await pairContract.tokenA();
    const tokenB = await pairContract.tokenB();

    // Get token details from the provided tokenList
    const tokenAData = Object.values(tokenList).find(
      (token) => token.address === tokenA
    );
    const tokenBData = Object.values(tokenList).find(
      (token) => token.address === tokenB
    );

    if (!tokenAData || !tokenBData) {
      throw new Error("Token data not found in atom");
    }

    // Create contract instances for tokens
    const tokenAContract = new Contract(
      tokenAData.address,
      TokenPair.abi,
      provider
    );
    const tokenBContract = new Contract(
      tokenBData.address,
      TokenPair.abi,
      provider
    );

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
