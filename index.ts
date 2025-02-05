import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const addUser = async () => {
	const user = await prisma.user.create({
		data: {
			email: "amgaa0329@gmail.com",
			name: "Amgalanbaatar",
		},
	});
	console.log(user);
};
addUser();
