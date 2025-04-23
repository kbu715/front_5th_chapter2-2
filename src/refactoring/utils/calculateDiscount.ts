/**
 * 할인된 금액을 계산하는 유틸리티 함수
 * @param originalPrice - 원래 가격 (예: 10000)
 * @param rate - 할인율 (예: 0.2는 20% 할인)
 * @returns 할인 적용 후 금액
 */
export function calculateDiscountedPrice(
  originalPrice: number,
  rate: number
): number {
  return originalPrice * (1 - rate);
}
