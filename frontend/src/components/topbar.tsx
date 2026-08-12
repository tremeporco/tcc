"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const TopBar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const { data } = await authClient.getSession();

      setLoggedIn(!!data?.session);
      setLoading(false);
    }

    checkSession();
  }, []);

  return (
<header
  className="sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-md"
  style={{
    backgroundColor: "var(--mol-topbar)",
  }}
>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

      
          <Link href="/" className="flex items-center gap-3">

            <div className="relative flex h-10 w-10 items-center justify-center">

              
              <div className="absolute h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_#67e8f9]" />

              <div
                className="absolute h-8 w-8 atom-orbit rounded-full border border-cyan-400/50"
                style={{ animationDuration: "4s" }}
              >
                <div className="absolute top-1/2 -right-1 h-2 w-2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_8px_#67e8f9]" />
              </div>

              <div
                className="absolute h-8 w-8 atom-orbit rounded-full border border-cyan-400/40"
                style={{
                  transform: "rotateX(75deg)",
                  animationDuration: "5s",
                }}
              >
                <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan-200 shadow-[0_0_8px_#67e8f9]" />
              </div>

  
              <div
                className="absolute h-8 w-8 atom-orbit rounded-full border border-cyan-400/30"
                style={{
                  transform: "rotate(60deg)",
                  animationDuration: "6s",
                }}
              >
                <div className="absolute bottom-0 left-0 h-2 w-2 rounded-full bg-white shadow-[0_0_8px_#67e8f9]" />
              </div>

            </div>

          </Link>

  
          <nav className="hidden md:flex space-x-10">

            <Link
              href="/"
              className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition"
            >
              Home
            </Link>

            <Link
              href="/tabela"
              className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition"
            >
              Tabela Periódica
            </Link>

          </nav>
          <div className="flex gap-4 items-center">

            {!loading && !loggedIn && (
              <>
                <Link
                  href="/register"
                  className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition"
                >
                  Cadastrar-se
                </Link>

                <Link
                  href="/login"
                  className="rounded-full bg-cyan-500 px-5 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400 transition"
                >
                  Login
                </Link>
              </>
            )}

            {!loading && loggedIn && (
              <Link
                href="/dashboard"
                className="rounded-full bg-cyan-500 px-5 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400 transition"
              >
                Dashboard
              </Link>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

export default TopBar;