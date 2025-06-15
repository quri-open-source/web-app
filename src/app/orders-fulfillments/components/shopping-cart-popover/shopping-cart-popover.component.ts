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
    this.orderService.getOrdersByUser(userId).subscribe((orders: any[]) => {
      // Get all unique project_ids from all items in all orders
      const allItems = orders.flatMap((order: any) => order.items);
      const uniqueProjectIds = [...new Set(allItems.map((item: any) => item.project_id))];
      // Fetch all projects from the fake API
      fetch(`${environment.apiBaseUrl}/projects`)
        .then(res => res.json())
        .then((projects: any[]) => {
          this.discountPolicyService.getDiscountPolicies().subscribe(policies => {
            this.orders = orders.map((order: any) => {
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
              // Attach the correct project image to each item
              const items = order.items.map((item: any) => {
                const project = projects.find(p => p.id === item.project_id);
                return {
                  ...item,
                  projectImage: project ? project.preview_image_url : ''
                };
              });
              return { ...order, items, subtotal, discount, discountPolicy, total };
            });
          });
        });
    });
  }

  goToCart() {
    this.router.navigate(['/shopping-cart']);
  }
}
