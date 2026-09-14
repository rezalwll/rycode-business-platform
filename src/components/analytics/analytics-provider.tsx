"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";

import type { AnalyticsEventInput } from "@/server/analytics/validation";

const CONSENT_KEY = "rycode.analytics.consent.v1";
const ANONYMOUS_ID_KEY = "rycode.analytics.anonymous-id.v1";
const SESSION_KEY = "rycode.analytics.session-key.v1";
const CONSENT_EVENT = "rycode:analytics-consent";

type Consent = "granted" | "denied" | "unknown";
export type AnalyticsAttribution = { anonymousId: string; sessionKey: string };
type ClientEvent = Pick<AnalyticsEventInput, "name" | "path"> &
  Partial<
    Pick<
      AnalyticsEventInput,
      "pageType" | "entityType" | "entityId" | "label" | "value" | "metadata"
    >
  >;

let fallbackAnonymousId: string | undefined;
let fallbackSessionKey: string | undefined;

function randomIdentifier(): string {
  return crypto.randomUUID();
}

function readConsent(): Consent {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    return stored === "granted" || stored === "denied" ? stored : "unknown";
  } catch {
    return "unknown";
  }
}

function getOrCreateIdentifier(
  storage: Storage,
  key: string,
  getFallback: () => string | undefined,
  setFallback: (value: string) => void,
): string {
  try {
    const current = storage.getItem(key);
    if (current) return current;
    const created = randomIdentifier();
    storage.setItem(key, created);
    return created;
  } catch {
    const current = getFallback();
    if (current) return current;
    const created = randomIdentifier();
    setFallback(created);
    return created;
  }
}

export function readAnalyticsAttribution(): AnalyticsAttribution | null {
  if (typeof window === "undefined" || readConsent() !== "granted") return null;
  return {
    anonymousId: getOrCreateIdentifier(
      localStorage,
      ANONYMOUS_ID_KEY,
      () => fallbackAnonymousId,
      (value) => {
        fallbackAnonymousId = value;
      },
    ),
    sessionKey: getOrCreateIdentifier(
      sessionStorage,
      SESSION_KEY,
      () => fallbackSessionKey,
      (value) => {
        fallbackSessionKey = value;
      },
    ),
  };
}

