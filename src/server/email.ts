import "server-only";

import nodemailer from "nodemailer";

import { env } from "@/server/env";

let smtpTransport: ReturnType<typeof nodemailer.createTransport> | undefined;

type AuthEmail = {
  to: string;
  subject: string;
  text: string;
};

export async function sendAuthEmail(message: AuthEmail): Promise<void> {
  if (env.AUTH_EMAIL_MODE === "disabled") {
    throw new Error("Transactional email delivery is disabled.");
  }

  if (env.AUTH_EMAIL_MODE === "console") {
    if (env.NODE_ENV === "production") {
      throw new Error("Console email delivery is forbidden in production.");
    }
    console.info(
      `[RYCODE development email] to=${message.to} subject=${message.subject}\n${message.text}`,
    );
    return;
  }

  smtpTransport ??= nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE === "true",
    requireTLS: env.NODE_ENV === "production" && env.SMTP_SECURE !== "true",
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 30_000,
    ...(env.SMTP_USER && env.SMTP_PASS
      ? { auth: { user: env.SMTP_USER, pass: env.SMTP_PASS } }
      : {}),
  });

  await smtpTransport.sendMail({
    from: env.SMTP_FROM,
    to: message.to,
    subject: message.subject,
    text: message.text,
  });
}
