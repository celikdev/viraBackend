import express from "express";
import dotenv from "dotenv";
import { MainRouter } from "./routes/index.js";
import { connectDB } from "./components/connectDB.js";

import cors from "cors";
import { calculateWeekNumber } from "./components/calculateWeekNumber.js";

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();

app.get("/", (req, res) => {
  res.json("Vira - Backend");
});

app.use("/api", MainRouter);

connectDB();

app.listen(process.env.PORT || 5001, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
