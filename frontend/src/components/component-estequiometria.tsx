"use client";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type InputUnit = "g" | "mol" | "particles" | "L";

interface Compound {
  name: string;
  formula: string;
  weight?: number;
  coefficient?: number;
  side?: "reactant" | "product";
}

interface StoichiometryProps {
  balancedEquation: string;
  compounds?: Compound[];
}

interface Result {
  mol: number;
  mass: number;
  particles: number;
  volumeCNTP: number;
}

const AVOGADRO = 6.02214076e23;
const MOLAR_VOLUME_CNTP = 22.4;

export default function Estequiometria({
  balancedEquation,
  compounds = [],
}: StoichiometryProps) {
  const [knownSubstance, setKnownSubstance] = useState("");
  const [targetSubstance, setTargetSubstance] = useState("");

  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState<InputUnit>("g");

  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  function findCompound(formula: string) {
    return compounds.find(
      (compound) =>
        compound.formula.toLowerCase() === formula.toLowerCase()
    );
  }

  function convertToMol(
    value: number,
    unit: InputUnit,
    molarMass?: number
  ) {
    switch (unit) {
      case "mol":
        return value;

      case "particles":
        return value / AVOGADRO;

      case "L":
        return value / MOLAR_VOLUME_CNTP;

      case "g":
        if (!molarMass || molarMass <= 0) {
          throw new Error(
            "A massa molar da substância não foi encontrada."
          );
        }

        return value / molarMass;
    }
  }

  function calculate() {
    setError("");
    setResult(null);

    if (!balancedEquation) {
      setError("Primeiro balanceie a equação química.");
      return;
    }

    if (!knownSubstance.trim()) {
      setError("Informe a substância conhecida.");
      return;
    }

    if (!targetSubstance.trim()) {
      setError("Informe a substância desejada.");
      return;
    }

    const numericAmount = Number(amount);

    if (
      !amount ||
      Number.isNaN(numericAmount) ||
      numericAmount <= 0
    ) {
      setError("Informe uma quantidade válida.");
      return;
    }

    const known = findCompound(knownSubstance);
    const target = findCompound(targetSubstance);

    if (!known) {
      setError(
        `A substância ${knownSubstance} não foi encontrada na reação.`
      );
      return;
    }

    if (!target) {
      setError(
        `A substância ${targetSubstance} não foi encontrada na reação.`
      );
      return;
    }

    if (!known.coefficient || !target.coefficient) {
      setError(
        "Não foi possível identificar os coeficientes da reação."
      );
      return;
    }

    try {
      /*
       * 1. Converte a quantidade informada para mol.
       */
      const knownMol = convertToMol(
        numericAmount,
        unit,
        known.weight
      );

      /*
       * 2. Aplica a proporção estequiométrica.
       *
       * coeficiente conhecido : coeficiente desejado
       *
       * knownMol / coefKnown =
       * targetMol / coefTarget
       *
       * Portanto:
       *
       * targetMol =
       * knownMol × coefTarget / coefKnown
       */
      const targetMol =
        (knownMol * target.coefficient) /
        known.coefficient;

      /*
       * 3. Converte os mols encontrados
       * para as demais grandezas.
       */
      const targetMass =
        target.weight !== undefined
          ? targetMol * target.weight
          : 0;

      const targetParticles =
        targetMol * AVOGADRO;

      const targetVolumeCNTP =
        targetMol * MOLAR_VOLUME_CNTP;

      setResult({
        mol: targetMol,
        mass: targetMass,
        particles: targetParticles,
        volumeCNTP: targetVolumeCNTP,
      });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erro ao realizar o cálculo.");
      }
    }
  }

  return (
    <Card className="bg-white/10 border-white/10 text-white">
      <CardHeader>
        <CardTitle>Estequiometria</CardTitle>

        <p className="text-sm text-slate-400">
          Utilize os coeficientes da equação balanceada para
          determinar a quantidade da substância desejada.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">

        {balancedEquation && (
          <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/5 p-4">
            <p className="text-sm text-slate-400">
              Equação balanceada
            </p>

            <p className="mt-1 text-lg font-semibold text-cyan-400">
              {balancedEquation}
            </p>
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">

          <div>
            <label className="text-sm text-slate-400">
              Substância conhecida
            </label>

            <select
              value={knownSubstance}
              onChange={(event) =>
                setKnownSubstance(event.target.value)
              }
              className="
                mt-2
                w-full
                rounded-md
                border
                border-white/10
                bg-slate-900
                px-4
                py-3
                text-white
                outline-none
                focus:ring-2
                focus:ring-cyan-400
              "
            >
              <option value="">
                Selecione uma substância
              </option>

              {compounds.map((compound) => (
                <option
                  key={`known-${compound.formula}`}
                  value={compound.formula}
                >
                  {compound.formula}
                  {compound.name
                    ? ` • ${compound.name}`
                    : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-400">
              Substância desejada
            </label>

            <select
              value={targetSubstance}
              onChange={(event) =>
                setTargetSubstance(event.target.value)
              }
              className="
                mt-2
                w-full
                rounded-md
                border
                border-white/10
                bg-slate-900
                px-4
                py-3
                text-white
                outline-none
                focus:ring-2
                focus:ring-cyan-400
              "
            >
              <option value="">
                Selecione uma substância
              </option>

              {compounds.map((compound) => (
                <option
                  key={`target-${compound.formula}`}
                  value={compound.formula}
                >
                  {compound.formula}
                  {compound.name
                    ? ` • ${compound.name}`
                    : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-400">
              Quantidade disponível
            </label>

            <input
              type="number"
              min="0"
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
              placeholder="Ex.: 10"
              className="
                mt-2
                w-full
                rounded-md
                border
                border-white/10
                bg-slate-900
                px-4
                py-3
                text-white
                outline-none
                focus:ring-2
                focus:ring-cyan-400
              "
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">
              Unidade
            </label>

            <select
              value={unit}
              onChange={(event) =>
                setUnit(event.target.value as InputUnit)
              }
              className="
                mt-2
                w-full
                rounded-md
                border
                border-white/10
                bg-slate-900
                px-4
                py-3
                text-white
                outline-none
                focus:ring-2
                focus:ring-cyan-400
              "
            >
              <option value="g">
                Gramas (g)
              </option>

              <option value="mol">
                Mol (mol)
              </option>

              <option value="particles">
                Partículas
              </option>

              <option value="L">
                Litros (L)
              </option>
            </select>
          </div>

        </div>

        {error && (
          <div className="rounded-lg border border-red-400/20 bg-red-400/10 p-4">
            <p className="text-sm text-red-300">
              {error}
            </p>
          </div>
        )}

        <button
          onClick={calculate}
          className="
            w-full
            rounded-md
            bg-cyan-500
            px-6
            py-3
            font-semibold
            text-slate-950
            transition
            hover:bg-cyan-400
          "
        >
          Calcular estequiometria
        </button>

        {result && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <ResultCard
              title="Quantidade de matéria"
              value={`${result.mol.toExponential(4)} mol`}
            />

            <ResultCard
              title="Massa"
              value={`${result.mass.toExponential(4)} g`}
            />

            <ResultCard
              title="Partículas"
              value={result.particles.toExponential(4)}
            />

            <ResultCard
              title="Volume na CNTP"
              value={`${result.volumeCNTP.toFixed(2)} L`}
            />

          </div>
        )}

      </CardContent>
    </Card>
  );
}

function ResultCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-900/70 p-5">
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <p className="mt-2 wrap-break-word text-xl font-bold text-cyan-400">
        {value}
      </p>
    </div>
  );
}