export function subscribeAnalyticsAttribution(listener: () => void): () => void {
  window.addEventListener(CONSENT_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(CONSENT_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

function pageTypeForPath(path: string): AnalyticsEventInput["pageType"] {
  if (/^\/(?:fa\/|en\/)?admin(?:\/|$)/.test(path)) return "admin";
  if (/^\/(?:fa\/|en\/)?(?:dashboard|portal)(?:\/|$)/.test(path)) return "portal";
  if (/^\/(?:fa\/|en\/)?blog\/.+/.test(path)) return "article";
  if (/^\/(?:fa\/|en\/)?services\/.+/.test(path)) return "service";
  return "marketing";
}

function campaignContext(): Pick<
  AnalyticsEventInput,
  "referrer" | "utmSource" | "utmMedium" | "utmCampaign"
> {
  const params = new URLSearchParams(window.location.search);
  return {
    ...(document.referrer ? { referrer: document.referrer } : {}),
    ...(params.get("utm_source") ? { utmSource: params.get("utm_source") ?? undefined } : {}),
    ...(params.get("utm_medium") ? { utmMedium: params.get("utm_medium") ?? undefined } : {}),
    ...(params.get("utm_campaign") ? { utmCampaign: params.get("utm_campaign") ?? undefined } : {}),
  };
}

export function trackAnalyticsEvent(event: ClientEvent): void {
  const attribution = readAnalyticsAttribution();
  if (!attribution) return;
  const payload: AnalyticsEventInput = {
    anonymousId: attribution.anonymousId,
    sessionKey: attribution.sessionKey,
    consent: "granted",
    locale: document.documentElement.lang || "fa",
    pageType: event.pageType ?? pageTypeForPath(event.path),
    ...campaignContext(),
    ...event,
  };
  const serialized = JSON.stringify(payload);

  if (typeof navigator.sendBeacon === "function") {
    const accepted = navigator.sendBeacon(
      "/api/analytics/events",
      new Blob([serialized], { type: "application/json" }),
    );
    if (accepted) return;
  }
  void fetch("/api/analytics/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: serialized,
    credentials: "same-origin",
    keepalive: true,
  }).catch(() => undefined);
}

function setConsent(value: Exclude<Consent, "unknown">): void {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // A blocked storage API simply makes the choice session-local.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

function subscribeToConsent(onStoreChange: () => void): () => void {
  window.addEventListener(CONSENT_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function AnalyticsTracker({ path }: { path: string }): null {
  const [consentRevision, setConsentRevision] = useState(0);

  useEffect(() => {
    const handleConsent = () => setConsentRevision((value) => value + 1);
    window.addEventListener(CONSENT_EVENT, handleConsent);
    return () => window.removeEventListener(CONSENT_EVENT, handleConsent);
  }, []);

  useEffect(() => {
    trackAnalyticsEvent({ name: "page_view", path });
  }, [path, consentRevision]);

  useEffect(() => {
    const startedForms = new WeakSet<HTMLFormElement>();

    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const cta = target?.closest<HTMLElement>(
        '[data-analytics-label],a[href*="/start-project"],a[href*="/contact"],a[href*="/login"]',
      );
      if (!cta) return;
      const label =
        cta.dataset.analyticsLabel?.trim() ||
        cta.textContent?.replace(/\s+/g, " ").trim().slice(0, 240);
      trackAnalyticsEvent({
        name: "cta_click",
        path: window.location.pathname,
        ...(label ? { label } : {}),
        ...(cta.dataset.analyticsEntityType ? { entityType: cta.dataset.analyticsEntityType } : {}),
        ...(cta.dataset.analyticsEntityId ? { entityId: cta.dataset.analyticsEntityId } : {}),
      });
    };

    const handleFocus = (event: FocusEvent) => {
      const form = event.target instanceof Element ? event.target.closest("form") : null;
      if (!form || startedForms.has(form)) return;
      startedForms.add(form);
      trackAnalyticsEvent({
        name: "form_started",
        path: window.location.pathname,
        label: form.dataset.analyticsForm || form.id || form.getAttribute("name") || "form",
      });
    };

    document.addEventListener("click", handleClick, { capture: true });
    document.addEventListener("focusin", handleFocus);
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      document.removeEventListener("focusin", handleFocus);
    };
  }, []);

  return null;
}

function ConsentBanner({ locale }: { locale: "fa" | "en" }): React.ReactElement | null {
  const consent = useSyncExternalStore(subscribeToConsent, readConsent, () => "unknown");

  if (consent !== "unknown") return null;
  const isPersian = locale === "fa";

  return (
    <aside
      aria-label={isPersian ? "تنظیمات تحلیل بازدید" : "Analytics preference"}
      className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-2xl border border-black/15 bg-[#fffaf1] p-4 text-[#1f1e1b] shadow-2xl dark:border-white/20 dark:bg-[#211f1b] dark:text-[#fffaf1]"
      dir={isPersian ? "rtl" : "ltr"}
      role="dialog"
    >
      <p className="text-sm leading-7">
        {isPersian
          ? "برای بهبود تجربه سایت، آمار ناشناس و بدون ذخیره IP خام ثبت شود؟"
          : "May we collect anonymous usage data, without storing your raw IP address?"}
      </p>
      <div className="mt-3 flex gap-2">
        <button
          className="rounded-md bg-[#ef5b23] px-4 py-2 text-sm font-semibold text-white"
          onClick={() => setConsent("granted")}
          type="button"
        >
          {isPersian ? "می‌پذیرم" : "Allow"}
        </button>
        <button
          className="rounded-md border border-current px-4 py-2 text-sm"
          onClick={() => setConsent("denied")}
          type="button"
        >
          {isPersian ? "رد می‌کنم" : "Decline"}
        </button>
      </div>
    </aside>
  );
}

export function AnalyticsProvider({ locale }: { locale: "fa" | "en" }): React.ReactElement {
  const pathname = usePathname();
  return (
    <>
      <AnalyticsTracker path={pathname} />
      <ConsentBanner locale={locale} />
    </>
  );
}
