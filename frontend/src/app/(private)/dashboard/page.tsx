"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Reaction = {
  id: string;
  equation: string;
  reagents: string;
  products: string;
  reaction_type?: string;
  createdAt: string;
};

export default function Dashboard() {
  const [history, setHistory] = useState<Reaction[]>([]);
  const [search, setSearch] = useState("");

  async function load() {
    const res = await fetch("http://localhost:5500/api/history", {
      credentials: "include",
    });

    const data = await res.json();
    setHistory(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    await fetch(`http://localhost:5500/api/history/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    load();
  }

  const filtered = history.filter((item) =>
    item.equation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Reações</CardTitle>
        </CardHeader>

        <CardContent className="text-2xl font-bold">
          {history.length} reações
        </CardContent>
      </Card>

        <Input
          placeholder="Pesquisar reação..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />

      <div className="grid grid-cols-1 gap-4">

        {filtered.map((reaction) => (
          <Card key={reaction.id}>

            <CardHeader>
              <CardTitle>{reaction.equation}</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">

              <div>
                <p>
                  <strong>Reagentes:</strong> {reaction.reagents}
                </p>

                <p>
                  <strong>Produtos:</strong> {reaction.products}
                </p>

                {reaction.reaction_type && (
                  <p>
                    <strong>Tipo:</strong> {reaction.reaction_type}
                  </p>
                )}

                <p className="text-sm text-muted-foreground">
                  {new Date(reaction.createdAt).toLocaleString()}
                </p>
              </div>

              <Button
                variant="destructive"
                onClick={() => handleDelete(reaction.id)}
              >
                Deletar
              </Button>

            </CardContent>

          </Card>
        ))}

      </div>
    </div>
  );
}