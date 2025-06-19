import { Component } from '@angular/core';
import { ManufacturerOrdersComponent } from '../../../orders-fulfillments/components/manufacturer-orders/manufacturer-orders.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-manufacturer-orders-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    ManufacturerOrdersComponent
  ],
  template: `
    <div class="page-container">
      <h1 class="page-title">Order Management</h1>
      <p class="page-description">
        View and manage all orders assigned to your manufacturing facility.
        Update order status, view details, and track progress of each order.
      </p>
      
      <app-manufacturer-orders></app-manufacturer-orders>
    </div>
  `,
  styles: `
    .page-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .page-title {
      font-size: 32px;
      font-weight: 500;
      margin-bottom: 16px;
      color: #333;
    }
    
    .page-description {
      font-size: 16px;
      color: #666;
      margin-bottom: 32px;
      max-width: 800px;
      line-height: 1.5;
    }
  `
})
export class ManufacturerOrdersPageComponent {}
