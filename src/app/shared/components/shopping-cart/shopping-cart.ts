import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { DiscountPolicyService } from '../../services/discount-policy.service';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { ProjectService } from '../../../design-lab/services/project.service';

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
    MatChipsModule
  ],
  templateUrl: './shopping-cart.html',
  styleUrl: './shopping-cart.css'
})
export class ShoppingCart implements OnInit {
  environment = environment;
  orders: any[] = [];
  loadingProjects = false;
  summarySubtotal = 0;
  summaryDiscount = 0;
  summaryTotal = 0;
  error: string | null = null;

  constructor(
    private orderService: OrderService,
    private discountPolicyService: DiscountPolicyService,
    private projectService: ProjectService // <-- inject ProjectService
  ) {}

  ngOnInit() {
    const userId = environment.devUser;
    this.orderService.getOrders().subscribe({
      next: orders => {
        const userOrders = orders.filter((o: any) => o.user_id === userId);
        this.discountPolicyService.getDiscountPolicies().subscribe({
          next: policies => {
            this.loadingProjects = true;
            const allItems = userOrders.flatMap((order: any) => order.items);
            const uniqueProjectIds = [...new Set(allItems.map((item: any) => item.project_id))];
            Promise.all(uniqueProjectIds.map(pid => this.projectService.getProjectById(pid).toPromise()))
              .then(projects => {
                const projectMap = Object.fromEntries(projects.map((p: any) => [p.id, p]));
                this.orders = userOrders.map((order: any) => {
                  const items = order.items.map((item: any) => {
                    const project = projectMap[item.project_id];
                    return {
                      ...item,
                      projectName: project?.name,
                      projectImage: project?.previewImageUrl,
                      projectDescription: project?.description || order.description || '',
                      unit_price: item.unit_price
                    };
                  });
                  const subtotal = items.reduce((sum: number, item: any) => sum + item.unit_price * item.quantity, 0);
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
                  return { ...order, items, subtotal, discount, discountPolicy, total };
                });
                // Calcular resumen global
                this.summarySubtotal = this.orders.reduce((sum, o) => sum + o.subtotal, 0);
                this.summaryDiscount = this.orders.reduce((sum, o) => sum + o.discount, 0);
                this.summaryTotal = this.orders.reduce((sum, o) => sum + o.total, 0) + 15;
                this.loadingProjects = false;
                this.error = null;
              })
              .catch(() => {
                this.error = 'Failed to load';
                this.loadingProjects = false;
              });
          },
          error: () => {
            this.error = 'Failed to load';
            this.loadingProjects = false;
          }
        });
      },
      error: () => {
        this.error = 'Failed to load';
        this.loadingProjects = false;
      }
    });
  }
}
