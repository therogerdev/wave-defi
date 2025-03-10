"use client";
import { Button } from "@/components/ui/button";
import { Check, Plus, RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAccount, useWriteContract } from "wagmi";

import LiquidityPoolFactory from "@/abis/LiquidityPoolFactory.json";
import { ComboBoxDialog } from "@/components/ComboBoxDialog";
import { PageWrapper } from "@/components/PageWrapper";
import { validatePair } from "@/components/Pool/utils/validateToken";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { tokenDropdownOptionsAtom } from "@/store/tokensAtom";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { toast } from "sonner";

export default function CreatePool() {
  const { isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  const tokensList = useAtomValue(tokenDropdownOptionsAtom);
  const [tokenA, setTokenA] = useState<string>("");
  const [tokenB, setTokenB] = useState<string>("");
  const router = useRouter();

  const resetSelection = () => {
    setTokenA("");
    setTokenB("");
  };

  const executeCreatePair = () => {
    writeContract(
      {
        address: LiquidityPoolFactory.address as `0x${string}`,
        abi: LiquidityPoolFactory.abi,
        functionName: "createPair",
        args: [tokenA, tokenB],
      },
      {
        onSuccess: () => {
          toast("✅ Pair Created!");
          resetSelection();
          router.push("/liquidity/pool");
        },
        onError: (error) => {
          console.error("Transaction Failed:", error);
          toast("❌ Transaction Failed", { description: error.message });
        },
      }
    );
  };

  const handleCreatePair = async () => {
    if (!isConnected) {
      toast("Please Connect Wallet", {
        description: "Connect your wallet to create a pair",
      });
      return;
    }

    if (!validatePair(tokenA, tokenB)) {
      return;
    }

    executeCreatePair();
  };

  return (
    <>
      <PageWrapper className="">
        <div className=" rounded-2xl grid grid-cols-1 lg:grid-cols-4 gap-x-4">
          <div className="border border-slate-100 hidden lg:block rounded-2xl min-h-40 col-span-1 ">
            steps
          </div>
          <div className="mx-1 rounded-2xl pt-5 pb-20 border border-slate-100 col-span-3 justify-center grid grid-rows-4 ">
            <div className="flex flex-col  mb-4 row-span-full">
              <div className="flex flex-col w-full justify-end lg:px-20 lg:flex-row gap-y-2">
                <Button
                  onClick={resetSelection}
                  variant={"outline"}
                  size={"xs"}
                  disabled={tokenA === "" && tokenB === ""}
                >
                  <RotateCw className="mr-2 h-3.5 w-3.5" />
                  Reset
                </Button>
              </div>
              <Label className="relative px-3 py-0 text-foreground text-2xl font-sans font-semibold ">
                Select Pair
              </Label>
              <Label className="relative px-3 py-1 text-sm text-foreground/60  ">
                Select the tokens you want to pair for liquidity provisioning.
                Earn fees and incentives.
              </Label>
            </div>
            <div className="flex flex-col lg:flex-row gap-y-2">
              <ComboBoxDialog
                title="Select Token"
                description="Choose a token to create a pair"
                options={tokensList}
                defaultValue={tokenA}
                placeholder="Search token..."
                onSelect={setTokenA}
              />
              <ComboBoxDialog
                title="Select Token"
                description="Choose a token to create a pair"
                options={tokensList.filter((token) => token.value !== tokenA)}
                defaultValue={tokenB}
                placeholder="Search token..."
                onSelect={setTokenB}
              />
            </div>
            <div className="w-full flex justify-start">
              <CreatePoolFees />
            </div>
            <div className="px-3">
              <Button
                disabled={isPending}
                onClick={handleCreatePair}
                variant={"wave"}
                size={"lg"}
              >
                {isPending ? (
                  <RotateCw className="animate-spin h-3.5 w-3.5" />
                ) : (
                  <Plus className="h-3.5 w-3.5" />
                )}
                Create Pool
              </Button>
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}

export const feeOptions = [
  { value: "0.01", label: "0.01%", description: "Best for small trades" },
  { value: "0.03", label: "0.05%", description: "Best for medium trades" },
  { value: "1.0", label: "1.0%", description: "Best for complex trades" },
];

export const CreatePoolFees = () => {
  return (
    <div className="w-fulll p-4 ">
      <RadioGroup
        defaultValue={feeOptions[0].value}
        className="grid grid-cols-3 max-w-md mx-auto justify-center items-center text-center "
      >
        {feeOptions.map((fee, i) => {
          return (
            <div key={i}>
              <RadioGroupItem
                value={fee.value}
                id={fee.value}
                className="peer sr-only"
                aria-label="Card"
              />
              <div className="border-2 border-muted dark:border-white/70 peer-data-[state=checked]:border-secondary rounded-md [&:has([data-state=checked])]:border-secondary hover:bg-secondary/20  flex flex-col  gap-y-4  hover:text-accent-foreground py-4 px-1 w-32">
                <div
                  className="flex justify-between items-center px-2
            "
                >
                  <Label
                    htmlFor={fee.value}
                    className="font-bold text-foreground "
                  >
                    {fee.label}
                  </Label>
                  <Check className="h-4 w-4 dark:stroke-white/70  stroke-black  peer-data-[state=unchecked]:invisible  peer-data-[state=checked]:visible" />
                </div>

                <Label
                  htmlFor={fee.value}
                  className="text-xs text-left text-foreground/70"
                >
                  {fee.description}
                </Label>
              </div>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};
