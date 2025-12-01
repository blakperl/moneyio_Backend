// import express from "express";
// import { PrismaClient } from "@prisma/client";
// import { verifyToken } from "../middlewares/authMiddleware.js";
// import { authorizeRoles } from "../middlewares/roleMiddleware.js";

// const router = express.Router();
// const prisma = new PrismaClient();

// router.post("/deposit", verifyToken, async (req, res) => {
//   try {
//     const userId = req.user.id
//     const {amount, description, paymentMethod} = req.body

//     if (!amount || amount<= 0) {
//         return res.status(400).json({msg: "Invalid Deposit Amount"})
//     }
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//     });
//     const newBalance = user.balance + amount

//     const transaction = await prisma.transaction.create({
//       data: {
//        amount,
//         type: "CREDIT",
//         description: description || "Wallet deposit",
//         paymentMethod,
//         userId,
//         balanceBefore: user.balance,
//         balanceAfter: newBalance,
//         status: "SUCCESS",
//       },
//     });

//     await prisma.user.update({
//          where: { id: userId },
//       data: { balance: newBalance },
//     })

//     res.status(201).json({
//       message: "Deposited successful!",
//      balance: newBalance,
//       transaction,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Deposit failed" });
//   }
// });



// router.post("/withdraw", verifyToken, async (req, res) => {
//   try {
//     const userId = req.user.id
//     const {amount, description, paymentMethod} = req.body

//     if (!amount || amount<= 0) {
//         return res.status(400).json({msg: "Invalid Withdrawal Amount"})
//     }
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//     });
//     if (user.balance < amount)
//       return res.status(400).json({ message: "Insufficient funds" });
//     const newBalance = user.balance - amount

//     const transaction = await prisma.transaction.create({
//       data: {
//        amount,
//         type: "DEBIT",
//         description: description || "Wallet withdrawal",
//         paymentMethod,
//         userId,
//         balanceBefore: user.balance,
//         balanceAfter: newBalance,
//         status: "SUCCESS",
//       },
//     });

//     await prisma.user.update({
//          where: { id: userId },
//       data: { balance: newBalance },
//     })

//     res.status(201).json({
//       message: "Withdrawal successful!",
//      balance: newBalance,
//       transaction,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Withdrawal failed" });
//   }
// });

// router.get("/transactions", verifyToken, async (req, res) => {
//   try {
//      const userId = req.user.id
//    const transactions = await prisma.transaction.findMany({
//      where: { userId },
//   include: {
//     user: { select: { name: true, email: true } },
//   },
//   orderBy: { createdAt: "desc" },
//     });

//     res.json(transactions);
//   } catch (error) {
    
//     res.status(500).json({ message: "Error fetching transactions" });
//   }
// });

// router.get("/balance", verifyToken, async (req, res) => {
//   try {
//      const userId = req.user.id
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       select: { balance: true },
//     });

//     res.json({ balance: user.balance });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch balance" });
//   }
// });

// router.get("/admin/transactions", verifyToken, authorizeRoles("admin"), async (req, res) => {
//   try {
//     const transactions = await prisma.transaction.findMany({
//      include: {
//         user: { select: { name: true, email: true, balance: true } },
//       },
//        orderBy: { createdAt: "desc" },
//     });
//    res.json({
//       count: transactions.length,
//       transactions,
//     });
//   } catch (error) {
//     console.error("Error fetching transactions:", error);
//     res.status(500).json({ message: "Error fetching transactions" });
//   }
// });




// export default router;



import express from "express";
import { walletController } from "../http/controllers/wallet/index.js";
import { verifyToken } from "../http/middlewares/authMiddleware.js";
import { authorizeRoles } from "../http/middlewares/roleMiddleware.js";
import { validate } from "../http/middlewares/validateMiddleware.js";
import { createTransactionSchema } from "../validations/walletValidation.js";

const router = express.Router();

router.post("/deposit", verifyToken, validate(createTransactionSchema),  walletController.deposit);
router.post("/withdraw", verifyToken, validate(createTransactionSchema),  walletController.withdraw);
router.get("/transactions", verifyToken, walletController.getTransactions);
router.get("/balance", verifyToken, walletController.getBalance);
router.get(
  "/admin/transactions",
  verifyToken,
  authorizeRoles("admin"),
  walletController.getAllTransactions
);

export default router;
