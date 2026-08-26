export interface Substance {
  coefficient: number;
  formula: string;
  side: "reactant" | "product";
}

export interface CalculationResult {
  formula: string;
  coefficient: number;
  side: "reactant" | "product";
  molarMass: number;
  moles: number;
  mass: number;
  particles: number;
  volume: number;
}

export interface StoichiometryResponse {
  input: {
    value: number;
    unit: "g" | "mol" | "L" | "particles";
    original: string;
    substance: string;
  };

  results: CalculationResult[];
}