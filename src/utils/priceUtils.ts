// // export const calculateFinalPrice = (originalPrice: number, offer: number): number => {
// //   if (!originalPrice || !offer) return originalPrice;
// //   const discounted = originalPrice - (originalPrice * offer) / 100;
// //   return parseFloat(discounted.toFixed(2)); // returns price up to 2 decimals
// // };
// // export const calculateFinalPrice = (
// //   originalPrice: number,
// //   offer: number
// // ): number => {
// //   const price = Number(originalPrice) || 0;
// //   const discount = Number(offer) || 0;

// //   if (price <= 0) return 0;

// //   const safeOffer = Math.min(Math.max(discount, 0), 100);
// //   const finalPrice = price - (price * safeOffer) / 100;

// //   return Math.max(0, Math.round(finalPrice));
// // };

// export const calculateFinalPrice = (
//   originalPrice: number,
//   finalPrice: number
// ): number => {
//   const original = Number(originalPrice) || 0;
//   const final = Number(finalPrice) || 0;

//   if (original <= 0) return 0;
//   if (final >= original) return 0;

//   const discount = ((original - final) / original) * 100;

//   return Math.round(Math.max(0, discount));
// };

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