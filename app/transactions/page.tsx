import { auth } from "@clerk/nextjs/server";
import { db } from "../_lib/prisma";
import AddTransactionButton from "../components/add-transaction-button";
import Navbar from "../components/navbar";
import { DataTable } from "../components/ui/data-table";
import { transactionColumns } from "./_coloumns";
import { redirect } from "next/navigation";
import { canUserAddTransaction } from "../_data/can-user-add-transaction/index";
import { ScrollArea } from "../components/ui/scroll-area";
const TransactionPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }
  const transactions = await db.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });
  const userCanAddTransaction = await canUserAddTransaction();

  return (
    <>
      <Navbar />
      <div className="flex flex-col space-y-6 overflow-hidden p-6">
        {/*Titulo e Botão*/}
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Transações</h1>
          <AddTransactionButton userCanAddTransaction={userCanAddTransaction} />
        </div>
        <ScrollArea className="h-full">
          <DataTable
            columns={transactionColumns}
            data={JSON.parse(JSON.stringify(transactions))}
          />
        </ScrollArea>
      </div>
    </>
  );
};

export default TransactionPage;
