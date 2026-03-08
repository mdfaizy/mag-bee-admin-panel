  import { z } from "zod";

/* ATTRIBUTE */

export const attributeSchema = z.object({
  key: z.string().trim().min(1, "Attribute key required").max(50),
  value: z.string().trim().min(1, "Attribute value required").max(100),
});

/* VARIANT */

export const variantSchema = z
  .object({
    sku: z.string().trim().min(3, "SKU min 3 characters"),

    price: z.coerce.number().positive("Price must be greater than 0"),

    sellingPrice: z.coerce.number().min(0),

    stock: z.coerce.number().int().min(0),

    offer: z.coerce.number().min(0).max(100).optional(),

    attributes: z.array(attributeSchema).min(1),
  })
  .superRefine((data, ctx) => {

    if (data.sellingPrice > data.price) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sellingPrice"],
        message: "Selling price cannot exceed price",
      });
    }

  });

/* PRODUCT */

export const productSchema = z
  .object({
    name: z.string().trim().min(3).max(200),

    skuCode: z.string().trim().min(3).max(50),

    material: z.string().trim().min(1),

    categoryId: z.coerce.number(),

    subCategoryId: z.coerce.number().optional(),
    childSubCategoryId: z.coerce.number().optional(),
    description: z.string().min(20).max(2000),

    hasVariants: z.coerce.boolean(),

    originalPrice: z.coerce.number().positive().optional(),

    stock: z.coerce.number().int().min(0).optional(),

    offer: z.coerce.number().min(0).max(100).optional(),

    length: z.coerce.number().positive(),

    width: z.coerce.number().positive(),

    height: z.coerce.number().positive(),

    weight: z.coerce.number().positive(),

    weightUnit: z.enum(["kg", "g"]),

    shippingAvailable: z.coerce.boolean(),

    isActive: z.coerce.boolean(),

    returnPolicy: z.string().min(1),

    warrantyInfo: z.string().optional(),

    variants: z.array(variantSchema).optional(),
  })

  .superRefine((data, ctx) => {

    if (data.hasVariants) {

      if (!data.variants || data.variants.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["variants"],
          message: "At least one variant required",
        });
      }

    } else {

      if (!data.originalPrice) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["originalPrice"],
          message: "Original price required",
        });
      }

    }

  });

  export type ProductFormData = z.infer<typeof productSchema>;