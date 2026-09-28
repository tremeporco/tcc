import {
  calculateStoichiometry,
} from "../services/stoichiometryService.js";

import elementsData from "../data/periodicTable.json" with {
  type: "json",
};

export function calculateStoichiometryController(req, res) {
  try {
    const {
      equation,
      substance,
      quantity,
    } = req.body;

    if (!equation || !substance || !quantity) {
      return res.status(400).json({
        error:
          "Equação, substância e quantidade são obrigatórias.",
      });
    }

    const elements = elementsData.elements;

    const result = calculateStoichiometry({
      equation,
      substance,
      quantity,
      elements,
    });

    return res.json(result);
  } catch (error) {
    console.error(
      "Erro na estequiometria:",
      error
    );

    return res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Erro ao realizar cálculo estequiométrico.",
    });
  }
}