interface Variant {
  price?: number | string;
  sellingPrice?: number | string;
  offer?: number | string;
}

interface Product {
  price?: number | string;
  originalPrice?: number | string;
  offer?: number | string;
  variants?: Variant[];
}

export function getPriceDetails(product: Product, selectedVariant: Variant | null = null) {
  if (!product) return { displayPrice: 0, displayOriginalPrice: 0, offer: 0 };

  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
  const variant = selectedVariant || (hasVariants ? product.variants![0] : null);

  const displayPrice = variant
    ? Number(variant.sellingPrice ?? variant.price ?? 0)
    : Number(product.price ?? 0);

  const displayOriginalPrice = variant
    ? Number(variant.price ?? 0)
    : Number(product.originalPrice ?? 0);

  const offer = variant
    ? Number(variant.offer ?? 0)
    : Number(product.offer ?? 0);

  return {
    displayPrice,
    displayOriginalPrice,
    offer,
  };
}
