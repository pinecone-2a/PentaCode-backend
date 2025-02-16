import { Router } from "express";
import {
	checkUser,
	forgotPassword,
	resetPassword,
	updatePassword,
	users,
	verifyCookie,
	verifyOtp,
	verifyUser,
} from "../controllers/user/userController";

export const userRouter = Router();

userRouter.get("/", users);
userRouter.post("/sign-up", checkUser);
userRouter.post("/sign-in", verifyUser);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/verify-otp", verifyOtp);
userRouter.post("/reset-password", resetPassword);
userRouter.put("/update-password/:userId", updatePassword);
