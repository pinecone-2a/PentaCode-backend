import { Router } from "express";

export const donationRouter = Router();

donationRouter.post("/create-donation");
donationRouter.get("/recieved/:userId");
donationRouter.get("/total-earnings/:userId");
donationRouter.get("/search-donations/:userId");
