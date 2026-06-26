// frontend\src\proxy.js
import { NextResponse } from "next/server";

// Lista de rotas que precisam de login
const rotasPrivadas = ["/dashboard", "/links"];

// Lista de rotas que NÃO devem ser acessadas se já estiver logado
const rotasDeAuth = ["/login", "/register"];

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Verifica a sessão perguntando ao backend
  const sessionResponse = await fetch(
    "http://localhost:5500/api/auth/get-session",
    {
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
    },
  );

  const session = await sessionResponse.json();
  const estaLogado = !!session?.user;

  // Se não está logado e tenta acessar rota privada → manda pro login
  if (!estaLogado && rotasPrivadas.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Se já está logado e tenta acessar login/register → manda pro dashboard
  if (estaLogado && rotasDeAuth.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Define em quais rotas o middleware roda
export const config = {
  matcher: ["/dashboard/:path*", "/relatorio/:path*", "/login", "/register"],
};