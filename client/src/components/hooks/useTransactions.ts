import TokenPair from "@/abis/TokenPair.json";
import { publicClient } from "@/config/Web3Provider";
import { useQuery } from "@tanstack/react-query";
import { AbiEvent } from "viem";

export interface TransactionsEvents {
  sender: string;
  receiver: string;
  amount: bigint;
  timestamp: number;
  transactionHash: string;
  tokenAddress?: string;
  chainId?: number;
}

const fetchTransactions = async (
  contractAddress: `0x${string}`,
  fromBlock?: bigint,
  toBlock?: bigint
): Promise<TransactionsEvents[]> => {
  const client = publicClient;

  if (!client) throw new Error("No blockchain client available");

  try {
    // Fetch logs for Transfer events
    const logs = await client.getLogs({
      address: contractAddress,
      event: TokenPair.abi.find((abi) => abi.name === "Transfer") as AbiEvent,
      fromBlock: fromBlock ?? "earliest",
      toBlock: toBlock ?? "latest",
    });

    // Fetch timestamps for each block
    const blockTimestamps: Record<number, number> = {};
    const uniqueBlockNumbers = [
      ...new Set(logs.map((log) => Number(log.blockNumber))),
    ];

    // Fetch all block timestamps in parallel
    const blocks = await Promise.all(
      uniqueBlockNumbers.map(async (blockNumber) => {
        const block = await client.getBlock({
          blockNumber: BigInt(blockNumber),
        });
        return { blockNumber, timestamp: Number(block.timestamp) };
      })
    );

    // Store timestamps in the record
    for (const { blockNumber, timestamp } of blocks) {
      blockTimestamps[blockNumber] = timestamp;
    }

    // Map logs to TransactionsEvents
    const transactions: TransactionsEvents[] = logs.map((log) => {
      const { from, to, value } = log.args as {
        from: string;
        to: string;
        value: string;
      };
      const blockNumber = Number(log.blockNumber);

      return {
        sender: from,
        receiver: to,
        amount: BigInt(value),
        transactionHash: log.transactionHash,
        timestamp: blockTimestamps[blockNumber] ?? Date.now(),
        tokenAddress: contractAddress,
      };
    });

    return transactions;
  } catch (error) {
    return [];
  }
};

const useTransactions = ({
  contractAddress,
}: {
  contractAddress: `0x${string}`;
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["transactions", contractAddress],
    queryFn: () => fetchTransactions(contractAddress),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: Boolean(contractAddress),
  });

  return {
    data: data || [],
    isLoading,
    error,
  };
};

export default useTransactions;
