import { Router } from "express";
import { addBankCard, getBankCard } from "../controllers/bank/bankController";

export const userRouter = Router();

userRouter.get("/bankcard/:userId", getBankCard);
userRouter.post("/bankcard/:userId", addBankCard);
