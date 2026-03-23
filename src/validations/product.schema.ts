// import { z } from "zod";

// // Variant attribute schema
// const attributeSchema = z.object({
//   key: z.string().min(1, "Attribute key is required"),
//   value: z.string().min(1, "Attribute value is required"),
// });

// // Variant schema
// // const variantSchema = z.object({
// //   sku: z.string().min(1, "Variant SKU is required"),

// //   // price: z.coerce
// //   //   .number()
// //   //   .min(1, "Price must be greater than 0"),

// //   // sellingPrice: z.coerce
// //   //   .number()
// //   //   .min(1, "Selling price must be greater than 0"),

// //   // stock: z.coerce
// //   //   .number()
// //   //   .min(0, "Stock must be at least 0"),

// //   // offer: z.coerce
// //   //   .number()
// //   //   .min(0)
// //   //   .max(100)
// //   //   .optional(),

// //   price: z.coerce
// //   .number()
// //   .min(1, "Price must be greater than 0")
// //   .optional(),

// // sellingPrice: z.coerce
// //   .number()
// //   .min(1, "Selling price must be greater than 0")
// //   .optional(),

// // stock: z.coerce
// //   .number()
// //   .min(0, "Stock must be at least 0")
// //   .optional(),
// //  offer: z.coerce
// //     .number()
// //     .min(0)
// //     .max(100)
// //     .optional(),
// //   attributes: z.array(attributeSchema).min(1, "At least one attribute is required"),
// // });

// const variantSchema = z.object({
//   sku: z.string().min(1, "Variant SKU is required"),

//   // price: z.coerce.number().min(1, "Price must be greater than 0"),
//   price: z
//   .union([z.string(), z.number(), z.undefined()])
//   .transform((val) =>
//     val === "" || val === undefined ? undefined : Number(val)
//   )
//   .refine((val) => val === undefined || val > 0, {
//     message: "Price must be greater than 0",
//   }),

//   // sellingPrice: z.coerce.number().min(1, "Selling price must be greater than 0"),
//   sellingPrice: z
//   .union([z.string(), z.number(), z.undefined()])
//   .transform((val) =>
//     val === "" || val === undefined ? undefined : Number(val)
//   )
//   .refine((val) => val === undefined || val > 0, {
//     message: "Selling price must be greater than 0",
//   }),

//   // stock: z.coerce.number().min(0, "Stock must be at least 0"),
//   stock: z
//   .union([z.string(), z.number(), z.undefined()])
//   .transform((val) =>
//     val === "" || val === undefined ? undefined : Number(val)
//   )
//   .refine((val) => val === undefined || val >= 0, {
//     message: "Stock must be at least 0",
//   }),

//   // offer: z.coerce.number().min(0).max(100).optional(),
//   offer: z
//   .number()
//   .min(0, "Offer cannot be negative")
//   .max(100, "Offer cannot exceed 100")
//   .optional(),

//   attributes: z.array(attributeSchema).min(1, "At least one attribute is required"),
// });
// // Base product schema without conditional validation
// const baseProductSchema = z.object({
//   name: z.string().min(3, "Product name must be at least 3 characters"),
//   skuCode: z.string().min(1, "SKU code is required"),
//   material: z.string().min(1, "Material is required"),
//   description: z.string().min(10, "Description must be at least 10 characters"),
//   categoryId: z.string().min(1, "Category is required"),
//   subCategoryId: z.string().optional(),
//   childSubCategoryId: z.string().optional(),
  
//   // Dimensions
//   // length: z.string().min(1, "Length is required"),
//   // width: z.string().min(1, "Width is required"),
//   // height: z.string().min(1, "Height is required"),
//   // weight: z.string().min(1, "Weight is required"),
//   length: z
//   .string()
//   .min(1, "Length is required")
//   .regex(/^\d+(\.\d+)?$/, "Length must be a number"),

// width: z
//   .string()
//   .min(1, "Width is required")
//   .regex(/^\d+(\.\d+)?$/, "Width must be a number"),

// height: z
//   .string()
//   .min(1, "Height is required")
//   .regex(/^\d+(\.\d+)?$/, "Height must be a number"),

