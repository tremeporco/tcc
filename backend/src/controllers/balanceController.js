import { balanceEquation } from "../services/balancer.js";
import { getCompounds } from "../services/pubchem.js";
import { prisma } from "../lib/prisma.js";

function extractCompounds(equation) {
  return equation
    .split(/[+=]/)
    .flatMap(part => part.split("+"))
    .map(item => item.trim())
    .map(item => item.replace(/^\d+\s*/, ""))
    .filter(Boolean);
}

export async function balance(req, res) {
  try {
    const { equation } = req.body;

    if (!equation) {
      return res.status(400).json({
        error: "Informe uma equação."
      });
    }

    // 1. Balanceia primeiro
    const result = balanceEquation(equation);

    console.log("Resultado:", result);
    console.log("Usuário:", req.user);

    // 2. Extrai os compostos
    const compounds = extractCompounds(result);

    console.log("Compostos encontrados:", compounds);

    // 3. Consulta o PubChem com intervalo entre requisições
    const pubchemData = await getCompounds(compounds);

    // 4. Salva no histórico
    if (req.user) {
      await prisma.reactionHistory.create({
        data: {
          userId: req.user.id,
          equation: result,
          reagents: result.split("=")[0].trim(),
          products: result.split("=")[1].trim(),
          is_balanced: true,
        },
      });

      console.log("Histórico salvo!");
    }

    return res.json({
      result,
      compounds: pubchemData
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message,
    });
  }
}