import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const users = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findMany();
    res.json(user);
  } catch (e) {
    console.error(e, "error here --->");
  }
};

export const checkUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const username = req.body.username;
  try {
    const userList = await prisma.user.findUnique({ where: { username } });
    if (userList) {
      res.json({ message: "Username has already taken" });
    } else {
      res.json({ message: "Username is available" });
      next();
    }
  } catch (e) {
    console.error(e, "error catching usernames --->");
  }
};

export const checkEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.body.email;
  try {
    const emailList = await prisma.user.findUnique({ where: { email } });
    if (emailList) {
      res.json({ message: "Email has already taken" });
    } else {
      res.json({ message: "Email is available" });
      next();
    }
  } catch (e) {
    console.error(e, "error catching email --->");
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
      res.json({ message: "successfully added", id: newUser.id });
    }
  } catch (e) {
    console.error(e, "error to add new user ====>");
  }
};
