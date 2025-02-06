import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
import { userRouter } from "./router/userRouter";
const port = 5000;

export const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/user", userRouter);
app.listen(port, () => {
	console.log(`http://localhost:${port}`);
});
