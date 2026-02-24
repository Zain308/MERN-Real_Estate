import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import listingRouter from './routes/listing.route.js';
import path from 'path';

dotenv.config();

// FIX 2: Define __dirname correctly using path.resolve()
const __dirname = path.resolve();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Database Connection
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("The database is connected"))
  .catch((e) => console.log("Database connection error:", e));

// Routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

// Serve Static Files
app.use(express.static(path.join(__dirname, '/client/dist')));

// Catch-All Route for SPA (Single Page Application)
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

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

// Server Start (Best practice: Put this at the end)
app.listen(3000, () => console.log("Server is running at port 3000"));