import { ColumnDef } from "@tanstack/react-table";
import { TransactionsEvents } from "@/components/hooks/useTransactions";
import { format } from "date-fns";
import { formatUnits } from "viem";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { formatNumber, handleCopy } from "@/lib/utils";

export const transactionColumns: ColumnDef<TransactionsEvents>[] = [
  {
    accessorKey: "timestamp",
    header: "Date",
    cell: ({ row }) => format(new Date(row.original.timestamp * 1000), "Pp"),
  },
  {
    accessorKey: "sender",
    header: "From",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="truncate max-w-36">{row.original.sender}</span>
        <Button
          onClick={() => handleCopy(row.original.sender)}
          size="icon"
          variant="ghost"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "receiver",
    header: "To",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="truncate max-w-36">{row.original.receiver}</span>
        <Button
          onClick={() => handleCopy(row.original.receiver)}
          size="icon"
          variant="ghost"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) =>
      formatNumber(row.original.amount), 
  },
  {
    accessorKey: "transactionHash",
    header: "Transaction",
    cell: ({ row }) => (
      <a
        href={`https://etherscan.com/tx/${row.original.transactionHash}`} 
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        View
      </a>
    ),
  },
];