// src/lib/prisma.js
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };

async function criarUsuario() {
  const usuario = await prisma.user.create({
    data: {
      email: "joao@exemplo.com",
      passwordHash: "hash_da_senha_aqui",
    
    },
  });
  console.log("Usuário criado:", usuario);
}

async function buscarUsuario() {
  const usuario = await prisma.user.findUnique({
    where: {
      email: "joao@exemplo.com",
    },
    include: {
      reactions: true, 
    },
  });

  console.log("Usuário encontrado:", usuario);
}

