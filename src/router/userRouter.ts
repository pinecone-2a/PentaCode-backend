import { Router } from "express";
import {
  checkUser,
  forgotPassword,
  resetPassword,
  users,
  verifyCookie,
  verifyOtp,
  verifyUser,
} from "../controllers/user/userController";

export const userRouter = Router();

userRouter.get("/", users);
userRouter.post("/sign-up", verifyCookie, checkUser);
userRouter.post("/sign-in", verifyCookie, verifyUser);
userRouter.post("/forgot-password", verifyCookie, forgotPassword);
userRouter.post("/verify-otp", verifyCookie, verifyOtp);
userRouter.post("/reset-password", verifyCookie, resetPassword);
