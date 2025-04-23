import type { CartItem, Coupon } from "../../types";
import { calculateDiscountedPrice } from "../utils";

export const calculateItemTotal = (item: CartItem) => {
  const { product, quantity } = item;
  const maxDiscountRate = getMaxApplicableDiscount(item);

  return quantity * calculateDiscountedPrice(product.price, maxDiscountRate);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const { product, quantity } = item;

  const applicableDiscounts = product.discounts.filter((discount) => {
    return discount.quantity <= quantity;
  });

  return applicableDiscounts.reduce((max, currentDiscount) => {
    return Math.max(max, currentDiscount.rate);
  }, 0);
};

export const getCouponAppliedTotal = (amount: number, coupon: Coupon) => {
  if (coupon.discountType === "amount") {
    return Math.max(0, amount - coupon.discountValue);
  }

  if (coupon.discountType === "percentage") {
    return calculateDiscountedPrice(amount, coupon.discountValue / 100);
  }

  return amount;
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const totalBeforeDiscount = cart.reduce((acc, item) => {
    const { product, quantity } = item;
    return acc + quantity * product.price;
  }, 0);

  const totalAfterItemDiscount = cart.reduce((acc, item) => {
    return acc + calculateItemTotal(item);
  }, 0);

  const totalAfterDiscount = selectedCoupon
    ? getCouponAppliedTotal(totalAfterItemDiscount, selectedCoupon)
    : totalAfterItemDiscount;

  const totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount,
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  if (newQuantity === 0) {
    return cart.filter((item) => item.product.id !== productId);
  }

  return cart.map((item) => {
    return item.product.id === productId
      ? {
          ...item,
          quantity:
            item.product.stock >= newQuantity
              ? newQuantity
              : item.product.stock,
        }
      : item;
  });
};
