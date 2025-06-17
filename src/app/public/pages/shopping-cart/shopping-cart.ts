import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../../app/orders-fulfillments/services/cart.service';
import { DiscountPolicyService } from '../../../../app/orders-fulfillments/services/discount-policy.service';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { ProjectService } from '../../../../app/design-lab/services/project.service';
import { RouterModule } from '@angular/router';
import { CartDiscountAssembler, CartWithDiscount } from '../../../../app/orders-fulfillments/services/cart-discount.assembler';
import { Cart, CartItem } from '../../../../app/orders-fulfillments/model/cart.entity';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    RouterModule 
  ],
  templateUrl: './shopping-cart.html',
  styleUrl: './shopping-cart.css'
})
export class ShoppingCart implements OnInit {
  environment = environment;
  cart: Cart | null = null;
  cartWithDiscount: CartWithDiscount | null = null;
  loadingProjects = false;
  error: string | null = null;
  private projects: any[] = [];

  constructor(
    private cartService: CartService,
    private discountPolicyService: DiscountPolicyService,
    private projectService: ProjectService 
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
                projectName: project ? project.name : '',
                projectImage: project ? project.preview_image_url : '',
                projectDescription: project ? project.description || '' : '',
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
    this.discountPolicyService.getDiscountPolicies().subscribe(
      (policies) => {
        this.cartWithDiscount = CartDiscountAssembler.assemble(this.cart!, policies);
        this.loadingProjects = false;
        this.error = null;
      },
      () => {
        this.error = 'Failed to load discounts';
        this.loadingProjects = false;
      }
    );
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

  removeItem(item: CartItem) {
    if (!this.cart) return;
    this.cart.items = this.cart.items.filter(i => i !== item);
    this.updateCartOnServer();
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
      if (this.cart && this.cart.items.length > 0) {
        fetch(`${environment.apiBaseUrl}/projects`)
          .then(res => res.json())
          .then((projects: any[]) => {
            this.projects = projects;
            this.cart!.items = this.cart!.items.map((item: CartItem) => {
              const project = projects.find((p: any) => p.id === item.project_id);
              const cartItem = Object.setPrototypeOf({
                ...item,
                projectName: project ? project.name : '',
                projectImage: project ? project.preview_image_url : '',
                projectDescription: project ? project.description || '' : '',
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
}
