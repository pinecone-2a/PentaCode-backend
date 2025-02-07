import { Request, Response } from "express";
import { prisma } from "../..";

export const createDonation = async (req: Request, res: Response) => {
  const {
    donorId,
    amount,
    specialMessage,
    socialURLOrBuyMeACoffee,
    recipientId,
  } = req.body;
  const data = await prisma.donation.create({
    data: {
      donorId,
      amount,
      specialMessage,
      socialURLOrBuyMeACoffee,
      recipientId,
    },
  });
  res.json({ message: "created", data });
};

export const receivedDonation = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const donations = await prisma.donation.findMany({
    include: {
      donor: true,
      recipient: true,
    },
  });
  res.json();
};
export const totalEarningsDonations = async (req: Request, res: Response) => {
  const today = new Date();
  const before30Day = today.getDay() - 30;
  const donations = await prisma.donation.findMany({
    where: {
      createdAt: {
        lt: new Date(before30Day),
      },
    },
  });
  const totalEarnings = donations.reduce((acc, donation) => {
    return acc + donation.amount;
  }, 0);
  res.json(donations);
};
export const Donation = async (req: Request, res: Response) => {
  const donations = await prisma.donation.findMany({});
  res.json(donations);
};
