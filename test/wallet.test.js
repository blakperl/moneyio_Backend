import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";

import { walletController } from "../src/http/controllers/wallet/index.js";
import { walletRepository } from "../src/repo/wallet.js";

jest.mock("../src/jobs/queues/wallet.queue.js", () => ({
  transactionQueue: { add: jest.fn() }
}));

jest.mock("../src/repo/wallet.js");

walletRepository.findById = jest.fn();
walletRepository.createTransaction = jest.fn()
walletRepository.getAllTransactions = jest.fn()
walletRepository.getUserTransactions = jest.fn()
walletRepository.updateUserBalance = jest.fn()
const app = express();
app.use(express.json());

const mockUserId = 1;

app.use((req, res, next) => {
  req.user = { id: mockUserId, name: "Test User", email: "test@email.com" };
  next();
});

app.post("/wallet/deposit", walletController.deposit);
app.post("/wallet/withdraw", walletController.withdraw);
app.get("/wallet/transactions", walletController.getTransactions);
app.get("/wallet/balance", walletController.getBalance);
app.get("/wallet/admin/transactions", walletController.getAllTransactions);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
  });
});

describe("Wallet Routes Tests Without Middleware", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });


  it("should deposit successfully", async () => {
    const user = { id: mockUserId, balance: 1000 };

    walletRepository.findById.mockResolvedValue(user);
    walletRepository.createTransaction.mockResolvedValue({ id: 1 });
    walletRepository.updateUserBalance.mockResolvedValue();

    const res = await request(app)
      .post("/wallet/deposit")
      .send({ amount: 500, description: "Top up", paymentMethod: "card" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.balance).toBe(1500);
  });

  it("should fail deposit if invalid amount", async () => {
    const res = await request(app)
      .post("/wallet/deposit")
      .send({ amount: 0 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid deposit amount");
  });

  it("should fail deposit if user not found", async () => {
    walletRepository.findById.mockResolvedValue(null);

    const res = await request(app)
      .post("/wallet/deposit")
      .send({ amount: 500 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("User not found");
  });

  it("should withdraw successfully", async () => {
    const user = { id: mockUserId, balance: 1000 };

    walletRepository.findById.mockResolvedValue(user);
    walletRepository.createTransaction.mockResolvedValue({ id: 1 });
    walletRepository.updateUserBalance.mockResolvedValue();

    const res = await request(app)
      .post("/wallet/withdraw")
      .send({ amount: 200, paymentMethod: "card" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.balance).toBe(800);
  });

  it("should fail withdrawal if invalid amount", async () => {
    const res = await request(app)
      .post("/wallet/withdraw")
      .send({ amount: -20 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid withdrawal amount");
  });

  it("should fail withdrawal if insufficient funds", async () => {
    walletRepository.findById.mockResolvedValue({ id: mockUserId, balance: 100 });

    const res = await request(app)
      .post("/wallet/withdraw")
      .send({ amount: 200 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Insufficient funds");
  });

  it("should fail withdrawal if user not found", async () => {
    walletRepository.findById.mockResolvedValue(null);

    const res = await request(app)
      .post("/wallet/withdraw")
      .send({ amount: 500 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("User not found");
  });

  it("should return user transactions", async () => {
    walletRepository.getUserTransactions.mockResolvedValue([
      { id: 1, type: "CREDIT", amount: 500 }
    ]);

    const res = await request(app).get("/wallet/transactions");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.transactions.length).toBe(1);
  });

  it("should return user balance", async () => {
    walletRepository.findById.mockResolvedValue({ id: mockUserId, balance: 2000 });

    const res = await request(app).get("/wallet/balance");

    expect(res.status).toBe(200);
    expect(res.body.balance).toBe(2000);
  });

  it("should return 400 if user not found for balance", async () => {
    walletRepository.findById.mockResolvedValue(null);

    const res = await request(app).get("/wallet/balance");

    expect(res.status).toBe(400);
   expect(res.body.message).toBe("User not found");
  });


  it("should return all transactions (admin route)", async () => {
    walletRepository.getAllTransactions.mockResolvedValue([
      { id: 1 }, { id: 2 }
    ]);

    const res = await request(app).get("/wallet/admin/transactions");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.result.count).toBe(2);
  });

});

