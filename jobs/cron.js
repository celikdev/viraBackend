import cron from "node-cron";
import User from "../models/User.model.js";
import Week from "../models/Week.model.js";
import Month from "../models/Month.model.js";
import { calculateWeekNumber } from "../components/calculateWeekNumber.js";

cron.schedule("59 23 * * 0", async () => {
  const user = await User.find().sort({ userPoints: -1 });
  const week = await Week.create({
    leaderBoard: user,
  });

  const pushToMonth = await Month.findOne({
    monthNumber: new Date().getMonth() + 1,
  });
  pushToMonth.weeks.push(week);

  console.log(`CRON_WEEK:${week}`);
});

cron.schedule("59 23 28-31 * *", async () => {
  const week = await Week.find({ monthNumber: new Date().getMonth() + 1 }).sort(
    { createdAt: -1 }
  );

  const month = await Month.create({
    monthNumber: new Date().getMonth() + 1,
    weeks: week,
  });

  console.log(`CRON_MONTH:${month}`);
});
export default cron;
