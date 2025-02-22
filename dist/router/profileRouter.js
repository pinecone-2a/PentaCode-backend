"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileRouter = void 0;
const express_1 = require("express");
const profileController_1 = require("../controllers/profile/profileController");
const userController_1 = require("../controllers/user/userController");
exports.profileRouter = (0, express_1.Router)();
exports.profileRouter.get(
	"/view/:profileId",
	userController_1.verifyCookie,
	profileController_1.viewProfile
);
exports.profileRouter.get(
	"/currentuser/:userId",
	userController_1.verifyCookie,
	profileController_1.currentUser
);
exports.profileRouter.get(
	"/explore",
	userController_1.verifyCookie,
	profileController_1.getExplore
);
exports.profileRouter.post(
	"/:userId",
	userController_1.verifyCookie,
	profileController_1.createProfile
);
exports.profileRouter.put(
	"/:profileId",
	userController_1.verifyCookie,
	profileController_1.editProfile
);
exports.profileRouter.get(
	"/viewHome/:userId",
	userController_1.verifyCookie,
	profileController_1.viewProfileForHome
);
