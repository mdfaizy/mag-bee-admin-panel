export const calculateFinalPrice = (originalPrice: number, offer: number): number => {
  if (!originalPrice || !offer) return originalPrice;
  const discounted = originalPrice - (originalPrice * offer) / 100;
  return parseFloat(discounted.toFixed(2)); // returns price up to 2 decimals
};
