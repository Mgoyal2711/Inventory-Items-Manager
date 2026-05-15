/** Stock status derived from quantity (mirrors backend logic). */
export function getStockStatus(quantity) {
  if (quantity === 0) return 'Out of Stock';
  if (quantity < 10) return 'Low Stock';
  return 'In Stock';
}

export const STATUS_DOT = {
  'In Stock': 'bg-green-600',
  'Low Stock': 'bg-amber-500',
  'Out of Stock': 'bg-red-600',
};
