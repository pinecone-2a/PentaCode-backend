import { prisma } from "../..";

export const createDonation = async () => {
  const data = await prisma.donation.create({
    data: {
      amount: 1,
      specialMessage: "",
      socialURLOrBuyMeACoffee: "",
      donorId: "",
      recipientId: "",
    },
  });
};

export const allDonation = async () => {
  const data = await prisma.donation.findMany({
    data: {},
  });
};
