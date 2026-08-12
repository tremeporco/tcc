"use client";

import Textbalance from "@/components/balanceador";

export default function EstequiometriaPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        <div className="mb-10">
          <p className="text-cyan-400 font-medium">
            MolVision • Estequiometria
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mt-2">
            Cálculos estequiométricos
          </h1>

          <p className="text-slate-400 mt-3 max-w-2xl">
            Balanceie uma reação química e utilize seus
            coeficientes para realizar cálculos de massa,
            quantidade de matéria, partículas e volume.
          </p>
        </div>

        <Textbalance />

      </div>
    </main>
  );
}