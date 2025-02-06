import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { userRouter } from "./src/router/userRouter";

dotenv.config();
const port = 5000;
const app = express();
export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use("/user", userRouter);
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
