
import { walletService } from "../../../services/wallet.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import logger from "../../../../src/utils/logger.js";
import { transactionQueue } from "../../../jobs/queues/wallet.queue.js";

// export const walleController = {
//   deposit: async (req, res) => {
//     try {
//       const result = await walletService.deposit(req.user.id, req.body);
//       res.status(201).json({
//         message: "Deposit successful!",
//         balance: result.balance,
//         transaction: result.transaction,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(400).json({ message: error.message });
//     }
//   },

//   withdraw: async (req, res) => {
//     try {
//       const result = await walletService.withdraw(req.user.id, req.body);
//       res.status(201).json({
//         message: "Withdrawal successful!",
//         balance: result.balance,
//         transaction: result.transaction,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(400).json({ message: error.message });
//     }
//   },

//   getTransactions: async (req, res) => {
//     try {
//       const transactions = await walletService.getTransactions(req.user.id);
//       res.json(transactions);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   },

//   getBalance: async (req, res) => {
//     try {
//       const balance = await walletService.getBalance(req.user.id);
//       res.json({ balance });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   },

//   getAllTransactions: async (req, res) => {
//     try {
//       const result = await walletService.getAllTransactions();
//       res.json(result);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Error fetching all transactions" });
//     }
//   },
// };


export const walletController = {
  deposit: asyncHandler(async (req, res) => {
     const result = await walletService.deposit(req.user.id, req.body);
      logger.info("Deposited successfully")

    // await transactionQueue.add("processTransaction", {
    //   userId: req.user.id,
    //   type: "CREDIT",
    //   amount: req.body.amount,
    //   name: req.user.name,
    //   email: req.user.email
    // });
    await transactionQueue.add(
      "sendEmail",
      {
        userId: req.user.id,
        type: "CREDIT",
        amount: req.body.amount,
        name: req.user.name,
        email: req.user.email,
        balance: result.balance, // pass balance to email
      },
      { delay: 60 * 1000, attempts: 5, backoff: { type: "exponential", delay: 1000 } }
    );


    res.status(201).json({
       success: true,
        balance: result.balance,
        transaction: result.transaction,
    });
  }),

  withdraw: asyncHandler(async (req, res) => {
     const result = await walletService.withdraw(req.user.id, req.body);
      logger.info("Withdrawal successful")

    // await transactionQueue.add("processTransaction", {
    //   userId: req.user.id,
    //    type: "DEBIT",
    //   amount: req.body.amount,
    //    name: req.user.name,
    //     email: req.user.email
    // });
    await transactionQueue.add(
      "sendEmail",
      {
        userId: req.user.id,
        type: "DEBIT",
        amount: req.body.amount,
        name: req.user.name,
        email: req.user.email,
        balance: result.balance,
      },
      { delay: 60 * 1000, attempts: 5, backoff: { type: "exponential", delay: 1000 } }
    );

      res.status(201).json({
       success: true,
        balance: result.balance,
        transaction: result.transaction,

      });
  }),
  
  getTransactions : asyncHandler(async (req, res) => {
     const transactions = await walletService.getTransactions(req.user.id);
      logger.info("Transaction fetched successfully")
       res.status(200).json({success: true, transactions})
  }),

  getBalance : asyncHandler(async (req, res) => {
    const balance = await walletService.getBalance(req.user.id);
      logger.info("Balance")
       res.status(200).json({success: true, balance})
  }),

  getAllTransactions : asyncHandler(async (req, res) => {
      const result = await walletService.getAllTransactions();
      logger.info("Transactions fetched successfully")
      res.status(200).json({success: true, result})
  })
}