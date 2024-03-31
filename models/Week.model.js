import mongoose from "mongoose";
import { calculateWeekNumber } from "../components/calculateWeekNumber.js";

const leaderBoardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
  },
  userPoints: {
    type: Number,
    required: true,
    default: 0,
  },
});

const WeekSchema = new mongoose.Schema({
  weekNumber: {
    type: Number,
    required: true,
    default: calculateWeekNumber(),
  },
  monthNumber: {
    type: Number,
    required: true,
    default: new Date().getMonth() + 1,
  },
  leaderBoard: [leaderBoardSchema],
});

const Week = mongoose.model("Week", WeekSchema);

export default Week;
