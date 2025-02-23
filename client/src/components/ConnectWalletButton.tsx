import { Wallet } from "lucide-react";
import { GlowEffect } from "./ui/glow-effect";

export function ConnectWalletButton() {
  return (
    <div className="relative">
      <GlowEffect
        colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
        mode="colorShift"
        blur="soft"
        duration={3}
        scale={1}
      />
      <button className="relative inline-flex items-center gap-1 rounded-md bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-50 outline outline-1 outline-[#fff2f21f]">
        Connect <Wallet className="h4 w-4" />
      </button>
    </div>
  );
}
