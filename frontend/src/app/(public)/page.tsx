"use client";

import Textbalance from "@/components/balanceador";

export default function BalanceadorPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        <div className="mb-10">
          <p className="text-cyan-400 font-medium">
            MolVision • Plataforma de Química
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mt-2">
            Balanceador de Equações Químicas
          </h1>

          <p className="text-slate-400 mt-3 max-w-2xl">
            Balanceie equações químicas automaticamente,
            visualize informações das substâncias envolvidas
            e utilize os resultados como base para cálculos
            estequiométricos e estudos de reações químicas.
          </p>
        </div>

        <Textbalance />

      </div>
    </main>
  );
}