// weight: z
//   .string()
//   .min(1, "Weight is required")
//   .regex(/^\d+(\.\d+)?$/, "Weight must be a number"),
//   weightUnit: z.enum(["kg", "g"]),
  
//   // Pricing - conditional validation will be applied in the main schema
//   // originalPrice: z.string().optional(),
//   // offer: z.string().optional(),
//   // price: z.string().optional(),
//   // stock: z.string().optional(),
//   originalPrice:
//   z.number({ message: "Original price must be a number" })
//   .positive("Original price must be greater than 0")
//   .optional(),

// offer:z
//   .number({ message: "Offer must be a number" })
//   .min(0, "Offer cannot be negative")
//   .max(100, "Offer cannot exceed 100")
//   .optional(),

// price:z
//   .number({ message: "Price must be a number" })
//   .positive("Price must be greater than 0")
//   .optional(),

// stock:z
//   .number({ message: "Stock must be a number" })
//   .min(0, "Stock cannot be negative")
//   .optional(),
  
//   // Policies
//   returnPolicy: z.string().optional(),
//   warrantyInfo: z.string().optional(),
  
//   // Other
//   keywords: z.array(z.string()),
//   shippingAvailable: z.boolean(),
  
//   // Variants
//   hasVariants: z.boolean(),
//   variants: z.array(variantSchema).optional(),
// });

// // Main product schema with conditional validation
// // export const productSchema = baseProductSchema.superRefine((data, ctx) => {
// //   // If hasVariants is true, validate variants
// //   if (data.hasVariants) {
// //     // Check if variants exist and have at least one item
// //     if (!data.variants || data.variants.length === 0) {
// //       ctx.addIssue({
// //         code: z.ZodIssueCode.custom,
// //         path: ["variants"],
// //         message: "At least one variant is required when variants are enabled",
// //       });
// //       return;
// //     }

// //     // Validate each variant has required fields
// //     data.variants.forEach((variant, index) => {
// //       if (!variant.sku) {
// //         ctx.addIssue({
// //           code: z.ZodIssueCode.custom,
// //           // path: [`variants.${index}.sku`],
// //           path: ["variants", index, "sku"],
// //           message: "Variant SKU is required",
// //         });
// //       }
      
// //       if (variant.price <= 0) {
// //         ctx.addIssue({
// //           code: z.ZodIssueCode.custom,
// //           path: [`variants.${index}.price`],
// //           message: "Variant price must be greater than 0",
// //         });
// //       }
      
// //       if (variant.stock < 0) {
// //         ctx.addIssue({
// //           code: z.ZodIssueCode.custom,
// //           path: [`variants.${index}.stock`],
// //           message: "Variant stock cannot be negative",
// //         });
// //       }
      
// //       // Check if at least one attribute has both key and value
// //       const validAttributes = variant.attributes.filter(
// //         attr => attr.key && attr.value
// //       );
      
// //       if (validAttributes.length === 0) {
// //         ctx.addIssue({
// //           code: z.ZodIssueCode.custom,
// //           path: [`variants.${index}.attributes`],
// //           message: "At least one complete attribute (key and value) is required",
// //         });
// //       }
// //     });
// //   } 
// //   // If hasVariants is false, validate regular pricing fields
// //   else {
// //     if (!data.originalPrice || Number(data.originalPrice) <= 0) {
// //       ctx.addIssue({
// //         code: z.ZodIssueCode.custom,
// //         path: ["originalPrice"],
// //         message: "Original price is required and must be greater than 0",
// //       });
// //     }
    
// //     if (!data.stock || Number(data.stock) < 0) {
// //       ctx.addIssue({
// //         code: z.ZodIssueCode.custom,
// //         path: ["stock"],
// //         message: "Stock is required and cannot be negative",
// //       });
// //     }
// //   }
// // });

// export const productSchema = baseProductSchema.superRefine((data, ctx) => {

//   if (data.hasVariants) {

//     if (!data.variants || data.variants.length === 0) {
//       ctx.addIssue({
//         code: "custom",
//         path: ["variants"],
//         message: "At least one variant is required when variants are enabled",
//       });
//       return;
//     }

//     data.variants.forEach((variant, index) => {

//       if (!variant.sku) {
//         ctx.addIssue({
//           code: "custom",
//           path: ["variants", index, "sku"],
//           message: "Variant SKU is required",
//         });
//       }

