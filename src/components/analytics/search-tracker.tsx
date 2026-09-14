"use client";

import { useEffect } from "react";

import { trackAnalyticsEvent } from "./analytics-provider";

export function SearchTracker({
  queryLength,
  resultCount,
}: {
  queryLength: number;
  resultCount: number;
}) {
  useEffect(() => {
    trackAnalyticsEvent({
      name: "search",
      path: window.location.pathname,
      label: "site_search",
      value: resultCount,
      metadata: { queryLength },
    });
  }, [queryLength, resultCount]);
  return null;
}
