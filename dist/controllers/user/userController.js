"use strict";
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
				  });
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCookie =
	exports.updatePassword =
	exports.resetPassword =
	exports.verifyOtp =
	exports.forgotPassword =
	exports.verifyUser =
	exports.checkUser =
	exports.addUser =
	exports.users =
		void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const nodemailer_1 = __importDefault(require("nodemailer"));
const userJWT_1 = require("./userJWT");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const users = (req, res) =>
	__awaiter(void 0, void 0, void 0, function* () {
		try {
			const user = yield prisma.user.findMany();
			res.json(user);
		} catch (e) {
			console.error(e, "error here --->");
		}
		try {
			const user = yield prisma.user.findMany();
			res.json(user);
		} catch (e) {
			console.error(e, "error here --->");
		}
	});
exports.users = users;
const addUser = (req, res) =>
	__awaiter(void 0, void 0, void 0, function* () {
		const { email, password, username } = req.body;
		try {
			if (password) {
				const rounds = 10;
				const encryptedPass = bcrypt_1.default.hashSync(password, rounds);
				const newUser = yield prisma.user.create({
					data: {
						email,
						password: encryptedPass,
						username,
					},
				});
				console.log("checking");
				res.json({ message: "successfully added", newUser });
			}
		} catch (e) {
			console.error(e, "error to add new user ====>");
		}
	});
exports.addUser = addUser;
const checkUser = (req, res) =>
	__awaiter(void 0, void 0, void 0, function* () {
		const { username, email, password } = req.body;
		try {
			const existingUser = yield prisma.user.findUnique({
				where: { username },
			});
			if (existingUser) {
				console.log("existing");
				return res.status(409).json({ message: "Username has already taken" });
			}
			const hashedPassword = yield bcrypt_1.default.hash(password, 10);
			const newUser = yield prisma.user.create({
				data: {
					email,
					password: hashedPassword,
					username,
				},
			});
			const refreshToken = jsonwebtoken_1.default.sign(
				{ userId: newUser.id },
				process.env.REFRESH_TOKEN_SECRET,
				{ expiresIn: "1h" }
			);
			const accessToken = (0, userJWT_1.generateAccessToken)(newUser.id);
			res
				.cookie("accessToken", accessToken, {
					sameSite: "strict",
					secure: true,
				})
				.cookie("refreshToken", refreshToken, {
					sameSite: "strict",
					secure: true,
				})
				.status(201)
				.json({
					success: true,
					message: "Successfully added",
					code: "SIGNED_IN",
					data: { accessToken, refreshToken },
				});
			return;
		} catch (error) {
			console.error("Error creating user:", error);
			return res.status(500).json({ message: "Internal server error" });
		}
	});
exports.checkUser = checkUser;
const verifyUser = (req, res) =>
	__awaiter(void 0, void 0, void 0, function* () {
		console.log("calling");
		const { email, password } = req.body;
		try {
			const user = yield prisma.user.findUnique({ where: { email } });
			if (!user) {
				return res.status(404).json({ message: "Email not found" });
			}
			const isPasswordCorrect = yield bcrypt_1.default.compare(
				password,
				user.password
			);
			if (isPasswordCorrect) {
				const refreshToken = jsonwebtoken_1.default.sign(
					{ userId: user.id },
					process.env.REFRESH_TOKEN_SECRET,
					{ expiresIn: "1h" }
				);
				const accessToken = (0, userJWT_1.generateAccessToken)(user.id);
				console.log("access token", accessToken);
				console.log("refresh token", refreshToken);
				res
					.cookie("accessToken", accessToken, {
						sameSite: "strict",
						secure: true,
					})
					.cookie("refreshToken", refreshToken, {
						sameSite: "strict",
						secure: true,
					})
					.json({
						success: true,
						message: "Login successful",
						code: "SIGNED_IN",
						data: { accessToken, refreshToken },
					});
				return;
			}
			if (!isPasswordCorrect) {
				return res.status(401).json({ message: "Incorrect password" });
			}
			res.json({ message: "Login successful", id: user.id });
		} catch (error) {
			console.error("Error verifying user:", error);
			res.status(200).json({ message: "User added successfully" });
		}
	});
