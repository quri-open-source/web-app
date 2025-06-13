import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { DiscountPolicyService } from '../../services/discount-policy.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-cart-popover',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './shopping-cart-popover.component.html',
  styleUrls: ['./shopping-cart-popover.component.css']
})
export class ShoppingCartPopoverComponent implements OnInit {
  orders: any[] = [];
  environment = environment;

  constructor(
    private orderService: OrderService,
    private discountPolicyService: DiscountPolicyService,
    private router: Router
  ) {}

  ngOnInit() {
    const userId = environment.devUser;
    this.orderService.getOrders().subscribe(orders => {
      const userOrders = orders.filter((o: any) => o.user_id === userId);
      this.discountPolicyService.getDiscountPolicies().subscribe(policies => {
        this.orders = userOrders.map((order: any) => {
          const subtotal = order.items.reduce((sum: number, item: any) => sum + item.unit_price * item.quantity, 0);
          let discount = 0;
          let discountPolicy = null;
          if (order.applied_discounts && order.applied_discounts.length > 0) {
            const discountId = order.applied_discounts[0].id;
            discountPolicy = policies.find((p: any) => p.id === discountId);
            if (discountPolicy) {
              discount = subtotal * (discountPolicy.discount_percentage / 100);
            }
          }
          const total = subtotal - discount;
          return { ...order, subtotal, discount, discountPolicy, total };
        });
      });
    });
  }

  goToCart() {
    this.router.navigate(['/shopping-cart']);
  }
}
