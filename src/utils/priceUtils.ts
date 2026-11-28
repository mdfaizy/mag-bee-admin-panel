// ✅ 1. Offer % calculate (original + final)
export const calculateOfferPercentage = (
  originalPrice: number,
  finalPrice: number
): number => {
  if (!Number.isFinite(originalPrice) || originalPrice <= 0) return 0;
  if (!Number.isFinite(finalPrice) || finalPrice < 0) return 0;
  if (finalPrice >= originalPrice) return 0;

  return Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
};

// ✅ 2. Final price calculate (original + offer)
export const calculateFinalPrice = (
  originalPrice: number,
  offer: number
): number => {
  if (!Number.isFinite(originalPrice) || originalPrice <= 0) return 0;
  if (!Number.isFinite(offer) || offer < 0) return originalPrice;

  return Math.round(originalPrice - (originalPrice * offer) / 100);
};

// ✅ 3. Safe number parser (VERY IMPORTANT 🔥)
export const parseNumber = (v: any): number => {
  const num = Number(v);
  return isNaN(num) ? 0 : num;
};