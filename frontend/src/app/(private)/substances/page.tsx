"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SubstancesPage() {
  const [name, setName] = useState("");
  const [formula, setFormula] = useState("");

  const params = useSearchParams();
  const router = useRouter();

  const editId = params.get("id");

  useEffect(() => {
    async function loadOne() {
      if (!editId) return;

      const res = await fetch("http://localhost:5500/api/substances", {
        credentials: "include",
      });

      const data = await res.json();
      const item = data.find((s: any) => s.id === editId);

      if (item) {
        setName(item.name);
        setFormula(item.formula);
      }
    }

    loadOne();
  }, [editId]);

  async function handleSave() {
    if (!name || !formula) return;

    if (editId) {
      await fetch(`http://localhost:5500/api/substances/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, formula }),
      });
    } else {
      await fetch("http://localhost:5500/api/substances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, formula }),
      });
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen w-full px-4 py-10 sm:px-8 lg:px-16">

      <Card className="mx-auto w-full max-w-4xl shadow-lg">

        <CardHeader className="pb-2">
          <CardTitle className="text-2xl sm:text-3xl">
            {editId ? "Editar Substância ✏️" : "Cadastrar Substância 🧪"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">

         
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

            <div className="space-y-2">
              <Label className="text-sm">Nome da substância</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Água"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Fórmula química</Label>
              <Input
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
                placeholder="Ex: H2O"
                className="h-11"
              />
            </div>

          </div>

          <Button
            onClick={handleSave}
            className="w-full h-11 text-base font-medium"
          >
            {editId ? "Salvar alterações" : "Cadastrar substância"}
          </Button>

        </CardContent>
      </Card>

    </div>
  );
}