import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export const users = async (req: Request, res: Response) => {
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
      console.log("checking");
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
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          username,
        },
      });
      console.log("User created:", newUser);
      return res
        .status(201)
        .json({ message: "Successfully added", id: newUser.id });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyUser = async (req: any, res: any) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    res.json({ message: "Login successful", id: user.id });
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 899999 + 100000).toString();
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
