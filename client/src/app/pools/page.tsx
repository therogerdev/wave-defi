"use client";
import { PageWrapper } from "@/components/PageWrapper";
import { pairListAtom } from "@/store/pairListAtom";
import { useAtomValue } from "jotai";
import * as React from "react";

export default function PoolPage() {
  const tokenPairs = useAtomValue(pairListAtom);

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold mb-4">Available Liquidity Pools</h1>
      {tokenPairs.length === 0 ? (
        <p>No pools found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

interface PoolItemProps {
  tokenA: string;
  tokenB: string;
}

const PoolItem: React.FC<PoolItemProps> = ({ tokenA, tokenB }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md">
      <p className="font-semibold">
        {tokenA} / {tokenB}
      </p>
    </div>
  );
};
