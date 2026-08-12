import { getCompound, getElement } from "../services/pubchem.js";

export async function searchCompound(req, res) {
  try {
    const { name } = req.params;

    const compound = await getCompound(name);

    res.json(compound);
  } catch (error) {
    res.status(404).json({
      error: error.message,
    });
  }
}

export async function searchElement(req, res) {
  try {
    const { number } = req.params;

    const atomicNumber = Number(number);

    if (
      !Number.isInteger(atomicNumber) ||
      atomicNumber < 1 ||
      atomicNumber > 118
    ) {
      return res.status(400).json({
        error: "Número atômico inválido",
      });
    }

    const element = await getElement(atomicNumber);

    res.json(element);
  } catch (error) {
    res.status(404).json({
      error: error.message,
    });
  }
}