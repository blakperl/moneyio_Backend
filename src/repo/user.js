
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const userRepository = {
  findAll: async () => {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        balance: true,
        role: {
          select: { name: true },
        },
      },
      orderBy: { name: "asc" },
    });
  },

  findById: async (id) => {
    return prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  },
};


