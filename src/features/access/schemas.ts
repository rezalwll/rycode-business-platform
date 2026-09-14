import { z } from "zod";

export const setUserRolesSchema = z.object({
  userId: z.string().min(1).max(255),
  roleIds: z
    .array(z.string().uuid())
    .min(1)
    .max(20)
    .refine((ids) => new Set(ids).size === ids.length, {
      message: "Duplicate roles are not allowed.",
    }),
});
