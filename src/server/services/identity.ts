import "server-only";

import { getCurrentIdentity } from "@/server/auth/session";
import { ServiceError } from "@/server/services/errors";

export async function requireCurrentIdentity() {
  const identity = await getCurrentIdentity();
  if (!identity) throw new ServiceError("AUTHENTICATION_REQUIRED");
  return identity;
}
