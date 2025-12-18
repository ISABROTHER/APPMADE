export const calculateTotalPrice = (
  basePrice: number,
  deliveryMethodCost: number
): number => {
  return basePrice + deliveryMethodCost;
};

export const formatPrice = (price: number): string => {
  return `${price} kr`;
};
