"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, CheckCircle, User, Wrench } from "lucide-react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

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
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
};

const iconMap: Record<string, any> = {
  "package": Package,
  "check-circle": CheckCircle,
  "user": User,
  "wrench": Wrench,
};

function CountUpAnimation({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 0.8,
      ease: "easeOut",
    });

    return controls.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

export function StatCard({ title, value, iconName, description, href, color = "default" }: StatCardProps) {
  const Icon = iconMap[iconName] || Package;
  
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card className={`h-full hover-lift smooth-transition shadow-elevated ${href ? "cursor-pointer" : ""} overflow-hidden relative group`}>
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <motion.div 
            className={`p-2 rounded-lg ${colorClasses[color]}`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Icon className="h-4 w-4" />
          </motion.div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold">
            <CountUpAnimation value={value} />
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  if (href) {
    return <Link href={href} className="block h-full">{content}</Link>;
  }

  return content;
}
