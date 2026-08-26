"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { House } from "lucide-react";

const TopBar = () => {
  const { data: session } = authClient.useSession();

  return (
    <header className="w-full h-16 px-6 flex items-center justify-between">

      {/* Logo */}
      <div className="flex items-center gap-3">

        {/* Logo do átomo */}
        <div className="relative w-10 h-10 flex items-center justify-center">

          {/* Núcleo */}
          <div className="
            absolute
            h-2.5
            w-2.5
            rounded-full
            bg-cyan-300
            shadow-[0_0_12px_#67e8f9]
          " />

          {/* Órbita horizontal */}
          <div
            className="
              absolute
              h-8
              w-8
              atom-orbit
              rounded-full
              border
              border-cyan-400/50
            "
            style={{ animationDuration: "4s" }}
          >
            <div className="
              absolute
              top-1/2
              -right-1
              h-2
              w-2
              -translate-y-1/2
              rounded-full
              bg-cyan-300
              shadow-[0_0_8px_#67e8f9]
            " />
          </div>

          {/* Órbita vertical */}
          <div
            className="
              absolute
              h-8
              w-8
              atom-orbit
              rounded-full
              border
              border-cyan-400/40
            "
            style={{
              transform: "rotateX(75deg)",
              animationDuration: "5s",
            }}
          >
            <div className="
              absolute
              -top-1
              left-1/2
              h-2
              w-2
              -translate-x-1/2
              rounded-full
              bg-cyan-200
              shadow-[0_0_8px_#67e8f9]
            " />
          </div>

          {/* Órbita diagonal */}
          <div
            className="
              absolute
              h-8
              w-8
              atom-orbit
              rounded-full
              border
              border-cyan-400/30
            "
            style={{
              transform: "rotate(60deg)",
              animationDuration: "6s",
            }}
          >
            <div className="
              absolute
              bottom-0
              left-0
              h-2
              w-2
              rounded-full
              bg-white
              shadow-[0_0_8px_#67e8f9]
            " />
          </div>

        </div>

        {/* Nome */}
        <span className="text-xl font-bold text-white">
          MolVision
        </span>

      </div>


      {/* Navegação */}
      <nav className="flex items-center gap-6">

        {/* Início */}
        <Link
          href="/"
          className="
            text-slate-300
            hover:text-cyan-400
            transition
          "
          title="Início"
        >
          <House className="h-5 w-5" />
        </Link>


        {/* Tabela Periódica */}
        <Link
          href="/tabela"
          className="
            text-sm
            font-medium
            text-slate-300
            hover:text-cyan-400
            transition
          "
        >
          Tabela Periódica
        </Link>

 {/* Estequiometria */}
        <Link
          href="/substancias"
          className="
            text-sm
            font-medium
            text-slate-300
            hover:text-cyan-400
            transition
          "
        >
          Substâncias
        </Link>
        <Link
          href="/estequiometria"
          className="
            text-sm
            font-medium
            text-slate-300
            hover:text-cyan-400
            transition
          "
        >
          Estequiometria
        </Link>


        {/* Login / Dashboard */}
        {session ? (

          <Link
            href="/dashboard"
            className="
              rounded-full
              bg-cyan-500
              px-5
              py-2
              text-sm
              font-medium
              text-slate-950
              hover:bg-cyan-400
              transition
            "
          >
            Dashboard
          </Link>

        ) : (

          <Link
            href="/login"
            className="
              rounded-full
              bg-cyan-500
              px-5
              py-2
              text-sm
              font-medium
              text-slate-950
              hover:bg-cyan-400
              transition
            "
          >
            Login
          </Link>

        )}

      </nav>

    </header>
  );
};

export default TopBar;