import "server-only";

import { prismaAdapter } from "@better-auth/prisma-adapter";
import { betterAuth } from "better-auth/minimal";

import { db } from "@/db/client";
import { sendAuthEmail } from "@/server/email";
import { env } from "@/server/env";

const trustedOrigins = Array.from(
  new Set([new URL(env.NEXT_PUBLIC_APP_URL).origin, new URL(env.BETTER_AUTH_URL).origin]),
);

export const auth = betterAuth({
  appName: "RYCODE",
  baseURL: env.BETTER_AUTH_URL,
  basePath: "/api/auth",
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins,
  database: prismaAdapter(db, {
    provider: "postgresql",
    transaction: true,
  }),
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendAuthEmail({
        to: user.email,
        subject: "RYCODE — تأیید ایمیل / Verify your email",
        text: `برای تأیید ایمیل روی این پیوند باز کنید / Open this link to verify your email:\n${url}`,
      });
    },
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60,
  },
  emailAndPassword: {
    enabled: true,
    disableSignUp: env.AUTH_EMAIL_MODE === "disabled",
    requireEmailVerification: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
    autoSignIn: false,
    revokeSessionsOnPasswordReset: true,
    resetPasswordTokenExpiresIn: 30 * 60,
    sendResetPassword: async ({ user, url }) => {
      await db.auditLog.create({
        data: {
          actorUserId: user.id,
          action: "auth.password_reset_requested",
          entityType: "user",
          entityId: user.id,
          metadata: {
            delivery: env.AUTH_EMAIL_MODE,
          },
        },
      });

      await sendAuthEmail({
        to: user.email,
        subject: "RYCODE — بازیابی گذرواژه / Password reset",
        text: `برای انتخاب گذرواژه جدید روی این پیوند باز کنید / Open this link to choose a new password:\n${url}`,
      });
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 12,
    cookieCache: { enabled: true, maxAge: 60 * 5, strategy: "jwe" },
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    storage: "memory",
    customRules: {
      "/sign-in/email": { window: 60, max: 8 },
      "/sign-up/email": { window: 60 * 10, max: 5 },
      "/request-password-reset": { window: 60 * 15, max: 5 },
    },
  },
  advanced: {
    useSecureCookies: env.NODE_ENV === "production",
    cookiePrefix: "rycode",
    database: { joins: true, validateSchema: true },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const customerRole = await db.role.upsert({
            where: { key: "customer" },
            create: {
              key: "customer",
              name: "Customer",
              description: "Client-scoped workspace access.",
              isSystem: true,
            },
            update: {},
            select: { id: true },
          });

          await db.$transaction([
            db.profile.upsert({
              where: { userId: user.id },
              create: {
                userId: user.id,
                displayName: user.name,
                locale: "fa",
                timezone: "Asia/Tehran",
              },
              update: {},
            }),
            db.userRole.upsert({
              where: { userId_roleId: { userId: user.id, roleId: customerRole.id } },
              create: { userId: user.id, roleId: customerRole.id },
              update: {},
            }),
          ]);
        },
      },
    },
  },
  telemetry: { enabled: false },
});
