"use client";

import { Moon, Sun, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [colorTheme, setColorTheme] = useState<"ocean" | "sunset">("ocean");

  useEffect(() => {
    setMounted(true);
    const savedColorTheme = localStorage.getItem("color-theme") as "ocean" | "sunset";
    if (savedColorTheme) {
      setColorTheme(savedColorTheme);
      applyColorTheme(savedColorTheme);
    }
  }, []);

  const applyColorTheme = (newTheme: "ocean" | "sunset") => {
    if (newTheme === "sunset") {
      document.documentElement.setAttribute("data-theme", "sunset");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("color-theme", newTheme);
  };

  const handleColorThemeChange = (newTheme: "ocean" | "sunset") => {
    setColorTheme(newTheme);
    applyColorTheme(newTheme);
  };

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="smooth-transition btn-hover">
          <Palette className="h-5 w-5" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Color Theme</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => handleColorThemeChange("ocean")}
          className="cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-sky-500"></div>
            <span>Ocean Breeze</span>
            {colorTheme === "ocean" && <span className="ml-auto">✓</span>}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleColorThemeChange("sunset")}
          className="cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span>Sunset Glow</span>
            {colorTheme === "sunset" && <span className="ml-auto">✓</span>}
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel>Mode</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
          {resolvedTheme === "light" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
          {resolvedTheme === "dark" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
          <Palette className="mr-2 h-4 w-4" />
          <span>System</span>
          {theme === "system" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
