"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package, Settings, Users, ArrowRightLeft, Sparkles } from "lucide-react";
import { ThemeSwitcher } from "./theme-switcher";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Assets",
    href: "/assets",
    icon: Package,
  },
  {
    title: "Operations",
    href: "/operations",
    icon: ArrowRightLeft,
  },
  {
    title: "Employees",
    href: "/employees",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/settings/asset-types",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card text-card-foreground shadow-sm">
      {/* Header with gradient */}
      <div className="flex h-16 items-center justify-between border-b px-6 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight gradient-text">Asset Manager</h1>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {sidebarItems.map((item, index) => (
          <div
            key={item.href}
            className="fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <SidebarItem item={item} pathname={pathname} />
          </div>
        ))}
      </nav>
      
      {/* User section with theme switcher */}
      <div className="p-4 border-t bg-muted/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            <div className="text-sm">
              <p className="font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@example.com</p>
            </div>
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ item, pathname }: { item: any; pathname: string }) {
  const Icon = item.icon;
  const isActive = pathname.startsWith(item.href);

  return (
    <Link href={item.href} className="w-full block">
      <Button 
        variant={isActive ? "secondary" : "ghost"} 
        className={cn(
          "w-full justify-start gap-3 mb-1 smooth-transition relative overflow-hidden group",
          isActive && "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-medium shadow-sm"
        )}
      >
        {/* Active indicator */}
        {isActive && (
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary to-secondary rounded-r" />
        )}
        
        <Icon className={cn(
          "h-4 w-4 transition-transform group-hover:scale-110",
          isActive && "text-primary"
        )} />
        {item.title}
        
        {/* Hover effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Button>
    </Link>
  );
}
