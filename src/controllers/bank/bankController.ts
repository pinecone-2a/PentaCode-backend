import { Request, Response } from "express";
import { prisma } from "../../..";

export const getBankCard = async (req: Request, res: Response) => {
  try {
    const bankCard = await prisma.bankCard.findUnique({
      where: {
        userId: req.params.userId,
      },
    });
    res.json(bankCard);
  } catch (e) {
    console.error(e, "error here --->");
  }
};

export const addBankCard = async (req: Request, res: Response) => {
  const { cardNumber, country, firstName, lastName, expiryDate, cvc } =
    req.body;
  const { userId } = req.params;
  try {
    const newBankCard = await prisma.bankCard.create({
      data: {
        cardNumber,
        country,
        firstName,
        lastName,
        expiryDate,
        cvc,
        userId,
      },
    });
    res.json({ message: "successfully added", id: newBankCard.id });
  } catch (e) {
    console.error(e, "error to add new user ====>");
  }
};
