import { Request, Response } from "express";
import { prisma } from "../../..";

export const addUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.create({
      data: { email: "tsoomoo@gmail.com", name: "tsoomoo" },
    });
    res.json(user);
    console.log(user);
  } catch (e) {
    console.error(e, "aldaa");
  }
};
export const users = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (e) {
    console.error(e, "aldaa");
  }
};
