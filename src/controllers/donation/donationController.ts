import { Request, Response } from "express";
import { prisma } from "../../..";

export const Donation = async (req: Request, res: Response) => {
	const userId = req.params.userId;
	try {
		const allDonations = await prisma.donation.findMany({
			where: {
				OR: [{ donorId: userId }, { recipientId: userId }],
			},
		});

		res.json({ message: "All", allDonations });
	} catch (error) {
		res.send(error);
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
		console.log("checking");
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
		res.send(error);
	}
};

export const receivedDonation = async (req: Request, res: Response) => {
	const userId = req.params.userId;
	try {
		const donations = await prisma.donation.findMany({
			where: {
				donorId: userId,
			},
		});
		res.json({ message: "received", donations });
	} catch (error) {
		res.send(error);
	}
};

export const totalEarningsDonations = async (req: Request, res: Response) => {
	const userId = req.params.userId;
	const today = new Date();

	// Get the date 30 and 90 days ago
	const before30Day = new Date(today);
	before30Day.setDate(today.getDate() - 30);

	const before90Day = new Date(today);
	before90Day.setDate(today.getDate() - 90);

	try {
		const donations = await prisma.donation.findMany({
			where: {
				createdAt: {
					gt: before90Day, // Donations after 90 days ago
					lt: before30Day, // Donations before 30 days ago
				},
				OR: [
					{
						recipientId: userId, // Donations where the user is the recipient
					},
				],
			},
		});

		// Calculate the total earnings from donations
		const totalEarnings = donations.reduce((acc, donation) => {
			return acc + donation.amount;
		}, 0);

		// Respond with the total earnings and donations data
		res.json({ message: "total", donations, totalEarnings });
	} catch (error) {
		// If there's an error, send it as a response
		res.send(error);
	}
};
