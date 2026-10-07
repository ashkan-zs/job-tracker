import { z } from "zod";

// Zod schema
export const createApplicationSchema = z.object({
  company: z.string().trim().min(1),
  position: z.string().trim().min(1),
  status: z.enum(["applied", "interview", "rejected", "offer"]),
});

export const updateApplicationSchema = createApplicationSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

// Types
type CreateApplication = z.infer<typeof createApplicationSchema>;

export type Application = CreateApplication & {
  id: number;
};
