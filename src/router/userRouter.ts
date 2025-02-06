import { Router } from "express";
import { addUser, users } from "../controllers/user/userController";

export const userRouter = Router();

userRouter.get("/", users);
userRouter.post("/addUser", addUser);
