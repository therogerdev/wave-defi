"use client";
import { PageWrapper } from "@/components/PageWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { fetchPoolDetail } from "@/store/pairListAtom";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useAccount } from "wagmi";

import AMMRouter from "@/abis/AMMRouter.json";
import { useTokenAllowances } from "@/components/hooks/useTokenAllowances";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { formatNumber, handleCopy } from "@/lib/utils";
import { Copy } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { formatEther } from "viem";

const routerAddress = AMMRouter.address as `0x${string}`;

export const PoolDetail = () => {
  const [openDialog, setOpenDialog] = useState(false);
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

  const { allowanceTokenA, allowanceTokenB } = useTokenAllowances({
    tokenA: pair?.tokenA,
    tokenB: pair?.tokenB,
    walletAddress,
    routerAddress,
  });

  const toggleDialog = useCallback(() => setOpenDialog((prev) => !prev), []);

  if (isLoading || isConnecting) {
    return <PageWrapper>Loading...</PageWrapper>;
  }

  if (error) {
    return <PageWrapper>Error loading pool details.</PageWrapper>;
  }

  console.log("pair", pair?.tokenA);

  return (
    <PageWrapper
      breadcrumbs={[
        { label: "Pools", href: "/liquidity/pool" },
        { label: `${pair?.tokenA.symbol} / ${pair?.tokenB.symbol}` },
      ]}
    >
      <div className="grid grid-cols-3 grid-rows-2 gap-2 ">
        <Card className=" col-span-1">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="flex ">
              <Avatar className="-mr-4 ">
                <AvatarImage src="" alt={pair?.tokenA.symbol} />
                <AvatarFallback className="bg-red-300 text-white">
                  {pair?.tokenA.symbol}
                </AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="" alt={pair?.tokenB.symbol} />
                <AvatarFallback className="bg-orange-500 text-white">
                  {pair?.tokenB.symbol}
                </AvatarFallback>
              </Avatar>
            </CardTitle>
            <CardDescription className="text-foreground font-extrabold text-lg">{`${pair?.tokenA.symbol}/${pair?.tokenB.symbol}`}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2 text-accent">
                <Label htmlFor="totalSypply" className="font-bold">
                  Total Suply
                </Label>

                <p>
                  {pair?.totalSupply ? formatNumber(pair?.totalSupply) : "N/A"}
                </p>
              </div>
              <div className="grid gap-2 text-accent">
                {" "}
                <Label htmlFor="totalSypply" className="font-bold">
                  Address
                </Label>
                <div className="flex items-center">
                  <p className="truncate max-w-24 lg:max-w-32">
                    {pair?.pairAddress}
                  </p>
                  <Button
                    onClick={() => handleCopy(pair?.pairAddress as string)}
                    size="icon"
                    className="bg-accent mr-2"
                  >
                    <Copy className="icon" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2 col-span-2 text-accent">
                <Label htmlFor="" className="font-bold">
                  Reserves/Allowance:
                </Label>
                <div className="">
                  <p>
                    {pair?.tokenA.symbol} -{" "}
                    {pair?.reserves?.reserveA
                      ? formatEther(BigInt(pair.reserves.reserveA))
                      : "N/A"}{" "}
                    / {formatEther(allowanceTokenA)}
                  </p>
                  <p>
                    {pair?.tokenB.symbol} -{" "}
                    {pair?.reserves?.reserveB
                      ? formatEther(BigInt(pair.reserves.reserveB))
                      : "N/A"}{" "}
                    / {formatEther(allowanceTokenB)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {allowanceTokenA <= 0 && allowanceTokenB <= 0 && (
              <Button
                onClick={toggleDialog}
                className="bg-accent w-full"
                disabled={!isConnected}
              >
                Approve
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card className=" col-span-2 row-span-2 text-foreground">
          asdasdasdasdasd
        </Card>

        <Card className=" col-span-1 row-span-1 text-foreground">
        <Link href={`/liquidity/pool/${pair?.pairAddress}/add-liquidity`}>
            <Button variant={"wave"} className="w-full">
              Add Liquidity{" "}
            </Button>
          </Link>
          <Link href={`/liquidity/pool/${pair?.pairAddress}/remove-liquidity`}>
            <Button variant={"wave"} className="w-full">
              Remove Liquidity{" "}
            </Button>
          </Link>
        </Card>
      </div>
    </PageWrapper>
  );
};
export default PoolDetail;
