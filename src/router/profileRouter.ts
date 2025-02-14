import { Router } from "express";
import {
  createProfile,
  currentUser,
  editProfile,
  getExplore,
  viewProfile,
  viewProfileForHome,
} from "../controllers/profile/profileController";

export const profileRouter = Router();

profileRouter.get("/view/:profileId", viewProfile);
profileRouter.get("/viewHome/:userId", viewProfileForHome);
profileRouter.get("/currentuser/:userId", currentUser);
profileRouter.get("/explore", getExplore);
profileRouter.post("/:userId", createProfile);
profileRouter.put("/:profileId", editProfile);
