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
exports.editBankCard = exports.addBankCard = exports.getBankCard = void 0;
const __1 = require("../..");
const getBankCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bankCard = yield __1.prisma.bankCard.findUnique({
            where: {
                userId: req.params.userId,
            },
        });
        res.json(bankCard);
    }
    catch (e) {
        console.error(e, "error here --->");
    }
});
exports.getBankCard = getBankCard;
const addBankCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cardNumber, country, firstName, lastName, expiryDate, cvc } = req.body;
    const { userId } = req.params;
    console.log("adding");
    try {
        const newBankCard = yield __1.prisma.bankCard.create({
            data: {
                cardNumber,
                country,
                firstName,
                lastName,
                expiryDate,
                cvc,
                userId,
            },
        });
        res.json({ message: "successfully added", id: newBankCard.id });
    }
    catch (e) {
        console.error(e, "error to add new bank card ====>");
    }
});
exports.addBankCard = addBankCard;
const editBankCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    console.log(userId);
    console.log("editting");
    const { cardNumber, country, firstName, lastName, expiryDate, cvc } = req.body;
    try {
        const newBankCard = yield __1.prisma.bankCard.update({
            where: {
                userId,
            },
            data: {
                cardNumber,
                country,
                firstName,
                lastName,
                expiryDate,
                cvc,
            },
        });
        res.json({ message: "successfully edited", id: newBankCard.id });
    }
    catch (e) {
        console.error(e, "error to eidt bank card ====>");
    }
});
exports.editBankCard = editBankCard;
