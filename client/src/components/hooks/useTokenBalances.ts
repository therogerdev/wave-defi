import { useReadContracts } from "wagmi";
import { useAtomValue } from "jotai";
import { tokenMapAtom } from "@/store/tokensAtom";
import { Token } from "@/store/pairListAtom";

export const useTokenBalances = (
  tokenA: Partial<Token>,
  tokenB: Partial<Token>,
  walletAddress: `0x${string}` | undefined
) => {
  const tokens = useAtomValue(tokenMapAtom);

  const { data: balances } = useReadContracts({
    contracts: [
      {
        address: tokenA?.address,
        abi: tokenA?.address ? tokens[tokenA.address]?.abi : undefined,
        functionName: "balanceOf",
        args: [walletAddress],
      },
      {
        address: tokenB?.address,
        abi: tokenB?.address ? tokens[tokenB.address]?.abi : undefined,
        functionName: "balanceOf",
        args: [walletAddress],
      },
    ],
    query: {
      enabled: !!walletAddress && !!tokenA && !!tokenB,
    },
  });

  return {
    balanceTokenA: balances?.[0]?.result
      ? BigInt(balances[0].result.toString())
      : BigInt(0),
    balanceTokenB: balances?.[1]?.result
      ? BigInt(balances[1].result.toString())
      : BigInt(0),
  };
};
