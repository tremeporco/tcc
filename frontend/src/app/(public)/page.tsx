import TopBar from "@/components/topbar";
import Textbalance from  "@/components/balanceador"

export default function Home() {
  return (
<div className="min-h-screen bg-linear-to-br from-cyan-500 via-blue-700 to-indigo-900 flex flex-col overflow-hidden">
      <main className="flex flex-1 items-center justify-center p-6">
<div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/30">            
          <h1 className="text-2xl text-black font-bold mb-4 text-center">
      Balanceador
          </h1>

          <Textbalance />

        </div>
      </main>

    </div>
  );
}