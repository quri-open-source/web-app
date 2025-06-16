import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, forkJoin, of, from, switchMap, mergeMap, catchError, tap, filter } from 'rxjs';
import { BaseService } from '../../access-security/services/access.service';
import { UserService } from '../../user-management/services/user.service';
import { FulfillmentService } from './fulfillment.service';
import { OrderService } from './order.service';
import { Fulfillment } from '../model/fulfillment.entity';
import { environment } from '../../../environments/environment';

export interface ManufacturerOrder {
  id: string;
  orderId: string;
  status: string;
  receivedDate: string;
  shippedDate: string | null;
  customerName: string;
  customerAddress: string;
  items: {
    id: string;
    projectId: string;
    projectName: string;
    previewImageUrl: string;
    quantity: number;
    unitPrice: number;
  }[];
  totalAmount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ManufacturerOrdersService {
  private userService = inject(UserService);
  private fulfillmentService = inject(FulfillmentService);
  private orderService = inject(OrderService);
  private http = inject(HttpClient);

  /**
   * Get all orders assigned to the current logged-in manufacturer
   */
  getManufacturerOrders(): Observable<ManufacturerOrder[]> {
    const userId = this.userService.getSessionUserId();
    console.log('Getting orders for user ID:', userId);
    
    // First, find the manufacturer associated with the current user
    return this.http.get<any[]>(`${environment.apiBaseUrl}/manufacturers?user_id=${userId}`).pipe(
      tap((manufacturers: any[]) => console.log('Manufacturers found for user:', manufacturers)),
      switchMap((manufacturers: any[]) => {
        if (!manufacturers || manufacturers.length === 0) {
          console.error('No manufacturer found for user:', userId);
          return of([]);
        }
        
        const manufacturerId = manufacturers[0].id;
        console.log(`Found manufacturer ID ${manufacturerId} for user ${userId}`);
        
        // Get fulfillments for this manufacturer
        return this.fulfillmentService.getFulfillmentsByManufacturer(manufacturerId).pipe(
          tap((fulfillments: Fulfillment[]) => console.log(`Found ${fulfillments.length} fulfillments for manufacturer ${manufacturerId}:`, fulfillments)),
          switchMap((fulfillments: Fulfillment[]) => {
            if (fulfillments.length === 0) {
              return of([]);
            }
            
            // Create an Observable for each fulfillment that will emit a ManufacturerOrder
            const orderObservables = fulfillments.map(fulfillment => 
              this.getManufacturerOrderFromFulfillment(fulfillment)
            );
            
            // Combine all observables into one that emits an array of manufacturer orders
            return forkJoin(orderObservables).pipe(
              map(orders => orders.filter(order => !!order.id)), // Filter out any empty/invalid orders
              tap(filteredOrders => console.log(`Processed ${filteredOrders.length} valid orders from ${fulfillments.length} fulfillments`))
            );
          })
        );
      }),
      catchError(error => {
        console.error('Error getting manufacturer orders:', error);
        return of([]);
      })
    );
  }
  
  /**
   * Helper method to convert a fulfillment to a manufacturer order
   */
  private getManufacturerOrderFromFulfillment(fulfillment: Fulfillment): Observable<ManufacturerOrder> {
    return this.orderService.getOrderById(fulfillment.order_id).pipe(
      switchMap(order => {
        if (!order) {
          // Skip this order if not found
          return of({} as ManufacturerOrder);
        }
        
        // Get customer information
        return this.userService.getUserWithProfile(order.user_id).pipe(
          map(customer => {
            const manufacturerOrder: ManufacturerOrder = {
              id: fulfillment.id,
              orderId: order.id,
              status: fulfillment.status,
              receivedDate: fulfillment.received_date,
              shippedDate: fulfillment.shipped_date,
              customerName: `${customer?.profile?.first_name || ''} ${customer?.profile?.last_name || ''}`,
              customerAddress: order.shipping_address ? 
                `${order.shipping_address.address}, ${order.shipping_address.city}, ${order.shipping_address.state}` : '',
              items: order.items.map(item => ({
                id: item.id,
                projectId: item.project_id,
                projectName: '', // This would be fetched from project service
                previewImageUrl: '', // This would be fetched from project service
                quantity: item.quantity,
                unitPrice: item.unit_price
              })),
              totalAmount: order.total_amount
            };
            
            return manufacturerOrder;
          })
        );
      }),
      catchError(error => {
        console.error('Error processing order:', error);
        return of({} as ManufacturerOrder); // Return empty object that matches the type
      })
    );
  }
  
  /**
   * Update the status of a fulfillment
   */
  updateFulfillmentStatus(fulfillmentId: string, newStatus: string): Observable<Fulfillment> {
    // First get the current fulfillment
    return this.fulfillmentService.getFulfillmentById(fulfillmentId).pipe(
      switchMap(fulfillment => {
        if (!fulfillment) {
          console.error('Fulfillment not found:', fulfillmentId);
          throw new Error('Fulfillment not found');
        }
        
        // Update the status
        fulfillment.status = newStatus;
        
        // If status is "shipped", set the shipped date
        if (newStatus === 'shipped' && !fulfillment.shipped_date) {
          fulfillment.shipped_date = new Date().toISOString();
        }
        
        // Save the updated fulfillment
        return this.fulfillmentService.updateFulfillment(fulfillmentId, fulfillment);
      }),
      catchError(error => {
        console.error('Error updating fulfillment status:', error);
        throw error; // Re-throw the error to be handled by the component
      })
    );
  }
}
