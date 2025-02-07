import express from "express";
import cors from "cors";
import { userRouter } from "./router/userRouter";
import { profileRouter } from "./router/profileRouter";
import { configDotenv } from "dotenv";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
const port = 5000;
configDotenv();
dotenv.config();
const app = express();
export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use("/user", userRouter);
app.use("/profile", profileRouter);

app.listen(port, () => {
  console.log(`successfully started on http://localhost:${port}`);
});
