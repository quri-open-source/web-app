import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { Cart, CartItem } from '../../model/cart.entity';
import { DiscountPolicyService } from '../../services/discount-policy.service';
import { CartDiscountAssembler, CartWithDiscount } from '../../services/cart-discount.assembler';

@Component({
  selector: 'app-shopping-cart-popover',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './shopping-cart-popover.component.html',
  styleUrls: ['./shopping-cart-popover.component.css']
})
export class ShoppingCartPopoverComponent implements OnInit {
  cart: Cart | null = null;
  cartWithDiscount: CartWithDiscount | null = null;
  environment = environment;
  projects: any[] = [];
  discountPolicies: any[] = [];

  constructor(
    private cartService: CartService,
    private discountPolicyService: DiscountPolicyService,
    private router: Router
  ) {}

  ngOnInit() {
    const userId = environment.devUser;
    this.cartService.getCartByUser(userId).subscribe((carts: Cart[]) => {
      this.cart = carts && carts.length > 0 ? this.restoreCartItemPrototypes(carts[0]) : null;
      if (this.cart && this.cart.items.length > 0) {
        fetch(`${environment.apiBaseUrl}/projects`)
          .then(res => res.json())
          .then((projects: any[]) => {
            this.projects = projects;
            this.cart!.items = this.cart!.items.map((item: CartItem) => {
              const project = projects.find((p: any) => p.id === item.project_id);
              const cartItem = Object.setPrototypeOf({
                ...item,
                projectImage: project ? project.preview_image_url : ''
              }, CartItem.prototype);
              return cartItem;
            });
            this.loadDiscountsAndAssemble();
          });
      } else {
        this.loadDiscountsAndAssemble();
      }
    });
  }

  loadDiscountsAndAssemble() {
    if (!this.cart) return;
    this.discountPolicyService.getDiscountPolicies().subscribe((policies: any[]) => {
      this.discountPolicies = policies;
      this.cartWithDiscount = CartDiscountAssembler.assemble(this.cart!, policies);
    });
  }

  get subtotal() {
    return this.cart ? this.cart.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0) : 0;
  }

  goToCart() {
    this.router.navigate(['/shopping-cart']);
  }

  increaseQuantity(item: CartItem) {
    if (!this.cart) return;
    item.quantity++;
    this.updateCartOnServer();
  }

  decreaseQuantity(item: CartItem) {
    if (!this.cart) return;
    if (item.quantity > 1) {
      item.quantity--;
      this.updateCartOnServer();
    }
  }

  private restoreCartItemPrototypes(cart: Cart) {
    if (!cart || !cart.items) return cart;
    cart.items = cart.items.map(item => Object.setPrototypeOf(item, CartItem.prototype));
    return cart;
  }

  updateCartOnServer() {
    if (!this.cart) return;
    this.cartService.updateCart(this.cart).subscribe((updatedCart: Cart) => {
      this.cart = this.restoreCartItemPrototypes(updatedCart);
      this.loadDiscountsAndAssemble();
    });
  }

  clearCart() {
    if (!this.cart) return;
    this.cartService.clearCart(this.cart).subscribe((updatedCart: Cart) => {
      this.cart = this.restoreCartItemPrototypes(updatedCart);
      this.loadDiscountsAndAssemble();
    });
  }

  removeAllItems() {
    if (!this.cart) return;
    this.cart.items = [];
    this.cartService.clearCart(this.cart).subscribe(cart => {
      this.cart = this.restoreCartItemPrototypes(cart);
      this.loadDiscountsAndAssemble();
    });
  }

  removeItem(item: any) {
    if (!this.cart) return;
    this.cart.items = this.cart.items.filter(i => i !== item);
    this.updateCartOnServer();
  }
}
