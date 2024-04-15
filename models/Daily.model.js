import mongoose from "mongoose";

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

const DaySchema = new mongoose.Schema({
  dayNumber: {
    type: Number,
    default: new Date().getDate() + 1,
  },
  monthNumber: {
    type: Number,
    required: true,
    default: new Date().getMonth() + 1,
  },
  leaderBoard: [leaderBoardSchema],
});

const Day = mongoose.model("Day", DaySchema);

export default Day;
