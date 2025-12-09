"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package, Settings, Users, ArrowRightLeft } from "lucide-react";

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
    <div className="flex h-full w-64 flex-col border-r bg-card text-card-foreground">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold tracking-tight text-primary">Asset Manager</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {sidebarItems.map((item) => (
          <SidebarItem key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="text-sm">
                <p className="font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@example.com</p>
            </div>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ item, pathname }: { item: any; pathname: string }) {
  const Icon = item.icon;
  const isActive = pathname.startsWith(item.href);

  return (
    <Link href={item.href} className="w-full">
      <Button 
        variant={isActive ? "secondary" : "ghost"} 
        className={cn("w-full justify-start gap-3 mb-1", isActive && "bg-secondary text-secondary-foreground")}
      >
        <Icon className="h-4 w-4" />
        {item.title}
      </Button>
    </Link>
  );
}
