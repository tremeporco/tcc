const ATOMIC_MASSES: Record<string, number> = {
  H: 1.008,
  C: 12.011,
  N: 14.007,
  O: 15.999,
  F: 18.998,
  Na: 22.99,
  Mg: 24.305,
  Al: 26.982,
  Si: 28.085,
  P: 30.974,
  S: 32.06,
  Cl: 35.45,
  K: 39.098,
  Ca: 40.078,
  Fe: 55.845,
  Cu: 63.546,
  Zn: 65.38,
  Ag: 107.868,
  I: 126.904,
  Ba: 137.327,
};

function getMolarMass(formula: string): number {
  const tokens = formula.match(/[A-Z][a-z]?|\d+(?:\.\d+)?/g);

  if (!tokens || tokens.join("") !== formula) {
    return NaN;
  }

  let mass = 0;
  let element: string | undefined;

  for (const token of tokens) {
    if (/^[A-Z][a-z]?$/.test(token)) {
      element = token;
      if (!(element in ATOMIC_MASSES)) {
        return NaN;
      }
      mass += ATOMIC_MASSES[element];
    } else if (element) {
      mass += ATOMIC_MASSES[element] * (Number(token) - 1);
      element = undefined;
    } else {
      return NaN;
    }
  }

  return mass;
}

type InputUnit = "mol" | "g" | "particles" | "L";

interface Substance {
  formula: string;
  coefficient: number;
}

interface CalculationResult {
  formula: string;
  coefficient: number;
  moles: number;
  mass: number;
  particles: number;
  volume: number;
}

export const AVOGADRO = 6.02214076e23;

export const MOLAR_VOLUME_CNTP = 22.4;

export function convertToMoles(
  quantity: number,
  unit: InputUnit,
  molarMass: number
) {
  switch (unit) {
    case "mol":
      return quantity;

    case "g":
      return quantity / molarMass;

    case "particles":
      return quantity / AVOGADRO;

    case "L":
      return quantity / MOLAR_VOLUME_CNTP;

    default:
      return NaN;
  }
}

export function calculateStoichiometry(
  substances: Substance[],
  selectedFormula: string,
  quantity: number,
  unit: InputUnit
): CalculationResult[] {
  const selected = substances.find(
    (item) => item.formula === selectedFormula
  );

  if (!selected) {
    throw new Error(
      "Substância não encontrada na reação."
    );
  }

  const selectedMolarMass =
    getMolarMass(selected.formula);

  if (!selectedMolarMass) {
    throw new Error(
      `Não foi possível calcular a massa molar de ${selected.formula}.`
    );
  }

  const selectedMoles = convertToMoles(
    quantity,
    unit,
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

  return substances
    .map((item) => {
      const molarMass =
        getMolarMass(item.formula);

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
        moles,
        mass: moles * molarMass,
        particles: moles * AVOGADRO,
        volume: moles * MOLAR_VOLUME_CNTP,
      };
    })
    .filter(
      (item): item is CalculationResult =>
        item !== null
    );
}