//       // if (variant.price <= 0)
//         if (variant.price === undefined || variant.price <= 0) {
//         ctx.addIssue({
//           code: "custom",
//           path: ["variants", index, "price"],
//           message: "Variant price must be greater than 0",
//         });
//       }

//       if (variant.stock < 0) {
//         ctx.addIssue({
//           code: "custom",
//           path: ["variants", index, "stock"],
//           message: "Variant stock cannot be negative",
//         });
//       }

//       const validAttributes = variant.attributes.filter(
//         attr => attr.key && attr.value
//       );

//       if (validAttributes.length === 0) {
//         ctx.addIssue({
//           code: "custom",
//           path: ["variants", index, "attributes"],
//           message: "At least one complete attribute is required",
//         });
//       }

//     });

//   } 
//   else {

//     if (!data.originalPrice || data.originalPrice <= 0) {
//       ctx.addIssue({
//         code: "custom",
//         path: ["originalPrice"],
//         message: "Original price is required and must be greater than 0",
//       });
//     }

//     if (data.stock === undefined || data.stock < 0) {
//       ctx.addIssue({
//         code: "custom",
//         path: ["stock"],
//         message: "Stock is required and cannot be negative",
//       });
//     }

//   }

// });

// // Type inference
// export type ProductFormData = z.infer<typeof productSchema>;

// import { z } from "zod";

// /* -------------------- HELPERS -------------------- */

// // convert "" → undefined → number
// const numberField = (fieldName: string) =>
//   z.preprocess(
//     (val) => (val === "" || val === null ? undefined : Number(val)),
//     z
//       .number({ invalid_type_error: `${fieldName} must be a number` })
//       .optional()
//   );

// /* -------------------- ATTRIBUTE -------------------- */

// const attributeSchema = z.object({
//   key: z.string().min(1, "Attribute key is required"),
//   value: z.string().min(1, "Attribute value is required"),
// });

// /* -------------------- VARIANT -------------------- */

// const variantSchema = z.object({
//   sku: z.string().min(1, "Variant SKU is required"),

//   price: numberField("Price").refine(
//     (v) => v !== undefined && v > 0,
//     "Price must be greater than 0"
//   ),

//   sellingPrice: numberField("Selling price").optional(),

//   stock: numberField("Stock").refine(
//     (v) => v !== undefined && v >= 0,
//     "Stock must be at least 0"
//   ),

//   offer: numberField("Offer")
//     .refine((v) => v === undefined || (v >= 0 && v <= 100), {
//       message: "Offer must be between 0-100",
//     })
//     .optional(),

//   attributes: z
//     .array(attributeSchema)
//     .min(1, "At least one attribute is required"),
// });

// /* -------------------- BASE PRODUCT -------------------- */

// const baseProductSchema = z.object({
//   name: z.string().min(3),
//   skuCode: z.string().min(1),
//   material: z.string().min(1),
//   description: z.string().min(10),

//   categoryId: z.string().min(1),
//   subCategoryId: z.string().optional(),
//   childSubCategoryId: z.string().optional(),

//   /* Dimensions */
//   length: z.string().regex(/^\d+(\.\d+)?$/, "Length must be number"),
//   width: z.string().regex(/^\d+(\.\d+)?$/, "Width must be number"),
//   height: z.string().regex(/^\d+(\.\d+)?$/, "Height must be number"),
//   weight: z.string().regex(/^\d+(\.\d+)?$/, "Weight must be number"),

//   weightUnit: z.enum(["kg", "g"]),

//   /* Pricing (NON-VARIANT) */
//   originalPrice: numberField("Original price"),
//   price: numberField("Price"),
//   stock: numberField("Stock"),
//   offer: numberField("Offer"),

//   /* Others */
//   returnPolicy: z.string().optional(),
//   warrantyInfo: z.string().optional(),

//   keywords: z.array(z.string()),
//   shippingAvailable: z.boolean(),

//   hasVariants: z.boolean(),
//   variants: z.array(variantSchema).optional(),
// });

// /* -------------------- FINAL SCHEMA -------------------- */

// export const productSchema = baseProductSchema.superRefine((data, ctx) => {
  
