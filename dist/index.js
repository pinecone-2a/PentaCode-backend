"use strict";
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const userRouter_1 = require("./router/userRouter");
const bankRouter_1 = require("./router/bankRouter");
const donationRouter_1 = require("./router/donationRouter");
const profileRouter_1 = require("./router/profileRouter");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const port = process.env.PORT;
const app = (0, express_1.default)();
exports.prisma = new client_1.PrismaClient();
app.use(
	(0, cors_1.default)({
		origin: process.env.FRONTEND,
		credentials: true,
	})
);
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/auth", userRouter_1.userRouter);
app.use("/bank-card", bankRouter_1.bankRouter);
app.use("/donation", donationRouter_1.donationRouter);
app.use("/profile", profileRouter_1.profileRouter);
app.listen(port, () => {
	console.log(`successfully started on http://localhost:${port}`);
});
