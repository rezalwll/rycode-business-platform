"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type Mode = "light" | "dark" | "system";

const KEY = "rycode-theme";

function apply(mode: Mode) {
  const dark =
    mode === "dark" ||
    (mode === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

export function ThemeToggle({ className }: { className?: string }) {
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window === "undefined") return "system";
    const stored = localStorage.getItem(KEY);
    return stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
  });

  useEffect(() => {
    apply(mode);
  }, [mode]);

  const set = (next: Mode) => {
    setMode(next);
    localStorage.setItem(KEY, next);
    apply(next);
  };

  const options: { value: Mode; icon: typeof Sun; label: string }[] = [
    { value: "light", icon: Sun, label: "روشن" },
    { value: "dark", icon: Moon, label: "تاریک" },
    { value: "system", icon: Monitor, label: "سیستم" },
  ];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-border p-0.5",
        className,
      )}
    >
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
          aria-pressed={mode === value}
          onClick={() => set(value)}
          className={cn(
            "grid size-7 place-items-center rounded-full transition-colors",
            mode === value
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Icon className="size-3.5" />
        </button>
      ))}
    </div>
  );
}
