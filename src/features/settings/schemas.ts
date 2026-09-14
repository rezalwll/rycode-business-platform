import { z } from "zod";

export const saveSiteSettingSchema = z.object({
  originalKey: z.string().min(1).max(120).optional(),
  key: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/u),
  value: z.json(),
  visibility: z.enum(["PUBLIC", "PRIVATE"]),
});
