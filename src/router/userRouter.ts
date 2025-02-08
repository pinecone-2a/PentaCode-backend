import { Router } from "express";
import {
  addUser,
  checkEmail,
  checkUser,
  users,
} from "../controllers/user/userController";

export const userRouter = Router();

userRouter.get("/", users);
userRouter.post("/signup", checkUser, addUser);
userRouter.post("/login", checkEmail, addUser);
