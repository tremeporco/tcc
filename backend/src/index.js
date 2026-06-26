import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { auth } from "./lib/auth.js";
import { toNodeHandler } from "better-auth/node";
import { requireAuth } from "./middleware/auth.js";

import historyRoutes from "./routes/historyRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;

/* ⚗️ CORS */
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true,
}));

/* ⚗️ JSON */
app.use(express.json());

/* ⚗️ AUTH */
app.use("/api/auth", toNodeHandler(auth));

/* ⚗️ HISTORY ROUTES */
app.use("/api/history", historyRoutes);

/* ⚗️ TEST ROUTE */
app.get("/api/me", requireAuth, (req, res) => {
  res.json({
    message: "Bem-vindo ao seu perfil!",
    user: req.user,
  });
});

/* ⚗️ SERVER START */
app.listen(PORT, () => {
  console.log(`🧪 Servidor rodando em http://localhost:${PORT}`);
});