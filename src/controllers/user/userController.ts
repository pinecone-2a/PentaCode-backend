import { Request, Response } from "express";
import { prisma } from "../..";

// export const addUser = async () => {
// 	const user = await prisma.user.create({
// 		data: { email: "tsoomoo@gmail.com", username: "tsoomoo" },
// 	});
// 	console.log(user);
// };

export const users = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (e) {
    console.error(e, "aldaa");
  }
};
