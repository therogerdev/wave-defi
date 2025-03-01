import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { Abi, parseUnits } from "viem";
import AMMRouter from "@/abis/AMMRouter.json";
import { Token } from "@/store/pairListAtom";
import { toast } from "sonner";

export type TokenMap = Record<string, { abi: Abi; decimals: number }>;

export const useApproveTokens = (
  tokenA: Token,
  tokenB: Token,
  tokens: TokenMap
) => {
  const { data: txHash, writeContract, isPending } = useWriteContract();
  const { isConnected } = useAccount();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleApproveTokens = async (amounts: string[]) => {
    if (!tokenA || !tokenB || !tokens || !AMMRouter.address) {
      return toast("Error: Invalid input");
    }

    if (!isConnected) {
      return toast("Error: Wallet not connected");
    }

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
