import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { RouterModule, Router } from '@angular/router';
import { CartDiscountAssembler, CartWithDiscount } from '../../../../app/orders-fulfillments/services/cart-discount.assembler';
import { Cart, CartItem } from '../../../../app/orders-fulfillments/model/cart.entity';
import { AuthenticationService } from '../../../iam/services/authentication.service';
import { Subscription } from 'rxjs';
import { OrderService, OrderResponse } from '../../../orders-fulfillments/services/order.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

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
    RouterModule,
    MatSnackBarModule
  ],
  templateUrl: './shopping-cart.html',
  styleUrl: './shopping-cart.css'
})
export class ShoppingCart implements OnInit, OnDestroy {
  environment = environment;
  cart: Cart | null = null;
  cartWithDiscount: CartWithDiscount | null = null;
  loadingProjects = false;
  error: string | null = null;
  private projects: any[] = [];
  private authService: AuthenticationService;
  private userSubscription: Subscription | null = null;
  currentUserId: string | null = null;

  constructor(
    private cartService: CartService,
    private discountPolicyService: DiscountPolicyService,
    private projectService: ProjectService,
    authService: AuthenticationService,
    private router: Router,
    private orderService: OrderService,
    private snackBar: MatSnackBar
  ) {
    this.authService = authService;
  }

  ngOnInit() {
    // Subscribe to authentication changes
    this.userSubscription = this.authService.isSignedIn.subscribe((isSignedIn: boolean) => {
      if (isSignedIn) {
        // Get current user ID from localStorage (set by IAM)
        const userId = localStorage.getItem('userId');
        if (userId) {
          this.currentUserId = userId;
          this.loadCartForUser(userId);
        }
      } else {
        this.currentUserId = null;
        this.cart = null;
        this.cartWithDiscount = null;
      }
    });

    this.cartService.getCartUpdates().subscribe((updatedCart) => {
      if (updatedCart && updatedCart.items.length > 0) {
        this.cart = this.restoreCartItemPrototypes(updatedCart);
        this.loadDiscountsAndAssemble();
      } else {
        this.cart = null;
        this.cartWithDiscount = null;
      }
    });
  }

  loadCartForUser(userId: string) {
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

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
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
    if (this.cart.items.length === 0) {
      this.cart = null;
      this.cartWithDiscount = null;
    }
  }

  private restoreCartItemPrototypes(cart: Cart) {
    if (!cart || !cart.items) return cart;
    cart.items = cart.items.map(item => Object.setPrototypeOf(item, CartItem.prototype));
    return cart;
  }

  updateCartOnServer() {
    if (!this.cart || !this.currentUserId) return;
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

  makeOrder() {
    if (!this.cartWithDiscount || !this.currentUserId) {
      this.snackBar.open('Cannot create order. Please check cart or login.', 'Close', { duration: 3000 });
      return;
    }

    // Create new order from cart
    const newOrder: Partial<OrderResponse> = {
      user_id: this.currentUserId,
      total_amount: this.cartWithDiscount.total,
      description: `Order ${new Date().toISOString()}`,
      status: 'pending',
      shipping_address: {
        address: '123 Main St',
        city: 'New York',
        country: 'USA',
        state: 'NY',
        zip: '10001'
      },
      items: this.cartWithDiscount.items.map(item => ({
        id: '',
        project_id: item.project_id,
        quantity: item.quantity,
        unit_price: item.unit_price
      })),
      applied_discounts: this.cartWithDiscount.discountPolicy
        ? [{ id: this.cartWithDiscount.discountPolicy.id }]
        : []
    };

    this.snackBar.open('Creating order...', '', { duration: 2000 });

    // Create order and navigate
    this.orderService.placeOrder(newOrder).subscribe({
      next: (response: OrderResponse) => {
        this.snackBar.open('Order created successfully!', 'Close', { duration: 2000 });

        // Clear the cart after successful order creation
        if (this.cart) {
          this.cartService.clearCart(this.cart).subscribe({
            next: () => {
              console.log('Cart cleared successfully');
              // Navigate to choose-manufacturer with orderId
              this.router.navigate(['/choose-manufacturer'], { queryParams: { orderId: response.id } });
            },
            error: (err) => {
              console.error('Error clearing cart:', err);
              // Still navigate even if cart clearing fails
              this.router.navigate(['/choose-manufacturer'], { queryParams: { orderId: response.id } });
            }
          });
        } else {
          this.router.navigate(['/choose-manufacturer'], { queryParams: { orderId: response.id } });
        }
      },
      error: (error) => {
        console.error('Error creating order:', error);
        this.snackBar.open('Error creating order. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }
}
