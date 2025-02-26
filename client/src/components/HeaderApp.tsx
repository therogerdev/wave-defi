"use client";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";

import { ConnectKitButton } from "connectkit";
import { useTheme } from "next-themes";
import Link from "next/link";
import React from "react";
import Navigation from "./Navigation";

const HeaderApp: React.FC = () => {
  const { theme } = useTheme();
  return (
    <>
      <header className="flex h-16 px-4 bg-transparent items-start">
        <Link href="/" className="flex items-center ">
          <Image
            src="/wavedefi-logo-nobg.png"
            alt="Logo"
            width={64}
            height={64}
            className="mr-4"
          />
        </Link>

        <Navigation />
        <div className="ml-auto py-1  flex items-end  h-full space-x-4">
          <ConnectKitButton theme={theme === "dark" ? "midnight" : "soft"} />
          <ThemeToggle  />
        </div>
      </header>
    </>
  );
};

export default HeaderApp;
