"use client";

import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Search,
  Loader2,
} from "lucide-react";

interface Substance {
  iupac?: string;
  formula?: string;
  weight?: string;
}

export default function SubstancePage() {
  const [search, setSearch] = useState("");
  const [substance, setSubstance] =
    useState<Substance | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [suggestions, setSuggestions] =
    useState<string[]>([]);

  const [showSuggestions, setShowSuggestions] =
    useState(false);

  const [loadingSuggestions, setLoadingSuggestions] =
    useState(false);

  // Busca sugestões automaticamente
  useEffect(() => {
    const query = search.trim();

    // Menos de 3 caracteres não consulta o PubChem
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Pequeno atraso para não fazer uma requisição a cada tecla
    const timer = setTimeout(async () => {
      try {
        setLoadingSuggestions(true);

        const response = await fetch(
          `http://localhost:5500/api/substances/suggestions?q=${encodeURIComponent(
            query
          )}`
        );

        if (!response.ok) {
          throw new Error(
            "Erro ao buscar sugestões"
          );
        }

        const data: string[] =
          await response.json();

        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch (error) {
        console.error(
          "Erro ao buscar sugestões:",
          error
        );

        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  async function handleSearch(value = search) {
    if (!value.trim()) return;

    setLoading(true);
    setError("");
    setSubstance(null);
    setShowSuggestions(false);

    try {
      const response = await fetch(
        `http://localhost:5500/api/substances/${encodeURIComponent(
          value.trim()
        )}`
      );

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();

      setSubstance(data);
    } catch {
      setError("Substância não encontrada.");
    } finally {
      setLoading(false);
    }
  }

  function selectSuggestion(name: string) {
    setSearch(name);
    setShowSuggestions(false);

    handleSearch(name);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* Cabeçalho */}
        <div className="mb-10">

          <div className="flex items-center gap-3 mb-3">



            <p className="text-cyan-400 font-medium">
              MolVision • Substâncias
            </p>

          </div>

          <h1 className="text-4xl md:text-5xl font-bold">
            Pesquisa de substâncias
          </h1>

          <p className="text-slate-400 mt-3 max-w-2xl">
            Consulte informações químicas de até 3 milhões
            de substâncias.
          </p>

        </div>

        {/* Pesquisa */}
        <div className="relative max-w-4x2">

          <div className="flex gap-3">  

            <div className="relative flex-1">

              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={20}
              />

              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(
                    e.target.value.trim().length >= 3
                  );
                }}
                onFocus={() => {
                  if (
                    suggestions.length > 0 &&
                    search.trim().length >= 3
                  ) {
                    setShowSuggestions(true);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }

                  if (e.key === "Escape") {
                    setShowSuggestions(false);
                  }
                }}
                placeholder="Digite o nome ou fórmula..."
                className="
                  h-14
                  pl-12
                  bg-slate-900
                  border-slate-700
                  text-white
                  text-base
                  placeholder:text-slate-500
                  focus-visible:ring-cyan-500
                "
              />

              {/* Sugestões */}
              {showSuggestions &&
                search.trim().length >= 3 && (
                  <div
                    className="
                      absolute
                      z-50
                      top-full
                      left-0
                      right-0
                      mt-2
                      rounded-xl
                      border
                      border-slate-700
                      bg-slate-900
                      shadow-2xl
                      overflow-hidden
                    "
                  >

                    {loadingSuggestions ? (

                      <div className="
                        flex
                        items-center
                        gap-3
                        px-4
                        py-4
                        text-slate-400
                      ">
                        <Loader2
                          className="animate-spin"
                          size={18}
                        />

                        <span>
                          Buscando substâncias...
                        </span>
                      </div>

                    ) : suggestions.length > 0 ? (

                      suggestions.map((name) => (

                        <button
                          key={name}
                          type="button"
                          onMouseDown={() =>
                            selectSuggestion(name)
                          }
                          className="
                            w-full
                            px-4
                            py-3
                            text-left
                            text-slate-200
                            hover:bg-slate-800
                            hover:text-cyan-400
                            transition
                          "
                        >
                          {name}
                        </button>

                      ))

                    ) : (

                      <div className="
                        px-4
                        py-4
                        text-sm
                        text-slate-500
                      ">
                        Nenhuma substância encontrada.
                      </div>

                    )}

                  </div>
                )}

            </div>

            <Button
              onClick={() => handleSearch()}
              disabled={
                loading ||
                !search.trim()
              }
              className="
                h-14
                px-6
                bg-cyan-500
                text-slate-950
                hover:bg-cyan-400
              "
            >

              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Search className="mr-2" />
                  Pesquisar
                </>
              )}

            </Button>

          </div>

        </div>

        {/* Erro */}
        {error && (
          <div className="
            mt-6
            rounded-xl
            border
            border-red-500/20
            bg-red-500/10
            p-4
            text-red-400
          ">
            {error}
          </div>
        )}

        {/* Resultado */}
        {substance && (

          <Card className="
            mt-9
            bg-white/5
            border-white/10
            text-white
            overflow-hidden
          ">

            <CardHeader className="border-b border-white/10">

              <p className="text-sm text-cyan-400">
                Resultado encontrado
              </p>

              <CardTitle className="text-3xl">
                {substance.iupac ?? search}
              </CardTitle>

            </CardHeader>

            <CardContent className="p-4">

              <div className="
                grid
                sm:grid-cols-2
                lg:grid-cols-4
                gap-4
              ">

                <Info
                  label="Fórmula molecular"
                  value={substance.formula}
                />

                <Info
                  label="Massa molar"
                  value={
                    substance.weight
                      ? `${substance.weight} g/mol`
                      : undefined
                  }
                />

                <Info
                  label="Nome IUPAC"
                  value={substance.iupac}
                />

              </div>

            </CardContent>

          </Card>

        )}

      </div>
    </main>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div className="
      rounded-xl
      border
      border-white/10
      bg-slate-900/60
      p-5
    ">

      <p className="text-sm text-slate-400">
        {label}
      </p>

      <p className="
        text-lg
        font-semibold
        text-cyan-400
        mt-2
        break-all
      ">
        {value ?? "Não informado"}
      </p>

    </div>
  );
}