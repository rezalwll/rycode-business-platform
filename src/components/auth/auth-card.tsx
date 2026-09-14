"use client";

import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Link, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { authClient } from "@/lib/auth-client";

type Mode = "login" | "register" | "forgot" | "reset";

const copy = {
  fa: {
    login: ["ورود به فضای کاری", "ایمیل و گذرواژه حساب رای‌کد خود را وارد کنید."],
    register: ["ساخت حساب مشتری", "برای دنبال‌کردن درخواست‌ها و پروژه‌ها یک حساب امن بسازید."],
    forgot: [
      "بازیابی گذرواژه",
      "اگر حسابی با این ایمیل وجود داشته باشد، راهنمای بازیابی ارسال می‌شود.",
    ],
    reset: ["گذرواژه جدید", "یک گذرواژه طولانی و منحصربه‌فرد انتخاب کنید."],
  },
  en: {
    login: ["Sign in to your workspace", "Enter the email and password for your RYCODE account."],
    register: [
      "Create a client account",
      "Create a secure account to follow requests and projects.",
    ],
    forgot: [
      "Reset your password",
      "If an account exists, password reset instructions will be sent.",
    ],
    reset: ["Choose a new password", "Use a long, unique password for this account."],
  },
} as const;

export function AuthCard({ locale, mode }: { locale: Locale; mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFa = locale === "fa";
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "saving") return;
    setError(null);

    if (mode !== "reset" && !/^\S+@\S+\.\S+$/.test(email)) {
      setError(isFa ? "ایمیل معتبر نیست." : "Enter a valid email address.");
      return;
    }
    if ((mode === "login" || mode === "register" || mode === "reset") && password.length < 12) {
      setError(
        isFa ? "گذرواژه باید حداقل ۱۲ نویسه باشد." : "Password must be at least 12 characters.",
      );
      return;
    }
    if (mode === "reset" && password !== confirm) {
      setError(isFa ? "تکرار گذرواژه یکسان نیست." : "Passwords do not match.");
      return;
    }

    setStatus("saving");
    try {
      if (mode === "login") {
        const result = await authClient.signIn.email({ email, password });
        if (result.error) throw new Error(result.error.message);
        router.replace("/dashboard");
        router.refresh();
        return;
      }
      if (mode === "register") {
        const result = await authClient.signUp.email({
          name: name.trim(),
          email,
          password,
          callbackURL: locale === "fa" ? "/dashboard" : "/en/dashboard",
        });
        if (result.error) throw new Error(result.error.message);
        setStatus("done");
        return;
      }
      if (mode === "forgot") {
        const result = await authClient.requestPasswordReset({
          email,
          redirectTo: locale === "fa" ? "/reset-password" : "/en/reset-password",
        });
        if (result.error) throw new Error(result.error.message);
        setStatus("done");
        return;
      }

      const token = searchParams.get("token");
      if (!token) throw new Error(isFa ? "لینک بازیابی معتبر نیست." : "The reset link is invalid.");
      const result = await authClient.resetPassword({ newPassword: password, token });
      if (result.error) throw new Error(result.error.message);
      router.replace("/login");
    } catch {
      setStatus("idle");
      setError(
        isFa
          ? "انجام درخواست ممکن نشد. اطلاعات را بررسی کنید یا کمی بعد دوباره تلاش کنید."
          : "The request could not be completed. Check your details or try again shortly.",
      );
    }
  }

  const [title, description] = copy[locale][mode];

  if (status === "done") {
    return (
      <div className="rounded-[6px] border border-brand/30 bg-brand/5 p-8" role="status">
        <p className="text-lg font-bold">{isFa ? "درخواست ثبت شد" : "Request received"}</p>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {mode === "register"
            ? isFa
              ? "برای فعال‌سازی حساب، لینک تأیید ارسال‌شده به ایمیل خود را باز کنید. پوشه هرزنامه را هم بررسی کنید."
              : "Open the verification link sent to your email to activate your account. Check your spam folder too."
            : isFa
              ? "اگر حسابی با این ایمیل وجود داشته باشد، راهنمای ادامه برای آن ارسال می‌شود."
              : "If an account exists for this email, reset instructions will be sent."}
        </p>
      </div>
    );
  }

  return (
    <section className="w-full max-w-md rounded-[6px] border border-border bg-surface p-7 shadow-[0_24px_80px_rgba(0,0,0,.06)] sm:p-10">
      <p className="meta-label text-brand">ACCOUNT / RYCODE</p>
      <h1 className="mt-5 text-2xl font-extrabold sm:text-3xl">{title}</h1>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>

      <form className="mt-8 space-y-5" noValidate onSubmit={submit}>
        {mode === "register" && (
          <Field
            id="name"
            label={isFa ? "نام و نام خانوادگی" : "Full name"}
            value={name}
            onChange={setName}
            autoComplete="name"
          />
        )}
        {mode !== "reset" && (
          <Field
            id="email"
            type="email"
            label={isFa ? "ایمیل" : "Email"}
            value={email}
            onChange={setEmail}
            autoComplete="email"
            dir="ltr"
          />
        )}
        {(mode === "login" || mode === "register" || mode === "reset") && (
          <Field
            id="password"
            type="password"
            label={
              mode === "reset"
                ? isFa
                  ? "گذرواژه جدید"
                  : "New password"
                : isFa
                  ? "گذرواژه"
                  : "Password"
            }
            value={password}
            onChange={setPassword}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            dir="ltr"
          />
        )}
        {mode === "reset" && (
          <Field
            id="confirm"
            type="password"
            label={isFa ? "تکرار گذرواژه" : "Confirm password"}
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
            dir="ltr"
          />
        )}

        {error && (
          <p className="text-sm leading-6 text-destructive" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "saving"}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[6px] bg-brand px-6 text-sm font-bold text-brand-foreground disabled:opacity-60"
        >
          {status === "saving" && <Loader2 aria-hidden className="size-4 animate-spin" />}
          {status === "saving"
            ? isFa
              ? "در حال انجام…"
              : "Working…"
            : mode === "login"
              ? isFa
                ? "ورود"
                : "Sign in"
              : mode === "register"
                ? isFa
                  ? "ساخت حساب"
                  : "Create account"
                : mode === "forgot"
                  ? isFa
                    ? "درخواست بازیابی"
                    : "Request reset"
                  : isFa
                    ? "ثبت گذرواژه"
                    : "Save password"}
        </button>
      </form>

      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
        {mode === "login" && (
          <Link href="/forgot-password" className="hover:text-brand">
            {isFa ? "گذرواژه را فراموش کرده‌اید؟" : "Forgot password?"}
          </Link>
        )}
        {mode !== "register" && (
          <Link href="/register" className="hover:text-brand">
            {isFa ? "ساخت حساب" : "Create account"}
          </Link>
        )}
        {mode !== "login" && (
          <Link href="/login" className="hover:text-brand">
            {isFa ? "بازگشت به ورود" : "Back to sign in"}
          </Link>
        )}
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  dir,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "password";
  autoComplete: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <label className="block text-sm font-semibold" htmlFor={id}>
      {label}
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        dir={dir}
        required
        className="mt-2 h-12 w-full rounded-[6px] border border-input bg-background px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
    </label>
  );
}
