"use client";

import Link from "next/link";

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
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>

           

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