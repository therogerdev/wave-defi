import { useReadContract } from "wagmi";
import { useAtomValue } from "jotai";
import { tokenMapAtom } from "@/store/tokensAtom";
import { Token } from "../../store/pairListAtom";

interface TokenAllowances {
  tokenA?: Token;
  tokenB?: Token;
  walletAddress?: `0x${string}`;
  routerAddress: `0x${string}`;
}

export const useTokenAllowances = ({
  tokenA,
  tokenB,
  walletAddress,
  routerAddress,
}: TokenAllowances) => {
  const tokens = useAtomValue(tokenMapAtom);

  const enabled = !!tokenA && !!tokenB && !!walletAddress;

  const { data: rawAllowanceTokenA } = useReadContract({
    address: tokenA?.address,
    abi: tokenA ? tokens[tokenA.address]?.abi : undefined,
    functionName: "allowance",
    args: tokenA && walletAddress ? [walletAddress, routerAddress] : undefined,
    query: {
      enabled,
    },
  });

  const { data: rawAllowanceTokenB } = useReadContract({
    address: tokenB?.address,
    abi: tokenB ? tokens[tokenB.address]?.abi : undefined,
    functionName: "allowance",
    args: tokenB && walletAddress ? [walletAddress, routerAddress] : undefined,
    query: {
      enabled,
    },
  });

  // Ensure values are always bigint
  const allowanceTokenA =
    typeof rawAllowanceTokenA === "bigint" ? rawAllowanceTokenA : BigInt(0);
  const allowanceTokenB =
    typeof rawAllowanceTokenB === "bigint" ? rawAllowanceTokenB : BigInt(0);

  return { allowanceTokenA, allowanceTokenB };
};
