import { prisma } from "../lib/prisma.js";

// CREATE
export async function createHistory(req, res) {
  try {
    const {
      reagents,
      products,
      equation,
      isBalanced,
      temperature,
      pressure,
      reactionType,
    } = req.body;

    if (!reagents || !equation) {
      return res.status(400).json({
        error: "Reagentes e equação são obrigatórios",
      });
    }

    const historico = await prisma.reactionHistory.create({
      data: {
        userId: req.user.id,
        reagents,
        products,
        equation,
        isBalanced: Boolean(isBalanced),
        temperature,
        pressure,
        reactionType,
      },
    });

    return res.status(201).json(historico);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao criar histórico",
    });
  }
}

// READ
export async function getHistory(req, res) {
  try {
    const data = await prisma.reactionHistory.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao buscar histórico",
    });
  }
}

// UPDATE
export async function updateHistory(req, res) {
  try {
    const { id } = req.params;

    const {
      reagents,
      products,
      equation,
      isBalanced,
      temperature,
      pressure,
      reactionType,
    } = req.body;

    const updated = await prisma.reactionHistory.update({
      where: {
        id,
        userId: req.user.id, // garante dono do registro
      },
      data: {
        reagents,
        products,
        equation,
        isBalanced: Boolean(isBalanced),
        temperature,
        pressure,
        reactionType,
      },
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao atualizar histórico",
    });
  }
}

// DELETE
export async function deleteHistory(req, res) {
  try {
    const { id } = req.params;

    await prisma.reactionHistory.delete({
      where: {
        id,
        userId: req.user.id, // segurança: só apaga o próprio
      },
    });

    return res.json({
      message: "Histórico removido com sucesso",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao deletar histórico",
    });
  }
}