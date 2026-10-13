"use client";

import { useEffect } from "react";
import { PublicFailurePage } from "@/components/public/failure-page";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("RYCODE route error", { message: error.message, digest: error.digest });
  }, [error]);

  return <PublicFailurePage kind="error" reset={reset} />;
}
