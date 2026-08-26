export function formatFormula(
  formula: string
) {
  const subscriptMap: Record<string, string> = {
    "0": "₀",
    "1": "₁",
    "2": "₂",
    "3": "₃",
    "4": "₄",
    "5": "₅",
    "6": "₆",
    "7": "₇",
    "8": "₈",
    "9": "₉",
  };

  return formula.replace(
    /\d/g,
    (number) => subscriptMap[number]
  );
}

export function formatNumber(
  value: number
) {
  if (!Number.isFinite(value)) {
    return "Não calculado";
  }

  if (value === 0) {
    return "0";
  }

  if (
    Math.abs(value) >= 0.0001 &&
    Math.abs(value) < 100000
  ) {
    return value.toLocaleString(
      "pt-BR",
      {
        maximumFractionDigits: 6,
      }
    );
  }

  return value.toExponential(4);
}

export function formatScientific(
  value: number
) {
  if (!Number.isFinite(value)) {
    return "Não calculado";
  }

  return value.toExponential(4);
}