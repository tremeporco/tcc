"use client";

import Link from "next/link";
import { CirclePlus, Mail } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type NavItem = {
  title: string;
  url: string;
  icon?: React.ElementType;
};

export function NavMain({ items }: { items: NavItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">

        {/* QUICK ACTION */}
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">

            <SidebarMenuButton
              tooltip="Quick Create"
              className="min-w-8 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <CirclePlus />
              <span>Quick Create</span>
            </SidebarMenuButton>

            <SidebarMenuButton asChild>
              <Link href="/dashboard">
                <Mail />
                <span className="sr-only">Inbox</span>
              </Link>
            </SidebarMenuButton>

          </SidebarMenuItem>
        </SidebarMenu>

        {/* NAVIGATION ITEMS */}
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>

              <SidebarMenuButton asChild tooltip={item.title}>
                <Link
                  href={item.url}
                  className="flex items-center gap-2 w-full"
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>

            </SidebarMenuItem>
          ))}
        </SidebarMenu>

      </SidebarGroupContent>
    </SidebarGroup>
  );
}