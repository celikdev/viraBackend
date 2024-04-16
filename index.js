import express from "express";
import dotenv from "dotenv";
import cron from "node-cron";
import { MainRouter } from "./routes/index.js";
import { connectDB } from "./components/connectDB.js";

import Day from "./models/Daily.model.js";

import cors from "cors";
import User from "./models/User.model.js";

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();

app.get("/", (req, res) => {
  res.json("Vira - Backend");
});

app.use("/api", MainRouter);

connectDB();

// app.get("/total", async (req, res) => {
//   const totalCount = await Day.findOne({ dayNumber: new Date().getDate() });
//   console.log(
//     totalCount.leaderBoard.forEach((day) => {
//       console.log(day.userPoints);
//     })
//   );
//   var count = 0;
//   totalCount.leaderBoard.forEach((day) => {
//     count += day.userPoints;
//   });
//   res.json(count.toLocaleString());
// });

// Daily Job
cron.schedule("00 00 * * *", async () => {
  const dailyLeader = await User.find().sort({ userPoints: -1 });
  const day = await Day.create({
    leaderBoard: dailyLeader,
  });

  // Reset User Points
  await User.updateMany({}, { userPoints: 0 });
  console.log("Day Create and Users Update", day, dailyLeader);
});

app.listen(process.env.PORT || 5001, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
