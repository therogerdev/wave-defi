"use client";
import { PageWrapper } from "@/components/PageWrapper";
import PoolItem from "@/components/Pool/PoolItem";
import { Button } from "@/components/ui/button";
import { fetchPools, pairListAtom } from "@/store/pairListAtom";
import { useAtom } from "jotai";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function PoolPage() {
  const [tokenPairs, setTokenPairs] = useAtom(pairListAtom);

  useEffect(() => {
    const fetchData = async () => {
      const pools = await fetchPools();
      setTokenPairs(pools);
    };

    fetchData();
  }, [setTokenPairs]);

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {tokenPairs.map((pair, index) => (
            <PoolItem
              key={index}
              tokenA={pair.tokenA.symbol}
              tokenB={pair.tokenB.symbol}
            />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
