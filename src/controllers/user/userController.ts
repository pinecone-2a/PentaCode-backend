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
    const user = await prisma.user.findMany();
    res.json(user);
  } catch (e) {
    console.error(e, "error here --->");
  }
};

export const addUser = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        password,
        username,
      },
    });
    res.json({ message: "successfully added", id: newUser.id });
  } catch (e) {
    console.error(e, "error to add new user ====>");
  }
};
