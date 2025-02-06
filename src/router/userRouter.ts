import { Router } from "express";
import { users } from "../controllers/user/userController";

export const userRouter = Router();

userRouter.get("/", users);
