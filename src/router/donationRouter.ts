import { Router } from "express";
import {
  createDonation,
  receivedDonation,
  Donation,
  totalEarningsDonations,
} from "../controllers/donation/donationController";

export const donationRouter = Router();

donationRouter.post("/", createDonation);
donationRouter.get("/received/:userId", receivedDonation);
donationRouter.get("/total-earnings/:userId", totalEarningsDonations);
donationRouter.get("/:userId", Donation);
