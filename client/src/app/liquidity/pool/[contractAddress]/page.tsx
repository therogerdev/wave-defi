"use client";
import AMMRouter from "@/abis/AMMRouter.json";
import TokenPair from "@/abis/TokenPair.json";
import { useTokenAllowances } from "@/components/hooks/useTokenAllowances";
import useTransactions from "@/components/hooks/useTransactions";
import { PageWrapper } from "@/components/PageWrapper";
import PoolDetailLoading from "@/components/Pool/PoolDetailLoading";
import { transactionColumns } from "@/components/tables/columns";
import TransactionsTable from "@/components/tables/TransactionsTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatNumber, handleCopy } from "@/lib/utils";
import { fetchPoolDetail } from "@/store/pairListAtom";
import { useQuery } from "@tanstack/react-query";
import { Copy } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useAccount, useReadContract } from "wagmi";

const routerAddress = AMMRouter.address as `0x${string}`;

export const PoolDetail = () => {
  const contractAddress = useParams().contractAddress as `0x${string}`;
  const [, setOpenDialog] = useState(false);
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
    enabled: Boolean(contractAddress && walletAddress && isConnected),
  });

  const router = useRouter();

  const { data: lpAlllowance } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: TokenPair.abi,
    functionName: "allowance",
    args: [walletAddress as `0x${string}`, contractAddress as `0x${string}`],
  }) as { data?: bigint };

  const lpAllowanceBigInt = useMemo(
    () => BigInt(lpAlllowance || 0),
    [lpAlllowance]
  );

  const { allowanceTokenA, allowanceTokenB } = useTokenAllowances({
    tokenA: pair?.tokenA,
    tokenB: pair?.tokenB,
    walletAddress,
    routerAddress,
  });

  const formattedTotalSupply = useMemo(
    () => (pair?.totalSupply ? formatNumber(pair?.totalSupply) : "N/A"),
    [pair?.totalSupply]
  );

  const toggleDialog = useCallback(() => {
    setOpenDialog((prev) => !prev);
  }, []);

  if (isLoading || isConnecting) {
    return <PoolDetailLoading />;
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="text-center text-red-500">
          <p>⚠️ Failed to load pool details.</p>
          <Button onClick={() => router.back()} className="mt-2">
            Back
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      breadcrumbs={[
        { label: "Pools", href: "/liquidity/pool" },
        { label: `${pair?.tokenA.symbol} / ${pair?.tokenB.symbol}` },
      ]}
      actions={
        <div className="flex justify-between gap-x-4">
          <Link href={`/liquidity/pool/${pair?.pairAddress}/add-liquidity`}>
            <Button variant={"wave"} className="w-full">
              Add Liquidity{" "}
            </Button>
          </Link>
          <Link href={`/liquidity/pool/${pair?.pairAddress}/remove-liquidity`}>
            <Button variant={"ghost"} className="w-full">
              Remove Liquidity{" "}
            </Button>
          </Link>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 px-1 md:px-2 lg:px-4">
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

                <p>{formattedTotalSupply}</p>
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
              <div className="grid gap-2 text-accent">
                <Label htmlFor="reserves" className="font-bold">
                  Reserves
                </Label>

                <div className="">
                  <p>
                    {pair?.tokenA.symbol} -{" "}
                    {pair?.reserves?.reserveA
                      ? formatNumber(BigInt(pair.reserves.reserveA))
                      : "N/A"}{" "}
                  </p>
                  <p>
                    {pair?.tokenB.symbol} -{" "}
                    {pair?.reserves?.reserveB
                      ? formatNumber(BigInt(pair.reserves.reserveB))
                      : "N/A"}{" "}
                  </p>
                </div>
              </div>
              <div className="grid gap-2 text-accent">
                {" "}
                <Label htmlFor="lpallowance" className="font-bold">
                  LP Allowance
                </Label>
                <div className="flex items-center">
                  <p className="">{formatNumber(lpAllowanceBigInt)}</p>
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

        <Card className="col-span-1 md:col-span-2 md:row-span-2 text-foreground flex flex-col min-h-[600px] ">
          <h2 className="text-lg font-bold p-4">Pair Transactions</h2>
          <ScrollArea className="flex-1 overflow-auto">
            <TransactionsTable
              contractAddress={pair?.pairAddress as `0x${string}`}
            />
          </ScrollArea>
        </Card>

        <Card className=" col-span-1 row-span-1 text-foreground min-h-64"></Card>
      </div>
    </PageWrapper>
  );
};
export default PoolDetail;
