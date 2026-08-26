"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  formatFormula,
  formatNumber,
  formatScientific,
} from "@/utils/chemistry";

import type {
  CalculationResult,
  Substance,
  StoichiometryResponse,
} from "@/types/chemistry";

const API_URL = "http://localhost:5500";

export default function EstequiometriaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const equationFromUrl =
    searchParams.get("equation");

  const manualMode =
    searchParams.get("manual") === "true";

  const [manualEquation, setManualEquation] =
    useState("");

  const [substance, setSubstance] =
    useState("");

  const [quantity, setQuantity] =
    useState("");

  const [results, setResults] =
    useState<CalculationResult[]>([]);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const equation =
    equationFromUrl ?? "";

  const substances =
    useMemo<Substance[]>(() => {
      if (!equation) {
        return [];
      }

      const normalized = equation
        .replace(/→/g, "=")
        .replace(/->/g, "=");

      const sides =
        normalized.split("=");

      if (sides.length !== 2) {
        return [];
      }

      const result: Substance[] = [];

      function parseSide(
        compounds: string[],
        side:
          | "reactant"
          | "product"
      ) {
        for (const compound of compounds) {
          const clean =
            compound.trim();

          if (!clean) {
            continue;
          }

          const match =
            clean.match(
              /^(\d+)?\s*([A-Za-z][A-Za-z0-9()]*)$/
            );

          if (!match) {
            continue;
          }

          result.push({
            coefficient:
              match[1]
                ? Number(match[1])
                : 1,

            formula: match[2],

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

      return result;
    }, [equation]);

  function handleManualEquationSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const value =
      manualEquation.trim();

    if (!value) {
      return;
    }

    setError("");

    router.push(
      `/estequiometria?equation=${encodeURIComponent(
        value
      )}`
    );
  }

  function handleChangeReaction() {
    setManualEquation("");
    setSubstance("");
    setQuantity("");
    setResults([]);
    setError("");

    router.push(
      "/estequiometria"
    );
  }

  function handleOpenManualMode() {
    setManualEquation("");

    router.push(
      "/estequiometria?manual=true"
    );
  }

  async function handleCalculate() {
    setError("");
    setResults([]);

    if (!substance) {
      setError(
        "Selecione uma substância da reação."
      );
      return;
    }

    if (!quantity.trim()) {
      setError(
        "Informe a quantidade com a unidade. Ex.: 10 g"
      );
      return;
    }

    const selected =
      substances.find(
        (item, index) =>
          `${item.formula}-${index}` ===
          substance
      );

    if (!selected) {
      setError(
        "Substância não encontrada na reação."
      );
      return;
    }

    setLoading(true);

    try {
      const response =
        await fetch(
          `${API_URL}/api/stoichiometry/calculate`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              equation,

              substance:
                selected.formula,

              quantity:
                quantity.trim(),
            }),
          }
        );

      const data =
        (await response.json()) as
          | StoichiometryResponse
          | { error?: string };

      if (!response.ok) {
        throw new Error(
          "error" in data
            ? data.error ||
                "Erro ao realizar cálculo."
            : "Erro ao realizar cálculo."
        );
      }

      if (!("results" in data)) {
        throw new Error("Resposta inválida do servidor.");
      }

      setResults(
        data.results
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Erro ao realizar cálculo."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* CABEÇALHO */}

        <div className="mb-10">
          <p className="text-cyan-400 font-medium">
            MolVision • Cálculos estequiométricos
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mt-2">
            Estequiometria
          </h1>

          <p className="text-slate-400 mt-3 max-w-2xl">
            Informe uma quantidade conhecida
            e obtenha automaticamente massa,
            mols, partículas e volume.
          </p>
        </div>

        {/* ESCOLHA DA REAÇÃO */}

        {!equation &&
          !manualMode && (
            <Card className="bg-white/10 border-white/10 text-white">
              <CardHeader>
                <CardTitle>
                  Escolha uma reação
                </CardTitle>

                <CardDescription className="text-slate-400">
                  Utilize uma reação do
                  balanceador ou informe
                  uma reação própria.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">

                  <Button
                    type="button"
                    onClick={() =>
                      router.push("/")
                    }
                    className="
                      h-auto
                      min-h-36
                      flex-col
                      items-start
                      justify-center
                      gap-2
                      p-6
                      bg-cyan-500
                      text-slate-950
                      hover:bg-cyan-400
                    "
                  >
                    <span className="text-lg font-bold">
                      Usar o balanceador
                    </span>

                    <span className="text-sm text-slate-800 text-left">
                      Balanceie uma reação
                      e utilize o resultado
                      nos cálculos.
                    </span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={
                      handleOpenManualMode
                    }
                    className="
                      h-auto
                      min-h-36
                      flex-col
                      items-start
                      justify-center
                      gap-2
                      p-6
                      border-white/20
                      bg-white/5
                      text-white
                      hover:bg-white/10
                    "
                  >
                    <span className="text-lg font-bold">
                      Inserir minha reação
                    </span>

                    <span className="text-sm text-slate-400 text-left">
                      Informe uma reação
                      que já esteja
                      balanceada.
                    </span>
                  </Button>

                </div>
              </CardContent>
            </Card>
          )}

        {/* REAÇÃO MANUAL */}

        {!equation &&
          manualMode && (
            <Card className="bg-white/10 border-white/10 text-white">
              <CardHeader>
                <CardTitle>
                  Inserir reação balanceada
                </CardTitle>

                <CardDescription className="text-slate-400">
                  Digite uma reação que
                  já esteja balanceada.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form
                  onSubmit={
                    handleManualEquationSubmit
                  }
                  className="space-y-5"
                >
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">
                      Equação química
                    </label>

                    <Input
                      value={
                        manualEquation
                      }
                      onChange={(event) =>
                        setManualEquation(
                          event.target.value
                        )
                      }
                      placeholder="Ex.: 2 H2 + O2 = 2 H2O"
                      className="
                        h-12
                        bg-white/10
                        border-white/10
                        text-white
                        placeholder:text-slate-500
                      "
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={
                        !manualEquation.trim()
                      }
                      className="
                        bg-cyan-500
                        text-slate-950
                        hover:bg-cyan-400
                      "
                    >
                      Usar esta reação
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        router.push(
                          "/estequiometria"
                        )
                      }
                      className="
                        border-white/20
                        bg-white/5
                        text-white
                      "
                    >
                      Voltar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

        {/* REAÇÃO */}

        {equation && (
          <Card className="bg-white/10 border-white/10 text-white mb-6">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>
                  <CardTitle>
                    Equação química
                  </CardTitle>

                  <CardDescription className="text-slate-400">
                    Reação utilizada no cálculo.
                  </CardDescription>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={
                    handleChangeReaction
                  }
                  className="
                    border-white/20
                    bg-white/5
                    text-white
                  "
                >
                  Trocar reação
                </Button>

              </div>
            </CardHeader>

            <CardContent>
              <div className="rounded-xl bg-black/20 border border-white/10 p-6 text-center">
                <p className="text-2xl md:text-3xl font-semibold text-cyan-400 wrap-break-word">
                  {equation}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* CALCULADORA */}

        {equation && (
          <Card className="bg-white/10 border-white/10 text-white mb-6">
            <CardHeader>
              <CardTitle>
                Dados conhecidos
              </CardTitle>

              <CardDescription className="text-slate-400">
                Informe a substância e a
                quantidade com sua unidade.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">

              {/* SUBSTÂNCIA */}

              <div>
                <label className="text-sm text-slate-400 mb-2 block">
                  Substância
                </label>

                <Select
                  value={substance}
                  onValueChange={
                    setSubstance
                  }
                >
                  <SelectTrigger className="bg-white/10 border-white/10 text-white">
                    <SelectValue placeholder="Selecione uma substância" />
                  </SelectTrigger>

                  <SelectContent>
                    {substances.map(
                      (item, index) => (
                        <SelectItem
                          key={`${item.formula}-${index}`}
                          value={`${item.formula}-${index}`}
                        >
                          {item.coefficient}{" "}
                          {formatFormula(
                            item.formula
                          )}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* QUANTIDADE */}

              <div>
                <label className="text-sm text-slate-400 mb-2 block">
                  Quantidade conhecida
                </label>

                <Input
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(
                      event.target.value
                    )
                  }
                  placeholder="Ex.: 10 g, 2 mol, 5 L ou 6,02e23 partículas"
                  className="
                    h-12
                    bg-white/10
                    border-white/10
                    text-white
                    placeholder:text-slate-500
                  "
                />
              </div>

              {/* ERRO */}

              {error && (
                <div className="
                  rounded-lg
                  border
                  border-red-500/30
                  bg-red-500/10
                  p-4
                  text-sm
                  text-red-300
                ">
                  {error}
                </div>
              )}

              {/* CALCULAR */}

              <Button
                type="button"
                onClick={
                  handleCalculate
                }
                disabled={
                  loading ||
                  !substance ||
                  !quantity.trim()
                }
                className="
                  w-full
                  bg-cyan-500
                  text-slate-950
                  hover:bg-cyan-400
                  font-semibold
                "
              >
                {loading
                  ? "Calculando..."
                  : "Calcular"}
              </Button>

            </CardContent>
          </Card>
        )}

        {/* RESULTADOS */}

        {results.length > 0 && (
          <Card className="bg-white/10 border-white/10 text-white">
            <CardHeader>
              <CardTitle>
                Resultados
              </CardTitle>

              <CardDescription className="text-slate-400">
                Todas as grandezas calculadas
                para cada substância da reação.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">

                {results.map(
                  (result, index) => (
                    <div
                      key={`${result.formula}-${index}`}
                      className="
                        rounded-xl
                        border
                        border-white/10
                        bg-black/20
                        p-5
                      "
                    >

                      <div className="mb-5">
                        <p className="text-2xl font-bold text-cyan-400">
                          {result.coefficient}{" "}
                          {formatFormula(
                            result.formula
                          )}
                        </p>

                        <p className="text-sm text-slate-400">
                          {result.side ===
                          "reactant"
                            ? "Reagente"
                            : "Produto"}
                        </p>
                      </div>

                      <div className="
                        grid
                        sm:grid-cols-2
                        lg:grid-cols-4
                        gap-4
                      ">

                        <ResultCard
                          title="Quantidade de matéria"
                          value={`${formatNumber(
                            result.moles
                          )} mol`}
                        />

                        <ResultCard
                          title="Massa"
                          value={`${formatNumber(
                            result.mass
                          )} g`}
                        />

                        <ResultCard
                          title="Partículas"
                          value={formatScientific(
                            result.particles
                          )}
                        />

                        <ResultCard
                          title="Volume na CNTP"
                          value={`${formatNumber(
                            result.volume
                          )} L`}
                        />

                      </div>

                    </div>
                  )
                )}

              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </main>
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
    <div className="
      rounded-xl
      border
      border-white/10
      bg-white/5
      p-4
    ">
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <p className="
        text-lg
        font-bold
        text-white
        mt-2
        break-all
      ">
        {value}
      </p>
    </div>
  );
}