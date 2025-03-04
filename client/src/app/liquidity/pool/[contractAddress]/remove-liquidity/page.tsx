"use client";
import AmmRouter from "@/abis/AMMRouter.json";
import TokenPairContract from "@/abis/TokenPair.json";
import { PageWrapper } from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { formatNumber } from "@/lib/utils";
import { fetchPoolDetail } from "@/store/pairListAtom";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownIcon, ArrowLeft, Loader2, MinusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { formatUnits, parseUnits } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

export const RemoveLiquidity = () => {
  const { contractAddress } = useParams();
  const { address: walletAddress, isConnected, isConnecting } = useAccount();
  const [lpAmount, setLpAmount] = useState<bigint>(BigInt(25));
  const router = useRouter();
  const [slippage, setSlippage] = useState(1);

  const { writeContractAsync, isPending } = useWriteContract();

  const { data: reserves } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: TokenPairContract.abi,
    functionName: "getReserves",
  }) as { data?: [bigint, bigint, bigint] };

  const { data: lpBalance } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: TokenPairContract.abi,
    functionName: "balanceOf",
    args: walletAddress ? [walletAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!walletAddress && !!contractAddress,
    },
  }) as { data?: bigint };

  const { data: totalSupply } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: TokenPairContract.abi,
    functionName: "totalSupply",
  }) as { data?: bigint };

  // Calculate estimated payouts
  const estimatedTokenA =
    reserves && totalSupply
      ? (reserves[0] * lpAmount) / totalSupply
      : BigInt(0);
  const estimatedTokenB =
    reserves && totalSupply
      ? (reserves[1] * lpAmount) / totalSupply
      : BigInt(0);

  const { data: pair } = useQuery({
    queryKey: ["pair", contractAddress],
    queryFn: () =>
      fetchPoolDetail(
        contractAddress as `0x${string}`,
        walletAddress as `0x${string}`
      ),
    staleTime: 1000 * 60 * 5,
    enabled: !!contractAddress && isConnected,
  });

  const { data: walletBalanceA } = useReadContract({
    address: pair?.tokenA.address as `0x${string}`,
    abi: TokenPairContract.abi,
    functionName: "balanceOf",
    args: [walletAddress as `0x${string}`],
  }) as { data?: bigint };

  const { data: walletBalanceB } = useReadContract({
    address: pair?.tokenB.address as `0x${string}`,
    abi: TokenPairContract.abi,
    functionName: "balanceOf",
    args: [walletAddress as `0x${string}`],
  }) as { data?: bigint };

  const { data: lpAlllowance } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: TokenPairContract.abi,
    functionName: "allowance",
    args: [walletAddress, AmmRouter.address],
  }) as { data?: bigint };

  const handleApprove = async () => {
    const lpApprove = (await writeContractAsync({
      address: contractAddress as `0x${string}`,
      abi: TokenPairContract.abi,
      functionName: "approve",
      args: [AmmRouter.address, parseUnits("100000", 18)],
    })) as { data?: bigint };
  };

  const handleRemoveLiquidity = async () => {
    const deadline = parseInt((new Date().getTime() / 1000).toString()) + 10;

    if (
      !lpAlllowance ||
      lpAlllowance < lpAmount ||
      (walletBalanceA ?? BigInt(0)) < minAmountA ||
      (walletBalanceB ?? BigInt(0)) < minAmountB
    ) {
      alert("Approve LP Token Spend");
      return;
    }

    await writeContractAsync(
      {
        address: AmmRouter.address as `0x${string}`,
        abi: AmmRouter.abi,
        functionName: "removeLiquidity",
        args: [
          pair?.tokenA.address as `0x${string}`,
          pair?.tokenB.address as `0x${string}`,
          lpAmount,
          minAmountA,
          minAmountB,
          walletAddress as `0x${string}`,
          deadline,
        ],
      },
      {
        onSuccess: (data) => {
          console.log("Transaction data:", data);
          router.back();
          toast("Liquidity removed successfully", {
            description: data,
          });
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const ratioA =
    reserves && reserves[0] > BigInt(0) ? reserves[0] / reserves[1] : BigInt(0);
  const ratioB =
    reserves && reserves[1] > BigInt(0) ? reserves[1] / reserves[0] : BigInt(0);

  const handleSlippageChange = useCallback((percent: number) => {
    setSlippage(percent);
  }, []);

  const slippagePercent = BigInt(slippage);
  const slippageFactor = BigInt(100);

  const minAmountA =
    estimatedTokenA - (estimatedTokenA * slippagePercent) / slippageFactor;
  const minAmountB =
    estimatedTokenB - (estimatedTokenB * slippagePercent) / slippageFactor;

  const formattedTokenA = useMemo(
    () => Number(formatUnits(estimatedTokenA, 18)),
    [estimatedTokenA]
  );
  const formattedTokenB = useMemo(
    () => Number(formatUnits(estimatedTokenB, 18)),
    [estimatedTokenB]
  );

  return (
    <PageWrapper
      breadcrumbs={[
        { label: "Pools", href: "/liquidity/pool" },
        {
          label: `${pair?.tokenA.symbol}/${pair?.tokenB.symbol}`,
          href: `/liquidity/pool/${contractAddress}`,
        },
        { label: "Remove Liquidity", href: "" },
      ]}
    >
      <div className="max-w-lg mx-auto flex">
        <div className="px-2">
          <Button onClick={() => router.back()} variant={"ghost"} size={"icon"}>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Button>
        </div>
        <Card className="max-w-lg mx-auto">
          <CardContent>
            <div className="mt-5">
              <div className=" border border-accent container rounded-lg">
                <div className="flex justify-between p-4 text-accent ">
                  <Label className="customLabel">Amount</Label>
                  <Label>Detailed</Label>
                </div>
                <div className="flex justify-between w-full px-4 py-2 ">
                  <div className="">
                    <Input className="text-md focus-visible:ring-0 font-semibold dark:text-muted-foreground/70 bg-transparent  rounded-t-none border-t-0 border-transparent text-accent w-32  shadow-sm h-12" />
                  </div>
                  <div className="space-x-2">
                    {[25, 50, 75, 100].map((percent) => (
                      <Button
                        key={percent}
                        variant="outline"
                        className=" text-accent border border-accent"
                        size="sm"
                        onClick={() =>
                          setLpAmount(
                            ((lpBalance ?? BigInt(0)) * BigInt(percent)) /
                              BigInt(100)
                          )
                        }
                        disabled={lpBalance === BigInt(0)}
                      >
                        {percent}%
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="px-2">
                  <Slider
                    className="w-full my-2 bg-accent rounded-sm"
                    min={0}
                    max={100}
                    step={1}
                    value={[(Number(lpAmount) / Number(lpBalance ?? 1)) * 100]}
                    onValueChange={(val) =>
                      setLpAmount(
                        ((lpBalance ?? BigInt(0)) * BigInt(val[0])) /
                          BigInt(100)
                      )
                    }
                    disabled={lpBalance === BigInt(0)}
                  />
                </div>
              </div>

              <div className="p-5 flex justify-center rounded-lg">
                <ArrowDownIcon className="h-4 w-4 text-accent" />
              </div>

              <div className=" border border-accent px-4 py-2 text-accent container rounded-lg">
                <h2 className="font-semibold mb-2">
                  {" "}
                  You will receive approximately:
                </h2>
                <div className="flex justify-between py-2">
                  <Label>{pair?.tokenA.symbol}</Label>
                  <Label> {estimatedTokenA ? formattedTokenA : "0"}</Label>
                </div>
                <div className="flex  justify-between w-full pt-2 pb-1  ">
                  <div className="">{pair?.tokenB.symbol}</div>
                  <div className="space-x-2">{formattedTokenB}</div>
                </div>
              </div>

              <div className="mt-10 text-accent grid grid-cols-3 container rounded-lg">
                <div className="flex justify-between px-4 py-2">
                  <h2 className="font-semibold mb-2">Price</h2>
                  <Label></Label>
                </div>
                <div className="justify-between px-4 py-2 col-span-2 flex flex-col items-end gap-y-2">
                  <Label>
                    {reserves && reserves[1] > BigInt(0)
                      ? `1 ${pair?.tokenB.symbol} = ${ratioA} ${pair?.tokenA.symbol}`
                      : "Loading..."}
                  </Label>
                  <Label>
                    {reserves && reserves[0] > BigInt(0)
                      ? `1 ${pair?.tokenA.symbol} = ${ratioB} ${pair?.tokenB.symbol}`
                      : "Loading..."}
                  </Label>
                </div>
              </div>
              <div className="mt-10 text-accent flex flex-col container rounded-lg">
                <div className="flex justify-between px-4">
                  <h2 className="font-semibold mb-2">Slippage</h2>
                </div>
                <div className="justify-between px-4 py-2 col-span-2 flex items-end gap-y-2">
                  {[1, 3, 5, 10].map((percent) => (
                    <Button
                      key={percent}
                      variant={slippage === percent ? "default" : "outline"}
                      className={`text-accent border border-accent ${
                        slippage === percent ? "bg-accent text-white" : ""
                      }`}
                      size="sm"
                      onClick={() => handleSlippageChange(percent)}
                      disabled={lpBalance === BigInt(0)}
                    >
                      {percent}%
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mt-10 text-md text-accent px-4 rounded-lg">
                <h2 className="font-semibold mb-2">LP Token in your wallet</h2>
                <div className=" space-y-1">
                  <div className="flex justify-between text-sm ">
                    <div>
                      {pair?.tokenA.symbol}/{pair?.tokenB.symbol} - LP
                    </div>
                    <span>{formatNumber(BigInt(lpBalance ?? 0))}</span>
                  </div>
                  <div className="flex justify-between text-sm  ">
                    <div>{pair?.tokenA.symbol}</div>
                    <span>{formatNumber(BigInt(walletBalanceA ?? 0))}</span>
                  </div>
                  <div className="flex justify-between text-sm  ">
                    <div>{pair?.tokenB.symbol}</div>
                    <span>{formatNumber(BigInt(walletBalanceB ?? 0))}</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleRemoveLiquidity}
                className="mt-2 w-full"
                variant={"wave"}
              >
                {isPending ? (
                  <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                ) : (
                  <MinusIcon className="h-3.5 w-3.5 mr-2" />
                )}
                {isPending ? "waiting for confirmation" : "Remove Liquidity"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default RemoveLiquidity;
