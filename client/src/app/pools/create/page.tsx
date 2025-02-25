"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

import { ComboBoxDialog } from "@/components/ComboBoxDialog";
import { PageWrapper } from "@/components/PageWrapper";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const tokenOptions = [
  { value: "sol", label: "Solana (SOL)" },
  { value: "usdc", label: "USD Coin (USDC)" },
  { value: "eth", label: "Ethereum (ETH)" },
  { value: "btc", label: "Bitcoin (BTC)" },
  { value: "doge", label: "Dogecoin (DOGE)" },
];

export default function CreatePool() {
  const { isConnected } = useAccount();
  const router = useRouter();

  // Token Selection State
  const handleTokenSelect = (selectedToken: string) => {
    console.log("Selected Token:", selectedToken);
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
                options={tokenOptions}
                defaultValue="sol"
                placeholder="Search token..."
                onSelect={handleTokenSelect}
              />
              <ComboBoxDialog
                title="Select Token"
                description="Choose a token to create a pair"
                options={tokenOptions}
                defaultValue="sol"
                placeholder="Search token..."
                onSelect={handleTokenSelect}
              />
            </div>
            <div className="w-full flex justify-start">
              <CreatePoolFees />
            </div>
            <div className="px-3">
              <Button variant={"wave"} size={"lg"}>
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
