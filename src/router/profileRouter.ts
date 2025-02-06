import { Router } from "express";
import { createProfile } from "../controllers/profile/profileController";

export const profileRouter = Router();

profileRouter.get("/profile/view/:username")
profileRouter.get("/profile/current-user")
profileRouter.get("/profile/explore")
profileRouter.post("/profile/:userId" , createProfile)
profileRouter.put("/profile/:profileId")