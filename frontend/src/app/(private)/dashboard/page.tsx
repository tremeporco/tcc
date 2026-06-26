"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Substance = {
  id: string;
  name: string;
  formula: string;
};

export default function Dashboard() {
  const [substances, setSubstances] = useState<Substance[]>([]);
  const [search, setSearch] = useState("");

  async function load() {
    const res = await fetch("http://localhost:5500/api/substances", {
      credentials: "include",
    });

    const data = await res.json();
    setSubstances(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    await fetch(`http://localhost:5500/api/substances/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    load();
  }

  const filtered = substances.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.formula.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">

   
      <Card>
        <CardHeader>
          <CardTitle>Total de Substâncias</CardTitle>
        </CardHeader>

        <CardContent className="text-2xl font-bold">
          {substances.length}
        </CardContent>
      </Card>

    <Input
        placeholder="Pesquisar substância ou fórmula..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />


      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Substâncias 🧪</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma substância encontrada.
            </p>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border rounded-lg p-4"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.formula}
                  </p>
                </div>

                <div className="flex gap-2">

                  <Link href={`/substances?id=${item.id}`}>
                    <Button variant="outline">
                      Editar
                    </Button>
                  </Link>

                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    Excluir
                  </Button>

                </div>
              </div>
            ))
          )}

        </CardContent>
      </Card>

    </div>
  );
}