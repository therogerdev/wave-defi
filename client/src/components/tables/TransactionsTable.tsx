import useTransactions from "../hooks/useTransactions";
import { DataTable } from "../ui/data-table";
import { ScrollArea } from "../ui/scroll-area";
import { transactionColumns } from "./columns";

const TransactionsTable = ({
  contractAddress,
}: {
  contractAddress: `0x${string}`;
}) => {
  const {
    data: transactions,
    isLoading,
    error,
  } = useTransactions({ contractAddress });

  if (isLoading) return <p className="text-center">Loading transactions...</p>;
  if (error)
    return (
      <p className="text-center text-red-500">Error loading transactions</p>
    );

  return (
    <div className="p-4 rounded-md flex flex-col flex-1">
      <ScrollArea className="h-[500px]">
        <DataTable columns={transactionColumns} data={transactions} />
      </ScrollArea>
    </div>
  );
};

export default TransactionsTable;
