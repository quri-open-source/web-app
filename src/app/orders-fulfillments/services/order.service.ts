import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface OrderResponse {
  id: string;
  user_id: string;
  created_at: string;
  status: string;
  total_amount: number;
  transaction_id: string | null;
  description: string;
  shipping_address: {
    address: string;
    city: string;
    country: string;
    state: string;
    zip: string;
  };
  applied_discounts: {
    id: string;
  }[];
  items: {
    id: string;
    project_id: string;
    quantity: number;
    unit_price: number;
  }[];
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = `${environment.apiBaseUrl}/orders`;

  constructor(private http: HttpClient) {}

  getOrdersByUser(userId: string): Observable<OrderResponse[]> {
    // Returns only the orders belonging to the given user
    return this.http.get<OrderResponse[]>(`${this.apiUrl}?user_id=${userId}`);
  }
  
  getOrderById(orderId: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiUrl}/${orderId}`);
  }
  
  createOrder(order: Partial<OrderResponse>): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.apiUrl, order);
  }
  
  updateOrderStatus(orderId: string, status: string): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(`${this.apiUrl}/${orderId}`, { status });
  }
  
  // This method would be used when placing an order
  placeOrder(order: Partial<OrderResponse>): Observable<OrderResponse> {
    // Set default values for a new order
    const newOrder = {
      ...order,
      created_at: new Date().toISOString(),
      status: 'pending'
    };
    
    return this.createOrder(newOrder);
  }
}

