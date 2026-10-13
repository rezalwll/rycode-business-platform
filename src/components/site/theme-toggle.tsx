"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

type Mode = "light" | "dark" | "system";

const KEY = "rycode-theme";
const CHANGE_EVENT = "rycode-theme-change";
let memoryMode: Mode = "light";

function getMode(): Mode {
  try {
    const stored = localStorage.getItem(KEY);
    return stored === "dark" || stored === "system" ? stored : "light";
  } catch {
    return memoryMode;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function setMode(next: Mode) {
  memoryMode = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    // Keep the preference in memory when browser storage is unavailable.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
  apply(next);
}

function apply(mode: Mode) {
  const dark =
    mode === "dark" ||
    (mode === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

export function ThemeToggle({
  className,
  variant = "default",
  locale = "fa",
}: {
  className?: string;
  variant?: "default" | "light";
  locale?: "fa" | "en";
}) {
  const mode = useSyncExternalStore(subscribe, getMode, () => "light" as const);

  useEffect(() => {
    apply(mode);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (mode === "system") apply(mode);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [mode]);

  const options: { value: Mode; icon: typeof Sun; label: string }[] = [
    { value: "light", icon: Sun, label: locale === "fa" ? "روشن" : "Light" },
    { value: "dark", icon: Moon, label: locale === "fa" ? "تاریک" : "Dark" },
    { value: "system", icon: Monitor, label: locale === "fa" ? "سیستم" : "System" },
  ];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-border p-0.5",
        variant === "light" && "border-white/25",
        className,
      )}
    >
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
          title={label}
          aria-pressed={mode === value}
          onClick={() => setMode(value)}
          className={cn(
            "grid size-7 place-items-center rounded-full transition-colors",
            mode === value
              ? variant === "light"
                ? "bg-white text-ink"
                : "bg-foreground text-background"
              : variant === "light"
                ? "text-white/55 hover:text-white"
                : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Icon className="size-3.5" />
        </button>
      ))}
    </div>
  );
}
