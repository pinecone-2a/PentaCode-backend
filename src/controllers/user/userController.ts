import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import { generateAccessToken } from "./userJWT";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const users = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findMany();
    res.json(user);
  } catch (e) {
    console.error(e, "error here --->");
  }
  try {
    const user = await prisma.user.findMany();
    res.json(user);
  } catch (e) {
    console.error(e, "error here --->");
  }
};

export const addUser = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  try {
    if (password) {
      const rounds = 10;
      const encryptedPass = bcrypt.hashSync(password, rounds);
      const newUser = await prisma.user.create({
        data: {
          email,
          password: encryptedPass,
          username,
        },
      });
      res.json({ message: "successfully added", newUser });
    }
  } catch (e) {
    console.error(e, "error to add new user ====>");
  }
};

export const checkUser = async (req: any, res: any) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: "Username has already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
    });

    const refreshToken = jwt.sign(
      { userId: newUser.id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "1h" }
    );
    const accessToken = generateAccessToken(newUser.id);
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
};

export const verifyUser = async (req: any, res: any) => {
  console.log("calling");
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.REFRESH_TOKEN_SECRET!,
        { expiresIn: "1h" }
      );
      const accessToken = generateAccessToken(user.id);
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
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const otp = Math.floor(Math.random() * 899999 + 100000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otp.create({
      data: { email, otp, otpExpires },
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER || "",
        pass: process.env.EMAIL_PASS || "",
      },
    });

    await transporter.sendMail({
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
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!otp || !email) {
    res.status(400).json({ error: "Email and OTP are required" });
    return;
  }

  try {
    const otpRecord = await prisma.otp.findFirst({
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
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and new password are required" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedNewPassword = await bcrypt.hash(password, salt);
  console.log("updating");
  try {
    console.log(hashedNewPassword);
    console.log(userId);
    const updatePassword = await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedNewPassword,
      },
    });
    console.log(updatePassword);
    res.json({ message: "Successfully updated the password ", updatePassword });
  } catch (error) {
    res.status(401).json({ message: "Error to update password" });
  }
};

export type CustomRequest = Request & {
  userId?: string;
};
export const verifyCookie = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { accessToken, refreshToken } = req.cookies;

  try {
    const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as {
      userId: string;
    };
    if (user) {
      req.userId = user.userId;
      return next();
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.log("Access token expired, trying refresh token...");

      try {
        const refreshUser = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET!
        ) as { userId: string };
        console.log("Refresh User:", refreshUser);

        if (refreshUser) {
          const newAccessToken = generateAccessToken(refreshUser.userId);
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
};
