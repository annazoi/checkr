import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters.")
  .max(30, "Username must be 30 characters or fewer.")
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores.");

export const registerSchema = z.object({
  username: usernameSchema,
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  ageConfirmed: z.literal(true, {
    errorMap: () => ({ message: "You must confirm you are at least 13 years old." }),
  }),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const reportTypeValues = [
  "no_issue",
  "suspicious",
  "malware",
  "suspicious_installer",
  "fake_content",
  "dangerous_redirect",
  "unexpected_software",
  "antivirus_warning",
  "other",
] as const;

export const createSourceSchema = z.object({
  gameSlug: z.string().min(1),
  domain: z
    .string()
    .trim()
    .min(3, "Enter the site or store you visited.")
    .max(255)
    .transform((value) => value.toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "")),
});
export type CreateSourceInput = z.infer<typeof createSourceSchema>;

export const createReportSchema = z.object({
  gameSourceId: z.string().uuid(),
  reportType: z.enum(reportTypeValues),
  confidenceLevel: z.enum(["low", "medium", "high"]).optional().default("medium"),
  description: z.string().max(500).optional(),
  evidenceId: z.string().uuid().optional(),
});
export type CreateReportInput = z.infer<typeof createReportSchema>;
