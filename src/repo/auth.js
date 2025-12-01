
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const authRepository = {
  findUserByEmail: async (email) => {
    return prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  },

  findRoleByName: async (roleName) => {
    return prisma.role.findUnique({
      where: { name: roleName },
    });
  },

  createUser: async (data) => {
    return prisma.user.create({
      data,
      include: { role: true },
    });
  },
};
