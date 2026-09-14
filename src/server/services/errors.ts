import { z } from "zod";

import { AuthorizationError } from "@/server/auth/permissions";

export type ServiceErrorCode =
  | "AUTHENTICATION_REQUIRED"
  | "FORBIDDEN"
  | "INVALID_INPUT"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INVALID_STATE"
  | "INTERNAL_ERROR";

const publicMessages: Record<ServiceErrorCode, string> = {
  AUTHENTICATION_REQUIRED: "برای انجام این کار وارد حساب خود شوید.",
  FORBIDDEN: "اجازه انجام این کار را ندارید.",
  INVALID_INPUT: "اطلاعات ارسال‌شده معتبر نیست.",
  NOT_FOUND: "رکورد موردنظر پیدا نشد یا در دسترس شما نیست.",
  CONFLICT: "این تغییر با وضعیت فعلی اطلاعات تداخل دارد.",
  INVALID_STATE: "این عملیات در وضعیت فعلی قابل انجام نیست.",
  INTERNAL_ERROR: "انجام درخواست با خطا روبه‌رو شد. لطفاً دوباره تلاش کنید.",
};

export class ServiceError extends Error {
  override readonly name = "ServiceError";

  constructor(
    readonly code: ServiceErrorCode,
    message = publicMessages[code],
    override readonly cause?: unknown,
  ) {
    super(message);
  }
}

export type ActionFieldErrors = Record<string, string[]>;

export type ActionResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      error: {
        code: ServiceErrorCode;
        message: string;
        fieldErrors?: ActionFieldErrors;
      };
    };

function validationResult(error: z.ZodError): ActionResult<never> {
  const flattened = z.flattenError(error);
  const fieldErrors = Object.fromEntries(
    Object.entries(flattened.fieldErrors).filter((entry): entry is [string, string[]] => {
      return Array.isArray(entry[1]) && entry[1].length > 0;
    }),
  );

  return {
    ok: false,
    error: {
      code: "INVALID_INPUT",
      message: publicMessages.INVALID_INPUT,
      ...(Object.keys(fieldErrors).length > 0 ? { fieldErrors } : {}),
    },
  };
}

export function toActionError(error: unknown): ActionResult<never> {
  if (error instanceof z.ZodError) return validationResult(error);
  if (error instanceof AuthorizationError) {
    return {
      ok: false,
      error: { code: "FORBIDDEN", message: publicMessages.FORBIDDEN },
    };
  }
  if (error instanceof ServiceError) {
    return {
      ok: false,
      error: { code: error.code, message: error.message },
    };
  }

  if (typeof error === "object" && error !== null && "code" in error) {
    const databaseCode = String(error.code);
    if (databaseCode === "P2002" || databaseCode === "P2034") {
      return {
        ok: false,
        error: {
          code: "CONFLICT",
          message:
            databaseCode === "P2034"
              ? "اطلاعات هم‌زمان تغییر کرده است؛ لطفاً درخواست را دوباره اجرا کنید."
              : publicMessages.CONFLICT,
        },
      };
    }
    if (databaseCode === "P2025") {
      return {
        ok: false,
        error: { code: "NOT_FOUND", message: publicMessages.NOT_FOUND },
      };
    }
  }

  console.error("Unhandled business service error", error);
  return {
    ok: false,
    error: { code: "INTERNAL_ERROR", message: publicMessages.INTERNAL_ERROR },
  };
}

export async function asActionResult<T>(operation: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await operation() };
  } catch (error) {
    return toActionError(error);
  }
}
