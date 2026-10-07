import { z } from "zod";

export const attributeSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
});

export const variantSchema = z.object({
  sku: z.string().min(3),

  price: z.number().min(1),

  sellingPrice: z.number().min(1),

  stock: z.number().min(0),

  attributes: z.array(attributeSchema),
});

export const productSchema = z.object({

  name: z.string().min(3),

  skuCode: z.string().min(3),

  material: z.string(),

  categoryId: z.string(),

  description: z.string().min(20),

  variantEnabled: z.boolean(),

  originalPrice: z.number().optional(),

  stock: z.number().optional(),

  variants: z.array(variantSchema).optional(),

});