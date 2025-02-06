import { Router } from "express";
import { addUser } from "../controllers/add-user";

export const userRouter = Router();

userRouter.post("/", addUser);
