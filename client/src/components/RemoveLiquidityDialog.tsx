import TokenPairContract from "@/abis/TokenPair.json";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Token } from "@/store/pairListAtom";
import { ArrowDownIcon } from "lucide-react";
import { useState } from "react";
import { formatUnits } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";

export default function RemoveLiquidityDialog({
  tokenA,
  tokenB,
  pairAddress,
}: {
  tokenA: Token;
  tokenB: Token;
  pairAddress: `0x${string}`;
}) {
  const [lpAmount, setLpAmount] = useState<bigint>(BigInt(25));

  const { address: walletAddress } = useAccount();

  const { data: reserves } = useReadContract({
    address: pairAddress,
    abi: TokenPairContract.abi,
    functionName: "getReserves",
  }) as { data?: [bigint, bigint, bigint] };

  const { data: lpBalance } = useReadContract({
    address: pairAddress as `0x${string}`,
    abi: TokenPairContract.abi,
    functionName: "balanceOf",
    args: [walletAddress as `0x${string}`],
  }) as { data?: bigint };

  const { data: totalSupply } = useReadContract({
    address: pairAddress,
    abi: TokenPairContract.abi,
    functionName: "totalSupply",
  }) as { data?: bigint };

  // Calculate estimated payouts
  const estimatedTokenA =
    reserves && totalSupply && totalSupply > 727323861838727246337
      ? (reserves[0] * lpAmount) / totalSupply // All values remain as BigInt
      : BigInt(0);
  const estimatedTokenB =
    reserves && totalSupply
      ? (reserves[1] * lpAmount) / totalSupply
      : BigInt(0);

  console.log("lpAmount:", lpAmount.toString());
  console.log("lpBalance:", lpBalance?.toString());
  console.log("totalSupply:", totalSupply?.toString());
  console.log("reserves[0]:", reserves?.[0]?.toString());

  console.log("estimatedTokenA:", estimatedTokenA.toString());

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full">
          Remove Liquidity
        </Button>
      </DialogTrigger>
      <DialogContent className="border-none bg-card rounded-lg">
        <DialogHeader>
          <DialogTitle>
            {`Remove Liquidity - ${tokenA.symbol}/${tokenB.symbol}`}{" "}
          </DialogTitle>
          <DialogDescription className="pr-3">
            Remove liquidity from the pool.
          </DialogDescription>
          <Card className="bg-transparent border-none">
            <CardContent>
              {/* Content */}
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
                              (BigInt(lpBalance ?? 0) * BigInt(percent)) /
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
                      value={[
                        (Number(lpAmount) / Number(lpBalance ?? 1)) * 100,
                      ]}
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

                <div className=" border border-accent text-accent container rounded-lg">
                  {/* <h2 className="font-semibold px-2 py-1">
                    You will receive approximately:
                  </h2> */}
                  <div className="flex justify-between px-4 py-2">
                    <Label>{tokenA.symbol}</Label>
                    <Label>
                      {" "}
                      {estimatedTokenA
                        ? Number(formatUnits(estimatedTokenA, 18))
                        : "0"}
                    </Label>
                  </div>
                  <div className="flex  justify-between w-full px-4 pt-2 pb-1  ">
                    <div className="">{tokenB.symbol}</div>
                    <div className="space-x-2">
                      {Number(formatUnits(estimatedTokenB, 18))}
                    </div>
                  </div>
                </div>

                <div className="mt-10 border border-accent text-accent grid grid-cols-3 container rounded-lg">
                  <div className="flex justify-between px-4 py-2 ">
                    <Label>Price</Label>
                    <Label></Label>
                  </div>
                  <div className=" justify-between px-4 py-2 col-span-2 flex flex-col items-end gap-y-2  ">
                    <Label>1 {tokenA.symbol} = 12312</Label>
                    <Label>1 {tokenB.symbol} = 12312</Label>
                  </div>
                </div>

                <div className="mt-10 text-md text-accent px-4 rounded-lg">
                  <h2 className="font-semibold mb-2">
                    LP Token in your wallet
                  </h2>
                  <div className=" space-y-1">
                    <div className="flex justify-between text-sm ">
                      <div>
                        {tokenA.symbol}/{tokenB.symbol} - LP
                      </div>
                      <span>{formatUnits(BigInt(lpBalance ?? 0), 18)}</span>
                    </div>
                    <div className="flex justify-between text-sm  ">
                      <div>{tokenA.symbol}</div>
                      <span>{formatUnits(BigInt(reserves?.[0] ?? 0), 18)}</span>
                    </div>
                    <div className="flex justify-between text-sm  ">
                      <div>{tokenB.symbol}</div>
                      <span>{formatUnits(BigInt(reserves?.[1] ?? 0), 18)}</span>
                    </div>
                  </div>
                </div>
                <Button className="mt-2 w-full" variant={"wave"}>
                  Remove Liquidity
                </Button>
              </div>
              {/* End Content */}
            </CardContent>
          </Card>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
