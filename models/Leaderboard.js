import mongoose from "mongoose";

const LeaderSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
    ref: "User",
  },
  userPoints: {
    type: Number,
    required: true,
  },
});

const Leaderboard = mongoose.model("Leaderboard", LeaderSchema);

export default Leaderboard;
