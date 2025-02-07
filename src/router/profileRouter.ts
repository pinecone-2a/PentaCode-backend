import { Router } from "express";
import {
  createProfile,
  currentUser,
  editProfile,
  getExplore,
  viewProfile,
} from "../controllers/profile/profileController";

export const profileRouter = Router();

profileRouter.get("/profile/view/:username", viewProfile);
profileRouter.get("/profile/current-user", currentUser);
profileRouter.get("/profile/explore", getExplore);
profileRouter.post("/profile/:userId", createProfile);
profileRouter.put("/profile/:profileId", editProfile);
