import { prisma } from "../lib/prisma.js";

// CREATE
export async function createSubstance(req, res) {
  try {
    const { name, formula } = req.body;

    const substance = await prisma.substance.create({
      data: {
        name,
        formula,
      },
    });

    return res.status(201).json(substance);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// READ
export async function getSubstances(req, res) {
  try {
    const substances = await prisma.substance.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return res.json(substances);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// UPDATE
export async function updateSubstance(req, res) {
  try {
    const { id } = req.params;
    const { name, formula } = req.body;

    const substance = await prisma.substance.update({
      where: { id },
      data: {
        name,
        formula,
      },
    });

    return res.json(substance);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// DELETE
export async function deleteSubstance(req, res) {
  try {
    const { id } = req.params;

    await prisma.substance.delete({
      where: { id },
    });

    return res.json({
      message: "Substância removida com sucesso",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}