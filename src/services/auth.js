
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authRepository } from "../repo/auth.js";

const JWT_SECRET = process.env.JWT_SECRET;


class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}


export const authService = {
  signup: async ({ name, email, password }) => {
    const existingUser = await authRepository.findUserByEmail(email);
    console.log(existingUser);
    
    if (existingUser) throw new AppError("User already exists", 409);
    
console.log("user already exist");

    const userRole = await authRepository.findRoleByName("user");
    if (!userRole) throw new AppError("Invalid role provided");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await authRepository.createUser({
      name,
      email,
      password: hashedPassword,
      role: { connect: { id: userRole.id } },
    });

    return {
      message: "User created successfully!",
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role.name,
      },
    };
  },

  login: async ({ email, password }) => {
    const user = await authRepository.findUserByEmail(email);
    if (!user) throw new AppError("User not found", 404);

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new AppError("Invalid credentials", 401);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role.name },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { message: "Login successful", token };
  },
};
