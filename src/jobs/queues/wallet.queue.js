import { Queue } from "bullmq";
import { redisConnection } from "../../config/redis.js";

export const transactionQueue = new Queue("transactionQueue", {
  connection: redisConnection,
});


// --- Global Queue Event Logging ---
transactionQueue.on("completed", (job) => {
  console.log(`✅ Job ${job.id} (${job.name}) completed successfully`);
});

transactionQueue.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} (${job.name}) failed after ${job.attemptsMade} attempts:`, err.message);
});

transactionQueue.on("active", (job) => {
  console.log(`🔄 Job ${job.id} (${job.name}) is now active`);
});

transactionQueue.on("stalled", (job) => {
  console.warn(`⚠️ Job ${job.id} (${job.name}) stalled and will be retried`);
});