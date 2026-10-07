import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
];

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(30, "Category name must not exceed 30 characters"),

  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(300, "Description must not exceed 300 characters"),

  image: z
    .instanceof(File, { message: "Category image is required" })
    .refine(file => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only JPG, JPEG, PNG images are allowed",
    })
    .refine(file => file.size <= MAX_FILE_SIZE, {
      message: "Image size must be less than 2MB",
    }),
});

export type CreateCategoryForm = z.infer<typeof createCategorySchema>;
