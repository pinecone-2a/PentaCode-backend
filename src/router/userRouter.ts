import { Router } from "express";
import {
  checkUser,
  users,
  verifyUser,
} from "../controllers/user/userController";

export const userRouter = Router();

userRouter.get("/", users);
userRouter.post("/sign-up", checkUser);
userRouter.post("/sign-in", verifyUser);
