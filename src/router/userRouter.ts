import { Router } from "express";
import { addUser, users } from "../controllers/user/userController";
import { checkUser } from "../controllers/user/CheckUsername";

export const userRouter = Router();

userRouter.get("/", users);
// userRouter.post("/signup", addUser);
userRouter.post("/signup", checkUser, addUser);
