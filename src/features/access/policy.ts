import { ServiceError } from "@/server/services/errors";

export function assertSuperAdminContinuity({
  targetIsSuperAdmin,
  targetWillBeSuperAdmin,
  otherSuperAdminCount,
}: {
  targetIsSuperAdmin: boolean;
  targetWillBeSuperAdmin: boolean;
  otherSuperAdminCount: number;
}): void {
  if (targetIsSuperAdmin && !targetWillBeSuperAdmin && otherSuperAdminCount === 0) {
    throw new ServiceError("INVALID_STATE", "آخرین Super Admin سامانه را نمی‌توان حذف کرد.");
  }
}
