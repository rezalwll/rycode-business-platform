import {
  AppWindow,
  BarChart3,
  BookOpenCheck,
  Boxes,
  Cable,
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardCheck,
  GraduationCap,
  Headphones,
  LayoutDashboard,
  Network,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Store,
  UserRound,
  UsersRound,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type ContextVisualVariant =
  | "web"
  | "software"
  | "mobile"
  | "seo"
  | "integration"
  | "data"
  | "recovery"
  | "support"
  | "ecommerce"
  | "crm"
  | "ordering"
  | "portal"
  | "dashboard"
  | "scheduling"
  | "booking"
  | "marketplace"
  | "warranty"
  | "dealer"
  | "lms"
  | "connected"
  | "article";

const catalogVariantBySlug: Record<string, ContextVisualVariant> = {
  "web-development": "web",
  ecommerce: "ecommerce",
  "custom-software": "software",
  "project-rescue": "recovery",
  "api-integration": "integration",
  "seo-growth": "seo",
  "ongoing-support": "support",
  "ecommerce-platform": "ecommerce",
  crm: "crm",
  "ordering-system": "ordering",
  "customer-portal": "portal",
  "management-dashboard": "dashboard",
  "warranty-portal": "warranty",
  "stalled-project": "recovery",
  "slow-website": "web",
  "low-organic-visibility": "seo",
  "disconnected-systems": "integration",
  "manual-operations": "software",
  "how-to-audit-a-stalled-software-project": "recovery",
};

const catalogVariantByKind: Record<string, ContextVisualVariant> = {
  services: "web",
  solutions: "software",
  problems: "recovery",
  industries: "connected",
  integrations: "integration",
  projects: "software",
  blog: "article",
};

export function catalogContextVariant(kind: string, slug: string): ContextVisualVariant {
  return catalogVariantBySlug[slug] ?? catalogVariantByKind[kind] ?? "software";
}

type VisualConfig = {
  icon: LucideIcon;
  eyebrow: string;
  accent: string;
  secondary: string;
  bars: readonly number[];
};

const visualConfigs: Record<ContextVisualVariant, VisualConfig> = {
  web: {
    icon: AppWindow,
    eyebrow: "WEB EXPERIENCE",
    accent: "#5fe1d5",
    secondary: "#7dc8ff",
    bars: [42, 68, 56, 82, 72, 94],
  },
  software: {
    icon: Boxes,
    eyebrow: "CUSTOM WORKSPACE",
    accent: "#7dc8ff",
    secondary: "#5fe1d5",
    bars: [62, 48, 76, 58, 88, 72],
  },
  mobile: {
    icon: Smartphone,
    eyebrow: "MOBILE PRODUCT",
    accent: "#b9a7ff",
    secondary: "#5fe1d5",
    bars: [48, 72, 58, 84, 66, 92],
  },
  seo: {
    icon: Search,
    eyebrow: "ORGANIC GROWTH",
    accent: "#5fe1d5",
    secondary: "#7dc8ff",
    bars: [34, 45, 52, 66, 78, 94],
  },
  integration: {
    icon: Cable,
    eyebrow: "CONNECTED FLOW",
    accent: "#5fe1d5",
    secondary: "#b9a7ff",
    bars: [72, 52, 82, 66, 92, 76],
  },
  data: {
    icon: BarChart3,
    eyebrow: "DECISION SYSTEM",
    accent: "#7dc8ff",
    secondary: "#5fe1d5",
    bars: [38, 61, 48, 78, 69, 96],
  },
  recovery: {
    icon: Wrench,
    eyebrow: "TECHNICAL RECOVERY",
    accent: "#b9a7ff",
    secondary: "#7dc8ff",
    bars: [78, 52, 68, 42, 72, 88],
  },
  support: {
    icon: Headphones,
    eyebrow: "ONGOING SUPPORT",
    accent: "#7dc8ff",
    secondary: "#5fe1d5",
    bars: [64, 72, 68, 80, 76, 92],
  },
  ecommerce: {
    icon: ShoppingBag,
    eyebrow: "ECOMMERCE",
    accent: "#5fe1d5",
    secondary: "#7dc8ff",
    bars: [44, 58, 72, 66, 84, 92],
  },
  crm: {
    icon: UsersRound,
    eyebrow: "CUSTOMER RELATIONS",
    accent: "#7dc8ff",
    secondary: "#b9a7ff",
    bars: [72, 56, 82, 64, 76, 90],
  },
  ordering: {
    icon: ClipboardCheck,
    eyebrow: "ORDER OPERATIONS",
    accent: "#5fe1d5",
    secondary: "#7dc8ff",
    bars: [58, 76, 64, 88, 74, 96],
  },
  portal: {
    icon: UserRound,
    eyebrow: "CUSTOMER PORTAL",
    accent: "#b9a7ff",
    secondary: "#5fe1d5",
    bars: [64, 48, 72, 60, 84, 78],
  },
  dashboard: {
    icon: LayoutDashboard,
    eyebrow: "MANAGEMENT VIEW",
    accent: "#7dc8ff",
    secondary: "#5fe1d5",
    bars: [36, 54, 46, 68, 82, 94],
  },
  scheduling: {
    icon: CalendarDays,
    eyebrow: "APPOINTMENTS",
    accent: "#5fe1d5",
    secondary: "#b9a7ff",
    bars: [62, 76, 48, 84, 68, 90],
  },
  booking: {
    icon: CalendarDays,
    eyebrow: "CAPACITY BOOKING",
    accent: "#7dc8ff",
    secondary: "#5fe1d5",
    bars: [48, 64, 72, 56, 86, 78],
  },
  marketplace: {
    icon: Store,
    eyebrow: "MARKETPLACE",
    accent: "#b9a7ff",
    secondary: "#7dc8ff",
    bars: [54, 68, 62, 78, 72, 92],
  },
  warranty: {
    icon: ShieldCheck,
    eyebrow: "WARRANTY SERVICE",
    accent: "#5fe1d5",
    secondary: "#b9a7ff",
    bars: [82, 72, 88, 64, 92, 78],
  },
  dealer: {
    icon: Network,
    eyebrow: "DEALER NETWORK",
    accent: "#7dc8ff",
    secondary: "#5fe1d5",
    bars: [66, 48, 78, 58, 86, 72],
  },
  lms: {
    icon: GraduationCap,
    eyebrow: "LEARNING SYSTEM",
    accent: "#b9a7ff",
    secondary: "#5fe1d5",
    bars: [42, 58, 74, 62, 82, 94],
  },
  connected: {
    icon: Network,
    eyebrow: "CONNECTED BUSINESS",
    accent: "#5fe1d5",
    secondary: "#7dc8ff",
    bars: [48, 72, 62, 86, 76, 94],
  },
  article: {
    icon: BookOpenCheck,
    eyebrow: "FIELD NOTE",
    accent: "#5fe1d5",
    secondary: "#b9a7ff",
    bars: [72, 54, 82, 66, 88, 76],
  },
};

export function ContextVisual({
  variant,
  title,
  items = [],
  className,
  decorative = false,
}: {
  variant: ContextVisualVariant;
  title: string;
  items?: readonly string[];
  className?: string;
  decorative?: boolean;
}) {
  const config = visualConfigs[variant];
  const Icon = config.icon;
  const modules = items.slice(0, 3);

  return (
    <div
      className={cn(
        "relative isolate h-full min-h-[18rem] overflow-hidden bg-[#052f3c] text-white",
        className,
      )}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : title}
      aria-hidden={decorative || undefined}
    >
      <div
        className="absolute inset-0 -z-20 opacity-90"
        style={{
          backgroundImage: `radial-gradient(circle at 78% 16%, ${config.accent}30, transparent 28%), radial-gradient(circle at 14% 88%, ${config.secondary}22, transparent 32%), linear-gradient(145deg, #052f3c, #073b4c 48%, #042936)`,
        }}
      />
      <div className="absolute inset-0 -z-10 opacity-[0.09] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="absolute inset-5 flex flex-col overflow-hidden rounded-xl border border-white/13 bg-[#082f3c]/78 shadow-[0_24px_80px_rgba(0,18,26,0.32)] backdrop-blur-sm sm:inset-7">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-1.5" aria-hidden>
            <span className="size-1.5 rounded-full" style={{ backgroundColor: config.accent }} />
            <span className="size-1.5 rounded-full bg-white/35" />
            <span className="size-1.5 rounded-full bg-white/15" />
          </div>
          <span className="font-latin text-[0.55rem] tracking-[0.17em] text-white/45">
            {config.eyebrow}
          </span>
        </div>

        <div className="grid flex-1 gap-3 p-4 sm:grid-cols-[1.15fr_0.85fr] sm:p-5">
          <div className="flex min-h-0 flex-col rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center gap-3">
              <span
                className="grid size-9 place-items-center rounded-lg border"
                style={{
                  borderColor: `${config.accent}55`,
                  backgroundColor: `${config.accent}18`,
                  color: config.accent,
                }}
              >
                <Icon className="size-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-white/88">{title}</p>
                <div className="mt-2 h-1.5 w-20 rounded-full bg-white/10">
                  <div
                    className="h-full w-3/5 rounded-full"
                    style={{ backgroundColor: config.accent }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-auto flex h-28 items-end gap-2 pt-5" aria-hidden>
              {config.bars.map((height, index) => (
                <span
                  key={`${variant}-${height}-${index}`}
                  className="flex-1 rounded-t-sm"
                  style={{
                    height: `${height}%`,
                    background: `linear-gradient(to top, ${config.secondary}55, ${config.accent})`,
                    opacity: 0.66 + index * 0.045,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="grid min-h-0 grid-rows-[auto_1fr] gap-3">
            <div className="rounded-lg border border-white/10 bg-white/[0.045] p-3">
              <div className="flex items-center justify-between">
                <ChartNoAxesCombined className="size-4" style={{ color: config.secondary }} />
                <span className="size-2 rounded-full" style={{ backgroundColor: config.accent }} />
              </div>
              <svg viewBox="0 0 140 42" className="mt-2 w-full" aria-hidden>
                <path
                  d="M2 34 C18 28, 24 31, 38 22 S60 29, 75 17 S100 22, 114 10 S132 12, 138 4"
                  fill="none"
                  stroke={config.accent}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="grid content-start gap-2 rounded-lg border border-white/10 bg-white/[0.045] p-3">
              {(modules.length ? modules : ["Scope", "Workflow", "Status"]).map((item, index) => (
                <div
                  key={item}
                  className="flex min-w-0 items-center gap-2 rounded-md border border-white/8 bg-white/[0.035] px-2.5 py-2"
                >
                  <span
                    className="size-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: index === 1 ? config.secondary : config.accent }}
                  />
                  <span className="truncate text-[0.62rem] font-medium text-white/62">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
