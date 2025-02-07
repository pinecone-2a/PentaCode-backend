import { Router } from "express";
import { addUser, users } from "../controllers/user/userController";

export const userRouter = Router();

userRouter.get("/:userId", users);
userRouter.post("/userId", addUser);
