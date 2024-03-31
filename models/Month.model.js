import mongoose from "mongoose";

const MonthSchema = new mongoose.Schema({
  monthNumber: {
    type: Number,
    required: true,
    default: new Date().getMonth() + 1,
  },
  weeks: {
    type: Array,
    required: true,
    default: [],
  },
});

const Month = mongoose.model("Month", MonthSchema);

export default Month;
