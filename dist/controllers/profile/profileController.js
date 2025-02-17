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
exports.viewProfileForHome = exports.editProfile = exports.createProfile = exports.getExplore = exports.currentUser = exports.viewProfile = void 0;
const __1 = require("../..");
const viewProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { profileId } = req.params;
    try {
        const view = yield __1.prisma.profile.findUnique({
            where: {
                id: profileId,
            },
        });
        console.log(view);
        res.json(view);
    }
    catch (e) {
        console.error(e, " Hereglegch baisangue");
    }
});
exports.viewProfile = viewProfile;
const currentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.userId;
    try {
        console.log("calling");
        const currentProfile = yield __1.prisma.profile.findUnique({
            where: {
                userId: id,
            },
        });
        console.log(currentProfile);
        res.json(currentProfile);
    }
    catch (e) {
        console.error(e, "Have not profile ");
    }
});
exports.currentUser = currentUser;
const getExplore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchQuery = typeof req.query.search === "string" ? req.query.search : undefined;
        const filter = searchQuery
            ? {
                where: {
                    name: {
                        startsWith: searchQuery,
                    },
                },
            }
            : {};
        const explore = yield __1.prisma.profile.findMany(filter);
        console.log(searchQuery);
        res.json(explore);
    }
    catch (e) {
        console.error(e, "Error fetching profiles");
        res
            .status(500)
            .json({ message: "An error occurred while fetching profiles" });
    }
});
exports.getExplore = getExplore;
const createProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const { name, about, avatarImage, socialMediaURL } = req.body;
    try {
        const newProfile = yield __1.prisma.profile.create({
            data: {
                userId,
                name,
                about,
                avatarImage,
                socialMediaURL,
            },
        });
        res.json({ message: "Successfully add new profile", newProfile });
    }
    catch (e) {
        console.error(e, "Check your hosoo");
    }
});
exports.createProfile = createProfile;
const editProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.profileId;
    const { name, about, avatarImage, socialMediaURL } = req.body;
    try {
        console.log(id);
        const edit = yield __1.prisma.profile.update({
            where: {
                userId: id,
            },
            data: {
                name: name,
                about: about,
                avatarImage: avatarImage,
                socialMediaURL: socialMediaURL,
            },
        });
        res.json({ message: "Successfull edited " });
    }
    catch (e) {
        console.error(e, "Aldaa bnaa broda sain shalgaarai");
    }
});
exports.editProfile = editProfile;
const viewProfileForHome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    console.log(userId);
    try {
        const view = yield __1.prisma.profile.findUnique({
            where: {
                userId,
            },
        });
        console.log(view);
        res.json(view);
    }
    catch (e) {
        console.error(e, " Hereglegch baisangue");
    }
});
exports.viewProfileForHome = viewProfileForHome;
