import cron from "node-cron";
import { transactionQueue } from "../../queues/transactionQueue.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Runs every 6 hours
cron.schedule("0 */6 * * *", async () => {
  try {
    const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

    // Find inactive users (no transactions in last 30 days)
    const allUsers = await prisma.user.findMany({
      include: { transactions: true },
    });

    const inactiveUsers = allUsers.filter(
      (user) => !user.transactions.some(t => t.createdAt >= cutoffDate)
    );

    for (const user of inactiveUsers) {
      await transactionQueue.add(
        "sendEmail",
        {
          userId: user.id,
          type: "REENGAGE",
          name: user.name,
          email: user.email,
        },
        { delay: 0, attempts: 5, backoff: { type: "exponential", delay: 5000 } }
      );
    }

    console.log(`[Cron] Queued re-engagement emails for ${inactiveUsers.length} users`);
  } catch (error) {
    console.error("[Cron] Failed to check inactive users:", error);
  }
});
