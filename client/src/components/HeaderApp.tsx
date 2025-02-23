import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";

import React from "react";
import Navigation from "./Navigation";
import Link from "next/link";

const HeaderApp: React.FC = () => {
  return (
    <header>
      <div className="flex h-16 px-4  items-start">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/wavedefi-logo-nobg.png"
            alt="Logo"
            width={80}
            height={80}
            className="mr-4"
          />
        </Link>

        <Navigation />

        {/* Right-side Controls */}
        <div className="ml-auto flex items-end  h-full space-x-4">
          <ConnectWalletButton />

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default HeaderApp;
