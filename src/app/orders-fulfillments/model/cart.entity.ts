export class CartItem {
  project_id: string = '';
  quantity: number = 1;
  unit_price: number = 0;
  projectImage: string = '';
  projectName?: string;
  projectDescription?: string;

  get subtotal(): number {
    return this.unit_price * this.quantity;
  }
}

export interface AppliedDiscount {
  id: string;
}

export class Cart {
  id: string = '';
  user_id: string = '';
  items: CartItem[] = [];
  applied_discounts?: AppliedDiscount[];
}
