import { Router } from "express";
import {
  addUser,
  getAllUsers,
  updateUser,
  login,
  getWeeklyLeader,
  getMonthlyLeader,
  getDailyLeader,
  deleteUser,
} from "../controllers/User.js";

import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const UserRouter = Router();

UserRouter.post("/login", login);
UserRouter.get("/", getAllUsers);
UserRouter.post("/", upload.single("image"), addUser);
UserRouter.post("/update/:userID", updateUser);
UserRouter.delete("/delete/:userID", deleteUser);
UserRouter.get("/daily", getDailyLeader);
UserRouter.get("/weekly", getWeeklyLeader);
UserRouter.get("/monthly", getMonthlyLeader);

export default UserRouter;
