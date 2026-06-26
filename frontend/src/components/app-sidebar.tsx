"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FlaskConical,
  Settings,
  Search,
  LogOut,
  TestTubeDiagonal,
} from "lucide-react";

import { useRouter } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { authClient } from "@/lib/auth-client";

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Nova Reação",
    url: "/",
    icon: FlaskConical,
  },
  {
    title: "Substâncias",
    url: "/substances",
    icon: TestTubeDiagonal,
  },
];
const navSecondary = [
  {
    title: "Configurações",
    url: "#",
    icon: Settings,
  },
  {
    title: "Pesquisar",
    url: "#",
    icon: Search,
  },
  {
    title: "Sair",
    url: "#",
    icon: LogOut,
  },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<any>(null);

  const router = useRouter();

  async function handleLogout() {
    await authClient.signOut();

    router.replace("/login");
    router.refresh();
  }

  useEffect(() => {
    async function loadUser() {
      try {
        const session = await authClient.getSession();

        if (session?.data?.user) {
          setUser(session.data.user);
        }
      } catch (err) {
        console.log("Erro ao carregar usuário:", err);
      }
    }

    loadUser();
  }, []);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* 🧪 HEADER */}
      <SidebarHeader>
        <div className="flex items-center gap-2 px-3 py-2">
          <FlaskConical className="w-5 h-5 text-primary" />
          <span className="font-bold">MolVision Lab</span>
        </div>
      </SidebarHeader>

      {/* 🧬 NAV */}
      <SidebarContent>
        <NavMain items={navMain} />



        <NavSecondary
          items={navSecondary}
          className="mt-auto"
          onLogout={handleLogout}
        />
      </SidebarContent>

      {/* 👤 USER REAL */}
      <SidebarFooter>
        <NavUser
          user={
            user
              ? {
                  name: user.name,
                  email: user.email,
                  avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`,
                }
              : {
                  name: "Carregando...",
                  email: "",
                  avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=loading",
                }
          }
        />
      </SidebarFooter>
    </Sidebar>
  );
}