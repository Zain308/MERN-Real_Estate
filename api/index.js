import express from "express";
import mongoose from "mongoose";

const app = express();
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("The database is connected"))
  .catch((e) => console.log(e));

app.listen(3000, () => console.log("server is running at port 3000"));
