import { Cart, CartItem, AppliedDiscount } from '../model/cart.entity';

export interface CartWithDiscount {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  discountPolicy?: any;
}

export class CartDiscountAssembler {
  static assemble(cart: Cart, policies: any[]): CartWithDiscount {
    const subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    let discount = 0;
    let discountPolicy = null;
    
    let appliedDiscountId: string | undefined = undefined;
    if (cart.applied_discounts && cart.applied_discounts.length > 0) {
      appliedDiscountId = cart.applied_discounts[0].id;
    }
    if (appliedDiscountId && policies && policies.length > 0) {
      discountPolicy = policies.find(p => p.id === appliedDiscountId);
      if (discountPolicy) {
        discount = subtotal * (discountPolicy.discount_percentage / 100);
      }
    }
    const total = subtotal - discount;
    return {
      items: cart.items,
      subtotal,
      discount,
      total,
      discountPolicy
    };
  }
}
