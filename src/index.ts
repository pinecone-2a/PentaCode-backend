import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { userRouter } from "./router/userRouter";
import { bankRouter } from "./router/bankRouter";
import { donationRouter } from "./router/donationRouter";
import { profileRouter } from "./router/profileRouter";

dotenv.config();
const port = process.env.PORT;
const app = express();
export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use("/auth", userRouter);
app.use("/bank-card", bankRouter);
app.use("/donation", donationRouter);
app.use("/profile", profileRouter);

app.listen(port, () => {
  console.log(`successfully started on http://localhost:${port}`);
});
