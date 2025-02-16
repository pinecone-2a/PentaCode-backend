import { Router } from "express";
import {
  createDonation,
  Donation,
  receivedDonation,
  totalEarningsDonations,
} from "../controllers/donation/donationController";
import { verifyCookie } from "../controllers/user/userController";

export const donationRouter = Router();

donationRouter.post("/", verifyCookie, createDonation);
donationRouter.get("/received/:userId", verifyCookie, receivedDonation);
donationRouter.get(
  "/total-earnings/:userId",
  verifyCookie,
  totalEarningsDonations
);
donationRouter.get("/:userId", verifyCookie, Donation);