exports.verifyUser = verifyUser;
const forgotPassword = (req, res) =>
	__awaiter(void 0, void 0, void 0, function* () {
		const { email } = req.body;
		if (!email) {
			res.status(400).json({ error: "Email is required" });
		}
		try {
			const user = yield prisma.user.findUnique({ where: { email } });
			if (!user) {
				res.status(404).json({ message: "User not found" });
				return;
			}
			const otp = Math.floor(Math.random() * 899999 + 100000).toString();
			const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
			yield prisma.otp.create({
				data: { email, otp, otpExpires },
			});
			const transporter = nodemailer_1.default.createTransport({
				host: "smtp.gmail.com",
				port: 465,
				secure: true,
				auth: {
					user: process.env.EMAIL_USER || "",
					pass: process.env.EMAIL_PASS || "",
				},
			});
			yield transporter.sendMail({
				from: process.env.EMAIL_USER,
				to: email,
				subject: "Password Reset OTP",
				text: `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`,
			});
			res.status(200).json({ message: "OTP sent successfully" });
		} catch (error) {
			console.error("Error in forgotPassword:", error);
			res.status(500).json({ message: "Server error" });
		}
	});
exports.forgotPassword = forgotPassword;
const verifyOtp = (req, res) =>
	__awaiter(void 0, void 0, void 0, function* () {
		const { email, otp } = req.body;
		if (!otp || !email) {
			res.status(400).json({ error: "Email and OTP are required" });
			return;
		}
		try {
			const otpRecord = yield prisma.otp.findFirst({
				where: { email, otp },
			});
			if (!otpRecord) {
				res.status(400).json({ error: "Invalid or expired OTP" });
				return;
			}
			res.status(200).json({ message: "OTP verified successfully" });
		} catch (error) {
			console.error("Error in verifyOtp:", error);
			res.status(500).json({ message: "Server error" });
		}
	});
exports.verifyOtp = verifyOtp;
const resetPassword = (req, res) =>
	__awaiter(void 0, void 0, void 0, function* () {
		const { email, password } = req.body;
		if (!email || !password) {
			res.status(400).json({ error: "Email and new password are required" });
			return;
		}
		try {
			const user = yield prisma.user.findUnique({ where: { email } });
			if (!user) {
				res.status(404).json({ error: "User not found" });
				return;
			}
			const salt = yield bcrypt_1.default.genSalt(10);
			const hashedPassword = yield bcrypt_1.default.hash(password, salt);
			yield prisma.user.update({
				where: { email },
				data: { password: hashedPassword },
			});
			res.status(200).json({ message: "Password reset successful" });
		} catch (error) {
			console.error("Error resetting password:", error);
			res.status(500).json({ error: "Server error" });
		}
	});
exports.resetPassword = resetPassword;
const updatePassword = (req, res) =>
	__awaiter(void 0, void 0, void 0, function* () {
		const { userId } = req.params;
		const { password } = req.body;
		const salt = yield bcrypt_1.default.genSalt(10);
		const hashedNewPassword = yield bcrypt_1.default.hash(password, salt);
		console.log("updating");
		try {
			console.log(hashedNewPassword);
			console.log(userId);
			const updatePassword = yield prisma.user.update({
				where: { id: userId },
				data: {
					password: hashedNewPassword,
				},
			});
			console.log(updatePassword);
			res.json({
				message: "Successfully updated the password ",
				updatePassword,
			});
		} catch (error) {
			res.status(401).json({ message: "Error to update password" });
		}
	});
exports.updatePassword = updatePassword;
const verifyCookie = (req, res, next) =>
	__awaiter(void 0, void 0, void 0, function* () {
		const { accessToken, refreshToken } = req.cookies;
		try {
			const user = jsonwebtoken_1.default.verify(
				accessToken,
				process.env.ACCESS_TOKEN_SECRET
			);
			if (user) {
				req.userId = user.userId;
				return next();
			}
		} catch (error) {
			if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
				console.log("Access token expired, trying refresh token...");
				try {
					const refreshUser = jsonwebtoken_1.default.verify(
						refreshToken,
						process.env.REFRESH_TOKEN_SECRET
					);
					console.log("Refresh User:", refreshUser);
					if (refreshUser) {
						const newAccessToken = (0, userJWT_1.generateAccessToken)(
							refreshUser.userId
						);
						console.log("New Access Token:", newAccessToken);
						res.cookie("accessToken", newAccessToken, {
							sameSite: "strict",
							secure: true,
						});
						req.userId = refreshUser.userId;
						return next();
					}
				} catch (err) {
					console.error("Invalid or expired refresh token:", err);
					res.status(401).json({ error: "Invalid or expired refresh token" });
				}
			}
			res.status(404).json({ error: "Token not found" });
		}
	});
exports.verifyCookie = verifyCookie;
