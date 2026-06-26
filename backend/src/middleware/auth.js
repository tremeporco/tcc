// src/middleware/auth.js
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";

export const requireAuth = async (req, res, next) => {
  // O getSession lê os headers/cookies da requisição
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    // Se não houver sessão, barramos aqui com 401 (Unauthorized)
    return res.status(401).json({
      error: "Acesso negado. Por favor, faça login.",
    });
  }
  // Se estiver logado, "anexamos" o usuário à requisição
  // para que os próximos controllers saibam quem ele é
  req.user = session.user;
  req.session = session.session;

  // Libera para o próximo passo (next)na rota
  next();
};

