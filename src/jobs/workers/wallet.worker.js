


import { Worker } from "bullmq";
import { walletService } from "../../services/wallet.js";
import { sendEmail } from "../../utils/email.js";
import logger from "../../utils/logger.js";
import { redisConnection } from "../../config/redis.js"; 

new Worker(
  "transactionQueue",  
  async (job) => {
    const { userId, type, amount, name, email } = job.data;
    logger.info(`Worker started job: ${type} of ₦${amount} for user ${email}`);

    try {
      let result;
      if (type === "CREDIT") {
        result = await walletService.deposit(userId, { amount });
      } else if (type === "DEBIT") {
        result = await walletService.withdraw(userId, { amount });
      }

      await sendEmail({
      to: email,
      subject: `${type === "CREDIT" ? "Deposit" : "Withdrawal"} Successful`,
      html: `
        <p>Hello ${name},</p>
        <p>Your ${type === "CREDIT" ? "deposit" : "withdrawal"} of <strong>₦${amount}</strong> was successful.</p>
        <p>Your new balance is <strong>₦${result.balance}</strong>.</p>
      `,
    });

      logger.info(`✅ Email sent successfully for job ${job.id}`);
      console.log(`✅ Email sent successfully for job ${job.id}`);
      
      return result;
    } catch (error) {
      logger.error("Worker failed:", error);
      console.log("Worker failed:", error);
      
      throw error;
    }
  },
  {
    connection: redisConnection,
    attempts: 5,
    backoff: { type: "exponential", delay: 1000 },
  }
);
