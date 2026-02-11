import { z } from "zod";

export const roleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Role name must be at least 3 characters")
    .max(30, "Role name cannot exceed 30 characters")
    .regex(/^[a-zA-Z0-9 ]+$/, "Only letters, numbers and spaces allowed"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description cannot exceed 200 characters"),
});

export type RoleFormValues = z.infer<typeof roleSchema>;



export const forgotPasswordFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
});

export type ForgotPasswordFormType = z.infer<
  typeof forgotPasswordFormSchema
>;


export const resetPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormType = z.infer<
  typeof resetPasswordFormSchema
>;
