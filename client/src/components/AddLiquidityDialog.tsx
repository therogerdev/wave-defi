import AMMRouterContract from "@/abis/AMMRouter.json";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { pairListAtom, Pool } from "@/store/pairListAtom";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useAtom } from "jotai";
import { Loader2, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { formatEther, parseUnits } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import { useTokenBalances } from "./hooks/useTokenBalances";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const AddLiquidityDialog = ({ tokenA, tokenB, pairAddress }: Pool) => {
  const { address: userWalletAddress } = useAccount();
  const [refreshPools] = useAtom(pairListAtom);
  const [open, setOpen] = useState(false);
  const { balanceTokenA, balanceTokenB } = useTokenBalances(
    tokenA,
    tokenB,
    userWalletAddress
  );
  const { writeContractAsync } = useWriteContract();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      amountA: "",
      amountB: "",
    },
  });

  const onSubmit = async (data: { amountA: string; amountB: string }) => {
    const amountA = parseUnits(data.amountA, 18);
    const amountB = parseUnits(data.amountB, 18);

    if (balanceTokenA < amountA || balanceTokenB < amountB) {
      toast.error("Insufficient balance");
      return;
    }

    await writeContractAsync(
      {
        address: AMMRouterContract.address as `0x${string}`,
        abi: AMMRouterContract.abi,
        functionName: "addLiquidity",
        args: [
          tokenA.address,
          tokenB.address,
          amountA,
          amountB,
          0,
          0,
          userWalletAddress,
          Math.floor(Date.now() / 1000) + 60 * 10,
        ],
      },
      {
        onSuccess: () => {
          reset();
          setOpen(false);
          toast("Liquidity added successfully", {
            description: "You can now trade the pair",
          });
        },
        onError: (error) => {
          console.error(error);
          toast("Error adding liquidity", {
            description: error.message,
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} variant="wave" className="w-full">
          Add Liquidity
        </Button>
      </DialogTrigger>
      <DialogContent className="border-none bg-card rounded-lg">
        <DialogHeader>
          <DialogTitle>
            {`Add Liquidity - ${tokenA.symbol}/${tokenB.symbol}`}{" "}
          </DialogTitle>
          <DialogDescription className="pr-3">
            Add liquidity to the pool.
          </DialogDescription>
          <Card className="bg-transparent border-none">
            <CardContent>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <div>
                  <li
                    key={tokenA.address}
                    className="flex justify-between items-center gap-x-3 px-2 space-y-2"
                  >
                    <Label className="md:w-16 font-bold text-accent text-md">
                      {tokenA.symbol}:
                    </Label>
                    <div className="flex-1">
                      <div className="bg-[#EEEAF4] dark:bg-zinc-600 flex justify-end gap-x-2 items-center px-2 text-xs rounded-t-lg h-6 text-foreground dark:text-foreground/70">
                        <p className="font-bold text-accent/90 dark:text-foreground/70">
                          Your Balance:
                        </p>
                        <p className=" text-accent">
                          {formatEther(balanceTokenA)}
                        </p>
                      </div>
                      <Input
                        {...register("amountA", {
                          required: "Amount is required",
                          min: {
                            value: 0.0001,
                            message: "Minimum amount is 0.0001",
                          },
                          pattern: {
                            value: /^\d+(\.\d{1,18})?$/,
                            message: "Invalid number format",
                          },
                        })}
                        type="number"
                        step="0.0001"
                        className="text-md bg-[#EEEAF4] text-accent text-right focus-visible:ring-0 font-semibold dark:text-accent dark:bg-zinc-600 rounded-t-none border-t-0 border-none dark:border-zinc-600 shadow-sm h-12"
                      />
                    </div>
                  </li>
                  {errors.amountA && (
                    <p className="text-red-500">{errors.amountA.message}</p>
                  )}
                </div>

                <div>
                  <li
                    key={tokenB.address}
                    className="flex justify-between items-center gap-x-3 px-2 space-y-2"
                  >
                    <Label className="md:w-16 font-bold text-accent text-md">
                      {tokenB.symbol}:
                    </Label>
                    <div className="flex-1">
                      <div className="bg-[#EEEAF4] dark:bg-zinc-600 flex justify-end gap-x-2 items-center px-2 text-xs rounded-t-lg h-6 text-foreground dark:text-foreground/70">
                        <p className="font-bold text-accent/90 dark:text-foreground/70">
                          Your Balance:
                        </p>
                        <p className=" text-accent">
                          {formatEther(balanceTokenB)}
                        </p>
                      </div>
                      <Input
                        {...register("amountB", {
                          required: "Amount is required",
                          min: {
                            value: 0.0001,
                            message: "Minimum amount is 0.0001",
                          },
                          pattern: {
                            value: /^\d+(\.\d{1,18})?$/,
                            message: "Invalid number format",
                          },
                        })}
                        type="number"
                        step="0.0001"
                        className="text-md bg-[#EEEAF4] text-accent text-right focus-visible:ring-0 font-semibold dark:text-accent dark:bg-zinc-600 rounded-t-none border-t-0 border-none dark:border-zinc-600 shadow-sm h-12"
                      />
                    </div>
                  </li>
                  {errors.amountA && (
                    <p className="text-red-500">{errors.amountB?.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                  variant="wave"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding Liquidity...
                    </>
                  ) : (
                    <>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Add Liquidity
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddLiquidityDialog;
