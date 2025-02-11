import { Router } from "express";
import {
  createProfile,
  currentUser,
  editProfile,
  getExplore,
  viewProfile,
} from "../controllers/profile/profileController";

export const profileRouter = Router();

profileRouter.get("/view/:userId", viewProfile);
profileRouter.get("/currentuser/:userId", currentUser);
profileRouter.get("/explore", getExplore);
profileRouter.post("/:userId", createProfile);
profileRouter.put("/:profileId", editProfile);
