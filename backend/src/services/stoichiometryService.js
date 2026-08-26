const AVOGADRO = 6.02214076e23;
const MOLAR_VOLUME_CNTP = 22.4;

function parseFormula(formula) {
  const tokens = formula.match(/([A-Z][a-z]?|\(|\)|\d+)/g);

  if (!tokens) {
    return null;
  }

  const stack = [{}];
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];

    if (token === "(") {
      stack.push({});
      i++;
      continue;
    }

    if (token === ")") {
      const group = stack.pop();

      if (!group) {
        return null;
      }

      let multiplier = 1;

      if (
        tokens[i + 1] &&
        /^\d+$/.test(tokens[i + 1])
      ) {
        multiplier = Number(tokens[i + 1]);
        i++;
      }

      const current = stack[stack.length - 1];

      for (const [symbol, count] of Object.entries(group)) {
        current[symbol] =
          (current[symbol] ?? 0) +
          count * multiplier;
      }

      i++;
      continue;
    }

    if (/^[A-Z][a-z]?$/.test(token)) {
      const symbol = token;

      let multiplier = 1;

      if (
        tokens[i + 1] &&
        /^\d+$/.test(tokens[i + 1])
      ) {
        multiplier = Number(tokens[i + 1]);
        i++;
      }

      const current = stack[stack.length - 1];

      current[symbol] =
        (current[symbol] ?? 0) + multiplier;

      i++;
      continue;
    }

    return null;
  }

  if (stack.length !== 1) {
    return null;
  }

  return stack[0];
}

function getMolarMass(formula, elements) {
  const composition = parseFormula(formula);

  if (!composition) {
    return null;
  }

  let mass = 0;

  for (const [symbol, amount] of Object.entries(composition)) {
    const element = elements.find(
      (item) => item.symbol === symbol
    );

    if (
      !element ||
      element.atomic_mass === undefined
    ) {
      return null;
    }

    mass += element.atomic_mass * amount;
  }

  return mass;
}

function parseQuantity(value) {
  if (typeof value !== "string") {
    throw new Error(
      "A quantidade deve ser informada como texto."
    );
  }

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(",", ".");

  const match = normalized.match(
    /^([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)\s*(g|gramas?|mol|mols?|l|litros?|part[ií]culas?)$/
  );

  if (!match) {
    throw new Error(
      "Informe a quantidade com a unidade. Exemplos: 10 g, 2 mol, 5 L ou 6,02e23 partículas."
    );
  }

  const quantity = Number(match[1]);
  const rawUnit = match[2];

  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new Error(
      "A quantidade deve ser maior que zero."
    );
  }

  let unit;

  if (rawUnit === "g" || rawUnit.startsWith("gram")) {
    unit = "g";
  } else if (
    rawUnit === "mol" ||
    rawUnit === "mols"
  ) {
    unit = "mol";
  } else if (
    rawUnit === "l" ||
    rawUnit.startsWith("litro")
  ) {
    unit = "L";
  } else {
    unit = "particles";
  }

  return {
    quantity,
    unit,
  };
}

function convertToMoles(
  quantity,
  unit,
  molarMass
) {
  switch (unit) {
    case "g":
      return quantity / molarMass;

    case "mol":
      return quantity;

    case "L":
      return quantity / MOLAR_VOLUME_CNTP;

    case "particles":
      return quantity / AVOGADRO;

    default:
      return NaN;
  }
}

function parseReaction(equation) {
  if (
    typeof equation !== "string" ||
    !equation.trim()
  ) {
    throw new Error(
      "Equação química não informada."
    );
  }

  const normalized = equation
    .replace(/→/g, "=")
    .replace(/->/g, "=");

  const sides = normalized.split("=");

  if (sides.length !== 2) {
    throw new Error(
      "A equação deve possuir reagentes e produtos."
    );
  }

  const substances = [];

  function parseSide(compounds, side) {
    for (const compound of compounds) {
      const clean = compound.trim();

      if (!clean) {
        continue;
      }

      const match = clean.match(
        /^(\d+)?\s*([A-Za-z][A-Za-z0-9()]*)$/
      );

      if (!match) {
        throw new Error(
          `Não foi possível interpretar a substância "${clean}".`
        );
      }

      const coefficient = match[1]
        ? Number(match[1])
        : 1;

      substances.push({
        formula: match[2],
        coefficient,
        side,
      });
    }
  }

  parseSide(
    sides[0].split("+"),
    "reactant"
  );

  parseSide(
    sides[1].split("+"),
    "product"
  );

  if (substances.length === 0) {
    throw new Error(
      "Nenhuma substância encontrada na reação."
    );
  }

  return substances;
}

export function calculateStoichiometry({
  equation,
  substance,
  quantity,
  elements,
}) {
  const substances = parseReaction(equation);

  const selected = substances.find(
    (item) => item.formula === substance
  );

  if (!selected) {
    throw new Error(
      "Substância não encontrada na reação."
    );
  }

  const parsedQuantity = parseQuantity(quantity);

  const selectedMolarMass = getMolarMass(
    selected.formula,
    elements
  );

  if (!selectedMolarMass) {
    throw new Error(
      `Não foi possível calcular a massa molar de ${selected.formula}.`
    );
  }

  const selectedMoles = convertToMoles(
    parsedQuantity.quantity,
    parsedQuantity.unit,
    selectedMolarMass
  );

  if (
    !Number.isFinite(selectedMoles) ||
    selectedMoles <= 0
  ) {
    throw new Error(
      "Não foi possível converter a quantidade para mol."
    );
  }

  const results = substances.map((item) => {
    const molarMass = getMolarMass(
      item.formula,
      elements
    );

    if (!molarMass) {
      return null;
    }

    const moles =
      selectedMoles *
      (item.coefficient /
        selected.coefficient);

    return {
      formula: item.formula,
      coefficient: item.coefficient,
      side: item.side,

      molarMass,

      moles,

      mass:
        moles * molarMass,

      particles:
        moles * AVOGADRO,

      volume:
        moles * MOLAR_VOLUME_CNTP,
    };
  });

  return {
    input: {
      value: parsedQuantity.quantity,
      unit: parsedQuantity.unit,
      original: quantity,
      substance: selected.formula,
    },

    results: results.filter(Boolean),
  };
}