//   /* ================= VARIANT PRODUCT ================= */
//   if (data.hasVariants) {
//     if (!data.variants || data.variants.length === 0) {
//       ctx.addIssue({
//         code: "custom",
//         path: ["variants"],
//         message: "At least one variant is required",
//       });
//       return;
//     }

//     data.variants.forEach((v, i) => {
//       if (!v.price || v.price <= 0) {
//         ctx.addIssue({
//           code: "custom",
//           path: ["variants", i, "price"],
//           message: "Price must be greater than 0",
//         });
//       }

//       if (v.stock === undefined || v.stock < 0) {
//         ctx.addIssue({
//           code: "custom",
//           path: ["variants", i, "stock"],
//           message: "Stock must be >= 0",
//         });
//       }
//     });
//   }

//   /* ================= SIMPLE PRODUCT ================= */
//   else {
//     if (!data.originalPrice || data.originalPrice <= 0) {
//       ctx.addIssue({
//         code: "custom",
//         path: ["originalPrice"],
//         message: "Original price is required",
//       });
//     }

//     if (data.stock === undefined || data.stock < 0) {
//       ctx.addIssue({
//         code: "custom",
//         path: ["stock"],
//         message: "Stock is required",
//       });
//     }
//   }
// });

// /* -------------------- TYPES -------------------- */

// export type ProductFormData = z.infer<typeof productSchema>;




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

// const variantSchema = z.object({
//   sku: z.string().min(1, "Variant SKU is required"),
  
//   // price: z.preprocess(
//   //   (val) => parseNumber(val),
//   //   z.number("Price must be a number")
//   //     .min(0.01, "Price must be greater than 0")
//   //     .optional()
//   // ),
//   price: z.preprocess(
//   parseNumber,
//   z.number().min(0.01, "Price must be greater than 0")
// ).optional(),
  
//   sellingPrice: z.preprocess(
//     (val) => parseNumber(val),
//     z.number("Selling price must be a number")
//       .optional()
//   ),
  
//   stock: z.preprocess(
//     (val) => parseNumber(val),
//     z.number("Stock must be a number" )
//       .min(0, "Stock must be at least 0")
//       .optional()
//   ),
  
//   offer: z.preprocess(
//     (val) => parseNumber(val),
//     z.number("Offer must be a number")
//       .min(0, "Offer must be at least 0")
//       .max(100, "Offer cannot exceed 100")
//       .optional()
//   ),
  
//   attributes: z.array(attributeSchema).min(1, "At least one attribute is required"),
// });



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

  /* Dimensions */
  length: z.string().regex(/^\d+(\.\d+)?$/, "Length must be a valid number"),
  width: z.string().regex(/^\d+(\.\d+)?$/, "Width must be a valid number"),
  height: z.string().regex(/^\d+(\.\d+)?$/, "Height must be a valid number"),
  weight: z.string().regex(/^\d+(\.\d+)?$/, "Weight must be a valid number"),
  weightUnit: z.enum(["kg", "g"]),

  /* Pricing Fields */
  // originalPrice: z.preprocess(
  //   (val) => parseNumber(val),
  //   z.number({ invalid_type_error: "Original price must be a number" }).optional()
  // ),

//   originalPrice: z.preprocess(
//   (val) => parseNumber(val),
//   z.union([z.number(), z.undefined()])
// ),

  
  // price: z.preprocess(
  //   (val) => parseNumber(val),
  //   z.number("Price must be a number").optional()
  // ),
  
  // stock: z.preprocess(
  //   (val) => parseNumber(val),
  //   z.number({ invalid_type_error: "Stock must be a number" }).optional()
  // ),
  
  // offer: z.preprocess(
  //   (val) => parseNumber(val),
  //   z.number({ invalid_type_error: "Offer must be a number" })
  //     .min(0, "Offer must be at least 0")
  //     .max(100, "Offer cannot exceed 100")
  //     .optional()
  // ),

//   price: z.preprocess(
//   parseNumber,
//   z.union([z.number(), z.undefined()])
// ),

// stock: z.preprocess(
//   parseNumber,
//   z.union([z.number(), z.undefined()])
// ),

// offer: z.preprocess(
//   parseNumber,
//   z.union([z.number().min(0).max(100), z.undefined()])
// ),


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