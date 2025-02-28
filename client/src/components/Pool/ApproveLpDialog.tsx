/**
 * A dialog component that allows the user to approve LP tokens for a given pair of tokens.
 *
 * @param open - A boolean indicating whether the dialog is open or not.
 * @param setOpen - A function to set the open state of the dialog.
 * @param tokenA - The first token in the pair.
 * @param tokenB - The second token in the pair.
 * @param pairAddress - The address of the pair.
 */
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatNumber } from "@/lib/utils";
import { pairListAtom, Pool } from "@/store/pairListAtom";
import { tokenMapAtom } from "@/store/tokensAtom";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useApproveTokens } from "../hooks/useApproveTokens";
import { useTokenBalances } from "../hooks/useTokenBalances";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface ApproveLpDialogProps extends Pool {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ApproveLpDialog = ({
  open,
  setOpen,
  tokenA,
  tokenB,
  pairAddress,
}: ApproveLpDialogProps) => {
  const { address: walletAddress } = useAccount();
  const [amount, setAmount] = useState(["", ""]);
  const tokens = useAtomValue(tokenMapAtom);
  const refreshPools = useSetAtom(pairListAtom);

  const { balanceTokenA, balanceTokenB } = useTokenBalances(
    tokenA,
    tokenB,
    walletAddress
  );
  const { handleApproveTokens, isPending, isSuccess } = useApproveTokens(
    tokenA,
    tokenB,
    tokens
  );

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      refreshPools(); // Triggers refresh of pools
      // TODO: Remove refetch once websocket is implemented
    }
  }, [isSuccess, setOpen, refreshPools]);

  const handleAmountChange = useCallback(
    (index: number, value: string) => {
      setAmount((prev) => {
        const newAmounts = [...prev];
        newAmounts[index] = value;
        return newAmounts;
      });
    },
    [setAmount]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="border-none bg-card rounded-lg">
        <DialogHeader>
          <DialogTitle>Approve LP Tokens</DialogTitle>
          <DialogDescription className="pr-3">
            Approve {tokenA.symbol} and {tokenB.symbol} to allow the contract to
            use them for liquidity.
          </DialogDescription>
          <Card className="bg-transparent border-none">
            <CardContent>
              <ul>
                {[tokenA, tokenB].map((token, index) => (
                  <li
                    key={token.address}
                    className="flex justify-between items-center gap-x-3 px-2 space-y-2"
                  >
                    <Label className="md:w-16 text-muted-foreground font-semibold text-md">
                      {token.symbol}:
                    </Label>
                    <div className="flex-1">
                      <div className="bg-slate-400 dark:bg-zinc-600 flex justify-end gap-x-2 items-center px-2 text-xs rounded-t-lg h-6 text-foreground dark:text-foreground/70">
                        <p className="font-semibold">Your Balance:</p>
                        <p className="">
                          {formatNumber(
                            index === 0 ? balanceTokenA : balanceTokenB
                          )}
                        </p>
                      </div>
                      <Input
                        value={amount[index]}
                        onChange={(e) =>
                          handleAmountChange(index, e.target.value)
                        }
                        className="text-md focus-visible:ring-0 font-semibold dark:text-foreground/70 bg-slate-400 dark:bg-zinc-600 rounded-t-none border-t-0 border-slate-400 dark:border-zinc-600 shadow-sm h-12"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                variant="wave"
                onClick={() => handleApproveTokens(amount)}
                disabled={isPending}
              >
                {isPending ? "Approving..." : "Approve Allowance"}
              </Button>
            </CardFooter>
          </Card>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ApproveLpDialog;
