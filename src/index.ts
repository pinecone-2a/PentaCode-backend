import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { userRouter } from "./router/userRouter";
import { donationRouter } from "./router/donationRouter";

dotenv.config();
const port = 5000;
const app = express();
export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use("/user", userRouter);
app.use("/donation", donationRouter);

app.listen(port, () => {
  console.log(`successfully started on http://localhost:${port}`);
});
