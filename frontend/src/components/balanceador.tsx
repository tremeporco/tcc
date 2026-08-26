"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface Compound {
  name: string;
  formula?: string | null;
  iupac?: string | null;
  weight?: string | number | null;
  smiles?: string | null;
  error?: string;
}

interface BalanceResponse {
  result?: string;
  error?: string;
  compounds?: Compound[];
}

export default function Textbalance() {
  const router = useRouter();

  const [equation, setEquation] = useState("");
  const [result, setResult] = useState("");
  const [compounds, setCompounds] = useState<Compound[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleBalance() {
    if (!equation.trim()) {
      return;
    }

    setLoading(true);
    setResult("");
    setCompounds([]);

    try {
      const res = await fetch(
        "http://localhost:5500/api/balance",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            equation: equation.trim(),
          }),
        }
      );

      const data: BalanceResponse = await res.json();

      if (!res.ok) {
        setResult(
          data.error || "Não foi possível balancear a equação."
        );
        return;
      }

      setResult(
        data.result || "Equação balanceada com sucesso."
      );

      setCompounds(data.compounds || []);
    } catch {
      setResult(
        "Erro ao conectar com o servidor."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setEquation("");
    setResult("");
    setCompounds([]);
  }

  function handleStoichiometry() {
    if (!result) {
      return;
    }

    router.push(
      `/estequiometria?equation=${encodeURIComponent(result)}`
    );
  }

  return (
    <div className="space-y-6">

      {/* Entrada da equação */}
      <Card className="border-white/10 bg-white/5 text-white shadow-xl">

        <CardHeader>
          <CardTitle className="text-2xl">
            Balancear equação química
          </CardTitle>

          <CardDescription className="text-slate-400">
            Digite uma equação química para determinar
            automaticamente seus coeficientes estequiométricos.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">

          <Field>

            <FieldLabel className="text-slate-200">
              Equação química
            </FieldLabel>

            <Input
              value={equation}
              onChange={(e) =>
                setEquation(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleBalance();
                }
              }}
              type="text"
              placeholder="Ex.: H2 + O2 = H2O"
              className="
                h-12
                bg-slate-950/80
                border-white/10
                text-white
                text-lg
                placeholder:text-slate-500
                focus-visible:ring-cyan-400
              "
            />

            <FieldDescription className="text-slate-500">
              Use os símbolos químicos corretamente.
              Exemplo: H2 + O2 = H2O
            </FieldDescription>

          </Field>

          <div className="flex gap-3">

            <Button
              onClick={handleBalance}
              disabled={loading || !equation.trim()}
              className="
                flex-1
                h-11
                bg-cyan-500
                text-slate-950
                hover:bg-cyan-400
                font-semibold
              "
            >
              {loading
                ? "Balanceando..."
                : "Balancear equação"}
            </Button>

            {(equation || result || compounds.length > 0) && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClear}
                disabled={loading}
                className="
                  h-11
                  border-white/10
                  bg-white/5
                  text-slate-300
                  hover:bg-white/10
                  hover:text-white
                "
              >
                Limpar
              </Button>
            )}

          </div>

        </CardContent>

      </Card>

      {/* Resultado */}
      {result && (
        <Card className="border-cyan-400/20 bg-cyan-400/5 text-white">

          <CardHeader>
            <CardTitle className="text-lg text-cyan-400">
              Resultado
            </CardTitle>
          </CardHeader>

          <CardContent>

            <div className="
              rounded-lg
              border
              border-cyan-400/20
              bg-slate-950/70
              p-5
              text-center
            ">

              <p className="text-sm text-slate-500 mb-2">
                Equação balanceada
              </p>

              <p className="
                text-xl
                md:text-2xl
                font-semibold
                text-white
                wrap-break-word
              ">
                {result}
              </p>

              {/* Botão para estequiometria */}
              <Button
                onClick={handleStoichiometry}
                className="
                  mt-5
                  bg-cyan-500
                  text-slate-950
                  hover:bg-cyan-400
                  font-semibold
                "
              >
                Calcular estequiometria
              </Button>

            </div>

          </CardContent>

        </Card>
      )}

      {/* Compostos encontrados */}
      {compounds.length > 0 && (
        <Card className="border-white/10 bg-white/5 text-white">

          <CardHeader>
            <CardTitle className="text-xl">
              Substâncias identificadas
            </CardTitle>

            <CardDescription className="text-slate-400">
              Informações obtidas a partir das substâncias
              presentes na equação.
            </CardDescription>
          </CardHeader>

          <CardContent>

            <div className="grid gap-4 sm:grid-cols-2">

              {compounds.map((compound, index) => (

                <div
                  key={`${compound.name}-${index}`}
                  className="
                    rounded-xl
                    border
                    border-white/10
                    bg-slate-950/60
                    p-5
                    transition
                    hover:border-cyan-400/30
                  "
                >

                  <div className="flex items-start justify-between gap-3 mb-4">

                    <div>

                      <h3 className="text-lg font-semibold text-white">
                        {compound.name}
                      </h3>

                      {compound.formula && (
                        <p className="text-cyan-400 font-mono mt-1">
                          {compound.formula}
                        </p>
                      )}

                    </div>

                  </div>

                  {compound.error ? (

                    <p className="text-sm text-red-400">
                      {compound.error}
                    </p>

                  ) : (

                    <div className="space-y-3 text-sm">

                      <Info
                        label="Nome IUPAC"
                        value={compound.iupac}
                      />

                      <Info
                        label="Massa molar"
                        value={
                          compound.weight
                            ? `${compound.weight} g/mol`
                            : null
                        }
                      />

                    </div>

                  )}

                </div>

              ))}

            </div>

          </CardContent>

        </Card>
      )}

    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div>

      <p className="text-slate-500">
        {label}
      </p>

      <p className="text-slate-200 mt-0.5">
        {value || "Não informado"}
      </p>

    </div>
  );
}