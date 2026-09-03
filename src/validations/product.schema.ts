import { z } from "zod";

/* -------------------- HELPERS -------------------- */

// Helper to parse number fields
const parseNumber = (val: unknown): number | undefined => {
  if (val === "" || val === null || val === undefined) return undefined;
  const num = Number(val);
  return isNaN(num) ? undefined : num;
};

/* -------------------- ATTRIBUTE SCHEMA -------------------- */

const attributeSchema = z.object({
  key: z.string().min(1, "Attribute key is required"),
  value: z.string().min(1, "Attribute value is required"),
});

/* -------------------- VARIANT SCHEMA -------------------- */

const variantSchema = z.object({
  sku: z.string().min(1, "Variant SKU is required"),

  price: z.number().min(0.01, "Price must be greater than 0").optional(),

  sellingPrice: z.number().optional(),

  stock: z.number().min(0, "Stock must be at least 0").optional(),

  offer: z.number().min(0).max(100).optional(),

  attributes: z.array(attributeSchema).min(1, "At least one attribute is required"),
});


/* -------------------- BASE PRODUCT SCHEMA -------------------- */

const baseProductSchema = z.object({
  // Required fields
  name: z.string().min(3, "Product name must be at least 3 characters"),
  skuCode: z.string().min(1, "SKU code is required"),
  material: z.string().min(1, "Material is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryId: z.string().min(1, "Category is required"),
  
  // Optional fields
  subCategoryId: z.string().optional(),
  childSubCategoryId: z.string().optional(),
packQuantity: z.preprocess(
  (val) => {
    if (val === "" || val === undefined || val === null) return undefined;
    return Number(val);
  },
  z.number().min(1, "Pack quantity must be at least 1").optional()
),
  /* Dimensions */
  length: z.string().regex(/^\d+(\.\d+)?$/, "Length must be a valid number"),
  width: z.string().regex(/^\d+(\.\d+)?$/, "Width must be a valid number"),
  height: z.string().regex(/^\d+(\.\d+)?$/, "Height must be a valid number"),
  weight: z.string().regex(/^\d+(\.\d+)?$/, "Weight must be a valid number"),
  weightUnit: z.enum(["kg", "g"]),
/* Pricing Fields */
originalPrice: z.preprocess(
  (val) => parseNumber(val),
  z.number().optional()  // <-- YEH CHANGE KARO
),

price: z.preprocess(
  parseNumber,
  z.number().optional()  // <-- YEH CHANGE KARO
),

stock: z.preprocess(
  parseNumber,
  z.number().optional()  // <-- YEH CHANGE KARO
),

offer: z.preprocess(
  parseNumber,
  z.number().min(0).max(100).optional()  // <-- YEH CHANGE KARO
),
  /* Others */
  returnPolicy: z.string().optional(),
  warrantyInfo: z.string().optional(),
  keywords: z.array(z.string()),
  
  shippingAvailable: z.preprocess(
    (val) => val === "true" || val === true,
    z.boolean()
  ),

  hasVariants: z.preprocess(
    (val) => val === "true" || val === true,
    z.boolean()
  ),
  
  variants: z.array(variantSchema).optional(),
});

/* -------------------- FINAL SCHEMA WITH CONDITIONAL VALIDATION -------------------- */

export const productSchema = baseProductSchema.superRefine((data, ctx) => {
  
  /* ================= VARIANT PRODUCT ================= */
  if (data.hasVariants) {
    if (!data.variants || data.variants.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["variants"],
        message: "At least one variant is required when variants are enabled",
      });
      return;
    }

    data.variants.forEach((variant, index) => {
      if (!variant.sku || variant.sku.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["variants", index, "sku"],
          message: "Variant SKU is required",
        });
      }

      if (variant.price === undefined || variant.price <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["variants", index, "price"],
          message: "Variant price must be greater than 0",
        });
      }

      if (variant.stock === undefined || variant.stock < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["variants", index, "stock"],
          message: "Variant stock must be at least 0",
        });
      }

      const validAttributes = variant.attributes.filter(
        attr => attr.key && attr.key.trim() !== "" && attr.value && attr.value.trim() !== ""
      );

      if (validAttributes.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["variants", index, "attributes"],
          message: "At least one complete attribute is required",
        });
      }
    });
  } 
  
  /* ================= SIMPLE PRODUCT ================= */
  else {
    if (data.originalPrice === undefined || data.originalPrice <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["originalPrice"],
        message: "Original price is required and must be greater than 0",
      });
    }

    if (data.stock === undefined || data.stock < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["stock"],
        message: "Stock is required and cannot be negative",
      });
    }

    if (data.offer !== undefined && (data.offer < 0 || data.offer > 100)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["offer"],
        message: "Offer must be between 0 and 100",
      });
    }
  }
});

export type ProductFormData = z.infer<typeof productSchema>;