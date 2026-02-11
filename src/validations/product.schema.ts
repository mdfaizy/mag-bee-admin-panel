// import { z } from "zod";

// const imageSchema = z
//   .custom<File>()
//   .refine((file) => file instanceof File, "Image is required")
//   .refine(
//     (file) =>
//       ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
//     "Only JPG, PNG images allowed"
//   )
//   .refine(
//     (file) => file.size <= 2 * 1024 * 1024,
//     "Image size must be less than 2MB"
//   );

// const variantSchema = z.object({
//   sku: z.string().min(3, "SKU required"),
//   price: z.coerce.number().positive("Price must be > 0"),
//   sellingPrice: z.coerce.number().positive("Selling price must be > 0"),
//   stock: z.coerce.number().int().min(0),
//   attributes: z
//     .array(
//       z.object({
//         key: z.string().min(1),
//         value: z.string().min(1),
//       })
//     )
//     .min(1),
// });

// export const createProductSchema = z
//   .object({
    // name: z
    // .string()
    // .min(2, "Product name must be at least 2 characters")
    // .max(30, "Product name must not exceed 30 characters"),
//     categoryId: z.string().min(1, "Category required"),
    // description: z
    // .string()
    // .min(5, "Description must be at least 5 characters")
    // .max(500, "Description must not exceed 500 characters"),

//     skuCode: z.string().optional(),
//     material: z.string().optional(),

//     originalPrice: z.coerce.number().positive().optional(),
//     offer: z.coerce.number().min(0).max(100).optional(),
//     stock: z.coerce.number().int().min(0).optional(),

//     length: z.coerce.number().positive().optional(),
//     width: z.coerce.number().positive().optional(),
//     height: z.coerce.number().positive().optional(),
//     weight: z.coerce.number().positive().optional(),

//     weightUnit: z.enum(["kg", "g"]),

//     shippingAvailable: z.boolean(),

//     images: z.array(imageSchema).min(1, "At least one image required"),

//     variants: z.array(variantSchema).optional(),

//     hasVariants: z.boolean(),
//   })
//   .refine(
//     (data) =>
//       data.hasVariants ||
//       (data.originalPrice !== undefined && data.stock !== undefined),
//     {
//       message: "Price & stock required when variants are disabled",
//       path: ["originalPrice"],
//     }
//   );


import { z } from "zod";

/* ---------------- IMAGE ---------------- */

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const imageSchema = z
  .custom<File>((file) => file instanceof File, {
    message: "Invalid image file",
  })
  .refine(
    (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
    "Only JPG, JPEG, PNG images are allowed"
  )
  .refine(
    (file) => file.size <= MAX_IMAGE_SIZE,
    "Image size must be less than 2MB"
  );

const variantSchema = z
  .object({
    sku: z.string().min(3),
    price: z.coerce.number().positive(),
    sellingPrice: z.coerce.number().positive(),
    stock: z.coerce.number().int().min(0),
    attributes: z.array(
      z.object({
        key: z.string().min(1),
        value: z.string().min(1),
      })
    ).min(1),
  })
  .refine(
    (v) => v.sellingPrice <= v.price,
    {
      message: "Selling price cannot be greater than MRP",
      path: ["sellingPrice"],
    }
  );


export const createProductSchema = z
  .object({
    name: z
      .string()
      .min(2, "Product name must be at least 2 characters")
      .max(30, "Product name must not exceed 30 characters"),

    categoryId: z.string().min(1, "Category is required"),

    description: z
      .string()
      .min(5, "Description must be at least 5 characters")
      .max(500, "Description must not exceed 500 characters"),

    skuCode: z.string().max(50).optional(),
    material: z.string().max(100).optional(),

    originalPrice: z.coerce.number().positive().optional(),
    offer: z.coerce.number().min(0).max(90).optional(),
    stock: z.coerce.number().int().min(0).optional(),

    length: z.coerce.number().positive().optional(),
    width: z.coerce.number().positive().optional(),
    height: z.coerce.number().positive().optional(),
    weight: z.coerce.number().positive().optional(),
    weightUnit: z.enum(["kg", "g"]).default("kg"),

    shippingAvailable: z.boolean(),
    hasVariants: z.boolean(),

    images: z
      .array(imageSchema)
      .min(1, "At least one image is required")
      .max(5, "Maximum 5 images allowed"),

    variants: z.array(variantSchema).optional(),
  })
  .superRefine((data, ctx) => {
    /* ---------------- NON VARIANT PRODUCT ---------------- */
    if (!data.hasVariants) {
      if (data.originalPrice === undefined) {
        ctx.addIssue({
          path: ["originalPrice"],
          message: "Original price is required",
          code: z.ZodIssueCode.custom,
        });
      }

      if (data.stock === undefined) {
        ctx.addIssue({
          path: ["stock"],
          message: "Stock is required",
          code: z.ZodIssueCode.custom,
        });
      }
    }

    /* ---------------- VARIANT PRODUCT ---------------- */
    if (data.hasVariants) {
      if (!data.variants || data.variants.length === 0) {
        ctx.addIssue({
          path: ["variants"],
          message: "At least one variant is required",
          code: z.ZodIssueCode.custom,
        });
        return;
      }

      // 🔥 validate each variant ONLY when hasVariants = true
      data.variants.forEach((variant, index) => {
        if (variant.sellingPrice > variant.price) {
          ctx.addIssue({
            path: ["variants", index, "sellingPrice"],
            message: "Selling price cannot be greater than MRP",
            code: z.ZodIssueCode.custom,
          });
        }
      });

      // prevent mixed pricing
      if (data.originalPrice !== undefined) {
        ctx.addIssue({
          path: ["originalPrice"],
          message: "Original price is not allowed when variants exist",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });
