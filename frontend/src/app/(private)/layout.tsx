import { Geist, Geist_Mono, Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ui/theme";
import { TooltipProvider } from "@/components/ui/tooltip";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { DashboardBreadcrumb } from "@/components/ui/dashboard-breadcrumb";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MolVision",
  description: "Plataforma educacional de Química",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-br"
      className={cn("font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <TooltipProvider>
            <SidebarProvider>

              <AppSidebar />

              <SidebarInset>

                <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                  <div className="flex items-center gap-2 px-4">

                    <SidebarTrigger />

                    <Separator
                      orientation="vertical"
                      className="mr-2 h-4"
                    />

                    <DashboardBreadcrumb />

                  </div>
                </header>

                {children}

              </SidebarInset>

            </SidebarProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}