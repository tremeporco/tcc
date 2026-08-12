"use client";

import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function DashboardBreadcrumb() {
  const pathname = usePathname();

  const pages: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/dashboard/historico": "Histórico",
    "/dashboard/config": "Configurações",
  };

  const currentPage = pages[pathname] ?? "Dashboard";

  return (
    <Breadcrumb>
      <BreadcrumbList>

        {pathname === "/dashboard" ? (
          <BreadcrumbItem>
            <BreadcrumbPage>
              Dashboard
            </BreadcrumbPage>
          </BreadcrumbItem>
        ) : (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>
                {currentPage}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}

      </BreadcrumbList>
    </Breadcrumb>
  );
}