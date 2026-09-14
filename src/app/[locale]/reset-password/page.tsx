import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AuthPage } from "@/components/auth/auth-page";
import { isLocale } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "گذرواژه جدید",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <AuthPage locale={locale} mode="reset" />;
}
