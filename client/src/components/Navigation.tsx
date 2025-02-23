import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Navigation: React.FC = () => {
  return (
    <nav className="flex items-center mt-2 h-full space-x-4 lg:space-x-6 mx-6">
      <Button asChild variant="ghost">
        <Link href="/swap">Swap</Link>
      </Button>
      <Button asChild variant="ghost">
        <Link href="/pool">Pool</Link>
      </Button>
    </nav>
  );
};

export default Navigation;
