import User from "../models/User.model.js";
import Week from "../models/Week.model.js";
import Month from "../models/Month.model.js";
import { calculateWeekNumber } from "../components/calculateWeekNumber.js";

import firebase from "../firebase.js";
import {
  getDownloadURL,
  getStorage,
  ref,
  updateMetadata,
  uploadBytes,
} from "firebase/storage";
import Day from "../models/Daily.model.js";

export const login = async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    console.log(process.env.ADMIN_PHONE);
    if (phone == process.env.ADMIN_PHONE) {
      return res.status(200).json({ isAdmin: true });
    } else {
      return res.status(401).json("This user is not an admin!");
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addUser = async (req, res) => {
  const { name } = req.body;
  const storage = getStorage(firebase);

  if (req.file) {
    const imageRef = ref(storage, "images/" + req.file.originalname, {
      contentType: req.file.mimetype,
    });

    await uploadBytes(imageRef, req.file.buffer)
      .then((snapshot) => {
        console.log(`File ${req.file.originalname} uploaded successfully!}`);
      })
      .catch((error) => {
        console.log(error, `${req.file.originalname} upload failed!`);
      });

    await updateMetadata(imageRef, {
      contentType: req.file.mimetype,
    });

    await getDownloadURL(imageRef, req.file.originalname)
      .then(async (url) => {
        const newUser = await User.create({ name, imageURL: url });
        return res.status(201).json(newUser);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (!name)
    return res.status(400).json({ message: "Missing required fields" });
};

export const updateUser = async (req, res) => {
  const { userID } = req.params;
  const { userPoints } = req.body;
  if (!userID || !userPoints) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const day = await Day.findOne({ dayNumber: new Date().getDate() });
    if (!day) return res.status(404).json({ message: "Day not found" });
    // await User.findOneAndUpdate(
    //   { _id: userID },
    //   {
    //     $inc: { userPoints: userPoints },
    //   }
    // );
    day.leaderBoard.forEach((user) => {
      if (user._id == userID) {
        user.userPoints += userPoints;
      }
    });
    await day.save();
    return res.status(200).json(day);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ userPoints: -1 });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDailyLeader = async (req, res) => {
  try {
    const today = new Date().getDate() + 1;
    const monthNumber = new Date().getMonth() + 1;

    const leader = await Day.findOne({
      dayNumber: today,
      monthNumber,
    });
    if (!leader) return res.status(404).json({ message: "Leader not found" });
    return res.status(200).json(leader);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getWeeklyLeader = async (req, res) => {
  try {
    const weekNumber = calculateWeekNumber();

    const week = await Week.findOne({ weekNumber });
    if (!week) return res.status(404).json({ message: "Week not found" });
    const leaderBoard = week.leaderBoard.sort((a, b) => {
      return b.userPoints - a.userPoints;
    });

    const weeklyTotal = leaderBoard.reduce((acc, curr) => {
      return acc + curr.userPoints;
    }, 0);

    return res.status(200).json({
      leaderBoard,
      total: weeklyTotal,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMonthlyLeader = async (req, res) => {
  try {
    const monthNumber = new Date().getMonth() + 1;
    const weeks = await Week.find({ monthNumber }).sort({ createdAt: -1 });

    if (weeks.length === 0) {
      return res.status(404).json({ message: "No data found for the month" });
    }

    const users = {};

    weeks.forEach((week) => {
      console.log("Week Number: ", week.weekNumber);
      week.leaderBoard.forEach((user) => {
        users[user._id] = (users[user._id] || 0) + user.userPoints;
        console.log(user._id);
      });
    });

    res.status(200).json({
      leaderBoard: monthlyLeaderBoardSorted,
      total,
      users,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
