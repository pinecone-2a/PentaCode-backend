import { Router } from "express";
import {
  createProfile,
  currentUser,
  editProfile,
  getExplore,
  viewProfile,
  viewProfileForHome,
} from "../controllers/profile/profileController";
import { verifyCookie } from "../controllers/user/userController";

export const profileRouter = Router();

profileRouter.get("/view/:profileId", verifyCookie, viewProfile);
profileRouter.get("/currentuser/:userId", verifyCookie, currentUser);
profileRouter.get("/explore", verifyCookie, getExplore);
profileRouter.post("/:userId", verifyCookie, createProfile);
profileRouter.put("/:profileId", verifyCookie, editProfile);
profileRouter.get("/viewHome/:userId", verifyCookie, viewProfileForHome);
