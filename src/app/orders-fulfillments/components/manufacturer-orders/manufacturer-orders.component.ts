import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { ManufacturerOrdersService, ManufacturerOrder } from '../../services/manufacturer-orders.service';

@Component({
  selector: 'app-manufacturer-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink
  ],
  templateUrl: './manufacturer-orders.component.html',
  styleUrls: ['./manufacturer-orders.component.css']
})
export class ManufacturerOrdersComponent implements OnInit {
  orders: ManufacturerOrder[] = [];
  loading = true;
  errorMessage = '';
  statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  
  private ordersService = inject(ManufacturerOrdersService);
  
  ngOnInit(): void {
    this.loadOrders();
  }
  
  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';
    this.orders = []; // Clear previous orders
    
    // Add a slight delay for better UX when reloading
    setTimeout(() => {
      this.ordersService.getManufacturerOrders().subscribe({
        next: (orders) => {
          console.log('Orders received in component:', orders);
          this.orders = orders;
          
          if (this.orders.length === 0) {
            this.errorMessage = 'No orders found for your account. New orders will appear here when received.';
          }
          
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading orders', err);
          this.errorMessage = 'Could not load orders. Please try again.';
          this.loading = false;
        }
      });
    }, 300); // Short delay for smoother transitions
  }
  
  updateOrderStatus(orderId: string, newStatus: string): void {
    // Set updating state for this order
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      // Could add a property like 'updating' to the order if we want to show a spinner
    }
    
    this.errorMessage = '';
    
    this.ordersService.updateFulfillmentStatus(orderId, newStatus).subscribe({
      next: (updatedFulfillment) => {
        // Find and update the local order with response data
        const orderIndex = this.orders.findIndex(o => o.id === orderId);
        if (orderIndex >= 0) {
          // Update the order status and shipped date using camelCase field from Fulfillment entity
          this.orders[orderIndex].status = updatedFulfillment.status;
          this.orders[orderIndex].shippedDate = updatedFulfillment.shippedDate;
          
          // Display success message briefly
          this.errorMessage = `Order status updated to ${updatedFulfillment.status}`;
          setTimeout(() => {
            if (this.errorMessage === `Order status updated to ${updatedFulfillment.status}`) {
              this.errorMessage = '';
            }
          }, 3000);
        }
      },
      error: (err) => {
        console.error('Error updating order status', err);
        this.errorMessage = 'Could not update the order status. Please try again.';
      }
    });
  }
  
  getStatusChipColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'accent';
      case 'processing':
        return 'primary';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'primary';
      case 'cancelled':
        return 'warn';
      default:
        return '';
    }
  }
}
