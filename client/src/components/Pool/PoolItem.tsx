import AMMRouter from "@/abis/AMMRouter.json";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatNumber, handleCopy } from "@/lib/utils";
import { Pool } from "@/store/pairListAtom";
import { tokenMapAtom } from "@/store/tokensAtom";
import { useAtomValue } from "jotai";
import { Copy } from "lucide-react";
import { useAccount, useReadContract } from "wagmi";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

const PoolItem: React.FC<Pool> = ({ pairAddress, tokenA, tokenB }) => {
  const { address: walletAddress, isConnected } = useAccount();
  const tokens = useAtomValue(tokenMapAtom);
  const tokenAAbi = tokens[tokenA.address].abi;
  const tokenBAbi = tokens[tokenB.address].abi;
  const { data: allowanceTokenA } = useReadContract({
    address: pairAddress,
    abi: tokenAAbi,
    functionName: "allowance",
    args: [walletAddress, AMMRouter.address],
  });
  const { data: allowanceTokenB } = useReadContract({
    address: pairAddress,
    abi: tokenAAbi,
    functionName: "allowance",
    args: [walletAddress, AMMRouter.address],
  });

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="flex ">
            <Avatar className="-mr-4 ">
              <AvatarImage />
              <AvatarFallback className="bg-red-300">
                {tokenA.symbol}
              </AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage />
              <AvatarFallback className="bg-orange-500">
                {tokenB.symbol}
              </AvatarFallback>
            </Avatar>
          </CardTitle>
          <CardDescription>{`${tokenA.symbol}/${tokenB.symbol}`}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul>
            <li className="flex justify-between px-2 space-y-2">
              <Label className="text-muted-foreground font-semibold text-md">
                Reserve:
              </Label>
              <span className="text-foreground">1239.3235</span>
            </li>
            <li className="flex justify-between px-2 space-y-2">
              <Label className="text-muted-foreground font-semibold text-md">
                Total Liquidity:
              </Label>
              <span className="text-foreground">1239.3235</span>
            </li>
            <li className="flex justify-between px-2 space-y-2">
              <Label className="text-muted-foreground font-semibold text-md">
                {tokenA.symbol} Allowance:
              </Label>
              <span className="text-foreground">
                {" "}
                {formatNumber(allowanceTokenA as bigint)}
              </span>
            </li>
            <li className="flex justify-between px-2 space-y-2">
              <Label className="text-muted-foreground font-semibold text-md">
                {tokenB.symbol} Allowance:
              </Label>
              <span className="text-foreground">
                {formatNumber(allowanceTokenB as bigint)}
              </span>
            </li>
            <li className="flex items-center justify-between px-2 space-y-2">
              <Label className="text-muted-foreground font-semibold text-md">
                Address:
              </Label>
              <span className="text-foreground max-w-full truncate text-ellipsis w-28">
                <Button
                  onClick={() =>
                    handleCopy("0x2039482093840238409238402384029384029384")
                  }
                  size={"icon"}
                  className="bg-accent mr-2"
                >
                  <Copy className="icon" />
                </Button>
                0x2039482093840238409238402384029384029384
              </span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size={"lg"} variant="wave">
            Approve
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PoolItem;
