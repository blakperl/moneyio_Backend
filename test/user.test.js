import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";
import { userController } from "../src/http/controllers/users/index.js";
import { userRepository } from "../src/repo/user.js";

jest.mock("../src/repo/user.js");

userRepository.findAll = jest.fn();
userRepository.findById = jest.fn();

const app = express();
app.use(express.json());

app.get("/user/", userController.getUsers);
app.get("/user/profile", (req, res, next) => {
  req.user = { id: 1 };
  next();
}, userController.getUserProfile);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err.message,
    success: false,
  });
});

describe("User Routes Tests without Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /user/", () => {
    it("should return all users successfully", async () => {
      const mockUsers = [
        { id: 1, name: "User 1", email: "user1@test.com" },
        { id: 2, name: "User 2", email: "user2@test.com" },
      ];
      userRepository.findAll.mockResolvedValue(mockUsers);

      const res = await request(app).get("/user/");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.count).toBe(2);
      expect(res.body.data.users).toEqual(mockUsers);
    });

    it("should return empty array if no users", async () => {
      userRepository.findAll.mockResolvedValue([]);

      const res = await request(app).get("/user/");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.count).toBe(0);
      expect(res.body.data.users).toEqual([]);
    });
  });

  describe("GET /user/profile", () => {
    it("should return user profile successfully", async () => {
      const mockUser = { id: 1, name: "User 1", email: "user1@test.com" };
      userRepository.findById.mockResolvedValue(mockUser);

      const res = await request(app).get("/user/profile");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toEqual(mockUser);
    });

    it("should return 400 if user not found", async () => {
      userRepository.findById.mockResolvedValue(null);

      const res = await request(app).get("/user/profile");

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("User not found");
      expect(res.body.success).toBe(false);
    });
  });
});
