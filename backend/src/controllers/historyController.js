import { prisma } from "../lib/prisma.js";

// CREATE
export async function createHistory(req, res) {
  try {
    const {
      reagents,
      products,
      equation,
      is_balanced,
      temperature,
      pressure,
      reaction_type,
    } = req.body;

    const history = await prisma.reactionHistory.create({
      data: {
        userId: req.user.id,
        reagents,
        products,
        equation,
        is_balanced,
        temperature,
        pressure,
        reaction_type,
      },
    });

    return res.status(201).json(history);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

// READ
export async function getHistory(req, res) {
  try {
    const history = await prisma.reactionHistory.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(history);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
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
      is_balanced,
      temperature,
      pressure,
      reaction_type,
    } = req.body;

    const history = await prisma.reactionHistory.update({
      where: {
        id,
      },
      data: {
        reagents,
        products,
        equation,
        is_balanced,
        temperature,
        pressure,
        reaction_type,
      },
    });

    return res.json(history);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
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
      },
    });

    return res.json({
      message: "Histórico removido com sucesso.",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}