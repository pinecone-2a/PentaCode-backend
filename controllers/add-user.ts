import { prisma } from "..";

export const addUser = async () => {
	const user = await prisma.user.create({
		data: { email: "tsoomoo@gmail.com", name: "tsoomoo" },
	});
	console.log(user);
};
