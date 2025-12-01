import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Runs every day at 1:00 AM
cron.schedule("0 1 * * *", async () => {
  try {
    const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

    // Prisma deleteMany directly from repository
    const deleted = await prisma.transaction.deleteMany({
      where: { createdAt: { lt: cutoffDate } },
    });

    console.log(`[Cron] Deleted ${deleted.count} old transactions`);
  } catch (error) {
    console.error("[Cron] Failed to clean old transactions:", error);
  }
});
