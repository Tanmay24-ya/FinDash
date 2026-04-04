import { z } from "zod";

// AUTH SCHEMAS
export const registerSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["VIEWER", "ANALYST", "ADMIN"]).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Invalid credentials"),
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
