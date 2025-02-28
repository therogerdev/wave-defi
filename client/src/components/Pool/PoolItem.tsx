import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { handleCopy } from "@/lib/utils";
import { Copy } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import ApproveLpDialog from "./ApproveLpDialog";

import AMMRouter from "@/abis/AMMRouter.json";
import { Pool } from "@/store/pairListAtom";
import { useTokenAllowances } from "@/components/hooks/useTokenAllowances";
import TokenAllowance from "../TokenAllowance";

const routerAddress = AMMRouter.address as `0x${string}`;

const PoolItem = ({ pairAddress, tokenA, tokenB }: Pool) => {
  const { address: walletAddress } = useAccount();
  const [openDialog, setOpenDialog] = useState(false);

  // Custom Hook for Allowances
  const { allowanceTokenA, allowanceTokenB } = useTokenAllowances({
    tokenA,
    tokenB,
    walletAddress,
    routerAddress,
  });
  const toggleDialog = useCallback(() => setOpenDialog((prev) => !prev), []);

  return (
    <div>
      <Card className="w-full dark:hover:dark:bg-zinc-800/70 hover:bg-zinc-800/10">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="flex ">
            <Avatar className="-mr-4 ">
              <AvatarImage src="" alt={tokenA.symbol} />
              <AvatarFallback className="bg-red-300">
                {tokenA.symbol}
              </AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="" alt={tokenB.symbol} />
              <AvatarFallback className="bg-orange-500">
                {tokenB.symbol}
              </AvatarFallback>
            </Avatar>
          </CardTitle>
          <CardDescription className="font-bold text-lg">{`${tokenA.symbol}/${tokenB.symbol}`}</CardDescription>
        </CardHeader>
        <CardContent className="">
          <ul>
            <li className="flex justify-between px-2 space-y-2">
              <Label className="text-muted-foreground font-bold text-md">
                Reserve:
              </Label>
              <span className="text-foreground text-sm">1239.3235</span>
            </li>
            <li className="flex justify-between px-2 space-y-2">
              <Label className="text-muted-foreground font-bold text-md">
                Total Liquidity:
              </Label>
              <span className="text-foreground text-sm">1239.3235</span>
            </li>
            <TokenAllowance token={tokenA} allowance={allowanceTokenA} />
            <TokenAllowance token={tokenB} allowance={allowanceTokenB} />
            <li className="flex items-center justify-between px-2 space-y-2">
              <Label className="text-muted-foreground font-bold text-md">
                Address:
              </Label>
              <span className="text-foreground text-sm max-w-full truncate text-ellipsis w-28">
                <Button
                  onClick={() => handleCopy(pairAddress)}
                  size="icon"
                  className="bg-accent mr-2"
                >
                  <Copy className="icon" />
                </Button>
                {pairAddress}
              </span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          {allowanceTokenA === BigInt(0) && allowanceTokenB === BigInt(0) ? (
            <Button
              onClick={toggleDialog}
              className="w-full"
              size="lg"
              variant="wave"
            >
              Approve
            </Button>
          ) : (
            <div className="flex w-full justify-between space-x-2">
              <Button variant="wave" className="w-full">
                Add Liquidity
              </Button>
              <Button
                variant="ghost"
                size={"sm"}
                className="w-full border-muted-foreground text-muted-foreground dark:text-foreground"
              >
                Remove Liquidity
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
      <ApproveLpDialog
        tokenA={tokenA}
        tokenB={tokenB}
        open={openDialog}
        pairAddress={pairAddress}
        setOpen={setOpenDialog}
      />
    </div>
  );
};

export default memo(PoolItem);
