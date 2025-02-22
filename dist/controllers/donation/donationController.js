"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalEarningsDonations = exports.receivedDonation = exports.createDonation = exports.Donation = void 0;
const __1 = require("../..");
const Donation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const allDonations = yield __1.prisma.donation.findMany({
            where: {
                recipientId: userId,
            },
        });
        res.json({ message: "All", allDonations });
    }
    catch (error) {
        res.status(500).json({ error: "Error" });
    }
});
exports.Donation = Donation;
const createDonation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { donorId, amount, specialMessage, socialURLOrBuyMeACoffee, recipientId, } = req.body;
    try {
        console.log("calling");
        const data = yield __1.prisma.donation.create({
            data: {
                donorId,
                amount,
                specialMessage,
                socialURLOrBuyMeACoffee,
                recipientId,
            },
        });
        res.json({ message: "created", data });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
exports.createDonation = createDonation;
const receivedDonation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    console.log("working");
    try {
        const donations = yield __1.prisma.donation.findMany({
            where: {
                OR: [{ donorId: userId }, { recipientId: userId }],
            },
        });
        res.json({ message: "Success", donations });
    }
    catch (error) {
        console.error("Error fetching donations:", error);
        res.status(500).json({ error: "error" });
    }
});
exports.receivedDonation = receivedDonation;
const totalEarningsDonations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const today = new Date();
    const before30Days = new Date();
    before30Days.setDate(today.getDate() - 30);
    const before90Days = new Date();
    before90Days.setDate(today.getDate() - 90);
    try {
        const last90DaysDonations = yield __1.prisma.donation.findMany({
            where: {
                recipientId: userId,
                createdAt: {
                    gte: before90Days,
                },
                OR: [
                    {
                        recipientId: userId, // Donations where the user is the recipient
                    },
                ],
            },
        });
        const last30DaysDonations = last90DaysDonations.filter((donation) => donation.createdAt >= before30Days);
        const totalEarnings30Days = last30DaysDonations.reduce((acc, donation) => acc + donation.amount, 0);
        const totalEarnings90Days = last90DaysDonations.reduce((acc, donation) => acc + donation.amount, 0);
        res.json({
            message: "Total earnings",
            totalEarnings30Days,
            totalEarnings90Days,
            last30DaysDonations,
            last90DaysDonations,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});
exports.totalEarningsDonations = totalEarningsDonations;
