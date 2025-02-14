import { Router } from "express";
import {
  addBankCard,
  editBankCard,
  getBankCard,
} from "../controllers/bank/bankController";
import { verifyCookie } from "../controllers/user/userController";

export const bankRouter = Router();

bankRouter.get("/:userId", verifyCookie, getBankCard);
bankRouter.post("/:userId", verifyCookie, addBankCard);
bankRouter.put("/:userId", verifyCookie, editBankCard);
