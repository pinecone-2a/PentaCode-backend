import { Request, Response } from "express";
import { prisma } from "../..";

export const Donation = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const allDonations = await prisma.donation.findMany({
      where: {
        OR: [{ donorId: userId }, { recipientId: userId }],
      },
    });

    res.json({ message: "All", allDonations });
  } catch (error) {
    res.status(500).json({ error: "Error" });
  }
};

export const createDonation = async (req: Request, res: Response) => {
  const {
    donorId,
    amount,
    specialMessage,
    socialURLOrBuyMeACoffee,
    recipientId,
  } = req.body;
  try {
    console.log("calling");
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
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const receivedDonation = async (req: Request, res: Response) => {
  const { userId } = req.params;
   console.log("working")
  try {
 
    const donations = await prisma.donation.findMany({
      where: {
        OR: [{ donorId: userId }, { recipientId: userId }],
      },
    });

    res.json({ message: "Success", donations });
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ error: "error" });
  }
};
export const totalEarningsDonations = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const today = new Date();

  const before30Days = new Date();
  before30Days.setDate(today.getDate() - 30);

  const before90Days = new Date();
  before90Days.setDate(today.getDate() - 90);

  try {
    const last90DaysDonations = await prisma.donation.findMany({
      where: {
        recipientId: userId,
        createdAt: {
          gte: before90Days,
        },
        OR: [
          {
            recipientId: userId, // Donations where the user is the recipient
          },
        ],
      },
    });

    const last30DaysDonations = last90DaysDonations.filter(
      (donation) => donation.createdAt >= before30Days
    );
    const totalEarnings30Days = last30DaysDonations.reduce(
      (acc, donation) => acc + donation.amount,
      0
    );

    const totalEarnings90Days = last90DaysDonations.reduce(
      (acc, donation) => acc + donation.amount,
      0
    );

    res.json({
      message: "Total earnings",
      totalEarnings30Days,
      totalEarnings90Days,
      last30DaysDonations,
      last90DaysDonations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
