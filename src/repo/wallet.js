
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const walletRepository = {
  findById: async (id) => {
   return  prisma.user.findUnique({
      where: { id },
  })},
  createTransaction: async (data) => {
    return prisma.transaction.create({
      data
  })},

  updateUserBalance: async (id, balance) => {
    return prisma.user.update({
      where: { id },
      data: { balance },
    });
  },
     
  getUserTransactions: async (userId) => {
      return prisma.transaction.findMany({
        where: { userId },
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
  })},
    
  getAllTransactions: async () => {
    return prisma.transaction.findMany({
      include: { user: { select: { name: true, email: true, balance: true } } },
      orderBy: { createdAt: "desc" },
    })
  }
};
