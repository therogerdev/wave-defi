import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Abi, parseUnits } from "viem";
import AMMRouter from "@/abis/AMMRouter.json";
import { Token } from "@/store/pairListAtom";

export type TokenMap = Record<string, { abi: Abi; decimals: number }>;

export const useApproveTokens = (
  tokenA: Token,
  tokenB: Token,
  tokens: TokenMap
) => {
  const { data: txHash, writeContract, isPending } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleApproveTokens = async (amounts: string[]) => {
    if (!tokenA || !tokenB || !tokens || !AMMRouter.address) return;

    const amountTokenA = parseUnits(
      amounts[0],
      tokens[tokenA.address]?.decimals || 18
    );
    const amountTokenB = parseUnits(
      amounts[1],
      tokens[tokenB.address]?.decimals || 18
    );

    writeContract({
      address: tokenA.address,
      abi: tokens[tokenA.address]?.abi,
      functionName: "approve",
      args: [AMMRouter.address, amountTokenA],
    });

    writeContract({
      address: tokenB.address,
      abi: tokens[tokenB.address]?.abi,
      functionName: "approve",
      args: [AMMRouter.address, amountTokenB],
    });
  };

  return { handleApproveTokens, isPending, isLoading, isSuccess };
};
