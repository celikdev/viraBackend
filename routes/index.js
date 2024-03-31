import { Router } from "express";
import UserRouter from "./User.js";

const MainRouter = Router();

MainRouter.use("/user", UserRouter);

export { MainRouter };
