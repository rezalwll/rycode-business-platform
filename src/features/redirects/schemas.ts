import { z } from "zod";

export const saveRedirectSchema = z.object({
  id: z.string().uuid().optional(),
  sourcePath: z.string().trim().min(1).max(500),
  destination: z.string().trim().min(1).max(1_000),
  statusCode: z.union([z.literal(301), z.literal(302), z.literal(307), z.literal(308)]),
  preserveQuery: z.boolean(),
  isActive: z.boolean(),
});
