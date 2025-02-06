import { Router } from "express";
import { addUser } from "../controllers/user/add-user";

export const userRouter = Router();

userRouter.post("/", addUser);
userRouter.get("/", addUser);
