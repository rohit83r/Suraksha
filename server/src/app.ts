import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
// import { PrismaClient } from "@prisma/client";

dotenv.config();
const app = express();
// const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Smart Tourist Safety API running 🚀" });
});

// app.post("/api/v1/register", async (req: Request, res: Response) => {
//   const { name, email, password } = req.body;
//   try {
//     const user = await prisma.tourist.create({ data: { name, email, password } });
//     res.json(user);
//   } catch (err) {
//     res.status(400).json({ error: "User already exists" });
//   }
// });

export default app;
