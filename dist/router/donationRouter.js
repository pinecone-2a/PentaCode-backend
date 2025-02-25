"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.donationRouter = void 0;
const express_1 = require("express");
const donationController_1 = require("../controllers/donation/donationController");
const userController_1 = require("../controllers/user/userController");
exports.donationRouter = (0, express_1.Router)();
exports.donationRouter.post(
	"/",
	userController_1.verifyCookie,
	donationController_1.createDonation
);
exports.donationRouter.get(
	"/received/:userId",
	userController_1.verifyCookie,
	donationController_1.receivedDonation
);
exports.donationRouter.get(
	"/total-earnings/:userId",
	userController_1.verifyCookie,
	donationController_1.totalEarningsDonations
);
exports.donationRouter.get(
	"/:userId",
	userController_1.verifyCookie,
	donationController_1.Donation
);
