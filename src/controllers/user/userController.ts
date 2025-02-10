import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { request } from "http";

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
