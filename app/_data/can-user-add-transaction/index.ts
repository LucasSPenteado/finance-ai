import { clerkClient, auth } from "@clerk/nextjs/server";
import { getCurrentMonthTransactions } from "../get-current-month-transaction";

export const canUserAddTransaction = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const user = await clerkClient().users.getUser(userId);
  if (user.publicMetadata.subscriptionPlan === "premium") {
    return true;
  }
  const currentMonthTransaction = await getCurrentMonthTransactions();
  if (currentMonthTransaction >= 10) {
    return false;
  }
  return true;
};
