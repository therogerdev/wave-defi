"use client";
import AMMRouterContract from "@/abis/AMMRouter.json";
import { useTokenBalances } from "@/components/hooks/useTokenBalances";
import { PageWrapper } from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchPoolDetail } from "@/store/pairListAtom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, PlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { formatEther, parseUnits } from "viem";
import { useAccount, useWriteContract } from "wagmi";

export const AddLiquidity = () => {
  const AmmRouterAddress = AMMRouterContract.address as `0x${string}`;
  const router = useRouter();
  const { contractAddress } = useParams();
  const { address: walletAddress, isConnected, isConnecting } = useAccount();
  const {
    data: pair,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pair", contractAddress],
    queryFn: () =>
      fetchPoolDetail(
        contractAddress as `0x${string}`,
        walletAddress as `0x${string}`
      ),
    staleTime: 1000 * 60 * 5,
    enabled: !!contractAddress && isConnected,
  });
  const { balanceTokenA, balanceTokenB } = useTokenBalances(
    pair?.tokenA ?? {},
    pair?.tokenB ?? {},
    walletAddress
  );
  const { writeContractAsync } = useWriteContract();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: { amountA: "", amountB: "" },
  });

  const onSubmit = useCallback(
    async (data: { amountA: string; amountB: string }) => {
      const amountA = parseUnits(data.amountA, 18);
      const amountB = parseUnits(data.amountB, 18);
      const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

      if (
        !balanceTokenA ||
        !balanceTokenB ||
        balanceTokenA < amountA ||
        balanceTokenB < amountB
      ) {
        toast.error("Insufficient balance");
        return;
      }

      await writeContractAsync(
        {
          address: AmmRouterAddress,
          abi: AMMRouterContract.abi,
          functionName: "addLiquidity",
          args: [
            pair?.tokenA.address,
            pair?.tokenB.address,
            amountA,
            amountB,
            0,
            0,
            walletAddress,
            deadline,
          ],
        },
        {
          onSuccess: () => {
            router.back();
            reset();
            toast("✅ Liquidity Added Successfully", {
              description: "You can now trade this pair.",
            });
          },
          onError: (error) => {
            console.error(error);
            toast("❌ Transaction Failed", {
              description: error?.message || "Something went wrong.",
            });
          },
        }
      );
    },
    [
      AmmRouterAddress,
      pair?.tokenA.address,
      pair?.tokenB.address,
      balanceTokenA,
      balanceTokenB,
      walletAddress,
      router,
      reset,
      writeContractAsync,
    ]
  );

  if (isLoading || isConnecting) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <PageWrapper
      breadcrumbs={[
        { label: "Pools", href: "/liquidity/pool" },
        {
          label: `${pair?.tokenA.symbol}/${pair?.tokenB.symbol}`,
          href: `/liquidity/pool/${contractAddress}`,
        },
        { label: "Add Liquidity" },
      ]}
    >
      <div className="max-w-lg mx-auto flex">
        <Button onClick={() => router.back()} variant={"ghost"} size={"icon"}>
          <ArrowLeft className="w-3.5 h-3.5" />
        </Button>
        <Card className="max-w-lg mx-auto">
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div>
                <li
                  key={pair?.tokenA.address}
                  className="flex justify-between items-center gap-x-3 px-2 space-y-2"
                >
                  <Label className="md:w-16 font-bold text-accent text-md">
                    {pair?.tokenA.symbol}:
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
                  key={pair?.tokenB.address}
                  className="flex justify-between items-center gap-x-3 px-2 space-y-2"
                >
                  <Label className="md:w-16 font-bold text-accent text-md">
                    {pair?.tokenB.symbol}:
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
                {errors.amountB && (
                  <p className="text-red-500">{errors.amountB.message}</p>
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
      </div>
    </PageWrapper>
  );
};
export default AddLiquidity;
