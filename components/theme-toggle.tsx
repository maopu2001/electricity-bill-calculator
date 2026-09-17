"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  if (!mounted) {
    return (
      <div className="size-9 rounded-xl border border-border/40 bg-card/60" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative size-9 rounded-xl border-border/50 bg-card/70 backdrop-blur-md shadow-xs hover:bg-accent hover:border-border transition-all duration-200 active:scale-95 cursor-pointer"
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          />
        }
      >
        <Sun className="size-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-amber-500" />
        <Moon className="absolute size-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-emerald-400" />
        <span className="sr-only">Toggle theme</span>
      </TooltipTrigger>
      <TooltipContent side="bottom" align="end" className="text-xs">
        Switch to {isDark ? "Light" : "Dark"} mode
      </TooltipContent>
    </Tooltip>
  );
}
