import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { userRouter } from "./src/router/userRouter";
import { donationRouter } from "./src/router/donationRouter";
const port = 5000;
dotenv.config();
export const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/user", userRouter);
app.use("/donation", donationRouter);
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
