"use client";

import { Button } from "@/components/ui/button";
import { Check, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAccount, useWriteContract } from "wagmi";

import { ComboBoxDialog } from "@/components/ComboBoxDialog";
import { PageWrapper } from "@/components/PageWrapper";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { tokenDropdownOptionsAtom } from "@/store/tokensAtom";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { toast } from "sonner";
import LiquidityPoolFactory from "@/abis/LiquidityPoolFactory.json";

export default function CreatePool() {
  const { isConnected } = useAccount();
  const { writeContract, isPending, isError, error } = useWriteContract();
  const tokensList = useAtomValue(tokenDropdownOptionsAtom);
  const [tokenA, setTokenA] = useState<string>("");
  const [tokenB, setTokenB] = useState<string>("");
  const router = useRouter();

  const handleCreatePair = async () => {
    if (!tokenA || !tokenB || tokenA === tokenB) {
      toast("Invalid Pair Selection", {
        icon: <>❌</>,
        position: "top-center",
        description: "Please select two different tokens",
        action: (
          <Button
            variant={"default"}
            size={"sm"}
            onClick={() => router.push("/")}
          >
            Go Home
          </Button>
        ),
      });

      return;
    }

    if (!isConnected) {
      toast("Please Connect Wallet", {
        icon: <>❌</>,
        position: "top-center",
        description: "Please connect your wallet to create a pair",
      });
      return;
    }

    try {
      writeContract(
        {
          address: LiquidityPoolFactory.address as `0x${string}`,
          abi: LiquidityPoolFactory.abi,
          functionName: "createPair",
          args: [tokenA, tokenB],
        },
        {
          onSuccess: (data) => {
            toast("✅ Pair Created!", { position: "top-center" });
            setTokenA("");
            setTokenB("");
            router.push("/");
          },
        }
      );
    } catch (error) {
      toast("❌ Transaction Failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
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
              <Label className="relative px-3 py-0 text-foreground dark:text-zinc-300 text-2xl font-sans font-semibold ">
                Select Pair
              </Label>
              <Label className="relative px-3 py-1 text-sm text-foreground/60 dark:text-zinc-300 ">
                Select the tokens you want to pair for liquidity provisioning.
                Earn fees and incentives.
              </Label>
            </div>
            <div className="flex flex-col lg:flex-row gap-y-2">
              <ComboBoxDialog
                title="Select Token"
                description="Choose a token to create a pair"
                options={tokensList}
                defaultValue="sol"
                placeholder="Search token..."
                onSelect={setTokenA}
              />
              <ComboBoxDialog
                title="Select Token"
                description="Choose a token to create a pair"
                options={tokensList}
                defaultValue="sol"
                placeholder="Search token..."
                onSelect={setTokenB}
              />
            </div>
            <div className="w-full flex justify-start">
              <CreatePoolFees />
            </div>
            <div className="px-3">
              <Button onClick={handleCreatePair} variant={"wave"} size={"lg"}>
                Create Pool
              </Button>
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}

const feeOptions = [
  { value: "0.01", label: "0.01%", description: "Best for small trades" },
  { value: "0.03", label: "0.05%", description: "Best for medium trades" },
  { value: "1.0", label: "1.0%", description: "Best for complex trades" },
];

const CreatePoolFees = () => {
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
