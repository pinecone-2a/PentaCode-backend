import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const checkUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const username = req.body.username;
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (user) {
      res.json({ message: "username taken" });
    } else {
      res.json({ message: "available" });
      next();
    }
  } catch (e) {
    console.error(e, "error here --->");
  }
};
