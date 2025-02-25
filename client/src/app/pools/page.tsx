"use client";
import { PageWrapper } from "@/components/PageWrapper";
import PoolItem from "@/components/PoolItem";
import { pairListAtom } from "@/store/pairListAtom";
import { useAtomValue } from "jotai";
import * as React from "react";

export default function PoolPage() {
  const tokenPairs = useAtomValue(pairListAtom);

  return (
    <PageWrapper>
      {tokenPairs.length === 0 ? (
        <p>No pools found.</p>
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
