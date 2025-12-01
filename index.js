import dotenv from "dotenv";
import express from "express";
import authRoutes from "./src/routes/auth.js";
import morgan from "morgan";
import  {errorHandler}  from "./src/http/middlewares/errorHandler.js";
import userRoutes from "./src/routes/users.js";
import walletRoutes from "./src/routes/wallet.js";


dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wallet", walletRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));






export default app;


