import { Router } from "express";
import {
	addBankCard,
	editBankCard,
	getBankCard,
} from "../controllers/bank/bankController";

export const bankRouter = Router();

bankRouter.get("/:userId", getBankCard);
bankRouter.post("/:userId", addBankCard);
bankRouter.put("/:bankCardId", editBankCard);
