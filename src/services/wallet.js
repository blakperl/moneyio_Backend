
import { walletRepository } from "../repo/wallet.js";

class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

export const walletService = {
  deposit: async (userId, { amount, description, paymentMethod }) => {
    if (!amount || amount <= 0) throw new AppError("Invalid deposit amount");

    const user = await walletRepository.findById(userId);
    if (!user) throw new AppError("User not found");

    const newBalance = user.balance + amount;

    const transaction = await walletRepository.createTransaction({
      amount,
      type: "CREDIT",
      description: description || "Wallet deposit",
      paymentMethod,
      userId,
      balanceBefore: user.balance,
      balanceAfter: newBalance,
      status: "SUCCESS",
    });

    await walletRepository.updateUserBalance(userId, newBalance);

    return { balance: newBalance, transaction };
  },

  withdraw: async (userId, { amount, description, paymentMethod }) => {
    if (!amount || amount <= 0) throw new AppError("Invalid withdrawal amount");

    const user = await walletRepository.findById(userId);
    if (!user) throw new AppError("User not found");

    if (user.balance < amount) throw new AppError("Insufficient funds");

    const newBalance = user.balance - amount;

    const transaction = await walletRepository.createTransaction({
      amount,
      type: "DEBIT",
      description: description || "Wallet withdrawal",
      paymentMethod,
      userId,
      balanceBefore: user.balance,
      balanceAfter: newBalance,
      status: "SUCCESS",
    });

    await walletRepository.updateUserBalance(userId, newBalance);

    return { balance: newBalance, transaction };
  },

  getTransactions: async (userId) => {
    return walletRepository.getUserTransactions(userId);
  },

  getBalance: async (userId) => {
    const user = await walletRepository.findById(userId);
    if (!user) throw new AppError("User not found");
    return user.balance;
  },

  getAllTransactions: async () => {
    const transactions = await walletRepository.getAllTransactions();
    return { count: transactions.length, transactions };
  },
};
