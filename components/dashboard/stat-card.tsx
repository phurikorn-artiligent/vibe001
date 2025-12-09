"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, CheckCircle, User, Wrench } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  iconName: string;
  description?: string;
  href?: string;
  color?: "default" | "emerald" | "blue" | "amber";
}

const colorClasses = {
  default: "bg-primary/10 text-primary",
  emerald: "bg-emerald-100 text-emerald-700",
  blue: "bg-blue-100 text-blue-700",
  amber: "bg-amber-100 text-amber-700",
};

const iconMap: Record<string, any> = {
  "package": Package,
  "check-circle": CheckCircle,
  "user": User,
  "wrench": Wrench,
};

export function StatCard({ title, value, iconName, description, href, color = "default" }: StatCardProps) {
  const Icon = iconMap[iconName] || Package;
  
  const content = (
    <Card className={href ? "cursor-pointer hover:shadow-md transition-shadow" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
