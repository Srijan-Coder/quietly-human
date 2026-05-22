"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8" />; // Placeholder to prevent layout shift
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full hover:bg-brand-card transition-colors duration-500 focus:outline-none flex items-center justify-center opacity-70 hover:opacity-100"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-4 w-4 text-brand-text transition-all" />
      ) : (
        <Moon className="h-4 w-4 text-brand-text transition-all" />
      )}
    </button>
  );
}
