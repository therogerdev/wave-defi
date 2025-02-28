"use client";
import { PageWrapper } from "@/components/PageWrapper";
import PoolItem from "@/components/Pool/PoolItem";
import { Button } from "@/components/ui/button";
import { pairListAtom } from "@/store/pairListAtom";
import { useAtom } from "jotai";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PoolPage() {
  const [tokenPairs, refreshPools] = useAtom(pairListAtom);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchPools = async () => {
      refreshPools();
      setIsLoading(false);
    };
    fetchPools();
  }, [refreshPools]);

  if (isLoading) {
    return <PageWrapper>Loading...</PageWrapper>;
  }

  return (
    <PageWrapper>
      {tokenPairs.length === 0 ? (
        <>
          <p>No pools found.</p>
          <Link href={"/pools/create"} passHref>
            <Button variant={"wave"}>
              <ArrowRight className="mr-2 h-4 w-4" />
              Go To Create Pool
            </Button>
          </Link>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-2 lg:px-5 xl:px:0 gap-4">
          {tokenPairs.map((pair, index) => (
            <PoolItem
              key={index}
              pairAddress={pair.pairAddress}
              tokenA={pair.tokenA}
              tokenB={pair.tokenB}
            />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
