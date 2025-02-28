import { useReadContract } from "wagmi";
import { useAtomValue } from "jotai";
import { tokenMapAtom } from "@/store/tokensAtom";
import { Token } from "../../store/pairListAtom";

interface TokenAllowances {
  tokenA: Token;
  tokenB: Token;
  walletAddress: `0x${string}` | undefined;
  routerAddress: `0x${string}`;
}

export const useTokenAllowances = ({
  tokenA,
  tokenB,
  walletAddress,
  routerAddress,
}: TokenAllowances) => {
  const tokens = useAtomValue(tokenMapAtom);

  const { data: rawAllowanceTokenA } = useReadContract({
    address: tokenA.address,
    abi: tokens[tokenA.address]?.abi,
    functionName: "allowance",
    args: [walletAddress, routerAddress],
  });

  const { data: rawAllowanceTokenB } = useReadContract({
    address: tokenB.address,
    abi: tokens[tokenB.address]?.abi,
    functionName: "allowance",
    args: [walletAddress, routerAddress],
  });

  // make sure values are always bigint
  const allowanceTokenA =
    typeof rawAllowanceTokenA === "bigint" ? rawAllowanceTokenA : BigInt(0);
  const allowanceTokenB =
    typeof rawAllowanceTokenB === "bigint" ? rawAllowanceTokenB : BigInt(0);

  return { allowanceTokenA, allowanceTokenB };
};
