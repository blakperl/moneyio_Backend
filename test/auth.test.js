import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";
import router from "../src/routes/auth.js";
import { authRepository } from "../src/repo/auth.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("../src/repo/auth.js");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

// Mock authRepository methods
authRepository.findUserByEmail = jest.fn();
authRepository.findRoleByName = jest.fn();
authRepository.createUser = jest.fn();

// Mock bcrypt methods
bcrypt.hash = jest.fn();
bcrypt.compare = jest.fn();

// Mock jwt methods
jwt.sign = jest.fn();

const app = express();
app.use(express.json());
app.use("/auth", router);

describe("Auth Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /auth/signup", () => {
    it("should create a user successfully", async () => {
      authRepository.findUserByEmail.mockResolvedValue(null);
      authRepository.findRoleByName.mockResolvedValue({ id: 1, name: "user" });
      authRepository.createUser.mockResolvedValue({
        id: 10,
        email: "test@example.com",
        role: { name: "user" },
      });

      bcrypt.hash.mockResolvedValue("hashed-password");

      const res = await request(app)
        .post("/auth/signup")
        .send({
          name: "Test User",
          email: "test@example.com",
          password: "pass123"
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.message).toBe("User created successfully!");
      expect(res.body.data.user.email).toBe("test@example.com");
    });

    it("should return 409 if user already exists", async () => {
      authRepository.findUserByEmail.mockResolvedValue({ id: 1 });


      const res = await request(app)
        .post("/auth/signup")
        .send({
          name: "Test User",
          email: "test@example.com",
          password: "pass123"
        });
        
      expect(res.status).toBe(409);
  
    });
  });

  describe("POST /auth/login", () => {
    it("should log in successfully", async () => {
      authRepository.findUserByEmail.mockResolvedValue({
        id: 1,
        email: "test@example.com",
        password: "hashed",
        role: { name: "user" },
      });

      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("fake-jwt-token");

      const res = await request(app)
        .post("/auth/login")
        .send({
          email: "test@example.com",
          password: "pass123",
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.message).toBe("Login successful");
      expect(res.body.data.token).toBe("fake-jwt-token");
    });

    it("should return 401 if password is wrong", async () => {
      authRepository.findUserByEmail.mockResolvedValue({
        id: 1,
        email: "test@example.com",
        password: "hashed",
        role: { name: "user" },
      });

      bcrypt.compare.mockResolvedValue(false);

      const res = await request(app)
        .post("/auth/login")
        .send({
          email: "test@example.com",
          password: "wrongpass",
        });

      expect(res.status).toBe(401);
    });

    it("should return 404 if user not found", async () => {
      authRepository.findUserByEmail.mockResolvedValue(null);

      const res = await request(app)
        .post("/auth/login")
        .send({
          email: "notfound@example.com",
          password: "pass123",
        });

      expect(res.status).toBe(404);
    });
  });
});




