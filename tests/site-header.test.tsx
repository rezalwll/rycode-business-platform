// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import type { AnchorHTMLAttributes } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const route = vi.hoisted(() => ({ pathname: "/services" }));
vi.mock("@/i18n/navigation", () => ({
  usePathname: () => route.pathname,
  Link: ({
    locale: _locale,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { locale?: string }) => <a {...props} />,
}));
vi.mock("@/components/site/logo", () => ({ Logo: () => <span>RYCODE</span> }));

import { SiteHeader } from "@/components/site/header";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { getCatalogEntry, resolveCatalogDetail } from "@/content/catalog";
import { serviceGroups } from "@/lib/nav-content";
import { serviceHighlights } from "@/content/service-offerings";

let resizeListener: (() => void) | undefined;
beforeEach(() => {
  route.pathname = "/services";
  localStorage.clear();
  document.documentElement.classList.remove("dark");
  resizeListener = undefined;
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: false,
      media: query,
      addEventListener: (_name: string, listener: () => void) => {
        if (query.includes("1280")) resizeListener = listener;
      },
      removeEventListener: vi.fn(),
    })),
  );
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    callback(0);
    return 0;
  });
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  document.body.style.overflow = "";
});

describe("site navigation", () => {
  it.each(["fa", "en"] as const)("keeps the header opaque after scrolling and on inner pages for %s", (locale) => {
    vi.spyOn(window, "scrollY", "get").mockReturnValue(0);
    route.pathname = "/";
    const { container, rerender } = render(<SiteHeader locale={locale} />);
    const header = container.querySelector("header")!;
    expect(header.classList.contains("reference-overlay-header")).toBe(true);
    vi.spyOn(window, "scrollY", "get").mockReturnValue(100);
    fireEvent.scroll(window);
    expect(header.classList.contains("reference-overlay-header")).toBe(false);
    expect(header.classList.contains("bg-surface")).toBe(true);
    expect(header.classList.contains("bg-surface/95")).toBe(false);
    vi.spyOn(window, "scrollY", "get").mockReturnValue(0);
    fireEvent.scroll(window);
    expect(header.classList.contains("reference-overlay-header")).toBe(true);
    route.pathname = "/services";
    rerender(<SiteHeader locale={locale} />);
    expect(header.classList.contains("reference-overlay-header")).toBe(false);
    expect(header.classList.contains("bg-surface")).toBe(true);
    document.documentElement.classList.add("dark");
    fireEvent.scroll(window);
    expect(header.classList.contains("bg-surface")).toBe(true);
    vi.restoreAllMocks();
  });

  it("keeps a closing dropdown mounted for its fade but immediately removes interaction", () => {
    const { container } = render(<SiteHeader locale="fa" />);
    const trigger = screen.getByRole("button", { name: "زیرمنوی خدمات" });
    const panel = container.querySelector('.rycode-desktop-submenu[aria-label="زیرمنوی خدمات"]')!;
    expect(panel.getAttribute("aria-hidden")).toBe("true");
    expect(panel.hasAttribute("inert")).toBe(true);
    fireEvent.click(trigger);
    expect(panel.getAttribute("data-state")).toBe("open");
    expect(panel.hasAttribute("inert")).toBe(false);
    fireEvent.keyDown(trigger, {key: "Escape"});
    expect(panel.isConnected).toBe(true);
    expect(panel.getAttribute("data-state")).toBe("closed");
    expect(panel.getAttribute("aria-hidden")).toBe("true");
    expect(panel.hasAttribute("inert")).toBe(true);
    expect(screen.queryByRole("region", {name: "زیرمنوی خدمات"})).toBeNull();
  });
  it("keeps each dropdown label and chevron inside one shared click target", () => {
    for (const locale of ["fa", "en"] as const) {
      const { unmount } = render(<SiteHeader locale={locale} />);
      const trigger = screen.getByRole("button", { name: locale === "fa" ? "زیرمنوی خدمات" : "Services submenu" });
      const label = within(trigger).getByText(locale === "fa" ? "خدمات" : "Services");
      const arrow = trigger.querySelector("svg")!;
      expect(trigger.querySelector("a, button")).toBeNull();
      expect(trigger.classList.contains("rycode-primary-link")).toBe(true);
      fireEvent.click(label);
      expect(trigger.getAttribute("aria-expanded")).toBe("true");
      fireEvent.click(arrow);
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
      fireEvent.click(screen.getByRole("button", { name: locale === "fa" ? "باز کردن منو" : "Open menu" }));
      const dialog = screen.getByRole("dialog");
      const mobile = within(dialog).getByRole("button", { name: locale === "fa" ? "نمایش خدمات" : "Show Services" });
      fireEvent.click(within(mobile).getByText(locale === "fa" ? "خدمات" : "Services"));
      expect(mobile.getAttribute("aria-expanded")).toBe("true");
      fireEvent.click(mobile.querySelector("svg")!);
      expect(mobile.getAttribute("aria-expanded")).toBe("false");
      unmount();
    }
  });
  it("omits the extra about-group heading while preserving all five links on desktop and mobile", () => {
    for (const locale of ["fa", "en"] as const) {
      const { unmount } = render(<SiteHeader locale={locale} />);
      fireEvent.click(screen.getByRole("button", { name: locale === "fa" ? "زیرمنوی درباره ما" : "About us submenu" }));
      const panel = screen.getByRole("region", { name: locale === "fa" ? "زیرمنوی درباره ما" : "About us submenu" });
      expect(within(panel).getAllByRole("link")).toHaveLength(5);
      expect(panel.textContent).not.toContain(locale === "fa" ? "آشنایی با رایکد" : "Meet RYCODE");
      expect(panel.querySelector("p")).toBeNull();
      fireEvent.click(screen.getByRole("button", { name: locale === "fa" ? "باز کردن منو" : "Open menu" }));
      const dialog = screen.getByRole("dialog");
      const trigger = within(dialog).getByRole("button", { name: locale === "fa" ? "نمایش درباره ما" : "Show About us" });
      fireEvent.click(trigger);
      const mobilePanel = document.getElementById(trigger.getAttribute("aria-controls")!)!;
      expect(within(mobilePanel).getAllByRole("link")).toHaveLength(5);
      expect(mobilePanel.textContent).not.toContain(locale === "fa" ? "آشنایی با رایکد" : "Meet RYCODE");
      expect(mobilePanel.querySelector("p")).toBeNull();
      unmount();
    }
  });
  it("retains work in the main menu and adds decorative icons without extra service content", () => {
    for (const locale of ["fa", "en"] as const) {
      const { container, unmount } = render(<SiteHeader locale={locale} />);
      const header = container.querySelector("header")!;
      expect(within(header).getByRole("link", {name: locale === "fa" ? "نمونه‌کارها" : "Work"}).getAttribute("href")).toBe("/projects");
      fireEvent.click(screen.getByRole("button", {name: locale === "fa" ? "زیرمنوی خدمات" : "Services submenu"}));
      const panel = screen.getByRole("region", {name: locale === "fa" ? "زیرمنوی خدمات" : "Services submenu"});
      expect(within(panel).getAllByRole("link")).toHaveLength(7);
      expect(panel.querySelector("img, aside, h3, p, .rycode-services-menu-related")).toBeNull();
      expect(panel.querySelectorAll(".rycode-submenu-icon svg")).toHaveLength(7);
      expect(panel.querySelectorAll('.rycode-submenu-arrow[aria-hidden="true"]')).toHaveLength(7);
      fireEvent.click(screen.getByRole("button", {name: locale === "fa" ? "باز کردن منو" : "Open menu"}));
      const dialog = screen.getByRole("dialog");
      expect(within(dialog).getByRole("link", {name: locale === "fa" ? /نمونه‌کارها/ : /Work/}).getAttribute("href")).toBe("/projects");
      fireEvent.click(within(dialog).getByRole("button", {name: locale === "fa" ? "نمایش خدمات" : "Show Services"}));
      const mobileMenu = dialog.querySelector(".rycode-services-menu")!;
      expect(within(mobileMenu as HTMLElement).getAllByRole("link")).toHaveLength(7);
      expect(mobileMenu.querySelector("img, aside, h3, p")).toBeNull();
      expect(mobileMenu.querySelectorAll(".rycode-submenu-icon svg")).toHaveLength(7);
      unmount();
    }
  });
  it("presents exactly seven ordered service names without extra links", () => {
    for (const locale of ["fa", "en"] as const) {
      const { unmount } = render(<SiteHeader locale={locale} />);
      fireEvent.click(screen.getByRole("button", { name: locale === "fa" ? "زیرمنوی خدمات" : "Services submenu" }));
      const panel = screen.getByRole("region", { name: locale === "fa" ? "زیرمنوی خدمات" : "Services submenu" });
      const choices = panel.querySelectorAll<HTMLAnchorElement>(".rycode-services-menu-link");
      expect(choices).toHaveLength(7);
      choices.forEach((link, index) => {
        expect(link.getAttribute("href")).toBe(`/services/${serviceHighlights[index]!.slug}`);
        expect(link.textContent).toContain(serviceHighlights[index]!.title[locale]);
      });
      expect(panel.querySelector('a[href="/services/ecommerce"]')).toBeNull();
      expect(panel.querySelector('a[href="/services/mobile-app-development"]')).toBeNull();
      expect(panel.querySelector(".rycode-services-menu-list")?.children).toHaveLength(7);
      expect(panel.querySelector(".rycode-services-menu-footer")).toBeNull();
      for (const href of ["/services", "/projects", "/services#solutions", "/services#industries", "/installment-purchase"]) {
        expect(panel.querySelector(`a[href="${href}"]`)).toBeNull();
      }
      fireEvent.click(choices[0]!);
      expect(panel.getAttribute("data-state")).toBe("closed");
      expect(panel.getAttribute("aria-hidden")).toBe("true");
      expect(panel.hasAttribute("inert")).toBe(true);
      expect(screen.getByRole("button", { name: locale === "fa" ? "زیرمنوی خدمات" : "Services submenu" }).getAttribute("aria-expanded")).toBe("false");
      fireEvent.click(screen.getByRole("button", { name: locale === "fa" ? "باز کردن منو" : "Open menu" }));
      const dialog = screen.getByRole("dialog");
      const mobileTrigger = within(dialog).getByRole("button", { name: locale === "fa" ? "نمایش خدمات" : "Show Services" });
      fireEvent.click(mobileTrigger);
      const mobilePanel = document.getElementById(mobileTrigger.getAttribute("aria-controls")!)!;
      expect(mobilePanel.querySelectorAll(".rycode-services-menu-link")).toHaveLength(7);
      expect(mobilePanel.querySelector(".rycode-services-menu-footer")).toBeNull();
      for (const href of ["/services", "/projects", "/services#solutions", "/services#industries", "/installment-purchase"]) {
        expect(mobilePanel.querySelector(`a[href="${href}"]`)).toBeNull();
      }
      unmount();
    }
  });
  it("omits the top project CTA while retaining the locale and theme controls", () => {
    for (const locale of ["fa", "en"] as const) {
      const { container, unmount } = render(<SiteHeader locale={locale} />);
      const header = container.querySelector("header")!;
      expect(header.querySelector('a[href="/start-project"]')).toBeNull();
      expect(within(header).getByRole("link", { name: locale === "fa" ? "Switch to English" : "تغییر زبان به فارسی" })).toBeTruthy();
      expect(header.querySelector('button[aria-pressed]')).toBeTruthy();
      expect(within(header).getByRole("link", { name: "RYCODE" })).toBeTruthy();
      unmount();
    }
  });

  it.each(["fa", "en"] as const)("marks the current service and keeps redesigned links keyboard-accessible for %s", (locale) => {
    route.pathname = "/services/custom-software";
    render(<SiteHeader locale={locale} />);
    const trigger = screen.getByRole("button", { name: locale === "fa" ? "زیرمنوی خدمات" : "Services submenu" });
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    const panel = screen.getByRole("region", { name: trigger.getAttribute("aria-label")! });
    const links = within(panel).getAllByRole("link");
    expect(document.activeElement).toBe(links[0]);
    expect(links.filter(link => link.getAttribute("aria-current") === "page")).toEqual([links[2]]);
    links.forEach((link, index) => {
      expect(link.textContent).toBe(serviceHighlights[index]!.title[locale]);
      expect(link.querySelector('.rycode-submenu-icon[aria-hidden="true"]')).toBeTruthy();
      expect(link.querySelector("a, button")).toBeNull();
    });
    fireEvent.keyDown(links[0]!, { key: "Escape" });
    expect(document.activeElement).toBe(trigger);
    expect(panel.hasAttribute("inert")).toBe(true);
  });

  it("opens one submenu on pointer enter and closes on leave", () => {
    render(<SiteHeader locale="fa" />);
    const services = screen.getByRole("button", { name: "زیرمنوی خدمات" });
    const about = screen.getByRole("button", { name: "زیرمنوی درباره ما" });
    // jsdom does not implement PointerEvent's pointerType, so define it explicitly.
    const enter = new Event("pointerover", { bubbles: true });
    Object.defineProperty(enter, "pointerType", { value: "mouse" });
    fireEvent(services, enter);
    expect(services.getAttribute("aria-expanded")).toBe("true");
    expect(
      within(screen.getByRole("region", { name: "زیرمنوی خدمات" })).getByRole("link", {name: "طراحی سایت و فروشگاه اینترنتی"}),
    ).toBeTruthy();
    fireEvent(about, enter);
    expect(about.getAttribute("aria-expanded")).toBe("true");
    expect(services.getAttribute("aria-expanded")).toBe("false");
    fireEvent.pointerOut(about, { relatedTarget: document.body });
    expect(about.getAttribute("aria-expanded")).toBe("false");
  });

  it("supports click after hover, a second click, Escape and outside clicks", () => {
    render(<SiteHeader locale="fa" />);
    const trigger = screen.getByRole("button", { name: "زیرمنوی خدمات" });
    const enter = new Event("pointerover", { bubbles: true });
    Object.defineProperty(enter, "pointerType", { value: "mouse" });
    fireEvent(trigger, enter);
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    fireEvent.pointerOut(trigger, { relatedTarget: document.body });
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(trigger);
    fireEvent.keyDown(trigger, { key: "Escape" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger);
    fireEvent.click(trigger);
    fireEvent.pointerDown(document.body);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes on navigation and uses the correct English panel direction", () => {
    render(<SiteHeader locale="en" />);
    const trigger = screen.getByRole("button", { name: "About us submenu" });
    fireEvent.click(trigger);
    const panel = screen.getByRole("region", { name: "About us submenu" });
    expect(panel.getAttribute("dir")).toBe("ltr");
    expect(panel.className).toContain("right-0");
    expect(panel.className).toContain("w-72");
    fireEvent.click(within(panel).getByRole("link", { name: "FAQ" }));
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("renders mobile submenus below their row without truncating links", () => {
    render(<SiteHeader locale="fa" />);
    fireEvent.click(screen.getByRole("button", { name: "باز کردن منو" }));
    const dialog = screen.getByRole("dialog");
    const trigger = within(dialog).getByRole("button", { name: "نمایش خدمات" });
    fireEvent.click(trigger);
    const panel = document.getElementById(trigger.getAttribute("aria-controls")!)!;
    expect(panel.hidden).toBe(false);
    expect(panel.parentElement).toBe(trigger.parentElement?.parentElement);
    expect(within(panel).getByRole("link", { name: "پشتیبانی و توسعه مستمر" })).toBeTruthy();
    fireEvent.click(within(dialog).getByRole("button", { name: "نمایش درباره ما" }));
    expect(panel.hidden).toBe(true);
  });

  it("traps mobile focus, restores focus and preserves the body scroll style", () => {
    document.body.style.overflow = "auto";
    render(<SiteHeader locale="fa" />);
    const open = screen.getByRole("button", { name: "باز کردن منو" });
    fireEvent.click(open);
    const dialog = screen.getByRole("dialog");
    const close = within(dialog).getByRole("button", { name: "بستن" });
    expect(document.activeElement).toBe(close);
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.keyDown(close, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(
      within(dialog).getByRole("link", { name: "شروع یک پروژه" }),
    );
    fireEvent.keyDown(document.activeElement!, { key: "Tab" });
    expect(document.activeElement).toBe(close);
    fireEvent.keyDown(close, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).toBe("auto");
    expect(document.activeElement).toBe(open);
  });

  it("unlocks scrolling when switching to desktop", () => {
    render(<SiteHeader locale="fa" />);
    fireEvent.click(screen.getByRole("button", { name: "باز کردن منو" }));
    act(() => resizeListener?.());
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });

  it("closes the mobile menu after clicking its bottom call to action", () => {
    render(<SiteHeader locale="fa" />);
    fireEvent.click(screen.getByRole("button", { name: "باز کردن منو" }));
    const dialog = screen.getByRole("dialog");
    const cta = within(dialog).getByRole("link", { name: "شروع یک پروژه" });
    fireEvent.click(cta);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });

  it("also releases the mobile dialog on external route changes", () => {
    const { rerender } = render(<SiteHeader locale="fa" />);
    fireEvent.click(screen.getByRole("button", { name: "باز کردن منو" }));
    route.pathname = "/projects";
    rerender(<SiteHeader locale="fa" />);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });

  it("keeps industries and solutions out of the top-level menu", () => {
    render(<SiteHeader locale="fa" />);
    expect(screen.queryByRole("link", { name: /کسب‌وکارها و راهکارها|صنایع/ })).toBeNull();
  });
});

it("synchronizes theme toggles without server/client initial-state differences", () => {
  localStorage.setItem("rycode-theme", "dark");
  render(
    <>
      <ThemeToggle />
      <ThemeToggle />
    </>,
  );
  expect(document.documentElement.classList.contains("dark")).toBe(true);
  fireEvent.click(screen.getAllByRole("button", { name: "روشن" })[0]!);
  expect(document.documentElement.classList.contains("dark")).toBe(false);
  expect(
    screen
      .getAllByRole("button", { name: "روشن" })
      .every((button) => button.getAttribute("aria-pressed") === "true"),
  ).toBe(true);
});

it("hydrates a stored dark preference without mismatching the server markup", async () => {
  localStorage.setItem("rycode-theme", "dark");
  const container = document.createElement("div");
  container.innerHTML = renderToString(<ThemeToggle />);
  document.body.append(container);
  const errors: unknown[] = [];
  let root: ReturnType<typeof hydrateRoot>;
  await act(async () => {
    root = hydrateRoot(container, <ThemeToggle />, {
      onRecoverableError: (error) => errors.push(error),
    });
  });
  expect(errors).toEqual([]);
  expect(
    within(container).getByRole("button", { name: "تاریک" }).getAttribute("aria-pressed"),
  ).toBe("true");
  act(() => root.unmount());
  container.remove();
});

it("routes every service submenu link to a real, relevant detail page", () => {
  for (const group of serviceGroups) {
    for (const link of group.items) {
      if (!link.href.startsWith("/services/")) continue;
      const detail = resolveCatalogDetail(link.href.slice(1).split("/"));
      expect(detail).not.toBeNull();
      expect(getCatalogEntry(detail!.kind, detail!.slug)).toBeTruthy();
    }
  }
});
