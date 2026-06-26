"use client";

import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

type ReactionHistory = {
  id: string;
  equation: string;
  reagents: string;
  products: string;
  isBalanced: boolean;
};

export default function Dashboard() {
  const [history, setHistory] = useState<ReactionHistory[]>([]);


  
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:5500/api/history", {
          credentials: "include",
        });

        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.log("Erro ao buscar histórico:", err);
      }
    }

    load();
  }, []);

  const total = history.length;
  const balanced = history.filter((h) => h.isBalanced).length;
  const notBalanced = total - balanced;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">

   
      <div className="grid gap-4 md:grid-cols-3">

        <Card>
          <CardHeader>
            <CardTitle>Total de Reações</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {total}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Balanceadas</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-green-500">
            {balanced}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Não Balanceadas</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-red-500">
            {notBalanced}
          </CardContent>
        </Card>

      </div>


      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Histórico de Reações 🧪</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma reação registrada ainda.
            </p>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 space-y-1"
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium">{item.equation}</p>

                  <Badge
                    variant={item.isBalanced ? "default" : "destructive"}
                  >
                    {item.isBalanced ? "Balanceada" : "Não balanceada"}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground">
                  Reagentes: {item.reagents}
                </p>

                <p className="text-sm text-muted-foreground">
                  Produtos: {item.products}
                </p>
              </div>
            ))
          )}

        </CardContent>
      </Card>

    </div>
  );
}