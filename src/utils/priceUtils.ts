// export const calculateFinalPrice = (originalPrice: number, offer: number): number => {
//   if (!originalPrice || !offer) return originalPrice;
//   const discounted = originalPrice - (originalPrice * offer) / 100;
//   return parseFloat(discounted.toFixed(2)); // returns price up to 2 decimals
// };
export const calculateFinalPrice = (
  originalPrice: number,
  offer: number
): number => {
  const price = Number(originalPrice) || 0;
  const discount = Number(offer) || 0;

  if (price <= 0) return 0;

  const safeOffer = Math.min(Math.max(discount, 0), 100);
  const finalPrice = price - (price * safeOffer) / 100;

  return Math.max(0, Math.round(finalPrice));
};
