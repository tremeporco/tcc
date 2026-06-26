import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { auth } from "./lib/auth.js";
import { toNodeHandler } from "better-auth/node";
import { requireAuth } from "./middleware/auth.js";


import substanceRoutes from "./routes/substanceRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;

app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true,
}));

app.use(express.json());

app.use("/api/auth", toNodeHandler(auth));


app.use("/api/substances", substanceRoutes);

app.get("/api/me", requireAuth, (req, res) => {
  res.json({
    message: "Bem-vindo ao seu perfil!",
    user: req.user,
  });
});

app.listen(PORT, () => {
  console.log(`🧪 Servidor rodando em http://localhost:${PORT}`);
});