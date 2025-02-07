import { Request, Response } from "express";
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
