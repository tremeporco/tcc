import { ChemicalEquationBalancer } from "creb-js";

const balancer = new ChemicalEquationBalancer();

export function balanceEquation(equation) {
  return balancer.balance(equation);
} 