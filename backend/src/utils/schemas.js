import { z } from "zod";

const passwordRules = z.string()
  .min(8, "Vault passkey must be at least 8 characters")
  .regex(/[A-Z]/, "Passkey requires at least one uppercase element")
  .regex(/[0-9]/, "Passkey requires at least one numeric digit")
  .regex(/[^A-Za-z0-9]/, "Passkey requires at least one special character symbol");

// AUTH SCHEMAS
export const registerSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid security mailbox format"),
  password: passwordRules,
});

export const loginSchema = z.object({
  email: z.string().email("Invalid security mailbox format"),
  password: z.string().min(8, "Invalid credentials"),
});

// RECORD SCHEMAS
export const recordSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(1, "Category is required"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  note: z.string().optional(),
});

export const updateRecordSchema = recordSchema.partial();

// USER SCHEMAS (ADMIN)
export const updateUserSchema = z.object({
  role: z.enum(["VIEWER", "ANALYST", "ADMIN"]).optional(),
  isActive: z.boolean().optional(),
});
