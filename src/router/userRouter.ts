import { Router } from "express";
import {
	checkUser,
	forgotPassword,
	updatePassword,
	users,
	verifyUser,
} from "../controllers/user/userController";

export const userRouter = Router();

userRouter.get("/", users);
userRouter.post("/sign-up", checkUser);
userRouter.post("/sign-in", verifyUser);
userRouter.patch("/update/:userId", forgotPassword);
userRouter.put("/update-password/:userId", updatePassword);
