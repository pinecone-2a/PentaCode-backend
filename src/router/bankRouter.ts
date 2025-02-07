import { Router } from "express";
import { addBankCard, getBankCard } from "../controllers/bank/bankController";

export const bankRouter = Router();

bankRouter.get("/:userId", getBankCard);
bankRouter.post("/:userId", addBankCard);
