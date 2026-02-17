import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Database Connection
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("The database is connected"))
  .catch((e) => console.log("Database connection error:", e));

// Server Start
app.listen(3000, () => console.log("server is running at port 3000"));

// Routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error"; 
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});