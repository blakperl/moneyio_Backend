
import { userRepository } from "../repo/user.js";

class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

export const userService = {
  getAllUsers: async () => {
    const users = await userRepository.findAll();
    return { count: users.length, users };
  },

  getUserProfile: async (userId) => {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError("User not found");
    return user;
  }
};