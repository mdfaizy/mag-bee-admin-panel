import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email or Username is required"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormType = z.infer<typeof loginSchema>;


export const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name too long"),

  username: z
    .string()
    .min(4, "Username must be at least 4 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and underscore allowed"),

  mobileNo: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),

  roleId: z
    .string()
    .min(1, "Role is required"),

  email: z
    .string()
    .email("Invalid email format"),

  isChecked: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must agree to the Terms and Conditions",
    }),
});

export type SignupFormType = z.infer<typeof signupSchema>;